import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

type Kind = "activity" | "event";
type PublicRow = {
    id: string;
    title: string;
    description?: string;
    start_at: string;
    end_at: string;
    capacity: number;
    price: number | null;
    is_published: boolean;
    seats_remaining: number;
    is_full: boolean;
};

export function useOffering(kind: Kind, id: string | undefined) {
    const [data, setData] = useState<PublicRow | null>(null);
    const [loading, setLoading] = useState(true);

    const fetcher = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        const view = kind === "activity" ? "activity_public" : "event_public";
        const { data, error } = await supabase
            .from(view)
            .select("*")
            .eq("id", id)
            .single();
        if (error) console.error(error);
        setData((data as any) ?? null);
        setLoading(false);
    }, [id, kind]);

    useEffect(() => { fetcher(); }, [fetcher]);

    // Realtime: escuchar inscripciones del item
    useEffect(() => {
        if (!id) return;
        const channel = supabase
            .channel(`regs-${kind}-${id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "registrations",
                    filter: kind === "activity" ? `activity_id=eq.${id}` : `event_id=eq.${id}`,
                },
                () => fetcher()
            )
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [id, kind, fetcher]);

    return { data, loading, refetch: fetcher };
}
