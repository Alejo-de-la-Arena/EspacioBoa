
import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import {
    Heart,
    Search,
    Filter,
    Calendar,
    Clock,
    Users,
    MapPin,
    Sparkles
} from "lucide-react";

export default function ActivitiesPage() {
    const { activities, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDay, setSelectedDay] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showFilters, setShowFilters] = useState(false);


    const filteredActivities = useMemo(() => {
        return activities.filter(activity => {
            const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDay = selectedDay === "all" || activity.schedule.day === selectedDay;
            const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory;

            return matchesSearch && matchesDay && matchesCategory;
        });
    }, [activities, searchTerm, selectedDay, selectedCategory]);

    // Siguiente actividad (fallback simple y seguro)
    const nextActivity = useMemo(() => {
        return (filteredActivities[0] || activities[0] || null);
    }, [filteredActivities, activities]);


    const categories = Array.from(new Set(activities.map(activity => activity.category)));
    const days = Array.from(new Set(activities.map(activity => activity.schedule.day)));

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
            {/* Hero — imagen BOA + detalles cálidos en el contenido */}
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
                            className="pointer-events-none absolute -inset-x-8 -top-10 -bottom-10 mx-auto z-0"  // ⬅️ z-0 (antes z-[1])
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

                            {/* Bajada (blanco, sin fondo) — FIX visible */}
                            <motion.p
                                // quitamos clipPath (causa del corte) y usamos blur-in suave
                                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true, amount: 0.2 }} // dispara más fácil
                                transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
                                className="mt-2 text-base sm:text-lg text-white/95 leading-relaxed relative z-20"
                                style={{
                                    // micro-contraste cálido (no gris) para máxima lectura sobre el glass
                                    WebkitTextStroke: "0.2px rgba(20,64,59,.25)",
                                    textShadow: "0 1px 10px rgba(20,64,59,.22)",
                                    mixBlendMode: "normal",
                                    willChange: "opacity, transform, filter",
                                }}
                            >
                                Movimiento, arte y bienestar en un mismo lugar. Descubrí tu próxima clase y reservá en segundos.
                            </motion.p>


                            {/* Separador + corazón (verde suave) */}
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

                            {/* Chips decorativos con acento verde */}
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

                            {/* Indicador scroll (verde) */}
                            <motion.a
                                href="#filtros"
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.7 }}
                                transition={{ delay: 0.05 }}
                                className="group mt-10 inline-flex items-center gap-2 text-boa-green/90 hover:text-boa-green transition-colors"
                            >
                                <button className="d-flex inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 rounded-md rounded-xl2 bg-boa-green text-white hover:bg-boa-green/90 shadow-[0_10px_28px_rgba(30,122,102,.35)] px-8"> Explorar Actividades
                                    <span className="inline-block h-2.5 w-2.5 border-b-2 border-r-2 border-current rotate-45 translate-y-0 group-hover:translate-y-[2px] transition-transform" />
                                </button>

                            </motion.a>
                        </div>
                        {/* === FIN CONTENIDO === */}
                    </div>
                </div>
            </section>

            {/* Filters Section — “papel crema” con toques artísticos */}
            <section
                id="filtros"
                className="relative py-14 overflow-hidden"
            >
                {/* Fondo acuarela sutil + grano (coherente con hero/home) */}
                <div className="absolute inset-0 -z-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: "#FFFCF7",
                            backgroundImage: `
          radial-gradient(80% 60% at 10% 10%, rgba(206,234,218,.28), transparent 55%),
          radial-gradient(70% 55% at 90% 15%, rgba(255,214,182,.24), transparent 60%),
          radial-gradient(65% 55% at 50% 100%, rgba(186,220,205,.22), transparent 60%)
        `,
                        }}
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                    />
                </div>

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-boa-green/10 ring-1 ring-boa-green/20 text-boa-ink/80">
                            <Sparkles className="h-4 w-4 text-boa-green" />
                            <span className="text-[12px] font-semibold tracking-wide">Encontrá tu actividad</span>
                        </div>

                        <h2 className="mt-3 text-3xl font-extrabold text-boa-ink tracking-tight">
                            Afiná tu búsqueda
                        </h2>

                        {/* subrayado pincel */}
                        <svg className="mt-2 mx-auto w-40 h-4" viewBox="0 0 180 18" fill="none" aria-hidden="true">
                            <path d="M6 10C40 15 100 15 174 8" stroke="hsl(var(--boa-green))" strokeWidth="6" strokeLinecap="round" opacity=".45" />
                        </svg>

                        <p className="mt-2 text-boa-ink/70">
                            Mostrando <span className="font-semibold text-boa-green">{filteredActivities.length}</span> de{" "}
                            <span className="font-semibold">{activities.length}</span> actividades.
                        </p>
                    </div>

                    {/* Tarjeta “paper” con filtros */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="rounded-3xl bg-[#FFFCF7]/95 backdrop-blur ring-1 ring-[#EEDCC9] shadow-[0_18px_50px_rgba(82,47,0,.08)] p-5 md:p-6"
                    >
                        {/* fila principal: buscador + selects */}
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                            {/* Search */}
                            <div className="relative w-full lg:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-boa-ink/40" />
                                <Input
                                    placeholder="Buscar por nombre o descripción…"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full rounded-2xl bg-white/90 ring-1 ring-boa-green/20 focus-visible:ring-boa-green/40 border-0"
                                    aria-label="Buscar actividades"
                                />
                            </div>

                            {/* Selects */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                {/* Día */}
                                <Select value={selectedDay} onValueChange={setSelectedDay}>
                                    <SelectTrigger className="w-full sm:w-44 rounded-2xl bg-white/90 ring-1 ring-boa-green/20 focus:ring-boa-green/40 border-0">
                                        <SelectValue placeholder="Día" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los días</SelectItem>
                                        {days.map((day) => (
                                            <SelectItem key={day} value={day}>{day}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Categoría */}
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full sm:w-44 rounded-2xl bg:white/90 ring-1 ring-boa-green/20 focus:ring-boa-green/40 border-0 bg-white/90">
                                        <SelectValue placeholder="Categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* chips de categorías (atajo visual) */}
                        {categories.length > 0 && (
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`px-3 py-1 rounded-xl text-[12px] font-semibold transition-all ring-1 ${selectedCategory === "all"
                                        ? "bg-boa-green text-white ring-boa-green"
                                        : "bg-white text-boa-ink/85 ring-boa-green/30"
                                        }`}
                                    aria-pressed={selectedCategory === "all"}
                                >
                                    Todas
                                </button>
                                {categories.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCategory(selectedCategory === c ? "all" : c)}
                                        className={`px-3 py-1 rounded-xl text-[12px] font-semibold transition-all ring-1 capitalize ${selectedCategory === c
                                            ? "bg-boa-green text-white ring-boa-green"
                                            : "bg-white text-boa-ink/85 ring-boa-green/30"
                                            }`}
                                        aria-pressed={selectedCategory === c}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* acciones auxiliares */}
                        <div className="mt-5 flex items-center justify-between">
                            <span className="text-sm text-boa-ink/70">Consejo: probá “yoga”, “arte”, “meditación”…</span>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedDay("all");
                                    setSelectedCategory("all");
                                }}
                                className="rounded-xl ring-1 ring-boa-green/30 hover:bg-boa-green/10"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>



            {/* Activities Grid — tarjetas “paper” con acentos BOA */}
            <section className="relative py-16 overflow-hidden">
                {/* Fondo acuarela + grano (suave, diferente al de filtros para jerarquía) */}
                <div className="absolute inset-0 -z-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: "#FFFBF4",
                            backgroundImage: `
          radial-gradient(70% 60% at 15% 85%, rgba(255,214,182,.22), transparent 60%),
          radial-gradient(60% 50% at 85% 10%, rgba(206,234,218,.26), transparent 60%)
        `,
                        }}
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                    />
                </div>

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredActivities.length === 0 ? (
                        <div className="text-center py-20">
                            <Heart className="h-16 w-16 text-boa-green/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-boa-ink/80 mb-2">
                                No se encontraron actividades
                            </h3>
                            <p className="text-boa-ink/60 mb-6">
                                Probá con otros términos o ajustá los filtros.
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedDay("all");
                                    setSelectedCategory("all");
                                }}
                                variant="outline"
                                className="rounded-xl ring-1 ring-boa-green/30 hover:bg-boa-green/10"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredActivities.map((activity, idx) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.03 }}
                                >
                                    <Card className="group border-0 rounded-3xl bg-[#FFFCF7] ring-1 ring-[#EEDCC9] shadow-[0_18px_50px_rgba(82,47,0,.08)] hover:shadow-[0_22px_60px_rgba(30,122,102,.18)] transition-all duration-300 hover:-translate-y-1">
                                        {/* Imagen con degradé y textura */}
                                        <div className="relative overflow-hidden rounded-t-3xl">
                                            <img
                                                src={activity.image}
                                                alt={activity.title}
                                                className="w-full h-48 object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                                style={{
                                                    WebkitMaskImage:
                                                        "linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)",
                                                    maskImage:
                                                        "linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)",
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-boa-ink/25 to-transparent" />
                                            <div
                                                aria-hidden
                                                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                                                style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                                            />
                                            <Badge className="absolute top-4 left-4 bg-boa-green/15 text-boa-green ring-1 ring-boa-green/30 hover:bg-boa-green/20">
                                                {activity.category}
                                            </Badge>
                                            {activity.featured && (
                                                <Badge className="absolute top-4 right-4 bg-boa-green text-white">
                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                    Destacada
                                                </Badge>
                                            )}
                                        </div>

                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-xl font-bold text-boa-ink group-hover:text-boa-green transition-colors">
                                                    {activity.title}
                                                </h3>
                                                <span className="text-lg font-bold text-boa-green">
                                                    ${activity.price}
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <p className="text-boa-ink/75 text-sm leading-relaxed line-clamp-2">
                                                {activity.description}
                                            </p>

                                            {/* separador pincel */}
                                            <svg className="w-28 h-3" viewBox="0 0 120 12" fill="none" aria-hidden="true">
                                                <path d="M2 8C28 11 58 11 118 6" stroke="hsl(var(--boa-green))" strokeWidth="5" strokeLinecap="round" opacity=".35" />
                                            </svg>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-boa-ink/70">
                                                    <Calendar className="h-4 w-4 mr-2 text-boa-green" />
                                                    {activity.schedule.day}
                                                </div>
                                                <div className="flex items-center text-sm text-boa-ink/70">
                                                    <Clock className="h-4 w-4 mr-2 text-boa-green" />
                                                    {activity.schedule.time}
                                                </div>
                                                <div className="flex items-center text-sm text-boa-ink/70">
                                                    <MapPin className="h-4 w-4 mr-2 text-boa-green" />
                                                    {activity.location}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center text-sm">
                                                    <Users className="h-4 w-4 mr-1 text-boa-ink/40" />
                                                    <span className={activity.enrolled >= activity.capacity ? "text-red-500 font-medium" : "text-boa-ink/70"}>
                                                        {activity.enrolled}/{activity.capacity}
                                                    </span>
                                                </div>

                                                <Link href={`/activities/${activity.id}`}>
                                                    <Button
                                                        size="sm"
                                                        className={activity.enrolled >= activity.capacity
                                                            ? "bg-boa-ink/30 hover:bg-boa-ink/30 cursor-not-allowed"
                                                            : "bg-boa-green hover:bg-boa-green/90"}
                                                        disabled={activity.enrolled >= activity.capacity}
                                                    >
                                                        {activity.enrolled >= activity.capacity ? "Completo" : "Ver detalles"}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-4">
                            ¿No encontraste lo que buscabas?
                        </h2>
                        <p className="text-lg text-neutral-600 mb-8">
                            Contáctanos y cuéntanos qué tipo de actividad te gustaría ver en BOA.
                            Siempre estamos abiertos a nuevas ideas y propuestas.
                        </p>
                        <Link href="/contact">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl">
                                Proponer una actividad
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
