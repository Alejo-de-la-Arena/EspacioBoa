// src/stores/useAuth.ts
"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

type Role = "admin" | "user" | null;

type AuthState = {
    loading: boolean;      
    initialized: boolean;  
    user: any | null;
    role: Role;

    // Setters utilitarios
    applyUser: (user: any | null) => void;
    setUserFromSession: () => Promise<void>;

    // Acciones
    signOut: () => Promise<void>;
};

const adminSet = new Set(
    (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
);

export const useAuth = create<AuthState>((set) => ({
    loading: true,
    initialized: false,
    user: null,
    role: null,

    applyUser: (user) => {
        const email = user?.email?.toLowerCase() ?? "";
        const role: Role = user ? (adminSet.has(email) ? "admin" : "user") : null;
        set({ user, role, loading: false, initialized: true });
    },

    setUserFromSession: async () => {
        // Para el primer paint es más estable que getUser()
        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user ?? null;
        const email = user?.email?.toLowerCase() ?? "";
        const role: Role = user ? (adminSet.has(email) ? "admin" : "user") : null;
        set({ user, role, loading: false, initialized: true });
    },

    signOut: async () => {
        set({ loading: true });                // feedback optimista
        await supabase.auth.signOut();
        set({ user: null, role: null, loading: false, initialized: true });
    },
}));
