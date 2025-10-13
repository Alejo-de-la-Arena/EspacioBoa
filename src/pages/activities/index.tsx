// pages/activities/index.tsx
import Head from "next/head";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

import Activities from "@/components/Activities";
import ActivitiesCalendar from "@/components/ActivitiesCalendar";
import { useActivitiesLive } from "@/hooks/useActivitiesLive";

import * as React from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import type { Activity } from "@/types";
import { useMemo } from "react";


function slugify(s: string) {
    return s
        .normalize("NFD").replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

// Deriva day/time desde start_at si falta schedule
function deriveScheduleFromStart(startISO?: string) {
    if (!startISO) return { day: "—", time: "—" };
    const d = new Date(startISO);
    const day = d.toLocaleDateString("es-AR", { weekday: "long" }) || "—";
    const prettyDay = day.charAt(0).toUpperCase() + day.slice(1);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return { day: prettyDay, time: `${hh}:${mm}` };
}

// Acepta cualquier "UiActivity" y devuelve un Activity bien formado
function normalizeActivity(ui: any): Activity {
    // Admite snake_case o camelCase
    const start_at: string | undefined =
        ui.start_at ?? ui.startAt ?? ui.start ?? undefined;
    const end_at: string | undefined =
        ui.end_at ?? ui.endAt ?? ui.end ?? undefined;

    // imágenes
    const gallery: string[] = Array.isArray(ui.gallery) ? ui.gallery : [];
    const images: string[] =
        Array.isArray(ui.images) ? ui.images
            : ui.hero_image ? [ui.hero_image]
                : ui.image ? [ui.image]
                    : [];

    // schedule (si no viene, lo derivamos del start_at)
    const schedule = ui.schedule ?? deriveScheduleFromStart(start_at);

    return {
        id: ui.id,
        slug: ui.slug ?? undefined,
        title: ui.title ?? "",
        description: ui.description ?? "",
        images,
        image: ui.image ?? ui.hero_image ?? images[0],
        category: ui.category ?? "General",
        price: typeof ui.price === "number" ? ui.price : undefined,
        featured: !!ui.featured,

        schedule,
        location: ui.location ?? "Espacio BOA",
        enrolled: typeof ui.enrolled === "number" ? ui.enrolled : 0,
        capacity: typeof ui.capacity === "number" ? ui.capacity : 0,
        instructor: ui.instructor, // opcional

        // MUY IMPORTANTE para el calendario
        start_at,
        end_at,

        is_published: ui.is_published ?? undefined,
        hero_image: ui.hero_image ?? undefined,
        gallery,
    };
}



export default function ActivitiesPage() {
    const { activities: rawActivities = [], loading } = useActivitiesLive();

    const activities: Activity[] = useMemo(
        () => rawActivities.map(normalizeActivity),
        [rawActivities]
    );

    return (
        <>
            <Head><title>Actividades | BOA</title></Head>

            {loading ? (
                <section>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="animate-pulse text-emerald-600">
                            <Heart className="h-12 w-12" />
                        </div>
                    </div>
                </section>
            ) : (
                <section>
                    {/* Hero (NO TOCAR) */}
                    <section
                        className="relative min-h-[100vh] pt-28 pb-16 font-sans overflow-hidden grid place-items-center"
                        onMouseMove={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            const r = el.getBoundingClientRect();
                            el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                            el.style.setProperty("--my", `${e.clientY - r.top}px`);
                        }}
                    >
                        <div className="absolute inset-0 -z-10">
                            <motion.div
                                className="absolute inset-0"
                                initial={{ scale: 1.06, y: 8, opacity: 0.98 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                style={{
                                    backgroundImage:
                                        "url('https://res.cloudinary.com/dasch1s5i/image/upload/v1756773473/Gemini_Generated_Image_fldn88fldn88fldn_ztewxy.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    filter: "saturate(0.96) brightness(1) contrast(1.04)",
                                }}
                            />
                            <div className="absolute inset-0 bg-[#FBF7EC]/60 mix-blend-multiply" />
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background:
                                        "radial-gradient(220px 160px at var(--mx,50%) var(--my,50%), rgba(30,122,102,.10), transparent 60%)",
                                }}
                            />
                            <div
                                aria-hidden
                                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                                style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                            />
                        </div>

                        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative isolate max-w-3xl mx-auto text-center">
                                <div className="relative z-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true, amount: 0.6 }}
                                        transition={{ type: "spring", stiffness: 110, damping: 14 }}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                     bg-boa-green/25 backdrop-blur-md ring-1 ring-boa-green/40 text-boa-green-foreground"
                                    >
                                        <Sparkles className="h-4 w-4 text-boa-green" />
                                        <span className="text-[12px] font-semibold tracking-wide text-boa-green">
                                            Cuerpo • Mente • Comunidad
                                        </span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 14, scale: 0.98, letterSpacing: "0.04em" }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1, letterSpacing: "0em" }}
                                        viewport={{ once: true, amount: 0.7 }}
                                        transition={{ type: "spring", stiffness: 120, damping: 16 }}
                                        className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900"
                                    >
                                        Actividades que te <span className="text-boa-green">hacen bien</span>
                                    </motion.h1>

                                    <svg className="mt-3 mx-auto w-56 h-4 relative z-20" viewBox="0 0 220 18" fill="none" aria-hidden="true">
                                        <motion.path
                                            d="M6 10C55 15 125 15 214 8"
                                            stroke="hsl(var(--boa-green))"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 1, opacity: 1 }}
                                            whileInView={{ pathLength: 1, opacity: 1 }}
                                            viewport={{ once: true, amount: 1 }}
                                            transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
                                        />
                                    </svg>

                                    <motion.p
                                        initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
                                        className="mt-2 text-base sm:text-lg leading-relaxed relative z-20 text-neutral-800"
                                    >
                                        Movimiento, arte y bienestar en un mismo lugar. Descubrí tu próxima clase y reservá en segundos.
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* lista pública */}
                    <Activities activities={activities} />
                    <ActivitiesCalendar activities={activities} />
                </section>
            )}
        </>
    );
}

