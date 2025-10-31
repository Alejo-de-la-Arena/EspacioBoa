// pages/about/index.tsx
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

import { RevealOnScroll, REVEAL_PRESET_CYCLE } from "@/components/RevealOnScroll";

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
    /* ========== GALERÍA (una sola, curada BOA) ========== */
    const galleryBoa = [
        // Usá tus fotos BOA acá (mantengo algunas temporales)
        "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5183.webp",
        "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5435.webp",
        "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5585.webp",
        "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5259.webp",
        "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5202.webp",
        "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5300.webp",
        "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5400.webp"
    ];

    /* Lightbox */
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
                if (e.key === "ArrowRight") setLightboxIndex((p) => (p + 1) % galleryBoa.length);
                if (e.key === "ArrowLeft") setLightboxIndex((p) => (p - 1 + galleryBoa.length) % galleryBoa.length);
                if (e.key === "Escape") setLightboxOpen(false);
            } else {
                if (e.key === "ArrowRight") next();
                if (e.key === "ArrowLeft") prev();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightboxOpen]);


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
                            <RevealOnScroll
                                variant="tiltUp" amount={0.3}
                                className="md:col-span-2"
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
                            </RevealOnScroll>


                            {/* Galería */}
                            <RevealOnScroll variant="zoomRotate" amount={0.3} className="md:col-span-3">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Camera className="h-5 w-5 text-emerald-700" />
                                        <h3 className="font-semibold text-neutral-900">Galería de fotos</h3>
                                    </div>
                                    <span className="text-xs text-neutral-500">Momentos BOA</span>
                                </div>

                                <motion.div
                                    variants={stagger}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                                >
                                    {galleryBoa.map((src, i) => {
                                        const wide = i % 7 === 0 || i % 11 === 0;
                                        return (
                                            <motion.button
                                                key={`boa-${i}`}
                                                variants={fadeUp}
                                                whileHover={{ y: -3, rotate: i % 2 === 0 ? -0.4 : 0.4 }}
                                                onClick={() => openLightbox(i)}
                                                className={`relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 cursor-zoom-in ${wide ? "md:col-span-2 aspect-[3/2]" : "aspect-[4/5]"
                                                    }`}
                                                aria-label={`Abrir foto ${i + 1}`}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={src}
                                                    alt={`Galería BOA ${i + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            </RevealOnScroll>

                        </div>
                    </div>
                </SectionSurface>


                {/* ===== 2) FILOSOFÍA Y PROPÓSITO  ===== */}
                <SectionSurface className="py-20">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
                            {/* Texto izquierdo (lead + pilares + micro-manifiesto) */}
                            <RevealOnScroll
                                variant="blurRise" amount={0.3}
                                className="md:col-span-3"
                            >
                                <motion.div variants={fadeUp} className="flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                                    <p className="text-sm font-medium text-neutral-900">Historia de BOA</p>
                                </motion.div>

                                <motion.h2 variants={fadeUp} className="mt-2 text-3xl md:text-4xl font-extrabold text-neutral-900">
                                    Filosofía y propósito
                                </motion.h2>
                                <BrushUnderline className="mt-2" />

                                <motion.p variants={fadeUp} className="mt-4 text-neutral-700 text-lg leading-relaxed">
                                    En BOA creemos en <strong className="text-neutral-900">la simpleza bien hecha</strong>:
                                    una taza honesta, un encuentro que suma y un hábito que podés sostener.
                                    Somos un lugar para <em>bajar un cambio</em> sin perder el pulso creativo.
                                </motion.p>

                                {/* Pilares */}
                                <motion.div variants={fadeUp} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { icon: Coffee, title: "Café bien hecho", desc: "Origen, trazabilidad y cariño en la barra." },
                                        { icon: Users, title: "Encuentros reales", desc: "Charlas, talleres y comunidad que se cuida." },
                                        { icon: Leaf, title: "Bienestar sencillo", desc: "Rutinas amables que encajan en tu día." },
                                    ].map(({ icon: Icon, title, desc }, i) => (
                                        <div key={i} className="flex gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50/40">
                                            <div className="w-9 h-9 rounded-lg bg-white text-emerald-700 flex items-center justify-center ring-1 ring-emerald-100">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-neutral-900">{title}</div>
                                                <div className="text-sm text-neutral-600">{desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Micro-manifiesto con quote */}
                                <motion.div
                                    variants={fadeUp}
                                    className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50/50 border border-neutral-100"
                                >
                                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                                        <Quote className="h-5 w-5" />
                                        <span className="text-sm font-medium">Nuestro manifiesto</span>
                                    </div>
                                    <p className="text-neutral-700 leading-relaxed">
                                        “Elegimos el camino largo y atento: <strong>cosas ricas, tiempos humanos y vínculos reales</strong>.
                                        Si te vas con el corazón un poco más liviano, hicimos bien nuestro trabajo.”
                                    </p>
                                </motion.div>
                            </RevealOnScroll>


                            <RevealOnScroll
                                as="div"
                                variant="pop"
                                amount={0.28}
                                className="md:col-span-2"
                                style={{ overflow: "visible", contain: "none" }}
                            >
                                <motion.div
                                    className="md:col-span-2"
                                    initial={{ opacity: 0, y: 8 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <div className="relative">
                                        {/* marco principal */}
                                        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
                                            <Image
                                                src="https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5407.webp"
                                                alt="Mesa larga con café y plantas"
                                                width={1200}
                                                height={900}
                                                className="object-cover w-full h-[360px]"
                                                priority
                                            />
                                            {/* velo suave */}
                                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent" />
                                        </div>

                                        {/* tarjetita flotante */}
                                        <div className="absolute -bottom-5 -left-4 sm:-left-6">
                                            <div className="rounded-2xl bg-white shadow-lg border border-neutral-200 px-4 py-3 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center ring-1 ring-emerald-100">
                                                    <Coffee className="h-5 w-5" />
                                                </div>
                                                <div className="leading-tight">
                                                    <div className="text-sm font-semibold text-neutral-900">Desde 2025</div>
                                                    <div className="text-xs text-neutral-500">Martínez, Buenos Aires</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* mini collage lateral */}
                                        <div className="hidden sm:flex flex-col gap-3 absolute -right-6 top-6 w-28">
                                            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src="https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5327.webp"
                                                    alt="Detalle en barra"
                                                    className="w-full h-28 object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src="https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5284.webp"
                                                    alt="Plantas y luz"
                                                    className="w-full h-28 object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </RevealOnScroll>
                        </div>
                    </div>
                </SectionSurface>



                {/* ===== (NUEVO) VOCES DE LA COMUNIDAD — Testimonios ===== */}
                <RevealOnScroll
                    as="section"
                    variant="zoomRotate"
                    amount={0.22}
                    className="py-16 bg-neutral-50"
                >
                    <div className="container max-w-6xl mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-10">
                            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-3">
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
                </RevealOnScroll>


                {/* ===== 3) EQUIPO ===== */}
                <SectionSurface className="py-16">
                    <RevealOnScroll
                        as="div"
                        variant="zoomRotate"
                        amount={0.25}
                        className=""
                    // si algún elemento se sale a los costados, permite overflow:
                    // style={{ overflow: "visible", contain: "none" }}
                    >
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
                    </RevealOnScroll>
                </SectionSurface>
            </div>


            {/* LIGHTBOX */}
            <AnimatePresence>
                {lightboxOpen && (
                    <Lightbox
                        images={galleryBoa}
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

