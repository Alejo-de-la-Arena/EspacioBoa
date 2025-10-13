// components/ActivitiesCalendar.tsx
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Users,
    X
} from "lucide-react";
import type { Activity } from "@/types";

type ViewMode = "day" | "week" | "month";

/* ---------- Responsive helpers ---------- */
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const m = window.matchMedia(query);
        const onChange = () => setMatches(m.matches);
        onChange();
        m.addEventListener?.("change", onChange);
        return () => m.removeEventListener?.("change", onChange);
    }, [query]);
    return matches;
}

/* ---------- Configuración visual ---------- */
const BASE_MAX_WEEK_ITEMS = 2;   // desktop
const BASE_MAX_MONTH_ITEMS = 2;  // desktop

/* ---------- Utilidades de fechas ---------- */
const DAYS_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAYS_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // lunes=0
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
}
function addDays(d: Date, n: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}
function startOfMonth(d: Date) {
    const x = new Date(d.getFullYear(), d.getMonth(), 1);
    x.setHours(0, 0, 0, 0);
    return x;
}
function startOfCalendarMonthGrid(d: Date) {
    const first = startOfMonth(d);
    return startOfWeek(first);
}
function formatMonthYear(d: Date) {
    return new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(d);
}
function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function parseStartMinutes(range: string) {
    // toma sólo HH:mm aunque venga con “a. m.” / “p. m.”
    const left = range.split("-")[0].trim();
    const m = left.match(/(\d{1,2}):(\d{2})/);
    if (!m) return 0;
    const hh = parseInt(m[1], 10) || 0;
    const mm = parseInt(m[2], 10) || 0;
    return hh * 60 + mm;
}

