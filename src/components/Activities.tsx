import { useMemo, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Calendar,
    Clock,
    MapPin,
    Sparkles,
    ChevronRight,
    Users,
} from "lucide-react";
import type { Activity } from "@/types";
import { motion, useInView } from "framer-motion";

const DAYS_ORDER = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const headerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.99 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.35, ease: "easeOut" },
    },
};

export default function Activities({ activities }: { activities: Activity[] }) {
    const [search, setSearch] = useState("");
    const [day, setDay] = useState<"all" | string>("all");
    const [cat, setCat] = useState<"all" | string>("all");
    const router = useRouter();

    const sectionRef = useRef<HTMLElement | null>(null);
    const inView = useInView(sectionRef, { once: true, amount: 0.15 });

    const days = useMemo(
        () =>
            Array.from(new Set(activities.map((a) => a.schedule.day))).sort(
                (a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b)
            ),
        [activities]
    );

    const categories = useMemo(
        () =>
            Array.from(new Set(activities.map((a) => a.category.toLowerCase()))).sort(),
        [activities]
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return activities.filter((a) => {
            const byDay = day === "all" || a.schedule.day === day;
            const byCat = cat === "all" || a.category.toLowerCase() === cat;
            const inText =
                !q ||
                `${a.title} ${a.description} ${a.location} ${a.category}`
                    .toLowerCase()
                    .includes(q);
            return byDay && byCat && inText;
        });
    }, [activities, search, day, cat]);

    const animateState = inView ? "visible" : "hidden";

    return (
        <section
            id="actividades"
            ref={sectionRef}
            className="relative py-10 md:py-12 overflow-hidden"
        >
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
                    className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                />
            </div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate={animateState}
                    className="mb-6 md:mb-8 rounded-2xl bg-[#FFFCF7]/85 ring-1 ring-[#EEDCC9] backdrop-blur px-4 py-3"
                >
                    <div className="flex flex-col gap-3 md:grid md:grid-cols-[180px_220px_1fr_auto] md:items-center">
                        <Select value={day} onValueChange={setDay}>
                            <SelectTrigger className="h-10 rounded-xl bg-white/90 ring-1 ring-boa-green/20 border-0">
                                <SelectValue placeholder="Día" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los días</SelectItem>
                                {days.map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={cat} onValueChange={setCat}>
                            <SelectTrigger className="h-10 rounded-xl bg-white/90 ring-1 ring-boa-green/20 border-0">
                                <SelectValue placeholder="Actividad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-boa-ink/40" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre o descripción…"
                                aria-label="Buscar actividades"
                                className="h-10 pl-10 rounded-xl bg-white/90 ring-1 ring-boa-green/20 border-0"
                            />
                        </div>

                        <div className="md:justify-self-end">
                            <Button
                                variant="outline"
                                className="h-10 rounded-xl ring-1 ring-boa-green/30 hover:bg-boa-green/10"
                                onClick={() => {
                                    setSearch("");
                                    setDay("all");
                                    setCat("all");
                                }}
                            >
                                Limpiar
                            </Button>
                        </div>
                    </div>

                    <div className="mt-2 text-xs text-boa-ink/60">
                        Mostrando{" "}
                        <span className="font-semibold text-boa-green">{filtered.length}</span> de{" "}
                        <span className="font-semibold">{activities.length}</span> actividades.
                    </div>
                </motion.div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Sparkles className="h-10 w-10 text-boa-green/40 mx-auto mb-3" />
                        <p className="text-boa-ink/70">No encontramos actividades para esos filtros.</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch("");
                                setDay("all");
                                setCat("all");
                            }}
                            className="mt-4 rounded-xl ring-1 ring-boa-green/30 hover:bg-boa-green/10"
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
                        variants={containerVariants}
                        initial="hidden"
                        animate={animateState}
                    >
                        {filtered.map((a) => (
                            <motion.article
                                key={a.id}
                                role="link"
                                tabIndex={0}
                                aria-label={`Ver detalles de ${a.title}`}
                                onClick={() => router.push(`/activities/${a.id}`)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        router.push(`/activities/${a.id}`);
                                    }
                                }}
                                variants={cardVariants}
                                className="group relative rounded-[28px] overflow-hidden ring-1 ring-[#EEDCC9] bg-[#FFF9F0] shadow-[0_16px_48px_rgba(82,47,0,.10)] md:cursor-pointer"
                            >
                                <img
                                    src={a.images?.[0] ?? a.image}
                                    alt={a.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,rgba(0,0,0,0)_0%,rgba(0,0,0,.18)_60%,rgba(0,0,0,.55)_100%)]" />
                                <div
                                    className="absolute inset-0 mix-blend-multiply"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, rgba(28,95,80,.15) 0%, rgba(255,214,182,.15) 100%)",
                                    }}
                                />
                                <Constellation className="absolute inset-0 opacity-[0.14] mix-blend-soft-light" />
                                <div className="pointer-events-none absolute inset-3 rounded-[22px] ring-1 ring-white/30 shadow-inner" />

                                <div className="absolute top-6 left-6 flex items-center gap-2">
                                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold bg-white/80 text-boa-ink/80 ring-1 ring-white/70 backdrop-blur">
                                        {a.category}
                                    </span>
                                    {a.featured && (
                                        <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white bg-boa-green shadow-md flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" /> Destacada
                                        </span>
                                    )}
                                </div>

                                <div className="relative z-[1] p-5 md:p-6 h-[360px] flex flex-col justify-end">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-white drop-shadow-md text-2xl font-extrabold tracking-tight">
                                            {a.title}
                                        </h3>
                                        {typeof a.price === "number" && (
                                            <span className="text-white/90 font-bold">${a.price}</span>
                                        )}
                                    </div>

                                    <svg className="mt-2 w-24 h-3" viewBox="0 0 120 12" fill="none" aria-hidden="true">
                                        <path
                                            d="M2 8C28 11 58 11 118 6"
                                            stroke="hsl(var(--boa-green))"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            opacity=".8"
                                        />
                                    </svg>

                                    <p className="mt-2 text-white/80 text-sm line-clamp-1">{a.description}</p>

                                    <div className="mt-4 translate-y-0 transition-all duration-300 group-hover:opacity-100">
                                        <div className="grid grid-cols-1 gap-2 text-[13px] text-white/90 sm:hidden">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {a.schedule.day}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2" />
                                                {a.schedule.time}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                {a.location}
                                            </div>
                                        </div>

                                        <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center text-[13px] text-white/90">
                                            <div className="flex items-center justify-start">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {a.schedule.day}
                                            </div>
                                            <div className="flex items-center justify-center text-center">
                                                <Clock className="h-4 w-4 mr-2" />
                                                {a.schedule.time}
                                            </div>
                                            <div className="flex items-center justify-end text-right">
                                                <Users className="h-4 w-4 mr-2" />
                                                <span className="tabular-nums">
                                                    {a.enrolled}/{a.capacity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 hidden sm:flex items-center justify-between">
                                            <span className="inline-flex items-center text-[12px] text-white/90">
                                                <MapPin className="h-4 w-4 mr-1.5" />
                                                {a.location}
                                            </span>

                                            <Link
                                                href={`/activities/${a.id}`}
                                                className="focus:outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    size="sm"
                                                    className={`group/btn rounded-full px-4 ${a.enrolled >= a.capacity
                                                            ? "bg-white/30 hover:bg-white/30 cursor-not-allowed"
                                                            : "bg-white text-boa-ink hover:bg-white/90"
                                                        }`}
                                                    disabled={a.enrolled >= a.capacity}
                                                >
                                                    Ver detalles
                                                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="mt-3 flex justify-end sm:hidden">
                                            <Link
                                                href={`/activities/${a.id}`}
                                                className="focus:outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    size="sm"
                                                    className={`group/btn rounded-full px-4 ${a.enrolled >= a.capacity
                                                            ? "bg-white/30 hover:bg-white/30 cursor-not-allowed"
                                                            : "bg-white text-boa-ink hover:bg-white/90"
                                                        }`}
                                                    disabled={a.enrolled >= a.capacity}
                                                >
                                                    Ver detalles
                                                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {a.featured && (
                                    <div
                                        className="absolute -inset-1 rounded-[32px] pointer-events-none blur-2xl opacity-0 group-hover:opacity-40 transition-opacity"
                                        style={{
                                            background:
                                                "radial-gradient(60% 60% at 50% 90%, rgba(30,122,102,.55), transparent 70%)",
                                        }}
                                    />
                                )}
                            </motion.article>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function Constellation({ className = "" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 1200 800" aria-hidden="true">
            <g stroke="white" strokeOpacity=".25" strokeWidth=".8" fill="none">
                <circle cx="120" cy="160" r="1.6" />
                <circle cx="300" cy="90" r="1.2" />
                <circle cx="520" cy="140" r="1.4" />
                <circle cx="820" cy="110" r="1.6" />
                <circle cx="980" cy="180" r="1.2" />
                <circle cx="220" cy="420" r="1.4" />
                <circle cx="460" cy="380" r="1.2" />
                <circle cx="760" cy="420" r="1.6" />
                <circle cx="1020" cy="390" r="1.3" />
                <path d="M120 160 L300 90 L520 140 L820 110 L980 180" />
                <path d="M220 420 L460 380 L760 420 L1020 390" />
            </g>
        </svg>
    );
}
