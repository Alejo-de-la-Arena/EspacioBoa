// pages/giftcards/index.tsx
import { useApp } from "@/contexts/AppContext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";


export default function GiftCardsPage() {
    const { giftCards = [] } = useApp();


    // Animations
    const container = {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
    };
    const item = {
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
    };


    // 🔁 Reemplazá esta URL cuando tengas la imagen final de nanobanana
    const DECOR_BG =
        "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756867726/nano-banana-no-bg-2025-09-03T02-47-52_1_jb6zay.jpg"
    const list = giftCards.length ? giftCards.slice(0, 3) : fallbackGC;


    return (
        <section>
            {/* ================= SECTION — GIFTCARDS (arriba + fondo decorativo detrás) ================= */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={container}
                className="relative py-16 sm:py-20 font-sans overflow-hidden"
            >
                {/* Fondo crema base */}



                {/* Capa: imagen decorativa detrás (sutil) */}
                <div className="absolute inset-0 -z-10">
                    {/* Imagen con baja opacidad y blur leve para no competir */}
                    <div className="absolute inset-0 opacity-15 [mask-image:linear-gradient(to bottom,rgba(0,0,0,.7),rgba(0,0,0,.4),rgba(0,0,0,.1))]">
                        <Image
                            src={DECOR_BG}
                            alt="Fondo decorativo BOA — acuarelas, papel y guiños de café"
                            fill
                            priority={true}
                            sizes="100vw"
                            className="object-cover"
                        />
                    </div>
                    {/* Halos BOA suaves */}
                    <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
                </div>


                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado minimal */}
                    <div className="text-center mb-10 sm:mb-14">
                        <h1 className="text-[32px] sm:text-5xl font-extrabold tracking-tight text-boa-ink">
                            Gift <span className="text-boa-green">Cards</span>
                        </h1>
                        <p className="mt-3 text-base sm:text-lg text-boa-ink/70 max-w-2xl mx-auto">
                            Regalos simples y con alma: café, arte y bienestar para compartir.
                        </p>
                    </div>


                    {/* Grid de tarjetas (formato del Home) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {list.map((gc: any, i: number) => (
                            <motion.div key={`${gc.id ?? gc.name}-${i}`} variants={item} whileHover={{ y: -6 }}>
                                <GiftCardShell>
                                    <div className="p-7 sm:p-8 relative z-10">
                                        <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mb-1">{gc.name}</h3>
                                        <p className="text-neutral-700 mb-5">{gc.description}</p>


                                        <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-5">
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


                    {/* Remate identitario */}
                    <div className="mt-12 text-center">
                        <p className="text-sm">
                            <span className="inline-block bg-gradient-to-r from-boa-ink/70 via-boa-ink/70 to-boa-green bg-clip-text text-transparent">
                                En BOA creemos que los mejores regalos se comparten.
                            </span>
                        </p>
                    </div>
                </div>
            </motion.section>
        </section>
    );
}


function GiftCardShell({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="relative rounded-[28px] p-[18px] shadow-xl"
            style={{
                background:
                    "linear-gradient(135deg, rgba(30,122,102,.16), rgba(213,149,121,.16))",
                boxShadow:
                    "inset 0 0 0 2px rgba(255,255,255,.28), 0 18px 40px rgba(0,0,0,.18)",
            }}
        >
            <div className="relative rounded-[22px] overflow-hidden bg-[#FAF8F2] ring-1 ring-black/10">
                {/* textura papel */}
                <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>\")",
                        backgroundSize: "260px 260px",
                    }}
                />
                {/* watermark logo BOA (ajustá la ruta si hace falta) */}
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        opacity: 0.06,
                        background: "url('https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg') right -10% bottom -6% / 320px 320px no-repeat",
                    }}
                />
                <div className="relative z-10">{children}</div>
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



