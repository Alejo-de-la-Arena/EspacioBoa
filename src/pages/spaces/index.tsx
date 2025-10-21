// src/pages/spaces/index.tsx
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/mediaUrl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    Users,
    Sparkles,
    Camera,
    Leaf,
    Coffee,
    LayoutGrid,
    Clock,
    HeartHandshake,
    Paintbrush,
    Moon,
    Feather,
} from "lucide-react";

// Helper para armar rutas por tamaño (400/800/1200)
const img = (size: 400 | 800 | 1200, file: string) => {
    if (/^https?:\/\//.test(file)) {
        return file.replace(/\/(400|800|1200)\//, `/${size}/`);
    }
    return mediaUrl(`${size}/${file}`);
};

type SpaceItem = {
    id: string;
    name: string;
    description: string;
    capacity: number;
    features: string[];
    atmosphere: string;
    bestFor: string[];
    // Usamos basenames y calculamos rutas por tamaño con `img(...)`
    images: [string, string, string]; // [principal, detalle1, detalle2]
    tag: string;
    icon:
    | typeof Coffee
    | typeof Paintbrush
    | typeof Moon
    | typeof Feather
    | typeof Leaf
    | typeof LayoutGrid
    | typeof Sparkles
    | typeof HeartHandshake;
};

export default function SpacesPage() {
    const [activeSpace, setActiveSpace] = useState(0);

    const spaces: Readonly<SpaceItem[]> = [
        {
            id: "entrada",
            name: "Entrada",
            description:
                "Ingreso principal con luz cálida, plantas y señalética BOA. Punto de bienvenida e información.",
            capacity: 10,
            features: ["Recepción", "Señalética", "Espacio de espera", "Luz natural"],
            atmosphere: "Cálido y funcional",
            bestFor: ["Recepción", "Fotos rápidas", "Punto de encuentro", "Check-in"],
            images: [
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5180.webp",
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5580.webp",
                "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5440.jpg",
            ],
            tag: "Ingreso",
            icon: LayoutGrid,
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
            images: [
                "espacios/biblioteca-1.webp",
                "espacios/biblioteca-2.webp",
                "espacios/biblioteca-3.webp",
            ],
            tag: "Silencio",
            icon: Sparkles,
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
                "espacios/holistica-1.webp",
                "espacios/holistica-2.webp",
                "espacios/holistica-3.webp",
            ],
            tag: "Intimidad",
            icon: HeartHandshake,
        },
        {
            id: "shop-wellnes",
            name: "Shop Wellnes",
            description:
                "Tienda de productos saludables y de autocuidado. Exhibidores modulares y mostrador.",
            capacity: 8,
            features: ["Exhibidores", "POS", "Iluminación puntual", "Curaduría"],
            atmosphere: "Vibrante y práctico",
            bestFor: ["Compras rápidas", "Descubrir productos", "Muestras"],
            images: [
                "espacios/shop-1.webp",
                "espacios/shop-2.webp",
                "espacios/shop-3.webp",
            ],
            tag: "Retail",
            icon: Paintbrush,
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
            images: [
                "espacios/salon-1.webp",
                "espacios/salon-2.webp",
                "espacios/salon-3.webp",
            ],
            tag: "Versatilidad",
            icon: Leaf,
        },
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
                "espacios/cafeteria-1.webp",
                "espacios/cafeteria-2.webp",
                "espacios/cafeteria-3.webp",
            ],
            tag: "Espacio principal",
            icon: Coffee,
        },
        {
            id: "yoga-tarot",
            name: "Yoga/Tarot",
            description:
                "Sala para prácticas de yoga suave, círculos y lecturas. Piso de madera y luz tenue.",
            capacity: 12,
            features: ["Esterillas", "Iluminación regulable", "Aislación sonora", "Aromas"],
            atmosphere: "Calmo y místico",
            bestFor: ["Yoga suave", "Círculos", "Lecturas", "Meditación"],
            images: [
                "espacios/yoga-1.webp",
                "espacios/yoga-2.webp",
                "espacios/yoga-3.webp",
            ],
            tag: "Movimiento",
            icon: Moon,
        },
    ] as const;

    const ActiveIcon = spaces[activeSpace].icon;

    // Genera las rutas según tamaño para el espacio activo
    const activeImgs = useMemo(() => {
        const [a, b, c] = spaces[activeSpace].images;
        return {
            // Principal (grande)
            principal: {
                s400: img(400, a),
                s800: img(800, a),
                s1200: img(1200, a),
            },
            // Detalle 1
            d1: {
                s400: img(400, b),
                s800: img(800, b),
                s1200: img(1200, b),
            },
            // Detalle 2
            d2: {
                s400: img(400, c),
                s800: img(800, c),
                s1200: img(1200, c),
            },
        };
    }, [activeSpace, spaces]);

    return (
        <section>
            {/* ===== ENCABEZADO SIMPLE (sin hero) ===== */}
            <section className="py-10 sm:py-14 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-sans text-4xl sm:text-5xl font-bold text-neutral-900">
                        Conocé nuestros{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
                            espacios
                        </span>
                    </h1>
                    <p className="mt-3 text-neutral-700 max-w-2xl mx-auto">
                        Cada ambiente tiene su propia vibra. Elegí dónde querés crear, conectar y disfrutar.
                    </p>
                </div>
            </section>

            {/* ===== SECCIÓN ESPACIOS ===== */}
            <section id="espacios" className="pt-2 pb-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtro mobile */}
                    <div className="lg:hidden mb-6">
                        <label className="sr-only" htmlFor="space-filter">
                            Elegir espacio
                        </label>
                        <select
                            id="space-filter"
                            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 font-medium"
                            value={activeSpace}
                            onChange={(e) => setActiveSpace(Number(e.target.value))}
                        >
                            {spaces.map((s, i) => (
                                <option key={s.id} value={i}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selector horizontal (desktop + tablet) */}
                    <div className="hidden lg:block">
                        <div className="flex justify-center gap-3 sm:gap-4 mb-10 flex-wrap">
                            {/* En desktop, si no entra, se envuelve en varias filas gracias a flex-wrap,
                  y además podemos permitir scroll-x si querés: agrega overflow-x-auto */}
                            {spaces.map((s, i) => {
                                const Icon = s.icon;
                                const active = activeSpace === i;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSpace(i)}
                                        className={`relative px-5 sm:px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 ${active
                                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-[0_8px_24px_-12px_rgba(16,185,129,.5)]"
                                            : "border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50"
                                            }`}
                                        style={{
                                            clipPath:
                                                "path('M0 12 Q0 0 12 0 H100% Q100% 0 100% 12 V100% Q100% 100% 100% 100% H12 Q0 100% 0 88 Z')",
                                        }}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="font-medium">{s.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Layout del espacio activo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Collage asimétrico */}
                        <div className="relative">
                            <div className="relative rotate-[-1.5deg]">
                                <div className="relative w-full h-80 rounded-3xl shadow-xl overflow-hidden">
                                    <Image
                                        // Usamos el de 1200 como src base; Next genera responsive a partir de eso.
                                        src={activeImgs.principal.s1200}
                                        alt={spaces[activeSpace].name}
                                        fill
                                        quality={90}
                                        // 50% del viewport en desktop (columna izquierda), full en mobile
                                        sizes="(min-width:1024px) 50vw, 100vw"
                                        className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                                    />
                                </div>
                                <Badge className="absolute top-5 left-5 bg-white/90 text-neutral-700">
                                    <Camera className="h-3 w-3 mr-1" />
                                    {spaces[activeSpace].tag}
                                </Badge>
                                <div className="absolute -top-3 left-10 w-24 h-5 bg-emerald-200/60 rounded-[2px] rotate-[4deg]" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="relative rotate-[2deg]">
                                    <div className="relative h-36 w-full rounded-2xl border border-neutral-200 overflow-hidden">
                                        <Image
                                            src={activeImgs.d1.s800}
                                            alt={`${spaces[activeSpace].name} detalle 1`}
                                            fill
                                            quality={85}
                                            sizes="(min-width:1024px) 25vw, 50vw"
                                            className="object-cover object-center"
                                        />
                                    </div>
                                    <div className="absolute -top-2 right-6 w-16 h-4 bg-neutral-200/70 rounded-[2px] rotate-[-6deg]" />
                                </div>
                                <div className="relative rotate-[-3deg]">
                                    <div className="relative h-36 w-full rounded-2xl border border-neutral-200 overflow-hidden">
                                        <Image
                                            src={activeImgs.d2.s800}
                                            alt={`${spaces[activeSpace].name} detalle 2`}
                                            fill
                                            quality={85}
                                            sizes="(min-width:1024px) 25vw, 50vw"
                                            className="object-cover object-center"
                                        />
                                    </div>
                                    <div className="absolute -top-2 left-6 w-16 h-4 bg-emerald-100/80 rounded-[2px] rotate-[8deg]" />
                                </div>
                            </div>
                        </div>

                        {/* Detalle en card */}
                        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-emerald-50/60 to-white">
                            <CardContent className="p-7 sm:p-8">
                                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                                    <ActiveIcon className="h-5 w-5" />
                                    <span className="text-sm font-medium">
                                        {spaces[activeSpace].atmosphere}
                                    </span>
                                </div>

                                <h2 className="font-sans text-4xl font-semibold text-neutral-900">
                                    {spaces[activeSpace].name}
                                </h2>
                                <p className="text-lg text-neutral-700 mt-2 mb-6">
                                    {spaces[activeSpace].description}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div className="flex items-center text-neutral-700">
                                        <Users className="h-5 w-5 mr-3 text-emerald-600" />
                                        <div>
                                            <div className="font-semibold">Capacidad</div>
                                            <div className="text-sm">
                                                {spaces[activeSpace].capacity} personas
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-neutral-700">
                                        <Sparkles className="h-5 w-5 mr-3 text-emerald-600" />
                                        <div>
                                            <div className="font-semibold">Ambiente</div>
                                            <div className="text-sm">
                                                {spaces[activeSpace].atmosphere}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-neutral-900 mb-2">
                                        Características
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {spaces[activeSpace].features.map((f, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center text-sm text-neutral-700"
                                            >
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ideal para */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-neutral-900 mb-2">
                                        Ideal para
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {spaces[activeSpace].bestFor.map((use, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="bg-emerald-100 text-emerald-700"
                                            >
                                                {use}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* CTAs */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a href="#espacios">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-2xl">
                                            <LayoutGrid className="mr-2 h-5 w-5" />
                                            Ver todos los espacios
                                        </Button>
                                    </a>
                                    <Link href="/contact">
                                        <Button
                                            variant="outline"
                                            className="bg-white hover:bg-neutral-50 px-7 py-3 rounded-2xl border-neutral-300 hover:border-emerald-300 hover:text-emerald-600"
                                        >
                                            <Clock className="mr-2 h-5 w-5" />
                                            Agendar visita
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ===== USO PRIVADO & ALQUILER ===== */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-neutral-50" />
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.08] text-emerald-900/30"
                    preserveAspectRatio="none"
                    aria-hidden
                >
                    <defs>
                        <pattern
                            id="boa-motif-3"
                            width="140"
                            height="140"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M0 70 Q35 35 70 70 T140 70"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.7"
                            />
                            <path
                                d="M0 105 Q35 70 70 105 T140 105"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.7"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#boa-motif-3)" />
                </svg>

                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Texto */}
                        <div>
                            <h2 className="font-sans text-4xl sm:text-5xl font-semibold text-neutral-900 mb-4">
                                Usá BOA para tus momentos privados
                            </h2>
                            <p className="text-lg text-neutral-700 mb-6 max-w-xl">
                                Nuestros espacios se adaptan a círculos íntimos, workshops, lanzamientos, cumpleaños pequeños y sesiones 1:1. Te acompañamos con ambientación, catering estilo café y logística simple.
                            </p>

                            {/* Etiquetas de disponibilidad */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                <Badge className="bg-white text-emerald-700 border border-emerald-200">
                                    Disponibilidad semanal
                                </Badge>
                                <Badge className="bg-white text-emerald-700 border border-emerald-200">
                                    Bloques de 2/4 hs
                                </Badge>
                                <Badge className="bg-white text-emerald-700 border border-emerald-200">
                                    Catering opcional
                                </Badge>
                                <Badge className="bg-white text-emerald-700 border border-emerald-200">
                                    Ambientación a medida
                                </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/contact">
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-7 py-3">
                                        Consultar disponibilidad
                                    </Button>
                                </Link>
                                <Link href="/events">
                                    <Button
                                        variant="outline"
                                        className="bg-white hover:bg-neutral-50 px-7 py-3 rounded-2xl border-neutral-300 hover:border-emerald-300 hover:text-emerald-600"
                                    >
                                        Ver formatos y montajes
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Galería vertical fina (con Supabase) */}
                        <div className="grid grid-cols-3 gap-3 h-full">
                            {[
                                "eventos/detalle-1.webp",
                                "eventos/detalle-2.webp",
                                "eventos/detalle-3.webp",
                            ].map((file, i) => (
                                <div
                                    key={i}
                                    className="relative h-60 w-full rounded-2xl border border-neutral-200 overflow-hidden"
                                >
                                    <Image
                                        src={img(800, file)}
                                        alt={`Detalle evento ${i + 1}`}
                                        fill
                                        quality={85}
                                        sizes="(min-width:1024px) 15vw, 33vw"
                                        className="object-cover object-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIOS ===== */}
            <section className="py-20 bg-white relative">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="font-sans text-4xl sm:text-5xl font-semibold text-neutral-900">
                            Lo que dicen de BOA
                        </h2>
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
                            <Card
                                key={i}
                                className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-emerald-50/60 to-white"
                            >
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-emerald-600 text-white grid place-content-center font-semibold">
                                            {t.name
                                                .split(" ")
                                                .map((p) => p[0])
                                                .join("")}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-neutral-900">
                                                {t.name}
                                            </div>
                                            <div className="text-sm text-neutral-600">{t.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-neutral-800 leading-relaxed">“{t.text}”</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* banda decorativa sutil */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] h-24 rounded-t-[2rem] bg-gradient-to-t from-emerald-100/40 to-transparent" />
            </section>
        </section>
    );
}
