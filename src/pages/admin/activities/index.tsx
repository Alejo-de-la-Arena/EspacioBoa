// pages/admin/activities/index.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/router";
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

// ===== helpers (robustos) =====
async function withCap<T>(p: Promise<T>, ms = 3000): Promise<T> {
    let t: any;
    const timeout = new Promise<never>((_, rej) => {
        t = setTimeout(() => rej(new Error("timeout")), ms);
    });
    try {
        return await Promise.race([p, timeout]);
    } finally {
        clearTimeout(t);
    }
}

// TOKEN ROBUSTO + caché centralizada
let _cachedToken: string | null = null;
let _cachedAt = 0;

// Listener para cachear token al vuelo
function wireAuthCacheListener() {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
        const t = session?.access_token ?? null;
        if (t) {
            _cachedToken = t;
            _cachedAt = Date.now();
        }
    });
    return () => sub?.subscription?.unsubscribe?.();
}

// Siempre devuelve token fresco si expira pronto
async function ensureFreshAndCachedToken(): Promise<string | null> {
    try {
        const { data } = await supabase.auth.getSession();
        const sess = data?.session ?? null;
        const now = Math.floor(Date.now() / 1000);

        if (sess?.access_token) {
            const exp = sess.expires_at ?? 0;
            const needsRefresh = !exp || exp - now < 120;
            if (needsRefresh) {
                try {
                    const { data: r } = await withCap(supabase.auth.refreshSession(), 5000);
                    const t = r?.session?.access_token ?? null;
                    if (t) {
                        _cachedToken = t;
                        _cachedAt = Date.now();
                        return t;
                    }
                } catch { }
            }
            _cachedToken = sess.access_token;
            _cachedAt = Date.now();
            return sess.access_token;
        }

        try {
            const { data: r } = await withCap(supabase.auth.refreshSession(), 5000);
            const t = r?.session?.access_token ?? null;
            if (t) {
                _cachedToken = t;
                _cachedAt = Date.now();
                return t;
            }
        } catch { }

        return await new Promise<string | null>((resolve) => {
            const to = setTimeout(() => {
                sub?.subscription?.unsubscribe?.();
                resolve(null);
            }, 6000);
            const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
                const t = session?.access_token ?? null;
                if (t) {
                    clearTimeout(to);
                    sub?.subscription?.unsubscribe?.();
                    _cachedToken = t;
                    _cachedAt = Date.now();
                    resolve(t);
                }
            });
        });
    } catch {
        return null;
    }
}

// POST a la API (sin keepalive, sin AbortSignal)
async function postUpsertActivity(body: any) {
    const token = await ensureFreshAndCachedToken();
    if (!token) throw new Error("Necesitás iniciar sesión nuevamente (token no disponible).");

    const resp = await fetch("/api/admin/activities/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
        const e: any = new Error(json?.error || `HTTP ${resp.status}`);
        e.status = resp.status;
        e.request_id = json?.request_id;
        throw e;
    }
    return json;
}

// ===== Cola persistente (igual que events) =====
type QueueItem = {
    request_id: string;
    payload: any;
    attempt: number;
    nextAt: number; // epoch ms
};

const QUEUE_KEY = "boa_activity_upsert_queue_v1";

