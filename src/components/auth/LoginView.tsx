"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/stores/useAuth";


const schema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
});


// base visual de input (sin label flotante)
function fieldBase(hasError: boolean) {
    return [
        "w-full h-12 rounded-xl border bg-white/90 pl-12 pr-12 text-[15px] leading-6",
        "placeholder:text-neutral-500 focus:placeholder-transparent",
        "shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]",
        "transition-all focus:outline-none focus:ring-2 focus:ring-black ",
        hasError ? "border-red-400" : "border-neutral-300 hover:border-neutral-400",
    ].join(" ");
}


export default function LoginView() {
    const router = useRouter();
    const setUserFromSession = useAuth((s) => s.setUserFromSession);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });


    const [serverError, setServerError] = useState<string | null>(null);
    const [showPw, setShowPw] = useState(false);
    const [isGoogle, setIsGoogle] = useState(false);


    const onSubmit = async (values: any) => {
        setServerError(null);
        const { error } = await supabase.auth.signInWithPassword(values);
        if (error) { setServerError(error.message); return; }
        await setUserFromSession();
        router.push("/");
    };


    async function signInWithGoogle() {
        setServerError(null);
        try {
            setIsGoogle(true);
            const site =
                typeof window !== "undefined"
                    ? window.location.origin
                    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";


            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${site}/auth/callback`,
                    queryParams: {
                        // Pide refresh_token la primera vez (opcional)
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            });
            if (error) {
                setIsGoogle(false);
                setServerError(error.message);
            }
            // redirige automáticamente a Google
        } catch {
            setIsGoogle(false);
            setServerError("No se pudo iniciar sesión con Google. Intentá de nuevo.");
        }
    }


    return (
        <main className="relative min-h-dvh bg-[#F7F5EF] font-sans">
            {/* Fondo */}
            <Image
                src="https://res.cloudinary.com/dfrhrnwwi/image/upload/v1757992781/650ab4c1-48b9-43f4-a336-373dd2aeb1c2_m2vftk.jpg"
                alt="Fondo BOA"
                fill
                priority
                className="object-cover opacity-15"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(1200px 600px at 20% 80%, hsla(var(--boa-green), 0.15), transparent)",
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        "radial-gradient(1px 1px at 10px 10px, rgba(2, 6, 23, .8) 1px, transparent 0)",
                    backgroundSize: "16px 16px",
                }}
            />


            {/* Contenido */}
            <section className="relative z-10 grid place-items-center min-h-dvh p-4 [&_*]:font-sans">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl tracking-tight font-bold">Iniciar sesión</h1>
                        <p className="text-sm text-neutral-900 mt-1.5">
                            ¿No tenés cuenta?{" "}
                            <Link
                                href="/register"
                                className="font-medium underline underline-offset-4 text-boa-green hover:text-boa-green/90 font-semibold"
                            >
                                Crear cuenta
                            </Link>
                        </p>
                    </div>


                    <div className="relative p-[1.6px] rounded-3xl bg-gradient-to-br from-boa-green/30 via-boa-green/10 to-transparent">
                        <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                            {/* form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-[13px] text-neutral-700">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Ingresá tu email"
                                            {...register("email")}
                                            className={fieldBase(!!errors.email)}
                                            aria-describedby="email-help"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600" id="email-help">
                                            {String(errors.email.message)}
                                        </p>
                                    )}
                                </div>


                                {/* Password */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-[13px] text-neutral-700">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <input
                                            id="password"
                                            type={showPw ? "text" : "password"}
                                            placeholder="Ingresá tu contraseña"
                                            {...register("password")}
                                            className={fieldBase(!!errors.password) + " pr-12"}
                                            aria-describedby="password-help"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                                            aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600" id="password-help">
                                            {String(errors.password.message)}
                                        </p>
                                    )}
                                </div>


                                {/* Error servidor */}
                                {serverError && (
                                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex gap-2">
                                        <AlertCircle className="h-4 w-4 mt-0.5" /> {serverError}
                                    </div>
                                )}


                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl bg-boa-green px-4 py-3 text-white shadow-sm hover:bg-boa-green/90 transition"
                                >
                                    {isSubmitting ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Entrando…
                                        </span>
                                    ) : (
                                        "Ingresar"
                                    )}
                                </button>


                                {/* Google
                                <button
                                    type="button"
                                    onClick={signInWithGoogle}
                                    disabled={isGoogle}
                                    className="w-full inline-flex items-center justify-center gap-3 h-11 rounded-[14px] border bg-white text-[14px] font-medium text-[#1f1f1f] border-[#d6d8dc]"
                                >
                                    {isGoogle ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Redirigiendo a Google…
                                        </>
                                    ) : (
                                        <>
                                            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.9-6.9C35.9 2.1 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.42 6.54C12.75 13.09 17.9 9.5 24 9.5z" />
                                                <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.21-.44-4.73H24v9h12.6c-.54 2.89-2.19 5.34-4.67 6.99l7.13 5.55C43.77 37.36 46.5 31.42 46.5 24.5z" />
                                                <path fill="#FBBC05" d="M11 28.76A14.49 14.49 0 0 1 9.5 24c0-1.65.29-3.23.81-4.71l-8.42-6.54A24 24 0 0 0 0 24c0 3.9.93 7.59 2.56 10.78l8.44-6.02z" />
                                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.14 15.9-5.81l-7.13-5.55C30.79 38.46 27.64 39.5 24 39.5c-6.11 0-11.27-3.62-13.98-8.74l-8.46 6.02C6.51 42.62 14.62 48 24 48z" />
                                            </svg>
                                            <span>Continuar con Google</span>
                                        </>
                                    )}
                                </button> */}


                                <div className="text-right">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm underline underline-offset-4 text-neutral-900 hover:text-neutral-700"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}



