// src/pages/spaces/index.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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

export default function SpacesPage() {
    const [activeSpace, setActiveSpace] = useState(0);

    const spaces = [
        {
            id: "cafe-principal",
            name: "Café Principal",
            description:
                "Nuestro espacio central, perfecto para conversaciones, trabajo remoto y encuentros casuales.",
            capacity: 45,
            features: [
                "WiFi de alta velocidad",
                "Enchufes en cada mesa",
                "Música ambiente",
                "Luz natural",
            ],
            atmosphere: "Cálido y acogedor",
            bestFor: [
                "Trabajo remoto",
                "Reuniones informales",
                "Primera cita",
                "Lectura",
            ],
            images: [
                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&auto=format&fit=crop",
            ],
            tag: "Espacio principal",
            icon: Coffee,
        },
        {
            id: "atelier-arte",
            name: "Atelier de Arte",
            description:
                "Sala luminosa con caballetes y paredes lavables para pintar, modelar y exponer pequeñas muestras.",
            capacity: 20,
            features: [
                "Luz natural",
                "Caballetes y mesas altas",
                "Paredes lavables",
                "Bacha de lavado",
            ],
            atmosphere: "Creativo y luminoso",
            bestFor: [
                "Talleres de pintura",
                "Clases",
                "Muestras pequeñas",
                "Club de dibujo",
            ],
            images: [
                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop",
            ],
            tag: "Luz norte",
            icon: Paintbrush,
        },
        {
            id: "rincon-tarot",
            name: "Rincón de Tarot",
            description:
                "Ambiente íntimo con acústica cuidada, aromas suaves y luz cálida para lecturas y encuentros 1:1.",
            capacity: 6,
            features: [
                "Iluminación cálida regulable",
                "Butacas cómodas",
                "Aromas y velas",
                "Aislamiento acústico",
            ],
            atmosphere: "Íntimo y místico",
            bestFor: [
                "Lecturas 1:1",
                "Pequeños círculos",
                "Oráculos",
                "Meditación guiada",
            ],
            images: [
                "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1200&auto=format&fit=crop",
            ],
            tag: "Intimidad",
            icon: Moon,
        },
        {
            id: "estudio-aeroyoga",
            name: "Estudio de Aeroyoga",
            description:
                "Estudio equipado con arneses, espejos y piso de madera para prácticas en suspensión y movimiento.",
            capacity: 12,
            features: [
                "Arneses de aeroyoga",
                "Espejos de pared",
                "Equipo de sonido",
                "Piso de madera",
            ],
            atmosphere: "Energético y armónico",
            bestFor: [
                "Aeroyoga",
                "Stretching",
                "Pilates aéreo",
                "Workshops",
            ],
            images: [
                "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1540522317476-64606b87aa6e?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1518617840856-0e2f060386fe?w=1200&auto=format&fit=crop",
            ],
            tag: "Movimiento",
            icon: Feather,
        },
        {
            id: "terraza-zen",
            name: "Terraza Zen",
            description:
                "Un oasis urbano al aire libre, rodeado de plantas y diseñado para la contemplación y relajación.",
            capacity: 25,
            features: [
                "Jardín vertical",
                "Agua corriente",
                "Sombra natural",
                "Mobiliario cómodo",
            ],
            atmosphere: "Zen y natural",
            bestFor: [
                "Meditación",
                "Yoga matutino",
                "Lecturas",
                "Desconexión digital",
            ],
            images: [
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1200&auto=format&fit=crop",
            ],
            tag: "Luz natural",
            icon: Leaf,
        },
    ] as const;

    const ActiveIcon = spaces[activeSpace].icon;

    return (
        <section>
            {/* ===== ENCABEZADO SIMPLE (sin hero) ===== */}
            <section className="py-10 sm:py-14 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-sans text-4xl sm:text-5xl font-bold text-neutral-900">
                        Conocé nuestros <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">espacios</span>
                    </h1>
                    <p className="mt-3 text-neutral-700 max-w-2xl mx-auto">
                        Cada ambiente tiene su propia vibra. Elegí dónde querés crear, conectar y disfrutar.
                    </p>
                </div>
            </section>

            {/* ===== SECCIÓN ESPACIOS ===== */}
            <section id="espacios" className="pt-2 pb-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Selector horizontal */}
                    <div className="flex justify-center gap-3 sm:gap-4 mb-10 flex-wrap">
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

                    {/* Layout del espacio activo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Collage asimétrico */}
                        <div className="relative">
                            <div className="relative rotate-[-1.5deg]">
                                <img
                                    src={spaces[activeSpace].images[0]}
                                    alt={spaces[activeSpace].name}
                                    className="w-full h-80 object-cover rounded-3xl shadow-xl"
                                />
                                <Badge className="absolute top-5 left-5 bg-white/90 text-neutral-700">
                                    <Camera className="h-3 w-3 mr-1" />
                                    {spaces[activeSpace].tag}
                                </Badge>
                                <div className="absolute -top-3 left-10 w-24 h-5 bg-emerald-200/60 rounded-[2px] rotate-[4deg]" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="relative rotate-[2deg]">
                                    <img
                                        src={spaces[activeSpace].images[1]}
                                        alt={`${spaces[activeSpace].name} detalle 1`}
                                        className="h-36 w-full object-cover rounded-2xl border border-neutral-200"
                                    />
                                    <div className="absolute -top-2 right-6 w-16 h-4 bg-neutral-200/70 rounded-[2px] rotate-[-6deg]" />
                                </div>
                                <div className="relative rotate-[-3deg]">
                                    <img
                                        src={spaces[activeSpace].images[2]}
                                        alt={`${spaces[activeSpace].name} detalle 2`}
                                        className="h-36 w-full object-cover rounded-2xl border border-neutral-200"
                                    />
                                    <div className="absolute -top-2 left-6 w-16 h-4 bg-emerald-100/80 rounded-[2px] rotate-[8deg]" />
                                </div>
                            </div>
                        </div>

                        {/* Detalle en card */}
                        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-emerald-50/60 to-white">
                            <CardContent className="p-7 sm:p-8">
                                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                                    <ActiveIcon className="h-5 w-5" />
                                    <span className="text-sm font-medium">{spaces[activeSpace].atmosphere}</span>
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
                                            <div className="text-sm">{spaces[activeSpace].capacity} personas</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-neutral-700">
                                        <Sparkles className="h-5 w-5 mr-3 text-emerald-600" />
                                        <div>
                                            <div className="font-semibold">Ambiente</div>
                                            <div className="text-sm">{spaces[activeSpace].atmosphere}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-neutral-900 mb-2">Características</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {spaces[activeSpace].features.map((f, idx) => (
                                            <div key={idx} className="flex items-center text-sm text-neutral-700">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ideal para */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-neutral-900 mb-2">Ideal para</h3>
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
                <svg className="absolute inset-0 w-full h-full opacity-[0.08] text-emerald-900/30" preserveAspectRatio="none" aria-hidden>
                    <defs>
                        <pattern id="boa-motif-3" width="140" height="140" patternUnits="userSpaceOnUse">
                            <path d="M0 70 Q35 35 70 70 T140 70" fill="none" stroke="currentColor" strokeWidth="0.7" />
                            <path d="M0 105 Q35 70 70 105 T140 105" fill="none" stroke="currentColor" strokeWidth="0.7" />
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
                                <Badge className="bg-white text-emerald-700 border border-emerald-200">Disponibilidad semanal</Badge>
                                <Badge className="bg-white text-emerald-700 border border-emerald-200">Bloques de 2/4 hs</Badge>
                                <Badge className="bg-white text-emerald-700 border border-emerald-200">Catering opcional</Badge>
                                <Badge className="bg-white text-emerald-700 border border-emerald-200">Ambientación a medida</Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/contact">
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-7 py-3">
                                        Consultar disponibilidad
                                    </Button>
                                </Link>
                                <Link href="/events">
                                    <Button variant="outline" className="bg-white hover:bg-neutral-50 px-7 py-3 rounded-2xl border-neutral-300 hover:border-emerald-300 hover:text-emerald-600">
                                        Ver formatos y montajes
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Galería vertical fina */}
                        <div className="grid grid-cols-3 gap-3 h-full">
                            <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop" alt="Detalle evento 1" className="h-60 w-full object-cover rounded-2xl border border-neutral-200" />
                            <img src="https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=900&auto=format&fit=crop" alt="Detalle evento 2" className="h-60 w-full object-cover rounded-2xl border border-neutral-200" />
                            <img src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1100&auto=format&fit=crop" alt="Detalle evento 3" className="h-60 w-full object-cover rounded-2xl border border-neutral-200" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIOS ===== */}
            <section className="py-20 bg-white relative">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="font-sans text-4xl sm:text-5xl font-semibold text-neutral-900">Lo que dicen de BOA</h2>
                        <p className="text-neutral-700 mt-3 max-w-2xl mx-auto">Experiencias reales de quienes eligieron nuestros espacios para crear y celebrar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[{
                            name: "María González",
                            role: "Freelancer",
                            text: "BOA se siente como casa: luz linda, café rico y un ritmo que inspira a enfocarse sin aislarse.",
                        }, {
                            name: "Carlos Méndez",
                            role: "Organizador de workshops",
                            text: "Hicimos un workshop y la energía del lugar sumó muchísimo. Equipo atento y espacio súper adaptable.",
                        }, {
                            name: "Ana Rodríguez",
                            role: "Instructora de yoga",
                            text: "La terraza al sol de la tarde es mágica. Mis alumnos salen renovados, yo también.",
                        }].map((t, i) => (
                            <Card key={i} className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-emerald-50/60 to-white">
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-emerald-600 text-white grid place-content-center font-semibold">
                                            {t.name.split(" ").map(p => p[0]).join("")}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-neutral-900">{t.name}</div>
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
