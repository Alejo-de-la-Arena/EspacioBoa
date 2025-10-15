import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";


export const metadata = {
    title: "Crear cuenta | BOA",
    description: "Registrate para vivir la experiencia BOA",
};


export default function RegisterPage() {
    return (
        <main className="relative min-h-dvh bg-[#F7F2EA] font-sans antialiased">
            {/* Fondo fotográfico neutro */}
            <Image
                src="https://res.cloudinary.com/dfrhrnwwi/image/upload/v1757992781/650ab4c1-48b9-43f4-a336-373dd2aeb1c2_m2vftk.jpg"
                alt="Texturas cálidas BOA"
                fill
                priority
                className="object-cover opacity-[0.15]"
            />


            {/* Velado neutro (sin tintes verdes) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/20" />


            {/* Grano sutil */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
                style={{
                    backgroundImage:
                        "radial-gradient(1px 1px at 8px 8px, rgba(15,23,42,.9) 1px, transparent 0)",
                    backgroundSize: "14px 14px",
                }}
            />


            {/* Contenido */}
            <section className="relative z-10 grid min-h-dvh place-items-center p-4 sm:p-6">
                <div className="w-full max-w-2xl [&_*]:font-sans">
                    <div className="text-center mb-7">
                        <h1 className="text-[32px] sm:text-[36px] font-sans font-bold tracking-tight text-neutral-900">
                            Crear cuenta
                        </h1>
                        <p className="text-sm font-sans text-neutral-900 mt-2">
                            ¿Ya tenés cuenta?{" "}
                            <Link
                                href="/login"
                                className="font-sans underline underline-offset-4 text-boa-green hover:text-boa-green/50 font-semibold"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>


                    {/* Card del formulario (glass, sin tintes) */}
                    <div className="rounded-[28px] bg-white/75 backdrop-blur-xl ring-1 ring-black/10 shadow-xl p-5 sm:p-7 md:p-8">
                        <RegisterForm />
                    </div>
                </div>
            </section>
        </main>
    );
}



