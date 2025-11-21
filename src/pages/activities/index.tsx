// pages/activities/index.tsx
import Head from "next/head";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { mediaUrl } from "@/lib/mediaUrl";
import Activities from "@/components/Activities";
import ActivitiesCalendar from "@/components/ActivitiesCalendar";
import { useActivitiesLive } from "@/hooks/useActivitiesLive";

import { RevealOnScroll, REVEAL_PRESET_CYCLE } from "@/components/RevealOnScroll";

import * as React from "react";
import { useAuth } from "@/stores/useAuth";
import type { Activity } from "@/types";
import { useMemo } from "react";
import { useRouter } from "next/router";

function deriveScheduleFromStart(startISO?: string) {
    if (!startISO) return { day: "—", time: "—" };
    const d = new Date(startISO);
    const day = d.toLocaleDateString("es-AR", { weekday: "long" }) || "—";
    const prettyDay = day.charAt(0).toUpperCase() + day.slice(1);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return { day: prettyDay, time: `${hh}:${mm}` };
}

function normalizeActivity(ui: any): Activity {
    const start_at: string | undefined = ui.start_at ?? ui.startAt ?? ui.start ?? undefined;
    const end_at: string | undefined = ui.end_at ?? ui.endAt ?? ui.end ?? undefined;
    const gallery: string[] = Array.isArray(ui.gallery) ? ui.gallery : [];
    const images: string[] = Array.isArray(ui.images)
        ? ui.images
        : ui.hero_image
            ? [ui.hero_image]
            : ui.image
                ? [ui.image]
                : [];
    const schedule = ui.schedule ?? deriveScheduleFromStart(start_at);

    return {
        id: ui.id,
        slug: ui.slug ?? undefined,
        title: ui.title ?? "",
        description: ui.description ?? "",
        images,
        image: ui.image ?? ui.hero_image ?? images[0],
        category: ui.category ?? "General",
        price: typeof ui.price === "number" ? ui.price : undefined,
        featured: !!ui.featured,
        schedule,
        location: ui.location ?? "Espacio BOA",
        enrolled: typeof ui.enrolled === "number" ? ui.enrolled : 0,
        capacity: typeof ui.capacity === "number" ? ui.capacity : 0,
        instructor: ui.instructor,
        start_at,
        end_at,
        is_published: ui.is_published ?? undefined,
        hero_image: ui.hero_image ?? undefined,
        gallery,
    };
}

export default function ActivitiesPage() {
    // 👇 CLAVE: esperar a que Auth esté inicializado
    const { initialized } = useAuth();

    // Tu hook real de datos (asegurate de que internamente también espere `initialized`)
    const { activities: rawActivities = [], loading: dataLoading } = useActivitiesLive();

    // Loader combinado
    const isLoading = !initialized || dataLoading;

    // Escape hatch (anti spinner infinito)
    const [stuck, setStuck] = React.useState(false);
    const router = useRouter();
    React.useEffect(() => {
        if (!isLoading) return;
        const id = setTimeout(() => setStuck(true), 10000); // 10s
        return () => clearTimeout(id);
    }, [isLoading]);

    const activities: Activity[] = useMemo(
        () => rawActivities.map(normalizeActivity),
        [rawActivities]
    );

    return (
        <>
            <Head><title>Actividades | BOA</title></Head>

            {isLoading && !stuck ? (
                <section>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="animate-pulse text-emerald-600">
                            <Heart className="h-12 w-12" />
                        </div>
                    </div>
                </section>
            ) : stuck && isLoading ? (
                <section className="min-h-screen grid place-items-center">
                    <div className="text-center space-y-3">
                        <p className="text-neutral-700">Tardó demasiado en cargar. Podés reintentar.</p>
                        <button
                            onClick={() => { setStuck(false); router.reload(); }}
                            className="px-4 py-2 rounded-lg ring-1 ring-emerald-300 hover:bg-emerald-50"
                        >
                            Reintentar
                        </button>
                    </div>
                </section>
            ) : (
                <section>
                    {/* Hero */}
                    <section
                        className="relative min-h-[80vh] sm:min-h-[100vh] pt-28 pb-16 font-sans overflow-hidden grid place-items-center"
                        onMouseMove={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            const r = el.getBoundingClientRect();
                            el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                            el.style.setProperty("--my", `${e.clientY - r.top}px`);
                        }}
                    >
                        <div className="absolute inset-0 -z-10">
                            <motion.div
                                className="absolute inset-0 hidden sm:block"
                                initial={{ scale: 1.06, y: 8, opacity: 0.98 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                style={{
                                    backgroundImage: `url('${mediaUrl(
                                        "hero-activities/activities-bg.webp"
                                    )}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    filter: "saturate(0.96) brightness(1) contrast(1.04)",
                                }}
                            />
                            <motion.div
                                className="absolute inset-0 block sm:hidden"
                                initial={{ scale: 1.06, y: 8, opacity: 0.98 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                style={{
                                    backgroundImage: `url('${mediaUrl(
                                        "hero-activities/activities-bg-mobile.webp"
                                    )}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center 18%",
                                    backgroundRepeat: "no-repeat",
                                    filter: "saturate(0.96) brightness(1) contrast(1.04)",
                                }}
                            />


                            <div className="absolute inset-0 bg-[#FBF7EC]/60 mix-blend-multiply" />
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background:
                                        "radial-gradient(220px 160px at var(--mx,50%) var(--my,50%), rgba(30,122,102,.10), transparent 60%)",
                                }}
                            />
                            <div
                                aria-hidden
                                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                                style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                            />
                        </div>

                        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative isolate max-w-3xl mx-auto text-center">
                                <div className="relative z-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true, amount: 0.6 }}
                                        transition={{ type: "spring", stiffness: 110, damping: 14 }}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                     bg-boa-green/25 backdrop-blur-md ring-1 ring-boa-green/40 text-boa-green-foreground"
                                    >
                                        <Sparkles className="h-4 w-4 text-boa-green" />
                                        <span className="text-[12px] font-semibold tracking-wide text-boa-green">
                                            Cuerpo • Mente • Comunidad
                                        </span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 14, scale: 0.98, letterSpacing: "0.04em" }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1, letterSpacing: "0em" }}
                                        viewport={{ once: true, amount: 0.7 }}
                                        transition={{ type: "spring", stiffness: 120, damping: 16 }}
                                        className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900"
                                    >
                                        Actividades que te <span className="text-boa-green">hacen bien</span>
                                    </motion.h1>

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

                                    <motion.p
                                        initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
                                        className="mt-4 text-base sm:text-xl leading-relaxed relative z-20 text-neutral-800 max-w-[100%] mx-auto"
                                    >
                                        Movimiento, arte y bienestar en un mismo lugar. <br /> Descubrí tu próxima clase y reservá en segundos.
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* lista pública */}
                    <Activities activities={activities} />
                    <ActivitiesCalendar activities={activities} />
                </section>
            )}
        </>
    );
}
