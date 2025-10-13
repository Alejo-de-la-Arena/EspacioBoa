// hooks/useActivitiesLive.ts
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Activity } from "@/types";

type Row = {
    id: string;
    slug?: string | null;
    title: string | null;
    description?: string | null;
    start_at?: string | null;
    end_at?: string | null;
    capacity?: number | null;
    price?: number | null;
    is_published?: boolean | null;
    // ⛔️ created_by fuera (no lo pedimos más para evitar 400)
    category?: string | null;
    location?: string | null;
    hero_image?: string | null;
    gallery?: any; // jsonb con array o string
    featured?: boolean | null;
};

function deriveScheduleFromStart(startISO?: string | null) {
    if (!startISO) return { day: "—", time: "—" };
    const d = new Date(startISO);
    const day = d.toLocaleDateString("es-AR", { weekday: "long" }) || "—";
    const prettyDay = day.charAt(0).toUpperCase() + day.slice(1);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return { day: prettyDay, time: `${hh}:${mm}` };
}

function coerceGallery(g: unknown): string[] {
    if (!g) return [];
    if (Array.isArray(g)) return g.filter(Boolean).map(String);
    if (typeof g === "string") return [g];
    // si viene un objeto {urls:[...]} o similar
    if (typeof g === "object" && g !== null) {
        const maybe = (g as any).urls || (g as any).images || (g as any).gallery;
        if (Array.isArray(maybe)) return maybe.filter(Boolean).map(String);
    }
    return [];
}

function mapRow(r: Row): Activity {
    const gallery = coerceGallery(r.gallery);
    const imagesFromProp: string[] = Array.isArray((r as any).images) ? (r as any).images : [];
    const images = imagesFromProp.length
        ? imagesFromProp
        : r.hero_image
            ? [r.hero_image, ...gallery.filter((u) => u !== r.hero_image)]
            : gallery;

    return {
        id: r.id,
        slug: r.slug ?? undefined,
        title: r.title ?? "",
        description: r.description ?? "",
        images,
        image: images[0],
        category: r.category ?? "General",
        price: r.price ?? undefined,
        featured: !!r.featured,
        schedule: deriveScheduleFromStart(r.start_at ?? undefined),
        location: r.location ?? "Espacio BOA",
        enrolled: 0, // ❗️el conteo real lo resolvés en el detalle con el RPC
        capacity: r.capacity ?? 0,
        instructor: undefined,
        start_at: r.start_at ?? undefined,
        end_at: r.end_at ?? undefined,
        is_published: r.is_published ?? undefined,
        hero_image: r.hero_image ?? undefined,
        gallery,
    };
}

async function fetchActivitiesOnce(publishedOnly: boolean): Promise<Activity[]> {
    // Vamos directo a la tabla base para evitar 400 por columnas inexistentes en la vista
    let query = supabase
        .from("activities")
        .select(
            // ❗️SIN created_by
            "id, slug, title, description, start_at, end_at, capacity, price, is_published, category, location, hero_image, gallery, featured"
        )
        .order("start_at", { ascending: true })
        .limit(500);

    if (publishedOnly) query = query.eq("is_published", true);

    const { data, error } = await query;
    if (error) throw error;

    const rows: Row[] = (data ?? []) as any;
    return rows.map(mapRow);
}

type Options = { publishedOnly?: boolean };

export function useActivitiesLive(opts?: Options) {
    const { publishedOnly = true } = opts || {};
    const [activities, setActivities] = React.useState<Activity[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchActivitiesOnce(publishedOnly);
            setActivities(data);
            setError(null);
        } catch (e: any) {
            console.error("useActivitiesLive load error", e);
            setError(e?.message ?? "Error");
        } finally {
            setLoading(false);
        }
    }, [publishedOnly]);

    React.useEffect(() => {
        load();

        // Realtime sobre la tabla base
        const ch = supabase
            .channel("activities-live")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "activities" },
                () => {
                    // Re-cargar lista cuando hay cambios
                    load();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(ch);
        };
    }, [load]);

    return { activities, loading, error, reload: load };
}
