// pages/activities/[id].tsx
import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useActivitiesLive } from "@/hooks/useActivitiesLive";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Inscripción a Actividad
import { useAuth } from "@/stores/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEnrollment } from "@/hooks/useEnrollment";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";



import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    MapPin,
    Sparkles,
    User,
    Heart,
    ChevronRight,
    Coffee,
    Leaf,
} from "lucide-react";

/* ---------- tipos del detalle ---------- */
type ActivityDb = {
    id: string;
    title: string;
    description: string | null;
    start_at: string | null;
    end_at: string | null;
    capacity: number | null;
    price: number | null;
    is_published: boolean | null;
    category: string | null;
    location: string | null;
    hero_image: string | null;
    gallery: any | null; // jsonb
    featured: boolean | null;
};

type UiActivity = {
    id: string;
    title: string;
    description: string;
    image?: string | null;
    images?: string[];
    category: string | null;
    price: number | null;
    featured: boolean;
    schedule: { day: string; time: string };
    location: string | null;
    enrolled: number;
    capacity: number;
};

function toDayTime(iso?: string | null) {
    if (!iso) return { day: "", time: "" };

    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { day: "", time: "" };

    // Día de la semana en es-AR
    const weekday = d.toLocaleDateString("es-AR", { weekday: "long" }) || "";
    const prettyWeekday = weekday
        ? weekday.charAt(0).toUpperCase() + weekday.slice(1)
        : "";

    // dd/mm
    const dayNum = String(d.getDate()).padStart(2, "0");
    const monthNum = String(d.getMonth() + 1).padStart(2, "0");

    const dayWithDate = `${prettyWeekday} ${dayNum}/${monthNum}`; // Ej: "Jueves 27/12"

    const time = new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);

    return { day: dayWithDate, time };
}


function mapDbToUi(row: ActivityDb, enrolled = 0): UiActivity {
    const galleryArr: string[] = Array.isArray(row.gallery)
        ? row.gallery.filter(Boolean)
        : row.gallery
            ? [String(row.gallery)]
            : [];
    const hero = row.hero_image || galleryArr[0] || null;
    const images = hero ? [hero, ...galleryArr.filter((u) => u !== hero)] : galleryArr;
    const { day, time } = toDayTime(row.start_at);

    return {
        id: row.id,
        title: row.title,
        description: row.description ?? "",
        image: hero,
        images,
        category: row.category,
        price: row.price ?? null,
        featured: Boolean(row.featured),
        schedule: { day, time },
        location: row.location,
        enrolled,
        capacity: row.capacity ?? 0,
    };
}

