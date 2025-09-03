// components/ActivitiesCalendar.tsx
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Users,
} from "lucide-react";
import type { Activity } from "@/types";

type ViewMode = "day" | "week" | "month";

/* ---------- Configuración de “limpieza” ---------- */
// Máximo de items a mostrar por día en SEMANA y MES
const MAX_WEEK_ITEMS = 2;
const MAX_MONTH_ITEMS = 2;
// Densidad: cada actividad se muestra en 1 de cada N semanas (2 = quincenal)
const DENSITY_MOD = 2;

/* ---------- Utilidades de fechas / normalización ---------- */
const ES_TO_JS_DAY: Record<string, number> = {
    domingo: 0, lunes: 1, martes: 2, miercoles: 3, miércoles: 3, jueves: 4, viernes: 5, sabado: 6, sábado: 6,
};
const DAYS_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAYS_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function normalize(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function jsDayFromActivity(day: string): number {
    return ES_TO_JS_DAY[normalize(day)];
}
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
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function parseStartMinutes(range: string) {
    const left = range.split("-")[0].trim();
    const [hh, mm] = left.split(":").map(Number);
    return (hh || 0) * 60 + (mm || 0);
}

/* ---------- Densidad (mostrar solo algunas semanas) ---------- */
const MS_WEEK = 7 * 24 * 60 * 60 * 1000;
function weekKey(date: Date) {
    // índice de semana basado en el lunes
    return Math.floor(startOfWeek(date).getTime() / MS_WEEK);
}
function hashString(s: string | number) {
    const str = String(s);
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
}
/** Mostrar esta actividad en la semana de 'date'? (quincenal determinístico) */
function shouldShowOn(date: Date, a: Activity) {
    const wk = weekKey(date);
    const seed = hashString(a.id);
    return ((wk + (seed % DENSITY_MOD)) % DENSITY_MOD) === 0;
}

export default function ActivitiesCalendar({ activities }: { activities: Activity[] }) {
    const [view, setView] = useState<ViewMode>("week");
    const [anchor, setAnchor] = useState<Date>(new Date());
    const [selected, setSelected] = useState<Date>(new Date());

    // Agrupar por día de semana y ordenar por horario
    const byWeekday = useMemo(() => {
        const m: Record<number, Activity[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        activities.forEach((a) => {
            const jsDay = jsDayFromActivity(a.schedule.day);
            if (typeof jsDay === "number") m[jsDay].push(a);
        });
        Object.keys(m).forEach((k) => {
            m[+k].sort((a, b) => parseStartMinutes(a.schedule.time) - parseStartMinutes(b.schedule.time));
        });
        return m;
    }, [activities]);

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

    // Fechas visibles
    const weekStart = startOfWeek(anchor);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const monthGrid = useMemo(() => {
        const start = startOfCalendarMonthGrid(anchor);
        return Array.from({ length: 42 }, (_, i) => addDays(start, i));
    }, [anchor]);

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

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header calendario */}
                <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                    className="mb-5 rounded-2xl bg-[#FFFCF7]/85 ring-1 ring-[#EEDCC9] backdrop-blur px-4 py-3">
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
                            <div className="ml-2 flex rounded-xl ring-1 ring-[#EEDCC9] overflow-hidden">
                                {(["day", "week", "month"] as ViewMode[]).map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v)}
                                        className={[
                                            "px-3 py-1.5 text-sm font-medium",
                                            view === v ? "bg-boa-green text-white" : "bg-white text-boa-ink/80 hover:bg-white/80",
                                        ].join(" ")}
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
                        byWeekday={byWeekday}
                    />
                )}

                {/* Semana */}
                {view === "week" && (
                    <WeekView weekDays={weekDays} byWeekday={byWeekday} />
                )}

                {/* Mes */}
                {view === "month" && (
                    <MonthView monthGrid={monthGrid} anchor={anchor} byWeekday={byWeekday} />
                )}
            </div>
        </section>
    );
}

/* -------------------- Subcomponentes -------------------- */

