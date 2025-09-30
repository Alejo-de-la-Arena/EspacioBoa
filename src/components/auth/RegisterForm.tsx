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
        "w-full h-12 rounded-xl border bg-white/90 pl-12 pr-12 text-[15px] leading-6",
        "placeholder:text-neutral-500 focus:placeholder-transparent",
        "shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]",
        "transition-all focus:outline-none focus:ring-2 focus:ring-emerald-200/70 focus:border-boa-green",
        hasError ? "border-red-300" : "border-neutral-300 hover:border-neutral-400",
    ].join(" ");
}
// (se deja para compatibilidad, no usamos label flotante)
function floatLabelCls(_: boolean) { return ""; }


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
    if (pw.length >= 8) s++; if (/[A-Z]/.test(pw)) s++; if (/\d/.test(pw)) s++;
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
        register, handleSubmit, watch, getValues,
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


            if (!data.session) {
                setServerOk("¡Listo! Te enviamos un email para verificar tu cuenta. Revisá tu bandeja.");
                return;
            }


            await setUserFromSession();
            router.push("/");
        } catch {
            setServerError("Error inesperado. Intentá nuevamente.");
        }
    }


    return (
        <div className="relative font-sans">
            {/* === CARD IGUAL A LOGIN (sin textura de puntos) === */}
            <div className="relative p-[1.6px] rounded-3xl bg-gradient-to-br from-boa-green/30 via-boa-green/10 to-transparent">
                <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                    {/* ===== FORM ===== */}
                    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6" noValidate>
                        <input type="hidden" name="csrfToken" value={csrfToken} />


                        {/* Nombre */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-[13px] text-neutral-700">Nombre</label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400" />
                                <input id="name" type="text" autoComplete="name" placeholder="Ingresá tu nombre"
                                    {...register("name")} className={fieldBase(!!errors.name)} aria-describedby="name-help" />
                                {isOk("name") && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />}
                                {errors.name && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />}
                            </div>
                            {errors.name && <p className="text-[13px] text-red-600" id="name-help" role="alert">{errors.name.message}</p>}
                        </div>


                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[13px] text-neutral-700">Email</label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400" />
                                <input id="email" type="email" autoComplete="email" placeholder="Ingresá tu email"
                                    {...register("email")} className={fieldBase(!!errors.email)} aria-describedby="email-help" />
                                {isOk("email") && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />}
                                {errors.email && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />}
                            </div>
                            {errors.email && <p className="text-[13px] text-red-600" id="email-help" role="alert">{errors.email.message}</p>}
                        </div>


                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-[13px] text-neutral-700">Teléfono (opcional)</label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400" />
                                <input id="phone" type="tel" autoComplete="tel" placeholder="Ingresá tu teléfono"
                                    {...register("phone")} className={fieldBase(!!errors.phone)} aria-describedby="phone-help" />
                                {isOk("phone") && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />}
                                {errors.phone && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />}
                            </div>
                            {errors.phone && <p className="text-[13px] text-red-600" id="phone-help" role="alert">{errors.phone.message}</p>}
                        </div>


                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-[13px] text-neutral-700">Contraseña</label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400" />
                                <input id="password" type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="Ingresá tu contraseña"
                                    {...register("password")} className={cn(fieldBase(!!errors.password), "pr-16")} aria-describedby="password-help" />
                                <button type="button" onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700"
                                    aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}>
                                    {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {isOk("password") && <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-boa-green" />}
                                {errors.password && <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />}
                            </div>


                            {/* Fuerza */}
                            <div className="mt-2">
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className={cn("h-1.5 w-full rounded-full", strength > i ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-neutral-200")} />
                                    ))}
                                </div>
                                <p className="mt-1 text-[11px] text-neutral-600">
                                    8+ caracteres con <strong>una mayúscula</strong> y <strong>un número</strong>.
                                </p>
                            </div>


                            {errors.password && <p className="text-[13px] text-red-600" id="password-help" role="alert">{errors.password.message}</p>}
                        </div>


                        {/* Confirmar */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-[13px] text-neutral-700">Confirmar contraseña</label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400" />
                                <input id="confirmPassword" type={showPw2 ? "text" : "password"} autoComplete="new-password" placeholder="Repetí tu contraseña"
                                    {...register("confirmPassword")} className={cn(fieldBase(!!errors.confirmPassword), "pr-16")} aria-describedby="confirm-help" />
                                <button type="button" onClick={() => setShowPw2((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700"
                                    aria-label={showPw2 ? "Ocultar contraseña" : "Mostrar contraseña"}>
                                    {showPw2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-[13px] text-red-600" id="confirm-help" role="alert">{errors.confirmPassword.message}</p>}
                        </div>


                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                id="terms" type="checkbox" {...register("terms")}
                                className="mt-0.5 h-[18px] w-[18px] rounded border-neutral-300 text-boa-green focus:ring-boa-green/30 accent-boa-green"
                            />
                            <label htmlFor="terms" className="text-[13px] text-neutral-700 leading-5">
                                Acepto los{" "}
                                <a href="/terminos" className="underline underline-offset-4 text-boa-green">Términos y Condiciones</a>{" "}
                                y la{" "}
                                <a href="/privacidad" className="underline underline-offset-4 text-boa-green">Política de privacidad</a>.
                            </label>
                        </div>


                        {/* Feedback servidor */}
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


                        {/* Submit */}
                        <button
                            type="submit" disabled={isSubmitting || !isValid}
                            className={cn(
                                "group inline-flex w-full items-center justify-center gap-2",
                                "rounded-xl px-5 py-3 text-[15px] font-medium text-white",
                                "bg-boa-green hover:bg-boa-green/95",
                                "shadow-sm transition-all duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300",
                                "disabled:opacity-60 disabled:cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" />Creando cuenta...</>) : (<>Continuar<ArrowRight className="h-4 w-4" /></>)}
                        </button>


                        {/* Sello */}
                        <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-600">
                            <ShieldCheck className="h-4 w-4" />
                            Tu información está protegida. Nunca compartimos tus datos.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}



