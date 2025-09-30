"use client";
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";

export function useIsAdmin() {
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        let active = true;
        const run = async () => {
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }
            const { data } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .single();
            if (!active) return;
            setIsAdmin(Boolean(data?.is_admin));
            setLoading(false);
        };
        run();
        return () => { active = false; };
    }, [user]);

    return { isAdmin, loading, user };
}
