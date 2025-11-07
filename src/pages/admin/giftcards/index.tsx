// pages/admin/giftcards/index.tsx
"use client";

import * as React from "react";
import * as htmlToImage from "html-to-image";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* =========================================================
   Tipos
   ========================================================= */
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

type Preorder = {
    id: string;
    preorder_code: string;
    gift_id: string | null;
    gift_name: string;
    gift_value: number | null;
    buyer_name: string;
    buyer_phone: string;
    buyer_email: string;
    message: string | null;
    status: "pending" | "paid" | "sent" | "cancelled" | "used";
    created_at: string;
};

/* =========================================================
   Helpers robustos
   ========================================================= */
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

// API call (ya existente para upsert de plantillas)
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

/* =========================================================
   Cola persistente (igual que Events)
   ========================================================= */
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

/* =========================================================
   Vista previa de la giftcard (plantilla)
   ========================================================= */
function CardPreview({ gc }: { gc: GiftcardDb }) {
    const benefits = Array.isArray(gc.benefits) ? gc.benefits : [];

    const flowerURI =
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'><g fill='%23308a73'><circle cx='7' cy='3' r='2'/><circle cx='11' cy='7' r='2'/><circle cx='7' cy='11' r='2'/><circle cx='3' cy='7' r='2'/><circle cx='9.8' cy='4.2' r='1.5'/><circle cx='9.8' cy='9.8' r='1.5'/><circle cx='4.2' cy='9.8' r='1.5'/><circle cx='4.2' cy='4.2' r='1.5'/><circle cx='7' cy='7' r='2.2'/></g></svg>\")";

    return (
        <div
            style={{
                width: 680,
                borderRadius: 0,
                padding: 18,
                background: `
          conic-gradient(
            from 160deg at 50% 50%,
            rgba(164, 216, 195, .95) 0%,
            rgba(207, 232, 221, .95) 10%,
            rgba(252, 236, 212, .95) 20%,
            rgba(255, 218, 199, .95) 30%,
            rgba(230, 242, 233, .95) 40%,
            rgba(183, 227, 207, .95) 50%,
            rgba(244, 239, 226, .95) 60%,
            rgba(214, 232, 221, .95) 70%,
            rgba(255, 225, 210, .95) 80%,
            rgba(240, 247, 241, .95) 90%,
            rgba(164, 216, 195, .95) 100%
          )
        `,
                boxShadow: "inset 0 0 0 3px rgba(255,255,255,.65), 0 18px 42px rgba(41,51,45,.14)",
            }}
        >
            <div
                style={{
                    position: "relative",
                    borderRadius: 26,
                    padding: 30,
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #FFFBF4 0%, #FFF7EB 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(92, 74, 56, .07)",
                }}
            >
                {/* Watermark */}
                <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                                "url('https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "min(76%, 520px)",
                            opacity: 0.14,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: `
                radial-gradient(55% 45% at 18% 16%, rgba(200,222,209,.26), transparent 60%),
                radial-gradient(45% 40% at 82% 12%, rgba(244,239,226,.28), transparent 62%),
                radial-gradient(65% 55% at 50% 98%, rgba(214,232,221,.24), transparent 60%)
              `,
                            mixBlendMode: "multiply",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "radial-gradient(120% 90% at 50% 0%, rgba(103,130,111,.08) 0%, rgba(103,130,111,0) 60%)",
                        }}
                    />
                </div>

                {/* Textura */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.06,
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='9'/><feColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 .75 0 0  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23g)' fill='%23b7c6b6' opacity='.22'/></svg>\")",
                        backgroundSize: "270px 270px",
                        pointerEvents: "none",
                        mixBlendMode: "multiply",
                    }}
                />

                {/* Halos */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        top: -70,
                        left: -60,
                        width: 240,
                        height: 240,
                        borderRadius: 999,
                        background: "radial-gradient(closest-side, rgba(214,232,221,.34), rgba(214,232,221,0))",
                        filter: "blur(2px)",
                    }}
                />
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        bottom: -80,
                        right: -60,
                        width: 250,
                        height: 250,
                        borderRadius: 999,
                        background: "radial-gradient(closest-side, rgba(250,241,224,.32), rgba(250,241,224,0))",
                        filter: "blur(2px)",
                    }}
                />

                {/* Contenido */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <h3
                        style={{
                            fontSize: 32,
                            lineHeight: "36px",
                            fontWeight: 800,
                            color: "#1b2a22",
                            marginBottom: 8,
                        }}
                    >
                        {gc.name}
                    </h3>

                    <p
                        style={{
                            color: "#2c3a33",
                            fontSize: 18,
                            lineHeight: "24px",
                            margin: "2px 0 18px",
                        }}
                    >
                        {gc.description || ""}
                    </p>

                    {/* Precio */}
                    <div
                        style={{
                            fontSize: 44,
                            fontWeight: 900,
                            color: "#1b2a22",
                            marginBottom: 18,
                            position: "relative",
                        }}
                    >
                        ${Number(gc.value || 0).toLocaleString("es-AR")}
                        <span
                            aria-hidden
                            style={{
                                position: "absolute",
                                left: -4,
                                right: 140,
                                bottom: -6,
                                height: 10,
                                backgroundImage:
                                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='10' viewBox='0 0 220 10'><path d='M2 7 C 40 2, 80 12, 120 6 S 200 2, 218 6' stroke='%2391a68f' stroke-width='3' fill='none' stroke-linecap='round' opacity='.75'/></svg>\")",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                                pointerEvents: "none",
                            }}
                        />
                    </div>

                    {benefits.length > 0 && (
                        <ul
                            style={{
                                margin: "0 0 22px",
                                padding: 0,
                                listStyle: "none",
                                color: "#213A31",
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
                                        marginBottom: 9,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 14,
                                            height: 14,
                                            display: "inline-block",
                                            backgroundImage: flowerURI,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "14px 14px",
                                        }}
                                    />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Separador */}
                    <div
                        style={{
                            height: 1,
                            margin: "8px 0 12px",
                            background: "linear-gradient(90deg, rgba(43,58,50,.06), rgba(43,58,50,.12), rgba(43,58,50,.06))",
                        }}
                    />

                    <p
                        style={{
                            color: "#2f3d36",
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

/* =========================================================
   Componente principal
   ========================================================= */
export default function AdminGiftcards() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

    // ---- Preorders (Órdenes) ----
    const [poLoading, setPoLoading] = React.useState(true);
    const [poRows, setPoRows] = React.useState<Preorder[]>([]);
    const [issuing, setIssuing] = React.useState<string | null>(null);

    // ---- Plantillas (giftcards) ----
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

    /* =========================
       Carga de PREORDERS (órdenes)
       ========================= */
    const authHeader = React.useCallback(async () => {
        const t = await ensureFreshAndCachedToken();
        return t ? { Authorization: `Bearer ${t}` } : {};
    }, []);

    const loadPreorders = React.useCallback(async () => {
        setPoLoading(true);
        try {
            const headers = await authHeader();
            const r = await fetch("/api/admin/preorders/list", { headers });
            const j = await r.json();
            if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
            setPoRows(j.data || []);
        } catch (e: any) {
            toast({ title: "No pude cargar órdenes", description: e?.message, variant: "destructive" });
        } finally {
            setPoLoading(false);
        }
    }, [authHeader, toast]);

    const markPaid = React.useCallback(
        async (preorder_id: string) => {
            try {
                const headers = { ...(await authHeader()), "Content-Type": "application/json" };
                const r = await fetch("/api/admin/preorders/mark-paid", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ preorder_id }),
                });
                const j = await r.json();
                if (!r.ok || !j.ok) throw new Error(j?.error || `HTTP ${r.status}`);
                toast({ title: "Orden marcada como pagada" });
                await loadPreorders();
            } catch (e: any) {
                toast({ title: "No se pudo marcar como pagada", description: e?.message, variant: "destructive" });
            }
        },
        [authHeader, loadPreorders, toast]
    );

    const deletePreorder = React.useCallback(
        async (preorder_id: string) => {
            if (!confirm("¿Eliminar esta pre-orden? (también cancelará códigos activos)")) return;
            try {
                const headers = { ...(await authHeader()), "Content-Type": "application/json" };
                const r = await fetch("/api/admin/preorders/delete", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ preorder_id }),
                });
                const j = await r.json();
                if (!r.ok || !j.ok) throw new Error(j?.error || `HTTP ${r.status}`);
                toast({ title: "Pre-orden eliminada" });
                await loadPreorders();
            } catch (e: any) {
                toast({ title: "No se pudo eliminar", description: e?.message, variant: "destructive" });
            }
        },
        [authHeader, loadPreorders, toast]
    );


    type IssuedLite = {
        id: string;
        preorder_id: string;
        code: string;
        status: "active" | "redeemed" | "cancelled" | "expired";
        redeemed_at: string | null;
    };

    const [issuedByPreorder, setIssuedByPreorder] = React.useState<Record<string, IssuedLite>>({});

    const loadIssuedMap = React.useCallback(async () => {

        const { data, error } = await supabase
            .from("giftcards_issued")
            .select("id, preorder_id, code, status, redeemed_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.warn("loadIssuedMap:", error);
            return;
        }

        const map: Record<string, IssuedLite> = {};
        (data || []).forEach((row: any) => {
            // me quedo con la última fila por preorder
            if (!map[row.preorder_id]) map[row.preorder_id] = row as IssuedLite;
        });
        setIssuedByPreorder(map);
    }, []);

    React.useEffect(() => {
        if (isAdmin) {
            loadPreorders?.();
            loadIssuedMap();
        }
    }, [isAdmin, loadPreorders, loadIssuedMap]);

    React.useEffect(() => {
        if (!isAdmin) return;

        const ch = supabase
            .channel("rt-gc-issued-admin")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "giftcards_issued" },
                (payload) => {
                    setIssuedByPreorder((prev) => {
                        const row = (payload.new || payload.old) as any;
                        if (!row?.preorder_id) return prev;
                        const next = { ...prev };

                        if (payload.eventType === "DELETE") {
                            if (next[row.preorder_id]?.id === row.id) delete next[row.preorder_id];
                            return next;
                        }

                        // INSERT / UPDATE → me quedo con la última conocida
                        const curr = next[row.preorder_id];
                        const currTs = curr ? new Date(curr.redeemed_at || 0).getTime() : -1;
                        const newTs = row.redeemed_at
                            ? new Date(row.redeemed_at).getTime()
                            : Date.now();

                        if (!curr || newTs >= currTs) next[row.preorder_id] = row;
                        return next;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(ch);
        };
    }, [isAdmin]);

    React.useEffect(() => {
        if (!isAdmin) return;
        const ch = supabase
            .channel("rt-preorders-admin")
            .on("postgres_changes",
                { event: "*", schema: "public", table: "preorders" },
                () => loadPreorders()
            )
            .subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [isAdmin, loadPreorders]);


    const issue = React.useCallback(
        async (po: Preorder) => {
            if (!po.gift_id) return toast({ title: "La orden no tiene gift_id", variant: "destructive" });
            setIssuing(po.id);
            try {
                const headers = { ...(await authHeader()), "Content-Type": "application/json" };
                const body = JSON.stringify({
                    preorder_id: po.id,
                    template_gift_id: po.gift_id,
                    gift_name: po.gift_name,
                    gift_value: po.gift_value,
                    recipient_name: po.buyer_name,
                    recipient_email: po.buyer_email,
                    recipient_phone: po.buyer_phone,
                    // expires_at: new Date(Date.now()+31536000000).toISOString(), // opcional: +12 meses
                });
                const r = await fetch("/api/admin/giftcards/issue", { method: "POST", headers, body });
                const j = await r.json();
                if (!r.ok || !j?.ok) throw new Error(j?.error || `HTTP ${r.status}`);

                const verifyUrl = j?.data?.verifyUrl as string;
                const code = j?.data?.code as string;
                const text =
                    `¡Gracias por tu compra! Tu Gift Card ${po.gift_name}\n` +
                    `Código: ${code}\n` +
                    `Verificación/canje: ${verifyUrl}`;

                try {
                    await navigator.clipboard.writeText(text);
                    toast({ title: "Emitida", description: "Copié el mensaje con el link al portapapeles." });
                } catch {
                    toast({ title: "Emitida", description: verifyUrl });
                }

                const issuedRow = j?.data;
                if (issuedRow?.preorder_id) {
                    setIssuedByPreorder((prev) => ({ ...prev, [issuedRow.preorder_id]: issuedRow }));
                }

                await loadPreorders();
            } catch (e: any) {
                toast({ title: "No se pudo emitir", description: e?.message, variant: "destructive" });
            } finally {
                setIssuing(null);
            }
        },
        [authHeader, loadPreorders, toast]
    );

    /* =========================
       Carga de PLANTILLAS (giftcards)
       ========================= */
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
            if (ok) {
                await Promise.all([loadList(), loadPreorders()]);
            }
        })();
        return () => {
            alive = false;
        };
    }, [user, loadList, loadPreorders]);

    // realtime one-time para plantillas
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

    // form helpers (plantillas)
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
        let publicUrl = gc.image_url || "";
        let dataUrl = "";

        if (!publicUrl) {
            publicUrl = await generateAndUploadImage(gc);
            const { error } = await supabase
                .from("giftcards")
                .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
                .eq("id", gc.id);
            if (error) console.warn("No se pudo actualizar image_url:", error);
            await loadList();
        }

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

        return { publicUrl, dataUrl };
    }

    async function shareWhatsApp(gc: GiftcardDb) {
        try {
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

        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.left = "-99999px";
        container.style.top = "-99999px";
        renderRef.current.appendChild(container);

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

    // save (plantilla) — encola y drena
    async function save() {
        if (!name) {
            toast({ title: "Campos requeridos", description: "El nombre es obligatorio.", variant: "destructive" });
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

    // delete (plantilla)
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

    /* =========================================================
       UI
       ========================================================= */
    return (
        <main className="container mx-auto max-w-6xl px-4 py-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Administrar giftcards</h1>
                <Button onClick={openCreate}>+ Nueva giftcard</Button>
            </div>

            {/* ===================== ÓRDENES / PREORDERS ===================== */}
            <section className="mt-8">
                <h2 className="text-lg font-semibold">Órdenes</h2>
                <p className="text-xs text-neutral-500 mb-3">
                    Marcar pago y emitir código/QR para verificación y canje.
                </p>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="min-w-[860px] w-full text-sm">
                        <thead className="bg-neutral-50 text-left">
                            <tr>
                                <th className="py-2 px-3">Fecha</th>
                                <th className="py-2 px-3">Comprador</th>
                                <th className="py-2 px-3">Gift</th>
                                <th className="py-2 px-3">Estado</th>
                                <th className="py-2 px-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {poLoading ? (
                                <tr>
                                    <td className="py-6 px-3 text-neutral-500" colSpan={5}>
                                        Cargando…
                                    </td>
                                </tr>
                            ) : poRows.length === 0 ? (
                                <tr>
                                    <td className="py-6 px-3 text-neutral-500" colSpan={5}>
                                        Sin órdenes por ahora.
                                    </td>
                                </tr>
                            ) : (

                                poRows.map((po) => {
                                    // 👇 tomado del map local en memoria cargado de giftcards_issued
                                    const issued = issuedByPreorder[po.id]; // puede no existir
                                    const isRedeemed = issued?.status === "redeemed";
                                    const isActiveIssued = issued?.status === "active";

                                    return (
                                        <tr key={po.id} className="border-t">
                                            <td className="py-2 px-3">
                                                {new Date(po.created_at).toLocaleString()}
                                            </td>

                                            <td className="py-2 px-3">
                                                <div className="font-semibold">{po.buyer_name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {po.buyer_email} · {po.buyer_phone}
                                                </div>
                                            </td>

                                            <td className="py-2 px-3">
                                                <div className="font-semibold">{po.gift_name}</div>
                                                <div className="text-xs text-gray-500">
                                                    ${Number(po.gift_value || 0).toLocaleString("es-AR")}
                                                </div>
                                            </td>



                                            {/* ======== ESTADO ======== */}
                                            <td className="py-2 px-3">
                                                {(() => {
                                                    // preferí el estado calculado por el server
                                                    const st = (po as any).computed_status ?? po.status;

                                                    if (st === "used") {
                                                        return (
                                                            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-xs">
                                                                usada
                                                            </span>
                                                        );
                                                    }
                                                    if (st === "active") {
                                                        return (
                                                            <span className="rounded-full bg-sky-50 text-sky-700 px-2 py-1 text-xs">
                                                                código activo
                                                            </span>
                                                        );
                                                    }
                                                    // fallback para pending/paid/sent/cancelled
                                                    return (
                                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                            {st}
                                                        </span>
                                                    );
                                                })()}
                                            </td>



                                            {/* ======== ACCIONES ======== */}
                                            <td className="py-2 px-3 text-right space-x-2">
                                                {/* Eliminar preorden */}
                                                <Button
                                                    variant="outline"
                                                    className="mr-2"
                                                    onClick={() => deletePreorder(po.id)}
                                                >
                                                    Eliminar
                                                </Button>

                                                {/* Marcar pagada si sigue pending */}
                                                {po.status === "pending" && !isRedeemed && (
                                                    <Button variant="outline" onClick={() => markPaid(po.id)}>
                                                        Marcar pagada
                                                    </Button>
                                                )}

                                                {/* Emitir código solo si NO está canjeada */}
                                                <Button
                                                    className="bg-boa-green text-white"
                                                    onClick={() => issue(po)}
                                                    disabled={issuing === po.id || isRedeemed}
                                                >
                                                    {isRedeemed ? "Ya canjeada" : issuing === po.id ? "Emitiendo..." : (isActiveIssued ? "Re-emitir código" : "Emitir código")}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })


                            )}
                        </tbody>

                    </table>
                </div>
            </section>

            {/* ===================== PLANTILLAS / GIFT CARDS ===================== */}
            <div className="mt-10 overflow-x-auto rounded-xl border">
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
                            <tr>
                                <td className="py-6 px-3 text-neutral-500" colSpan={5}>
                                    Cargando…
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td className="py-6 px-3 text-neutral-500" colSpan={5}>
                                    Sin giftcards.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="py-2 px-3">{r.name}</td>
                                    <td className="py-2 px-3">${Number(r.value ?? 0).toLocaleString("es-AR")}</td>
                                    <td className="py-2 px-3">{r.is_active ? "Sí" : "No"}</td>
                                    <td className="py-2 px-3">
                                        {r.updated_at ? new Date(r.updated_at).toLocaleString("es-AR") : "-"}
                                    </td>
                                    <td className="py-2 px-3 flex flex-wrap gap-2">
                                        <Button variant="outline" onClick={() => openEdit(r)}>
                                            Editar
                                        </Button>
                                        <Button variant="secondary" onClick={() => shareWhatsApp(r)}>
                                            Enviar por WhatsApp
                                        </Button>
                                        <Button variant="outline" onClick={() => copyGiftcardImage(r)}>
                                            Copiar imagen
                                        </Button>
                                        <Button variant="outline" onClick={() => downloadGiftcardImage(r)}>
                                            Descargar PNG
                                        </Button>
                                        <Button variant="destructive" onClick={() => removeOne(r.id)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal crear/editar plantilla */}
            {open && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 overflow-y-auto overscroll-contain">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-y-auto max-h-[90vh] overscroll-contain">
                        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b bg-white">
                            <h3 className="text-lg font-semibold">
                                {editingId ? "Editar giftcard" : "Nueva giftcard"}
                            </h3>
                            <button
                                className="text-sm text-neutral-500 hover:text-black"
                                onClick={() => {
                                    setOpen(false);
                                    resetForm();
                                }}
                            >
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
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
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

                                <div className="sm:col-span-2 grid gap-1">
                                    <label className="text-sm">Beneficios (separados por coma)</label>
                                    <Input
                                        value={benefits}
                                        onChange={(e) => setBenefits(e.target.value)}
                                        placeholder="Ej: 3 cafés, 1 taller, descuento en granos"
                                    />
                                </div>

                                <div className="sm:col-span-2 grid gap-1">
                                    <label className="text-sm">
                                        Imagen / Diseño (URL pública) <span className="text-red-500 font-semibold">NO TOCAR</span>
                                    </label>
                                    <Input
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <p className="text-xs text-neutral-500">
                                        Tip: subí tu diseño a Supabase Storage o Cloudinary y pegá la URL (WhatsApp
                                        mostrará el preview).
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
                                        />
                                        Activa
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 z-10 px-5 py-4 border-t bg-white/95 backdrop-blur">
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setOpen(false);
                                        resetForm();
                                    }}
                                >
                                    Cancelar
                                </Button>
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