function dateOnlyLocal(x: Date | string | number) {
    const d = new Date(x);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/* ---------- Rango: ¿la actividad está vigente este día? ---------- */
function isInDateRange(day: Date, a: Activity) {
    const d = dateOnlyLocal(day);
    const start = a.start_at ? dateOnlyLocal(a.start_at) : undefined;
    const end = a.end_at ? dateOnlyLocal(a.end_at) : undefined;

    if (!start && !end) return false;
    const from = start ?? end!;
    const to = end ?? start!;

    return d.getTime() >= from.getTime() && d.getTime() <= to.getTime();
}

/* ---------- Filtrado/orden del día ---------- */
function activitiesForDay(all: Activity[], day: Date) {
    return all
        .filter(a => isInDateRange(day, a)) // ← sólo rango (muestra todos los días intermedios)
        .sort((a, b) => parseStartMinutes(a.schedule.time) - parseStartMinutes(b.schedule.time));
}

/* ===================================================================== */

export default function ActivitiesCalendar({ activities }: { activities: Activity[] }) {
    const [view, setView] = useState<ViewMode>("week");
    const [anchor, setAnchor] = useState<Date>(new Date());
    const [selected, setSelected] = useState<Date>(new Date());

    // responsive: en mobile mostramos menos “chips” por celda
    const isSmall = useMediaQuery("(max-width: 767px)");
    const MAX_WEEK_ITEMS = isSmall ? 2 : BASE_MAX_WEEK_ITEMS;
    const MAX_MONTH_ITEMS = isSmall ? 1 : BASE_MAX_MONTH_ITEMS;

    // vistas disponibles según tamaño
    const views: ViewMode[] = isSmall ? ["day", "week"] : ["day", "week", "month"];
    // si estoy en mobile y quedó "month", pasar a "week"
    useEffect(() => {
        if (isSmall && view === "month") setView("week");
    }, [isSmall, view]);

    // Fechas visibles
    const weekStart = startOfWeek(anchor);
    const weekDays = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart]
    );

    const monthGrid = useMemo(() => {
        const start = startOfCalendarMonthGrid(anchor);
        return Array.from({ length: 42 }, (_, i) => addDays(start, i));
    }, [anchor]);

    // Navegación
    const goPrev = () => {
        const d = new Date(anchor);
        if (view === "day") d.setDate(d.getDate() - 1);
        if (view === "week") d.setDate(d.getDate() - 7);
        if (view === "month") d.setMonth(d.getMonth() - 1);
        setAnchor(d);
        if (view === "day") setSelected(d);
    };
    const goNext = () => {
        const d = new Date(anchor);
        if (view === "day") d.setDate(d.getDate() + 1);
        if (view === "week") d.setDate(d.getDate() + 7);
        if (view === "month") d.setMonth(d.getMonth() + 1);
        setAnchor(d);
        if (view === "day") setSelected(d);
    };
    const goToday = () => {
        const now = new Date();
        setAnchor(now);
        if (view === "day") setSelected(now);
    };

    const fade = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

    return (
        <section className="relative py-10 md:py-12 overflow-hidden">
            {/* fondo papel suave */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "#FFFBF4",
                        backgroundImage: `
              radial-gradient(70% 60% at 15% 85%, rgba(255,214,182,.14), transparent 60%),
              radial-gradient(60% 50% at 85% 10%, rgba(206,234,218,.16), transparent 60%)
            `,
                    }}
                />
                <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }} />
            </div>

            <div className="flex justify-center items-center text-center">
                <h2 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-boa-ink mb-4 text-center">
                    Calendario <span className="text-boa-green">Actividades</span>
                </h2>
            </div>

            <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header calendario */}
                <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                    className="mb-5 rounded-2xl bg-[#FFFCF7]/90 ring-1 ring-[#EEDCC9] backdrop-blur px-3 sm:px-4 py-2.5 sm:py-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-boa-ink">
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-boa-green/15 ring-1 ring-boa-green/30 text-boa-green">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                            <div className="font-semibold capitalize">{formatMonthYear(anchor)}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-9 rounded-xl ring-1 ring-boa-green/30" onClick={goPrev}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="h-9 rounded-xl ring-1 ring-boa-green/30" onClick={goToday}>
                                Hoy
                            </Button>
                            <Button variant="outline" className="h-9 rounded-xl ring-1 ring-boa-green/30" onClick={goNext}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            {/* Tabs vista */}
                            <div className="ml-1 sm:ml-2 flex rounded-xl ring-1 ring-[#EEDCC9] overflow-hidden">
                                {views.map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v)}
                                        className={[
                                            "px-2.5 sm:px-3 py-1.5 text-sm font-medium",
                                            view === v ? "bg-boa-green text-white" : "bg-white text-boa-ink/80 hover:bg-white/80",
                                        ].join(" ")}
                                        aria-pressed={view === v}
                                    >
                                        {v === "day" ? "Día" : v === "week" ? "Semana" : "Mes"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Día */}
                {view === "day" && (
                    <DayView
                        date={selected}
                        setDate={(d) => { setSelected(d); setAnchor(d); }}
                        activities={activities}
                    />
                )}

                {/* Semana */}
                {view === "week" && (
                    <WeekView weekDays={weekDays} activities={activities} MAX_WEEK_ITEMS={MAX_WEEK_ITEMS} isSmall={isSmall} />
                )}

                {/* Mes */}
                {!isSmall && view === "month" && (
                    <MonthView monthGrid={monthGrid} anchor={anchor} activities={activities} MAX_MONTH_ITEMS={MAX_MONTH_ITEMS} isSmall={isSmall} />
                )}
            </div>
        </section>
    );
}

/* -------------------- Subcomponentes -------------------- */

