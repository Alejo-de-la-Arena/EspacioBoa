// pages/admin/giftcards/index.tsx
"use client";

import * as React from "react";
import * as htmlToImage from "html-to-image";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GiftcardDb = {
    id: string;
    name: string;
    description: string | null;
    value: number;
    benefits: any; // jsonb -> string[]
    image_url: string | null;
    is_active: boolean | null;
    created_by: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

// ===== Helpers robustos =====
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

let _cachedToken: string | null = null;
let _cachedAt = 0;

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

// API call
async function postUpsertGiftcard(body: any) {
    const token = await ensureFreshAndCachedToken();
    if (!token) throw new Error("Necesitás iniciar sesión nuevamente (token no disponible).");

    const resp = await fetch("/api/admin/giftcards/upsert", {
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

// ====== Cola persistente (igual que Events) ======
type QueueItem = { request_id: string; payload: any; attempt: number; nextAt: number };
const QUEUE_KEY = "boa_giftcard_upsert_queue_v1";

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

// Convierte un dataURL a Blob
function dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
}

function CardPreview({ gc }: { gc: GiftcardDb }) {
    const benefits = Array.isArray(gc.benefits) ? gc.benefits : [];
    return (
        <div
            style={{
                width: 680,
                borderRadius: 30,
                padding: 18,
                background:
                    "linear-gradient(135deg, rgba(30,122,102,.28), rgba(213,149,121,.28))",
                boxShadow:
                    "inset 0 0 0 2px rgba(255,255,255,.28), 0 18px 40px rgba(0,0,0,.18)",
            }}
        >
            <div
                style={{
                    position: "relative",
                    borderRadius: 24,
                    background: "#FFFFFF",
                    padding: 30,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
                    overflow: "hidden",
                }}
            >
                {/* Watermark: logo centrado y dimensionado “forzado” */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                                "url('https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            // tamaño grande pero siempre visible completo
                            backgroundSize: "min(76%, 520px)",
                            opacity: 0.2, // intensidad del logo
                        }}
                    />
                    {/* Overlay blanco sutil para legibilidad (más débil que antes) */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "radial-gradient(circle at 50% 50%, rgba(255,255,255,.78), rgba(255,255,255,.70) 55%, rgba(255,255,255,.66))",
                        }}
                    />
                </div>

                {/* Grano muy leve */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.035,
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>\")",
                        backgroundSize: "260px 260px",
                        pointerEvents: "none",
                    }}
                />

                {/* Contenido */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <h3
                        style={{
                            fontSize: 32,
                            lineHeight: "36px",
                            fontWeight: 800,
                            color: "#0c1813",
                            marginBottom: 8,
                        }}
                    >
                        {gc.name}
                    </h3>

                    <p
                        style={{
                            color: "#3b4a42",
                            fontSize: 18,
                            lineHeight: "24px",
                            margin: "2px 0 18px",
                        }}
                    >
                        {gc.description || ""}
                    </p>

                    <div
                        style={{
                            fontSize: 44,
                            fontWeight: 900,
                            color: "#0c1813",
                            marginBottom: 18,
                        }}
                    >
                        ${Number(gc.value || 0).toLocaleString("es-AR")}
                    </div>

                    {benefits.length > 0 && (
                        <ul
                            style={{
                                margin: "0 0 22px",
                                padding: 0,
                                listStyle: "none",
                                color: "#0f2a23",
                                fontSize: 18,
                            }}
                        >
                            {benefits.slice(0, 5).map((b: string, i: number) => (
                                <li
                                    key={i}
                                    style={{
                                        display: "flex",
                                        gap: 10,
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: 999,
                                            background: "#1e7a66",
                                            display: "inline-block",
                                        }}
                                    />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* separador + instrucción corta */}
                    <div
                        style={{
                            height: 1,
                            background: "rgba(0,0,0,.08)",
                            margin: "6px 0 12px",
                        }}
                    />
                    <p
                        style={{
                            color: "#32433b",
                            fontSize: 14,
                            lineHeight: "20px",
                            margin: 0,
                        }}
                    >
                        <strong>¿Cómo usarla?</strong> Mostrá esta gift card en <strong>BOA</strong> al momento de pagar.
                    </p>
                </div>
            </div>
        </div>
    );
}



// ===== Componente =====
export default function AdminGiftcards() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
    const [rows, setRows] = React.useState<GiftcardDb[]>([]);
    const [loading, setLoading] = React.useState(true);

    // modal form
    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [value, setValue] = React.useState<string>("");
    const [benefits, setBenefits] = React.useState<string>(""); // csv
    const [imageUrl, setImageUrl] = React.useState("");
    const [isActive, setIsActive] = React.useState(true);

    // guards/refs
    const subscribedRef = React.useRef(false);
    const unWireAuthRef = React.useRef<null | (() => void)>(null);
    const drainingRef = React.useRef(false);

    const renderRef = React.useRef<HTMLDivElement | null>(null);


    // lock scroll when modal open
    React.useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    // cache auth token on-change
    React.useEffect(() => {
        unWireAuthRef.current = wireAuthCacheListener();
        return () => {
            try {
                unWireAuthRef.current?.();
            } catch { }
        };
    }, []);

    // load list
    const loadList = React.useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from("giftcards").select("*").order("created_at", { ascending: false });
        setLoading(false);
        if (error) {
            toast({ title: "No pude cargar giftcards", description: error.message, variant: "destructive" });
            return;
        }
        setRows((data ?? []) as GiftcardDb[]);
    }, [toast]);

    // admin gate + first load
    React.useEffect(() => {
        let alive = true;
        (async () => {
            if (!user) {
                if (alive) setIsAdmin(false);
                return;
            }
            const { data, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
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

    // realtime one-time
    React.useEffect(() => {
        if (!isAdmin || subscribedRef.current) return;
        subscribedRef.current = true;

        const ch = supabase
            .channel("rt-giftcards-admin")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "giftcards" },
                (payload) => {
                    setRows((prev) => {
                        if (!prev) return prev;

                        if (payload.eventType === "INSERT") {
                            const r = payload.new as GiftcardDb;
                            if (prev.find((p) => p.id === r.id)) return prev;
                            return [r, ...prev];
                        }

                        if (payload.eventType === "UPDATE") {
                            const r = payload.new as GiftcardDb;
                            const idx = prev.findIndex((p) => p.id === r.id);
                            if (idx === -1) return prev;

                            const same =
                                prev[idx].updated_at === r.updated_at &&
                                prev[idx].name === r.name &&
                                prev[idx].value === r.value &&
                                prev[idx].is_active === r.is_active;
                            if (same) return prev;

                            const next = prev.slice();
                            next[idx] = r;
                            return next;
                        }

                        if (payload.eventType === "DELETE") {
                            const r = payload.old as GiftcardDb;
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

    // drain queue
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
                    await postUpsertGiftcard(item.payload);
                    dequeueById(item.request_id);
                    toast({ title: "Giftcard guardada" });
                    await loadList();
                } catch (e: any) {
                    if (e?.status === 401 || e?.status === 403) {
                        try {
                            await supabase.auth.refreshSession();
                            await postUpsertGiftcard(item.payload);
                            dequeueById(item.request_id);
                            toast({ title: "Giftcard guardada" });
                            await loadList();
                            continue;
                        } catch { }
                    }
                    const attempt = (item.attempt || 0) + 1;
                    const backoffMs = Math.min(5 * 60_000, 2000 * Math.pow(2, attempt - 1));
                    const next: QueueItem = { ...item, attempt, nextAt: Date.now() + backoffMs };
                    updateQueueItem(next);
                    break;
                }
            }
        } finally {
            drainingRef.current = false;
        }
    }, [loadList, toast]);

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

    // form helpers
    function resetForm() {
        setEditingId(null);
        setName("");
        setDescription("");
        setValue("");
        setBenefits("");
        setImageUrl("");
        setIsActive(true);
    }
    function openCreate() {
        resetForm();
        setOpen(true);
    }
    function openEdit(r: GiftcardDb) {
        setEditingId(r.id);
        setName(r.name ?? "");
        setDescription(r.description ?? "");
        setValue(r.value != null ? String(r.value) : "");
        setBenefits(Array.isArray(r.benefits) ? r.benefits.join(", ") : (r.benefits ?? ""));
        setImageUrl(r.image_url ?? "");
        setIsActive(Boolean(r.is_active));
        setOpen(true);
    }

    // genera (si hace falta) y devuelve una URL pública y también el dataURL en memoria
    async function ensureGiftcardImage(gc: GiftcardDb): Promise<{ publicUrl: string; dataUrl: string }> {
        // si ya tenemos url pública, solo necesitamos un dataUrl para el Web Share
        let publicUrl = gc.image_url || "";
        let dataUrl = "";

        // si no hay image_url, la generamos y subimos (reutiliza tu generateAndUploadImage)
        if (!publicUrl) {
            publicUrl = await generateAndUploadImage(gc);
            const { error } = await supabase
                .from("giftcards")
                .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
                .eq("id", gc.id);
            if (error) console.warn("No se pudo actualizar image_url:", error);
            await loadList();
        }

        // siempre generamos un dataUrl local (para Web Share con archivo)
        {
            // render local rápido (mismo CardPreview)
            if (!renderRef.current) throw new Error("renderRef missing");
            const { createRoot } = await import("react-dom/client");
            const container = document.createElement("div");
            container.style.position = "fixed";
            container.style.left = "-99999px";
            container.style.top = "-99999px";
            renderRef.current.appendChild(container);
            const tmp = document.createElement("div");
            container.appendChild(tmp);
            const root = createRoot(tmp);
            root.render(<CardPreview gc={gc} />);
            await new Promise((r) => setTimeout(r, 50));
            dataUrl = await htmlToImage.toPng(tmp, { pixelRatio: 2, backgroundColor: "#FAF8F2", cacheBust: true });
            root.unmount();
            container.remove();
        }

        return { publicUrl, dataUrl };
    }

    async function shareWhatsApp(gc: GiftcardDb) {
        try {
            // si falta la imagen, la generamos y persistimos (también nos asegura que renderRef está OK)
            await ensureGiftcardImage(gc);

            const benefits = Array.isArray(gc.benefits) ? gc.benefits : [];
            const includes = benefits.length ? `Incluye: ${benefits.slice(0, 5).join(" • ")}` : "";

            const text =
                `Gift Card BOA — ${gc.name}\n` +
                (gc.description ? `${gc.description}\n` : "") +
                `Valor: $${Number(gc.value ?? 0).toLocaleString("es-AR")}\n` +
                (includes ? `${includes}` : "");

            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        } catch (e: any) {
            console.error("shareWhatsApp error:", e);
            toast({
                title: "No se pudo preparar el mensaje",
                description: e?.message || "Probá nuevamente.",
                variant: "destructive",
            });
        }
    }



    // Copia la imagen renderizada de la giftcard al portapapeles (desktop)
    async function copyGiftcardImage(gc: GiftcardDb) {
        try {
            const { dataUrl } = await ensureGiftcardImage(gc);
            const res = await fetch(dataUrl);
            const blob = await res.blob();

            if (navigator.clipboard && (window as any).ClipboardItem) {
                const item = new (window as any).ClipboardItem({ [blob.type]: blob });
                await navigator.clipboard.write([item]);
                toast({ title: "Imagen copiada", description: "Pegala en el chat de WhatsApp." });
                return;
            }

            // Fallback: descarga si el navegador no soporta copiar
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${gc.name}.png`;
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: "Imagen descargada", description: "Adjuntala en el chat de WhatsApp." });
        } catch (e: any) {
            console.error("copyGiftcardImage error:", e);
            toast({
                title: "No se pudo copiar",
                description: e?.message || "Probá nuevamente o usá Descargar PNG.",
                variant: "destructive",
            });
        }
    }

    // Descarga explícitamente el PNG (plan B/flujo manual)
    async function downloadGiftcardImage(gc: GiftcardDb) {
        try {
            const { dataUrl } = await ensureGiftcardImage(gc);
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${gc.name}.png`;
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: "Descargado", description: "La imagen se guardó en tu dispositivo." });
        } catch (e: any) {
            console.error("downloadGiftcardImage error:", e);
            toast({
                title: "No se pudo descargar",
                description: e?.message || "Intentá nuevamente.",
                variant: "destructive",
            });
        }
    }

    async function generateAndUploadImage(gc: GiftcardDb): Promise<string> {
        if (!renderRef.current) throw new Error("renderRef missing");

        // 1) montar un contenedor fuera de pantalla
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.left = "-99999px";
        container.style.top = "-99999px";
        renderRef.current.appendChild(container);

        // 2) renderizar CardPreview y convertir a PNG (dataURL)
        const { createRoot } = await import("react-dom/client");
        const tmp = document.createElement("div");
        container.appendChild(tmp);
        const root = createRoot(tmp);
        root.render(<CardPreview gc={gc} />);
        await new Promise((r) => setTimeout(r, 50));
        const dataUrl = await htmlToImage.toPng(tmp, {
            pixelRatio: 2,
            backgroundColor: "#FAF8F2",
            cacheBust: true,
        });
        root.unmount();
        container.remove();

        // 3) subir al servidor (service-role)
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) throw new Error("Necesitás iniciar sesión nuevamente (token no disponible).");

        const resp = await fetch("/api/admin/giftcards/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ dataUrl, giftcardId: gc.id }),
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(json?.error || `HTTP ${resp.status}`);

        return json.url as string;
    }


    // save (encola y drena)
    async function save() {
        if (!name) {
            toast({ title: "Campos requeridos", description: "El nombre es obligatorio.", variant: "destructive" });
            return;
        }
        if (!value) {
            toast({ title: "Campos requeridos", description: "El valor es obligatorio.", variant: "destructive" });
            return;
        }

        setSaving(true);

        const request_id = crypto.randomUUID();
        const payload = {
            request_id,
            id: editingId ?? null,
            name,
            description: description || null,
            value: Number(value),
            benefits: benefits ? benefits.split(",").map((s) => s.trim()).filter(Boolean) : [],
            image_url: imageUrl || null,
            is_active: !!isActive,
        };

        enqueue({ request_id, payload, attempt: 0, nextAt: Date.now() });
        setOpen(false);
        resetForm();
        toast({
            title: "Guardando…",
            description: "Se está enviando. Si cambiás de pestaña o hay cortes, lo reintento automáticamente.",
        });

        await drainQueue();
        setSaving(false);
    }

    // delete
    async function removeOne(id: string) {
        if (!confirm("¿Eliminar esta giftcard?")) return;
        const { error } = await supabase.from("giftcards").delete().eq("id", id);
        if (error) {
            toast({ title: "No se pudo eliminar", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Giftcard eliminada" });
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

    // ===== UI =====
    return (
        <main className="container mx-auto max-w-6xl px-4 py-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Administrar giftcards</h1>
                <Button onClick={openCreate}>+ Nueva giftcard</Button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border">
                <table className="min-w-[720px] w-full text-sm">
                    <thead className="bg-neutral-50 text-left">
                        <tr>
                            <th className="py-2 px-3">Nombre</th>
                            <th className="py-2 px-3">Valor</th>
                            <th className="py-2 px-3">Activa</th>
                            <th className="py-2 px-3">Última actualización</th>
                            <th className="py-2 px-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="py-6 px-3 text-neutral-500" colSpan={5}>Cargando…</td></tr>
                        ) : rows.length === 0 ? (
                            <tr><td className="py-6 px-3 text-neutral-500" colSpan={5}>Sin giftcards.</td></tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="py-2 px-3">{r.name}</td>
                                    <td className="py-2 px-3">${Number(r.value ?? 0).toLocaleString("es-AR")}</td>
                                    <td className="py-2 px-3">{r.is_active ? "Sí" : "No"}</td>
                                    <td className="py-2 px-3">{r.updated_at ? new Date(r.updated_at).toLocaleString("es-AR") : "-"}</td>
                                    <td className="py-2 px-3 flex flex-wrap gap-2">
                                        <Button variant="outline" onClick={() => openEdit(r)}>Editar</Button>
                                        <Button variant="secondary" onClick={() => shareWhatsApp(r)}>Enviar por WhatsApp</Button>
                                        <Button variant="outline" onClick={() => copyGiftcardImage(r)}>Copiar imagen</Button>
                                        <Button variant="outline" onClick={() => downloadGiftcardImage(r)}>Descargar PNG</Button>
                                        <Button variant="destructive" onClick={() => removeOne(r.id)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal crear/editar */}
            {open && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 overflow-y-auto overscroll-contain">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-y-auto max-h-[90vh] overscroll-contain">
                        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b bg-white">
                            <h3 className="text-lg font-semibold">{editingId ? "Editar giftcard" : "Nueva giftcard"}</h3>
                            <button className="text-sm text-neutral-500 hover:text-black" onClick={() => { setOpen(false); resetForm(); }}>
                                Cerrar
                            </button>
                        </div>

                        <div className="px-5 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-1">
                                    <label className="text-sm">Nombre *</label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className="grid gap-1">
                                    <label className="text-sm">Valor *</label>
                                    <Input type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
                                </div>

                                <div className="sm:col-span-2 grid gap-1">
                                    <label className="text-sm">Descripción</label>
                                    <textarea className="border rounded px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>

                                <div className="sm:col-span-2 grid gap-1">
                                    <label className="text-sm">Beneficios (separados por coma)</label>
                                    <Input value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="Ej: 3 cafés, 1 taller, descuento en granos" />
                                </div>

                                <div className="sm:col-span-2 grid gap-1">
                                    <label className="text-sm">Imagen / Diseño (URL pública)</label>
                                    <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                                    <p className="text-xs text-neutral-500">Tip: subí tu diseño a Supabase Storage o Cloudinary y pegá la URL (WhatsApp mostrará el preview).</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                                        Activa
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 z-10 px-5 py-4 border-t bg-white/95 backdrop-blur">
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancelar</Button>
                                <Button onClick={save} disabled={saving || !name || !value}>
                                    {saving ? "Guardando…" : "Guardar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={renderRef} aria-hidden className="sr-only" />
        </main>
    );
}
