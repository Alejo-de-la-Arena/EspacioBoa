// src/components/auth/HeaderAuth.tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/stores/useAuth";
import UserMenu from "./UserMenu";

export default function HeaderAuth() {
    const { user, loading } = useAuth();

    if (loading) {
        // En mobile ocupa el ancho completo, en desktop mantiene ancho fijo
        return <div className="h-9 w-full md:w-32 rounded-md bg-neutral-200 animate-pulse" />;
    }

    if (user) {
        return <UserMenu />; // sin cambios para usuarios logueados
    }

    // Invitado: botones full-width apilados en mobile, inline en desktop
    return (
        <div className="w-full flex flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-2">
            <Link
                href="/login"
                className="
          inline-flex justify-center items-center
          w-full md:w-auto
          px-3 py-2.5 md:py-2 rounded-md border
          text-sm font-medium font-sans 
        "
            >
                Iniciar sesión
            </Link>

            <Link
                href="/register"
                className="
          inline-flex justify-center items-center
          w-full md:w-auto
          px-3 py-2.5 md:py-2 rounded-md bg-boa-green text-white
          text-sm font-medium font-sans 
        "
            >
                Crear cuenta
            </Link>
        </div>
    );
}
