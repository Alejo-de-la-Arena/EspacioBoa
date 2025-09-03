// pages/giftcards/index.tsx
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function GiftCardsPage() {
    const { giftCards = [] } = useApp();

    // Variants (mismos que Home)
    const container = {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
    };
    const item = {
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
    };

    return (
        <Layout>
            {/* ================= HERO — GIFTCARDS (vibra cultural BOA) ================= */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={container}
                className="relative isolate min-h-[78vh] flex items-end overflow-hidden"
            >
                {/* Collage cálido (2 capas) */}
                <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=90&w=2400"
                    alt="Texturas cálidas, madera y verde de BOA"
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                />
                <Image
                    src="https://images.unsplash.com/photo-1552196570-9b2f4c7e8847?auto=format&fit=crop&q=90&w=2000"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover mix-blend-overlay opacity-70"
                />

                {/* veladuras/viñetas */}
                <div className="absolute inset-0 bg-gradient-to-t from-boa-ink/50 via-boa-ink/20 to-transparent" />
                <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_-90px_140px_rgba(0,0,0,.22)]" />

                {/* Ornamentos suaves BOA */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -left-24 -bottom-24 w-[26rem] h-[26rem] rounded-full bg-boa-green/14 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 w-[22rem] h-[22rem] rounded-full bg-boa-terra/16 blur-3xl"
                />

                {/* Pincelada sutil (decorativa) */}
                <div
                    aria-hidden
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[360px] h-[62px] opacity-[0.18] bg-[url('/assets/pincelada-verde.png')] bg-no-repeat bg-contain"
                />
            </motion.section>

            {/* ================= SECTION — TARJETAS (mismo formato del Home) ================= */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={container}
                className="relative py-24 font-sans overflow-hidden"
            >
                {/* Fondo cálido + halo BOA */}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#FEFCF7_0%,#FFFFFF_85%)]" />
                <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-emerald-300/12 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-amber-300/12 blur-3xl" />

                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-boa-ink">
                            Gift <span className="text-boa-green">Cards</span>
                        </h2>
                        <p className="mt-3 text-base sm:text-lg text-boa-ink/75 max-w-2xl mx-auto">
                            Elegí tu experiencia BOA. Tres opciones que abrazan lo rico y lo que hace bien.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {(giftCards.length ? giftCards.slice(0, 3) : fallbackGC).map((gc: any, i: number) => (
                            <motion.div key={`${gc.id ?? gc.name}-${i}`} variants={item} whileHover={{ y: -8 }}>
                                <GiftCardShell>
                                    <div className="p-8 relative z-10">
                                        <h3 className="text-2xl font-extrabold text-neutral-900 mb-1">{gc.name}</h3>
                                        <p className="text-neutral-700 mb-5">{gc.description}</p>

                                        <div className="text-3xl font-extrabold text-neutral-900 mb-5">
                                            ${Number(gc.value ?? 0).toLocaleString()}
                                        </div>

                                        <ul className="space-y-2 text-sm text-neutral-800 mb-6">
                                            {(gc.benefits ?? []).slice(0, 3).map((b: string, j: number) => (
                                                <li key={j} className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-boa-green" />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            href="https://wa.me/5491112345678"
                                            target="_blank"
                                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-boa-green text-white hover:bg-boa-green/90 transition"
                                        >
                                            Coordinar por WhatsApp
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </GiftCardShell>
                            </motion.div>
                        ))}
                    </div>

                    {/* Cierre identitario */}
                    <div className="mt-12 text-center">
                        <p className="text-sm">
                            <span className="inline-block bg-gradient-to-r from-boa-ink/70 via-boa-ink/70 to-boa-green bg-clip-text text-transparent">
                                En BOA creemos que los mejores regalos se comparten.
                            </span>
                        </p>
                    </div>
                </div>
            </motion.section>
        </Layout>
    );
}

/** ============= Shell reutilizable (idéntico look & feel al Home) ============= */
function GiftCardShell({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="relative p-[16px] rounded-[30px] shadow-xl"
            style={{
                backgroundImage: `
          linear-gradient(135deg,rgba(30,122,102,.18),rgba(213,149,121,.18)),
          radial-gradient(180px 180px at 0% 0%, rgba(0,0,0,.06), transparent),
          radial-gradient(200px 200px at 100% 100%, rgba(0,0,0,.06), transparent)
        `,
                backgroundBlendMode: "overlay, normal, normal",
                boxShadow: "inset 0 0 0 2px rgba(255,255,255,.28), 0 18px 32px rgba(0,0,0,.18)",
                borderRadius: 30,
            }}
        >
            {/* Lienzo crema, textura papel sutil */}
            <div className="relative rounded-[22px] overflow-hidden bg-[#FAF8F2] ring-1 ring-black/10">
                <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>\")",
                        backgroundSize: "260px 260px",
                    }}
                />
                {children}
            </div>
        </div>
    );
}

/** Fallback por si el contexto aún no cargó giftCards */
const fallbackGC = [
    {
        id: "gc1",
        name: "Experiencia Bienestar",
        description: "Movimiento, calma y café de bienvenida.",
        value: 25000,
        benefits: ["3 clases de yoga", "1 sesión de meditación", "Café de bienvenida"],
    },
    {
        id: "gc2",
        name: "Café Lover",
        description: "Para amantes del café de especialidad.",
        value: 15000,
        benefits: ["5 cafés premium", "1 taller de barismo", "Descuento en granos"],
    },
    {
        id: "gc3",
        name: "Tarot",
        description: "Conexión y claridad con guías especializadas.",
        value: 12500,
        benefits: ["2 sesiones", "1 taller de introducción", "Descuentos en actividades"],
    },
];