/* ===================== ADMIN PANEL (sin cambios de lógica) ===================== */

// function ActivitiesAdminPanel() {
//     const { user } = useAuth();
//     const { toast } = useToast();
//     const router = useRouter();

//     const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
//     const [open, setOpen] = React.useState<boolean>(false);
//     const [manage, setManage] = React.useState<boolean>(false);
//     const [busy, setBusy] = React.useState<boolean>(false);

//     // form
//     const [editingId, setEditingId] = React.useState<string | null>(null);
//     const [title, setTitle] = React.useState("");
//     const [slug, setSlug] = React.useState("");
//     const [description, setDescription] = React.useState("");
//     const [startAt, setStartAt] = React.useState("");
//     const [endAt, setEndAt] = React.useState("");
//     const [capacity, setCapacity] = React.useState<number | undefined>(undefined);
//     const [price, setPrice] = React.useState<number | undefined>(undefined);
//     const [isPublished, setIsPublished] = React.useState<boolean>(false);
//     const [location, setLocation] = React.useState("");
//     const [category, setCategory] = React.useState("");
//     const [heroImage, setHeroImage] = React.useState("");
//     const [gallery, setGallery] = React.useState("");

//     React.useEffect(() => {
//         let ignore = false;

//         const bootstrap = async () => {
//             if (!user) return;
//             const { data } = await supabase
//                 .from("profiles")
//                 .select("is_admin")
//                 .eq("id", user.id)
//                 .maybeSingle();

//             if (!ignore) {
//                 const ok = Boolean(data?.is_admin);
//                 setIsAdmin(ok);
//             }
//         };

//         bootstrap();
//         return () => { ignore = true; };
//     }, [user]);

//     if (!isAdmin) return null;

//     const resetForm = () => {
//         setEditingId(null);
//         setTitle(""); setSlug("");
//         setDescription(""); setStartAt(""); setEndAt("");
//         setCapacity(undefined); setPrice(undefined);
//         setIsPublished(false);
//         setLocation(""); setCategory(""); setHeroImage("");
//         setGallery("");
//     };

//     const openCreate = () => {
//         resetForm();
//         setOpen(true);
//     };

//     const save = async () => {
//         setBusy(true);
//         const payload: any = {
//             title,
//             slug: slug || slugify(title),
//             description: description || null,
//             start_at: startAt ? new Date(startAt).toISOString() : null,
//             end_at: endAt ? new Date(endAt).toISOString() : null,
//             capacity: capacity ?? null,
//             price: price ?? null,
//             is_published: isPublished,
//             location: location || null,
//             category: category || null,
//             hero_image: heroImage || null,
//             gallery: gallery
//                 ? gallery.split(",").map(s => s.trim()).filter(Boolean)
//                 : [],
//             created_by: user?.id ?? null,
//         };

//         let error;
//         if (editingId) {
//             ({ error } = await supabase.from("activities").update(payload).eq("id", editingId));
//         } else {
//             ({ error } = await supabase.from("activities").insert(payload));
//         }

//         setBusy(false);

//         if (error) {
//             const msg = typeof error?.message === "string" ? error.message : "Error";
//             toast({ title: "No se pudo guardar", description: msg, variant: "destructive" });
//             return;
//         }

