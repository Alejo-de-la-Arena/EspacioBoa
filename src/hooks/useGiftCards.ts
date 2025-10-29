"use client";
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";
import type { GiftCard } from "@/types";

function normalize(row: any): GiftCard {
    return {
        id: String(row.id),
        name: row.name ?? "",
        description: row.description ?? null,
        value: Number(row.value ?? 0),
        benefits: Array.isArray(row.benefits) ? row.benefits : [],
        image_url: row.image_url ?? null,
        is_active: row.is_active ?? null,
    };
}

export function useGiftCards() {
    const [giftCards, setGiftCards] = React.useState<GiftCard[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from("giftcards")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (error) {
            setError(error.message);
            setGiftCards([]);
        } else {
            setGiftCards((data ?? []).map(normalize));
        }
        setLoading(false);
    }, []);

    React.useEffect(() => {
        let alive = true;
        (async () => {
            await load();
            // Realtime público (escucha INSERT/UPDATE/DELETE)
            const ch = supabase
                .channel("rt-giftcards-public")
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "giftcards" },
                    (payload) => {
                        // Solo reflejamos cambios que afecten al filtro is_active=true
                        setGiftCards((prev) => {
                            const next = [...prev];
                            if (payload.eventType === "INSERT") {
                                const row = normalize(payload.new);
                                if (row.is_active) {
                                    if (!next.find((g) => g.id === row.id)) next.unshift(row);
                                }
                            } else if (payload.eventType === "UPDATE") {
                                const row = normalize(payload.new);
                                const idx = next.findIndex((g) => g.id === row.id);
                                const isActive = !!row.is_active;
                                if (idx >= 0) {
                                    if (isActive) {
                                        next[idx] = row; // actualizar
                                    } else {
                                        next.splice(idx, 1); // se desactivó -> sacarla
                                    }
                                } else if (isActive) {
                                    next.unshift(row); // estaba fuera y ahora entra al filtro
                                }
                            } else if (payload.eventType === "DELETE") {
                                const id = String(payload.old?.id);
                                const idx = next.findIndex((g) => g.id === id);
                                if (idx >= 0) next.splice(idx, 1);
                            }
                            return next;
                        });
                    }
                )
                .subscribe();

            return () => {
                if (!alive) return;
                try {
                    supabase.removeChannel(ch);
                } catch { }
            };
        })();

        return () => {
            alive = false;
        };
    }, [load]);

    return { giftCards, loading, error, reload: load };
}
