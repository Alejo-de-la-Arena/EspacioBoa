import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { Calendar, Sparkles, Users } from "lucide-react";
import VerticalFlyerSlider from "./events/VerticalFlyerSlider";


/* ===== Variants de entrada ===== */
const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};
const itemUp = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 90, damping: 16 }
    }
};

import type { MotionValue } from "framer-motion";

/** Fondo artístico cálido e interactivo */
const AmbientArtBackground = ({
    mx,
    my,
}: {
    mx: MotionValue<number>;
    my: MotionValue<number>;
}) => {
    // Parallax de las manchas
    const p1x = useTransform(mx, (v) => v * 12);
    const p1y = useTransform(my, (v) => v * 8);
    const p2x = useTransform(mx, (v) => v * -10);
    const p2y = useTransform(my, (v) => v * 6);
    const p3x = useTransform(mx, (v) => v * 6);
    const p3y = useTransform(my, (v) => v * -5);

    return (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
            {/* Base crema suave */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg,#FFF8ED 0%,#FFFBF4 40%,#FFFFFF 65%,#FFF2DF 100%)",
                }}
            />

            {/* Brillo artístico: conic gradient rotando MUY lento, enmascarado */}
            <motion.div
                className="absolute -inset-1 opacity-[0.35] [mask-image:radial-gradient(65%_60%_at_50%_45%,#000_55%,transparent)] motion-reduce:opacity-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 90, ease: "linear", repeat: Infinity }}
                style={{
                    background:
                        "conic-gradient(from 0deg at 50% 50%, rgba(255,228,186,0.65), rgba(255,243,219,0.45), rgba(239,229,205,0.55), rgba(255,228,186,0.65))",
                }}
            />

            {/* Manchas tipo acuarela (parallax + “breathing”) */}
            <motion.div
                className="pointer-events-none absolute -top-24 -left-28 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-80 will-change-transform"
                style={{
                    x: p1x,
                    y: p1y,
                    background:
                        "radial-gradient(60% 60% at 50% 50%, rgba(248,220,195,0.85) 0%, rgba(248,220,195,0.35) 55%, rgba(248,220,195,0.0) 72%)",
                }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute -bottom-28 -right-36 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-70 will-change-transform"
                style={{
                    x: p2x,
                    y: p2y,
                    background:
                        "radial-gradient(60% 60% at 50% 50%, rgba(244,201,190,0.75) 0%, rgba(244,201,190,0.30) 55%, rgba(244,201,190,0.0) 72%)",
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute top-1/3 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full blur-3xl opacity-70 will-change-transform"
                style={{
                    x: p3x,
                    y: p3y,
                    background:
                        "radial-gradient(60% 60% at 50% 50%, rgba(220,239,229,0.70) 0%, rgba(220,239,229,0.28) 55%, rgba(220,239,229,0.0) 72%)",
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Líneas suaves “a mano” (sutilísimas) */}
            <motion.svg
                className="pointer-events-none absolute inset-x-0 bottom-[-6%] opacity-[0.12] motion-reduce:opacity-0"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                aria-hidden
            >
                <motion.path
                    d="M0,180 C 180,120 360,220 540,200 C 720,180 900,80 1080,120 C1260,160 1440,140 1440,140"
                    stroke="#EFCBAE"
                    strokeWidth="28"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.96 }}
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.svg>

            {/* Textura orgánica (noise) con SVG animado */}
            <svg
                className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.06] motion-reduce:opacity-0"
                aria-hidden
            >
                <filter id="boa-noise">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.015"
                        numOctaves="2"
                        seed="7"
                    >
                        <animate
                            attributeName="baseFrequency"
                            dur="40s"
                            values="0.015;0.011;0.015"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#boa-noise)" />
            </svg>
        </div>
    );
};