function EventChip({ a }: { a: Activity }) {
    const full = a.enrolled >= a.capacity;
    return (
        <Link href={`/activities/${a.id}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-boa-green/50 rounded-xl">
            <div
                className={[
                    "rounded-xl px-3 py-2 ring-1 shadow-sm transition",
                    full
                        ? "bg-boa-ink/5 ring-boa-ink/20"
                        : "bg-boa-green/10 ring-boa-green/30 group-hover:bg-boa-green/15",
                ].join(" ")}
            >
                <div className="text-[13px] font-semibold text-boa-ink leading-tight line-clamp-1">
                    {a.title}
                </div>
                <div className="mt-0.5 flex items-center justify-between text-[12px] text-boa-ink/70">
                    <span className="tabular-nums">{a.schedule.time}</span>
                    <span className="inline-flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1 text-boa-green" />
                        {a.enrolled}/{a.capacity}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function DayView({
    date,
    setDate,
    activities,
}: {
    date: Date;
    setDate: (d: Date) => void;
    activities: Activity[];
}) {
    const jsDay = date.getDay(); // 0..6
    const items = activitiesForDay(activities, date);
    const isToday = sameDay(date, new Date());

    return (
        <div className="rounded-2xl bg-[#FFFDF8] ring-1 ring-[#EEDCC9] p-4 shadow-[0_12px_28px_rgba(82,47,0,.07)]">
            <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-boa-ink">
                    {DAYS_FULL[(jsDay + 6) % 7]}{" "}
                    <span className="text-boa-ink/60">{date.toLocaleDateString("es-AR")}</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-8 rounded-xl ring-1 ring-boa-green/30" onClick={() => setDate(addDays(date, -1))}>Anterior</Button>
                    {!isToday && (
                        <Button variant="outline" className="h-8 rounded-xl ring-1 ring-boa-green/30" onClick={() => setDate(new Date())}>Hoy</Button>
                    )}
                    <Button variant="outline" className="h-8 rounded-xl ring-1 ring-boa-green/30" onClick={() => setDate(addDays(date, 1))}>Siguiente</Button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-boa-ink/60 text-sm">No hay actividades programadas este día.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((a) => <EventChip key={a.id} a={a} />)}
                </div>
            )}
        </div>
    );
}

function WeekView({
    weekDays,
    activities,
    MAX_WEEK_ITEMS,
    isSmall,
}: {
    weekDays: Date[];
    activities: Activity[];
    MAX_WEEK_ITEMS: number;
    isSmall: boolean;
}) {
    return (
        <div className="rounded-2xl bg-[#FFFDF8] ring-1 ring-[#EEDCC9] p-3 sm:p-4 shadow-[0_12px_28px_rgba(82,47,0,.07)]">
            <div className={isSmall ? "flex flex-col gap-3" : "grid grid-cols-7 gap-2 sm:gap-3"}>
                {weekDays.map((d, idx) => {
                    const all = activitiesForDay(activities, d);
                    const items = all.slice(0, MAX_WEEK_ITEMS);
                    const extra = all.length - items.length;
                    const today = sameDay(d, new Date());
                    return (
                        <div key={idx} className={isSmall ? "min-h-[0] border-b last:border-0 border-[#f1e6d9] pb-3" : "min-h-[128px]"}>
                            <div className={isSmall ? "flex items-center gap-2 mb-2" : "flex items-center justify-between mb-2"}>
                                <div className={isSmall ? "text-sm font-semibold text-boa-ink" : "text-xs sm:text-sm font-semibold text-boa-ink/80"}>
                                    {DAYS_SHORT[idx]} <span className="text-boa-ink/60">{d.getDate()}</span>
                                </div>
                                {!isSmall && (
                                    <div className={[
                                        "h-7 w-7 grid place-items-center rounded-full text-sm",
                                        today ? "bg-boa-green text-white" : "text-boa-ink/70 ring-1 ring-[#EEDCC9]"].join(" ")}>
                                        {d.getDate()}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                {items.length === 0 ? (
                                    <div className="text-[12px] text-boa-ink/50">—</div>
                                ) : (
                                    items.map((a) => <EventChip key={a.id} a={a} />)
                                )}
                                {extra > 0 && (
                                    <div className="text-[12px] text-boa-ink/60">+{extra} más</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ---------- Modal simple para mobile (lista de un día) ---------- */
function DayModal({
    open,
    onClose,
    date,
    items,
}: {
    open: boolean;
    onClose: () => void;
    date: Date | null;
    items: Activity[];
}) {
    if (!open || !date) return null;
    return (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[1px] p-4 sm:hidden">
            <div className="mx-auto max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-[#EEDCC9]">
                <div className="flex items-center justify-between p-3 border-b">
                    <div className="font-semibold text-boa-ink">
                        {DAYS_FULL[(date.getDay() + 6) % 7]}{" "}
                        <span className="text-boa-ink/60">{date.toLocaleDateString("es-AR")}</span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-black/5" onClick={onClose} aria-label="Cerrar">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-3 space-y-2">
                    {items.length === 0 ? (
                        <div className="text-sm text-boa-ink/60">No hay actividades.</div>
                    ) : (
                        items.map((a) => (
                            <Link key={a.id} href={`/activities/${a.id}`} onClick={onClose} className="block">
                                <div className="rounded-xl px-3 py-2 ring-1 ring-boa-green/30 bg-boa-green/5">
                                    <div className="text-[13px] font-semibold line-clamp-1">{a.title}</div>
                                    <div className="mt-0.5 text-[12px] text-boa-ink/70 flex items-center justify-between">
                                        <span className="tabular-nums">{a.schedule.time}</span>
                                        <span className="inline-flex items-center">
                                            <Users className="h-3.5 w-3.5 mr-1 text-boa-green" />
                                            {a.enrolled}/{a.capacity}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function MonthView({
    monthGrid,
    anchor,
    activities,
    MAX_MONTH_ITEMS,
    isSmall,
}: {
    monthGrid: Date[];
    anchor: Date;
    activities: Activity[];
    MAX_MONTH_ITEMS: number;
    isSmall: boolean;
}) {
    const month = anchor.getMonth();

    // estado modal mobile
    const [open, setOpen] = useState(false);
    const [modalDate, setModalDate] = useState<Date | null>(null);
    const [modalItems, setModalItems] = useState<Activity[]>([]);

    const openDay = (date: Date, items: Activity[]) => {
        setModalDate(date);
        setModalItems(items);
        setOpen(true);
    };

    return (
        <div className="rounded-2xl bg-[#FFFDF8] ring-1 ring-[#EEDCC9] p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(82,47,0,.07)]">
            {/* cabecera días */}
            <div className="grid grid-cols-7 gap-2 px-1 pb-2">
                {DAYS_SHORT.map((d) => (
                    <div key={d} className="text-[11px] sm:text-[12px] font-semibold text-boa-ink/70 uppercase tracking-wide">{d}</div>
                ))}
            </div>

            {/* celdas 6x7 */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {monthGrid.map((d, i) => {
                    const inMonth = d.getMonth() === month;
                    const all = activitiesForDay(activities, d);
                    const items = all.slice(0, MAX_MONTH_ITEMS);
                    const extra = all.length - items.length;
                    const today = sameDay(d, new Date());

                    return (
                        <div
                            key={i}
                            className={[
                                "min-h-[86px] sm:min-h-[112px] rounded-xl p-2 ring-1 relative",
                                inMonth ? "bg-[#FFFCF7] ring-[#EEDCC9]" : "bg-white ring-[#EEDCC9]/60 opacity-70",
                                today ? "outline outline-2 outline-boa-green/60" : ""
                            ].join(" ")}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] sm:text-sm font-medium text-boa-ink/80">{d.getDate()}</span>
                                {/* Indicadores de cantidad */}
                                {all.length > 0 && (
                                    <div className="hidden sm:flex gap-1">
                                        {Array.from({ length: Math.min(all.length, 3) }).map((_, idx) => (
                                            <span key={idx} className="h-1.5 w-1.5 rounded-full bg-boa-green/70" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Desktop / tablet: chips como siempre */}
                            <div className="hidden sm:block space-y-1.5">
                                {items.map((a) => (
                                    <Link key={a.id} href={`/activities/${a.id}`} className="block">
                                        <div className="rounded-lg px-2 py-1.5 bg-boa-green/10 ring-1 ring-boa-green/30 text-[12px]">
                                            <div className="font-semibold text-boa-ink leading-tight line-clamp-1">{a.title}</div>
                                            <div className="flex items-center justify-between text-boa-ink/70">
                                                <span className="tabular-nums">{a.schedule.time}</span>
                                                <span className="inline-flex items-center">
                                                    <Users className="h-3.5 w-3.5 mr-1 text-boa-green" />
                                                    {a.enrolled}/{a.capacity}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {extra > 0 && (
                                    <div className="text-[12px] text-boa-ink/60">+{extra} más</div>
                                )}
                            </div>

                            {/* Mobile: puntos + botón para abrir lista del día */}
                            <div className="sm:hidden">
                                {all.length === 0 ? (
                                    <div className="text-[11px] text-boa-ink/40 mt-2">—</div>
                                ) : (
                                    <button
                                        onClick={() => openDay(d, all)}
                                        className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-boa-green/10 ring-1 ring-boa-green/30 px-2 py-1 text-[11px] text-boa-ink hover:bg-boa-green/15"
                                        aria-label={`Ver ${all.length} actividades`}
                                    >
                                        <div className="flex -space-x-1">
                                            {Array.from({ length: Math.min(all.length, 4) }).map((_, idx) => (
                                                <span key={idx} className="h-1.5 w-1.5 rounded-full bg-boa-green relative inline-block" />
                                            ))}
                                        </div>
                                        Ver {all.length}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal mobile con lista del día */}
            <DayModal open={open} onClose={() => setOpen(false)} date={modalDate} items={modalItems} />
        </div>
    );
}
