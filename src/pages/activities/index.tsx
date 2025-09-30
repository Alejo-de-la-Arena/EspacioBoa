// pages/activities/index.tsx
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import Activities from "@/components/Activities";
import ActivitiesCalendar from "@/components/ActivitiesCalendar";
import { useActivitiesLive } from "@/hooks/useActivitiesLive";


/** ====== imports para admin ====== */
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";   // ✅ Pages Router


type Activity = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    start_at: string;
    end_at: string | null;
    capacity: number | null;
    price: number | null;
    is_published: boolean | null;
    category: string | null;
    location: string | null;
    hero_image: string | null;
    gallery: any | null;
    featured: boolean | null;
};

function slugify(s: string) {
    return s
        .normalize("NFD").replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default function ActivitiesPage() {
    const { activities, loading } = useActivitiesLive();

    if (loading) {
        return (
            <section>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Heart className="h-12 w-12" />
                    </div>
                </div>
            </section>
        );
    }

    return (
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

                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.7 }}
                                transition={{ duration: 0.5 }}
                                className="mt-6 flex items-center justify-center gap-3 text-boa-green/70"
                            >
                                <span className="h-px w-12 bg-boa-green/40" />
                                <Heart className="h-4 w-4" />
                                <span className="h-px w-12 bg-boa-green/40" />
                            </motion.div>

                            <motion.ul
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ staggerChildren: 0.06 }}
                                className="mt-4 flex flex-wrap justify-center gap-2"
                            >
                                {["Yoga", "Aeroyoga", "Astrología", "Tarot", "Arte"].map((label) => (
                                    <motion.li
                                        key={label}
                                        initial={{ opacity: 0, y: 10, rotate: -2, scale: 0.98 }}
                                        whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                                        viewport={{ once: true, amount: 0.6 }}
                                        transition={{ type: "spring", stiffness: 160, damping: 14 }}
                                        className="px-3 py-1 rounded-xl text-[11px] uppercase tracking-[0.14em] font-semibold
                         text-white bg-boa-green/25 backdrop-blur ring-1 ring-boa-green/40"
                                    >
                                        {label}
                                    </motion.li>
                                ))}
                            </motion.ul>

                            <motion.a
                                href="#filtros"
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.7 }}
                                transition={{ delay: 0.05 }}
                                className="group mt-10 inline-flex"
                            >
                                <button
                                    className="inline-flex items-center gap-2 rounded-full h-11 px-6 sm:h-12 sm:px-8
                       text-sm font-semibold bg-boa-green text-white
                       shadow-md hover:shadow-lg ring-1 ring-boa-green/30 hover:ring-boa-green/40
                       transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-boa-green focus-visible:ring-offset-2"
                                >
                                    Explorar Actividades
                                    <span
                                        className="inline-block h-2.5 w-2.5 border-b-2 border-r-2 border-current rotate-[-45deg]
                         translate-x-0 group-hover:translate-x-[3px] transition-transform"
                                        aria-hidden
                                    />
                                </button>
                            </motion.a>
                        </div>
                    </div>
                </div>
            </section>

            {/* lista pública */}
            <Activities activities={activities as any} />
            <ActivitiesCalendar activities={activities as any} />

            {/* ===== Panel ADMIN flotante (solo admin) ===== */}
            <ActivitiesAdminPanel />
        </section>
    );
}

/* ===================== ADMIN PANEL ===================== */

