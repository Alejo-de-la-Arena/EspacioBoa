import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

type Role = "admin" | "user" | null;

type AuthState = {
    loading: boolean;      // carga transitoria (consultas / transiciones)
    initialized: boolean;  // auth ya se resolvió al menos una vez
    user: any | null;
    role: Role;
    setUserFromSession: () => Promise<void>;
    applyUser: (user: any | null) => void;
    signOut: () => Promise<void>;
};

const adminSet = new Set(
    (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
        .split(",")
        .map(e => e.trim().toLowerCase())
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
        // getSession es más determinista que getUser en el primer paint
        const { data, error } = await supabase.auth.getSession();
        const user = data?.session?.user ?? null;
        const email = user?.email?.toLowerCase() ?? "";
        const role: Role = user ? (adminSet.has(email) ? "admin" : "user") : null;
        set({ user, role, loading: false, initialized: true });
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, role: null, loading: false, initialized: true });
    },
}));
