import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Sparkles, Users } from "lucide-react";
import VerticalFlyerSlider from "./events/VerticalFlyerSlider";

const AmbientArtBackground = () => (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
            className="absolute inset-0"
            style={{
                background:
                    "linear-gradient(180deg,#FFF8ED 0%,#FFFBF4 40%,#FFFFFF 65%,#FFF2DF 100%)",
            }}
        />
        <div
            className="pointer-events-none absolute -top-24 -left-28 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-80"
            style={{
                background:
                    "radial-gradient(60% 60% at 50% 50%, rgba(248,220,195,0.85) 0%, rgba(248,220,195,0.35) 55%, rgba(248,220,195,0.0) 72%)",
            }}
        />
        <div
            className="pointer-events-none absolute -bottom-28 -right-36 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-70"
            style={{
                background:
                    "radial-gradient(60% 60% at 50% 50%, rgba(244,201,190,0.75) 0%, rgba(244,201,190,0.30) 55%, rgba(244,201,190,0.0) 72%)",
            }}
        />
        <div
            className="pointer-events-none absolute top-1/3 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full blur-3xl opacity-70"
            style={{
                background:
                    "radial-gradient(60% 60% at 50% 50%, rgba(220,239,229,0.70) 0%, rgba(220,239,229,0.28) 55%, rgba(220,239,229,0.0) 72%)",
            }}
        />
        <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
        />
    </div>
);

export default function EventsHero({ events }: { events: any[] }) {
    const normalizeDate = (ev: any) =>
        ev?.date ?? ev?.start_at ?? ev?.startAt ?? ev?.start_date ?? null;

    const normalized = (events ?? []).map((ev) => ({
        ...ev,
        featured: !!ev?.featured,
        is_published: ev?.is_published ?? ev?.published ?? true,
        date: normalizeDate(ev),
    }));

    const featuredEvents = normalized
        .filter((e) => e.featured && e.is_published && e.date)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const now = new Date();

    const upcomingCount = normalized.filter((e) => {
        const d = e.date ? new Date(e.date).getTime() : 0;
        return d >= now.getTime();
    }).length;

    const thisMonthCount = (() => {
        const m = now.getMonth();
        const y = now.getFullYear();
        return normalized.filter((e) => {
            if (!e.date) return false;
            const d = new Date(e.date);
            return d.getFullYear() === y && d.getMonth() === m && d.getTime() >= now.getTime();
        }).length;
    })();

    const freeSeats = (() => {
        const t = now.getTime();
        return normalized
            .filter((e) => (e.date ? new Date(e.date).getTime() >= t : false))
            .reduce(
                (acc, e) => acc + Math.max((e.capacity ?? 0) - (e.enrolled ?? 0), 0),
                0
            );
    })();

    return (
        <section id="events-hero" className="relative overflow-hidden font-sans">
            <AmbientArtBackground />
            <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 md:gap-12 md:grid-cols-2 min-h-[calc(100svh-64px)] py-10 sm:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
                            <Calendar className="h-4 w-4 text-boa-green" />
                            Eventos puntuales: talleres, ferias y charlas
                        </span>

                        <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-neutral-900 font-sans">
                            Encuentros que conectan{" "}
                            <span className="text-boa-green">de verdad</span>
                        </h1>

                        <p className="mt-4 max-w-xl text-lg text-neutral-700 font-sans">
                            Momentos únicos en BOA para aprender, crear y compartir. Elegí tu
                            próxima experiencia con la calidez de nuestra comunidad.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-neutral-700 backdrop-blur ring-1 ring-neutral-200">
                                <Sparkles className="h-4 w-4 text-boa-green" />
                                Próximos:
                                <strong className="ml-1 text-neutral-900 font-sans">
                                    {upcomingCount}
                                </strong>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-neutral-700 backdrop-blur ring-1 ring-neutral-200">
                                <Calendar className="h-4 w-4 text-boa-green" />
                                Este mes:
                                <strong className="ml-1 text-neutral-900 font-sans">
                                    {thisMonthCount}
                                </strong>
                            </div>

                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link href="#explorar">
                                <button className="h-11 rounded-2xl bg-boa-green px-6 text-white hover:bg-boa-cream hover:border hover:border-boa-green hover:text-boa-green transition-colors font-sans">
                                    Ver próximos eventos
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
                        className="relative"
                    >
                        <VerticalFlyerSlider events={featuredEvents as any} maxSlides={3} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