//         toast({ title: "Actividad guardada" });
//         setOpen(false);
//         // refrescar para que el hook y el calendario tomen las fechas nuevas
//         router.replace(router.asPath);
//     };

//     const removeOne = async (id: string) => {
//         if (!confirm("¿Eliminar esta actividad? Esta acción no puede deshacerse.")) return;
//         const { error } = await supabase.from("activities").delete().eq("id", id);
//         if (error) {
//             toast({ title: "No se pudo eliminar", description: (error as any).message, variant: "destructive" });
//             return;
//         }
//         toast({ title: "Actividad eliminada" });
//         router.replace(router.asPath);
//     };

//     return (
//         <>
//             {/* FABs admin */}
//             <div className="fixed bottom-5 right-5 z-[60] flex gap-2">
//                 <button
//                     onClick={() => setManage(true)}
//                     className="rounded-full bg-black/80 text-white px-4 py-2 text-sm shadow hover:bg-black"
//                     title="Gestionar actividades"
//                 >
//                     Gestionar
//                 </button>
//                 <button
//                     onClick={openCreate}
//                     className="rounded-full bg-emerald-600 text-white px-4 py-2 text-sm shadow hover:bg-emerald-700"
//                     title="Nueva actividad"
//                 >
//                     + Nueva
//                 </button>
//             </div>

//             {/* Modal Crear/Editar */}
//             {open && (
//                 <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4">
//                     <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
//                         {/* ... (tu mismo form, sin cambios) ... */}
//                         {/* Usa setOpen(false) para cerrar y save() para guardar */}
//                     </div>
//                 </div>
//             )}

//             {/* Modal gestionar/listar */}
//             {manage && (
//                 <div className="fixed inset-0 z-[65] grid place-items-center bg-black/60 p-4">
//                     <div className="w-full max-w-4xl rounded-2xl bg-white p-5 shadow-xl">
//                         <div className="flex items-center justify-between">
//                             <h3 className="text-lg font-semibold">Gestionar actividades</h3>
//                             <button className="text-sm text-neutral-500 hover:text-black" onClick={() => setManage(false)}>
//                                 Cerrar
//                             </button>
//                         </div>
//                         <AdminList onEdit={() => { /* podrías reusar tu openEdit si querés */ }} onRemove={removeOne} />
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// function AdminList({ onEdit, onRemove }: {
//     onEdit: (row: Activity) => void; onRemove: (id: string) => void;
// }) {
//     const [items, setItems] = React.useState<Activity[]>([]);
//     const { toast } = useToast();

//     const reload = React.useCallback(async () => {
//         const { data, error } = await supabase
//             .from("activities")
//             .select("*")
//             .order("start_at", { ascending: false })
//             .limit(200);

//         if (error) {
//             toast({ title: "No se pudo listar", variant: "destructive" });
//             return;
//         }

//         // Asegúrate de castear `gallery` a string[] si viene como jsonb
//         const rows = (data ?? []).map((r: any) => ({
//             ...r,
//             gallery: Array.isArray(r.gallery) ? r.gallery : [],
//         })) as Activity[];

//         setItems(rows);
//     }, [toast]);

//     React.useEffect(() => { reload(); }, [reload]);

//     return (
//         <div className="mt-4 overflow-auto max-h-[70vh]">
//             <table className="w-full text-sm">
//                 <thead className="text-left border-b">
//                     <tr>
//                         <th className="py-2 pr-3">Título</th>
//                         <th className="py-2 pr-3">Inicio</th>
//                         <th className="py-2 pr-3">Cupo</th>
//                         <th className="py-2 pr-3">Publicado</th>
//                         <th className="py-2 pr-3"></th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {items.map((r) => (
//                         <tr key={r.id} className="border-b last:border-0">
//                             <td className="py-2 pr-3">{r.title}</td>
//                             <td className="py-2 pr-3">{r.start_at ? new Date(r.start_at).toLocaleString("es-AR") : "-"}</td>
//                             <td className="py-2 pr-3">{r.capacity ?? "-"}</td>
//                             <td className="py-2 pr-3">{r.is_published ? "Sí" : "No"}</td>
//                             <td className="py-2 pr-3 flex gap-2">
//                                 <button className="px-3 py-1 rounded border" onClick={() => onEdit(r)}>Editar</button>
//                                 <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onRemove(r.id)}>Eliminar</button>
//                             </td>
//                         </tr>
//                     ))}
//                     {items.length === 0 && (
//                         <tr><td className="py-6 text-neutral-500" colSpan={5}>Sin actividades.</td></tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// }