function ActivitiesAdminPanel() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);     // modal crear/editar
    const [manage, setManage] = React.useState<boolean>(false); // modal listado
    const [rows, setRows] = React.useState<Activity[]>([]);
    const [busy, setBusy] = React.useState<boolean>(false);

    // form
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startAt, setStartAt] = React.useState("");
    const [endAt, setEndAt] = React.useState("");
    const [capacity, setCapacity] = React.useState<number | undefined>(undefined);
    const [price, setPrice] = React.useState<number | undefined>(undefined);
    const [isPublished, setIsPublished] = React.useState<boolean>(false);
    const [location, setLocation] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [heroImage, setHeroImage] = React.useState("");
    const [gallery, setGallery] = React.useState(""); // csv de urls

    React.useEffect(() => {
        let ignore = false;

        const bootstrap = async () => {
            if (!user) return;
            // chequear admin desde profiles
            const { data } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .maybeSingle();

            if (!ignore) {
                const ok = Boolean(data?.is_admin);
                setIsAdmin(ok);
                if (ok) refreshList();
            }
        };

        const refreshList = async () => {
            const { data, error } = await supabase
                .from("activities")
                .select("*")
                .order("start_at", { ascending: false })
                .limit(100);

            if (error) {
                toast({ title: "No pude listar actividades", variant: "destructive" });
            } else {
                setRows((data ?? []) as Activity[]);
            }
        };

        bootstrap();

        return () => {
            ignore = true;
        };
    }, [user, toast]);

    if (!isAdmin) return null;

    const resetForm = () => {
        setEditingId(null);
        setTitle(""); setSlug("");
        setDescription(""); setStartAt(""); setEndAt("");
        setCapacity(undefined); setPrice(undefined);
        setIsPublished(false);
        setLocation(""); setCategory(""); setHeroImage("");
        setGallery("");
    };

    const openCreate = () => {
        resetForm();
        setOpen(true);
    };

    const openEdit = (row: Activity) => {
        setEditingId(row.id);
        setTitle(row.title || "");
        setSlug(row.slug || "");
        setDescription(row.description || "");
        setStartAt(row.start_at ? row.start_at.slice(0, 16) : "");
        setEndAt(row.end_at ? row.end_at.slice(0, 16) : "");
        setCapacity(row.capacity ?? undefined);
        setPrice(row.price ?? undefined);
        setIsPublished(Boolean(row.is_published));
        setLocation(row.location || "");
        setCategory(row.category || "");
        setHeroImage(row.hero_image || "");
        setGallery(Array.isArray(row.gallery) ? row.gallery.join(", ") : (row.gallery ?? ""));
        setOpen(true);
    };

    const save = async () => {
        setBusy(true);

        const payload: any = {
            title,
            slug: slug || slugify(title),
            description: description || null,
            start_at: startAt ? new Date(startAt).toISOString() : null,
            end_at: endAt ? new Date(endAt).toISOString() : null,
            capacity: capacity ?? null,
            price: price ?? null,
            is_published: isPublished,
            location: location || null,
            category: category || null,
            hero_image: heroImage || null,
            gallery: gallery
                ? gallery.split(",").map(s => s.trim()).filter(Boolean)
                : [],
            created_by: user?.id ?? null,
        };

        let error;
        if (editingId) {
            ({ error } = await supabase.from("activities").update(payload).eq("id", editingId));
        } else {
            ({ error } = await supabase.from("activities").insert(payload));
        }

        setBusy(false);

        if (error) {
            toast({ title: "No se pudo guardar", description: error.message, variant: "destructive" });
            return;
        }

        toast({ title: "Actividad guardada" });
        setOpen(false);
        // refrescar página para que useApp/Activities vean los cambios
        router.replace(router.asPath);
    };

    const removeOne = async (id: string) => {
        if (!confirm("¿Eliminar esta actividad? Esta acción no puede deshacerse.")) return;
        const { error } = await supabase.from("activities").delete().eq("id", id);
        if (error) {
            toast({ title: "No se pudo eliminar", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Actividad eliminada" });
        router.replace(router.asPath);
    };

    /* ===== UI mínima del panel (no afecta estilos existentes) ===== */
    return (
        <>
            {/* FABs admin */}
            <div className="fixed bottom-5 right-5 z-[60] flex gap-2">
                <button
                    onClick={() => setManage(true)}
                    className="rounded-full bg-black/80 text-white px-4 py-2 text-sm shadow hover:bg-black"
                    title="Gestionar actividades"
                >
                    Gestionar
                </button>
                <button
                    onClick={openCreate}
                    className="rounded-full bg-emerald-600 text-white px-4 py-2 text-sm shadow hover:bg-emerald-700"
                    title="Nueva actividad"
                >
                    + Nueva
                </button>
            </div>

            {/* Modal Crear/Editar */}
            {open && (
                <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                {editingId ? "Editar actividad" : "Nueva actividad"}
                            </h3>
                            <button className="text-sm text-neutral-500 hover:text-black" onClick={() => setOpen(false)}>
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-1">
                                <label className="text-sm">Título</label>
                                <input className="border rounded px-3 py-2" value={title} onChange={e => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm">Slug</label>
                                <input className="border rounded px-3 py-2" value={slug} onChange={e => setSlug(e.target.value)} />
                            </div>
                            <div className="sm:col-span-2 grid gap-1">
                                <label className="text-sm">Descripción</label>
                                <textarea className="border rounded px-3 py-2" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm">Inicio</label>
                                <input type="datetime-local" className="border rounded px-3 py-2" value={startAt} onChange={e => setStartAt(e.target.value)} />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm">Fin</label>
                                <input type="datetime-local" className="border rounded px-3 py-2" value={endAt} onChange={e => setEndAt(e.target.value)} />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm">Cupo</label>
                                <input type="number" className="border rounded px-3 py-2" value={capacity ?? ""} onChange={e => setCapacity(e.target.value ? Number(e.target.value) : undefined)} />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm">Precio</label>
                                <input type="number" step="0.01" className="border rounded px-3 py-2" value={price ?? ""} onChange={e => setPrice(e.target.value ? Number(e.target.value) : undefined)} />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm">Categoría</label>
                                <input className="border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)} />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm">Ubicación</label>
                                <input className="border rounded px-3 py-2" value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm">Hero image (URL)</label>
                                <input className="border rounded px-3 py-2" value={heroImage} onChange={e => setHeroImage(e.target.value)} />
                            </div>
                            <div className="grid gap-1 sm:col-span-2">
                                <label className="text-sm">Galería (URLs separadas por coma)</label>
                                <input className="border rounded px-3 py-2" value={gallery} onChange={e => setGallery(e.target.value)} placeholder="https://... , https://..." />
                            </div>
                            <div className="flex items-center gap-2">
                                <input id="pub" type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
                                <label htmlFor="pub" className="text-sm">Publicado</label>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button className="px-4 py-2 rounded border" onClick={() => setOpen(false)}>Cancelar</button>
                            <button
                                className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
                                disabled={busy || !title || !startAt}
                                onClick={save}
                            >
                                {busy ? "Guardando…" : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal gestionar/listar */}
            {manage && (
                <div className="fixed inset-0 z-[65] grid place-items-center bg-black/60 p-4">
                    <div className="w-full max-w-4xl rounded-2xl bg-white p-5 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Gestionar actividades</h3>
                            <button className="text-sm text-neutral-500 hover:text-black" onClick={() => setManage(false)}>
                                Cerrar
                            </button>
                        </div>

                        <AdminList onEdit={openEdit} onRemove={removeOne} />
                    </div>
                </div>
            )}
        </>
    );
}

function AdminList({ onEdit, onRemove }: {
    onEdit: (row: Activity) => void; onRemove: (id: string) => void;
}) {
    const [items, setItems] = React.useState<Activity[]>([]);
    const { toast } = useToast();

    const reload = React.useCallback(async () => {
        const { data, error } = await supabase
            .from("activities")
            .select("*")
            .order("start_at", { ascending: false })
            .limit(200);
        if (error) {
            toast({ title: "No se pudo listar", variant: "destructive" });
            return;
        }
        setItems((data ?? []) as Activity[]);
    }, [toast]);

    React.useEffect(() => { reload(); }, [reload]);

    return (
        <div className="mt-4 overflow-auto max-h-[70vh]">
            <table className="w-full text-sm">
                <thead className="text-left border-b">
                    <tr>
                        <th className="py-2 pr-3">Título</th>
                        <th className="py-2 pr-3">Inicio</th>
                        <th className="py-2 pr-3">Cupo</th>
                        <th className="py-2 pr-3">Publicado</th>
                        <th className="py-2 pr-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((r) => (
                        <tr key={r.id} className="border-b last:border-0">
                            <td className="py-2 pr-3">{r.title}</td>
                            <td className="py-2 pr-3">{r.start_at ? new Date(r.start_at).toLocaleString("es-AR") : "-"}</td>
                            <td className="py-2 pr-3">{r.capacity ?? "-"}</td>
                            <td className="py-2 pr-3">{r.is_published ? "Sí" : "No"}</td>
                            <td className="py-2 pr-3 flex gap-2">
                                <button className="px-3 py-1 rounded border" onClick={() => onEdit(r)}>Editar</button>
                                <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onRemove(r.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr><td className="py-6 text-neutral-500" colSpan={5}>Sin actividades.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
