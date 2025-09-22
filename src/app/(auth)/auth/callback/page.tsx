"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type View = "checking" | "ok-home" | "ok-login" | "error";

export default function AuthCallback() {
    const router = useRouter();
    const qs = useSearchParams();
    const [view, setView] = useState<View>("checking");
    const [detail, setDetail] = useState("");
    const done = useRef(false);

    useEffect(() => {
        const toHome = () => {
            if (done.current) return;
            done.current = true;
            setView("ok-home");
            setTimeout(() => router.replace("/"), 3000);
        };
        const toLogin = () => {
            if (done.current) return;
            done.current = true;
            setView("ok-login");
            setTimeout(() => router.replace("/login"), 3000);
        };
        const fail = (msg: string) => {
            if (done.current) return;
            done.current = true;
            setDetail(msg);
            setView("error");
        };

        (async () => {
            try {
                // 1) ¿Viene con token_hash? -> verifyOtp
                const token_hash = qs.get("token_hash");
                const type = (qs.get("type") || "signup") as
                    | "signup"
                    | "recovery"
                    | "invite"
                    | "email_change";
                if (token_hash) {
                    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
                    if (error) throw error;
                    toHome();
                    return;
                }

                // 2) ¿Viene con #access_token / #refresh_token ? -> setSession
                const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
                if (url && url.hash.length > 1) {
                    const hash = new URLSearchParams(url.hash.slice(1));
                    const access_token = hash.get("access_token");
                    const refresh_token = hash.get("refresh_token");
                    if (access_token && refresh_token) {
                        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
                        if (error) throw error;
                        toHome();
                        return;
                    }
                }

                // 3) No hay tokens. Dos posibilidades:
                //    a) El mail ya quedó VERIFICADO en el server pero sin auto sign-in -> mostrar éxito y llevar a /login
                //    b) Ya hay sesión activa (abriste estando logueado) -> ir a home
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    toHome();
                } else {
                    // ÉXITO (cuenta verificada) pero sin sesión local: pedir login.
                    toLogin();
                }
            } catch (err: any) {
                fail(err?.message || "No pudimos confirmar tu cuenta.");
            }
        })();
    }, [router, qs]);

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
                        <p className="text-sm text-neutral-600">En unos segundos te llevamos al inicio…</p>
                        <Link href="/" className="mt-3 underline text-boa-green">Ir ahora</Link>
                    </div>
                )}

                {view === "ok-login" && (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-8 w-8 text-boa-green" />
                        <h1 className="text-xl font-semibold">¡Tu cuenta fue verificada!</h1>
                        <p className="text-sm text-neutral-600">
                            Iniciá sesión para continuar.
                        </p>
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
