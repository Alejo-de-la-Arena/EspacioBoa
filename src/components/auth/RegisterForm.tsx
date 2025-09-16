// components/auth/RegisterForm.tsx
"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeOff,
    Loader2,
    Mail,
    User,
    Phone,
    Lock,
    ShieldCheck,
    ArrowRight,
    LogIn,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { registerUser } from "@/lib/services/auth";

/* =============== helpers =============== */
function cn(...classes: Array<string | boolean | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}
// base de input (floating label friendly)
function fieldBase(hasError: boolean) {
    return [
        "peer w-full rounded-xl border bg-white/90 px-11 py-3 placeholder-transparent font-sans",
        "shadow-[inset_0_1px_0_rgba(16,185,129,0.05)]",
        "transition-all focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400",
        hasError ? "border-red-400" : "border-neutral-300 hover:border-neutral-400",
    ].join(" ");
}
// label flotante
function floatLabelCls(hasError: boolean) {
    return [
        "pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-[13px] text-neutral-500",
        "transition-all",
        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px]",
        "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[11px] peer-focus:text-emerald-700",
        // cuando hay contenido, que quede flotando
        "peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-[11px]",
        hasError ? "text-red-600 peer-focus:text-red-600" : "",
    ].join(" ");
}

/* =============== Validación BOA =============== */
// 8+, 1 mayúscula, 1 número
const passwordSchema = z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .refine((val) => /[A-Z]/.test(val), "Debe incluir una mayúscula")
    .refine((val) => /\d/.test(val), "Debe incluir un número");

const RegisterSchema = z
    .object({
        name: z.string().min(2, "Ingresá tu nombre"),
        email: z.string().email("Email inválido"),
        phone: z
            .string()
            .optional()
            .refine((v) => !v || /^[0-9+()\-.\s]{6,}$/.test(v), { message: "Teléfono inválido" }),
        password: passwordSchema,
        confirmPassword: z.string(),
        terms: z.boolean().refine((v) => v, "Debés aceptar los Términos y la Política de privacidad"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type RegisterValues = z.infer<typeof RegisterSchema>;

/* fuerza 0..3 (largo, mayúscula, número) */
function pwStrength(pw: string): 0 | 1 | 2 | 3 {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    return Math.min(3, s) as 0 | 1 | 2 | 3;
}

export default function RegisterForm() {
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
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
    });

    const password = watch("password");
    const strength = useMemo(() => pwStrength(password), [password]);
    const isOk = (name: keyof RegisterValues) =>

        touchedFields[name] && !errors[name] && String(getValues(name) ?? "").length > 0;

    // placeholders de seguridad a conectar
    const csrfToken = "";
    async function getRecaptchaToken(): Promise<string | null> {
        return null;
    }

    async function onSubmit(values: RegisterValues) {
        setServerError(null);
        setServerOk(null);
        try {
            const recaptchaToken = await getRecaptchaToken();
            const res = await registerUser({
                name: values.name,
                email: values.email,
                phone: values.phone || null,
                password: values.password,
                csrfToken,
                recaptchaToken,
            });
            if (!res.ok) {
                setServerError(res.message || "No pudimos crear tu cuenta. Probá de nuevo.");
                return;
            }
            setServerOk("¡Listo! Te enviamos un email para verificar tu cuenta.");
        } catch {
            setServerError("Error inesperado. Intentá nuevamente.");
        }
    }

    return (
        <div className="relative">
            {/* ===== Card moderna con borde degradé + textura + blobs ===== */}
            <div className="relative p-[1.6px] rounded-3xl bg-gradient-to-br from-emerald-200 via-emerald-100 to-transparent">
                <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-shadow focus-within:shadow-[0_20px_60px_rgba(16,185,129,0.12)]">
                    {/* blobs internos */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -top-8 -left-8 h-36 w-36 rounded-full bg-emerald-200/40 blur-2xl"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl"
                    />
                    {/* textura sutil */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.06]"
                        style={{
                            backgroundImage:
                                "radial-gradient(1px 1px at 10px 10px, rgba(2, 6, 23, .7) 1px, transparent 0)",
                            backgroundSize: "16px 16px",
                        }}
                    />

                    {/* ====== FORM ====== */}
                    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-4" noValidate>
                        <input type="hidden" name="csrfToken" value={csrfToken} />

                        {/* Nombre */}
                        <div className="font-sans">
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Nombre"
                                    {...register("name")}
                                    className={fieldBase(!!errors.name)}
                                />
                                <label htmlFor="name" className={floatLabelCls(!!errors.name)}>
                                    Nombre
                                </label>
                                {isOk("name") && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                                )}
                                {errors.name && (
                                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="font-sans">
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
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
                                {isOk("email") && (
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

                        {/* Teléfono */}
                        <div className="font-sans">
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="+54 9 11 ..."
                                    {...register("phone")}
                                    className={fieldBase(!!errors.phone)}
                                />
                                <label htmlFor="phone" className={floatLabelCls(!!errors.phone)}>
                                    Teléfono (opcional)
                                </label>
                                {isOk("phone") && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                                )}
                                {errors.phone && (
                                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                                    {errors.phone.message}
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
                                    autoComplete="new-password"
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
                                    className="absolute right-9 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700"
                                    aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {isOk("password") && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                                )}
                                {errors.password && (
                                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                                )}
                            </div>

                            {/* Fuerza compacta */}
                            <div className="mt-2">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-1.5 w-full rounded-full",
                                                strength > i ? "bg-emerald-500/90" : "bg-neutral-200"
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="mt-1 text-[11px] text-neutral-500">
                                    8+ caracteres con <strong>una mayúscula</strong> y <strong>un número</strong>.
                                </p>
                            </div>

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirmar */}
                        <div className="font-sans">
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    id="confirmPassword"
                                    type={showPw2 ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    {...register("confirmPassword")}
                                    className={cn(fieldBase(!!errors.confirmPassword), "pr-14")}
                                />
                                <label htmlFor="confirmPassword" className={floatLabelCls(!!errors.confirmPassword)}>
                                    Confirmar contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPw2((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700"
                                    aria-label={showPw2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPw2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2 font-sans">
                            <input
                                id="terms"
                                type="checkbox"
                                {...register("terms")}
                                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-emerald-700 focus:ring-emerald-300 accent-emerald-600"
                            />
                            <label htmlFor="terms" className="text-[12.5px] text-neutral-700 leading-5">
                                Acepto los{" "}
                                <a href="/terminos" className="underline underline-offset-4 text-emerald-700">
                                    Términos y Condiciones
                                </a>{" "}
                                y la{" "}
                                <a href="/privacidad" className="underline underline-offset-4 text-emerald-700">
                                    Política de privacidad
                                </a>.
                            </label>
                        </div>

                        {/* Feedback servidor */}
                        {serverError && (
                            <div className="font-sans rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {serverError}
                            </div>
                        )}
                        {serverOk && (
                            <div className="font-sans rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                                {serverOk}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid}
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
                        <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-sans">
                            <ShieldCheck className="h-4 w-4" />
                            Tu información está protegida. Nunca compartimos tus datos.
                        </div>
                    </form>

                    {/* ===== Google (debajo) ===== */}
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
