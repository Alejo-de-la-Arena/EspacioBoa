
import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VerticalFlyerSlider from "@/components/events/VerticalFlyerSlider";
import EventsHero from "@/components/EventsHero";
import Link from "next/link";
import {
    Calendar,
    Search,
    Filter,
    Clock,
    Users,
    MapPin,
    Sparkles,
    Star
} from "lucide-react";

export default function EventsPage() {
    // estados base
    const { events, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");

    // NUEVO: quick-filters cálidos
    const [onlyToday, setOnlyToday] = useState(false);
    const [onlyWeekend, setOnlyWeekend] = useState(false);
    const [onlySpots, setOnlySpots] = useState(false);

    // Filtrado principal (búsqueda + categoría + mes)
    const filteredEvents = useMemo(() => {
        return events
            .filter((event: any) => {
                const title = (event.title ?? "").toLowerCase();
                const desc = (event.description ?? "").toLowerCase();
                const matchesSearch =
                    title.includes(searchTerm.toLowerCase()) ||
                    desc.includes(searchTerm.toLowerCase());

                const matchesCategory =
                    selectedCategory === "all" ||
                    (event.category ?? "") === selectedCategory;

                const d = new Date(event.date);
                const eventMonth = d.getMonth(); // 0..11
                const matchesMonth =
                    selectedMonth === "all" || parseInt(selectedMonth, 10) === eventMonth;

                return matchesSearch && matchesCategory && matchesMonth;
            })
            .sort(
                (a: any, b: any) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );
    }, [events, searchTerm, selectedCategory, selectedMonth]);

    // NUEVO: aplicar quick-filters encima del filtrado principal
    const enhancedFilteredEvents = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();
        const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;

        const isWeekend = (d: Date) => {
            const day = d.getDay(); // 0 Dom, 6 Sáb
            return day === 6 || day === 0;
        };

        return filteredEvents.filter((ev: any) => {
            const d = new Date(ev.date);
            const t = d.getTime();

            if (onlyToday && !(t >= startOfToday && t <= endOfToday)) return false;
            if (onlyWeekend && !isWeekend(d)) return false;

            if (onlySpots) {
                const remaining = (ev.capacity ?? 0) - (ev.enrolled ?? 0);
                if (!(remaining > 0)) return false;
            }

            return true;
        });
    }, [filteredEvents, onlyToday, onlyWeekend, onlySpots]);

    // Agrupa por mes (YYYY-MM) usando la lista mejorada
    const groupedByMonth = useMemo(() => {
        const fmt = new Intl.DateTimeFormat("es-ES", {
            month: "long",
            year: "numeric",
        });
        const groups: Record<
            string,
            { label: string; items: typeof enhancedFilteredEvents }
        > = {};

        const items = [...enhancedFilteredEvents].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        for (const ev of items) {
            const d = new Date(ev.date);
            const key = `${d.getFullYear()}-${(d.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`;
            if (!groups[key]) groups[key] = { label: fmt.format(d), items: [] as any };
            groups[key].items.push(ev);
        }
        return groups;
    }, [enhancedFilteredEvents]);

    // categorías y meses
    const categories = useMemo(
        () => Array.from(new Set(events.map((e: any) => e.category).filter(Boolean))),
        [events]
    );

    const months = [
        { value: "0", label: "Enero" },
        { value: "1", label: "Febrero" },
        { value: "2", label: "Marzo" },
        { value: "3", label: "Abril" },
        { value: "4", label: "Mayo" },
        { value: "5", label: "Junio" },
        { value: "6", label: "Julio" },
        { value: "7", label: "Agosto" },
        { value: "8", label: "Septiembre" },
        { value: "9", label: "Octubre" },
        { value: "10", label: "Noviembre" },
        { value: "11", label: "Diciembre" },
    ];

    /* ===== Variants de entrada ===== */
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
    };
    const itemUp = {
        hidden: { opacity: 0, y: 14 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 90, damping: 16 },
        },
    };

    // loading
    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Calendar className="h-12 w-12" />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <EventsHero events={events} />

            {/* ===== Filtros + Listado de Eventos ===== */}
            <section className="py-10 bg-white font-sans">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.header
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 16 }}
                        className="font-sans"
                    >
                        <div className="relative overflow-hidden rounded-2xl ring-1 ring-emerald-100/70 bg-white/85 backdrop-blur-sm shadow-[0_10px_30px_rgba(16,185,129,0.07)]">
                            {/* Franja superior verde→crema con menos opacidad */}
                            <div className="absolute inset-x-0 top-0 h-1.5 opacity-60 bg-[linear-gradient(90deg,#34d399_0%,#a7f3d0_35%,#fff7ed_100%)]" />

                            <div className="p-4 sm:p-5">
                                {/* Tabs de categorías con subrayado animado */}
                                <nav className="border-b border-emerald-100/70">
                                    <ul className="flex flex-wrap gap-4 sm:gap-6">
                                        {["all", ...categories].map((cat) => {
                                            const label = cat === "all" ? "Todos los eventos" : cat;
                                            const active = selectedCategory === cat;
                                            return (
                                                <li key={cat}>
                                                    <button
                                                        onClick={() => setSelectedCategory(cat)}
                                                        aria-pressed={active}
                                                        className={`relative pb-2 text-[14px] sm:text-[15px] transition-colors focus:outline-none ${active ? "text-emerald-800 font-semibold" : "text-neutral-700 hover:text-emerald-700"
                                                            }`}
                                                    >
                                                        {label}
                                                        {active && (
                                                            <motion.span
                                                                layoutId="cat-underline"
                                                                className="absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full bg-emerald-600"
                                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                            />
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>

                                {/* Toolbar: buscador + mes + chips */}
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                                    {/* Buscador (fondo blanco) */}
                                    <div className="relative w-full sm:w-[280px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <Input
                                            placeholder="Buscar experiencias…"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-10 pl-9 pr-3 rounded-xl border border-emerald-100 bg-white focus:ring-emerald-300 placeholder:text-neutral-400 font-sans"
                                        />
                                    </div>

                                    {/* Mes (fondo blanco y font-sans también en portal) */}
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="h-10 w-48 rounded-xl border border-emerald-100 bg-white focus:ring-emerald-300 font-sans">
                                            <SelectValue placeholder="Mes" />
                                        </SelectTrigger>
                                        <SelectContent className="font-sans">
                                            <SelectItem className="font-sans" value="all">Todos los meses</SelectItem>
                                            {months.map((m) => (
                                                <SelectItem className="font-sans" key={m.value} value={m.value}>
                                                    {m.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Chips rectangulares */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setOnlyToday((v) => !v)}
                                            className={`h-10 px-3 rounded-md text-[13px] ring-1 transition font-sans ${onlyToday
                                                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                                                : "bg-white text-neutral-700 ring-emerald-100 hover:bg-emerald-50/60"
                                                }`}
                                        >
                                            Hoy
                                        </button>
                                        <button
                                            onClick={() => setOnlyWeekend((v) => !v)}
                                            className={`h-10 px-3 rounded-md text-[13px] ring-1 transition font-sans ${onlyWeekend
                                                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                                                : "bg-white text-neutral-700 ring-emerald-100 hover:bg-emerald-50/60"
                                                }`}
                                        >
                                            Fin de semana
                                        </button>
                                        <button
                                            onClick={() => setOnlySpots((v) => !v)}
                                            className={`h-10 px-3 rounded-md text-[13px] ring-1 transition font-sans ${onlySpots
                                                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                                                : "bg-white text-neutral-700 ring-emerald-100 hover:bg-emerald-50/60"
                                                }`}
                                        >
                                            Con cupos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.header>




                    {/* Contenido del listado */}
                    <div className="pt-8">
                        {enhancedFilteredEvents.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 rounded-3xl bg-emerald-50/40 ring-1 ring-emerald-100"
                            >
                                <Calendar className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-semibold text-neutral-700 mb-2">No se encontraron eventos</h3>
                                <p className="text-neutral-500 mb-6">Probá ajustar tus filtros o limpiar la búsqueda</p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedMonth("all");
                                        setSelectedCategory("all");
                                        setOnlyToday(false);
                                        setOnlyWeekend(false);
                                        setOnlySpots(false);
                                    }}
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    Limpiar filtros
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="space-y-12">
                                {Object.entries(groupedByMonth).map(([key, group]) => (
                                    <section key={key} className="space-y-4">
                                        {/* Encabezado de mes con franja crema (distinto a filtros) */}
                                        <div className="sticky top-[64px] z-[5] -mx-4 sm:mx-0 px-4 sm:px-0">
                                            <div
                                                className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold text-neutral-800 capitalize ring-1 ring-emerald-100 bg-white"
                                                style={{ background: "linear-gradient(90deg,#FFF7ED 0%, rgba(255,247,237,0) 100%)" }}
                                            >
                                                <Calendar className="h-4 w-4 text-emerald-600" />
                                                <span className="font-sans">{group.label}</span>
                                            </div>
                                        </div>

                                        {/* Lista tipo “fila papel” (sin tarjetas redondas) */}
                                        <div className="space-y-3">
                                            {group.items.map((event: any) => {
                                                const d = new Date(event.date);
                                                const isPast = d.getTime() < Date.now();
                                                const isToday = d.toDateString() === new Date().toDateString();
                                                const dd = d.getDate().toString().padStart(2, "0");
                                                const mm = (d.getMonth() + 1).toString().padStart(2, "0");
                                                const weekday = d.toLocaleDateString("es-ES", { weekday: "long" }).toUpperCase();
                                                const cap = event.capacity ?? 0;
                                                const enr = event.enrolled ?? 0;
                                                const hasSpots = cap > 0 ? cap - enr > 0 : true;
                                                const pct = cap > 0 ? Math.min(100, Math.max(0, (enr / cap) * 100)) : 0;

                                                return (
                                                    <motion.article
                                                        key={event.id}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, amount: 0.25 }}
                                                        whileHover={{ y: -2 }}
                                                        transition={{ type: "spring", stiffness: 90, damping: 16 }}
                                                        className="group grid grid-cols-[104px,1fr,auto] sm:grid-cols-[124px,1fr,auto] items-stretch gap-4 sm:gap-6 rounded-xl bg-gradient-to-br from-white to-emerald-50/20 ring-1 ring-emerald-100/70 hover:ring-emerald-200 hover:shadow-[0_12px_28px_rgba(16,185,129,0.10)] transition relative overflow-hidden border-l-4 border-l-emerald-200/70"
                                                    >
                                                        {/* patrón sutil */}
                                                        <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle_at_1px_1px,#10b981_1px,transparent_1px)] [background-size:14px_14px]" />

                                                        {/* Mini poster */}
                                                        <Link href={`/events/${event.id}`} className="block h-full">
                                                            <div className="relative h-[120px] sm:h-[140px] w-[104px] sm:w-[124px] overflow-hidden rounded-l-xl">
                                                                <img
                                                                    src={event.flyerVertical || event.poster || event.image}
                                                                    alt={event.title}
                                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                                    loading="lazy"
                                                                />
                                                                {isToday && !isPast && (
                                                                    <span className="absolute top-2 left-2 rounded-md bg-emerald-600/95 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                                        ¡Hoy!
                                                                    </span>
                                                                )}
                                                                {isPast && (
                                                                    <span className="absolute top-2 left-2 rounded-md bg-neutral-800/90 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                                        Finalizado
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Link>

                                                        {/* Contenido */}
                                                        <div className="py-3 pr-2">
                                                            <Link href={`/events/${event.id}`}>
                                                                <h4 className="text-[20px] sm:text-[22px] font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors font-sans">
                                                                    {event.title}
                                                                </h4>
                                                            </Link>

                                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-neutral-700 font-sans">
                                                                <span className="inline-flex items-center gap-1.5">
                                                                    <Calendar className="h-4 w-4 text-emerald-600" />
                                                                    {`${weekday} ${dd}/${mm}`}
                                                                </span>
                                                                {event.time && (
                                                                    <span className="inline-flex items-center gap-1.5">
                                                                        <Clock className="h-4 w-4 text-emerald-600" />
                                                                        {event.time}
                                                                    </span>
                                                                )}
                                                                <span className="inline-flex items-center gap-1.5 min-w-0">
                                                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                                                    <span className="truncate">
                                                                        {event.location || "BOA – Espacio Principal"}
                                                                    </span>
                                                                </span>
                                                            </div>

                                                            {/* Barra de ocupación (da vida sin “chips redondos”) */}
                                                            {/* Capacidad (medidor circular + texto claro) */}
                                                            {(typeof cap === "number" && cap > 0) ? (
                                                                <div className="mt-3 inline-flex items-center gap-3 rounded-lg bg-emerald-50/40 ring-1 ring-emerald-100 px-2.5 py-1.5 font-sans">
                                                                    {/* Medidor circular conic */}
                                                                    <div
                                                                        className="relative h-8 w-8 rounded-full grid place-items-center"
                                                                        style={{
                                                                            background: `conic-gradient(#10b981 ${pct}%, #e6f5ef ${pct}% 100%)`,
                                                                        }}
                                                                        aria-label={`Capacidad ${enr} de ${cap}`}
                                                                        role="img"
                                                                    >
                                                                        <div className="absolute inset-[3px] rounded-full bg-white" />
                                                                        {/* número de cupos libres al centro */}
                                                                        <span className="relative text-[10px] font-bold text-emerald-700 tabular-nums">
                                                                            {Math.max(0, cap - enr)}
                                                                        </span>
                                                                    </div>

                                                                    {/* Texto descriptivo */}
                                                                    <div className="leading-tight">
                                                                        <div className="text-[12px] font-semibold text-neutral-900">Capacidad</div>
                                                                        <div className="text-[12px] text-neutral-700 tabular-nums">
                                                                            {enr}/{cap} <span className="text-neutral-500">•</span> Quedan {Math.max(0, cap - enr)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                // fallback si no hay capacidad cargada
                                                                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-neutral-50 ring-1 ring-neutral-200 px-2.5 py-1">
                                                                    <Users className="h-4 w-4 text-neutral-500" />
                                                                    <span className="text-[12px] text-neutral-700 font-sans">Capacidad no definida</span>
                                                                </div>
                                                            )}

                                                            {event.description && (
                                                                <p className="mt-2 text-[13px] text-neutral-600 line-clamp-2 font-sans">
                                                                    {event.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* CTA + precio */}
                                                        <div className="px-3 sm:px-4 py-3 flex flex-col items-end gap-2 sm:gap-3">
                                                            <div className="text-[15px] font-bold text-emerald-700 font-sans">
                                                                ${event.price}
                                                            </div>
                                                            <Link href={`/events/${event.id}`}>
                                                                <Button
                                                                    size="sm"
                                                                    className={`rounded-full font-sans ${isPast || !hasSpots
                                                                        ? "bg-neutral-400 hover:bg-neutral-400 cursor-not-allowed"
                                                                        : "bg-emerald-600 hover:bg-emerald-700"
                                                                        }`}
                                                                    disabled={isPast || !hasSpots}
                                                                >
                                                                    {isPast ? "Finalizado" : !hasSpots ? "Completo" : "Ver detalles"}
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </motion.article>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </section>



            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-4">
                            ¿Tienes una idea para un evento?
                        </h2>
                        <p className="text-lg text-neutral-600 mb-8">
                            En BOA nos encanta colaborar con talentosos facilitadores y artistas.
                            Si tienes una propuesta para un taller, charla o evento especial, cuéntanos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl">
                                    Proponer un evento
                                </Button>
                            </Link>
                            <Link href="/activities">
                                <Button size="lg" variant="outline" className="bg-transparent hover:bg-neutral-50 px-8 py-3 rounded-2xl border-neutral-300 hover:border-emerald-300 hover:text-emerald-600">
                                    Ver actividades regulares
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