function readQueue(): QueueItem[] {
    try {
        return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    } catch {
        return [];
    }
}
function writeQueue(q: QueueItem[]) {
    try {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    } catch { }
}
function enqueue(item: QueueItem) {
    const q = readQueue();
    q.push(item);
    writeQueue(q);
}
function dequeueById(request_id: string) {
    const q = readQueue().filter((i) => i.request_id !== request_id);
    writeQueue(q);
}
function updateQueueItem(next: QueueItem) {
    const q = readQueue().map((i) => (i.request_id === next.request_id ? next : i));
    writeQueue(q);
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
    const [isPublished, setIsPublished] = React.useState(true);
    const [location, setLocation] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [heroImage, setHeroImage] = React.useState("");
    const [gallery, setGallery] = React.useState("");
    const [featured, setFeatured] = React.useState(false);

    // === guards / refs ===
    const subscribedRef = React.useRef(false);
    const unWireAuthRef = React.useRef<null | (() => void)>(null);
    const drainingRef = React.useRef(false);

    // bloquear scroll de fondo con modal abierto
    React.useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // cachear token on-change
    React.useEffect(() => {
        unWireAuthRef.current = wireAuthCacheListener();
        return () => {
            try {
                unWireAuthRef.current?.();
            } catch { }
        };
    }, []);

    // cargar lista (memoizado)
    const loadList = React.useCallback(async () => {
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
    }, [toast]);

    // gate admin + cargar lista
    React.useEffect(() => {
        let alive = true;
        (async () => {
            if (!user) {
                if (alive) setIsAdmin(false);
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
    }, [user, loadList]);

    // realtime (una sola vez)
    React.useEffect(() => {
        if (!isAdmin || subscribedRef.current) return;
        subscribedRef.current = true;

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
                            const next = [r, ...prev];
                            next.sort((a, b) => (b.start_at || "").localeCompare(a.start_at || ""));
                            return next;
                        }

                        if (payload.eventType === "UPDATE") {
                            const r = payload.new as ActivityDb;
                            const idx = prev.findIndex((p) => p.id === r.id);
                            if (idx === -1) return prev;

                            // Evita renders si no cambió nada relevante
                            const same =
                                prev[idx].updated_at === r.updated_at &&
                                prev[idx].title === r.title &&
                                prev[idx].start_at === r.start_at &&
                                prev[idx].end_at === r.end_at;
                            if (same) return prev;

                            const next = prev.slice();
                            next[idx] = r;
                            return next;
                        }

                        if (payload.eventType === "DELETE") {
                            const r = payload.old as ActivityDb;
                            const next = prev.filter((p) => p.id !== r.id);
                            return next.length === prev.length ? prev : next;
                        }

                        return prev;
                    });
                }
            )
            .subscribe();

        return () => {
            try {
                supabase.removeChannel(ch);
            } finally {
                subscribedRef.current = false;
            }
        };
    }, [isAdmin]);

    // refrescar token cuando la pestaña vuelve a foco/visibilidad
    React.useEffect(() => {
        const onFocus = async () => {
            try {
                await supabase.auth.refreshSession();
            } catch { }
        };
        const onVisibility = () => {
            if (!document.hidden) onFocus();
        };
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    function resetForm() {
        setEditingId(null);
        setTitle("");
        setSlug("");
        setDescription("");
        setStartAt("");
        setEndAt("");
        setCapacity("");
        setPrice("");
        setIsPublished(true);
        setLocation("");
        setCategory("");
        setHeroImage("");
        setGallery("");
        setFeatured(false);
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
        setGallery(Array.isArray(r.gallery) ? r.gallery.join(", ") : (r.gallery ?? ""));
        setFeatured(Boolean(r.featured));
        setOpen(true);
    }

    // ===== Cola: drain =====
    const drainQueue = React.useCallback(async () => {
        if (drainingRef.current) return;
        drainingRef.current = true;
        try {
            while (true) {
                const q = readQueue();
                if (!q.length) break;

                const now = Date.now();
                const idx = q.findIndex((i) => i.nextAt <= now);
                if (idx === -1) break;

                const item = q[idx];

                try {
                    await postUpsertActivity(item.payload);
                    // éxito
                    dequeueById(item.request_id);
                    toast({ title: "Actividad guardada" });
                    await loadList();
                } catch (e: any) {
                    // reintento tras refresh si es auth
                    if (e?.status === 401 || e?.status === 403) {
                        try {
                            await supabase.auth.refreshSession();
                            await postUpsertActivity(item.payload);
                            dequeueById(item.request_id);
                            toast({ title: "Actividad guardada" });
                            await loadList();
                            continue;
                        } catch { }
                    }
                    // backoff exponencial hasta 5 min
                    const attempt = (item.attempt || 0) + 1;
                    const backoffMs = Math.min(5 * 60_000, 2000 * Math.pow(2, attempt - 1)); // 2s,4s,8s,…
                    const next: QueueItem = { ...item, attempt, nextAt: Date.now() + backoffMs };
                    updateQueueItem(next);
                    break; // salir del loop hasta que venza el backoff
                }
            }
        } finally {
            drainingRef.current = false;
        }
    }, [loadList, toast]);

    // disparadores del drain
    React.useEffect(() => {
        drainQueue();
    }, [drainQueue]);

    React.useEffect(() => {
        const onFocus = () => drainQueue();
        const onVis = () => !document.hidden && drainQueue();
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVis);
        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVis);
        };
    }, [drainQueue]);

    React.useEffect(() => {
        const t = setInterval(() => drainQueue(), 15000);
        return () => clearInterval(t);
    }, [drainQueue]);

    async function save() {
        // validaciones
        if (!title) {
            toast({ title: "Campos requeridos", description: "El título es obligatorio.", variant: "destructive" });
            return;
        }
        if (!startAt) {
            toast({ title: "Campos requeridos", description: "El inicio es obligatorio.", variant: "destructive" });
            return;
        }
        if (!endAt) {
            toast({ title: "Campos requeridos", description: "El fin es obligatorio.", variant: "destructive" });
            return;
        }
        if (new Date(endAt) < new Date(startAt)) {
            toast({ title: "Fechas inválidas", description: "El fin no puede ser anterior al inicio.", variant: "destructive" });
            return;
        }

        setSaving(true);

        const request_id = crypto.randomUUID();
        const payload = {
            request_id,
            id: editingId ?? null,
            slug: (slug || slugify(title)) || null,
            title,
            description: description || null,
            start_at: new Date(startAt).toISOString(),
            end_at: new Date(endAt).toISOString(),
            capacity: capacity ? Number(capacity) : null,
            price: price ? Number(price) : null,
            is_published: !!isPublished,
            category: category || null,
            location: location || null,
            hero_image: heroImage || null,
            gallery: gallery ? gallery.split(",").map((s) => s.trim()).filter(Boolean) : [],
            featured: !!featured,
        };

        // encolo y proceso
        enqueue({ request_id, payload, attempt: 0, nextAt: Date.now() });
        setOpen(false);
        resetForm();
        toast({
            title: "Guardando…",
            description: "Se está enviando. Si hay cortes o cambiás de pestaña, lo reintento automáticamente.",
        });

        await drainQueue(); // primer intento inmediato
        setSaving(false);
    }

    async function removeOne(id: string) {
        if (!confirm("¿Eliminar esta actividad?")) return;
        const { error } = await supabase.from("activities").delete().eq("id", id);
        if (error) {
            toast({ title: "No se pudo eliminar", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Actividad eliminada" });
        await loadList();
    }

    if (isAdmin === null) return null;

    if (!isAdmin) {
        return (
            <main className="container mx-auto max-w-4xl px-4 py-16">
                <div className="rounded-xl border p-8 text-center">
                    <h1 className="text-2xl font-semibold">Acceso restringido</h1>
                    <p className="mt-2 text-neutral-600">Necesitás permisos de administrador.</p>
                </div>
            </main>
        );
    }

    // === RETURN VACÍO (igual que me pediste para maquetarlo aparte) ===
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
                                onClick={() => { setOpen(false); resetForm(); }}
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
                                <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
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

