import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

type Role = "admin" | "user" | null;

type AuthState = {
    loading: boolean;
    user: any | null;
    role: Role;
    setUserFromSession: () => Promise<void>;
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
    user: null,
    role: null,
    setUserFromSession: async () => {
        const { data } = await supabase.auth.getUser();
        const user = data.user ?? null;
        const email = user?.email?.toLowerCase() ?? "";
        const role: Role = user ? (adminSet.has(email) ? "admin" : "user") : null;
        set({ user, role, loading: false });
    },
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, role: null, loading: false });
    },
}));
