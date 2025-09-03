// pages/activities/index.tsx
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import Activities from "@/components/Activities";
import ActivitiesCalendar from "@/components/ActivitiesCalendar";

export default function ActivitiesPage() {
    const { activities, loading } = useApp();

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Heart className="h-12 w-12" />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero */}
            <section
                className="relative min-h-[100vh] pt-28 pb-16 font-sans overflow-hidden grid place-items-center"
                onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    const r = el.getBoundingClientRect();
                    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    el.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
            >
                {/* Fondo con imagen + velos cálidos */}
                <div className="absolute inset-0 -z-10">
                    {/* Ken-burns sutil */}
                    <motion.div
                        className="absolute inset-0"
                        initial={{ scale: 1.06, y: 8, opacity: 0.98 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{
                            backgroundImage:
                                "url('https://res.cloudinary.com/dasch1s5i/image/upload/v1756773473/Gemini_Generated_Image_fldn88fldn88fldn_ztewxy.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            filter: "saturate(0.96) brightness(1) contrast(1.04)",
                        }}
                    />
                    {/* velo cálido papel */}
                    <div className="absolute inset-0 bg-[#FBF7EC]/60 mix-blend-multiply" />
                    {/* halo sutil al cursor */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(220px 160px at var(--mx,50%) var(--my,50%), rgba(30,122,102,.10), transparent 60%)",
                        }}
                    />
                    {/* grano */}
                    <div
                        aria-hidden
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                    />
                </div>

                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative isolate max-w-3xl mx-auto text-center">
                        {/* === GLASS CARD (detrás del contenido) === */}
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute -inset-x-8 -top-10 -bottom-10 mx-auto z-0"
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="absolute -inset-[2px] rounded-[32px] opacity-40 blur-[2px] 
                      bg-[conic-gradient(from_var(--angle),rgba(30,122,102,.28),rgba(206,234,218,.22),rgba(30,122,102,.35),transparent_85%)]
                      animate-[spin_18s_linear_infinite]" />
                            <motion.div
                                className="absolute inset-0 rounded-[28px] bg-white/14 backdrop-blur-xl ring-1 ring-boa-green/30"
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    backgroundImage:
                                        "radial-gradient(80% 100% at 50% 10%, rgba(255,255,255,.18), transparent 55%)",
                                }}
                            />
                        </motion.div>
                        {/* === FIN GLASS === */}

                        {/* === CONTENIDO (encima del glass) === */}
                        <div className="relative z-10">
                            {/* Píldora superior (verde) */}
                            <motion.div
                                initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ type: "spring", stiffness: 110, damping: 14 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                     bg-boa-green/25 backdrop-blur-md ring-1 ring-boa-green/40 text-white"
                            >
                                <Sparkles className="h-4 w-4 text-white" />
                                <span className="text-[12px] font-semibold tracking-wide">
                                    Cuerpo • Mente • Comunidad
                                </span>
                            </motion.div>

                            {/* Título */}
                            <motion.h1
                                initial={{ opacity: 0, y: 14, scale: 0.98, letterSpacing: "0.04em" }}
                                whileInView={{ opacity: 1, y: 0, scale: 1, letterSpacing: "0em" }}
                                viewport={{ once: true, amount: 0.7 }}
                                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                                className="mt-4 text-4xl sm:text-6xl font-extrabold text-white tracking-tight"
                            >
                                Actividades que te hacen bien
                            </motion.h1>

                            {/* subrayado “pincel” animado */}
                            <svg className="mt-3 mx-auto w-56 h-4 relative z-20" viewBox="0 0 220 18" fill="none" aria-hidden="true">
                                <motion.path
                                    d="M6 10C55 15 125 15 214 8"
                                    stroke="hsl(var(--boa-green))"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 1, opacity: 1 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true, amount: 1 }}
                                    transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
                                />
                            </svg>

                            {/* Bajada */}
                            <motion.p
                                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
                                className="mt-2 text-base sm:text-lg text-white/95 leading-relaxed relative z-20"
                                style={{
                                    WebkitTextStroke: "0.2px rgba(20,64,59,.25)",
                                    textShadow: "0 1px 10px rgba(20,64,59,.22)",
                                    mixBlendMode: "normal",
                                    willChange: "opacity, transform, filter",
                                }}
                            >
                                Movimiento, arte y bienestar en un mismo lugar. Descubrí tu próxima clase y reservá en segundos.
                            </motion.p>

                            {/* Separador + corazón */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.7 }}
                                transition={{ duration: 0.5 }}
                                className="mt-6 flex items-center justify-center gap-3 text-boa-green/70"
                            >
                                <span className="h-px w-12 bg-boa-green/40" />
                                <Heart className="h-4 w-4" />
                                <span className="h-px w-12 bg-boa-green/40" />
                            </motion.div>

                            {/* Chips decorativos */}
                            <motion.ul
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{ staggerChildren: 0.06 }}
                                className="mt-4 flex flex-wrap justify-center gap-2"
                            >
                                {["Yoga", "Aeroyoga", "Astrología", "Tarot", "Arte"].map((label) => (
                                    <motion.li
                                        key={label}
                                        initial={{ opacity: 0, y: 10, rotate: -2, scale: 0.98 }}
                                        whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                                        viewport={{ once: true, amount: 0.6 }}
                                        transition={{ type: "spring", stiffness: 160, damping: 14 }}
                                        className="px-3 py-1 rounded-xl text-[11px] uppercase tracking-[0.14em] font-semibold
                         text-white bg-boa-green/25 backdrop-blur ring-1 ring-boa-green/40"
                                    >
                                        {label}
                                    </motion.li>
                                ))}
                            </motion.ul>

                            {/* Indicador scroll */}
                            <motion.a
                                href="#filtros"
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.7 }}
                                transition={{ delay: 0.05 }}
                                className="group mt-10 inline-flex items-center gap-2 text-boa-green/90 hover:text-boa-green transition-colors"
                            >
                                <button className="d-flex inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 rounded-md rounded-xl2 bg-boa-green text-white hover:bg-boa-green/90 shadow-[0_10px_28px_rgba(30,122,102,.35)] px-8">
                                    Explorar Actividades
                                    <span className="inline-block h-2.5 w-2.5 border-b-2 border-r-2 border-current rotate-45 translate-y-0 group-hover:translate-y-[2px] transition-transform" />
                                </button>
                            </motion.a>
                        </div>
                        {/* === FIN CONTENIDO === */}
                    </div>
                </div>
            </section>

            {/* Sección de actividades (nuevo componente) */}
            <Activities activities={activities} />
            
            <ActivitiesCalendar activities={activities} /> 


        </Layout>
    );
}
