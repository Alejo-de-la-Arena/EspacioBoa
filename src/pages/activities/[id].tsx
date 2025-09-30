// pages/activities/[id].tsx
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    MapPin,
    Sparkles,
    Star,
    Phone,
    Mail,
    User,
    Heart,
    ChevronRight,
    Coffee,
    Leaf,
} from "lucide-react";


export default function ActivityDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const activityId = Array.isArray(id) ? id[0] : id;


    const { activities, loading } = useApp();
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);


    const activity = useMemo(
        () => activities.find((a) => a.id === activityId),
        [activities, activityId]
    );


    const handleEnroll = async () => {
        if (!activity) return;
        setIsEnrolling(true);
        await new Promise((r) => setTimeout(r, 1200));
        setIsEnrolling(false);
        alert("¡Inscripción exitosa! Te enviamos un email con la confirmación.");
    };


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
                    <h1 className="text-2xl font-bold text-boa-ink mb-4">
                        Actividad no encontrada
                    </h1>
                    <Button onClick={() => router.push("/activities")}>
                        Volver a actividades
                    </Button>
                </div>
            </section>
        );
    }


    const isFullyBooked = activity.enrolled >= activity.capacity;
    const spotsRemaining = Math.max(0, activity.capacity - activity.enrolled);
    const progress = Math.min(
        100,
        (activity.enrolled / Math.max(1, activity.capacity)) * 100
    );


    const gallery: string[] = activity.images?.length
        ? activity.images
        : (activity.image ? [activity.image] : []);


    const instructorSlug =
        activity.instructor &&
            (activity.instructor as any).slug
            ? (activity.instructor as any).slug
            : activity.instructor
                ? activity.instructor.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")
                : "instructor";


    return (
        <section>
            {/* BG crema (coherente, sin repetir “brush”) */}
            <div className="absolute inset-0 -z-10">
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
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                />
            </div>


            {/* Back */}
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <Button variant="ghost" onClick={() => router.back()} className="hover:bg-boa-green/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>


            {/* HERO: Galería + Ticket */}
            <section className="pb-14 pt-8">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-10 items-start">
                        {/* === Galería con “polaroid” acento === */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="relative rounded-[28px] overflow-hidden ring-1 ring-[#EEDCC9] bg-white shadow-[0_18px_56px_rgba(82,47,0,.10)]"
                        >
                            <div className="relative h-[440px]">
                                <img
                                    src={gallery[activeIdx]}
                                    alt={activity.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* degradé sutil para legibilidad */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                                {/* “Polaroid” decorativo (rotado) */}
                                <div className="hidden sm:block absolute -right-6 -bottom-8 w-40 rotate-6">
                                    <div className="bg-white p-2 shadow-xl rounded-sm">
                                        <img
                                            src={gallery[(activeIdx + 1) % gallery.length] || activity.image}
                                            alt=""
                                            className="h-28 w-full object-cover"
                                        />
                                        <div className="h-8 bg-white" />
                                    </div>
                                </div>
                                {/* Categ/featured */}
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold bg-white/85 text-boa-ink/85 ring-1 ring-white/70 backdrop-blur">
                                        {activity.category}
                                    </span>
                                    {activity.featured && (
                                        <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white bg-boa-green shadow-md flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" /> Destacada
                                        </span>
                                    )}
                                </div>
                            </div>


                            {/* thumbnails tipo filmstrip */}
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


                        {/* === Ticket de reserva (sticky) === */}
                        <div className="relative">
                            <div className="mb-5">
                                <Badge className="mb-2 bg-boa-green/15 text-boa-green ring-1 ring-boa-green/30">
                                    {activity.category}
                                </Badge>
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-boa-ink tracking-tight">
                                    {activity.title}
                                </h1>
                                {/* divisor “costura” (sin brush) */}
                                <div
                                    className="mt-3 h-[2px] w-40"
                                    style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(30,122,102,.7) 0 8px, transparent 8px 16px)" }}
                                />
                                <p className="mt-3 text-boa-ink/75 text-lg leading-relaxed">{activity.description}</p>
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-boa-ink/80">
                                <div className="flex items-center"><Calendar className="h-5 w-5 mr-3 text-boa-green" />{activity.schedule.day}</div>
                                <div className="flex items-center"><Clock className="h-5 w-5 mr-3 text-boa-green" />{activity.schedule.time}</div>
                                <div className="flex items-center"><MapPin className="h-5 w-5 mr-3 text-boa-green" />{activity.location}</div>
                                <div className="flex items-center"><Users className="h-5 w-5 mr-3 text-boa-green" />{activity.enrolled}/{activity.capacity} participantes</div>
                            </div>


                            <div className="lg:sticky lg:top-24">
                                <Card className="border-0 rounded-3xl bg-[#FFFCF7] ring-1 ring-[#EEDCC9] shadow-[0_16px_48px_rgba(82,47,0,.12)] relative">
                                    {/* “perforado” lateral del ticket */}
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
                                                    ${activity.price}
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
                                                {activity.enrolled} de {activity.capacity} inscriptos
                                            </div>
                                        </div>


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
                                                "Unirme a la lista de espera"
                                            ) : (
                                                <>
                                                    Inscribirme ahora
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Lo que vas a vivir (bullets icónicos) */}
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


            {/* Instructor — BOA “folded card” */}
            {activity.instructor && (
                <section className="py-14" aria-labelledby="instructor-title">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.article
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 220, damping: 20 }}
                            className="group relative overflow-hidden rounded-3xl border border-boa-green/20 ring-1 ring-boa-green/15 bg-white shadow-[0_12px_30px_rgba(0,0,0,.06)]"
                        >

                            {/* header con bruma verde */}
                            <div className="h-16" />


                            <Card className="border-0 items-center shadow-none">
                                <CardContent className="-mt-16 p-6 md:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr,auto] items-center gap-6 md:gap-8">


                                        {/* Avatar centrado y nítido */}
                                        <div className="relative mx-auto md:mx-0">
                                            <Avatar className="w-28 h-28 ring-4 ring-white rounded-full shadow-[0_10px_24px_rgba(0,0,0,.10)]">
                                                <AvatarImage
                                                    src={activity.instructor.image}
                                                    alt={activity.instructor.name}
                                                    className="object-cover object-center"
                                                />
                                                <AvatarFallback className="bg-boa-green/10">
                                                    <User className="h-10 w-10 text-boa-ink/60" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>


                                        {/* Texto principal */}
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 id="instructor-title" className="text-2xl md:text-3xl font-extrabold text-boa-ink">
                                                    {activity.instructor.name}
                                                </h3>


                                                {!!activity.instructor.experience && (
                                                    <span className="inline-flex items-center text-boa-ink text-sm font-semibold">
                                                        <Star className="h-4 w-4 mr-1 text-boa-green" />
                                                        {activity.instructor.experience} años
                                                    </span>
                                                )}


                                                {!!activity.instructor.specialty && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium
                                    bg-boa-green/10 text-boa-ink ring-1 ring-boa-green/25 backdrop-blur-sm">
                                                        {activity.instructor.specialty}
                                                    </span>
                                                )}
                                            </div>


                                            {/* quote breve */}
                                            {!!activity.instructor.bio && (
                                                <p className="mt-3 italic text-boa-ink/70">
                                                    “{activity.instructor.bio.slice(0, 160)}…”
                                                </p>
                                            )}



                                        </div>



                                    </div>
                                </CardContent>
                            </Card>


                            {/* Hover sutil: realce del borde y elevación */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 group-hover:ring-boa-green/25 transition-all duration-300" />
                        </motion.article>
                    </div>
                </section>
            )}






            {/* Relacionadas — carrusel horizontal para romper la repetición */}
            <section className="py-12">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-extrabold text-boa-ink">Te pueden gustar</h2>
                    <div className="mt-5 flex gap-6 overflow-x-auto pb-2">
                        {activities
                            .filter((a) => a.id !== activity.id && a.category === activity.category)
                            .slice(0, 10)
                            .map((a) => (
                                <article
                                    key={a.id}
                                    className="min-w-[280px] max-w-[280px] rounded-2xl overflow-hidden ring-1 ring-[#EEDCC9] bg-white shadow-[0_10px_28px_rgba(82,47,0,.10)] cursor-pointer"
                                    onClick={() => router.push(`/activities/${a.id}`)}
                                >
                                    <div className="relative h-40">
                                        <img src={a.images?.[0] ?? a.image} alt={a.title} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-white/85 text-boa-ink/85 ring-1 ring-white/70">
                                            {a.category}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-boa-ink">{a.title}</h3>
                                        <p className="text-sm text-boa-ink/70 line-clamp-2 mt-1">{a.description}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="font-bold text-boa-green">${a.price}</span>
                                            <Button size="sm" className="rounded-full">
                                                Ver detalles
                                            </Button>
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


/* ---- UI bits ---- */


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



