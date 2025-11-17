// src/components/auth/UserMenu.tsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/stores/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { LogOut, UserRound, Ticket, Loader2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function removeSupabaseTokens() {
    try {
        for (const k of Object.keys(localStorage)) {
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
    const [isAdmin, setIsAdmin] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // --- Chequeo de admin (metadata + app_metadata + tabla profiles)
    useEffect(() => {
        let cancelled = false;

        const metaAdmin =
            user?.user_metadata?.is_admin === true ||
            user?.user_metadata?.role === "admin" ||
            (Array.isArray(user?.app_metadata?.roles) &&
                user!.app_metadata!.roles!.includes("admin"));

        if (metaAdmin) {
            setIsAdmin(true);
            return;
        }

        if (!user?.id) {
            setIsAdmin(false);
            return;
        }

        // Consulta a profiles.is_admin (RLS: debe existir policy de "own row")
        const checkAdminFromProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("is_admin")
                    .eq("id", user.id)
                    .single();

                if (cancelled) return;

                if (error) {
                    setIsAdmin(false);
                    return;
                }

                setIsAdmin(Boolean(data?.is_admin));
            } catch {
                if (!cancelled) setIsAdmin(false);
            }
        };

        checkAdminFromProfile();

        return () => {
            cancelled = true;
        };
    }, [user?.id]);


    const avatarUrl =
        user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        user?.user_metadata?.image ||
        "";

    const doLogout = () => {
        // 1) UI inmediata
        setBusy(true);
        try {
            triggerRef.current?.blur();
        } catch { }

        // 2) Limpieza defensiva antes de navegar
        removeSupabaseTokens();
        Promise.resolve(signOut()).catch(() => { });

        // 3) SignOut Supabase en background (no bloquea)
        Promise.resolve(supabase.auth.signOut({ scope: "local" })).catch(() => { });
        Promise.resolve(supabase.auth.signOut({ scope: "global" })).catch(() => { });

        // 4) Feedback
        toast({ title: "Sesión cerrada", description: "Redirigiendo al inicio…" });

        // 5) Redirección dura con cache-buster
        const url = `${window.location.origin}/?signedout=${Date.now()}`;
        try {
            window.location.replace(url);
        } catch { }

        // 6) Fallbacks
        setTimeout(() => {
            try {
                if (window.location.href !== url) window.location.href = url;
            } catch { }
        }, 120);
        setTimeout(() => {
            try {
                if (window.location.href !== url) window.location.assign(url);
            } catch { }
        }, 240);
        setTimeout(() => {
            try {
                window.location.reload();
            } catch { }
            setBusy(false);
        }, 700);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    ref={triggerRef}
                    className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 shadow-sm bg-white hover:bg-neutral-50 font-sans"
                    aria-label="Abrir menú de usuario"
                >
                    <Avatar className="h-8 w-8">
                        {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={user?.email || "Usuario"} />
                        ) : null}
                        <AvatarFallback className="text-[12px] font-sans">
                            {initialsFrom(user)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-neutral-700 font-sans">
                        {user?.user_metadata?.display_name || user?.email}
                    </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-60 font-sans"
                    style={{ fontFamily: "var(--font-sans), Inter, system-ui, sans-serif" }}
                >
                    <DropdownMenuLabel className="truncate font-sans">
                        {user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Mi perfil */}
                    <DropdownMenuItem asChild >
                        <Link href="/account" className="flex items-center gap-2 font-sans">
                            <UserRound className="h-4 w-4" /> Mi perfil
                        </Link>
                    </DropdownMenuItem>

                    {/* Mis inscripciones */}
                    <DropdownMenuItem asChild className="font-sans">
                        <Link
                            href="/account/inscripciones"
                            className="flex items-center gap-2 font-sans"
                        >
                            <Ticket className="h-4 w-4" /> Mis inscripciones
                        </Link>
                    </DropdownMenuItem>

                    {/* Administrar (solo admins) */}
                    {isAdmin && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="font-sans">
                                <Link href="/admin" className="flex items-center gap-2 font-sans">
                                    <Settings className="h-4 w-4" /> Administrar BOA
                                </Link>
                            </DropdownMenuItem>
                        </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            doLogout();
                        }}
                        className="text-red-600 focus:text-red-600 font-sans"
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
                        <h3 className="text-lg font-semibold font-sans">Cerrando sesión…</h3>
                        <p className="mt-1 text-sm text-neutral-600 font-sans">
                            Un segundo, por favor.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
