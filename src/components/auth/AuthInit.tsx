// src/components/auth/AuthInit.tsx
"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";

export default function AuthInit() {
    // usamos el store “vivo” para no romper SSR/CSR y evitar re-renders innecesarios
    const { setUserFromSession, applyUser } = useAuth();
    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;

        let unsub: (() => void) | null = null;

        (async () => {
            // 1) Hidratar la sesión una sola vez al montar
            await setUserFromSession();

            // 2) Suscribirse a cambios de auth y aplicar el usuario directamente
            const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
                applyUser(session?.user ?? null);
            });
            unsub = sub?.subscription.unsubscribe ?? null;

            // 3) Revalidar al volver al tab (por si otra pestaña cambió la sesión)
            const onVis = async () => {
                if (document.visibilityState === "visible") {
                    await setUserFromSession();
                }
            };
            document.addEventListener("visibilitychange", onVis);

            // cleanup
            return () => {
                document.removeEventListener("visibilitychange", onVis);
            };
        })();

        return () => {
            if (unsub) unsub();
        };
    }, [setUserFromSession, applyUser]);

    return null;
}
