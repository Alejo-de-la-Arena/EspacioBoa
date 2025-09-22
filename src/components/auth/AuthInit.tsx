"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";

export default function AuthInit() {
    const setUserFromSession = useAuth((s) => s.setUserFromSession);

    useEffect(() => {
        // Carga sesión al montar
        setUserFromSession();

        // Suscribe a cambios de auth (login/logout/refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => setUserFromSession());

        return () => subscription.unsubscribe();
    }, [setUserFromSession]);

    return null;
}
