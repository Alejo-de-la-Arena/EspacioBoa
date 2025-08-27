
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Coffee,
    Users,
    Sparkles,
    ArrowRight,
    Quote,
    Leaf,
} from "lucide-react";

export default function AboutPage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // --- Equipo ---
    const team = [
        {
            id: 1,
            name: "Isabella Martínez",
            role: "Fundadora & Directora Creativa",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164907/realistic_photograph_of_an_american_woman_35_os79ba.jpg",
            color: "from-emerald-400 to-teal-500",
        },
        {
            id: 2,
            name: "Marco Rodriguez",
            role: "Head Barista & Coffee Curator",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164737/You_Won_t_Believe_These_People_Are_Generated_by_Artificial_Intelligence_u4ib6f.jpg",
            color: "from-emerald-400 to-teal-500",
        },
        {
            id: 3,
            name: "Carmen Silva",
            role: "Coordinadora de Bienestar",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756164996/17b2ca7e-f301-415a-a1cc-ed68d2878f2e_arpdbn.jpg",
            color: "from-emerald-400 to-teal-500",
        },
        {
            id: 4,
            name: "Diego Herrera",
            role: "Chef & Consultor Nutricional",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756165082/279418af-6409-4445-af1c-ffdd8e303b68_oxhh9u.jpg",
            color: "from-emerald-400 to-teal-500",
        },
    ];

    // --- Timeline (tu versión, mantenida) ---
    const timelineData = [
        {
            year: "2023",
            title: "La idea toma forma",
            desc:
                "Empezamos como pop-ups en cafés amigos para validar una propuesta que combinara café de especialidad y bienestar.",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756215990/5a6418d2-7e80-46e6-9bb2-2733b1f39185_umrghg.jpg",
            icon: <Sparkles className="h-5 w-5" />,
            gradient: "from-emerald-400 to-teal-500",
        },
        {
            year: "2024",
            title: "Abrimos el primer espacio BOA",
            desc:
                "Nace nuestra casa: un lugar vivo, verde y luminoso para encontrarse, crear y disfrutar.",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756215071/JUNGLA_Caf%C3%A9_y_plantas_jungla_ar_Fotos_y_ypa7bj.jpg",
            icon: <Coffee className="h-5 w-5" />,
            gradient: "from-emerald-400 to-teal-500",
        },
        {
            year: "2024 · Q3",
            title: "Programas de bienestar",
            desc:
                "Lanzamos clases regulares de yoga, mindfulness y arte terapia para integrar el cuidado personal a la rutina.",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756216234/34390c1b-4114-4e44-8f6a-eb175921eead_yhgrch.jpg",
            icon: <Heart className="h-5 w-5" />,
            gradient: "from-emerald-400 to-teal-500",
        },
        {
            year: "2025",
            title: "Comunidad & experiencias",
            desc:
                "Creamos un calendario de eventos, catas y talleres que hacen crecer la comunidad y el impacto local.",
            image:
                "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756216308/In_the_vibrant_heart_of_Tbilisi_freelancers_bceoxd.jpg",
            icon: <Users className="h-5 w-5" />,
            gradient: "from-emerald-400 to-teal-500",
        },
    ];

    const values = [
        {
            icon: <Heart className="h-7 w-7" />,
            title: "Conexión",
            text: "Encuentros reales que suman.",
            gradient: "from-emerald-400 to-teal-500",
        },
        {
            icon: <Coffee className="h-7 w-7" />,
            title: "Café",
            text: "Especialidad con propósito.",
            gradient: "from-emerald-400 to-teal-500",
        },
        {
            icon: <Users className="h-7 w-7" />,
            title: "Comunidad",
            text: "Crecemos juntos.",
            gradient: "from-emerald-400 to-teal-500",
        },
        {
            icon: <Sparkles className="h-7 w-7" />,
            title: "Experiencias",
            text: "Bienestar que transforma.",
            gradient: "from-emerald-400 to-teal-500",
        },
    ];

    const nextSlide = () =>
        setCurrentSlide((p) => (p + 1) % team.length);
    const prevSlide = () =>
        setCurrentSlide((p) => (p - 1 + team.length) % team.length);

    const prevIndex = (currentSlide - 1 + team.length) % team.length;
    const nextIndex = (currentSlide + 1) % team.length;

    return (
        <Layout>
            <div className="font-sans">
                {/* Hero */}
                <section className="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden">
                    <Image
                        src="https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756215484/A_small_garden_caf%C3%A9_with_whitewashed_walls_wooden_fxducx.jpg"
                        alt="Rincón de café con calidez y plantas"
                        fill
                        priority
                        className="object-cover opacity-[0.9]"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/10" />
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
                    </div>

                    <div className="container max-w-7xl mx-auto px-4 relative z-10 text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                            Café, bienestar y comunidad.
                        </h1>
                        <h2 className="text-xl md:text-2xl font-light text-white/90">
                            Un espacio vivo para encontrarse, crear y sentirse mejor.
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-10">
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                                <div className="text-2xl font-bold text-emerald-200">15+</div>
                                <div className="text-sm text-white/80">Actividades/semana</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                                <div className="text-2xl font-bold text-emerald-200">20+</div>
                                <div className="text-sm text-white/80">Talleres al mes</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                                <div className="text-2xl font-bold text-emerald-200">500+</div>
                                <div className="text-sm text-white/80">Miembros</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                                <div className="text-2xl font-bold text-emerald-200">3</div>
                                <div className="text-sm text-white/80">Espacios únicos</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Misión / Quote (con fondo) */}
                <section className="relative py-20">
                    <Image
                        src="https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756214688/Cozy_Cafe_Gathering__Smiling_friends_enjoying_a_ipebog.jpg"
                        alt="Reunión acogedora en el café"
                        fill
                        className="object-cover opacity-40"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/85" />
                    <div className="container max-w-5xl mx-auto px-4 relative z-10 text-center">
                        <Quote className="h-16 w-16 text-emerald-500/80 mx-auto mb-8" />
                        <p className="text-3xl md:text-4xl font-light text-neutral-800 leading-relaxed mb-8">
                            Donde el café de especialidad, el bienestar y la comunidad
                            <span className="font-semibold text-emerald-600"> convergen.</span>
                        </p>
                        <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto rounded-full" />
                    </div>
                </section>

                {/* Timeline */}
                <section className="py-24 bg-gradient-to-b from-white to-neutral-50">
                    <div className="container max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-bold text-neutral-900 mb-6">
                                Evolución
                            </h2>
                            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                                Cómo pasó de una idea a una casa de experiencias.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-200" />
                            {timelineData.map((event, index) => (
                                <div
                                    key={event.year}
                                    className={`relative mb-16 ${index % 2 === 0 ? "text-right" : "text-left"
                                        }`}
                                >
                                    <div className="group cursor-pointer">
                                        <div
                                            className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? "" : "md:grid-flow-col-dense"
                                                }`}
                                        >
                                            <div
                                                className={`${index % 2 === 0
                                                    ? "md:pr-16"
                                                    : "md:pl-16 md:col-start-2"
                                                    } transform group-hover:-translate-y-1 transition-all duration-300`}
                                            >
                                                <div
                                                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${event.gradient} text-white font-bold text-xl mb-6 shadow-lg`}
                                                >
                                                    {event.icon}
                                                    {event.year}
                                                </div>
                                                <h3 className="text-3xl font-bold text-neutral-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                                    {event.title}
                                                </h3>
                                                <p className="text-neutral-600">{event.desc}</p>
                                            </div>

                                            <div
                                                className={`${index % 2 === 0 ? "md:pl-16" : "md:pr-16"
                                                    } transform group-hover:scale-105 transition-all duration-500`}
                                            >
                                                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                                                    <img
                                                        src={event.image}
                                                        alt={event.title}
                                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/25 to-transparent" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg group-hover:scale-125 group-hover:bg-emerald-600 transition-all duration-300 z-10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Valores */}
                <section className="relative py-24">
                    <Image
                        src="https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756215071/JUNGLA_Caf%C3%A9_y_plantas_jungla_ar_Fotos_y_ypa7bj.jpg"
                        alt="Fondo con jungla de plantas en interior"
                        fill
                        className="object-cover opacity-30"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-white/80" />

                    <div className="container max-w-7xl mx-auto px-4 relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-neutral-900">
                                Valores
                            </h2>
                            <p className="text-neutral-600 mt-2">
                                Lo esencial de BOA, sin ruido.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((v, i) => (
                                <div
                                    key={i}
                                    className="group rounded-3xl p-[1px] bg-gradient-to-br from-emerald-300/40 to-teal-500/40"
                                >
                                    <div className="h-full rounded-3xl bg-white/95 backdrop-blur-sm border border-white/70 p-8 text-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                                        <div
                                            className={`mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br ${v.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                                        >
                                            {v.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-neutral-900">
                                            {v.title}
                                        </h3>
                                        <p className="text-sm text-neutral-600 mt-2">{v.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Nuestro Equipo — sin auto-slide, flechas visibles, tarjetas normalizadas */}
                <section className="relative py-24 overflow-hidden">
                    <Image
                        src="https://res.cloudinary.com/dfrhrnwwi/image/upload/v1756216308/In_the_vibrant_heart_of_Tbilisi_freelancers_bceoxd.jpg"
                        alt="Fondo dinámico con gente trabajando"
                        fill
                        className="object-cover opacity-[0.8]"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 via-neutral-900/60 to-neutral-800/70" />

                    <div className="container max-w-6xl mx-auto px-4 relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="font-sans text-4xl font-extrabold text-white">Nuestro equipo</h2>
                            <p className="font-sans text-neutral-200 mt-2">
                                Profesionalismo con alma creativa.
                            </p>
                        </div>

                        <div className="relative">
                            {/* Previews laterales (desktop) */}
                            <div className="hidden md:block">
                                <PreviewCard member={team[prevIndex]} side="left" />
                                <PreviewCard member={team[nextIndex]} side="right" />
                            </div>

                            {/* Card principal (altura normalizada) */}
                            <div className="relative mx-auto max-w-3xl">
                                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-emerald-400/50 to-teal-500/50 blur opacity-70" />
                                <Card className="relative h-[22rem] rounded-[2rem] bg-white/95 backdrop-blur-md border border-white/80 shadow-2xl overflow-hidden">
                                    <CardContent className="p-0 h-full">
                                        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                                            {/* Imagen */}
                                            <div className="relative md:col-span-2 h-full">
                                                <img
                                                    src={team[currentSlide].image}
                                                    alt={team[currentSlide].name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-b ${team[currentSlide].color} opacity-20`}
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="md:col-span-3 p-8 flex flex-col justify-center h-full">
                                                <h3 className="text-3xl font-extrabold text-neutral-900">
                                                    {team[currentSlide].name}
                                                </h3>
                                                <p
                                                    className={`mt-2 text-lg font-semibold bg-gradient-to-r ${team[currentSlide].color} bg-clip-text text-transparent`}
                                                >
                                                    {team[currentSlide].role}
                                                </p>
                                                <div className="mt-6 flex gap-3">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                        Innovación
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                                                        Cercanía
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                        Excelencia
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Controles: mayor contraste / legibilidad */}
                                <Button
                                    onClick={prevSlide}
                                    variant="outline"
                                    size="icon"
                                    className="absolute -left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-md bg-white/30 text-white border border-white/60 ring-1 ring-white/50 shadow-lg hover:bg-white hover:text-neutral-900 hover:border-white"
                                    aria-label="Anterior"
                                    tabIndex={0}
                                >
                                    <ChevronLeft className="h-7 w-7" />
                                </Button>
                                <Button
                                    onClick={nextSlide}
                                    variant="outline"
                                    size="icon"
                                    className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-md bg-white/30 text-white border border-white/60 ring-1 ring-white/50 shadow-lg hover:bg-white hover:text-neutral-900 hover:border-white"
                                    aria-label="Siguiente"
                                    tabIndex={0}
                                >
                                    <ChevronRight className="h-7 w-7" />
                                </Button>
                            </div>

                            {/* Dots */}
                            <div className="flex justify-center gap-2 mt-6">
                                {team.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`h-2.5 w-2.5 rounded-full transition ${idx === currentSlide
                                            ? "bg-emerald-400 scale-110"
                                            : "bg-white/40 hover:bg-white/70"
                                            }`}
                                        aria-label={`Ir al miembro ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

/** Componente de preview lateral para el slider (solo desktop) */
function PreviewCard({
    member,
    side,
}: {
    member: {
        id: number;
        name: string;
        role: string;
        image: string;
        color: string;
    };
    side: "left" | "right";
}) {
    return (
        <div
            className={`absolute top-1/2 hidden md:block -translate-y-1/2 ${side === "left" ? "-left-28 -rotate-3" : "-right-28 rotate-3"
                } w-56 opacity-70`}
        >
            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/20 backdrop-blur-sm">
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-40 object-cover"
                />
                <div className="p-3 bg-white/80">
                    <div className="text-sm font-semibold text-neutral-900 line-clamp-1">
                        {member.name}
                    </div>
                    <div
                        className={`text-xs bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}
                    >
                        {member.role}
                    </div>
                </div>
            </div>
        </div>
    );
}
