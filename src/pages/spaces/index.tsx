// src/pages/spaces/index.tsx
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { mediaUrl } from "@/lib/mediaUrl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    Users,
    Sparkles,
    Leaf,
    Coffee,
    LayoutGrid,
    Clock,
    HeartHandshake,
    Paintbrush,
    Moon,
    SquareLibrary,
    Vegan
} from "lucide-react";

/* ----------------------------- Helpers IMG ----------------------------- */
const img = (size: 400 | 800 | 1200, file: string) => {
    if (/^https?:\/\//.test(file)) {
        return file.replace(/\/(400|800|1200)\//, `/${size}/`);
    }
    return mediaUrl(`${size}/${file}`);
};

/* --------------------------------- Types -------------------------------- */
// Todo opcional para poder omitir campos por espacio
type SpaceItem = {
    id?: string;
    name?: string;
    description?: string;
    capacity?: number;
    features?: string[];
    atmosphere?: string;
    bestFor?: string[];
    images?: string[];
    tag?: string;
    icon?:
    | typeof Coffee
    | typeof Paintbrush
    | typeof Moon
    | typeof Leaf
    | typeof LayoutGrid
    | typeof Sparkles
    | typeof HeartHandshake;
};

/* ======= LQIP / Base64 helpers (scope de módulo) ======= */
const toBase64 = (str: string) => {
    if (typeof window === "undefined") {
        // SSR (Node)
        return Buffer.from(str).toString("base64");
    }
    // Browser
    return window.btoa(unescape(encodeURIComponent(str)));
};

const shimmer = (w: number, h: number) => {
    const svg = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f3f4f6" offset="20%"/>
          <stop stop-color="#e5e7eb" offset="50%"/>
          <stop stop-color="#f3f4f6" offset="70%"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f3f4f6"/>
      <rect id="r" width="${w}" height="${h}" fill="url(#g)"/>
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"/>
    </svg>`;
    return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

// placeholder chico, súper liviano para <Image placeholder="blur" />
const blurPlaceholder = shimmer(32, 20);


/* --------------------------- Slider Reusable UI ------------------------- */
type SliderProps = {
    images?: string[];
    alt?: string;
    sizes?: string;
    /** Debe coincidir con sharedHeight para empatar alturas con el Card */
    aspectClass?: string;
};

function CinematicSlider({
    images,
    alt = "Espacio BOA",
    sizes = "(min-width:1024px) 50vw, 100vw",
    // Alturas más generosas: sincronizar con sharedHeight en la página
    aspectClass = "h-[74vw] sm:h-[60vw] lg:h-[clamp(520px,64vh,620px)] xl:h-[clamp(540px,66vh,640px)] 2xl:h-[clamp(500px,60vh,600px)]",
}: SliderProps) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const startX = useRef<number | null>(null);
    const tX = useRef<number>(0);

    const valid = Array.isArray(images) ? images.filter(Boolean) : [];
    const total = valid.length;
    const next = () => setIndex((i) => (i + 1) % total);
    const prev = () => setIndex((i) => (i - 1 + total) % total);

    useEffect(() => {
        if (total <= 1 || paused) return;
        let raf = 0, t0 = 0;
        const loop = (t: number) => {
            if (!t0) t0 = t;
            if (t - t0 > 5200) {
                next();
                t0 = t;
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [paused, total]);

    useEffect(() => {
        const onVis = () => setPaused(document.hidden);
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    const onPointerDown = (e: React.PointerEvent) => {
        startX.current = e.clientX;
    };
    const onPointerUp = (e: React.PointerEvent) => {
        if (startX.current == null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    };
    const onTouchStart = (e: React.TouchEvent) => (tX.current = e.changedTouches[0].clientX);
    const onTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - tX.current;
        if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    };

    if (total === 0) {
        return (
            <div className={`relative ${aspectClass} rounded-[2rem] overflow-hidden grid place-items-center bg-neutral-100`}>
                <div className="text-neutral-500 text-sm">Sin imágenes disponibles</div>
            </div>
        );
    }

    return (
        <div
            className={`relative ${aspectClass} select-none`}
            role="region"
            aria-roledescription="Carrusel de imágenes"
            aria-label={alt}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Marco cálido con glass suave y bordes orgánicos */}
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_24px_60px_-25px_rgba(0,0,0,.45)] bg-gradient-to-br from-amber-50/80 via-emerald-50/70 to-white/70 backdrop-blur-[2px]">
                {/* Grain/vibra hippie sutil */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply bg-[radial-gradient(30rem_20rem_at_10%_-10%,#fde68a,transparent_60%),radial-gradient(28rem_22rem_at_110%_110%,#a7f3d0,transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(120deg,rgba(0,0,0,.5)_0,rgba(0,0,0,.5)_1px,transparent_1px,transparent_3px)]" />

                {/* Slides */}
                <div className="absolute inset-0">
                    {valid.map((file, i) => {
                        const active = i === index;
                        return (
                            <div
                                key={`${file}-${i}`}
                                className={`absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] ${active ? "opacity-100" : "opacity-0"}`}
                                aria-hidden={!active}
                            >
                                {/* Fondo cover con blur para rellenar */}
                                <Image
                                    src={img(1200, file)}
                                    alt=""
                                    fill
                                    sizes={sizes}
                                    quality={60}
                                    className="object-cover blur-md scale-110 opacity-80"
                                    aria-hidden
                                />

                                {/* Imagen principal: ahora COVER (más grande, más protagonista) */}
                                <div className="absolute inset-0 p-2 sm:p-3 lg:p-4">
                                    <div className="relative w-full h-full rounded-[1.4rem] overflow-hidden">
                                        <Image
                                            src={img(1200, file)}
                                            alt={alt}
                                            fill
                                            sizes={sizes}
                                            quality={90}
                                            priority={i === 0}
                                            className="object-cover"
                                        />
                                        {/* Vignette suave para dar contraste al contenido superpuesto */}
                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.18),transparent_22%,transparent_78%,rgba(0,0,0,.14))]" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controles (desktop) */}
                {total > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Imagen anterior"
                            className="hidden lg:grid place-items-center absolute left-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/95 hover:bg-white text-neutral-900 text-[22px] shadow-md backdrop-blur transition active:scale-95"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Imagen siguiente"
                            className="hidden lg:grid place-items-center absolute right-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/95 hover:bg-white text-neutral-900 text-[22px] shadow-md backdrop-blur transition active:scale-95"
                        >
                            ›
                        </button>

                    </>
                )}

                {/* Miniaturas y dots dentro del slider (mobile/desktop) */}
                {total > 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 sm:bottom-4">
                        <div className="flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-md p-2">
                            {valid.map((file, i) => {
                                const active = i === index;
                                return (
                                    <button
                                        key={`thumb-${i}`}
                                        onClick={() => setIndex(i)}
                                        aria-label={`Imagen ${i + 1}`}
                                        className={`relative h-10 w-14 sm:h-12 sm:w-16 rounded-lg overflow-hidden border transition-all duration-300 ${active ? "border-emerald-400 ring-2 ring-emerald-300" : "border-white/60 hover:border-white"}`}
                                    >
                                        <Image src={img(400, file)} alt="" fill sizes="100px" className="object-cover" />
                                    </button>
                                );
                            })}
                        </div>
                        {/* Dots (solo mobile) */}
                        <div className="mt-2 flex justify-center gap-1.5 lg:hidden">
                            {valid.map((_, i) => (
                                <span
                                    key={`dot-${i}`}
                                    className={`h-1.5 w-4 rounded-full transition-all ${i === index ? "bg-emerald-400 w-6" : "bg-white/70"}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


/* ------------------------------ Page Component --------------------------- */
export default function SpacesPage() {
    const [activeSpace, setActiveSpace] = useState(0);

    const spaces: Readonly<SpaceItem[]> = [
        {
            id: "cafeteria-panaderia",
            name: "Caféteria/Panadería",
            description:
                "Nuestro café con barra y vitrina. Ideal para encuentros casuales y breaks de eventos.",
            capacity: 45,
            features: ["WiFi", "Enchufes", "Música ambiente", "Vitrina de panadería"],
            atmosphere: "Cálido y social",
            bestFor: ["Trabajo remoto", "Reuniones informales", "Breaks", "Lectura"],
            images: [
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5450.webp",
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5457.webp",
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5420.webp",
            ],
            tag: "Espacio principal",
            icon: Coffee,
        },
        {
            id: "biblioteca-libreria",
            name: "Biblioteca/Librería",
            description:
                "Rincón de lectura y selección de títulos wellness. Ideal para concentrarse y curiosear.",
            capacity: 12,
            features: ["Estanterías", "Sillas cómodas", "Luz regulable", "Silencioso"],
            atmosphere: "Sereno y contemplativo",
            bestFor: ["Lectura", "Estudio", "Encuentros tranquilos", "Curaduría"],
            images: ["https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5300.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5320.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5302.webp"],
            tag: "Silencio",
            icon: SquareLibrary,
        },
        {
            id: "habitacion-holistica",
            name: "Habitación Holística",
            description:
                "Espacio íntimo para terapias y sesiones 1:1, con aromas suaves y texturas cálidas.",
            capacity: 4,
            features: ["Camilla/sillones", "Aromaterapia", "Iluminación cálida", "Privacidad"],
            atmosphere: "Íntimo y armónico",
            bestFor: ["Terapias 1:1", "Masajes", "Reiki", "Meditación guiada"],
            images: [
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5400.webp",
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5407.webp",
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5395.webp",
            ],
            tag: "Intimidad",
            icon: HeartHandshake,
        },
        {
            id: "living",
            name: "Living",
            description:
                "Similar a la holística clásica, con más cuadros y espíritu creativo — ideal para terapias y procesos expresivos.",
            capacity: 4,
            features: ["Camilla/sillones", "Aromaterapia", "Luz cálida", "Decoración artística"],
            atmosphere: "Creativo y sereno",
            bestFor: ["Terapias 1:1", "Arteterapia", "Reiki", "Meditación guiada"],
            images: ["https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5284.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5290.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5287.webp"],
            tag: "Atmósfera artística",
            icon: Paintbrush,
        },
        {
            id: "almacen-atural",
            name: "Almacén Natural",
            description:
                "Sala íntima con piano, luz cálida y estantería con productos: aceites escenciales, granola casera y más.",
            capacity: 4,
            features: ["Piano", "Iluminación cálida", "Productos wellness", "Asientos cómodos"],
            atmosphere: "Acogedor y musical",
            bestFor: ["Sesiones 1:1", "Ensayos suaves", "Charlas íntimas", "Descanso"],
            images: ["https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5327.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5347.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5365.webp"],
            tag: "Rincón musical",
            icon: Vegan,
        },
        {
            id: "patio",
            name: "Patio",
            description:
                "Área exterior con verde, mesitas y sombra. Perfecto para respirar, tomar sol suave y eventos al aire libre.",
            capacity: 20,
            features: ["Plantas y canteros", "Sombra natural", "Mobiliario exterior", "Iluminación tenue"],
            atmosphere: "Natural y aireado",
            bestFor: ["Círculos pequeños", "Lectura", "Café al sol", "Micro-eventos"],
            images: ["https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5195.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5202.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5210.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5185.webp"],
            tag: "Exterior",
            icon: Leaf,
        },
        {
            id: "salon-multiespacio",
            name: "Salón Multiespacio",
            description:
                "Ambiente flexible para workshops, charlas y micro-eventos. Montaje adaptable.",
            capacity: 35,
            features: ["Proyector/sonido", "Sillas y mesas", "Cortinas", "Piso madera"],
            atmosphere: "Versátil y luminoso",
            bestFor: ["Workshops", "Charlas", "Talleres creativos", "Meetups"],
            images: ["https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5259.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5271.webp", "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5268.webp"],
            tag: "Versatilidad",
            icon: Leaf,
        },
        {
            id: "sala-meditacion-y-silencio",
            name: "Sala de Meditación y Silencio",
            description:
                "Sala para prácticas de yoga suave, círculos y lecturas. Piso de madera y luz tenue.",
            capacity: 12,
            features: ["Esterillas", "Iluminación regulable", "Aislación sonora", "Aromas"],
            atmosphere: "Calmo y místico",
            bestFor: ["Yoga suave", "Círculos", "Lecturas", "Meditación"],
            images: [
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5237.webp",
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5242.webp",
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5251.webp",
            ],
            tag: "Movimiento",
            icon: Moon,
        },
    ] as const;

    const active = spaces[activeSpace] ?? {};
    const ActiveIcon = active.icon;

    // animación leve al cambiar de espacio
    const [appear, setAppear] = useState(false);
    useEffect(() => {
        setAppear(false);
        const id = setTimeout(() => setAppear(true), 10);
        return () => clearTimeout(id);
    }, [activeSpace]);

    // Alturas compartidas (slider y card) — mantener sync con CinematicSlider.aspectClass
    const sharedHeight = "h-[74vw] sm:h-[60vw] lg:h-[clamp(520px,64vh,620px)] xl:h-[clamp(520px,64vh,500px)] 2xl:h-[clamp(550px,55vh,540px)]";


    return (
        <section>
            {/* ===== SECCIÓN ESPACIOS ===== */}
            <section id="espacios" className="relative pt-14 pb-40 sm:py-16">

                <div className="absolute inset-0 -z-10">
                    <Image
                        src={mediaUrl("hero-spaces/spaces-bg.png")}
                        alt="Pared blanca con plantas, estilo BOA"
                        fill
                        priority
                        quality={90}
                        sizes="100vw"
                        className="object-cover object-[42%_35%]"
                    />
                    {/* Overlay suave para contraste de textos (ajustá opacidad si querés) */}
                    <div className="pointer-events-none absolute inset-0 bg-white/60 sm:bg-white/50" />
                </div>


                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12">
                        <h1 className="font-sans text-4xl sm:text-5xl font-bold text-neutral-900 mb-2">
                            Conocé nuestros{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
                                espacios
                            </span>
                        </h1>
                        <p className="text-neutral-700 max-w-2xl mx-auto">
                            Cada ambiente tiene su propia vibra. Elegí dónde querés crear, conectar y disfrutar.
                        </p>
                    </div>
                </div>

                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 xl:pb-20">
                    {/* Filtro mobile (select) */}
                    <div className="lg:hidden mb-6">
                        <label className="sr-only" htmlFor="space-filter">Elegir espacio</label>

                        <Select value={String(activeSpace)} onValueChange={(v) => setActiveSpace(Number(v))}>
                            <SelectTrigger
                                id="space-filter"
                                // ↑ el icono de shadcn rota solo con data-[state=open]
                                className="
        relative w-full rounded-2xl
        min-h-[48px] py-3 px-4 pr-4
        text-base bg-white/90 backdrop-blur
        border border-neutral-300 ring-1 ring-black/5 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300
        data-[placeholder]:text-neutral-500
      "
                            >
                                <SelectValue placeholder="Elegir espacio" />
                            </SelectTrigger>

                            <SelectContent className="rounded-xl border-neutral-200 shadow-xl max-h-[60vh] overflow-auto">
                                {spaces.map((s, i) => (
                                    <SelectItem
                                        key={s.id ?? `space-${i}`}
                                        value={String(i)}
                                        className="
            py-3 px-3 text-base
            data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700
            hover:bg-neutral-50
            border-b last:border-b-0 border-neutral-200
          "
                                    >
                                        {s.name ?? `Espacio ${i + 1}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selector horizontal (desktop/tablet) */}
                    <div className="hidden lg:block">
                        <div className="flex justify-center gap-3 sm:gap-4 mb-10 flex-wrap">
                            {spaces.map((s, i) => {
                                const IconComp = s.icon;
                                const isActive = activeSpace === i;
                                return (
                                    <button
                                        key={s.id ?? `space-${i}`}
                                        onClick={() => setActiveSpace(i)}
                                        className={`group relative overflow-hidden px-5 sm:px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2
    ${isActive
                                                ? "border-emerald-600 bg-white/90 text-emerald-700 shadow-[0_10px_28px_-14px_rgba(16,185,129,.45)] backdrop-blur"
                                                : "border-neutral-200 bg-white/70 backdrop-blur hover:bg-white/85 hover:border-emerald-300"
                                            }`}
                                        style={{
                                            clipPath:
                                                "path('M0 12 Q0 0 12 0 H100% Q100% 0 100% 12 V100% Q100% 100% 100% 100% H12 Q0 100% 0 88 Z')",
                                        }}
                                    >
                                        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="absolute -inset-10 rotate-12 bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent blur-xl animate-[shimmer_1.2s_ease-in-out]" />
                                        </span>
                                        {IconComp ? <IconComp className="h-4 w-4 relative z-10" /> : <span className="h-2 w-2 rounded-full bg-neutral-400 inline-block relative z-10" />}
                                        <span className="font-medium relative z-10">{s.name ?? `Espacio ${i + 1}`}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* GRID: Slider + Card (misma altura) */}
                    <div
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${appear ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                    >
                        {/* Slider */}
                        <div className={sharedHeight}>
                            <CinematicSlider
                                images={active.images}
                                alt={active.name ?? "Espacio"}
                                sizes="(min-width:1024px) 50vw, 100vw"
                                aspectClass={sharedHeight}
                            />
                        </div>

                        {/* Card detalle */}
                        {/* Card detalle */}
                        <div className={`${sharedHeight} grid overflow-visible`}>
                            <Card className="h-full border-0 rounded-[2rem] bg-gradient-to-br from-white/90 via-amber-50/60 to-emerald-50/60 backdrop-blur">
                                <CardContent
                                    className="
        p-5 sm:p-8
        h-full min-h-0 flex flex-col
        overflow-y-auto lg:overflow-visible  /* evita que se corte en mobile */
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
      "
                                >
                                    {(active.icon || active.atmosphere) && (
                                        <div className="flex items-center gap-2 text-emerald-700 mb-1.5 sm:mb-2">
                                            {ActiveIcon ? <ActiveIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : null}
                                            {active.atmosphere ? <span className="text-xs sm:text-sm font-medium">{active.atmosphere}</span> : null}
                                        </div>
                                    )}

                                    <h2 className="font-sans text-2xl sm:text-4xl font-semibold text-neutral-900 leading-tight">
                                        {active.name ?? "Espacio"}
                                    </h2>

                                    {active.description ? (
                                        <p className="text-sm sm:text-lg text-neutral-700 mt-2 mb-5 sm:mb-6 leading-relaxed">
                                            {active.description}
                                        </p>
                                    ) : <div className="mb-4" />}

                                    {(typeof active.capacity === "number" || active.atmosphere) && (
                                        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4">
                                            {typeof active.capacity === "number" && (
                                                <div className="flex items-center text-neutral-700">
                                                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2.5 sm:mr-3 text-emerald-600" />
                                                    <div>
                                                        <div className="font-semibold text-sm sm:text-base">Capacidad</div>
                                                        <div className="text-xs sm:text-sm">{active.capacity} personas</div>
                                                    </div>
                                                </div>
                                            )}
                                            {active.atmosphere && (
                                                <div className="flex items-center text-neutral-700">
                                                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2.5 sm:mr-3 text-emerald-600" />
                                                    <div>
                                                        <div className="font-semibold text-sm sm:text-base">Ambiente</div>
                                                        <div className="text-xs sm:text-sm">{active.atmosphere}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {Array.isArray(active.features) && active.features.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">Características</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {active.features.map((f, idx) => (
                                                    <div key={idx} className="flex items-center text-xs sm:text-sm text-neutral-700">
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mr-2" />
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {Array.isArray(active.bestFor) && active.bestFor.length > 0 && (
                                        <div className="mb-5 sm:mb-6">
                                            <h3 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">Ideal para</h3>
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                {active.bestFor.map((use, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-emerald-100 text-emerald-700 text-[11px] sm:text-xs">
                                                        {use}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                                        <a href="#espacios" className="contents">
                                            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-7 py-3 rounded-2xl text-sm sm:text-base">
                                                Ver todos los espacios
                                            </Button>
                                        </a>
                                        <Link href="/contact">
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-auto bg-white hover:bg-neutral-50 px-6 sm:px-7 py-3 rounded-2xl border-neutral-300 hover:border-emerald-300 hover:text-emerald-600 text-sm sm:text-base"
                                            >
                                                <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                                Agendar visita
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIOS ===== */}
            {/* <section className="py-20 bg-white relative">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="font-sans text-4xl sm:text-5xl font-semibold text-neutral-900">Lo que dicen de BOA</h2>
                        <p className="text-neutral-700 mt-3 max-w-2xl mx-auto">
                            Experiencias reales de quienes eligieron nuestros espacios para crear y celebrar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                name: "María González",
                                role: "Freelancer",
                                text: "BOA se siente como casa: luz linda, café rico y un ritmo que inspira a enfocarse sin aislarse.",
                            },
                            {
                                name: "Carlos Méndez",
                                role: "Organizador de workshops",
                                text: "Hicimos un workshop y la energía del lugar sumó muchísimo. Equipo atento y espacio súper adaptable.",
                            },
                            {
                                name: "Ana Rodríguez",
                                role: "Instructora de yoga",
                                text: "La terraza al sol de la tarde es mágica. Mis alumnos salen renovados, yo también.",
                            },
                        ].map((t, i) => (
                            <div key={i} className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-emerald-50/60 to-white p-7">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-emerald-600 text-white grid place-content-center font-semibold">
                                        {t.name
                                            .split(" ")
                                            .map((p) => p[0])
                                            .join("")}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-neutral-900">{t.name}</div>
                                        <div className="text-sm text-neutral-600">{t.role}</div>
                                    </div>
                                </div>
                                <p className="text-neutral-800 leading-relaxed">“{t.text}”</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] h-24 rounded-t-[2rem] bg-gradient-to-t from-emerald-100/40 to-transparent" />
            </section> */}
        </section>
    );
}


