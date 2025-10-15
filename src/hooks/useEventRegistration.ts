import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";

type UseEventRegistration = {
    loading: boolean;
    isRegistered: boolean;
    spotsLeft: number | null;
    totalCapacity: number | null;
    register: () => Promise<void>;
    cancel: () => Promise<void>;
    refresh: () => Promise<void>;
};

export function useEventRegistration(eventId: string): UseEventRegistration {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
    const [totalCapacity, setTotalCapacity] = useState<number | null>(null);

    const fetchBasics = useCallback(async () => {
        if (!eventId) return;

        // capacidad total
        const { data: eventData, error: evErr } = await supabase
            .from("events")
            .select("capacity")
            .eq("id", eventId)
            .maybeSingle();

        if (!evErr && eventData) {
            setTotalCapacity(eventData.capacity ?? 0);
        }

        // cupos restantes (RPC)
        const { data: left, error: leftErr } = await supabase
            .rpc("event_spots_left", { eid: eventId });

        if (!leftErr) setSpotsLeft(typeof left === "number" ? left : 0);

        // ¿está inscripto?
        if (user) {
            const { data: reg, error: regErr } = await supabase
                .from("event_registrations")
                .select("id")
                .eq("event_id", eventId)
                .eq("user_id", user.id)
                .maybeSingle();

            if (!regErr) setIsRegistered(Boolean(reg));
        }
    }, [eventId, user]);

    const refresh = useCallback(async () => {
        setLoading(true);
        await fetchBasics();
        setLoading(false);
    }, [fetchBasics]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // Realtime: cuando alguien se inscribe o cancela en este evento
    useEffect(() => {
        if (!eventId) return;

        const channel = supabase
            .channel(`event-registrations:${eventId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "event_registrations", filter: `event_id=eq.${eventId}` },
                () => refresh()
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "events", filter: `id=eq.${eventId}` },
                () => refresh()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [eventId, refresh]);

    const register = useCallback(async () => {
        if (!user) throw new Error("Debes iniciar sesión.");
        setLoading(true);
        const { error } = await supabase.rpc("register_for_event", { eid: eventId });
        if (error) {
            setLoading(false);
            // Errores esperables desde la función
            if (error.message.includes("event_full")) throw new Error("El evento está completo.");
            if (error.message.includes("event_not_found")) throw new Error("El evento no existe.");
            throw error;
        }
        await refresh();
        setLoading(false);
    }, [eventId, refresh, user]);

    const cancel = useCallback(async () => {
        if (!user) throw new Error("Debes iniciar sesión.");
        setLoading(true);
        const { error } = await supabase.rpc("cancel_event_registration", { eid: eventId });
        if (error) {
            setLoading(false);
            throw error;
        }
        await refresh();
        setLoading(false);
    }, [eventId, refresh, user]);

    return { loading, isRegistered, spotsLeft, totalCapacity, register, cancel, refresh };
}
