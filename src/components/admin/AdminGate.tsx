// src/components/auth/AdminGate.tsx
"use client";

import { useAuth } from "@/stores/useAuth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminGate({ children }: { children: React.ReactNode }) {
    const { initialized, role } = useAuth();

    // Esperar a que Auth termine de inicializar SIEMPRE
    if (!initialized) {
        return (
            <div className="grid place-items-center h-60 text-neutral-600">
                <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                Verificando sesión…
            </div>
        );
    }

    // Ya inicializado → check de rol
    if (role !== "admin") {
        return (
            <div className="text-center rounded-xl border p-8">
                <h1 className="text-xl font-semibold">Acceso restringido</h1>
                <p className="mt-2 text-neutral-600">Necesitás permisos de administrador.</p>
                <Button asChild className="mt-4"><Link href="/">Volver al inicio</Link></Button>
            </div>
        );
    }

    return <>{children}</>;
}
