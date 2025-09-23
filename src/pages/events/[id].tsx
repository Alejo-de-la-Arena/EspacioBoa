import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    Star,
    ArrowLeft,
    User,
    Phone,
    Mail,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

/* ---------- Anim helper ---------- */
const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 16 } },
};

/* ---------- Capacidad ---------- */
function CapacityMeter({ enrolled, capacity }: { enrolled: number; capacity: number }) {
    const cap = capacity ?? 0;
    const enr = enrolled ?? 0;
    const pct = cap > 0 ? Math.min(100, Math.max(0, (enr / cap) * 100)) : 0;
    const left = Math.max(0, cap - enr);

    if (!cap) {
        return (
            <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-50 ring-1 ring-neutral-200 px-2.5 py-1">
                <Users className="h-4 w-4 text-neutral-500" />
                <span className="text-[12px] text-neutral-700 font-sans">Capacidad no definida</span>
            </div>
        );
    }

    return (
        <div className="inline-flex items-center gap-3 rounded-xl bg-emerald-50/40 ring-1 ring-emerald-100 px-3 py-2 font-sans">
            <div
                className="relative h-10 w-10 rounded-full grid place-items-center"
                style={{ background: `conic-gradient(#10b981 ${pct}%, #e6f5ef ${pct}% 100%)` }}
                aria-label={`Capacidad ${enr} de ${cap}`}
                role="img"
            >
                <div className="absolute inset-[3px] rounded-full bg-white" />
                <span className="relative text-[11px] font-bold text-emerald-700 tabular-nums">{left}</span>
            </div>
            <div className="leading-tight">
                <div className="text-[12px] font-semibold text-neutral-900">Capacidad</div>
                <div className="text-[12px] text-neutral-700 tabular-nums">
                    {enr}/{cap} <span className="text-neutral-500">•</span> Quedan {left}
                </div>
            </div>
        </div>
    );
}

