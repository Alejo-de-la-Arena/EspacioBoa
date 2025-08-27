import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
    Coffee,
    Heart,
    Calendar,
    MapPin,
    Gift,
    ArrowRight,
    Users,
    Clock,
    Star,
    Sparkles,
    ChevronDown,
    Leaf,
    Ticket,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function HomePage() {
    const { activities, events, menuItems, giftCards, loading } = useApp();

    const featuredActivities = activities.filter(activity => activity.featured).slice(0, 2);
    const featuredEvents = events.filter(event => event.featured).slice(0, 2);
    const featuredMenu = menuItems.filter(item => item.featured).slice(0, 3);
    const featuredGiftCards = giftCards.slice(0, 2);

    // variants de animación (podés moverlos a otro archivo si querés)
    const container = {
        hidden: { opacity: 0, y: 8 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.12, delayChildren: 0.2 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
    };

    // Animations navigation cards

    const cardsContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
    };
    const cardItem = {
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
    };

    const list = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
    };


    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Coffee className="h-12 w-12" />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero Section */}
            {/* Hero Section */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={container}
                className="relative min-h-[88vh] flex items-center justify-center overflow-hidden text-white"
            >
                {/* Imagen de fondo (cálida) */}
                <Image
                    src="https://res.cloudinary.com/dfrhrnwwi/image/upload/f_auto,q_80,w_2400/v1756150406/hrushi-chavhan-R_z0epttP-E-unsplash_qcwnqw.jpg"
                    alt="Ambiente cálido de BOA con café, plantas y luz suave"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                {/* Overlay de contraste (de cacao a transparente) */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/40 to-neutral-900/15" />

                {/* Blobs sutiles (vibra artística) */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-10 -left-10 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-teal-300/10 blur-3xl" />
                    <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-amber-300/10 blur-2xl" />
                </div>

                {/* Marca de agua del logo (minimalista) */}
                <img
                    src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg"
                    alt=""
                    aria-hidden="true"
                    className="absolute top-10 left-1/2 -translate-x-1/2 opacity-10 w-20 sm:w-24"
                />

                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        {/* Logo highlight + Título */}
                        <motion.div
                            variants={item}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            {/* Radial highlight suave tras el título */}
                            <span
                                aria-hidden
                                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -mt-6 h-32 w-32 rounded-full blur-2xl
                     bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.28),transparent_60%)]"
                            />
                            <h1 className="font-sans text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight">
                                Espacio BOA
                            </h1>
                        </motion.div>

                        {/* Tagline (más cercano, evitando “café + centro holístico”) */}
                        <motion.p
                            variants={item}
                            className="font-sans text-lg sm:text-2xl text-neutral-50/95 font-light leading-relaxed"
                        >
                            Café, bienestar y comunidad. <span className="underline decoration-emerald-400/60 underline-offset-4">Vení a conocernos.</span>
                        </motion.p>

                        {/* Chips de identidad */}
                        <motion.div
                            variants={item}
                            className="flex flex-wrap items-center justify-center gap-2 pt-1"
                        >
                            {["café de especialidad", "bienestar", "arte", "comunidad"].map((t) => (
                                <span
                                    key={t}
                                    className="font-sans text-sm px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-white/90"
                                >
                                    {t}
                                </span>
                            ))}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            variants={item}
                            className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
                        >
                            <Link href="/activities">
                                <Button
                                    size="lg"
                                    className="font-sans bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl
                       shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30
                       ring-1 ring-emerald-300/40 transition-all duration-300"
                                >
                                    <Heart className="mr-2 h-5 w-5" />
                                    Explorar Actividades
                                </Button>
                            </Link>

                            <Link href="/menu">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="font-sans bg-white/10 hover:bg-white/20 text-white border-white/40 hover:border-white
                       px-8 py-3 rounded-2xl ring-1 ring-white/30 transition-all duration-300"
                                >
                                    <Coffee className="mr-2 h-5 w-5" />
                                    Ver Gastronomía
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Indicador de scroll (sutil) */}
                        <motion.div
                            variants={item}
                            className="pt-2 flex justify-center"
                            aria-hidden="true"
                        >
                            <div className="flex items-center gap-2 text-white/70">
                                <span className="font-sans text-sm">Deslizar</span>
                                <ChevronDown className="h-5 w-5 animate-bounce" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>


            {/* Departamentos – cálido/hippie */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardsContainer}
                className="relative py-20 font-sans"
            >
                {/* fondo papel + manchas orgánicas */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-amber-50/40 to-white" />
                <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* encabezado */}
                    <div className="text-center mb-14">
                        <h2 className="boa-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
                            Nuestros <span className="text-emerald-700">Departamentos</span>
                        </h2>
                        <p className="mt-3 text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto">
                            No somos “café + centro holístico”. Somos BOA. Vení a conocernos.
                        </p>
                    </div>

                    {/* grid cálida */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* ACTIVIDADES */}
                        <motion.div
                            variants={cardItem}
                            whileHover={{ y: -6, rotateX: -0.3, rotateY: 0.3, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 260, damping: 26 }}
                            className="relative"
                        >
                            <Link
                                href="/activities"
                                className="group relative block h-[420px] rounded-[28px] overflow-hidden ring-1 ring-black/5 shadow-[0_12px_28px_rgba(2,6,23,.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                aria-label="Explorar Actividades"
                            >
                                {/* imagen */}
                                <Image
                                    src="https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756216234/34390c1b-4114-4e44-8f6a-eb175921eead_yhgrch.jpg"
                                    alt="Actividades en BOA"
                                    fill
                                    sizes="(min-width: 1024px) 33vw, 100vw"
                                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                                    priority
                                />
                                {/* tint + vidrio */}
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/65 via-emerald-900/30 to-transparent" />
                                <div className="absolute inset-0 bg-white/6 backdrop-blur-[1px]" />

                                {/* contenido */}
                                <Card className="relative h-full bg-transparent border-0 text-white">
                                    <CardContent className="p-7 h-full flex flex-col justify-end">
                                        {/* chip orgánico */}
                                        <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/70 text-emerald-800 px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                            <Heart className="h-3.5 w-3.5" />
                                            BOA Actividades
                                        </div>

                                        {/* título dominante */}
                                        <h3 className="text-3xl sm:text-[32px] font-extrabold leading-tight drop-shadow-sm">
                                            Movimiento & Bienestar
                                        </h3>
                                        <p className="mt-2 text-sm/relaxed sm:text-base text-white/90">
                                            Yoga, arte, respiración, talleres creativos.
                                        </p>

                                        {/* CTA cálido */}
                                        <div className="mt-5">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all group-hover:bg-white/25 group-hover:border-white/60">
                                                Explorar
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* halo verde al hover */}
                                <span className="pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-transparent group-hover:ring-emerald-300/50 transition" />
                            </Link>
                        </motion.div>

                        {/* GASTRONOMÍA */}
                        <motion.div
                            variants={cardItem}
                            whileHover={{ y: -6, rotateX: -0.3, rotateY: 0.3, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 260, damping: 26 }}
                            className="relative"
                        >
                            <Link
                                href="/menu"
                                className="group relative block h-[420px] rounded-[28px] overflow-hidden ring-1 ring-black/5 shadow-[0_12px_28px_rgba(2,6,23,.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                aria-label="Ver Gastronomía"
                            >
                                {/* imagen */}
                                <Image
                                    src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755904741/boa-bowl_v6wn6a.jpg"
                                    alt="Gastronomía de BOA"
                                    fill
                                    sizes="(min-width: 1024px) 33vw, 100vw"
                                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                                />
                                {/* fondo verde sutil + papel */}
                                <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/15 via-emerald-900/45 to-emerald-950/65" />
                                <div className="absolute inset-0 bg-emerald-100/5 mix-blend-soft-light" />

                                <Card className="relative h-full bg-transparent border-0 text-white">
                                    <CardContent className="p-7 h-full flex flex-col justify-end">
                                        <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/70 text-emerald-800 px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                            <Coffee className="h-3.5 w-3.5" />
                                            BOA Gastronomía
                                        </div>

                                        <h3 className="text-3xl sm:text-[32px] font-extrabold leading-tight drop-shadow-sm">
                                            Café & Cocina Consciente
                                        </h3>
                                        <p className="mt-2 text-sm/relaxed sm:text-base text-white/90">
                                            Especialidad y opciones que abrazan.
                                        </p>

                                        <div className="mt-5">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all group-hover:bg-white/25 group-hover:border-white/60">
                                                Ver menú
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <span className="pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-transparent group-hover:ring-emerald-300/50 transition" />
                            </Link>
                        </motion.div>

                        {/* ESPACIOS */}
                        <motion.div
                            variants={cardItem}
                            whileHover={{ y: -6, rotateX: -0.3, rotateY: 0.3, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 260, damping: 26 }}
                            className="relative"
                        >
                            <Link
                                href="/spaces"
                                className="group relative block h-[420px] rounded-[28px] overflow-hidden ring-1 ring-black/5 shadow-[0_12px_28px_rgba(2,6,23,.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                aria-label="Conocer Espacios"
                            >
                                <Image
                                    src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755911507/boa-entrada_ezfcms.jpg"
                                    alt="Espacios de BOA"
                                    fill
                                    sizes="(min-width: 1024px) 33vw, 100vw"
                                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                                />
                                {/* tint cálido + vidrio */}
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/65 via-emerald-900/35 to-transparent" />
                                <div className="absolute inset-0 bg-white/6 backdrop-blur-[1px]" />

                                <Card className="relative h-full bg-transparent border-0 text-white">
                                    <CardContent className="p-7 h-full flex flex-col justify-end">
                                        <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/70 text-emerald-800 px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                            <Leaf className="h-3.5 w-3.5" />
                                            BOA Espacios
                                        </div>

                                        <h3 className="text-3xl sm:text-[32px] font-extrabold leading-tight drop-shadow-sm">
                                            Lugares que abrazan
                                        </h3>
                                        <p className="mt-2 text-sm/relaxed sm:text-base text-white/90">
                                            Verde, luz y texturas para inspirar y conectar.
                                        </p>

                                        <div className="mt-5">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all group-hover:bg-white/25 group-hover:border-white/60">
                                                Conocer
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <span className="pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-transparent group-hover:ring-emerald-300/50 transition" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.section>


            {/* Featured Activities & Events — cuadros/lienzo cálido */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative py-28 font-sans overflow-hidden"
            >
                {/* Fondo: papel + veladuras suaves */}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#FBF7EC_0%,#FFFFFF_60%)]" />
                <div
                    className="absolute inset-0 opacity-[0.22] mix-blend-multiply pointer-events-none"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><defs><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0.1'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.06'/></feComponentTransfer></filter></defs><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                        backgroundSize: "300px 300px",
                    }}
                />
                <div className="absolute -top-20 -left-28 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl" />
                <div className="absolute top-10 -right-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado */}
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-medium ring-1 ring-emerald-300/60">
                            <Sparkles className="h-4 w-4" />
                            agenda viva
                        </span>
                        <h2 className="mt-4 boa-heading text-4xl sm:text-5xl font-extrabold text-neutral-900">
                            Próximas <span className="text-emerald-700">Experiencias</span>
                        </h2>
                        <p className="mt-3 text-lg text-neutral-700 max-w-2xl mx-auto">
                            Encuentros con alma BOA: cercanía, movimiento y creatividad compartida.
                        </p>
                        {/* subrayado orgánico */}
                        <svg className="mx-auto mt-6" width="180" height="18" viewBox="0 0 180 18" fill="none">
                            <path d="M4 10C42 14 78 14 176 8" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" opacity=".7" />
                            <defs>
                                <linearGradient id="g" x1="0" x2="180" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#34D399" /><stop offset=".5" stopColor="#10B981" /><stop offset="1" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Grid dos columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* ACTIVIDADES / “cuadros” */}
                        <motion.div variants={list} className="space-y-7">
                            <div className="flex items-center justify-between">
                                <h3 className="boa-heading text-2xl font-semibold text-neutral-900">Actividades destacadas</h3>
                                <Link href="/activities" className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-900 text-sm font-medium">
                                    Ver todas <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {featuredActivities.map((a, idx) => (
                                <motion.article
                                    key={a.id}
                                    variants={item}
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                                    className="relative"
                                >
                                    {/* marco madera */}
                                    <div className="rounded-[28px] p-2 bg-[linear-gradient(135deg,#a0754e,#caa57f)] shadow-[0_14px_40px_rgba(0,0,0,.10)] ring-1 ring-amber-900/20">
                                        {/* cinta washi (esquinas) */}
                                        <div
                                            className="absolute -top-2 left-8 h-6 w-16 rotate-[-6deg] bg-amber-200/70 ring-1 ring-amber-300/60"
                                            style={{ borderRadius: "4px" }}
                                        />
                                        <div
                                            className="absolute -top-1 right-10 h-6 w-12 rotate-[7deg] bg-emerald-200/70 ring-1 ring-emerald-300/60"
                                            style={{ borderRadius: "4px" }}
                                        />

                                        {/* lienzo */}
                                        <div className="rounded-[22px] overflow-hidden bg-[#FCFAF5] ring-1 ring-black/10">
                                            {/* textura papel */}
                                            <div
                                                className="absolute inset-0 opacity-[0.22] pointer-events-none"
                                                style={{
                                                    backgroundImage:
                                                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><defs><filter id='t'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.05'/></feComponentTransfer></filter></defs><rect width='100%' height='100%' filter='url(%23t)'/></svg>\")",
                                                    backgroundSize: "260px 260px",
                                                }}
                                            />

                                            {/* contenido: imagen “pintada” + textos */}
                                            <div className="relative p-6 flex gap-5">
                                                {/* zona imagen con veladuras cálidas */}
                                                <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-[18px] overflow-hidden ring-1 ring-black/10 flex-shrink-0">
                                                    <img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.05]" />
                                                    {/* manchas tipo pintura */}
                                                    <div
                                                        className="absolute inset-0 pointer-events-none mix-blend-multiply"
                                                        style={{
                                                            background:
                                                                "radial-gradient(60px 36px at 18% 28%, rgba(16,185,129,.18), transparent 60%), radial-gradient(70px 40px at 80% 70%, rgba(245,158,11,.18), transparent 60%)",
                                                        }}
                                                    />
                                                </div>

                                                {/* texto sobre el lienzo */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[1.12rem] font-extrabold text-neutral-900 leading-snug">
                                                        {a.title}
                                                    </h4>
                                                    <p className="mt-1 text-[0.95rem] text-neutral-700/90 line-clamp-2">
                                                        {a.description}
                                                    </p>

                                                    <div className="mt-3 flex items-center justify-between text-[12.5px] text-neutral-600">
                                                        <span className="inline-flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            {a.schedule.day} • {a.schedule.time}
                                                        </span>
                                                        <span className="inline-flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            {a.enrolled}/{a.capacity}
                                                        </span>
                                                    </div>

                                                    {/* “sticker” precio */}
                                                    <div className="mt-4 inline-flex -rotate-1 items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300/60 shadow-sm">
                                                        ${a.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>

                        {/* EVENTOS / “cuadros” */}
                        <motion.div variants={list} className="space-y-7">
                            <div className="flex items-center justify-between">
                                <h3 className="boa-heading text-2xl font-semibold text-neutral-900">Eventos especiales</h3>
                                <Link href="/events" className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-900 text-sm font-medium">
                                    Ver todos <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {featuredEvents.map((e, idx) => (
                                <motion.article
                                    key={e.id}
                                    variants={item}
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                                    className="relative"
                                >
                                    {/* marco madera (tono apenas más oscuro) */}
                                    <div className="rounded-[28px] p-2 bg-[linear-gradient(135deg,#956b46,#bf9a73)] shadow-[0_14px_40px_rgba(0,0,0,.10)] ring-1 ring-amber-900/25">
                                        {/* washi */}
                                        <div
                                            className="absolute -top-2 left-10 h-6 w-14 rotate-[5deg] bg-emerald-200/70 ring-1 ring-emerald-300/60"
                                            style={{ borderRadius: "4px" }}
                                        />
                                        <div
                                            className="absolute -top-1 right-8 h-6 w-16 rotate-[-7deg] bg-amber-200/70 ring-1 ring-amber-300/60"
                                            style={{ borderRadius: "4px" }}
                                        />

                                        {/* lienzo */}
                                        <div className="rounded-[22px] overflow-hidden bg-[#FCFAF5] ring-1 ring-black/10">
                                            {/* textura */}
                                            <div
                                                className="absolute inset-0 opacity-[0.22] pointer-events-none"
                                                style={{
                                                    backgroundImage:
                                                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><defs><filter id='t2'><feTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='1' stitchTiles='stitch'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.05'/></feComponentTransfer></filter></defs><rect width='100%' height='100%' filter='url(%23t2)'/></svg>\")",
                                                    backgroundSize: "260px 260px",
                                                }}
                                            />

                                            <div className="relative p-6 flex gap-5">
                                                {/* imagen con veladura verdosa */}
                                                <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-[18px] overflow-hidden ring-1 ring-black/10 flex-shrink-0">
                                                    <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.05]" />
                                                    <div
                                                        className="absolute inset-0 pointer-events-none mix-blend-multiply"
                                                        style={{
                                                            background:
                                                                "radial-gradient(70px 42px at 20% 30%, rgba(16,185,129,.20), transparent 60%), radial-gradient(72px 40px at 80% 70%, rgba(15,118,110,.18), transparent 60%)",
                                                        }}
                                                    />
                                                </div>

                                                {/* texto */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[1.12rem] font-extrabold text-neutral-900 leading-snug">
                                                        {e.title}
                                                    </h4>
                                                    <p className="mt-1 text-[0.95rem] text-neutral-700/90 line-clamp-2">
                                                        {e.description}
                                                    </p>

                                                    <div className="mt-3 flex items-center justify-between text-[12.5px] text-neutral-600">
                                                        <span className="inline-flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(e.date).toLocaleDateString("es-ES")} • {e.time}
                                                        </span>
                                                        <span className="inline-flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            {e.enrolled}/{e.capacity}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 inline-flex rotate-1 items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300/60 shadow-sm">
                                                        ${e.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    </div>

                    {/* CTA inferior */}
                    <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/activities"
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-6 py-3 text-sm font-semibold shadow
                   hover:bg-emerald-700 transition ring-1 ring-emerald-400/40"
                        >
                            Ver todas las actividades
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white text-emerald-800
                   px-6 py-3 text-sm font-semibold hover:bg-emerald-50 transition"
                        >
                            Ver todos los eventos
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </motion.section>


            {/* Gift Cards Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="py-20 bg-gradient-to-br from-emerald-50 to-neutral-50 font-sans"
            >
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="boa-heading text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
                            Gift Cards
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                            Gift cards que abren las puertas a momentos únicos de bienestar y conexión
                        </p>

                        {/* Nota operativa (compra online off por ahora) */}
                        <p className="mt-3 text-sm text-neutral-500">
                            <span className="font-semibold">Nota:</span> la compra online podrá habilitarse más adelante.
                            Por el momento, las gift cards se <span className="font-medium">gestionan internamente</span> por el equipo de BOA.
                        </p>
                    </div>

                    {/* Toggle simple para compra online */}
                    {(() => {
                        const ALLOW_GC_PURCHASE = false;

                        // Variants locales (stagger + fade/raise)
                        const gridV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.08 } } };
                        const cardV = { hidden: { opacity: 0, y: 14, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } } };

                        return (
                            <motion.div
                                variants={gridV}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                            >
                                {featuredGiftCards.map((giftCard) => (
                                    <motion.div
                                        key={giftCard.id}
                                        variants={cardV}
                                        whileHover={{ y: -6, rotateX: -1.2, rotateY: 1.2, scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                                        style={{ transformStyle: "preserve-3d" }}
                                        onMouseMove={(e) => {
                                            const el = e.currentTarget as HTMLDivElement;
                                            const r = el.getBoundingClientRect();
                                            el.style.setProperty("--x", `${e.clientX - r.left}px`);
                                            el.style.setProperty("--y", `${e.clientY - r.top}px`);
                                        }}
                                        className="
      group relative overflow-hidden rounded-3xl p-[1px]
      bg-gradient-to-br from-slate-300/50 via-slate-200/30 to-slate-300/50
      transition-all duration-500 ring-0 hover:ring-1 hover:ring-emerald-300/40
    "
                                    >
                                        {/* (REMOVIDO) Glow radial que teñía el fondo al hover */}
                                        {/* <div
      className="absolute -inset-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
      style={{
        background:
          'radial-gradient(36rem 36rem at var(--x,50%) var(--y,50%), rgba(16,185,129,.18), transparent 75%)',
      }}
    /> */}

                                        {/* Sheen diagonal: ahora se recorta dentro de la tarjeta gracias a overflow-hidden */}
                                        <div
                                            className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12
                 bg-gradient-to-r from-transparent via-white/30 to-transparent
                 opacity-0 group-hover:opacity-35 mix-blend-soft-light
                 group-hover:translate-x-[220%] transition-all duration-700 rounded-[2rem]"
                                        />

                                        {/* Card interior */}
                                        <Card className="relative border border-white/50 rounded-3xl overflow-hidden bg-white/95">
                                            <CardContent className="relative p-8">
                                                <div className="text-center space-y-6">
                                                    <div
                                                        className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center
                       bg-gradient-to-br from-neutral-100 to-neutral-200 ring-1 ring-white/60"
                                                    >
                                                        <Gift className="h-8 w-8 text-emerald-600 transition-transform duration-500 group-hover:scale-110" />
                                                    </div>

                                                    <div>
                                                        <h3 className="boa-heading text-2xl font-bold text-neutral-900 mb-2">
                                                            {giftCard.name}
                                                        </h3>
                                                        <p className="text-neutral-600 mb-5">{giftCard.description}</p>

                                                        <div className="text-3xl font-extrabold text-neutral-900 mb-5">
                                                            ${giftCard.value.toLocaleString()}
                                                        </div>

                                                        <ul className="text-left inline-block mx-auto space-y-2 text-sm text-neutral-700">
                                                            {giftCard.benefits.slice(0, 4).map((benefit: string, idx: number) => (
                                                                <li key={idx} className="flex items-center gap-2">
                                                                    <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    <span>{benefit}</span>
                                                                </li>
                                                            ))}
                                                            {giftCard.benefits.length > 4 && (
                                                                <li className="text-neutral-500">+ {giftCard.benefits.length - 4} beneficios más</li>
                                                            )}
                                                        </ul>

                                                        <div className="mt-7">
                                                            <Button
                                                                size="lg"
                                                                className={`px-6 py-3 rounded-2xl transition-all duration-300
                  ${ALLOW_GC_PURCHASE
                                                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                        : "bg-neutral-200 text-neutral-600 cursor-not-allowed"}`}
                                                                disabled={!ALLOW_GC_PURCHASE}
                                                            >
                                                                {ALLOW_GC_PURCHASE ? "Comprar Gift Card" : "Compra online próximamente"}
                                                            </Button>

                                                            {!ALLOW_GC_PURCHASE && (
                                                                <p className="mt-2 text-xs text-neutral-500">
                                                                    Consultá en el local o por WhatsApp para obtener una gift card.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}

                            </motion.div>
                        );
                    })()}

                    <div className="text-center mt-12">
                        <Link href="/giftcards">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 px-8 py-3 rounded-2xl transition-all duration-300"
                            >
                                <Gift className="mr-2 h-5 w-5" />
                                Ver todas las Gift Cards
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/* About BOA Preview */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            <h2 className="boa-heading text-4xl sm:text-5xl font-semibold text-neutral-900 mb-6">
                                Más que un Café
                            </h2>
                            <p className="text-xl text-neutral-600 leading-relaxed mb-8">
                                BOA es un espacio donde convergen la tradición cafetera, el arte, el bienestar y la comunidad.
                                Desde nuestras raíces históricas, hemos evolucionado para crear un lugar único donde cada visita
                                es una experiencia transformadora.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-600 mb-2">100+</div>
                                    <div className="text-sm text-neutral-600">Años de Historia</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-600 mb-2">15+</div>
                                    <div className="text-sm text-neutral-600">Actividades Semanales</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
                                    <div className="text-sm text-neutral-600">Miembros de la Comunidad</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-600 mb-2">3</div>
                                    <div className="text-sm text-neutral-600">Espacios Únicos</div>
                                </div>
                            </div>
                        </div>
                        <Link href="/about">
                            <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-3 rounded-2xl">
                                <Users className="mr-2 h-5 w-5" />
                                Conoce Nuestra Historia
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}