export default function EventsHero({ events }: { events: any[] }) {
    // Movimiento del mouse normalizado (-1 a 1)
    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        mx.set(Math.max(-1, Math.min(1, x)));
        my.set(Math.max(-1, Math.min(1, y)));
    };

    // Parallax sutil (px) para cada blob
    const b1x = useTransform(mx, v => v * 10);
    const b1y = useTransform(my, v => v * 10);
    const b2x = useTransform(mx, v => v * -14);
    const b2y = useTransform(my, v => v * -10);
    const b3x = useTransform(mx, v => v * 8);
    const b3y = useTransform(my, v => v * -6);

    const now = new Date();

    return (
        <section
            id="events-hero"
            className="relative overflow-hidden font-sans"
            onMouseMove={handleMouseMove}
        >
            <AmbientArtBackground mx={mx} my={my} />

            {/* ===== Contenido ===== */}
            <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="grid items-center gap-10 md:gap-12 md:grid-cols-2 min-h-[calc(100svh-64px)] py-10 sm:py-12"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Columna izquierda */}
                    <div>
                        <motion.span
                            variants={itemUp}
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur"
                        >
                            <Calendar className="h-4 w-4 text-emerald-600" />
                            Eventos puntuales: talleres, ferias y charlas
                        </motion.span>

                        <motion.h1
                            variants={itemUp}
                            className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-neutral-900 font-sans"
                        >
                            Encuentros que conectan{" "}
                            <span className="text-emerald-600">de verdad</span>
                        </motion.h1>

                        <motion.p
                            variants={itemUp}
                            className="mt-4 max-w-xl text-lg text-neutral-700 font-sans"
                        >
                            Momentos únicos en BOA para aprender, crear y compartir. Elegí tu
                            próxima experiencia con la calidez de nuestra comunidad.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            variants={itemUp}
                            className="mt-6 flex flex-wrap items-center gap-4 text-sm"
                        >
                            <motion.div
                                variants={itemUp}
                                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-neutral-700 backdrop-blur ring-1 ring-neutral-200"
                            >
                                <Sparkles className="h-4 w-4 text-emerald-600" />
                                Próximos:{" "}
                                <strong className="ml-1 text-neutral-900 font-sans">
                                    {events.filter(
                                        (e) => new Date(e.date).getTime() >= now.getTime()
                                    ).length}
                                </strong>
                            </motion.div>

                            <motion.div
                                variants={itemUp}
                                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-neutral-700 backdrop-blur ring-1 ring-neutral-200"
                            >
                                <Calendar className="h-4 w-4 text-emerald-600" />
                                Este mes:{" "}
                                <strong className="ml-1 text-neutral-900 font-sans">
                                    {(() => {
                                        const m = now.getMonth();
                                        const y = now.getFullYear();
                                        return events.filter((ev) => {
                                            const d = new Date(ev.date);
                                            return (
                                                d.getFullYear() === y &&
                                                d.getMonth() === m &&
                                                d.getTime() >= now.getTime()
                                            );
                                        }).length;
                                    })()}
                                </strong>
                            </motion.div>

                            <motion.div
                                variants={itemUp}
                                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-neutral-700 backdrop-blur ring-1 ring-neutral-200"
                            >
                                <Users className="h-4 w-4 text-emerald-600" />
                                Cupos libres:{" "}
                                <strong className="ml-1 text-neutral-900 font-sans">
                                    {(() => {
                                        const t = now.getTime();
                                        return events
                                            .filter((e) => new Date(e.date).getTime() >= t)
                                            .reduce(
                                                (acc, e) =>
                                                    acc + Math.max((e.capacity ?? 0) - (e.enrolled ?? 0), 0),
                                                0
                                            );
                                    })()}
                                </strong>
                            </motion.div>
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            variants={itemUp}
                            className="mt-8 flex flex-col sm:flex-row gap-3"
                        >
                            <Link href="#explorar">
                                <button className="h-11 rounded-2xl bg-emerald-600 px-6 text-white hover:bg-emerald-700 transition-colors font-sans">
                                    Ver próximos eventos
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Columna derecha: Flyer / Slider */}
                    <motion.div variants={itemUp} className="relative will-change-transform">
                        <VerticalFlyerSlider events={events as any} maxSlides={3} autoPlayMs={10000} />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
