// pages/about/index.tsx
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import {
    Coffee,
    Users,
    Leaf,
    Camera,
    ChevronLeft,
    ChevronRight,
    X,
    Quote,
    Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


/* ===== Anim helpers ===== */
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };


export default function AboutPage() {
    /* ========== GALERÍA (tabs + más imágenes + lightbox) ========== */
    const galleryOld = [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1459664018906-085c36f472af?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200&auto=format&fit=crop",
    ];


    const galleryNow = [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1200&auto=format&fit=crop",
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


    /* ========== EQUIPO (slider) ========== */
    const team = [
        {
            name: "Isabella Martínez",
            role: "Dirección Creativa",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164907/realistic_photograph_of_an_american_woman_35_os79ba.jpg",
            bio:
                "Diseña la identidad y la experiencia BOA. Cuida que cada detalle —de la señalética a la música— transmita calidez y propósito.",
        },
        {
            name: "Marco Rodriguez",
            role: "Head Barista",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164737/You_Won_t_Believe_These_People_Are_Generated_by_Artificial_Intelligence_u4ib6f.jpg",
            bio:
                "Selecciona orígenes, define curvas de tueste y entrena al equipo. Su misión: una taza honesta, consistente y trazable.",
        },
        {
            name: "Carmen Silva",
            role: "Coordinación de Bienestar",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164996/17b2ca7e-f301-415a-a1cc-ed68d2878f2e_arpdbn.jpg",
            bio:
                "Programa clases y talleres, teje comunidad y acompaña a los profes. Bienestar sencillo, hábitos que se sostienen.",
        },
        {
            name: "Diego Herrera",
            role: "Chef & Nutrición",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756165082/279418af-6409-4445-af1c-ffdd8e303b68_oxhh9u.jpg",
            bio:
                "Piensa una cocina rica y consciente. Temporada, producto y sabor casero para acompañar la mesa y el buen café.",
        },
    ];


    const [idx, setIdx] = useState(0);
    const prev = () => setIdx((p) => (p - 1 + team.length) % team.length);
    const next = () => setIdx((p) => (p + 1) % team.length);


    // keyboard
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (lightboxOpen) {
                if (e.key === "ArrowRight")
                    setLightboxIndex((p) => (p + 1) % currentGallery.length);
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


    /* ===== Testimonios (mismo formato que en “Espacios”) ===== */
    const testimonials = [
        {
            id: 1,
            name: "María González",
            role: "Freelancer",
            avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b4b12eb1?w=200&auto=format&fit=crop",
            text:
                "BOA se siente como casa: luz linda, café rico y un ritmo que inspira a enfocarse sin aislarse.",
            rating: 5,
        },
        {
            id: 2,
            name: "Carlos Mendez",
            role: "Organizador de eventos",
            avatar:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
            text:
                "Hicimos un workshop y la energía del lugar sumó muchísimo. Equipo atento y espacio súper adaptable.",
            rating: 5,
        },
        {
            id: 3,
            name: "Ana Rodríguez",
            role: "Instructora de yoga",
            avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop",
            text:
                "La terraza, al sol de la tarde, es mágica. Mis alumnos salen renovados, yo también.",
            rating: 5,
        },
    ];


    return (
        <section>
            <div className="font-sans">
                {/* ===== 1) HISTORIA DEL LUGAR ===== */}
                <SectionSurface className="py-16">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                            {/* Texto */}
                            <motion.div
                                className="md:col-span-2"
                                variants={stagger}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <motion.div variants={fadeUp} className="flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                                    <p className="text-sm font-medium text-neutral-900">
                                        Historia del lugar
                                    </p>
                                </motion.div>
                                <motion.h2
                                    variants={fadeUp}
                                    className="mt-2 text-3xl font-extrabold text-neutral-900 leading-tight"
                                >
                                    Un espacio con alma, abierto a la ciudad.
                                </motion.h2>
                                <BrushUnderline className="mt-2" />
                                <motion.p variants={fadeUp} className="mt-4 text-neutral-700">
                                    BOA es una casa luminosa donde la ciudad baja un cambio. Entre
                                    plantas y madera, te invitamos a respirar hondo, charlar sin
                                    apuro y volver a lo simple.
                                </motion.p>
                                <motion.p variants={fadeUp} className="mt-3 text-neutral-700">
                                    Cuidamos el café de origen, proponemos talleres y hábitos
                                    suaves de bienestar y abrimos la mesa para compartir.{" "}
                                    <span className="text-neutral-900 font-semibold">
                                        Todo en uno, sin pose.
                                    </span>
                                </motion.p>
                            </motion.div>


                            {/* Galería */}
                            <div className="md:col-span-3">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Camera className="h-5 w-5 text-emerald-700" />
                                        <h3 className="font-semibold text-neutral-900">
                                            Galería de fotos
                                        </h3>
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


                                <motion.div
                                    key={tab}
                                    variants={stagger}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                                >
                                    {currentGallery.map((src, i) => {
                                        const wide = i % 7 === 0 || i % 11 === 0;
                                        return (
                                            <motion.button
                                                key={`${tab}-${i}`}
                                                variants={fadeUp}
                                                whileHover={{ y: -3, rotate: i % 2 === 0 ? -0.4 : 0.4 }}
                                                onClick={() => openLightbox(i)}
                                                className={`relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 cursor-zoom-in ${wide ? "md:col-span-2 aspect-[3/2]" : "aspect-[4/5]"
                                                    }`}
                                                aria-label={`Abrir foto ${i + 1} (${tab})`}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={src}
                                                    alt={`Galería ${tab} ${i + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </SectionSurface>


                {/* ===== 2) FILOSOFÍA Y PROPÓSITO ===== */}
                <SectionSurface className="py-20">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
                            {/* Imagen izquierda */}
                            <motion.div
                                className="md:col-span-2"
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
                                    <Image
                                        src="https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1600&auto=format&fit=crop"
                                        alt="Personas compartiendo en una mesa larga con plantas"
                                        width={1200}
                                        height={900}
                                        className="object-cover w-full h-[320px]"
                                    />
                                </div>
                            </motion.div>


                            {/* Texto derecha */}
                            <motion.div
                                className="md:col-span-3"
                                variants={stagger}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.25 }}
                            >
                                <motion.div variants={fadeUp} className="flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                                    <p className="text-sm font-medium text-neutral-900">
                                        Historia de BOA
                                    </p>
                                </motion.div>


                                <motion.h2
                                    variants={fadeUp}
                                    className="mt-2 text-3xl font-extrabold text-neutral-900"
                                >
                                    Filosofía y propósito
                                </motion.h2>
                                <BrushUnderline className="mt-2" />


                                <motion.p variants={fadeUp} className="mt-4 text-neutral-700">
                                    BOA es un punto de encuentro:{" "}
                                    <strong className="text-neutral-900">
                                        café bien hecho, comunidad abierta y bienestar sencillo
                                    </strong>
                                    . Queremos que te sientas en casa: con tiempo para vos y
                                    espacio para compartir.
                                </motion.p>
                                <motion.p variants={fadeUp} className="mt-3 text-neutral-700">
                                    Nuestro propósito es cultivar hábitos que se sostienen: una
                                    buena taza, una conversación honesta, un taller que te mueva.
                                    Cercanía primero, siempre.
                                </motion.p>


                                <motion.div
                                    variants={fadeUp}
                                    className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
                                >
                                    {[
                                        { icon: Coffee, title: "Café bien hecho" },
                                        { icon: Users, title: "Encuentros reales" },
                                        { icon: Leaf, title: "Bienestar sencillo" },
                                    ].map(({ icon: Icon, title }, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-medium text-neutral-900">
                                                {title}
                                            </span>
                                        </div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </SectionSurface>


                {/* ===== (NUEVO) VOCES DE LA COMUNIDAD — Testimonios ===== */}
                <section className="py-16 bg-neutral-50">
                    <div className="container max-w-6xl mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-10">
                            <h2 className="boa-heading text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-3">
                                Voces de la comunidad
                            </h2>
                            <p className="text-neutral-600">
                                Somos un espacio nuevo y crecemos con cada encuentro. Esto es lo
                                que cuentan quienes ya pasaron por BOA.
                            </p>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((t) => (
                                <Card key={t.id} className="border-0 shadow-lg bg-white rounded-3xl">
                                    <CardContent className="p-7">
                                        <div className="flex items-center gap-2 text-emerald-700 mb-3">
                                            <Quote className="h-5 w-5" />
                                            <span className="text-sm font-medium">Experiencia real</span>
                                        </div>
                                        <p className="text-neutral-700 leading-relaxed mb-6">
                                            “{t.text}”
                                        </p>
                                        <div className="flex items-center">
                                            <Avatar className="w-12 h-12 mr-3">
                                                <AvatarImage src={t.avatar} alt={t.name} />
                                                <AvatarFallback>{t.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="font-semibold text-neutral-900">
                                                    {t.name}
                                                </div>
                                                <div className="text-sm text-neutral-500">{t.role}</div>
                                            </div>
                                            <div className="flex">
                                                {[...Array(t.rating)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-4 w-4 text-amber-400 fill-current"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>


                {/* ===== 3) EQUIPO ===== */}
                <SectionSurface className="py-16">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
                                Nuestro equipo
                            </h2>
                            <div className="flex justify-center">
                                <BrushUnderline className="mt-2" />
                            </div>
                        </div>


                        <div className="mt-8 relative overflow-visible">
                            {/* Flechas laterales (afuera del card) */}
                            <Button
                                onClick={prev}
                                variant="outline"
                                size="icon"
                                className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-neutral-700 border border-neutral-200 shadow-md hover:bg-neutral-50 z-20"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                onClick={next}
                                variant="outline"
                                size="icon"
                                className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-neutral-700 border border-neutral-200 shadow-md hover:bg-neutral-50 z-20"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>


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
                                            <div className="grid grid-cols-12">
                                                <div className="col-span-12 md:col-span-5 relative h-[260px] md:h-[380px]">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={team[idx].image}
                                                        alt={team[idx].name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                                </div>
                                                <div className="col-span-12 md:col-span-7 p-6 md:p-10 flex flex-col justify-center">
                                                    <h3 className="text-2xl md:text-4xl font-extrabold text-neutral-900">
                                                        {team[idx].name}
                                                    </h3>
                                                    <p className="mt-1 md:mt-3 text-emerald-700 font-semibold text-lg md:text-xl">
                                                        {team[idx].role}
                                                    </p>
                                                    <p className="mt-4 text-neutral-700 leading-relaxed text-base md:text-lg">
                                                        {team[idx].bio}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>


                            {/* Dots */}
                            <div className="mt-4 flex justify-center gap-2">
                                {team.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIdx(i)}
                                        className={`h-2.5 w-2.5 rounded-full transition ${i === idx
                                            ? "bg-emerald-600 scale-110"
                                            : "bg-neutral-300 hover:bg-neutral-400"
                                            }`}
                                        aria-label={`Miembro ${i + 1}`}
                                    />
                                ))}
                            </div>


                            {/* Flechas en mobile, debajo */}
                            <div className="mt-4 flex md:hidden justify-center gap-2">
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
                    </div>
                </SectionSurface>
            </div>


            {/* LIGHTBOX */}
            <AnimatePresence>
                {lightboxOpen && (
                    <Lightbox
                        images={currentGallery}
                        startIndex={lightboxIndex}
                        onClose={() => setLightboxOpen(false)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}


/* ================== Utilitarios ================== */


/** Papel: línea curva bajo títulos */
function BrushUnderline({ className = "" }: { className?: string }) {
    return (
        <div className={className}>
            <svg width="200" height="16" viewBox="0 0 200 16" fill="none" className="block">
                <path
                    d="M4 10 C70 24,150 -4,196 8"
                    stroke="#059669"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity=".85"
                />
            </svg>
        </div>
    );
}


/** Superficie blanca con detalles sutiles (trama, vignettes y hairlines) */
function SectionSurface({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={`relative bg-white overflow-hidden ${className}`}>
            {/* Hairlines */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-200/60 to-transparent" />
            {/* Trama de puntitos (muy leve) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] [background-image:radial-gradient(#111_0.7px,transparent_0.7px)] [background-size:20px_20px]" />
            {/* Vignettes súper suaves en esquinas */}
            <div className="absolute -top-16 -left-16 w-64 h-64 pointer-events-none opacity-[0.06] bg-[radial-gradient(closest-side,rgba(0,0,0,0.08),transparent)]" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 pointer-events-none opacity-[0.05] bg-[radial-gradient(closest-side,rgba(0,0,0,0.08),transparent)]" />
            <div className="relative z-10">{children}</div>
        </section>
    );
}


/** Lightbox simple */
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
    const prev = useCallback(
        () => setI((p) => (p - 1 + images.length) % images.length),
        [images.length]
    );
    const next = useCallback(
        () => setI((p) => (p + 1) % images.length),
        [images.length]
    );


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