/* ---------- hook: cargar y escuchar un detalle ---------- */
function useActivityDetail(activityId?: string) {
    const [activity, setActivity] = React.useState<UiActivity | null>(null);
    const [loading, setLoading] = React.useState(true);

    const fetchCount = React.useCallback(async (aid: string) => {
        const { data, error } = await supabase.rpc("activity_enrollment_count", {
            p_activity_id: aid,
        });
        if (error) {
            console.error("count error", error);
            return 0;
        }
        return Number(data ?? 0);
    }, []);


    const load = React.useCallback(async () => {
        if (!activityId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from("activities")
            .select(
                "id,title,description,start_at,end_at,capacity,price,is_published,category,location,hero_image,gallery,featured"
            )
            .eq("id", activityId)
            .maybeSingle();

        if (!data || error) {
            setActivity(null);
            setLoading(false);
            return;
        }
        const enrolled = await fetchCount(data.id);
        setActivity(mapDbToUi(data as ActivityDb, enrolled));
        setLoading(false);
    }, [activityId, fetchCount]);

    React.useEffect(() => {
        if (!activityId) return;
        load();

        // realtime detalle + conteo
        const ch = supabase
            .channel(`rt-activity-${activityId}`)
            .on(
                "postgres_changes",
                { schema: "public", table: "activities", event: "UPDATE", filter: `id=eq.${activityId}` },
                async (p) => {
                    const row = p.new as ActivityDb;
                    const enrolled = await fetchCount(row.id);
                    setActivity(mapDbToUi(row, enrolled));
                }
            )
            .on(
                "postgres_changes",
                { schema: "public", table: "activities", event: "DELETE", filter: `id=eq.${activityId}` },
                () => setActivity(null)
            )
            .on(
                "postgres_changes",
                { schema: "public", table: "registrations", event: "*", filter: `activity_id=eq.${activityId}` },
                async () => {
                    const n = await fetchCount(activityId);
                    setActivity((prev) => (prev ? { ...prev, enrolled: n } : prev));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(ch);
        };
    }, [activityId, load, fetchCount]);

    return { activity, loading, setActivity };
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}




/* ======================= PAGE ======================= */
export default function ActivityDetailPage() {
    const router = useRouter();
    const rid = router.query.id;
    const activityId = Array.isArray(rid) ? rid[0] : rid;

    const { activity, loading, setActivity } = useActivityDetail(
        typeof activityId === "string" ? activityId : undefined
    );

    const { activities: related } = useActivitiesLive();

    const { user } = useAuth();
    const { toast } = useToast();
    const { enrolled, loading: loadingEnrollment, setEnrolled } = useEnrollment(
        typeof activityId === "string" ? activityId : undefined
    );


    const [isEnrolling, setIsEnrolling] = React.useState(false);
    const [activeIdx, setActiveIdx] = React.useState(0);

    const handleEnroll = async () => {
        if (!activity || typeof activityId !== "string") return;

        if (!user) {
            toast({ title: "Inicia sesión", description: "Debes iniciar sesión para inscribirte.", variant: "destructive" });
            return;
        }

        try {
            setIsEnrolling(true);
            const { error } = await supabase.rpc("enroll_activity", { p_activity_id: activityId });
            if (error) {
                console.error("enroll_activity error", { message: error.message, details: error.details, hint: error.hint, code: error.code });
                throw error;
            }

            setEnrolled(true);
            setActivity((prev) => prev ? { ...prev, enrolled: Math.min((prev.enrolled ?? 0) + 1, prev.capacity ?? Infinity) } : prev);


            toast({ title: "¡Inscripción confirmada!", description: "Te inscribiste correctamente a la actividad." });
        } catch (e: any) {
            const msg = String(e?.message || e);
            let friendly = "No pudimos completar la inscripción.";
            if (msg.includes("no_seats_available")) friendly = "No hay cupos disponibles.";
            if (msg.includes("not_authenticated")) friendly = "Debes iniciar sesión.";
            toast({ title: "Ups", description: friendly, variant: "destructive" });
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleCancel = async () => {
        if (!activity || typeof activityId !== "string") return;

        if (!user) {
            toast({ title: "Inicia sesión", description: "Debes iniciar sesión para cancelar.", variant: "destructive" });
            return;
        }

        try {
            setIsEnrolling(true);
            const { error } = await supabase.rpc("cancel_activity", { p_activity_id: activityId });
            if (error) {
                console.error("cancel_activity error", { message: error.message, details: error.details, hint: error.hint, code: error.code });
                throw error;
            }

            setEnrolled(false);
            setActivity((prev) => prev ? { ...prev, enrolled: Math.max((prev.enrolled ?? 0) - 1, 0) } : prev);

            toast({ title: "Inscripción cancelada", description: "Se canceló tu inscripción correctamente." });
        } catch (e) {
            toast({ title: "Ups", description: "No pudimos cancelar la inscripción.", variant: "destructive" });
        } finally {
            setIsEnrolling(false);
        }
    };

    const suggestions = React.useMemo(() => {
        if (!activity) return [];                        // ⬅️ si no hay actividad, nada
        const safeRelated = (related ?? []).filter(Boolean) as UiActivity[];

        // excluimos la actual
        const pool = safeRelated.filter(a => a && a.id !== activity.id);

        // priorizamos misma categoría si existe
        const sameCat = activity.category
            ? pool.filter(a => a.category === activity.category)
            : pool;

        // si faltan, completamos con otras sin duplicar
        const base = sameCat.length >= 10
            ? sameCat
            : [...sameCat, ...pool.filter(a => !sameCat.includes(a))];

        return shuffle(base).slice(0, 4);
    }, [related, activity]);



    if (loading) {
        return (
            <section>
                <div className="min-h-[60vh] grid place-items-center">
                    <div className="animate-pulse text-boa-green">
                        <Heart className="h-12 w-12" />
                    </div>

                </div>
            </section>
        );
    }

    if (!activity) {
        return (
            <section>
                <div className="min-h-[60vh] grid place-items-center text-center">
                    <h1 className="text-2xl font-bold text-boa-ink mb-4">Actividad no encontrada</h1>
                    <Button onClick={() => router.push("/activities")}>Volver a actividades</Button>
                </div>
            </section>
        );
    }

    const hasCapacity = (activity.capacity ?? 0) > 0;
    const isFullyBooked = hasCapacity ? activity.enrolled >= activity.capacity : false;
    const spotsRemaining = hasCapacity ? Math.max(0, activity.capacity - activity.enrolled) : 0;
    const progress = hasCapacity
        ? Math.min(100, (activity.enrolled / Math.max(1, activity.capacity)) * 100)
        : 0;

    const gallery: string[] = activity.images?.length
        ? activity.images
        : activity.image
            ? [activity.image]
            : [];

    return (
        <section className="relative min-h-dvh">
            {/* BG crema */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "#FFFCF7",
                        backgroundImage: `
        radial-gradient(70% 50% at 8% 12%, rgba(206,234,218,.20), transparent 55%),
        radial-gradient(55% 45% at 92% 10%, rgba(255,214,182,.18), transparent 60%),
        radial-gradient(65% 55% at 50% 100%, rgba(186,220,205,.14), transparent 60%)
      `,
                    }}
                />
                <div
                    aria-hidden
                    className="absolute h-full inset-0 opacity-[0.05]"
                    style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                />
            </div>

            {/* Back */}
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <Button variant="ghost" onClick={() => router.push("/activities")} className="hover:bg-boa-green/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>

            {/* HERO */}
            <section className="pb-14 pt-8">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-10 items-start">
                        {/* Galería */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="relative rounded-[28px] overflow-hidden ring-1 ring-[#EEDCC9] bg-white shadow-[0_18px_56px_rgba(82,47,0,.10)]"
                        >
                            <div className="relative h-[440px]">
                                {gallery[activeIdx] && (
                                    <img
                                        src={gallery[activeIdx]}
                                        alt={activity.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                                <div className="hidden sm:block absolute -right-6 -bottom-8 w-40 rotate-6">
                                    <div className="bg-white p-2 shadow-xl rounded-sm">
                                        <img
                                            src={gallery[(activeIdx + 1) % Math.max(1, gallery.length)] || activity.image || ""}
                                            alt=""
                                            className="h-28 w-full object-cover"
                                        />
                                        <div className="h-8 bg-white" />
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    {activity.category && (
                                        <span className="rounded-full px-3 py-1 text-[11px] font-semibold bg-white/85 text-boa-ink/85 ring-1 ring-white/70 backdrop-blur">
                                            {activity.category}
                                        </span>
                                    )}
                                    {activity.featured && (
                                        <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white bg-boa-green shadow-md flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" /> Destacada
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="p-3 border-t border-[#EEDCC9] bg-white/90">
                                <div className="flex gap-3 overflow-x-auto">
                                    {gallery.map((src, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveIdx(i)}
                                            className={`relative h-20 w-28 shrink-0 rounded-lg overflow-hidden ring-1 transition ${i === activeIdx ? "ring-boa-green shadow-md" : "ring-[#EEDCC9] hover:ring-boa-green/50"
                                                }`}
                                            aria-label={`Imagen ${i + 1}`}
                                        >
                                            <img src={src} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Ticket */}
                        <div className="relative">
                            <div className="mb-5">
                                {activity.category && (
                                    <Badge className="mb-2 bg-boa-green/15 text-boa-green ring-1 ring-boa-green/30">
                                        {activity.category}
                                    </Badge>
                                )}
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-boa-ink tracking-tight">
                                    {activity.title}
                                </h1>
                                <div
                                    className="mt-3 h-[2px] w-40"
                                    style={{
                                        backgroundImage:
                                            "repeating-linear-gradient(90deg, rgba(30,122,102,.7) 0 8px, transparent 8px 16px)",
                                    }}
                                />
                                <p className="mt-3 text-boa-ink/75 text-lg leading-relaxed">{activity.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-boa-ink/80">
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-3 text-boa-green" />
                                    {activity.schedule.day}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 mr-3 text-boa-green" />
                                    {activity.schedule.time}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-3 text-boa-green" />
                                    {activity.location ?? "-"}
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-5 w-5 mr-3 text-boa-green" />
                                    {activity.enrolled}/{activity.capacity || 0} participantes
                                </div>
                            </div>

                            <div className="lg:sticky lg:top-24">
                                <Card className="border-0 rounded-3xl bg-[#FFFCF7] ring-1 ring-[#EEDCC9] shadow-[0_16px_48px_rgba(82,47,0,.12)] relative">
                                    <div
                                        className="absolute inset-y-4 -left-3 w-3 rounded-full"
                                        style={{
                                            background:
                                                "radial-gradient(circle at 1.5px 8px, #FFFCF7 2px, transparent 2.5px) left/3px 16px repeat-y",
                                        }}
                                    />
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-3xl font-extrabold text-boa-green leading-none">
                                                    {typeof activity.price === "number" ? `$${activity.price}` : "-"}
                                                </div>
                                                <div className="text-sm text-boa-ink/60 mt-1">Por clase</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-semibold ${isFullyBooked ? "text-red-600" : "text-boa-green"}`}>
                                                    {isFullyBooked ? "¡Completo!" : `${spotsRemaining} cupos disponibles`}
                                                </div>
                                                <div className="text-xs text-boa-ink/60">
                                                    {isFullyBooked ? "Podés sumarte a la lista de espera" : "Reservá tu lugar"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Barra de ocupación */}
                                        <div className="mt-4">
                                            <div className="h-2 rounded-full bg-boa-ink/10 overflow-hidden">
                                                <div
                                                    className={`h-full ${isFullyBooked ? "bg-red-400" : "bg-boa-green/80"}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <div className="mt-1 text-[12px] text-boa-ink/60">
                                                {activity.enrolled} de {activity.capacity || 0} inscriptos
                                            </div>
                                        </div>

                                        {loadingEnrollment ? (
                                            <Button disabled className="mt-5 w-full rounded-full py-6">Cargando…</Button>
                                        ) : enrolled ? (
                                            <div className="mt-5 grid gap-2">
                                                <Button disabled className="w-full rounded-full py-6 bg-boa-ink/80 hover:bg-boa-ink/20">
                                                    Ya estás inscripto
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            disabled={isEnrolling}
                                                            className="
      w-full rounded-full py-6 border-2
      border-red-500 hover:text-red-500
      bg-red-500 text-white hover:bg-white
      disabled:opacity-50 disabled:pointer-events-none
    "
                                                        >
                                                            {isEnrolling ? "Cancelando…" : "Cancelar inscripción"}
                                                        </Button>
                                                    </AlertDialogTrigger>


                                                    <AlertDialogContent className="rounded-2xl border-0">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-xl text-boa-ink">¿Cancelar tu inscripción?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-boa-ink/70">
                                                                Perderás tu lugar en esta actividad. Podés volver a inscribirte si quedan cupos.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>

                                                        <AlertDialogFooter className="gap-3 sm:gap-2">
                                                            {/* Botón Cancelar (cierra el diálogo) */}
                                                            <AlertDialogCancel
                                                                className="rounded-full px-6 py-3 border-2"
                                                                style={{ borderColor: "#E84D4D", color: "#E84D4D", background: "transparent" }}
                                                            >
                                                                No, mantener
                                                            </AlertDialogCancel>

                                                            {/* Botón Aceptar (ejecuta el handler) */}
                                                            <AlertDialogAction
                                                                onClick={handleCancel}
                                                                className="rounded-full px-6 py-3 border-2 bg-transparent"
                                                                style={{ borderColor: "#1E7A66", color: "#1E7A66" }}
                                                            >
                                                                Sí, cancelar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={handleEnroll}
                                                disabled={isEnrolling || isFullyBooked}
                                                className={`mt-5 w-full rounded-full py-6 text-base font-semibold transition ${isFullyBooked
                                                    ? "bg-boa-ink/30 hover:bg-boa-ink/30 cursor-not-allowed"
                                                    : "bg-boa-green hover:bg-boa-green/90 shadow-[0_12px_28px_rgba(30,122,102,.35)]"
                                                    }`}
                                            >
                                                {isEnrolling ? (
                                                    <span className="inline-flex items-center">
                                                        <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Procesando…
                                                    </span>
                                                ) : isFullyBooked ? (
                                                    "Sin cupos"
                                                ) : (
                                                    <>Inscribirme ahora <ChevronRight className="ml-1 h-4 w-4" /></>
                                                )}
                                            </Button>
                                        )}

                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lo que vas a vivir */}
            <section className="pb-6">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Feature
                            icon={<Leaf className="h-5 w-5" />}
                            title="Clima cuidado"
                            text="Grupos reducidos, música suave y luz cálida. Todo para que te sientas en casa."
                        />
                        <Feature
                            icon={<Coffee className="h-5 w-5" />}
                            title="Ritual BOA"
                            text="Infusión o café de autor post-clase para compartir y charlar con la comunidad."
                        />
                        <Feature
                            icon={<Heart className="h-5 w-5" />}
                            title="Acompañamiento"
                            text="Profe cerca tuyo, correcciones amables y opciones para todos los niveles."
                        />
                    </div>
                </div>
            </section>

            {/* Relacionadas */}
            <section className="py-12">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-extrabold text-boa-ink">Te pueden gustar</h2>
                    <div className="mt-5 flex gap-6 overflow-x-auto pb-2">
                        {(suggestions || []).map((a) => (
                            <article
                                key={a.id}
                                className="min-w-[280px] max-w-[280px] rounded-2xl ring-inset overflow-hidden ring-1 ring-[#EEDCC9] bg-white shadow-[0_10px_28px_rgba(82,47,0,.10)] cursor-pointer"
                                onClick={() => router.push(`/activities/${a.id}`)}
                            >
                                <div className="relative h-40">
                                    <img
                                        src={a.images?.[0] ?? (a as any).image ?? ""}
                                        alt={a.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    {a.category && (
                                        <div className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-white/85 text-boa-ink/85 ring-1 ring-white/70">
                                            {a.category}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-boa-ink">{a.title}</h3>
                                    <p className="text-sm text-boa-ink/70 line-clamp-2 mt-1">{a.description}</p>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="font-bold text-boa-green">
                                            {typeof a.price === "number" ? `$${a.price}` : "-"}
                                        </span>
                                        <Button size="sm" className="rounded-full bg-boa-green hover:bg-green-900">Ver detalles</Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>


        </section>
    );
}



/* ---------- UI bits ---------- */
function Feature({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl bg-white ring-1 ring-[#EEDCC9] p-5 shadow-[0_10px_28px_rgba(82,47,0,.08)]">
            <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-boa-green/15 text-boa-green ring-1 ring-boa-green/30">
                {icon}
            </div>
            <h3 className="mt-3 font-semibold text-boa-ink">{title}</h3>
            <p className="text-sm text-boa-ink/70 mt-1">{text}</p>
        </div>
    );
}
