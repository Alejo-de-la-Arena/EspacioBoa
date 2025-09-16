import Link from "next/link";
import Image from "next/image";
import { Coffee, CalendarDays } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
    title: "Crear cuenta | BOA",
    description: "Registrate para vivir la experiencia BOA",
};

export default function RegisterPage() {
    return (
        <main className="lg:min-h-[86vh] lg:max-h-[86vh] grid grid-cols-1 lg:grid-cols-2 bg-[#F7F5EF]">
            {/* LADO VISUAL */}
            <section className="relative hidden lg:block">
                <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop"
                    alt="Café de especialidad en BOA"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/55" />
                <div className="absolute inset-0 bg-[radial-gradient(1000px_480px_at_18%_78%,rgba(16,185,129,0.12),transparent)]" />
                <div className="relative h-full flex items-end p-10">
                    <div className="text-neutral-50 max-w-lg space-y-3">
                        <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] tracking-wider uppercase">
                            Comunidad BOA
                        </span>
                        <h1 className="text-4xl font-semibold leading-tight tracking-tight">
                            Tu lugar <span className="font-extrabold">en BOA</span>
                        </h1>
                        <p className="text-neutral-200 text-base/7">
                            Eventos, beneficios y una experiencia cercana. Cálido, simple y seguro.
                        </p>
                        <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-[13px] text-neutral-100">
                            <li className="flex items-center gap-2">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                                    <Coffee className="h-3.5 w-3.5" />
                                </span>
                                Café & comunidad
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                </span>
                                Acceso a eventos
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* FORM */}
            <section className="flex items-center justify-center p-5 sm:p-8 lg:p-8">
                <div className="w-full max-w-sm">
                    <div className="mb-6 text-center">
                        <h2 className="text-[28px] font-semibold tracking-tight text-neutral-900">
                            Crear cuenta
                        </h2>
                        <p className="text-sm text-neutral-600 mt-1.5">
                            ¿Ya tenés cuenta?{" "}
                            <Link
                                href="/login"
                                className="font-medium underline underline-offset-4 text-emerald-700 hover:text-emerald-800"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>

                    {/* El formulario ya trae su propia card interna */}
                    <RegisterForm />

                    <p className="mt-3 text-center text-[11px] text-neutral-500">
                        Tu información está protegida. Nunca compartimos tus datos.
                    </p>
                </div>
            </section>
        </main>
    );
}
