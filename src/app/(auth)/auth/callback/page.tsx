"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type View = "checking" | "ok-home" | "ok-login" | "error";

// util: timeout para promesas (evita quedarse colgado)
function withTimeout<T>(p: Promise<T>, ms = 1200): Promise<T> {
    return Promise.race([
        p,
        new Promise<T>((_, rej) => setTimeout(() => rej(new Error("TIMEOUT")), ms)),
    ]) as Promise<T>;
}

export default function AuthCallback() {
    const router = useRouter();
    const [view, setView] = useState<View>("checking");
    const [detail, setDetail] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
                const hash = url?.hash ? new URLSearchParams(url.hash.slice(1)) : null;
                const access_token = hash?.get("access_token");
                const refresh_token = hash?.get("refresh_token");

                // 1) Si vienen tokens en el hash: intentamos setear sesión, pero con timeout
                if (access_token && refresh_token) {
                    try {
                        await withTimeout(
                            supabase.auth.setSession({ access_token, refresh_token }),
                            1000
                        );
                    } catch {
                        /* no importa, seguimos al siguiente paso */
                    }

                    // Chequeo de usuario con timeout
                    let isLogged = false;
                    try {
                        const { data } = await withTimeout(supabase.auth.getUser(), 800);
                        isLogged = Boolean(data?.user);
                    } catch {
                        /* noop */
                    }

                    if (isLogged) {
                        setView("ok-home");
                        setTimeout(() => router.replace("/"), 800);
                        return;
                    } else {
                        // Aun si no alcanzamos a setear sesión local, el mail ya quedó verificado.
                        setView("ok-login");
                        setTimeout(() => router.replace("/login"), 1000);
                        return;
                    }
                }

                // 2) Sin tokens: ¿ya hay sesión activa? (abriste el link estando logueado)
                let hasSession = false;
                try {
                    const { data } = await withTimeout(supabase.auth.getSession(), 800);
                    hasSession = Boolean(data?.session);
                } catch {
                    /* noop */
                }

                if (hasSession) {
                    setView("ok-home");
                    setTimeout(() => router.replace("/"), 800);
                    return;
                }

                // 3) Fallback: verificada pero sin sesión ⇒ a login
                setView("ok-login");
                setTimeout(() => router.replace("/login"), 1000);
            } catch (e: any) {
                setDetail(e?.message || "No pudimos confirmar tu cuenta.");
                setView("error");
            }
        })();
    }, [router]);

    return (
        <main className="fixed inset-0 z-[9999] grid place-items-center bg-black/20 backdrop-blur-sm p-6">
            <div className="w-full max-w-md rounded-2xl border bg-white p-6 text-center shadow-xl">
                {view === "checking" && (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <p>Verificando tu cuenta…</p>
                    </div>
                )}

                {view === "ok-home" && (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-8 w-8 text-boa-green" />
                        <h1 className="text-xl font-semibold">¡Tu cuenta fue verificada!</h1>
                        <p className="text-sm text-neutral-600">Te estamos llevando al inicio…</p>
                        <Link href="/" className="mt-3 underline text-boa-green">Ir ahora</Link>
                    </div>
                )}

                {view === "ok-login" && (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-8 w-8 text-boa-green" />
                        <h1 className="text-xl font-semibold">¡Tu cuenta fue verificada!</h1>
                        <p className="text-sm text-neutral-600">Iniciá sesión para continuar.</p>
                        <Link href="/login" className="mt-3 underline text-boa-green">Ir a iniciar sesión</Link>
                    </div>
                )}

                {view === "error" && (
                    <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-7 w-7 text-red-600" />
                        <p className="text-red-600">{detail}</p>
                        <Link className="underline text-boa-green" href="/login">Volver a iniciar sesión</Link>
                    </div>
                )}
            </div>
        </main>
    );
}
