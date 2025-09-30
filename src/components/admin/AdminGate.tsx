"use client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function AdminGate({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading } = useIsAdmin();

    if (loading) {
        return (
            <div className="grid place-items-center h-60 text-neutral-600">
                <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                Verificando permisos…
            </div>
        );
    }
    if (!isAdmin) {
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
