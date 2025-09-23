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
        "peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-[11px]",
        hasError ? "text-red-600 peer-focus:text-red-600" : "",
    ].join(" ");
}

export default function LoginView() {
    const router = useRouter();
    const setUserFromSession = useAuth((s) => s.setUserFromSession);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const [serverError, setServerError] = useState<string | null>(null);
    const [showPw, setShowPw] = useState(false);

    function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
        return Promise.race([
            p,
            new Promise<T>((_, rej) => setTimeout(() => rej(new Error("TIMEOUT")), ms)),
        ]) as Promise<T>;
    }

    const onSubmit = async (values: any) => {
        setServerError(null);
        const { data, error } = await supabase.auth.signInWithPassword(values);
        if (error) { setServerError(error.message); return; }
        // refrescá el store y navegá
        await setUserFromSession();
        router.push("/");
    };



    return (
        <main className="relative min-h-dvh bg-[#F7F5EF] font-sans">
            {/* Fondo */}
            <Image
                src="https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1600&auto=format&fit=crop"
                alt="Fondo BOA"
                fill priority className="object-cover opacity-[0.35]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(1200px 600px at 20% 80%, hsla(var(--boa-green), 0.15), transparent)" }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(1px 1px at 10px 10px, rgba(2, 6, 23, .8) 1px, transparent 0)", backgroundSize: "16px 16px" }}
            />

            {/* Contenido */}
            <section className="relative z-10 grid place-items-center min-h-dvh p-4">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Iniciar sesión</h1>
                        <p className="text-sm text-neutral-700 mt-1.5">
                            ¿No tenés cuenta?{" "}
                            <Link href="/register" className="font-medium underline underline-offset-4 text-boa-green hover:text-boa-green/90">
                                Crear cuenta
                            </Link>
                        </p>
                    </div>

                    <div className="relative p-[1.6px] rounded-3xl bg-gradient-to-br from-boa-green/30 via-boa-green/10 to-transparent">
                        <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                            {/* form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <input id="email" type="email" placeholder="tu@correo.com" {...register("email")} className={fieldBase(!!errors.email)} />
                                    <label htmlFor="email" className={floatLabelCls(!!errors.email)}>Email</label>
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-600">{String(errors.email.message)}</p>}

                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <input id="password" type={showPw ? "text" : "password"} placeholder="••••••••"
                                        {...register("password")} className={fieldBase(!!errors.password) + " pr-12"} />
                                    <label htmlFor="password" className={floatLabelCls(!!errors.password)}>Contraseña</label>
                                    <button type="button" onClick={() => setShowPw(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                                        aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}>
                                        {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{String(errors.password.message)}</p>}

                                {serverError && (
                                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex gap-2">
                                        <AlertCircle className="h-4 w-4 mt-0.5" /> {serverError}
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting}
                                    className="w-full rounded-xl bg-boa-green px-4 py-2.5 text-white shadow-sm hover:bg-boa-green/90 transition">
                                    {isSubmitting ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Entrando…</span> : "Ingresar"}
                                </button>

                                <div className="text-right">
                                    <Link href="/reset" className="text-sm underline underline-offset-4 text-neutral-600 hover:text-neutral-800">
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