export default function EventDetailPage() {
    const router = useRouter();
    const { id } = router.query as { id?: string | number };
    const { events, loading } = useApp();
    const [isEnrolling, setIsEnrolling] = useState(false);

    const event = useMemo(() => events.find((e: any) => String(e.id) === String(id)), [events, id]);

    const now = new Date();
    const eventDate = event ? new Date(event.date) : null as unknown as Date;
    const isPast = eventDate ? eventDate.getTime() < now.getTime() : false;
    const isToday = eventDate ? eventDate.toDateString() === now.toDateString() : false;
    const isFullyBooked = event ? (event.enrolled ?? 0) >= (event.capacity ?? 0) : false;
    const spotsRemaining = event ? Math.max(0, (event.capacity ?? 0) - (event.enrolled ?? 0)) : 0;

    /* ---------- Alturas sincronizadas (imagen = columna derecha) ---------- */
    const contentRef = useRef<HTMLDivElement>(null);
    const [colH, setColH] = useState<number | null>(null);

    useEffect(() => {
        if (!contentRef.current) return;
        const el = contentRef.current;

        const setH = () => setColH(el.offsetHeight);
        setH();

        const ro = new ResizeObserver(setH);
        ro.observe(el);
        window.addEventListener("resize", setH);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", setH);
        };
    }, [event?.id]);

    /* ---------- Fecha capitalizada ---------- */
    const dateLabel = useMemo(() => {
        if (!event) return "";
        const s = new Date(event.date).toLocaleDateString("es-ES", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
        return s.charAt(0).toUpperCase() + s.slice(1);
    }, [event]);

    /* ---------- Otros eventos (siempre muestra) ---------- */
    const relatedEvents = useMemo(() => {
        if (!event) return [];
        const sameCat = events
            .filter((e: any) => String(e.id) !== String(event.id) && e.category === event.category)
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const needed = Math.max(0, 12 - sameCat.length);
        const filler = events
            .filter(
                (e: any) =>
                    String(e.id) !== String(event.id) &&
                    !sameCat.some((s: any) => String(s.id) === String(e.id))
            )
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, needed);

        return [...sameCat, ...filler]; // no limit; el carrusel maneja overflow
    }, [event, events]);

    const handleEnroll = async () => {
        setIsEnrolling(true);
        await new Promise((r) => setTimeout(r, 1200));
        setIsEnrolling(false);
        alert("¡Inscripción exitosa! Recibirás un email de confirmación con todos los detalles.");
    };

    if (loading) {
        return (
            <section>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Calendar className="h-12 w-12" />
                    </div>
                </div>
            </section>
        );
    }

    if (!event) {
        return (
            <section>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Evento no encontrado</h1>
                        <Button onClick={() => router.push("/events")}>Volver a eventos</Button>
                    </div>
                </div>
            </section>
        );
    }

    /* ---------- Render ---------- */
    return (
        <section>
            {/* Back (dentro del contenedor, buen padding) */}
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                <Button
                    onClick={() => router.back()}
                    className="rounded-xl bg-white ring-1 ring-neutral-200 text-neutral-800 hover:bg-neutral-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>

            {/* HERO */}
            <section className="relative pb-12 font-sans">
                {/* Fondo suave */}
                <div aria-hidden className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_10%_0%,#FFF7ED_0%,transparent_55%),radial-gradient(90%_80%_at_100%_10%,#F7FAF9_0%,transparent_45%),#FFFFFF]" />
                    <div className="pointer-events-none absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-emerald-100/30 blur-3xl" />
                    <div className="pointer-events-none absolute -right-28 -bottom-28 h-[30rem] w-[30rem] rounded-full bg-amber-100/35 blur-3xl" />
                </div>

                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-stretch"
                    >
                        {/* Imagen (misma altura que la derecha) */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 16 } } }}
                            className="relative self-stretch overflow-hidden"
                            style={{ height: colH ?? "auto" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 28px)", scale: 1.02 }}
                                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 28px)", scale: 1 }}
                                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                                className="relative h-full"
                            >
                                <img
                                    src={event.flyerVertical || event.poster || event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover rounded-[28px] shadow-[0_18px_45px_rgba(0,0,0,0.12)] ring-1 ring-neutral-200"
                                    loading="eager"
                                />

                                {event.featured && (
                                    <Badge className="absolute top-5 left-5 bg-emerald-600 text-white">
                                        <Star className="h-3 w-3 mr-1" />
                                        Evento destacado
                                    </Badge>
                                )}
                                {isPast && (
                                    <div className="absolute inset-0 bg-neutral-900/45 rounded-[28px] grid place-items-center">
                                        <Badge className="bg-neutral-800 text-white text-base px-4 py-2">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Evento Finalizado
                                        </Badge>
                                    </div>
                                )}
                                {isToday && !isPast && (
                                    <Badge className="absolute top-5 right-5 bg-red-600 text-white animate-pulse">¡Hoy!</Badge>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Contenido */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 16 } } }}
                            className="self-stretch flex flex-col gap-6"
                            ref={contentRef}
                        >
                            <div>
                                {event.category && (
                                    <Badge className="mb-3 bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200">
                                        {event.category}
                                    </Badge>
                                )}
                                <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-900 mb-3">
                                    {event.title}
                                </h1>
                                {event.description && (
                                    <p className="text-[17px] text-neutral-700 leading-relaxed">{event.description}</p>
                                )}
                            </div>

                            {/* Pills */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center rounded-xl bg-white ring-1 ring-neutral-200 px-3 py-2 text-neutral-700">
                                    <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                                    <span>{dateLabel}</span>
                                </div>
                                {event.time && (
                                    <div className="flex items-center rounded-xl bg-white ring-1 ring-neutral-200 px-3 py-2 text-neutral-700">
                                        <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                                        <span>{event.time}</span>
                                    </div>
                                )}
                                <div className="flex items-center rounded-xl bg-white ring-1 ring-neutral-200 px-3 py-2 text-neutral-700">
                                    <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                                    <span>{event.location || "BOA – Espacio Principal"}</span>
                                </div>
                                <div className="flex items-center rounded-xl bg-white ring-1 ring-neutral-200 px-3 py-2 text-neutral-700">
                                    <Users className="h-5 w-5 mr-2 text-emerald-600" />
                                    <span>{event.enrolled}/{event.capacity} participantes</span>
                                </div>
                            </div>

                            {/* Precio + Capacidad + CTA */}
                            {!isPast && (
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.05 }}>
                                    <Card className="bg-gradient-to-br from-[#F9FBFA] to-white border-neutral-200">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <div className="text-3xl font-bold text-neutral-900 leading-none">${event.price}</div>
                                                        <div className="text-sm text-neutral-600 mt-1">Por persona</div>
                                                    </div>
                                                    <CapacityMeter enrolled={event.enrolled ?? 0} capacity={event.capacity ?? 0} />
                                                </div>

                                                <div className="text-right">
                                                    <div className={`font-semibold ${isFullyBooked ? "text-red-500" : "text-emerald-700"}`}>
                                                        {isFullyBooked ? "¡Completo!" : `${spotsRemaining} cupos disponibles`}
                                                    </div>
                                                    <div className="text-sm text-neutral-500">
                                                        {isFullyBooked ? "Lista de espera disponible" : "¡Reservá tu lugar!"}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleEnroll}
                                                disabled={isEnrolling || isFullyBooked}
                                                className={`mt-5 w-full py-3 rounded-2xl transition-all duration-300 ${isFullyBooked
                                                        ? "bg-neutral-400 hover:bg-neutral-400 cursor-not-allowed"
                                                        : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
                                                    }`}
                                                size="lg"
                                            >
                                                {isEnrolling ? (
                                                    <div className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                        Procesando...
                                                    </div>
                                                ) : isFullyBooked ? (
                                                    "Unirse a lista de espera"
                                                ) : (
                                                    "Inscribirme al evento"
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Facilitador */}
            {event.facilitator && (
                <section className="py-14 bg-white font-sans">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-semibold text-neutral-900 mb-10 text-center">Facilitador</h2>
                        <Card className="max-w-3xl mx-auto bg-white shadow-lg border-emerald-100">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={event.facilitator?.image} alt={event.facilitator?.name} />
                                        <AvatarFallback>
                                            <User className="h-12 w-12" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-semibold text-neutral-900 mb-1">
                                            {event.facilitator?.name}
                                        </h3>
                                        {event.facilitator?.specialty && (
                                            <p className="text-emerald-600 font-medium mb-3">{event.facilitator.specialty}</p>
                                        )}
                                        {event.facilitator?.bio && (
                                            <p className="text-neutral-700 leading-relaxed mb-5">{event.facilitator.bio}</p>
                                        )}
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start text-sm text-neutral-600">
                                            {event.facilitator?.experience && (
                                                <div className="inline-flex items-center">
                                                    <Star className="h-4 w-4 text-amber-500 mr-2" />
                                                    {event.facilitator.experience} años de experiencia
                                                </div>
                                            )}
                                            {event.facilitator?.phone && (
                                                <div className="inline-flex items-center">
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    {event.facilitator.phone}
                                                </div>
                                            )}
                                            {event.facilitator?.email && (
                                                <div className="inline-flex items-center">
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    {event.facilitator.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Otros eventos (carrusel horizontal con scroll-snap + botones) */}
            <section className="py-16 bg-neutral-50 font-sans">
                <div className="container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-3xl font-semibold text-neutral-900">Otros eventos</h2>
                        <Button
                            onClick={() => router.push("/events")}
                            className="rounded-xl bg-white ring-1 ring-neutral-200 text-neutral-800 hover:bg-neutral-50"
                        >
                            Ver todos
                        </Button>
                    </div>

                    {/* Controles */}
                    <Carousel relatedEvents={relatedEvents} now={now} onOpen={(id) => router.push(`/events/${id}`)} />
                </div>
            </section>
        </section>
    );
}

/* ---------- Carousel component (smooth & exótico) ---------- */
function Carousel({
    relatedEvents,
    now,
    onOpen,
}: {
    relatedEvents: any[];
    now: Date;
    onOpen: (id: string | number) => void;
}) {
    const scrollerRef = useRef<HTMLDivElement>(null);

    const scrollBy = (dir: "prev" | "next") => {
        const el = scrollerRef.current;
        if (!el) return;
        const delta = Math.round(el.clientWidth * 0.9);
        el.scrollBy({ left: dir === "next" ? delta : -delta, behavior: "smooth" });
    };

    return (
        <div className="relative">
            {/* fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-neutral-50 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-neutral-50 to-transparent" />

            {/* buttons */}
            <div className="absolute right-0 flex items-center gap-2">
                <button
                    onClick={() => scrollBy("prev")}
                    className="h-9 w-9 grid place-items-center rounded-full bg-white ring-1 ring-neutral-200 hover:ring-emerald-200 shadow-sm"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    onClick={() => scrollBy("next")}
                    className="h-9 w-9 grid place-items-center rounded-full bg-white ring-1 ring-neutral-200 hover:ring-emerald-200 shadow-sm"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            <div
                ref={scrollerRef}
                className="overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]"
                // hide scrollbar (Firefox + WebKit)
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                <div className="flex gap-6 pr-2 [ &::-webkit-scrollbar ]:hidden">
                    {relatedEvents.map((ev: any, idx: number) => {
                        const d = new Date(ev.date);
                        const isRelPast = d.getTime() < now.getTime();
                        const evDateLabel = (() => {
                            const s = d.toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            });
                            return s.charAt(0).toUpperCase() + s.slice(1);
                        })();

                        return (
                            <motion.div
                                key={ev.id}
                                className="snap-start shrink-0 w-[280px]"
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ type: "spring", stiffness: 90, damping: 16, delay: idx * 0.02 }}
                            >
                                <Card
                                    className="group cursor-pointer border-emerald-100 bg-white/90 hover:bg-white ring-1 ring-emerald-100 hover:ring-emerald-200 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-[0_14px_34px_rgba(16,185,129,0.15)]"
                                    onClick={() => onOpen(ev.id)}
                                >
                                    <div className="relative overflow-hidden rounded-t-xl">
                                        <img
                                            src={ev.flyerVertical || ev.poster || ev.image}
                                            alt={ev.title}
                                            className="w-full h-40 object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        {isRelPast && (
                                            <div className="absolute inset-0 bg-neutral-900/35 grid place-items-center">
                                                <Badge className="bg-neutral-800 text-white text-xs">Finalizado</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-5">
                                        <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-emerald-700 transition-colors">
                                            {ev.title}
                                        </h3>
                                        <p className="text-[13px] text-neutral-600 line-clamp-2 mb-2">{ev.description}</p>
                                        <div className="text-[12px] text-neutral-500 mb-4">
                                            {evDateLabel}{ev.time ? ` – ${ev.time}` : ""}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-emerald-700">${ev.price}</span>
                                            <Button size="sm" className="rounded-full bg-white ring-1 ring-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:ring-emerald-200">
                                                Ver detalles
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
