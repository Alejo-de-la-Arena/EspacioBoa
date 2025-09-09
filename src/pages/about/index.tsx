// pages/about/index.tsx
import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
    Coffee,
    Users,
    Heart,
    Leaf,
    Camera,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


/** ===== Anim helpers (suaves, cálidos) ===== */
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };


export default function AboutPage() {
    // --------- Galería (tabs + lightbox) ---------
    const galleryOld = [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1459664018906-085c36f472af?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1200&auto=format&fit=crop",
    ];
    const galleryNow = [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop",
    ];
    const [tab, setTab] = useState<"old" | "now">("old");
    const currentGallery = tab === "old" ? galleryOld : galleryNow;


    // Lightbox
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const openLightbox = (i: number) => {
        setLightboxIndex(i);
        setLightboxOpen(true);
    };


    // --------- Equipo (slider compacto) ---------
    const team = [
        {
            name: "Isabella Martínez",
            role: "Dirección Creativa",
            focus: "Experiencias con propósito",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164907/realistic_photograph_of_an_american_woman_35_os79ba.jpg",
        },
        {
            name: "Marco Rodriguez",
            role: "Head Barista",
            focus: "Curaduría de café",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164737/You_Won_t_Believe_These_People_Are_Generated_by_Artificial_Intelligence_u4ib6f.jpg",
        },
        {
            name: "Carmen Silva",
            role: "Coordinación de Bienestar",
            focus: "Programas + Comunidad",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164996/17b2ca7e-f301-415a-a1cc-ed68d2878f2e_arpdbn.jpg",
        },
        {
            name: "Diego Herrera",
            role: "Chef & Nutrición",
            focus: "Gastronomía consciente",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756165082/279418af-6409-4445-af1c-ffdd8e303b68_oxhh9u.jpg",
        },
    ];
    const [idx, setIdx] = useState(0);
    const prev = () => setIdx((p) => (p - 1 + team.length) % team.length);
    const next = () => setIdx((p) => (p + 1) % team.length);


    // Navegación por teclado (galería y equipo) — accesible
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (lightboxOpen) {
                if (e.key === "ArrowRight") setLightboxIndex((p) => (p + 1) % currentGallery.length);
                if (e.key === "ArrowLeft")
                    setLightboxIndex((p) => (p - 1 + currentGallery.length) % currentGallery.length);
                if (e.key === "Escape") setLightboxOpen(false);
            } else {
                if (e.key === "ArrowRight") next();
                if (e.key === "ArrowLeft") prev();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightboxOpen, currentGallery.length]);


    return (
        <Layout>
            <div className="font-sans relative">
                {/* capa de grano sutil en toda la page */}
                <GrainOverlay />


                {/* ========= 1) HISTORIA DEL LUGAR (relato + GALERÍA) ========= */}
                <section className="py-16 bg-white relative overflow-hidden">
                    {/* blobs orgánicos esquinados (solo verde) */}
                    <OrganicBlob className="left-[-6rem] top-[-6rem]" size={360} />
                    <OrganicBlob className="right-[-6rem] bottom-[-6rem]" size={300} />


                    <div className="container mx-auto max-w-6xl px-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                            {/* Relato */}
                            <motion.div
                                className="md:col-span-2"
                                variants={stagger}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <motion.div variants={fadeUp} className="flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                                    <p className="text-sm font-medium text-neutral-900">Historia del lugar</p>
                                </motion.div>
                                <motion.h2
                                    variants={fadeUp}
                                    className="mt-2 text-3xl font-extrabold text-neutral-900 leading-tight"
                                >
                                    Un espacio con alma, abierto a la ciudad.
                                </motion.h2>
                                <BrushUnderline className="mt-2" />
                                <motion.p variants={fadeUp} className="mt-4 text-neutral-700">
                                    La casa que hoy habita BOA fue punto de encuentro de vecinos y viajeros por
                                    décadas. Entre plantas, luz natural y maderas nobles, recuperamos esa esencia:
                                    un refugio simple para conversar, crear y estar mejor.
                                </motion.p>
                                <motion.p variants={fadeUp} className="mt-3 text-neutral-700">
                                    Nuestra propuesta conserva lo mejor de la tradición —el café bien hecho— y lo
                                    mezcla con lo que nos mueve hoy: comunidad y bienestar.
                                </motion.p>
                            </motion.div>


                            {/* Galería con tabs Antiguas / Hoy */}
                            <div className="md:col-span-3">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Camera className="h-5 w-5 text-emerald-700" />
                                        <h3 className="font-semibold text-neutral-900">Galería de fotos</h3>
                                    </div>
                                    <div className="inline-flex rounded-xl border border-neutral-200 p-1 bg-white shadow-sm">
                                        <button
                                            onClick={() => setTab("old")}
                                            className={`px-3 py-1.5 text-sm rounded-lg transition ${tab === "old"
                                                ? "bg-emerald-600 text-white"
                                                : "text-neutral-700 hover:bg-neutral-50"
                                                }`}
                                        >
                                            Antiguas
                                        </button>
                                        <button
                                            onClick={() => setTab("now")}
                                            className={`px-3 py-1.5 text-sm rounded-lg transition ${tab === "now"
                                                ? "bg-emerald-600 text-white"
                                                : "text-neutral-700 hover:bg-neutral-50"
                                                }`}
                                        >
                                            Hoy
                                        </button>
                                    </div>
                                </div>


                                {/* Grid tipo “masonry simple” con hover tilt + lightbox */}
                                <motion.div
                                    variants={stagger}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.1 }}
                                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                                >
                                    {currentGallery.map((src, i) => (
                                        <motion.button
                                            key={i}
                                            variants={fadeUp}
                                            whileHover={{ y: -3, rotate: i % 2 === 0 ? -0.4 : 0.4 }}
                                            onClick={() => openLightbox(i)}
                                            className={`relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 cursor-zoom-in ${i % 4 === 0 ? "md:col-span-2 aspect-[3/2]" : "aspect-[4/5]"
                                                }`}
                                            aria-label={`Abrir foto ${i + 1} (${tab})`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={src}
                                                alt={`Galería ${tab} ${i + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                                            />
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                        </motion.button>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* ========= 2) HISTORIA DE BOA — Filosofía & propósito ========= */}
                <section className="py-16 bg-neutral-50 relative overflow-hidden">
                    <OrganicBlob className="right-[-5rem] top-[-5rem]" size={280} />
                    <div className="container mx-auto max-w-6xl px-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                            <motion.div
                                className="md:col-span-2"
                                variants={stagger}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <motion.div variants={fadeUp} className="flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                                    <p className="text-sm font-medium text-neutral-900">Historia de BOA</p>
                                </motion.div>
                                <motion.h2 variants={fadeUp} className="mt-2 text-3xl font-extrabold text-neutral-900">
                                    Filosofía y propósito
                                </motion.h2>
                                <BrushUnderline className="mt-2" />
                                <motion.p variants={fadeUp} className="mt-4 text-neutral-700">
                                    BOA nace como una respuesta simple: necesitamos lugares donde bajar un cambio y
                                    volver a encontrarnos. Hacemos café con respeto por el origen, proponemos
                                    actividades que suman bienestar y cuidamos que todo suceda con calidez y
                                    cercanía.
                                </motion.p>
                                <motion.p variants={fadeUp} className="mt-3 text-neutral-700">
                                    Nuestro propósito es construir comunidad a partir de experiencias honestas: una
                                    buena taza, una charla, un taller que te mueva. Nada más, nada menos.
                                </motion.p>
                            </motion.div>


                            {/* statements en tarjetas */}
                            <motion.div
                                className="md:col-span-1 space-y-4"
                                variants={stagger}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {[
                                    { icon: Coffee, title: "Café bien hecho", text: "Curaduría y trazabilidad." },
                                    { icon: Users, title: "Encuentros reales", text: "Comunidad abierta, sin pose." },
                                    { icon: Leaf, title: "Bienestar sencillo", text: "Hábitos que se sostienen." },
                                ].map(({ icon: Icon, title, text }, i) => (
                                    <motion.div key={i} variants={fadeUp}>
                                        <Card className="rounded-2xl border-neutral-200 hover:shadow-md transition">
                                            <CardContent className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-neutral-900">{title}</h4>
                                                        <p className="text-sm text-neutral-600">{text}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* ========= 3) EQUIPO (slider más cálido e interactivo) ========= */}
                <section className="py-16 bg-white relative overflow-hidden">
                    <OrganicBlob className="left-[-4rem] bottom-[-4rem]" size={240} />
                    <div className="container mx-auto max-w-6xl px-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                                <p className="text-sm font-medium text-neutral-900">Equipo</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={prev}
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full border-neutral-200"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={next}
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full border-neutral-200"
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>


                        {/* Card principal con transición y tilt sutil */}
                        <div className="mt-6 mx-auto max-w-3xl">
                            <div className="relative">
                                <div className="absolute -inset-0.5 rounded-[20px] bg-emerald-500/10 blur-sm" />
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.28 }}
                                        whileHover={{ rotate: -0.3 }}
                                    >
                                        <Card className="rounded-2xl border-neutral-200 overflow-hidden bg-white">
                                            <CardContent className="p-0">
                                                <div className="grid grid-cols-5">
                                                    {/* Foto */}
                                                    <div className="col-span-2 relative h-[240px] md:h-[260px]">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={team[idx].image}
                                                            alt={team[idx].name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                                    </div>
                                                    {/* Info */}
                                                    <div className="col-span-3 p-6 flex flex-col justify-center">
                                                        <h3 className="text-2xl font-extrabold text-neutral-900">{team[idx].name}</h3>
                                                        <p className="mt-1 font-semibold text-emerald-700">{team[idx].role}</p>
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                                {team[idx].focus}
                                                            </span>
                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                                Cercanía
                                                            </span>
                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                                Excelencia
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </AnimatePresence>
                            </div>


                            {/* Dots */}
                            <div className="mt-4 flex justify-center gap-2">
                                {team.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIdx(i)}
                                        className={`h-2.5 w-2.5 rounded-full transition ${i === idx ? "bg-emerald-600 scale-110" : "bg-neutral-300 hover:bg-neutral-400"
                                            }`}
                                        aria-label={`Miembro ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>


                {/* ========= 4) VALORES & VISIÓN ========= */}
                <section className="py-16 bg-neutral-50 relative overflow-hidden">
                    <OrganicBlob className="right-[-4rem] bottom-[-4rem]" size={220} />
                    <div className="container mx-auto max-w-6xl px-4 relative z-10">
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {[
                                { title: "Conexión", text: "Encuentros reales que suman.", icon: Users },
                                { title: "Café", text: "Especialidad con propósito.", icon: Coffee },
                                { title: "Bienestar", text: "Bienestar que transforma.", icon: Heart },
                            ].map(({ title, text, icon: Icon }, i) => (
                                <motion.div key={i} variants={fadeUp}>
                                    <Card className="rounded-2xl border-neutral-200 hover:shadow-md transition">
                                        <CardContent className="p-6">
                                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h4 className="mt-3 text-xl font-bold text-neutral-900">{title}</h4>
                                            <p className="mt-1 text-neutral-600">{text}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>


                {/* ========= 5) CTA ========= */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto max-w-6xl px-4 text-center">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-900">
                            Conocé nuestras actividades
                        </h3>
                        <p className="mt-2 text-neutral-600">
                            Probá una clase, tomá una taza y quedate. BOA es casa.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                                Reservar actividad
                            </Button>
                            <Button variant="outline" className="rounded-xl">
                                Ver próximos eventos
                            </Button>
                        </div>
                    </div>
                </section>


                {/* ========= LIGHTBOX ========= */}
                <AnimatePresence>
                    {lightboxOpen && (
                        <Lightbox
                            images={currentGallery}
                            startIndex={lightboxIndex}
                            onClose={() => setLightboxOpen(false)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}


/* ================== Componentes utilitarios ================== */


// Subrayado “handmade” en verde BOA
function BrushUnderline({ className = "" }: { className?: string }) {
    return (
        <div className={className}>
            <svg width="200" height="16" viewBox="0 0 200 16" fill="none" className="block">
                <path
                    d="M4 10 C70 24,150 -4,196 8"
                    stroke="#059669" /* emerald-600 */
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity=".85"
                />
            </svg>
        </div>
    );
}


// Grano suave para calidez
function GrainOverlay() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-soft-light"
            style={{
                backgroundImage:
                    "url('https://res.cloudinary.com/dfrhrnwwi/image/upload/v1700000000/noise_2x.png')",
                backgroundRepeat: "repeat",
            }}
        />
    );
}


// Blob orgánico verde (movimiento lento)
function OrganicBlob({ className = "", size = 260 }: { className?: string; size?: number }) {
    return (
        <motion.div
            aria-hidden
            className={`pointer-events-none absolute rounded-[45%] bg-emerald-300/20 blur-3xl ${className}`}
            style={{ width: size, height: size }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
    );
}


// Lightbox minimal (teclas ← → Esc)
function Lightbox({
    images,
    startIndex,
    onClose,
}: {
    images: string[];
    startIndex: number;
    onClose: () => void;
}) {
    const [i, setI] = useState(startIndex);
    const prev = useCallback(() => setI((p) => (p - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setI((p) => (p + 1) % images.length), [images.length]);


    return (
        <motion.div
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/90 hover:text-white"
                aria-label="Cerrar"
            >
                <X className="h-6 w-6" />
            </button>


            <button
                onClick={prev}
                className="absolute left-4 md:left-6 text-white/80 hover:text-white"
                aria-label="Anterior"
            >
                <ChevronLeft className="h-8 w-8" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 md:right-6 text-white/80 hover:text-white"
                aria-label="Siguiente"
            >
                <ChevronRight className="h-8 w-8" />
            </button>


            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative max-w-5xl w-full"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={images[i]}
                    alt={`Foto ${i + 1}`}
                    className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                />
            </motion.div>
        </motion.div>
    );
}



