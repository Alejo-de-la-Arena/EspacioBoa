"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, CheckCircle2, AlertCircle, ArrowRight, Clock, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

function cn(...c: Array<string | boolean | undefined | null>) {
    return c.filter(Boolean).join(" ");
}
function fieldBase(hasError: boolean) {
    return [
        "w-full h-12 rounded-xl border bg-white/90 pl-11 pr-12 text-[15px] leading-6",
        "placeholder:text-neutral-500 focus:placeholder-transparent",
        "shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]",
        "transition-all focus:outline-none focus:ring-2 focus:ring-black",
        hasError ? "border-red-300" : "border-neutral-300 hover:border-neutral-400",
    ].join(" ");
}

const Schema = z.object({ email: z.string().email("Email inválido") });
type Values = z.infer<typeof Schema>;

const COOLDOWN_SEC = 60;
const keyFor = (email: string) => `boa_pw_cooldown:${email.toLowerCase().trim()}`;
const nowSec = () => Math.floor(Date.now() / 1000);

const isRealRateLimit = (err: unknown) => {
    const e = err as any;
    return e?.status === 429 || e?.code === "over_email_send_rate_limit";
};

export default function ForgotPasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverOk, setServerOk] = useState<string | null>(null);
    const [cooldownLeft, setCooldownLeft] = useState<number>(0);
    const [devLink, setDevLink] = useState<string | null>(null); // solo se usa en DEV si hay 429
    const timerRef = useRef<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<Values>({
        resolver: zodResolver(Schema),
        mode: "onChange",
        defaultValues: { email: "" },
    });

    const emailVal = (watch("email") || "").trim();
    const emailOk = !!emailVal && !errors.email;

    // Leer cooldown guardado para ese email (si venció, limpiar)
    useEffect(() => {
        setDevLink(null); // si cambiás de email, ocultamos link dev anterior
        if (!emailVal) return;
        try {
            const k = keyFor(emailVal);
            const until = Number(localStorage.getItem(k) || "0");
            const remaining = Math.max(0, until - nowSec());
            if (remaining > 0) {
                setCooldownLeft(remaining);
            } else {
                localStorage.removeItem(k);
                setCooldownLeft(0);
            }
        } catch {
            setCooldownLeft(0);
        }
    }, [emailVal]);

    // Tick del contador
    useEffect(() => {
        if (cooldownLeft <= 0) {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }
        if (!timerRef.current) {
            timerRef.current = window.setInterval(() => {
                setCooldownLeft((s) => {
                    const n = s - 1;
                    if (n <= 0 && timerRef.current) {
                        window.clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    return Math.max(0, n);
                });
            }, 1000) as unknown as number;
        }
        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [cooldownLeft]);

    const disableSubmit = isSubmitting || !emailOk || cooldownLeft > 0;

    async function onSubmit(values: Values) {
        setServerError(null);
        setServerOk(null);
        setDevLink(null);

        if (cooldownLeft > 0) return;

        try {
            // 1) validar existencia (server)
            const res = await fetch("/api/auth/exists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: values.email }),
            });
            const j = await res.json();
            if (!j.ok) {
                setServerError(j.error || "No se pudo validar el email.");
                return;
            }
            if (!j.exists) {
                setServerError("Ese email no está registrado en BOA.");
                try { localStorage.removeItem(keyFor(values.email)); } catch { }
                setCooldownLeft(0);
                return;
            }

            // 2) pedir reset a Supabase (correo)
            const site =
                typeof window !== "undefined"
                    ? window.location.origin
                    : process.env.NEXT_PUBLIC_SITE_URL || "http://espacioboa.com";

            const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
                redirectTo: `${site}/reset-password`,
            });

            if (error) {
                if (process.env.NODE_ENV === "development") {
                    console.log("[resetPasswordForEmail error]", {
                        status: (error as any)?.status,
                        code: (error as any)?.code,
                        message: error.message,
                    });
                }

                // 429: rate-limit
                if (isRealRateLimit(error)) {
                    // En DEV: mostrar el link (sin redirigir) si está habilitado
                    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ALLOW_DEV_RECOVERY_LINK === "1") {
                        try {
                            const r = await fetch("/api/auth/dev-recovery", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: values.email }),
                            });
                            const jr = await r.json();
                            if (jr.ok && jr.link) {
                                setDevLink(jr.link);
                                setServerOk("Modo DEV: usá el enlace de abajo para resetear la contraseña.");
                                return;
                            } else {
                                setServerError(jr.error || "No se pudo generar el enlace de recuperación (DEV).");
                                return;
                            }
                        } catch {
                            setServerError("Fallo el fallback DEV de recuperación.");
                            return;
                        }
                    }

                    // En PROD (o si no habilitaste el fallback): cooldown normal
                    const until = nowSec() + COOLDOWN_SEC;
                    try { localStorage.setItem(keyFor(values.email), String(until)); } catch { }
                    setCooldownLeft(COOLDOWN_SEC);
                    setServerError(`Por seguridad, debés esperar ${COOLDOWN_SEC}s antes de pedir otro enlace.`);
                    return;
                }

                // Otros errores: sin cooldown
                setServerError(error.message || "No pudimos enviar el email. Intentá de nuevo.");
                return;
            }

            // 3) ÉXITO (mail enviado)
            try { localStorage.removeItem(keyFor(values.email)); } catch { }
            setCooldownLeft(0);
            setServerOk("¡Listo! Te enviamos un enlace para restablecer tu contraseña.");
        } catch {
            setServerError("Error inesperado. Intentá nuevamente.");
        }
    }

    const cooldownText = useMemo(() => {
        if (cooldownLeft <= 0) return null;
        return `Podés volver a pedir el enlace en ${cooldownLeft}s`;
    }, [cooldownLeft]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-2">
                <label htmlFor="email" className="block text-[13px] text-neutral-700">Email</label>
                <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400" />
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="tu@correo.com"
                        {...register("email")}
                        className={fieldBase(!!errors.email)}
                        aria-describedby="email-help"
                    />
                    {emailOk && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />
                    )}
                    {errors.email && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                </div>
                {errors.email && (
                    <p className="text-[13px] text-red-600" id="email-help" role="alert">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {cooldownLeft > 0 && (
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <Clock className="h-4 w-4" />
                    {cooldownText}
                </div>
            )}

            {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {serverError}
                </div>
            )}
            {serverOk && (
                <div className="rounded-lg border bg-boa-green/10 border-boa-green/30 px-3 py-2.5 text-sm text-boa-green">
                    {serverOk}
                </div>
            )}

            {/* Panel DEV opcional con link (solo si NEXT_PUBLIC_ALLOW_DEV_RECOVERY_LINK=1) */}
            {devLink && (
                <div className="rounded-lg border bg-emerald-50 border-emerald-200 px-3 py-2.5 text-sm text-emerald-800 space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                        <LinkIcon className="h-4 w-4" />
                        Enlace de recuperación (DEV):
                    </div>
                    <div className="break-all font-mono text-xs">{devLink}</div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="rounded-md border border-emerald-300 px-2 py-1 text-xs hover:bg-emerald-100"
                            onClick={() => navigator.clipboard.writeText(devLink)}
                        >
                            Copiar
                        </button>
                        <a
                            className="rounded-md border border-emerald-300 px-2 py-1 text-xs hover:bg-emerald-100"
                            href={devLink}
                            target="_blank"
                            rel="noopener"
                        >
                            Abrir
                        </a>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={disableSubmit}
                className={cn(
                    "group inline-flex w-full items-center justify-center gap-2",
                    "rounded-xl px-5 py-3 text-[15px] font-medium text-white",
                    "bg-boa-green hover:bg-boa-green/95",
                    "shadow-sm transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                )}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando enlace...
                    </>
                ) : cooldownLeft > 0 ? (
                    <>Esperá {cooldownLeft}s</>
                ) : (
                    <>
                        Enviarme el enlace <ArrowRight className="h-4 w-4" />
                    </>
                )}
            </button>
        </form>
    );
}