/** Chip minimalista: Título + (hora • cupos) */
function EventChip({ a }: { a: Activity }) {
    const full = a.enrolled >= a.capacity;
    return (
        <Link href={`/activities/${a.id}`} className="block group">
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
                    <span>{a.schedule.time}</span>
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
    byWeekday,
}: {
    date: Date;
    setDate: (d: Date) => void;
    byWeekday: Record<number, Activity[]>;
}) {
    const jsDay = date.getDay(); // 0..6
    // Mostrar solo si toca esta semana (densidad)
    const items = (byWeekday[jsDay] || []).filter((a) => shouldShowOn(date, a));
    const isToday = sameDay(date, new Date());

    return (
        <div className="rounded-2xl bg-white ring-1 ring-[#EEDCC9] p-4 shadow-[0_12px_28px_rgba(82,47,0,.07)]">
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
    byWeekday,
}: {
    weekDays: Date[];
    byWeekday: Record<number, Activity[]>;
}) {
    return (
        <div className="rounded-2xl bg-white ring-1 ring-[#EEDCC9] p-4 shadow-[0_12px_28px_rgba(82,47,0,.07)]">
            <div className="grid grid-cols-7 gap-3">
                {weekDays.map((d, idx) => {
                    const jsDay = d.getDay();
                    const all = (byWeekday[jsDay] || []).filter((a) => shouldShowOn(d, a));
                    const items = all.slice(0, MAX_WEEK_ITEMS);
                    const extra = all.length - items.length;
                    const today = sameDay(d, new Date());
                    return (
                        <div key={idx} className="min-h-[132px]">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-semibold text-boa-ink/80">{DAYS_SHORT[idx]}</div>
                                <div className={[
                                    "h-7 w-7 grid place-items-center rounded-full text-sm",
                                    today ? "bg-boa-green text-white" : "text-boa-ink/70 ring-1 ring-[#EEDCC9]"
                                ].join(" ")}>
                                    {d.getDate()}
                                </div>
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

function MonthView({
    monthGrid,
    anchor,
    byWeekday,
}: {
    monthGrid: Date[];
    anchor: Date;
    byWeekday: Record<number, Activity[]>;
}) {
    const month = anchor.getMonth();
    return (
        <div className="rounded-2xl bg-white ring-1 ring-[#EEDCC9] p-3 shadow-[0_12px_28px_rgba(82,47,0,.07)]">
            {/* cabecera días */}
            <div className="grid grid-cols-7 gap-2 px-1 pb-2">
                {DAYS_SHORT.map((d) => (
                    <div key={d} className="text-[12px] font-semibold text-boa-ink/70 uppercase tracking-wide">{d}</div>
                ))}
            </div>

            {/* celdas 6x7 */}
            <div className="grid grid-cols-7 gap-2">
                {monthGrid.map((d, i) => {
                    const inMonth = d.getMonth() === month;
                    const jsDay = d.getDay();
                    const all = (byWeekday[jsDay] || []).filter((a) => shouldShowOn(d, a));
                    const items = all.slice(0, MAX_MONTH_ITEMS);
                    const extra = all.length - items.length;
                    const today = sameDay(d, new Date());
                    return (
                        <div key={i}
                            className={[
                                "min-h-[112px] rounded-xl p-2 ring-1",
                                inMonth ? "bg-[#FFFCF7] ring-[#EEDCC9]" : "bg-white ring-[#EEDCC9]/60 opacity-70",
                                today ? "outline outline-2 outline-boa-green/60" : ""
                            ].join(" ")}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-boa-ink/80">{d.getDate()}</span>
                            </div>

                            <div className="space-y-1.5">
                                {items.map((a) => (
                                    <Link key={a.id} href={`/activities/${a.id}`} className="block">
                                        <div className="rounded-lg px-2 py-1.5 bg-boa-green/10 ring-1 ring-boa-green/30 text-[12px]">
                                            <div className="font-semibold text-boa-ink leading-tight line-clamp-1">{a.title}</div>
                                            <div className="flex items-center justify-between text-boa-ink/70">
                                                <span>{a.schedule.time}</span>
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
