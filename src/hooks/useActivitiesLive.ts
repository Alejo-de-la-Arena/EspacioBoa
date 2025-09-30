"use client";
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";

export type UiActivity = {
    id: string;
    title: string;
    description: string | null;
    image?: string | null;
    images?: string[];
    category: string | null;
    price: number | null;
    featured: boolean | null;
    schedule: { day: string; time: string };
    location: string | null;
    enrolled: number;           // reservas (no canceladas)
    capacity: number | null;
};

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
    gallery: any | null; // jsonb (array)
    featured: boolean | null;
};

function titleCase(s: string) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function mapDbToUi(r: ActivityDb, enrolled = 0): UiActivity {
    const start = r.start_at ? new Date(r.start_at) : null;
    const day = start
        ? titleCase(new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(start))
        : "";
    const time = start
        ? new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(start)
        : "";

    const gallery: string[] = Array.isArray(r.gallery)
        ? r.gallery.filter(Boolean)
        : r.gallery ? [String(r.gallery)] : [];

    const image = r.hero_image || gallery[0] || null;

    return {
        id: r.id,
        title: r.title,
        description: r.description,
        image,
        images: gallery.length ? gallery : image ? [image] : [],
        category: r.category,
        price: r.price ?? null,
        featured: Boolean(r.featured),
        schedule: { day, time },
        location: r.location,
        enrolled,
        capacity: r.capacity ?? null,
    };
}

export function useActivitiesLive() {
    const [activities, setActivities] = React.useState<UiActivity[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Mapa de cupos usados por activity_id
    const countsRef = React.useRef<Map<string, number>>(new Map());

    const includeRow = (row: ActivityDb) => {
        return Boolean(row.is_published); // mostrar TODAS las publicadas
        // si luego querés sólo futuras:
        // return Boolean(row.is_published) && row.start_at && new Date(row.start_at).getTime() > Date.now();
    };


    const upsertUi = (row: ActivityDb) => {
        setActivities(prev => {
            const inList = includeRow(row);
            const curr = [...prev];
            const idx = curr.findIndex(a => a.id === row.id);
            if (!inList) {
                if (idx >= 0) curr.splice(idx, 1);
                return curr;
            }
            const enrolled = countsRef.current.get(row.id) ?? 0;
            const next = mapDbToUi(row, enrolled);
            if (idx >= 0) curr[idx] = next; else curr.push(next);
            // ordenar por fecha ascendente
            curr.sort((a, b) => a.schedule.day.localeCompare(b.schedule.day) || a.title.localeCompare(b.title));
            return curr;
        });
    };

    const removeUi = (id: string) => {
        setActivities(prev => prev.filter(a => a.id !== id));
        countsRef.current.delete(id);
    };

    React.useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);

            // 1) Traer actividades publicadas y futuras
            const { data: acts, error } = await supabase
                .from("activities")
                .select("id, title, description, start_at, end_at, capacity, price, is_published, category, location, hero_image, gallery, featured")
                .eq("is_published", true)
                .order("start_at", { ascending: true });

            if (error) {
                console.error(error);
                setActivities([]);
                setLoading(false);
                return;
            }

            const ids = (acts || []).map(a => a.id);
            // 2) Traer conteos de inscriptos (no cancelados) en un solo query
            const counts = new Map<string, number>();
            if (ids.length) {
                const { data: regs, error: err2 } = await supabase
                    .from("registrations")
                    .select("activity_id, status")
                    .in("activity_id", ids);

                if (!err2 && regs) {
                    for (const r of regs) {
                        if (!r.activity_id) continue;
                        const s = String(r.status ?? "").toLowerCase();
                        const isActive = s !== "cancelled";
                        if (!isActive) continue;
                        counts.set(r.activity_id, (counts.get(r.activity_id) ?? 0) + 1);
                    }
                }
            }
            countsRef.current = counts;

            if (cancelled) return;
            setActivities((acts || []).filter(includeRow).map(a => mapDbToUi(a as ActivityDb, counts.get(a.id) ?? 0)));
            setLoading(false);
        };

        load();

        // 3) Realtime: activities
        const chA = supabase
            .channel("rt-public-activities")
            .on("postgres_changes", { event: "*", schema: "public", table: "activities" }, (payload) => {
                if (payload.eventType === "DELETE") { removeUi(payload.old.id); return; }
                const row = (payload.new || payload.old) as ActivityDb;
                upsertUi(row);
            })
            .subscribe();

        // 4) Realtime: registrations → actualizar conteo
        const chR = supabase
            .channel("rt-public-registrations")
            .on("postgres_changes", { event: "*", schema: "public", table: "registrations" }, (p: any) => {
                const oldAct = p.old?.activity_id as string | null;
                const newAct = p.new?.activity_id as string | null;
                const oldStatus = String(p.old?.status ?? "").toLowerCase();
                const newStatus = String(p.new?.status ?? "").toLowerCase();
                const wasActive = oldAct && oldStatus !== "cancelled";
                const isActive = newAct && newStatus !== "cancelled";

                const adjust = (id: string, delta: number) => {
                    const m = countsRef.current;
                    m.set(id, (m.get(id) ?? 0) + delta);
                    setActivities(prev => prev.map(a => a.id === id ? { ...a, enrolled: m.get(id) ?? 0 } : a));
                };

                if (p.eventType === "INSERT") {
                    if (isActive) adjust(newAct!, +1);
                } else if (p.eventType === "DELETE") {
                    if (wasActive) adjust(oldAct!, -1);
                } else if (p.eventType === "UPDATE") {
                    if (oldAct === newAct) {
                        if (wasActive && !isActive) adjust(newAct!, -1);
                        else if (!wasActive && isActive) adjust(newAct!, +1);
                    } else {
                        if (wasActive) adjust(oldAct!, -1);
                        if (isActive) adjust(newAct!, +1);
                    }
                }
            })
            .subscribe();

        return () => {
            cancelled = true;
            supabase.removeChannel(chA);
            supabase.removeChannel(chR);
        };
    }, []);

    return { activities, loading };
}
