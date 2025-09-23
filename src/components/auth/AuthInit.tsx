// src/components/auth/AuthInit.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";

export default function AuthInit() {
    // usamos la API estática de zustand para evitar re-renders
    const { setUserFromSession } = useAuth.getState();

    useEffect(() => {
        let unsub: (() => void) | null = null;

        (async () => {
            // 1) Hidratar sesión al montar (esto pone loading=false adentro del store)
            await setUserFromSession();

            // 2) Reaccionar a cambios de auth (login/logout/refresh)
            const { data } = supabase.auth.onAuthStateChange(async () => {
                await setUserFromSession();
            });
            unsub = () => data.subscription.unsubscribe();

            // 3) Cuando volvés al tab, revalida (otro tab pudo cambiar sesión)
            const onVis = async () => {
                if (document.visibilityState === "visible") {
                    await setUserFromSession();
                }
            };
            document.addEventListener("visibilitychange", onVis);

            return () => {
                document.removeEventListener("visibilitychange", onVis);
                unsub?.();
            };
        })();
    }, []);

    return null;
}
