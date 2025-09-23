// src/components/auth/HeaderAuth.tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/stores/useAuth";
import UserMenu from "./UserMenu";

export default function HeaderAuth() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="w-32 h-9 rounded-md bg-neutral-200 animate-pulse" />;
    }

    return user ? (
        <UserMenu />      // 👈 sin props
    ) : (
        <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 rounded-md border">Iniciar sesión</Link>
            <Link href="/register" className="px-3 py-1.5 rounded-md bg-boa-green text-white">Crear cuenta</Link>
        </div>
    );
}
