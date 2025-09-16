// src/app/(auth)/login/page.tsx
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Iniciar sesión | BOA",
    description: "Accedé a tu cuenta BOA",
};

export default function LoginPage() {
    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-neutral-50">
            <section className="relative hidden lg:block">
                <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop"
                    alt="Ambiente BOA"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/50" />
                <div className="relative h-full flex items-end p-12">
                    <div className="text-neutral-50 space-y-3">
                        <span className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-wide">
                            Bienvenido de vuelta
                        </span>
                        <h1 className="text-4xl font-semibold leading-tight">BOA</h1>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-semibold tracking-tight">Iniciar sesión</h2>
                        <p className="text-sm text-neutral-600 mt-2">
                            ¿No tenés cuenta?{" "}
                            <Link href="/register" className="font-medium underline underline-offset-4">
                                Registrate
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 placeholder-neutral-400 focus:outline-neutral-700"
                                placeholder="tu@correo.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm font-medium">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 placeholder-neutral-400 focus:outline-neutral-700"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                                Recordarme
                            </label>
                            <Link href="/forgot-password" className="underline underline-offset-4">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-white transition disabled:opacity-50"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
