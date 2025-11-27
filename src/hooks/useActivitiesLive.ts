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

    // columnas propias de activity_public
    created_by?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    confirmed_count?: number | null;
    seats_remaining?: number | null;
    is_full?: boolean | null;

    // columnas extra que traemos de activities
    category?: string | null;
    location?: string | null;
    hero_image?: string | null;
    gallery?: any;
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

    const capacity = r.capacity ?? 0;
    const enrolled = r.confirmed_count ?? 0;

    const seatsRemaining =
        typeof r.seats_remaining === "number"
            ? r.seats_remaining
            : capacity > 0
                ? Math.max(0, capacity - enrolled)
                : undefined;

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
        enrolled,
        capacity,
        seatsRemaining,
        instructor: undefined,
        start_at: r.start_at ?? undefined,
        end_at: r.end_at ?? undefined,
        is_published: r.is_published ?? undefined,
        hero_image: r.hero_image ?? undefined,
        gallery,
    };
}

async function fetchActivitiesOnce(publishedOnly: boolean): Promise<Activity[]> {
    // 1) Traemos datos base + cupos desde activity_public
    let baseQuery = supabase
        .from("activity_public")
        .select("*")
        .order("start_at", { ascending: true })
        .limit(500);

    if (publishedOnly) {
        baseQuery = baseQuery.eq("is_published", true);
    }

    const { data: baseData, error } = await baseQuery;
    if (error) {
        console.error("fetchActivitiesOnce base error", error);
        throw error;
    }

    const rowsBase = (baseData ?? []) as Row[];

    // si no hay actividades, devolvemos vacío
    if (!rowsBase.length) return [];

    // 2) Traemos extras (hero_image, gallery, category, location, featured) desde activities
    const ids = rowsBase.map((r) => r.id);

    const { data: extraData, error: extraError } = await supabase
        .from("activities")
        .select("id, category, location, hero_image, gallery, featured")
        .in("id", ids);

    if (extraError) {
        // no rompemos todo si falla, solo logueamos y seguimos con lo básico
        console.error("fetchActivitiesOnce extras error", extraError);
    }

    const extrasMap = new Map<string, Partial<Row>>();
    (extraData ?? []).forEach((e: any) => {
        extrasMap.set(e.id, e);
    });

    // 3) Mergeamos base + extras por id y mapeamos a Activity
    const mergedRows: Row[] = rowsBase.map((r) => {
        const extra = extrasMap.get(r.id) || {};
        return { ...r, ...extra } as Row;
    });

    return mergedRows.map(mapRow);
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

        // realtime sobre la tabla base: cuando cambia activities, recargamos
        const ch = supabase
            .channel("activities-live")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "activities" },
                () => {
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
