import Image from "next/image";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
    title: "Definir nueva contraseña | BOA",
    description: "Elegí tu nueva contraseña para acceder a BOA",
};

export default function ResetPasswordPage() {
    return (
        <main className="relative min-h-dvh bg-[#F7F2EA] font-sans antialiased">
            <Image
                src="https://res.cloudinary.com/dfrhrnwwi/image/upload/v1757992781/650ab4c1-48b9-43f4-a336-373dd2aeb1c2_m2vftk.jpg"
                alt="Texturas cálidas BOA"
                fill
                priority
                className="object-cover opacity-[0.15]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/20" />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
                style={{
                    backgroundImage:
                        "radial-gradient(1px 1px at 8px 8px, rgba(15,23,42,.9) 1px, transparent 0)",
                    backgroundSize: "14px 14px",
                }}
            />

            <section className="relative z-10 grid min-h-dvh place-items-center p-4 sm:p-6">
                <div className="w-full max-w-2xl [&_*]:font-sans">
                    <div className="text-center mb-7">
                        <h1 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-neutral-900">
                            Nueva contraseña
                        </h1>
                        <p className="text-sm text-neutral-900 mt-2">
                            Ingresá y confirmá tu nueva contraseña.
                        </p>
                    </div>

                    <div className="rounded-[28px] bg-white/75 backdrop-blur-xl ring-1 ring-black/10 shadow-xl p-5 sm:p-7 md:p-8">
                        <ResetPasswordForm />
                    </div>
                </div>
            </section>
        </main>
    );
}
