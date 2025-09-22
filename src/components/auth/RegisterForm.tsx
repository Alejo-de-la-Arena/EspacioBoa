"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye, EyeOff, Loader2, Mail, User, Phone, Lock,
    ShieldCheck, ArrowRight, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";

/* helpers */
function cn(...classes: Array<string | boolean | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}
function fieldBase(hasError: boolean) {
    return [
        "peer w-full rounded-xl border bg-white/90 px-11 py-3 placeholder-transparent",
        "shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]",
        "transition-all focus:outline-none focus:ring-2 focus:ring-boa-green/20 focus:border-boa-green",
        hasError ? "border-red-400" : "border-neutral-300 hover:border-neutral-400",
    ].join(" ");
}
function floatLabelCls(hasError: boolean) {
    return [
        "pointer-events-none absolute left-11 text-neutral-500 font-sans",
        "transition-all",
        "top-1/2 -translate-y-1/2 text-[13px]",
        "peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-[11px] peer-focus:text-boa-green",
        "peer-[&:not(:placeholder-shown)]:top-1.5",
        "peer-[&:not(:placeholder-shown)]:-translate-y-0",
        "peer-[&:not(:placeholder-shown)]:text-[11px]",
        hasError ? "text-red-600 peer-focus:text-red-600" : "",
    ].join(" ");
}

/* Validación */
const passwordSchema = z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .refine((val) => /[A-Z]/.test(val), "Debe incluir una mayúscula")
    .refine((val) => /\d/.test(val), "Debe incluir un número");

