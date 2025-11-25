"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import EventFlyerCard, { FlyerEvent } from "./EventFlyerCard";

type Props = {
    events: FlyerEvent[];
    maxSlides?: number;
};

function getDateValue(e: any): number | null {
    const raw =
        e?.date ??
        e?.start_at ??
        e?.startAt ??
        e?.start_date ??
        null;
    if (!raw) return null;
    const t = new Date(raw as any).getTime();
    return isNaN(t) ? null : t;
}

export default function VerticalFlyerSlider({
    events,
    maxSlides = 3,
}: Props) {
    const slides = useMemo(() => {
        const now = Date.now();
        const featured = (events ?? []).filter((e) => {
            const v = (e as any)?.featured;
            return v === true || v === 1 || v === "t" || v === "true";
        });

        if (featured.length === 0) return [];

        const withDate = featured
            .map((e) => ({ e, ts: getDateValue(e) }))
            .filter((x) => x.ts !== null) as { e: FlyerEvent; ts: number }[];

        const noDate = featured.filter((e) => getDateValue(e) === null);

        const upcoming = withDate
            .filter((x) => (x.ts as number) >= now)
            .sort((a, b) => (a.ts as number) - (b.ts as number))
            .map((x) => x.e);

        const past = withDate
            .filter((x) => (x.ts as number) < now)
            .sort((a, b) => (b.ts as number) - (a.ts as number))
            .map((x) => x.e);

        const hasAsset = (ev: FlyerEvent) =>
            Boolean((ev as any).flyerVertical || (ev as any).poster || (ev as any).image);

        const preferAssets = (arr: FlyerEvent[]) => {
            const withAsset = arr.filter(hasAsset);
            const withoutAsset = arr.filter((ev) => !hasAsset(ev));
            return [...withAsset, ...withoutAsset];
        };

        const ordered = [
            ...preferAssets(upcoming),
            ...preferAssets(past),
            ...preferAssets(noDate),
        ];

        return ordered.slice(0, maxSlides);
    }, [events, maxSlides]);

    const hasSlides = slides.length > 0;
    const len = hasSlides ? slides.length : 1;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);
    }, [len]);

    const next = () => setIndex((i) => (i + 1) % (hasSlides ? slides.length : 1));
    const prev = () =>
        setIndex((i) => (i - 1 + (hasSlides ? slides.length : 1)) % (hasSlides ? slides.length : 1));

    const slideHeightPct = 100 / len;
    const shiftPct = (index * 100) / len;

    if (!hasSlides) return null;

    return (
        <div className="relative isolate w-full overflow-hidden rounded-[32px] h-[440px] sm:h-[560px]">
            <motion.div
                className="h-full will-change-transform"
                initial={false}
                animate={{ y: `-${shiftPct}%` }}
                transition={{ type: "tween", duration: 0.45, ease: "easeOut" }}
                style={{ height: `${len * 100}%` }}
            >
                {slides.map((ev) => {
                    const overrideSrc =
                        (ev as any).flyerVertical ||
                        (ev as any).poster ||
                        (ev as any).image;
                    return (
                        <div key={(ev as any).id} style={{ height: `${slideHeightPct}%` }}>
                            <EventFlyerCard ev={ev} fullHeight overrideSrc={overrideSrc} />
                        </div>
                    );
                })}
            </motion.div>

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

            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {Array.from({ length: len }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`Ir al flyer ${i + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition ${i === index
                                ? "bg-emerald-600"
                                : "bg-neutral-300 hover:bg-neutral-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
