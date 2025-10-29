// src/app/_auth-hydrator.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";

export default function AuthHydrator() {
    const { applyUser, setUserFromSession } = useAuth();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            // Primer paint: hidratar desde getSession()
            await setUserFromSession();
            if (cancelled) return;
        })();

        // Mantener sincronizado por cambios de auth
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (cancelled) return;
            applyUser(session?.user ?? null);
        });

        return () => {
            cancelled = true;
            sub.subscription.unsubscribe();
        };
    }, [applyUser, setUserFromSession]);

    return null; // no renderiza UI
}
