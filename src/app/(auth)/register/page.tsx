import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
    title: "Crear cuenta | BOA",
    description: "Registrate para vivir la experiencia BOA",
};

export default function RegisterPage() {
    return (
        <main className="relative min-h-dvh bg-[#F7F5EF] font-sans">
            {/* Fondo fotográfico sutil */}
            <Image
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1600&auto=format&fit=crop"
                alt="Fondo BOA"
                fill
                priority
                className="object-cover opacity-[0.35]"
            />

            {/* Velos + acento BOA */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(1200px 600px at 20% 80%, hsla(var(--boa-green), 0.15), transparent)",
                }}
            />

            {/* Textura sutil */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        "radial-gradient(1px 1px at 10px 10px, rgba(2, 6, 23, .8) 1px, transparent 0)",
                    backgroundSize: "16px 16px",
                }}
            />

            {/* Contenido centrado */}
            <section className="relative z-10 grid place-items-center min-h-dvh p-4">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-6">
                        <h1 className="font-sans text-3xl font-semibold tracking-tight text-neutral-900">
                            Crear cuenta
                        </h1>
                        <p className="text-sm text-neutral-700 mt-1.5">
                            ¿Ya tenés cuenta?{" "}
                            <Link
                                href="/login"
                                className="font-medium underline underline-offset-4 text-boa-green hover:text-boa-green/90"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>

                    <RegisterForm />
                </div>
            </section>
        </main>
    );
}
