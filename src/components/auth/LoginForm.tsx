"use client";


import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Loader2,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";




/* ===== helpers visuales ===== */
function cn(...c: Array<string | boolean | undefined | null>) {
    return c.filter(Boolean).join(" ");
}
function fieldBase(hasError: boolean) {
    return [
        "peer w-full rounded-xl border bg-white/90 px-11 py-3 placeholder-transparent font-sans",
        "shadow-[inset_0_1px_0_rgba(16,185,129,0.05)]",
        "transition-all focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400",
        hasError ? "border-red-400" : "border-neutral-300 hover:border-neutral-400",
    ].join(" ");
}
function floatLabelCls(hasError: boolean) {
    return [
        "pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-[13px] text-neutral-500",
        "transition-all",
        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px]",
        "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[11px] peer-focus:text-emerald-700",
        "peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-[11px]",
        hasError ? "text-red-600 peer-focus:text-red-600" : "",
    ].join(" ");
}


/* ===== schema ===== */
const LoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    remember: z.boolean().optional(),
});
type LoginValues = z.infer<typeof LoginSchema>;


export default function LoginForm() {
    const [showPw, setShowPw] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<LoginValues>({
        resolver: zodResolver(LoginSchema),
        mode: "onChange",
        defaultValues: { email: "", password: "", remember: true },
    });


    const emailVal = watch("email");
    const pwVal = watch("password");
    const emailOk = !!emailVal && !errors.email;
    const pwOk = !!pwVal && !errors.password;


    const csrfToken = "";
    async function onSubmit(values: LoginValues) {
        setServerError(null);
        try {
            const res = await loginUser({
                email: values.email,
                password: values.password,
                remember: !!values.remember,
                csrfToken,
            });
            if (!res.ok) {
                setServerError(res.message || "No pudimos iniciar sesión. Revisá tus datos.");
                return;
            }
            // redirigir a dashboard si querés
            // router.push("/dashboard")
        } catch {
            setServerError("Error inesperado. Intentá nuevamente.");
        }
    }


    return (
        <div className="relative">
            {/* Borde degradé + glass + textura + blobs */}
            <div className="relative p-[1.6px] rounded-3xl bg-gradient-to-br from-emerald-200 via-emerald-100 to-transparent">
                <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-shadow focus-within:shadow-[0_20px_60px_rgba(16,185,129,0.12)]">
                    {/* blobs */}
                    <div aria-hidden className="pointer-events-none absolute -top-8 -left-8 h-36 w-36 rounded-full bg-emerald-200/40 blur-2xl" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />
                    {/* textura */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.06]"
                        style={{
                            backgroundImage:
                                "radial-gradient(1px 1px at 10px 10px, rgba(2, 6, 23, .8) 1px, transparent 0)",
                            backgroundSize: "16px 16px",
                        }}
                    />


                    {/* ===== form ===== */}
                    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-4" noValidate>
                        <input type="hidden" name="csrfToken" value={csrfToken} />


                        {/* Email */}
                        <div className="font-sans">
                            <div className="relative">
                                <Mail className="pointer-events-none font-sans absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-900" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="tu@correo.com"
                                    {...register("email")}
                                    className={fieldBase(!!errors.email)}
                                />
                                <label htmlFor="email" className={floatLabelCls(!!errors.email)}>
                                    Email
                                </label>
                                {emailOk && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                                )}
                                {errors.email && (
                                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>


                        {/* Password */}
                        <div className="font-sans">
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="password"
                                    type={showPw ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={cn(fieldBase(!!errors.password), "pr-14")}
                                />
                                <label htmlFor="password" className={floatLabelCls(!!errors.password)}>
                                    Contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700"
                                    aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>


                        {/* remember + forgot */}
                        <div className="flex items-center justify-between font-sans text-sm">
                            <label className="inline-flex items-center gap-2 select-none">
                                <input
                                    type="checkbox"
                                    {...register("remember")}
                                    className="h-4 w-4 rounded border-neutral-300 text-emerald-700 focus:ring-emerald-300 accent-emerald-600"
                                />
                                Recordarme
                            </label>
                            <Link
                                href="/forgot-password"
                                className="underline underline-offset-4 text-emerald-700 hover:text-emerald-800"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>


                        {/* errores server */}
                        {serverError && (
                            <div className="font-sans rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {serverError}
                            </div>
                        )}


                        {/* submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "group inline-flex w-full items-center justify-center gap-2 font-sans",
                                "rounded-xl bg-emerald-600 px-4 py-2.5 text-white",
                                "shadow-sm hover:bg-emerald-700 transition-all duration-200",
                                "disabled:opacity-60 disabled:cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>


                        {/* sello */}
                        <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-sans">
                            Sesión segura. Usamos cifrado y buenas prácticas.
                        </div>
                    </form>


                    {/* Google debajo */}
                    <div className="relative z-10 my-5 flex items-center gap-3">
                        <span className="h-px w-full bg-neutral-200" />
                        <span className="font-sans text-xs text-neutral-500">o</span>
                        <span className="h-px w-full bg-neutral-200" />
                    </div>


                    <div className="relative z-10">
                        <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium font-sans hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition"
                            aria-label="Continuar con Google"
                        >
                            <LogIn className="h-4 w-4" />
                            Continuar con Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



