// src/components/auth/UserMenu.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/stores/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { LogOut, UserRound, Ticket, Settings, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // ⬅️ ruta correcta
import { useRouter } from "next/router"; // ✅ Pages Router


import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function initialsFrom(user: any) {
    const name =
        user?.user_metadata?.display_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "";
    const parts = String(name).trim().split(/\s+/);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function removeSupabaseTokens() {
    try {
        const keys = Object.keys(localStorage);
        for (const k of keys) {
            if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
                localStorage.removeItem(k);
            }
        }
    } catch { }
}

export default function UserMenu() {
    const { user, signOut } = useAuth();
    const { toast } = useToast();
    const [busy, setBusy] = useState(false);
    const router = useRouter();


    const avatarUrl =
        user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        user?.user_metadata?.image ||
        "";

    const doLogout = async () => {
        setBusy(true); // muestra overlay

        // Pequeño helper: recarga "a prueba de balas"
        const hardReloadHome = () => {
            const url = `${window.location.origin}/`;

            // 1) replace (no agrega historial)
            try { window.location.replace(url); } catch { }

            // 2) href (si replace fue bloqueado)
            setTimeout(() => {
                try { if (window.location.pathname !== "/") window.location.href = url; } catch { }
            }, 120);

            // 3) assign (otro intento)
            setTimeout(() => {
                try { if (window.location.pathname !== "/") window.location.assign(url); } catch { }
            }, 240);

            // 4) reload como último recurso
            setTimeout(() => {
                try { if (window.location.pathname !== "/") window.location.reload(); } catch { }
                // si absolutamente todo falla, apagamos el overlay para no dejarlo colgado
                setBusy(false);
            }, 600);
        };

        try {
            // no queremos quedar colgados si la promesa tarda (adblock/red)
            await Promise.race([
                supabase.auth.signOut(),
                new Promise((resolve) => setTimeout(resolve, 400)), // timeout "optimista"
            ]);
        } catch {
            // ignoramos errores de red/extensiones
        } finally {
            // limpieza defensiva de tokens + estado global
            removeSupabaseTokens();
            await signOut();

            // feedback visual (opcional, si usás toast)
            toast({
                title: "Sesión cerrada",
                description: "Redirigiendo al inicio…",
            });

            // forzamos navegación/reload
            hardReloadHome();
        }
    };




    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 shadow-sm bg-white hover:bg-neutral-50"
                    aria-label="Abrir menú de usuario"
                >
                    <Avatar className="h-8 w-8">
                        {avatarUrl ? <AvatarImage src={avatarUrl} alt={user?.email || "Usuario"} /> : null}
                        <AvatarFallback className="text-[12px]">{initialsFrom(user)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-neutral-700">
                        {user?.user_metadata?.display_name || user?.email}
                    </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/account" className="flex items-center gap-2">
                            <UserRound className="h-4 w-4" /> Mi perfil
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/account/inscripciones" className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" /> Mis inscripciones
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => { e.preventDefault(); doLogout(); }}
                        className="text-red-600 focus:text-red-600"
                    >
                        <LogOut className="h-4 w-4" /> Cerrar sesión
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {busy && (
                <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60">
                    <div className="rounded-2xl bg-white px-6 py-5 shadow-xl w-[90%] max-w-sm text-center">
                        <div className="mx-auto mb-3 h-10 w-10 grid place-items-center rounded-full bg-emerald-100">
                            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold">Cerrando sesión…</h3>
                        <p className="mt-1 text-sm text-neutral-600">Un segundo, por favor.</p>
                    </div>
                </div>
            )}
        </>
    );
}
