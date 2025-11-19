import { useInView, motion as m } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { useActivitiesLive } from "@/hooks/useActivitiesLive";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GiftCardBuyModal from "@/components/GiftCardBuyModal";
import { Card, CardContent } from "@/components/ui/card";
import { GiftCardCard } from "@/components/GiftCardCard";
import { mediaUrl } from "@/lib/mediaUrl";
import Link from "next/link";
import Image from "next/image";
import {
    Coffee,
    Heart,
    Calendar,
    Gift,
    ArrowRight,
    Users,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Leaf,
} from "lucide-react";

type ExpItem = {
    id?: string | number;
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    date?: string; // eventos
    time?: string; // eventos
    schedule?: { day?: string; time?: string }; // actividades
    capacity?: number;
    enrolled?: number;
    price?: number | string;
    _kind?: "activity" | "event";
};

function shuffleInPlace<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function pickRandom<T>(arr: T[], n: number) {
    if (!arr?.length) return [];
    const copy = arr.slice();
    shuffleInPlace(copy);
    return copy.slice(0, Math.min(n, copy.length));
}

type RevealVariant = "fadeUp" | "slideLeft" | "pop" | "tiltUp";

function RevealOnScroll({
    children,
    className = "",
    amount = 0.25,
    delay = 0,
    variant = "fadeUp",
}: {
    children: React.ReactNode;
    className?: string;
    amount?: number;
    delay?: number;
    variant?: RevealVariant;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, { amount, margin: "0px 0px -10% 0px" });
    const state = inView ? "visible" : "hidden";

    const variants: Record<RevealVariant, { hidden: any; visible: any }> = {
        fadeUp: { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } },
        slideLeft: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
        pop: { hidden: { opacity: 0, scale: 0.97 }, visible: { opacity: 1, scale: 1 } },
        tiltUp: { hidden: { opacity: 0, y: 18, rotateX: -6 }, visible: { opacity: 1, y: 0, rotateX: 0 } },
    };

    return (
        <section
            ref={ref}
            className={["relative isolate", className || ""].join(" ")}
            style={{ overflow: "hidden", contain: "paint", willChange: "transform" }}
        >
            <m.div
                initial="hidden"
                animate={state}
                variants={variants[variant]}
                transition={{ duration: 0.55, ease: "easeOut", delay }}
                className="relative z-10 will-change-transform"
                style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
                <div className="py-16 sm:py-18 md:py-20 lg:py-24">{children}</div>
            </m.div>
        </section>
    );
}

