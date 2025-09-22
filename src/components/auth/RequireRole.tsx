"use client";
import { ReactNode } from "react";
import { useAuth } from "@/stores/useAuth";

export function RequireRole({ role, children }: { role?: "admin" | "user"; children: ReactNode }) {
    const { user, role: current, loading } = useAuth();
    if (loading) return null;
    if (!user) return <div className="p-6">Necesitás iniciar sesión.</div>;
    if (role && current !== role) return <div className="p-6">No tenés permisos.</div>;
    return <>{children}</>;
}
