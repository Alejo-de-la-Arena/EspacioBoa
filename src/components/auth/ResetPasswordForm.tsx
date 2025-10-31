"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

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

const passwordSchema = z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .refine((v) => /[A-Z]/.test(v), "Debe incluir una mayúscula")
    .refine((v) => /\d/.test(v), "Debe incluir un número");

const Schema = z
    .object({
        password: passwordSchema,
        confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, {
        message: "Las contraseñas no coinciden",
        path: ["confirm"],
    });

type Values = z.infer<typeof Schema>;

export default function ResetPasswordForm() {
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverOk, setServerOk] = useState<string | null>(null);
    const [ready, setReady] = useState(false); // habilita inputs cuando hay sesión de recovery

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
        getValues,
        watch,
    } = useForm<Values>({
        resolver: zodResolver(Schema),
        mode: "onChange",
        defaultValues: { password: "", confirm: "" },
    });

    const isOk = (name: keyof Values) =>
        touchedFields[name] && !errors[name] && String(getValues(name) ?? "").length > 0;

    const strength = useMemo(() => {
        const pw = watch("password");
        if (!pw) return 0;
        let s = 0;
        if (pw.length >= 8) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/\d/.test(pw)) s++;
        return Math.min(3, s);
    }, [watch("password")]);

    // 1) El link de recuperación crea una sesión temporal y emite PASSWORD_RECOVERY
    useEffect(() => {
        const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
                setReady(true);
            }
        });

        // fallback por si al llegar ya está logueado por el hash
        (async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) setReady(true);
        })();

        return () => sub.subscription.unsubscribe();
    }, []);

    async function onSubmit(values: Values) {
        setServerError(null);
        setServerOk(null);
        try {
            const { error } = await supabase.auth.updateUser({ password: values.password });
            if (error) {
                setServerError(error.message || "No pudimos actualizar tu contraseña.");
                return;
            }
            setServerOk("¡Contraseña actualizada! Ya podés iniciar sesión.");
        } catch {
            setServerError("Error inesperado. Intentá nuevamente.");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Password */}
            <div className="space-y-2">
                <label htmlFor="password" className="block text-[13px] text-neutral-700">
                    Nueva contraseña
                </label>
                <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400" />
                    <input
                        id="password"
                        type={show1 ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        {...register("password")}
                        disabled={!ready}
                        className={cn(fieldBase(!!errors.password), "pr-16", !ready && "opacity-60")}
                    />
                    <button
                        type="button"
                        onClick={() => setShow1((v) => !v)}
                        disabled={!ready}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700 disabled:opacity-60"
                        aria-label={show1 ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {show1 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {isOk("password") && (
                        <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />
                    )}
                    {errors.password && (
                        <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                </div>

                {/* Barra fuerza */}
                <div className="mt-2">
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1.5 w-full rounded-full",
                                    strength > i ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-neutral-200"
                                )}
                            />
                        ))}
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-600">
                        8+ caracteres con <strong>una mayúscula</strong> y <strong>un número</strong>.
                    </p>
                </div>

                {errors.password && (
                    <p className="text-[13px] text-red-600" role="alert">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Confirm */}
            <div className="space-y-2">
                <label htmlFor="confirm" className="block text-[13px] text-neutral-700">
                    Confirmar contraseña
                </label>
                <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400" />
                    <input
                        id="confirm"
                        type={show2 ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repetí tu contraseña"
                        {...register("confirm")}
                        disabled={!ready}
                        className={cn(fieldBase(!!errors.confirm), "pr-16", !ready && "opacity-60")}
                    />
                    <button
                        type="button"
                        onClick={() => setShow2((v) => !v)}
                        disabled={!ready}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700 disabled:opacity-60"
                        aria-label={show2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {show2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.confirm && (
                    <p className="text-[13px] text-red-600" role="alert">
                        {errors.confirm.message}
                    </p>
                )}
            </div>

            {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {serverError}
                </div>
            )}
            {serverOk && (
                <div className="rounded-lg border bg-boa-green/10 border-boa-green/30 px-3 py-2.5 text-sm text-boa-green">
                    {serverOk}{" "}
                    <Link href="/login" className="underline underline-offset-4 text-boa-green font-medium">
                        Ir a iniciar sesión
                    </Link>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting || !ready}
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
                        <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                    </>
                ) : (
                    <>Guardar nueva contraseña</>
                )}
            </button>
        </form>
    );
}
