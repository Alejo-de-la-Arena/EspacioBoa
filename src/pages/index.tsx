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
    Sparkles
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
            <motion.section
                initial="hidden"
                animate="visible"
                variants={container}
                className="relative h-screen flex items-center justify-center overflow-hidden text-white"
            >
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.9]"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2070&auto=format&fit=crop')"
                    }}
                />
                {/* Overlay de contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/10" />

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">

                        {/* Main Logo + Título */}
                        <motion.div
                            variants={item}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2"
                        >
                            {/* Wrapper con radial highlight */}
                            <div className="relative">
                                {/* Radial highlight detrás del logo */}
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute -inset-8 rounded-full blur-2xl
                       bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.35),transparent_60%)]"
                                />
                                {/* Logo circular */}

                            </div>

                            {/* Título — en mobile queda debajo del logo por el flex-col */}
                            <h1 className="boa-logo font-sans text-5xl sm:text-8xl font-semibold tracking-tight">
                                Espacio BOA
                            </h1>
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            variants={item}
                            className="font-sans text-lg sm:text-2xl text-neutral-100 font-light max-w-3xl mx-auto leading-relaxed"
                        >
                            Un espacio integral donde el café de especialidad se encuentra con el
                            bienestar, la creatividad y la comunidad
                        </motion.p>

                        {/* Badge de historia */}


                        {/* CTAs */}
                        <motion.div
                            variants={item}
                            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                        >
                            <Link href="/activities">
                                <Button
                                    size="lg"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl
                       shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30
                       transition-all duration-300 font-sans"
                                >
                                    <Heart className="mr-2 h-5 w-5" />
                                    Explorar Actividades
                                </Button>
                            </Link>

                            <Link href="/menu">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="bg-white/10 hover:bg-white/20 text-white border-white/50 hover:border-white
                       px-8 py-3 rounded-2xl transition-all duration-300 font-sans"
                                >
                                    <Coffee className="mr-2 h-5 w-5" />
                                    Ver Gastronomía
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Main Navigation Cards */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardsContainer}
                className="py-20 bg-white font-sans"
            >
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-sans boa-heading text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
                            Nuestros <strong className="text-emerald-600 font-extrabold">Departamentos</strong>
                        </h2>
                        <p className="font-sans text-xl text-neutral-600 max-w-2xl mx-auto font-normal">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae pariatur quas, perferendis laborum sint
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Activities */}
                        <motion.div variants={cardItem} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                            <Link
                                href="/activities"
                                className="group relative block h-96 rounded-2xl overflow-hidden
                     border border-black/5 shadow-[0_10px_25px_rgba(2,6,23,.05)]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                aria-label="Explorar Actividades"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&auto=format&fit=crop&q=80"
                                    alt="Actividades en BOA"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 33vw, 100vw"
                                    priority
                                />
                                <div className="absolute inset-0 transition-all duration-500
                        bg-gradient-to-t from-neutral-900/80 via-neutral-900/40 to-neutral-900/10
                        group-hover:from-neutral-900/90 group-hover:via-neutral-900/50 group-hover:to-neutral-900/20" />
                                <Card className="relative h-full bg-transparent border-0 text-white">
                                    <CardContent className="p-8 h-full flex flex-col justify-end items-center">
                                        <div className="text-center space-y-4 font-sans">
                                            {/* <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-colors group-hover:bg-white/30">
                                                <Heart className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />
                                            </div> */}
                                            <div className="text-center">
                                                <h3 className="font-sans boa-heading text-2xl font-semibold text-white mb-2">BOA <strong className="font-semibold">Actividades</strong></h3>
                                                <p className="font-sans text-white/90 leading-relaxed font-normal">Yoga, arte, bienestar y talleres creativos</p>
                                            </div>
                                            <div className="flex items-center justify-center text-white/90 group-hover:text-white transition-colors pt-2">
                                                <span className="font-sans font-medium">Explorar</span>
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Gastronomy */}
                        <motion.div variants={cardItem} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                            <Link
                                href="/menu"
                                className="group relative block h-96 rounded-2xl overflow-hidden
                     border border-black/5 shadow-[0_10px_25px_rgba(2,6,23,.05)]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                aria-label="Ver Gastronomía"
                            >
                                <Image
                                    src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755904741/boa-bowl_v6wn6a.jpg"
                                    alt="Gastronomía de BOA"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 33vw, 100vw"
                                />
                                <div className="absolute inset-0 transition-all duration-500
                          bg-gradient-to-t from-neutral-900/80 via-neutral-900/40 to-neutral-900/10
                          group-hover:from-neutral-900/90 group-hover:via-neutral-900/50 group-hover:to-neutral-900/20" />
                                <Card className="relative h-full bg-transparent border-0 text-white">
                                    <CardContent className="p-8 h-full flex flex-col justify-end items-center">
                                        <div className="text-center space-y-4 font-sans">
                                            {/* <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-colors group-hover:bg-white/30">
                                                <Coffee className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />
                                            </div> */}
                                            <div className="text-center">
                                                <h3 className="font-sans boa-heading text-2xl font-semibold text-white mb-2">BOA <strong className="font-semibold">Gastronomía</strong></h3>
                                                <p className="font-sans text-white/90 leading-relaxed font-normal">Café de especialidad y opciones saludables</p>
                                            </div>
                                            <div className="flex items-center justify-center text-white/90 group-hover:text-white transition-colors pt-2">
                                                <span className="font-sans font-medium">Ver menú</span>
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Spaces */}
                        <motion.div variants={cardItem} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
                            <Link
                                href="/spaces"
                                className="group relative block h-96 rounded-2xl overflow-hidden
                     border border-black/5 shadow-[0_10px_25px_rgba(2,6,23,.05)]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                aria-label="Conocer Espacios"
                            >
                                <Image
                                    src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755911507/boa-entrada_ezfcms.jpg"
                                    alt="Espacios de BOA"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 33vw, 100vw"
                                />
                                <div className="absolute inset-0 transition-all duration-500
                          bg-gradient-to-t from-neutral-900/80 via-neutral-900/40 to-neutral-900/10
                          group-hover:from-neutral-900/90 group-hover:via-neutral-900/50 group-hover:to-neutral-900/20" />
                                <Card className="relative h-full bg-transparent border-0 text-white">
                                    <CardContent className="p-8 h-full flex flex-col justify-end items-center">
                                        <div className="text-center space-y-4 font-sans">
                                            {/* <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-colors group-hover:bg-white/30">
                                                <MapPin className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />
                                            </div> */}
                                            <div className="text-center">
                                                <h3 className="font-sans boa-heading text-2xl font-semibold text-white mb-2">BOA <strong className="font-semibold">Espacios</strong></h3>
                                                <p className="font-sans text-white/90 leading-relaxed font-normal">Ambientes únicos para inspirar y conectar</p>
                                            </div>
                                            <div className="flex items-center justify-center text-white/90 group-hover:text-white transition-colors pt-2">
                                                <span className="font-sans font-medium">Conocer</span>
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </motion.section>

            {/* Featured Activities & Events */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="py-20 bg-neutral-50 font-sans"
            >
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-sans boa-heading text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
                            Próximas <strong className="text-emerald-600 font-extrabold">Experiencias</strong>
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-normal">
                            Actividades regulares y eventos especiales para nutrir tu alma y expandir tu creatividad
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Featured Activities */}
                        <motion.div variants={list} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-sans boa-heading text-2xl font-semibold text-neutral-900">Actividades Destacadas</h3>
                                <Link href="/activities" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center">
                                    Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {featuredActivities.map((activity) => (
                                    <motion.div key={activity.id} variants={item} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
                                        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200/60 hover:border-emerald-200">
                                            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-emerald-50/0 group-hover:bg-emerald-50/55 transition-colors duration-300" />
                                            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-0 ring-emerald-300/40 group-hover:ring-1 transition-all duration-300" />

                                            <CardContent className="relative p-6">
                                                <div className="flex gap-5">
                                                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={activity.image}
                                                            alt={activity.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                                                                {activity.title}
                                                            </h4>
                                                            <Badge variant="secondary" className="text-xs font-semibold">
                                                                ${activity.price}
                                                            </Badge>
                                                        </div>

                                                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2 font-normal">{activity.description}</p>

                                                        <div className="flex items-center justify-between text-xs text-neutral-500">
                                                            <div className="flex items-center">
                                                                <Clock className="h-3.5 w-3.5 mr-1" />
                                                                {activity.schedule.day} {activity.schedule.time}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Users className="h-3.5 w-3.5 mr-1" />
                                                                {activity.enrolled}/{activity.capacity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Featured Events */}
                        <motion.div variants={list} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-sans boa-heading text-2xl font-semibold text-neutral-900">Eventos Especiales</h3>
                                <Link href="/events" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center">
                                    Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {featuredEvents.map((event) => (
                                    <motion.div key={event.id} variants={item} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
                                        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200/60 hover:border-emerald-200">
                                            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-emerald-50/0 group-hover:bg-emerald-50/55 transition-colors duration-300" />
                                            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-0 ring-emerald-300/40 group-hover:ring-1 transition-all duration-300" />

                                            <CardContent className="relative p-6">
                                                <div className="flex gap-5">
                                                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                                                                {event.title}
                                                            </h4>
                                                            <Badge className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-semibold">
                                                                ${event.price}
                                                            </Badge>
                                                        </div>

                                                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2 font-normal">{event.description}</p>

                                                        <div className="flex items-center justify-between text-xs text-neutral-500">
                                                            <div className="flex items-center">
                                                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                                                {new Date(event.date).toLocaleDateString('es-ES')} - {event.time}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Users className="h-3.5 w-3.5 mr-1" />
                                                                {event.enrolled}/{event.capacity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
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