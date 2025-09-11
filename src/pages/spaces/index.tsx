// src/pages/spaces/index.tsx


import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
    MapPin,
    Users,
    Sparkles,
    Camera,
    Star,
    Quote,
    Leaf,
    Coffee,
    LayoutGrid,
    Clock,
    HeartHandshake,
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
            bestFor: ["Trabajo remoto", "Reuniones informales", "Primera cita", "Lectura"],
            images: [
                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&auto=format&fit=crop",
            ],
            tag: "Espacio principal",
            icon: Coffee,
        },
        {
            id: "salon-eventos",
            name: "Salón de Eventos",
            description:
                "Espacio versátil diseñado para talleres, charlas, exhibiciones y celebraciones privadas.",
            capacity: 80,
            features: ["Sistema de sonido", "Proyector HD", "Iluminación ajustable", "Cocina equipada"],
            atmosphere: "Versátil y dinámico",
            bestFor: ["Talleres", "Celebraciones", "Conferencias", "Arte"],
            images: [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=1200&auto=format&fit=crop",
            ],
            tag: "Formato flexible",
            icon: Sparkles,
        },
        {
            id: "terraza-zen",
            name: "Terraza Zen",
            description:
                "Un oasis urbano al aire libre, rodeado de plantas y diseñado para la contemplación y relajación.",
            capacity: 25,
            features: ["Jardín vertical", "Agua corriente", "Sombra natural", "Mobiliario cómodo"],
            atmosphere: "Zen y natural",
            bestFor: ["Meditación", "Yoga matutino", "Lecturas", "Desconexión digital"],
            images: [
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1200&auto=format&fit=crop",
            ],
            tag: "Luz natural",
            icon: Leaf,
        },
    ] as const;


    const testimonials = [
        {
            id: 1,
            name: "María González",
            role: "Freelancer",
            avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b4b12eb1?w=200&auto=format&fit=crop",
            text:
                "BOA se siente como casa: luz linda, café rico y un ritmo que inspira a enfocarse sin aislarse.",
            rating: 5,
        },
        {
            id: 2,
            name: "Carlos Mendez",
            role: "Organizador de eventos",
            avatar:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
            text:
                "Hicimos un workshop y la energía del lugar sumó muchísimo. Equipo atento y espacio súper adaptable.",
            rating: 5,
        },
        {
            id: 3,
            name: "Ana Rodríguez",
            role: "Instructora de yoga",
            avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop",
            text:
                "La terraza, al sol de la tarde, es mágica. Mis alumnos salen renovados, yo también.",
            rating: 5,
        },
    ];


    const ActiveIcon = spaces[activeSpace].icon;


    return (
        <Layout>
            {/* ===== HERO (sin botón de agendar visita) ===== */}
            <section className="relative min-h-[72vh] sm:min-h-[80vh] overflow-hidden font-sans">
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1920&auto=format&fit=crop')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(16,185,129,0.12),transparent)]" />
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.12] text-emerald-900/30"
                    preserveAspectRatio="none"
                    aria-hidden
                >
                    <defs>
                        <pattern id="boa-motif" width="120" height="120" patternUnits="userSpaceOnUse">
                            <path d="M0 60 Q30 30 60 60 T120 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
                            <path d="M0 90 Q30 60 60 90 T120 90" fill="none" stroke="currentColor" strokeWidth="0.8" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#boa-motif)" />
                </svg>


                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24">
                    <div className="max-w-3xl rounded-3xl bg-white/70 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,.25)] p-6 sm:p-8">
                        <div className="flex items-center gap-2 text-emerald-700 mb-3">
                            <MapPin className="h-5 w-5" />
                            <span className="text-sm font-medium">Elegí tu lugar en BOA</span>
                        </div>


                        <h1 className="boa-heading text-4xl sm:text-6xl font-semibold text-neutral-900 leading-[1.08]">
                            Tres espacios para{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
                                crear
                            </span>
                            ,{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
                                conectar
                            </span>{" "}
                            y{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
                                disfrutar
                            </span>
                        </h1>


                        <p className="mt-4 text-lg sm:text-xl text-neutral-800/90">
                            Café cálido, salón versátil y terraza zen. Elegí el ambiente que mejor acompañe tu
                            momento.
                        </p>


                        {/* Solo un botón, ajustado a su contenido */}
                        <div className="mt-6">
                            <a href="#espacios">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-7 py-3">
                                    Ver espacios
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>


            {/* ===== SECCIÓN ESPACIOS: selector horizontal artístico + display cálido ===== */}
            <section id="espacios" className="py-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Selector horizontal (sin dots verdes) */}
                    <div className="flex justify-center gap-4 mb-10 flex-wrap">
                        {spaces.map((s, i) => {
                            const Icon = s.icon;
                            const active = activeSpace === i;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSpace(i)}
                                    className={`relative px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2
                  ${active ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-[0_8px_24px_-12px_rgba(16,185,129,.5)]" : "border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50"}`}
                                    style={{ clipPath: "path('M0 12 Q0 0 12 0 H100% Q100% 0 100% 12 V100% Q100% 100% 100% 100% H12 Q0 100% 0 88 Z')" }}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="font-medium">{s.name}</span>
                                </button>
                            );
                        })}
                    </div>


                    {/* Layout cálido/artistico del espacio activo */}
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


                        {/* Detalle en card cálida */}
                        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-br from-emerald-50/60 to-white">
                            <CardContent className="p-7 sm:p-8">
                                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                                    <ActiveIcon className="h-5 w-5" />
                                    <span className="text-sm font-medium">{spaces[activeSpace].atmosphere}</span>
                                </div>


                                <h2 className="boa-heading text-4xl font-semibold text-neutral-900">
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
                                            <Badge key={idx} variant="secondary" className="bg-emerald-100 text-emerald-700">
                                                {use}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>


                                {/* CTAs actualizados */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link href="/spaces">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-2xl">
                                            <LayoutGrid className="mr-2 h-5 w-5" />
                                            Ver todos los espacios
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="bg-white hover:bg-neutral-50 px-7 py-3 rounded-2xl border-neutral-300 hover:border-emerald-300 hover:text-emerald-600"
                                    >
                                        <Clock className="mr-2 h-5 w-5" />
                                        Agendar visita
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ===== EVENTOS PRIVADOS — re-styling + CTA acorde a BOA ===== */}
            <section className="py-20 relative overflow-hidden">
                {/* Motivo sutil de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-neutral-50" />
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.08] text-emerald-900/30"
                    preserveAspectRatio="none"
                    aria-hidden
                >
                    <defs>
                        <pattern id="boa-motif-2" width="120" height="120" patternUnits="userSpaceOnUse">
                            <path d="M0 60 Q30 30 60 60 T120 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
                            <path d="M0 90 Q30 60 60 90 T120 90" fill="none" stroke="currentColor" strokeWidth="0.8" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#boa-motif-2)" />
                </svg>


                <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="border-0 rounded-3xl shadow-xl bg-white/80 backdrop-blur-md">
                        <CardContent className="p-8 sm:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                                {/* Texto */}
                                <div className="lg:col-span-2">
                                    <h2 className="boa-heading text-4xl sm:text-5xl font-semibold text-neutral-900 mb-4">
                                        Eventos privados con alma BOA
                                    </h2>
                                    <p className="text-lg text-neutral-700 mb-6">
                                        Convertimos cualquiera de nuestros espacios en el escenario de tus ideas:
                                        íntimo, cálido y con detalles que suman.
                                    </p>


                                    {/* Chips de beneficios */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            Ambientación a medida
                                        </Badge>
                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            Acompañamiento del equipo
                                        </Badge>
                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            Café & luz natural
                                        </Badge>
                                    </div>


                                    <Link href="/contact">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-7 py-3">
                                            <HeartHandshake className="mr-2 h-5 w-5" />
                                            Conversemos tu idea
                                        </Button>
                                    </Link>
                                </div>


                                {/* Mini collage decorativo */}
                                <div className="space-y-3">
                                    <div className="relative rotate-[-2deg]">
                                        <img
                                            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1100&auto=format&fit=crop"
                                            alt="Evento BOA"
                                            className="h-40 w-full object-cover rounded-2xl border border-neutral-200"
                                        />
                                        <div className="absolute -top-2 left-8 w-20 h-4 bg-emerald-200/70 rounded-[2px] rotate-[6deg]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <img
                                            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop"
                                            alt="Detalle 1"
                                            className="h-28 w-full object-cover rounded-xl border border-neutral-200 rotate-[2deg]"
                                        />
                                        <img
                                            src="https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=900&auto=format&fit=crop"
                                            alt="Detalle 2"
                                            className="h-28 w-full object-cover rounded-xl border border-neutral-200 rotate-[-2deg]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </Layout>
    );
}

