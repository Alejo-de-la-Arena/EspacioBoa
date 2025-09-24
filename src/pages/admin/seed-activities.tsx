// pages/admin/seed-activities.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";

type MockActivity = {
    id: string;
    slug?: string;
    title: string;
    description?: string;
    schedule?: { day?: string; time?: string }; // ej.: "Lunes", "18:30", "18hs"
    location?: string;
    capacity?: number;
    price?: number;
    category?: string;
    featured?: boolean;
    image?: string;
    images?: string[];
};

const DOW: Record<string, number> = {
    dom: 0, domingo: 0,
    lun: 1, lunes: 1,
    mar: 2, martes: 2,
    mie: 3, mié: 3, miercoles: 3, miércoles: 3,
    jue: 4, jueves: 4,
    vie: 5, viernes: 5,
    sab: 6, sáb: 6, sabado: 6, sábado: 6,
};

function parseDay(input?: string): number | null {
    if (!input) return null;
    const key = input.trim().toLowerCase();
    return DOW[key] ?? null;
}

function parseTime(input?: string): { h: number; m: number } | null {
    if (!input) return null;
    const s = input.trim().toLowerCase().replace(/\s+/g, "");
    // acepta 18:00, 18.00, 18h, 18hs, 18
    const m = s.match(/^(\d{1,2})(?::|\.|h|hs)?(\d{1,2})?$/);
    if (!m) return null;
    const h = Number(m[1]);
    let min = m[2] ? Number(m[2]) : 0;
    if (Number.isNaN(h) || h < 0 || h > 23) return null;
    if (Number.isNaN(min) || min < 0 || min > 59) min = 0;
    return { h, m: min };
}

function nextDateFor(day?: string, time?: string) {
    const now = new Date();

    const parsedDay = parseDay(day);
    const parsedTime = parseTime(time);

    // Fallback seguro: +2 días 18:00
    const fallbackStart = new Date(now);
    fallbackStart.setDate(now.getDate() + 2);
    fallbackStart.setHours(18, 0, 0, 0);
    const fallbackEnd = new Date(fallbackStart.getTime() + 60 * 60 * 1000);

    if (parsedDay === null || parsedTime === null) {
        return { start: fallbackStart, end: fallbackEnd, usedFallback: true };
    }

    const start = new Date(now);
    const delta = ((parsedDay - now.getDay() + 7) % 7) || 7;
    start.setDate(now.getDate() + delta);
    start.setHours(parsedTime.h, parsedTime.m, 0, 0);

    if (Number.isNaN(start.getTime())) {
        return { start: fallbackStart, end: fallbackEnd, usedFallback: true };
    }
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return { start, end, usedFallback: false };
}

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function SeedActivities() {
    const router = useRouter();
    const { activities } = useApp(); // tu fuente actual
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [sending, setSending] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [debugNote, setDebugNote] = useState<string>("");

    // Verifica login y admin
    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            if (!data?.user) {
                router.push("/login");
                return;
            }
            const { data: pr } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", data.user.id)
                .single();
            setIsAdmin(Boolean(pr?.is_admin));
        })();
    }, [router]);

    // Construye payload SOLO si sos admin y hay actividades
    useEffect(() => {
        if (!isAdmin) return;
        if (!Array.isArray(activities) || activities.length === 0) {
            setRows([]);
            setDebugNote("No se encontraron actividades en el contexto.");
            return;
        }

        const items = (activities as MockActivity[]).map((a) => {
            const s = nextDateFor(a.schedule?.day, a.schedule?.time);
            if (s.usedFallback) {
                // deja una pista por si querés revisar
                setDebugNote("Algunas actividades usaron fecha/hora por defecto (2 días + 18:00) por formato no reconocible.");
            }
            return {
                slug: slugify(a.slug || a.title),
                title: a.title,
                description: a.description || "",
                start_at: s.start.toISOString(),
                end_at: s.end.toISOString(),
                capacity: a.capacity ?? 12,
                price: String(a.price ?? 0),
                is_published: true,
                category: a.category || "General",
                location: a.location || "Espacio BOA",
                hero_image: a.image || a.images?.[0] || "",
                gallery: a.images || (a.image ? [a.image] : []),
                featured: Boolean(a.featured),
            };
        });

        setRows(items);
    }, [isAdmin, activities]);

    const seed = async () => {
        if (!isAdmin) return;
        try {
            setSending(true);
            const { error } = await supabase.rpc("upsert_activities", { p_items: rows as any });
            if (error) throw error;
            alert("¡Actividades sincronizadas!");
        } catch (e: any) {
            alert(`Error al subir: ${e.message ?? e}`);
        } finally {
            setSending(false);
        }
    };

    if (isAdmin === null) return <div className="p-6">Verificando permisos…</div>;
    if (!isAdmin) return <div className="p-6">Necesitás ser administrador.</div>;

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-3">Seed de actividades (admin)</h1>
            {debugNote && <p className="text-sm text-amber-700 mb-2">{debugNote}</p>}
            <p className="text-sm opacity-70 mb-4">
                Se subirán/actualizarán {rows.length} actividades en Supabase por <code>slug</code>.
            </p>
            <Button onClick={seed} disabled={sending || rows.length === 0} className="bg-boa-green hover:bg-boa-green/90">
                {sending ? "Subiendo…" : "Subir / Actualizar"}
            </Button>

            {rows[0] && (
                <pre className="mt-6 text-xs bg-black/5 p-3 rounded">
                    {JSON.stringify(rows[0], null, 2)}
                </pre>
            )}
        </div>
    );
}
