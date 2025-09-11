// components/VerticalFlyerSlider.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import EventFlyerCard, { FlyerEvent } from "./EventFlyerCard";

type Props = {
    events: FlyerEvent[];
    maxSlides?: number;
    autoPlayMs?: number;  // default 9000
};

export default function VerticalFlyerSlider({
    events,
    maxSlides = 4,
    autoPlayMs = 9000,
}: Props) {
    const slides = useMemo(() => {
        const now = new Date();
        const upcoming = [...events]
            .filter(e => new Date(e.date).getTime() >= now.getTime())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const pool = (upcoming.length ? upcoming : events) as FlyerEvent[];
        const ordered = [...pool].sort((a, b) => {
            const av = (a.flyerVertical || a.poster) ? 1 : 0;
            const bv = (b.flyerVertical || b.poster) ? 1 : 0;
            return bv - av;
        });

        return ordered.slice(0, Math.max(maxSlides, 3));
    }, [events, maxSlides]);

    const [index, setIndex] = useState(0);
    const len = slides.length || 1;

    const next = () => setIndex(i => (i + 1) % len);
    const prev = () => setIndex(i => (i - 1 + len) % len);

    useEffect(() => {
        const id = setInterval(next, autoPlayMs);
        return () => clearInterval(id);
    }, [autoPlayMs, len]);

    const slideHeightPct = 100 / len;
    const shiftPct = (index * 100) / len;

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
}
