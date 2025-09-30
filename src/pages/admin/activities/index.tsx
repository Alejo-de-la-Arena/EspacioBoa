// pages/admin/activities/index.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/router"; // ✅ Pages Router
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ActivityDb = {
    id: string;
    slug: string | null;
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
    gallery: any | null;
    featured: boolean | null;
    created_by: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

function slugify(s: string) {
    return s
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default function AdminActivities() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
    const [rows, setRows] = React.useState<ActivityDb[]>([]);
    const [loading, setLoading] = React.useState(true);

    // modal form
    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);

    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startAt, setStartAt] = React.useState("");
    const [endAt, setEndAt] = React.useState("");
    const [capacity, setCapacity] = React.useState<string>("");
    const [price, setPrice] = React.useState<string>("");
    const [isPublished, setIsPublished] = React.useState(true); // ✅ por defecto publicada
    const [location, setLocation] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [heroImage, setHeroImage] = React.useState("");
    const [gallery, setGallery] = React.useState("");

    // Bloquear scroll del fondo cuando el modal está abierto
    React.useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // Gate admin + cargar lista
    React.useEffect(() => {
        let alive = true;
        (async () => {
            if (!user) {
                setIsAdmin(false);
                return;
            }
            const { data, error } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .maybeSingle();
            if (!alive) return;
            if (error) {
                console.error(error);
                setIsAdmin(false);
                return;
            }
            const ok = Boolean(data?.is_admin);
            setIsAdmin(ok);
            if (ok) await loadList();
        })();
        return () => {
            alive = false;
        };
    }, [user]);

    async function loadList() {
        setLoading(true);
        const { data, error } = await supabase
            .from("activities")
            .select("*")
            .order("start_at", { ascending: false });
        setLoading(false);
        if (error) {
            toast({
                title: "No pude cargar actividades",
                description: error.message,
                variant: "destructive",
            });
            return;
        }
        setRows((data ?? []) as ActivityDb[]);
    }

    // Realtime
    React.useEffect(() => {
        if (!isAdmin) return;
        const ch = supabase
            .channel("rt-activities-admin")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "activities" },
                (payload) => {
                    setRows((prev) => {
                        if (!prev) return prev;
                        if (payload.eventType === "INSERT") {
                            const r = payload.new as ActivityDb;
                            if (prev.find((p) => p.id === r.id)) return prev;
                            return [r, ...prev].sort((a, b) =>
                                (b.start_at || "").localeCompare(a.start_at || "")
                            );
                        }
                        if (payload.eventType === "UPDATE") {
                            const r = payload.new as ActivityDb;
                            return prev.map((p) => (p.id === r.id ? r : p));
                        }
                        if (payload.eventType === "DELETE") {
                            const r = payload.old as ActivityDb;
                            return prev.filter((p) => p.id !== r.id);
                        }
                        return prev;
                    });
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(ch);
        };
    }, [isAdmin]);

    function resetForm() {
        setEditingId(null);
        setTitle("");
        setSlug("");
        setDescription("");
        setStartAt("");
        setEndAt("");
        setCapacity("");
        setPrice("");
        setIsPublished(true); // ✅ default
        setLocation("");
        setCategory("");
        setHeroImage("");
        setGallery("");
    }

    function openCreate() {
        resetForm();
        setOpen(true);
    }
    function openEdit(r: ActivityDb) {
        setEditingId(r.id);
        setTitle(r.title ?? "");
        setSlug(r.slug ?? "");
        setDescription(r.description ?? "");
        setStartAt(r.start_at ? r.start_at.slice(0, 16) : "");
        setEndAt(r.end_at ? r.end_at.slice(0, 16) : "");
        setCapacity(r.capacity != null ? String(r.capacity) : "");
        setPrice(r.price != null ? String(r.price) : "");
        setIsPublished(Boolean(r.is_published));
        setLocation(r.location ?? "");
        setCategory(r.category ?? "");
        setHeroImage(r.hero_image ?? "");
        setGallery(
            Array.isArray(r.gallery) ? r.gallery.join(", ") : (r.gallery ?? "")
        );
        setOpen(true);
    }

    async function save() {
        if (!title || !startAt) {
            toast({
                title: "Campos requeridos",
                description: "Título e inicio son obligatorios.",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);

        // preparar payload para API
        const body = {
            id: editingId ?? null,
            slug: (slug || slugify(title)) || null,
            title,
            description: description || null,
            start_at: startAt ? new Date(startAt).toISOString() : null,
            end_at: endAt ? new Date(endAt).toISOString() : null,
            capacity: capacity ? Number(capacity) : null,
            price: price ? Number(price) : null,
            is_published: !!isPublished,
            category: category || null,
            location: location || null,
            hero_image: heroImage || null,
            gallery: gallery ? gallery.split(",").map(s => s.trim()).filter(Boolean) : [],
            featured: false,
        };

        try {
            // Tomamos el access token actual del usuario
            const { data: sess } = await supabase.auth.getSession();
            const token = sess?.session?.access_token;

            const resp = await fetch("/api/admin/activities/upsert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(body),
            });

            const json = await resp.json();
            if (!resp.ok) throw new Error(json?.error || "Error al guardar");

            toast({ title: "Actividad guardada" });
            setOpen(false);

            // refrescar listado (Pages Router)
            router.replace(router.asPath);
        } catch (err: any) {
            console.error("save activity error:", err);
            toast({
                title: "No se pudo guardar",
                description: err?.message ?? "Error desconocido",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    }



    async function removeOne(id: string) {
        if (!confirm("¿Eliminar esta actividad?")) return;
        const { error } = await supabase.from("activities").delete().eq("id", id);
        if (error) {
            toast({
                title: "No se pudo eliminar",
                description: error.message,
                variant: "destructive",
            });
            return;
        }
        toast({ title: "Actividad eliminada" });
        router.replace(router.asPath); // ✅ Pages Router
    }

    if (isAdmin === null) return null;
    if (!isAdmin) {
        return (
            <main className="container mx-auto max-w-4xl px-4 py-16">
                <div className="rounded-xl border p-8 text-center">
                    <h1 className="text-2xl font-semibold">Acceso restringido</h1>
                    <p className="mt-2 text-neutral-600">
                        Necesitás permisos de administrador.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto max-w-6xl px-4 py-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    Administrar actividades
                </h1>
                <Button onClick={openCreate}>+ Nueva actividad</Button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border">
                <table className="min-w-[720px] w-full text-sm">
                    <thead className="bg-neutral-50 text-left">
                        <tr>
                            <th className="py-2 px-3">Título</th>
                            <th className="py-2 px-3">Inicio</th>
                            <th className="py-2 px-3">Cupo</th>
                            <th className="py-2 px-3">Publicado</th>
                            <th className="py-2 px-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="py-6 px-3 text-neutral-500" colSpan={5}>
                                    Cargando…
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td className="py-6 px-3 text-neutral-500" colSpan={5}>
                                    Sin actividades.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="py-2 px-3">{r.title}</td>
                                    <td className="py-2 px-3">
                                        {r.start_at
                                            ? new Date(r.start_at).toLocaleString("es-AR")
                                            : "-"}
                                    </td>
                                    <td className="py-2 px-3">{r.capacity ?? "-"}</td>
                                    <td className="py-2 px-3">{r.is_published ? "Sí" : "No"}</td>
                                    <td className="py-2 px-3 flex gap-2">
                                        <Button variant="outline" onClick={() => openEdit(r)}>
                                            Editar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => removeOne(r.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear/Editar (scroll interno) */}
            {open && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 overflow-y-auto overscroll-contain">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-y-auto max-h-[90vh] overscroll-contain">
                        {/* Header sticky */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b bg-white">
                            <h3 className="text-lg font-semibold">
                                {editingId ? "Editar actividad" : "Nueva actividad"}
                            </h3>
                            <button
                                className="text-sm text-neutral-500 hover:text-black"
                                onClick={() => setOpen(false)}
                            >
                                Cerrar
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="px-5 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-1">
                                    <label className="text-sm">Título *</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            if (!slug) setSlug(slugify(e.target.value));
                                        }}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm">Slug</label>
                                    <Input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                    />
                                </div>

                                <div className="sm:col-span-2 grid gap-1">
                                    <label className="text-sm">Descripción</label>
                                    <textarea
                                        className="border rounded px-3 py-2"
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <label className="text-sm">Inicio *</label>
                                    <input
                                        type="datetime-local"
                                        className="border rounded px-3 py-2"
                                        value={startAt}
                                        onChange={(e) => setStartAt(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm">Fin</label>
                                    <input
                                        type="datetime-local"
                                        className="border rounded px-3 py-2"
                                        value={endAt}
                                        onChange={(e) => setEndAt(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <label className="text-sm">Cupo</label>
                                    <Input
                                        type="number"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm">Precio</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <label className="text-sm">Categoría</label>
                                    <Input
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm">Ubicación</label>
                                    <Input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <label className="text-sm">Hero image (URL)</label>
                                    <Input
                                        value={heroImage}
                                        onChange={(e) => setHeroImage(e.target.value)}
                                    />
                                </div>

                                <div className="sm:col-span-2 grid gap-1">
                                    <label className="text-sm">
                                        Galería (URLs separadas por coma)
                                    </label>
                                    <Input
                                        value={gallery}
                                        onChange={(e) => setGallery(e.target.value)}
                                        placeholder="https://... , https://..."
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        id="pub"
                                        type="checkbox"
                                        checked={isPublished}
                                        onChange={(e) => setIsPublished(e.target.checked)}
                                    />
                                    <label htmlFor="pub" className="text-sm">
                                        Publicado
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer sticky */}
                        <div className="sticky bottom-0 z-10 px-5 py-4 border-t bg-white/95 backdrop-blur">
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={save} disabled={saving || !title || !startAt}>
                                    {saving ? "Guardando…" : "Guardar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
