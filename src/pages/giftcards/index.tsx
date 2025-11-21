// pages/giftcards/index.tsx
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { GiftCardCard } from "@/components/GiftCardCard";
import GiftCardBuyModal from "@/components/GiftCardBuyModal";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export default function GiftCardsPage() {
    const { giftCards = [] } = useApp();

    // Modal state
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

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
        "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756867726/nano-banana-no-bg-2025-09-03T02-47-52_1_jb6zay.jpg";

    const list = giftCards.length ? giftCards.slice(0, 3) : fallbackGC;

    return (
        <section>
            <section

                className="relative py-16 sm:py-20 font-sans overflow-hidden"
            >
                {/* Capa: imagen decorativa detrás (sutil) */}
                <div className="absolute inset-0 -z-10">
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
                    <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
                </div>

                <RevealOnScroll variant="blurRise" amount={0.3} className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado */}
                    <div className="text-center mb-10 sm:mb-14">
                        <h1 className="text-[32px] sm:text-5xl font-extrabold tracking-tight text-boa-ink">
                            Gift <span className="text-boa-green">Cards</span>
                        </h1>
                        <p className="mt-3 text-base sm:text-lg text-boa-ink/70 max-w-2xl mx-auto">
                            Regalos simples y con alma: café, arte y bienestar para compartir.
                        </p>
                    </div>

                    {/* Grid de tarjetas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {list.map((gc: any, i: number) => (
                            <motion.div key={`${gc.id ?? gc.name}-${i}`} variants={item} whileHover={{ y: -6 }}>
                                <GiftCardCard
                                    gc={gc}
                                    mode="public"
                                    onBuy={() => {
                                        setSelected(gc);
                                        setOpen(true);
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Remate */}
                    <div className="mt-12 text-center">
                        <p className="text-sm">
                            <span className="inline-block bg-gradient-to-r from-boa-ink/70 via-boa-ink/70 to-boa-green bg-clip-text text-transparent">
                                En BOA creemos que los mejores regalos se comparten.
                            </span>
                        </p>
                    </div>
                </RevealOnScroll>
            </section>

            {/* Modal */}
            {selected && (
                <GiftCardBuyModal
                    open={open}
                    onClose={() => setOpen(false)}
                    gift={{ id: selected.id, name: selected.name, value: selected.value }}
                />
            )}
        </section>
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
