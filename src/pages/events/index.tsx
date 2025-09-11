
import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VerticalFlyerSlider from "@/components/events/VerticalFlyerSlider";
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
    const { events, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;

            const eventDate = new Date(event.date);
            const eventMonth = eventDate.getMonth();
            const matchesMonth = selectedMonth === "all" || parseInt(selectedMonth) === eventMonth;

            return matchesSearch && matchesCategory && matchesMonth;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [events, searchTerm, selectedCategory, selectedMonth]);

    // Agrupa por mes (YYYY-MM) manteniendo orden por fecha asc
    const groupedByMonth = useMemo(() => {
        const fmt = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
        const groups: Record<string, { label: string; items: typeof filteredEvents }> = {};
        const items = [...filteredEvents].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        for (const ev of items) {
            const d = new Date(ev.date);
            const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
            if (!groups[key]) groups[key] = { label: fmt.format(d), items: [] as any };
            groups[key].items.push(ev);
        }
        return groups;
    }, [filteredEvents]);


    const categories = Array.from(new Set(events.map(event => event.category)));
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
        { value: "11", label: "Diciembre" }
    ];

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
            <section id="events-hero" className="relative overflow-hidden font-sans">
                {/* Fondo sutil (sin puntos) */}
                <div aria-hidden className="absolute inset-0">
                    {/* Base crema → blanco */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(180deg, #FBFAF7 0%, #FFFFFF 55%, #F3F7F4 100%)",
                        }}
                    />
                    {/* Halos muy tenues para dar profundidad */}
                    <div className="pointer-events-none absolute -top-24 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-100/35 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-28 -right-36 h-[30rem] w-[30rem] rounded-full bg-amber-100/35 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_65%_30%,rgba(16,185,129,0.06),transparent)]" />
                </div>

                <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* ↓↓↓ Ajuste clave: alto mínimo = viewport - header, y menos padding */}
                    <div className="grid items-center gap-10 md:gap-12 md:grid-cols-2 min-h-[calc(100svh-64px)] py-10 sm:py-12">
                        {/* Columna izquierda */}
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
                                <Calendar className="h-4 w-4 text-emerald-600" />
                                Eventos puntuales: talleres, ferias y charlas
                            </span>

                            <h1 className="boa-heading mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-neutral-900">
                                Encuentros que conectan <span className="text-emerald-600">de verdad</span>
                            </h1>

                            <p className="mt-4 max-w-xl text-lg text-neutral-700">
                                Momentos únicos en BOA para aprender, crear y compartir. Elegí tu
                                próxima experiencia con la calidez de nuestra comunidad.
                            </p>

                            {/* Stats */}
                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-neutral-700 backdrop-blur ring-1 ring-neutral-200">
                                    <Sparkles className="h-4 w-4 text-emerald-600" />
                                    Próximos:{" "}
                                    <strong className="ml-1 text-neutral-900">
                                        {events.filter(e => new Date(e.date).getTime() >= new Date().getTime()).length}
                                    </strong>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-neutral-700 backdrop-blur ring-1 ring-neutral-200">
                                    <Calendar className="h-4 w-4 text-emerald-600" />
                                    Este mes:{" "}
                                    <strong className="ml-1 text-neutral-900">
                                        {(() => {
                                            const now = new Date();
                                            const m = now.getMonth();
                                            const y = now.getFullYear();
                                            return events.filter(ev => {
                                                const d = new Date(ev.date);
                                                return d.getFullYear() === y && d.getMonth() === m && d.getTime() >= now.getTime();
                                            }).length;
                                        })()}
                                    </strong>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-neutral-700 backdrop-blur ring-1 ring-neutral-200">
                                    <Users className="h-4 w-4 text-emerald-600" />
                                    Cupos libres:{" "}
                                    <strong className="ml-1 text-neutral-900">
                                        {(() => {
                                            const now = new Date().getTime();
                                            return events
                                                .filter(e => new Date(e.date).getTime() >= now)
                                                .reduce((acc, e) => acc + Math.max((e.capacity ?? 0) - (e.enrolled ?? 0), 0), 0);
                                        })()}
                                    </strong>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <Link href="#explorar">
                                    <Button className="h-11 rounded-2xl bg-emerald-600 px-6 text-white hover:bg-emerald-700">
                                        Ver próximos eventos
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Columna derecha: Flyer */}
                        <div className="relative">
                            <VerticalFlyerSlider events={events as any} autoPlayMs={20000} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Filtros + Listado de Eventos (sección unificada en blanco) ===== */}
            <section className="py-8 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header de filtros (compacto y cálido) */}
                    <header className="rounded-2xl px-0 py-0">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            {/* Categorías como segmented control */}
                            <div className="overflow-x-auto">
                                <div className="inline-flex gap-1 rounded-full bg-neutral-100/70 p-1">
                                    {["all", ...categories].map((cat) => {
                                        const label = cat === "all" ? "Todos los eventos" : cat;
                                        const active = selectedCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={[
                                                    "h-8 px-3 rounded-full text-[13px] transition",
                                                    active
                                                        ? "bg-white text-emerald-700 ring-1 ring-emerald-200"
                                                        : "text-neutral-700 hover:text-emerald-700 hover:bg-white/70"
                                                ].join(" ")}
                                                aria-pressed={active}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Buscador + Mes (discretos) */}
                            <div className="flex items-center gap-2">
                                <div className="relative w-[220px] sm:w-[260px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        placeholder="Buscar…"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-9 pl-9 pr-3 rounded-full bg-white ring-1 ring-neutral-200 focus:ring-emerald-300"
                                    />
                                </div>

                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="h-9 w-40 rounded-full bg-white ring-1 ring-neutral-200 focus:ring-emerald-300">
                                        <SelectValue placeholder="Mes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los meses</SelectItem>
                                        {months.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Divider suave entre filtros y listado */}
                        <div className="mt-4 h-px w-full bg-neutral-200/80" />
                    </header>

                    {/* Agrupado por mes (usa tu filteredEvents) */}
                    {/* Colocá este useMemo cerca de tus estados si aún no lo tenés */}
                    {/* 
    const groupedByMonth = useMemo(() => {
      const fmt = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
      const groups: Record<string, { label: string; items: typeof filteredEvents }> = {};
      const items = [...filteredEvents].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      for (const ev of items) {
        const d = new Date(ev.date);
        const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;
        if (!groups[key]) groups[key] = { label: fmt.format(d), items: [] as any };
        groups[key].items.push(ev);
      }
      return groups;
    }, [filteredEvents]);
    */}

                    {/* Contenido del listado */}
                    <div className="pt-8">
                        {filteredEvents.length === 0 ? (
                            <div className="text-center py-20">
                                <Calendar className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-semibold text-neutral-600 mb-2">
                                    No se encontraron eventos
                                </h3>
                                <p className="text-neutral-500 mb-6">Intenta ajustar tus filtros</p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedMonth("all");
                                        setSelectedCategory("all");
                                    }}
                                    variant="outline"
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {Object.entries(groupedByMonth).map(([key, group]) => (
                                    <div key={key} className="space-y-4">
                                        {/* Encabezado de mes */}
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 capitalize">
                                                {group.label}
                                            </h3>
                                        </div>

                                        {/* Fila por evento (formato tranquilo, sin cards pesadas) */}
                                        <div className="space-y-3">
                                            {group.items.map((event) => {
                                                const d = new Date(event.date);
                                                const isPast = d.getTime() < Date.now();
                                                const isToday = d.toDateString() === new Date().toDateString();
                                                const dd = d.getDate().toString().padStart(2, "0");
                                                const mm = (d.getMonth() + 1).toString().padStart(2, "0");
                                                const weekday = d.toLocaleDateString("es-ES", { weekday: "long" }).toUpperCase();

                                                return (
                                                    <article
                                                        key={event.id}
                                                        className="group grid grid-cols-[104px,1fr,auto] sm:grid-cols-[124px,1fr,auto] items-center gap-4 sm:gap-6 rounded-2xl bg-white ring-1 ring-neutral-200 hover:ring-emerald-200 transition"
                                                    >
                                                        {/* Mini poster */}
                                                        <Link href={`/events/${event.id}`} className="block h-full">
                                                            <div className="relative h-[120px] sm:h-[140px] w-[104px] sm:w-[124px] overflow-hidden rounded-l-2xl">
                                                                <img
                                                                    src={event.flyerVertical || event.poster || event.image}
                                                                    alt={event.title}
                                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                                />
                                                                {isToday && !isPast && (
                                                                    <span className="absolute top-2 left-2 rounded-full bg-red-600/95 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                                        ¡Hoy!
                                                                    </span>
                                                                )}
                                                                {isPast && (
                                                                    <span className="absolute top-2 left-2 rounded-full bg-neutral-800/90 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                                        Finalizado
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Link>

                                                        {/* Contenido */}
                                                        <div className="py-3 pr-2">
                                                            <Link href={`/events/${event.id}`}>
                                                                <h4 className="boa-heading text-[20px] sm:text-[22px] font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                                                                    {event.title}
                                                                </h4>
                                                            </Link>

                                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-neutral-600">
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
                                                                <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-neutral-500">
                                                                    <Users className="h-4 w-4" />
                                                                    {event.enrolled}/{event.capacity}
                                                                </span>
                                                            </div>

                                                            {event.description && (
                                                                <p className="mt-2 text-[13px] text-neutral-600 line-clamp-2">
                                                                    {event.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* CTA + precio */}
                                                        <div className="px-3 sm:px-4 py-3 flex flex-col items-end gap-2 sm:gap-3">
                                                            <div className="text-[15px] font-bold text-emerald-700">
                                                                ${event.price}
                                                            </div>
                                                            <Link href={`/events/${event.id}`}>
                                                                <Button
                                                                    size="sm"
                                                                    className={
                                                                        isPast || event.enrolled >= event.capacity
                                                                            ? "bg-neutral-400 hover:bg-neutral-400 cursor-not-allowed"
                                                                            : "bg-emerald-600 hover:bg-emerald-700"
                                                                    }
                                                                    disabled={isPast || event.enrolled >= event.capacity}
                                                                >
                                                                    {isPast
                                                                        ? "Finalizado"
                                                                        : event.enrolled >= event.capacity
                                                                            ? "Completo"
                                                                            : "Ver detalles"}
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    </div>
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
