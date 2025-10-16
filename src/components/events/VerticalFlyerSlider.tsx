// components/VerticalFlyerSlider.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import EventFlyerCard, { FlyerEvent } from "./EventFlyerCard";

type Props = {
    events: FlyerEvent[];
    maxSlides?: number; // tope superior, por defecto 3
    autoPlayMs?: number; // default 9000
};

export default function VerticalFlyerSlider({
    events,
    maxSlides = 3,
    autoPlayMs = 9000,
}: Props) {
    const slides = useMemo(() => {
        const now = Date.now();
        const featured = (events ?? []).filter((e) => e?.featured === true);
        if (featured.length === 0) return [];

        const toMs = (e: FlyerEvent) => new Date(e.date as any).getTime();
        const upcoming = featured
            .filter((e) => toMs(e) >= now)
            .sort((a, b) => toMs(a) - toMs(b));

        const pool = (upcoming.length ? upcoming : [...featured].sort((a, b) => toMs(a) - toMs(b))) as FlyerEvent[];

        const hasAsset = (e: FlyerEvent) => Boolean(e.flyerVertical || e.poster || e.image);
        const withAsset = pool.filter(hasAsset);
        const preferred = withAsset.length ? withAsset : pool;

        const limit = Math.min(maxSlides, 3);
        return preferred.slice(0, limit);
    }, [events, maxSlides]);

    const hasSlides = slides.length > 0;
    const len = hasSlides ? slides.length : 1; // evita /0
    const [index, setIndex] = useState(0);

    // Resetea índice al cambiar la cantidad
    useEffect(() => {
        setIndex(0);
    }, [len]);

    const next = () => setIndex((i) => (i + 1) % (hasSlides ? slides.length : 1));
    const prev = () => setIndex((i) => (i - 1 + (hasSlides ? slides.length : 1)) % (hasSlides ? slides.length : 1));

    // Autoplay solo si hay >1 slide
    useEffect(() => {
        if (!hasSlides || len <= 1) return;
        const id = setInterval(next, autoPlayMs);
        return () => clearInterval(id);
    }, [autoPlayMs, hasSlides, len]);

    const slideHeightPct = 100 / len;
    const shiftPct = (index * 100) / len;

    // 👉 recien acá podés cortar el render
    if (!hasSlides) return null;

    return (
        <div className="relative isolate w-full overflow-hidden rounded-[32px] h-[440px] sm:h-[560px]">
            <motion.div
                className="h-full will-change-transform"
                initial={false}
                animate={{ y: `-${shiftPct}%` }}
                transition={{ type: "tween", duration: 0.85, ease: "easeInOut" }}
                style={{ height: `${len * 100}%` }}
            >
                {slides.map((ev) => {
                    const overrideSrc = ev.flyerVertical || ev.poster || ev.image;
                    return (
                        <div key={ev.id} style={{ height: `${slideHeightPct}%` }}>
                            <EventFlyerCard ev={ev} fullHeight overrideSrc={overrideSrc} />
                        </div>
                    );
                })}
            </motion.div>

            {/* Flechas */}
            <div className="absolute inset-y-0 right-4 flex items-center">
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={prev}
                        aria-label="Anterior"
                        className="rounded-2xl bg-white/90 backdrop-blur-sm p-3 shadow-lg ring-1 ring-neutral-200 hover:bg-white transition"
                    >
                        <ChevronUp className="h-5 w-5 text-neutral-700" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Siguiente"
                        className="rounded-2xl bg-white/90 backdrop-blur-sm p-3 shadow-lg ring-1 ring-neutral-200 hover:bg-white transition"
                    >
                        <ChevronDown className="h-5 w-5 text-neutral-700" />
                    </button>
                </div>
            </div>

            {/* Dots */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {Array.from({ length: len }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`Ir al flyer ${i + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition ${i === index ? "bg-emerald-600" : "bg-neutral-300 hover:bg-neutral-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};