function HeroTitle() {
    const STEP = 0.08;
    const words = ["Donde", "lo", "rico", "y", "lo", "que", "hace", "bien", "se", "encuentran"];
    const breakIndex = 7; // después de "bien"

    const renderWord = (word: string, index: number, total: number) => {
        const isLast = index === total - 1;

        if (isLast) {
            // última palabra con subrayado
            return (
                <span
                    key={`${index}-${word}`}
                    className="inline-block align-baseline opacity-0 translate-y-[6px] mr-[0.18em]"
                    style={{
                        animation: "boaRise .7s ease-out forwards",
                        animationDelay: `${index * STEP}s`,
                    }}
                >
                    <span className="relative inline-block">
                        {word}
                        <svg
                            className="absolute left-1/2 -translate-x-1/2 w-full opacity-0 bottom-[-0.7rem]"
                            viewBox="0 0 100 7"
                            fill="none"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                            style={{
                                animation: "boaUnderline .6s ease-out forwards",
                                animationDelay: `${(index + 0.5) * STEP}s`,
                            }}
                        >
                            <defs>
                                <linearGradient id="boaBrush" x1="0" x2="1" y1="0" y2="0">
                                    <stop offset="0%" stopColor="hsl(var(--boa-green))" stopOpacity="0.55" />
                                    <stop offset="50%" stopColor="hsl(var(--boa-green))" stopOpacity="0.65" />
                                    <stop offset="100%" stopColor="hsl(var(--boa-green))" stopOpacity="0.55" />
                                </linearGradient>
                                <filter id="boaShadow" x="-10%" y="-300%" width="120%" height="700%">
                                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="black" floodOpacity="0.22" />
                                </filter>
                            </defs>
                            <path
                                d="M2 6 C26 2, 74 2, 98 6"
                                stroke="url(#boaBrush)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                filter="url(#boaShadow)"
                            />
                        </svg>
                    </span>
                </span>
            );
        }

        return (
            <span
                key={`${index}-${word}`}
                className="inline-block align-baseline opacity-0 translate-y-[6px] mr-[0.18em]"
                style={{
                    animation: "boaRise .7s ease-out forwards",
                    animationDelay: `${index * STEP}s`,
                }}
            >
                {word}
            </span>
        );
    };

    return (
        <h1
            className="boa-hero-title font-sans text-white drop-shadow-[0_10px_30px_rgba(0,0,0,.45)] text-[1.25rem] sm:text-2xl md:text-5xl font-extrabold tracking-normal md:tracking-tight leading-[1.15] sm:leading-[1.06] mx-auto text-center"
        >
            {/* Línea 1 */}
            <span className="block whitespace-nowrap">
                {words.slice(0, breakIndex + 1).map((w, i) => renderWord(w, i, words.length))}
            </span>
            {/* Línea 2 */}
            <span className="block whitespace-nowrap">
                {words.slice(breakIndex + 1).map((w, idx) => {
                    const index = breakIndex + 1 + idx;
                    return renderWord(w, index, words.length);
                })}
            </span>
        </h1>
    );
}


export default function HomePage() {
    const { events, menuItems, giftCards, loading: appLoading } = useApp();
    const { activities: liveActivities = [], loading: actsLoading } = useActivitiesLive();

    const experienceItems = useMemo(() => {
        const desired = 4;

        const t = (x: any) => x?.title ?? x?.name ?? x?.activityTitle ?? x?.eventTitle ?? "";
        const img = (x: any) => x?.image ?? x?.hero_image ?? x?.cover ?? x?.banner ?? x?.thumbnail ?? "";
        const sid = (x: any) => x?.id ?? x?._id ?? x?.slug ?? x?.uuid ?? Math.random().toString(36).slice(2);

        const actsRaw = Array.isArray(liveActivities) ? liveActivities : [];
        const evesRaw = Array.isArray(events) ? events : [];

        const acts = actsRaw
            .filter((a) => a && (t(a) || img(a)))
            .map((a) => ({ ...a, id: sid(a), title: t(a), image: img(a), _kind: "activity" as const }));

        const eves = evesRaw
            .filter((e) => e && (t(e) || img(e)))
            .map((e) => ({ ...e, id: sid(e), title: t(e), image: img(e), _kind: "event" as const }));

        const pickActs = pickRandom(acts, Math.min(2, acts.length));
        const pickEves = pickRandom(eves, Math.min(2, eves.length));

        const used = new Set<string>([
            ...pickActs.map((a) => `activity:${a.id}`),
            ...pickEves.map((e) => `event:${e.id}`),
        ]);
        const remainingActs = shuffleInPlace(acts.filter((a) => !used.has(`activity:${a.id}`)));
        const remainingEves = shuffleInPlace(eves.filter((e) => !used.has(`event:${e.id}`)));

        let pool: ExpItem[] = [...pickActs, ...pickEves];
        const takeNext = () => (remainingActs.length ? remainingActs.shift()! : remainingEves.shift()!);
        while (pool.length < desired && (remainingActs.length || remainingEves.length)) {
            pool.push(takeNext());
        }

        if (acts.length > 0 && !pool.some((i) => i._kind === "activity")) {
            pool = [acts[0], ...pool.filter((i) => i._kind !== "activity")].slice(0, desired);
        }

        return shuffleInPlace(pool).slice(0, desired);
    }, [liveActivities, events]);

    useEffect(() => {
        console.groupCollapsed("%c[EXPERIENCES DIAG] HomePage", "color:#0b7; font-weight:bold;");
        console.debug("activities len:", Array.isArray(liveActivities) ? liveActivities.length : liveActivities);
        console.debug("events len:", Array.isArray(events) ? events.length : events);
        console.debug("experienceItems len:", experienceItems.length);
        console.debug("kinds:", experienceItems.map((i) => i?._kind));
        console.debug("titles:", experienceItems.map((i) => i?.title));
        console.groupEnd();
    }, [liveActivities, events, experienceItems]);

    const featuredMenu = menuItems.filter((item) => item.featured).slice(0, 3);
    const featuredGiftCards = giftCards.slice(0, 2);

    const cardItem = {
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
    };

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    return (
        <section className="overflow-x-hidden">
            {/* ======= HERO — BOA ======= */}
            <section className="relative isolate min-h-[95vh] flex items-end overflow-hidden">
                <Image
                    src={mediaUrl("hero/1920/hero-portada.jpg")}
                    alt="Espacio BOA - Hero"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                    quality={90}
                    className="object-cover"
                />
                <div className="absolute inset-0 z-0 mix-blend-multiply bg-neutral-500/25" />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/25 via-black/20 to-transparent" />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-boa-cocoa/35 via-boa-cocoa/10 to-transparent" />
                <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_-80px_120px_rgba(0,0,0,0.18)]" />

                {/* Ornamentos */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -bottom-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-boa-green/12 blur-3xl" />
                    <div className="absolute -top-24 right-[-60px] w-[24rem] h-[24rem] rounded-full bg-boa-terra/14 blur-3xl" />
                </div>

                {/* Contenido */}
                <div className="relative z-10 container mx-auto px-5 pb-14 sm:pb-16">
                    <motion.div className="max-w-5xl mx-auto text-center">
                        <HeroTitle />

                        {/* Pill animada — mejor legibilidad mobile, wrap elegante */}
                        <div className="mt-4 flex justify-center">
                            <div
                                className="boa-pill flex flex-wrap lg:flex-nowrap items-center justify-center gap-1.5 lg:gap-2.5 rounded-full bg-white/18 border border-white/30 px-3 py-1.5 sm:px-3.5 sm:py-2 backdrop-blur-sm w-auto max-w-[22rem] lg:max-w-none lg:mt-2 text-white/95 text-[0.625rem] sm:text-[0.75rem] md:text-xs lg:text-sm drop-shadow-[0_6px_18px_rgba(0,0,0,.35)]"
                            >

                                <Coffee className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="uppercase tracking-[0.16em]">café</span>
                                <span className="opacity-60">·</span>
                                <Leaf className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="uppercase tracking-[0.16em]">bienestar</span>
                                <span className="opacity-60">·</span>
                                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="uppercase tracking-[0.16em]">arte</span>
                                <span className="opacity-60">·</span>
                                <span className="inline-flex items-center gap-1">
                                    <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span className="uppercase tracking-[0.16em]">movimiento</span>
                                </span>

                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/activities" className="w-full max-w-xs sm:max-w-none sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-[80%] sm:w-auto rounded-xl2 bg-boa-green text-white hover:bg-boa-green/90 shadow-[0_10px_28px_rgba(30,122,102,.35)] px-8"
                                >
                                    <Heart className="mr-2 h-5 w-5" />
                                    Actividades
                                </Button>
                            </Link>
                            <Link href="/menu" className="w-full max-w-xs sm:max-w-none sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-[80%] sm:w-auto rounded-xl2 bg-white/20 text-white border-white/40 hover:bg-white/30 px-8"
                                >
                                    <Coffee className="mr-2 h-5 w-5" />
                                    Gastronomía
                                </Button>
                            </Link>
                        </div>

                    </motion.div>

                    {/* Vapor */}
                    <div aria-hidden className="absolute bottom-20 left-1/3 w-24 h-24 rounded-full bg-white/8 blur-2xl animate-[float_6s_ease-in-out_infinite]" />
                    <div aria-hidden className="absolute bottom-24 left-1/2 w-20 h-20 rounded-full bg-white/7 blur-2xl animate-[float_7s_ease-in-out_infinite]" />
                </div>

                {/* Animaciones locales */}
                <style jsx>{`
          @keyframes boaRise {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes boaUnderline {
            from {
              opacity: 0;
              transform: translate(-50%, 6px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
          .boa-pill {
            position: relative;
            overflow: hidden;
            animation: boaPulse 3.4s ease-in-out infinite;
          }
          .boa-pill::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
            transform: translateX(-120%);
            animation: boaShimmer 4.2s ease-in-out infinite;
          }
          @keyframes boaShimmer {
            0% {
              transform: translateX(-120%);
            }
            60%,
            100% {
              transform: translateX(120%);
            }
          }
          @keyframes boaPulse {
            0%,
            100% {
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.18);
            }
            50% {
              box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.08);
            }
          }

  /* --- Ajustes de pill para mobile chico --- */
  @media (max-width: 389px) {
    .boa-pill {
      flex-wrap: nowrap;   
      max-width: none;    
      font-size: 0.55rem;    
      gap: 0.25rem;           
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }

    .boa-pill svg {
      width: 0.65rem;
      height: 0.65rem;       
    }
  }
        `}</style>
            </section>

            {/* ===================== DEPARTAMENTOS — BOA ===================== */}
            <section className="relative">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-50/50 via-amber-50/40 to-white" />
                <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

                <RevealOnScroll variant="tiltUp" amount={0.22} className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-boa-ink">
                            Nuestros <span className="text-boa-green">Departamentos</span>
                        </h2>
                        <p className="mt-3 font-sans text-base sm:text-lg text-boa-ink/70 max-w-2xl mx-auto">
                            Elegí por dónde entrar a BOA: Actividades, Gastronomía o Espacios.
                        </p>
                    </div>

                    {/* MOBILE: slider */}
                    <div className="md:hidden -mx-4 px-4">
                        <div
                            role="region"
                            aria-roledescription="carousel"
                            aria-label="Departamentos BOA"
                            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1"
                        >
                            {/* ACTIVIDADES */}
                            <Link href="/activities" aria-label="Explorar Actividades" className="snap-center shrink-0 w-[86%]">
                                <div className="group relative block h-[350px] rounded-[32px] overflow-hidden transition-all duration-500 p-[2px] [background:linear-gradient(135deg,rgba(30,122,102,.18),rgba(213,149,121,.18))] hover:[background:linear-gradient(135deg,rgba(30,122,102,.32),rgba(213,149,121,.28))]">
                                    <div className="h-full w-full rounded-[30px] overflow-hidden ring-1 ring-boa-ink/5 bg-black shadow-[0_12px_28px_rgba(2,6,23,.10)] hover:shadow-[0_18px_40px_rgba(2,6,23,.15)] transition-shadow duration-500">
                                        <Image
                                            src={mediaUrl("1200/img-5242.webp")}
                                            alt="Movimiento y bienestar en un espacio luminoso con plantas"
                                            fill
                                            sizes="(min-width:768px) 1200px, 800px"
                                            quality={90}
                                            className="object-cover object-[50%50%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                                        />
                                        <div className="absolute inset-0 z-0 bg-white/6" />
                                        <span className="pointer-events-none absolute inset-4 rounded-[24px] ring-1 ring-white/15" />
                                        <Card className="relative h-full bg-transparent border-0 text-white">
                                            <CardContent className="p-7 h-full flex flex-col justify-end">
                                                <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/75 text-boa-green px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                                    <Heart className="h-3.5 w-3.5" />
                                                    BOA Actividades
                                                </div>
                                                <h3 className="font-sans text-3xl sm:text-[32px] font-extrabold leading-tight drop-shadow-sm">
                                                    Movimiento & Bienestar
                                                </h3>
                                                <p className="mt-2 font-sans text-sm/relaxed sm:text-base text-white/90">
                                                    Yoga, arte, respiración, talleres creativos.
                                                </p>
                                                <div className="mt-5">
                                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 font-sans text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all hover:bg-white/25 hover:border-white/60">
                                                        Explorar <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </Link>

                            {/* GASTRONOMÍA */}
                            <Link href="/menu" aria-label="Ver Gastronomía" className="snap-center shrink-0 w-[86%]">
                                <div className="group relative block h-[350px] rounded-[32px] overflow-hidden transition-all duration-500 p-[2px] [background:linear-gradient(135deg,rgba(30,122,102,.18),rgba(213,149,121,.18))] hover:[background:linear-gradient(135deg,rgba(30,122,102,.32),rgba(213,149,121,.28))]">
                                    <div className="h-full w-full rounded-[30px] overflow-hidden ring-1 ring-boa-ink/5 bg-black shadow-[0_12px_28px_rgba(2,6,23,.10)] hover:shadow-[0_18px_40px_rgba(2,6,23,.15)] transition-shadow duration-500">
                                        <Image
                                            src={mediaUrl("images-verticales/2000/IMG_5484.webp")}
                                            alt="Movimiento y bienestar…"
                                            fill
                                            quality={90}
                                            sizes="(min-width:768px) 1200px, 90vw"
                                            className="object-cover object-[42%_35%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                                        />
                                        <div className="absolute inset-0 z-0 bg-gradient-to-b from-boa-green/15 via-boa-ink/35 to-boa-ink/60" />
                                        <div className="absolute inset-0 z-0 bg-white/6" />
                                        <span className="pointer-events-none absolute inset-4 rounded-[24px] ring-1 ring-white/15" />
                                        <Card className="relative h-full bg-transparent border-0 text-white">
                                            <CardContent className="p-7 h-full flex flex-col justify-end">
                                                <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/75 text-boa-green px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                                    <Coffee className="h-3.5 w-3.5" />
                                                    BOA Gastronomía
                                                </div>
                                                <h3 className="font-sans text-3xl sm:text-[32px] font-extrabold leading-tight drop-shadow-sm">
                                                    Café & Cocina Consciente
                                                </h3>
                                                <p className="mt-2 font-sans text-sm/relaxed sm:text-base text-white/90">
                                                    Especialidad y opciones que abrazan.
                                                </p>
                                                <div className="mt-5">
                                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 font-sans text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all hover:bg-white/25 hover:border-white/60">
                                                        Ver menú <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </Link>

                            {/* ESPACIOS */}
                            <Link href="/spaces" aria-label="Conocer Espacios" className="snap-center shrink-0 w-[86%]">
                                <div className="group relative block h-[350px] rounded-[32px] overflow-hidden transition-all duration-500 p-[2px]">
                                    <div className="h-full w-full rounded-[30px] overflow-hidden ring-1 ring-boa-ink/5 bg-black shadow-[0_12px_28px_rgba(2,6,23,.10)] hover:shadow-[0_18px_40px_rgba(2,6,23,.15)] transition-shadow duration-500">
                                        <Image
                                            src={mediaUrl("1200/img-5210.webp")}
                                            alt="Movimiento y bienestar en un espacio luminoso con plantas"
                                            fill
                                            sizes="(min-width:768px) 1200px, 800px"
                                            quality={90}
                                            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                                        />
                                        <span className="pointer-events-none absolute inset-4 rounded-[24px] ring-1 ring-white/15" />
                                        <Card className="relative h-full bg-transparent border-0 text-white">
                                            <CardContent className="p-7 h-full flex flex-col justify-end">
                                                <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/75 text-boa-green px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                                    <Leaf className="h-3.5 w-3.5" />
                                                    BOA Espacios
                                                </div>
                                                <h3 className="font-sans text-3xl sm:text-[32px] font-extrabold leading-tight drop-shadow-sm">
                                                    Lugares que abrazan
                                                </h3>
                                                <p className="mt-2 font-sans text-sm/relaxed sm:text-base text-white/90">
                                                    Verde, luz y texturas para inspirar y conectar.
                                                </p>
                                                <div className="mt-5">
                                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 font-sans text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all hover:bg-white/25 hover:border-white/60">
                                                        Conocer <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* DESKTOP: grid */}
                    <div className="hidden lg:grid grid-cols-3 gap-8">
                        {/* ACTIVIDADES */}
                        <motion.div variants={cardItem} className="relative w-full">
                            <Link
                                href="/activities"
                                aria-label="Explorar Actividades"
                                className="group relative block w-full h-[380px] rounded-[32px] overflow-hidden transition-all duration-500 p-[2px] [background:linear-gradient(135deg,rgba(30,122,102,.18),rgba(213,149,121,.18))] hover:[background:linear-gradient(135deg,rgba(30,122,102,.32),rgba(213,149,121,.28))]"
                            >
                                <div className="h-full w-full rounded-[30px] overflow-hidden ring-1 ring-boa-ink/5 bg-black shadow-[0_12px_28px_rgba(2,6,23,.10)] hover:shadow-[0_18px_40px_rgba(2,6,23,.15)] transition-shadow duration-500">
                                    <Image
                                        src={mediaUrl("1200/img-5242.webp")}
                                        alt="Movimiento y bienestar en un espacio luminoso con plantas"
                                        fill
                                        quality={90}
                                        sizes="(min-width:1024px) 33vw, 100vw"
                                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                                        priority
                                    />
                                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-boa-ink/55 via-boa-ink/20 to-transparent" />
                                    <span className="pointer-events-none absolute inset-4 rounded-[24px] ring-1 ring-white/15" />
                                    <Card className="relative h-full bg-transparent border-0 text-white">
                                        <CardContent className="p-6 h-full flex flex-col justify-end">
                                            <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/75 text-boa-green px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                                <Heart className="h-3.5 w-3.5" />
                                                BOA Actividades
                                            </div>
                                            <h3 className="font-sans text-2xl xl:text-[28px] font-extrabold leading-tight drop-shadow-sm">
                                                Movimiento & Bienestar
                                            </h3>
                                            <p className="mt-1 font-sans text-sm text-white/90">Yoga, arte, respiración, talleres creativos.</p>
                                            <div className="mt-4">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3.5 py-1.5 font-sans text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all hover:bg-white/25 hover:border-white/60">
                                                    Explorar <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Link>
                        </motion.div>

                        {/* GASTRONOMÍA */}
                        <motion.div variants={cardItem} className="relative w-full">
                            <Link
                                href="/menu"
                                aria-label="Ver Gastronomía"
                                className="group relative block w-full h-[380px] rounded-[32px] overflow-hidden transition-all duration-500 p-[2px] [background:linear-gradient(135deg,rgba(30,122,102,.18),rgba(213,149,121,.18))] hover:[background:linear-gradient(135deg,rgba(30,122,102,.32),rgba(213,149,121,.28))]"
                            >
                                <div className="h-full w-full rounded-[30px] overflow-hidden ring-1 ring-boa-ink/5 bg-black shadow-[0_12px_28px_rgba(2,6,23,.10)] hover:shadow-[0_18px_40px_rgba(2,6,23,.15)] transition-shadow duration-500">
                                    <Image
                                        src={mediaUrl("images-verticales/2000/IMG_5484.webp")}
                                        alt="Café y cocina consciente con opciones de especialidad"
                                        fill
                                        quality={90}
                                        sizes="(min-width:1024px) 33vw, 100vw"
                                        className="object-cover  object-[42%_35%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-boa-green/15 via-boa-ink/30 to-boa-ink/60" />
                                    <span className="pointer-events-none absolute inset-4 rounded-[24px] ring-1 ring-white/15" />
                                    <Card className="relative h-full bg-transparent border-0 text-white">
                                        <CardContent className="p-6 h-full flex flex-col justify-end">
                                            <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/75 text-boa-green px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                                <Coffee className="h-3.5 w-3.5" />
                                                BOA Gastronomía
                                            </div>
                                            <h3 className="font-sans text-2xl xl:text-[28px] font-extrabold leading-tight drop-shadow-sm">
                                                Café & Cocina Consciente
                                            </h3>
                                            <p className="mt-1 font-sans text-sm text-white/90">Especialidad y opciones que abrazan.</p>
                                            <div className="mt-4">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3.5 py-1.5 font-sans text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all hover:bg-white/25 hover:border-white/60">
                                                    Ver menú <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Link>
                        </motion.div>

                        {/* ESPACIOS */}
                        <motion.div variants={cardItem} className="relative w-full">
                            <Link
                                href="/spaces"
                                aria-label="Conocer Espacios"
                                className="group relative block w-full h-[380px] rounded-[32px] overflow-hidden transition-all duration-500 p-[2px] [background:linear-gradient(135deg,rgba(30,122,102,.18),rgba(213,149,121,.18))] hover:[background:linear-gradient(135deg,rgba(30,122,102,.32),rgba(213,149,121,.28))]"
                            >
                                <div className="h-full w-full rounded-[30px] overflow-hidden ring-1 ring-boa-ink/5 bg-black shadow-[0_12px_28px_rgba(2,6,23,.10)] hover:shadow-[0_18px_40px_rgba(2,6,23,.15)] transition-shadow duration-500">
                                    <Image
                                        src={mediaUrl("1200/img-5210.webp")}
                                        alt="Interior cálido con madera, plantas y luz de tarde"
                                        fill
                                        quality={90}
                                        sizes="(min-width:1024px) 33vw, 100vw"
                                        className="object-cover object-[42%_35%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                                    />
                                    <span className="pointer-events-none absolute inset-4 rounded-[24px] ring-1 ring-white/15" />
                                    <Card className="relative h-full bg-transparent border-0 text-white">
                                        <CardContent className="p-6 h-full flex flex-col justify-end">
                                            <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/75 text-boa-green px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                                <Leaf className="h-3.5 w-3.5" />
                                                BOA Espacios
                                            </div>
                                            <h3 className="font-sans text-2xl xl:text-[28px] font-extrabold leading-tight drop-shadow-sm">
                                                Lugares que abrazan
                                            </h3>
                                            <p className="mt-1 font-sans text-sm text-white/90">
                                                Verde, luz y texturas para inspirar y conectar.
                                            </p>
                                            <div className="mt-4">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3.5 py-1.5 font-sans text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all hover:bg-white/25 hover:border-white/60">
                                                    Conocer <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </RevealOnScroll>
            </section>

            {/* ===================== SLIDER EXPERIENCIAS — BOA ===================== */}
            <section className="relative font-sans">
                <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,#FEFCF7_0%,#FFFFFF_78%)]" />
                <div
                    className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><defs><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0.1'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.04'/></feComponentTransfer></filter></defs><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                        backgroundSize: "320px 320px",
                    }}
                />

                <RevealOnScroll variant="slideLeft" amount={0.25} className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-boa-ink">
                            Próximas <span className="text-boa-green">Experiencias</span>
                        </h2>
                        <p className="mt-3 text-base sm:text-lg text-boa-ink/75 max-w-2xl mx-auto">
                            Deslizá y descubrí las Actividades y los Eventos que se vienen en BOA.
                        </p>
                    </div>

                    {/* Si no hay datos aún, no bloquea el render: simplemente no se muestra el slider */}
                    <ExperiencesSlider items={experienceItems} />
                </RevealOnScroll>
            </section>

            {/* ===================== Gift Cards Section ===================== */}
            <section className="relative font-sans">
                <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,#FEFCF7_0%,#FFFFFF_85%)]" />
                <div
                    className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(30,122,102,.14) 1px, transparent 1px), radial-gradient(rgba(213,149,121,.10) 1px, transparent 1px)",
                        backgroundSize: "22px 22px, 28px 28px",
                        backgroundPosition: "0 0, 10px 8px",
                    }}
                    aria-hidden
                />
                <div className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-boa-green/10 blur-3xl" aria-hidden />
                <div className="pointer-events-none absolute -bottom-28 -right-24 w-[26rem] h-[26rem] rounded-full bg-boa-terra/12 blur-3xl" aria-hidden />

                <RevealOnScroll variant="pop" amount={0.25} className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="boa-heading font-sans text-4xl sm:text-5xl font-extrabold text-neutral-900">
                            Gift <span className="text-boa-green">Cards</span>
                        </h2>
                        <p className="mt-3 font-sans text-lg text-neutral-700 max-w-2xl mx-auto">
                            Regalos que abrazan: café, arte y comunidad en una tarjeta especial.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {(giftCards.slice(0, 3) || []).map((gc) => (
                            <motion.div
                                key={gc.id}
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                                className="relative group"
                            >
                                <GiftCardCard
                                    gc={gc}
                                    showBuyButton
                                    onBuy={() => {
                                        setSelected(gc);
                                        setOpen(true);
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="font-sans text-sm">
                            <span className="boa-fill-text">
                                “En BOA creemos que los mejores regalos son los que se comparten.”
                            </span>
                        </p>
                    </div>
                </RevealOnScroll>

                <style jsx>{`
          .boa-fill-text {
            background: linear-gradient(
              90deg,
              rgba(17, 24, 39, 0.6) 0%,
              rgba(17, 24, 39, 0.6) 40%,
              var(--boa-green-rgb, rgb(16, 185, 129)) 60%,
              var(--boa-green-rgb, rgb(16, 185, 129)) 100%
            );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-size: 200% 100%;
            animation: boa-fill 4.2s ease-in-out infinite alternate;
          }
          @keyframes boa-fill {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
        `}</style>
            </section>

            {selected && (
                <GiftCardBuyModal
                    open={open}
                    onClose={() => setOpen(false)}
                    gift={{ id: selected.id, name: selected.name, value: selected.value }}
                />
            )}

            {/* ===================== About BOA Preview - "BOA es comunidad" ===================== */}
            <section className="relative py-24 font-sans">
                <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,#FAF8F2_0%,#FFFFFF_85%)]" />

                <RevealOnScroll variant="fadeUp" amount={0.25} className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Texto */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="space-y-6 flex flex-col items-start text-left max-w-xl mx-0"
                        >
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
                                BOA es comunidad.
                                <br />
                                Es energía que se comparte.
                            </h2>

                            <p className="text-lg text-neutral-700 leading-relaxed">
                                Un lugar para encontrarnos, charlar, crear y disfrutar. Donde cada café, cada idea y cada sonrisa suman algo
                                único.
                            </p>

                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center lg:justify-start gap-2 rounded-full bg-emerald-700 text-white px-6 py-3 text-sm font-semibold shadow hover:bg-emerald-800 transition"
                            >
                                Conocer más
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </motion.div>

                        {/* Imagen */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-black/10">
                                <Image
                                    src="https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5183.webp"
                                    alt="Gente compartiendo en BOA"
                                    width={800}
                                    height={800}
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </RevealOnScroll>
            </section>
        </section>
    );
}

function ExperiencesSlider({ items }: { items: ExpItem[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = useState(0);
    const slideCount = items?.length ?? 0;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onScroll = () => {
            const w = el.clientWidth || 1;
            const i = Math.round(el.scrollLeft / w);
            setIndex(Math.max(0, Math.min(slideCount - 1, i)));
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [slideCount]);

    console.groupCollapsed("%c[EXPERIENCES DIAG] Slider props", "color:#07f; font-weight:bold;");
    console.debug("items length:", items?.length ?? 0, "kinds:", items?.map((i) => i?._kind));
    console.groupEnd();

    const pausedRef = useRef(false);
    useEffect(() => {
        if (!slideCount) return;
        const el = containerRef.current!;
        const id = setInterval(() => {
            if (pausedRef.current) return;
            const next = (index + 1) % slideCount;
            el.scrollTo({ left: el.clientWidth * next, behavior: "smooth" });
        }, 5500);
        return () => clearInterval(id);
    }, [index, slideCount]);

    const goto = (i: number) => {
        const el = containerRef.current;
        if (!el) return;
        const clamped = Math.max(0, Math.min(slideCount - 1, i));
        el.scrollTo({ left: el.clientWidth * clamped, behavior: "smooth" });
    };

    if (!slideCount) return null;

    return (
        <div
            className="relative"
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
            onFocusCapture={() => (pausedRef.current = true)}
            onBlurCapture={() => (pausedRef.current = false)}
        >
            {/* Viewport */}
            <div
                ref={containerRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="Slider de actividades y experiencias"
                tabIndex={0}
                className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth flex gap-6 [scrollbar-width:none] [-ms-overflow-style:none]"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {items.map((item, i) => {
                    const isEvent = item._kind === "event";
                    const title = item.title ?? "Experiencia BOA";
                    const desc = item.description ?? "";
                    const img =
                        item.image ||
                        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=90&w=2400";
                    const href = item.href ?? (isEvent ? "/events" : "/activities");
                    const day = isEvent && item.date ? new Date(item.date).toLocaleDateString("es-ES") : item?.schedule?.day;
                    const time = isEvent ? item.time : item?.schedule?.time;
                    const price = item?.price;
                    const cap = typeof item.capacity === "number" ? item.capacity : null;
                    const enr = typeof item.enrolled === "number" ? item.enrolled : null;
                    const tag = isEvent ? "Evento" : "Actividad";

                    return (
                        <article
                            key={`${item._kind ?? (isEvent ? "event" : "activity")}-${item.id ?? i}`}
                            aria-roledescription="slide"
                            aria-label={`${i + 1} de ${slideCount}`}
                            className="snap-center shrink-0 w-full"
                        >
                            <div className="relative h-[480px] md:h-[560px] lg:h-[550px] rounded-[30px] overflow-hidden ring-1 ring-boa-ink/10 shadow-[0_18px_48px_rgba(2,6,23,.12)]">
                                <Image src={img} alt={title} fill priority={i === 0} quality={90} sizes="100vw" className="object-cover" />
                                <div className="absolute inset-0 z-0 bg-[radial-gradient(120%_70%_at_50%_80%,rgba(0,0,0,.35)_0%,rgba(0,0,0,.08)_55%,transparent_80%)]" />
                                <div className="absolute inset-0 z-0 bg-gradient-to-t from-boa-ink/40 via-boa-ink/10 to-transparent" />
                                <div className="absolute inset-x-4 sm:inset-x-6 md:left-8 md:right-auto md:max-w-[560px] bottom-6 md:bottom-8">
                                    <div className="rounded-[22px] bg-boa-cream opacity-90 ring-1 ring-boa-ink/20 shadow-[0_14px_40px_rgba(2,6,23,.22)] overflow-hidden">
                                        <div className="px-6 py-4 flex items-center justify-between">
                                            <span className="text-[11px] uppercase tracking-[0.12em] text-boa-ink/80">{tag}</span>
                                            {(day || time) && (
                                                <span className="inline-flex items-center gap-2 text-[12.5px] text-boa-ink/85">
                                                    <Calendar className="h-4 w-4" />
                                                    {day}
                                                    {time ? ` • ${time}` : ""}
                                                </span>
                                            )}
                                        </div>
                                        <div className="px-6 pb-5">
                                            <h3 className="text-[26px] sm:text-[30px] font-extrabold text-boa-ink leading-tight">{title}</h3>
                                            {desc && (
                                                <p className="mt-2 text-boa-ink/90 text-[1rem] leading-relaxed">
                                                    {desc}
                                                </p>
                                            )}
                                            <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-boa-ink/85">
                                                {enr !== null && cap !== null && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        {enr}/{cap}
                                                    </span>
                                                )}
                                                {price && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-boa-ink ring-1 ring-boa-ink/15 font-semibold">
                                                        ${price}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-5">
                                                <Link href={href} className="inline-flex items-center gap-2 text-boa-green hover:text-boa-terra transition">
                                                    Ver detalles
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-5 text-[12px] text-white/90 bg-black/35 px-2.5 py-1 rounded-full ring-1 ring-white/25">
                                    {i + 1} / {slideCount}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Controles */}
            <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Anterior"
                        onClick={() => goto(index - 1)}
                        className="rounded-full p-2.5 ring-1 ring-boa-ink/15 bg-white hover:bg-boa-cream/90 text-boa-ink shadow-sm transition disabled:opacity-50"
                        disabled={index <= 0}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Siguiente"
                        onClick={() => goto(index + 1)}
                        className="rounded-full p-2.5 ring-1 ring-boa-ink/15 bg-white hover:bg-boa-cream/90 text-boa-ink shadow-sm transition disabled:opacity-50"
                        disabled={index >= slideCount - 1}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {Array.from({ length: slideCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Ir al slide ${i + 1}`}
                            onClick={() => goto(i)}
                            className={["h-2.5 rounded-full transition-all", i === index ? "w-6 bg-boa-green" : "w-2.5 bg-boa-ink/25 hover:bg-boa-ink/35"].join(" ")}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