const RegisterSchema = z.object({
    name: z.string().min(2, "Ingresá tu nombre"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional().refine((v) => !v || /^[0-9+()\-.\s]{6,}$/.test(v), { message: "Teléfono inválido" }),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, "Debés aceptar los Términos y la Política de privacidad"),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof RegisterSchema>;

function pwStrength(pw: string): 0 | 1 | 2 | 3 {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    return Math.min(3, s) as 0 | 1 | 2 | 3;
}

export default function RegisterForm() {
    const router = useRouter();
    const setUserFromSession = useAuth((s) => s.setUserFromSession);

    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverOk, setServerOk] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { errors, isSubmitting, isValid, touchedFields },
    } = useForm<RegisterValues>({
        resolver: zodResolver(RegisterSchema),
        mode: "onChange",
        defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "", terms: false },
    });

    const password = watch("password");
    const strength = useMemo(() => pwStrength(password), [password]);
    const isOk = (name: keyof RegisterValues) =>
        touchedFields[name] && !errors[name] && String(getValues(name) ?? "").length > 0;

    // Si más adelante sumás CSRF/Recaptcha, conectamos aquí.
    const csrfToken = "";
    async function getRecaptchaToken(): Promise<string | null> { return null; }

    async function onSubmit(values: RegisterValues) {
        setServerError(null);
        setServerOk(null);
        try {
            const site = (typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
            const emailRedirectTo = `${site}/auth/callback`;

            const { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    emailRedirectTo,
                    data: { display_name: values.name, phone: values.phone || "" },
                },
            });

            if (error) {
                const code = (error as any).code || "";
                const msg = (error.message || "").toLowerCase();

                if (code === "user_already_exists" || msg.includes("already registered") || msg.includes("already exists")) {
                    await supabase.auth.resend({ type: "signup", email: values.email }).catch(() => { });
                    setServerError("Ese email ya está registrado. Te reenviamos el email de verificación si la cuenta no estaba confirmada.");
                    return;
                }
                setServerError(error.message || "No pudimos crear tu cuenta. Probá de nuevo.");
                return;
            }

            // si confirmación está ON, normalmente no hay session aquí
            if (!data.session) {
                setServerOk("¡Listo! Te enviamos un email para verificar tu cuenta. Revisá tu bandeja.");
                return;
            }

            await setUserFromSession();
            // si no exige confirmación
            router.push("/");
        } catch {
            setServerError("Error inesperado. Intentá nuevamente.");
        }
    }




    return (
        <div className="relative font-sans">
            {/* Card con borde degradé BOA */}
            <div className="relative p-[1.6px] rounded-3xl bg-gradient-to-br from-boa-green/30 via-boa-green/10 to-transparent">
                <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-shadow focus-within:shadow-[0_20px_60px_hsla(var(--boa-green),0.18)]">
                    {/* blobs BOA */}
                    <div aria-hidden className="pointer-events-none absolute -top-8 -left-8 h-36 w-36 rounded-full bg-boa-green/30 blur-2xl" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-boa-green/20 blur-3xl" />
                    {/* textura */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.06]"
                        style={{
                            backgroundImage:
                                "radial-gradient(1px 1px at 10px 10px, rgba(2, 6, 23, .7) 1px, transparent 0)",
                            backgroundSize: "16px 16px",
                        }}
                    />

                    {/* ===== FORM ===== */}
                    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-4" noValidate>
                        <input type="hidden" name="csrfToken" value={csrfToken} />

                        {/* Nombre */}
                        <div>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="name" type="text" autoComplete="name" placeholder="Nombre"
                                    {...register("name")} className={fieldBase(!!errors.name)}
                                />
                                <label htmlFor="name" className={floatLabelCls(!!errors.name)}>Nombre</label>
                                {isOk("name") && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />}
                                {errors.name && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />}
                            </div>
                            {errors.name && <p className="mt-1 text-sm text-red-600" role="alert">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="email" type="email" autoComplete="email" placeholder="tu@correo.com"
                                    {...register("email")} className={fieldBase(!!errors.email)}
                                />
                                <label htmlFor="email" className={floatLabelCls(!!errors.email)}>Email</label>
                                {isOk("email") && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />}
                                {errors.email && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />}
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600" role="alert">{errors.email.message}</p>}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="phone" type="tel" autoComplete="tel" placeholder="+54 9 11 ..."
                                    {...register("phone")} className={fieldBase(!!errors.phone)}
                                />
                                <label htmlFor="phone" className={floatLabelCls(!!errors.phone)}>Teléfono (opcional)</label>
                                {isOk("phone") && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />}
                                {errors.phone && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />}
                            </div>
                            {errors.phone && <p className="mt-1 text-sm text-red-600" role="alert">{errors.phone.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="password" type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="••••••••"
                                    {...register("password")} className={cn(fieldBase(!!errors.password), "pr-14")}
                                />
                                <label htmlFor="password" className={floatLabelCls(!!errors.password)}>Contraseña</label>
                                <button
                                    type="button" onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700"
                                    aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {isOk("password") && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />}
                                {errors.password && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />}
                            </div>

                            {/* Fuerza compacta */}
                            <div className="mt-2">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className={cn("h-1.5 w-full rounded-full", strength > i ? "bg-boa-green" : "bg-neutral-200")} />
                                    ))}
                                </div>
                                <p className="mt-1 text-[11px] text-neutral-500">
                                    8+ caracteres con <strong>una mayúscula</strong> y <strong>un número</strong>.
                                </p>
                            </div>

                            {errors.password && <p className="mt-1 text-sm text-red-600" role="alert">{errors.password.message}</p>}
                        </div>

                        {/* Confirmar */}
                        <div>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="confirmPassword" type={showPw2 ? "text" : "password"} autoComplete="new-password" placeholder="••••••••"
                                    {...register("confirmPassword")} className={cn(fieldBase(!!errors.confirmPassword), "pr-14")}
                                />
                                <label htmlFor="confirmPassword" className={floatLabelCls(!!errors.confirmPassword)}>Confirmar contraseña</label>
                                <button
                                    type="button" onClick={() => setShowPw2((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700"
                                    aria-label={showPw2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPw2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600" role="alert">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input
                                id="terms" type="checkbox" {...register("terms")}
                                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-boa-green focus:ring-boa-green/30 accent-boa-green"
                            />
                            <label htmlFor="terms" className="text-[12.5px] text-neutral-700 leading-5">
                                Acepto los{" "}
                                <a href="/terminos" className="underline underline-offset-4 text-boa-green">
                                    Términos y Condiciones
                                </a>{" "}
                                y la{" "}
                                <a href="/privacidad" className="underline underline-offset-4 text-boa-green">
                                    Política de privacidad
                                </a>.
                            </label>
                        </div>

                        {/* Feedback servidor */}
                        {serverError && (
                            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {serverError}
                            </div>
                        )}

                        {serverOk && (
                            <div className="rounded-md border bg-boa-green/10 border-boa-green/30 px-3 py-2 text-sm text-boa-green">
                                {serverOk}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit" disabled={isSubmitting || !isValid}
                            className={cn(
                                "group inline-flex w-full items-center justify-center gap-2",
                                "rounded-xl bg-boa-green px-4 py-2.5 text-white",
                                "shadow-sm hover:bg-boa-green/90 transition-all duration-200",
                                "disabled:opacity-60 disabled:cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creando cuenta...
                                </>
                            ) : (
                                <>
                                    Continuar
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>

                        {/* Sello */}
                        <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                            <ShieldCheck className="h-4 w-4" />
                            Tu información está protegida. Nunca compartimos tus datos.
                        </div>
                    </form>

                    {/* ===== Google (desactivado por ahora) ===== */}
                    <div className="relative z-10 my-5 flex items-center gap-3">
                        <span className="h-px w-full bg-neutral-200" />
                        <span className="text-xs text-neutral-500">o</span>
                        <span className="h-px w-full bg-neutral-200" />
                    </div>

                    <div className="relative z-10">
                        <button
                            type="button"
                            aria-label="Iniciar sesión con Google (próximamente)"
                            disabled
                            className={cn(
                                "w-full inline-flex items-center justify-center gap-3",
                                "h-10 rounded-lg border bg-white text-[14px] font-medium text-[#1f1f1f]",
                                "border-[#747775] opacity-60"
                            )}
                            title="Disponible pronto"
                        >
                            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.9-6.9C35.9 2.1 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.42 6.54C12.75 13.09 17.9 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.21-.44-4.73H24v9h12.6c-.54 2.89-2.19 5.34-4.67 6.99l7.13 5.55C43.77 37.36 46.5 31.42 46.5 24.5z" />
                                <path fill="#FBBC05" d="M11 28.76A14.49 14.49 0 0 1 9.5 24c0-1.65.29-3.23.81-4.71l-8.42-6.54A24 24 0 0 0 0 24c0 3.9.93 7.59 2.56 10.78l8.44-6.02z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.14 15.9-5.81l-7.13-5.55C30.79 38.46 27.64 39.5 24 39.5c-6.11 0-11.27-3.62-13.98-8.74l-8.46 6.02C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            <span>Iniciar sesión con Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
