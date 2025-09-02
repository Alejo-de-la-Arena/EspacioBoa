"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Clock, ArrowRight, Heart, Coffee } from "lucide-react";

/* ================= Animations ================= */
const container = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.12, delayChildren: 0.18 },
    },
};
const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ================= Mock data ================= */
type Post = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    readTime: string;
    featured: boolean;
    publishedAt: string;
};

const RAW_POSTS: Post[] = [
    {
        id: "yoga-1",
        title: "Rutina de Yoga Matutina de 20 minutos",
        slug: "yoga-matutino-20-minutos",
        excerpt:
            "Una secuencia accesible para activar el cuerpo, despejar la mente y arrancar el día con energía.",
        image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop&q=80",
        category: "Bienestar",
        readTime: "10 min",
        featured: true,
        publishedAt: "2024-08-01",
    },
    {
        id: "arte-1",
        title: "El poder de la Arteterapia: cómo la expresión creativa sana",
        slug: "arteterapia-expresion-creativa",
        excerpt:
            "Por qué crear arte ayuda a procesar emociones, reducir estrés y mejorar el bienestar mental.",
        image:
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&auto=format&fit=crop&q=80",
        category: "Arte",
        readTime: "8 min",
        featured: true,
        publishedAt: "2025-01-30",
    },
    {
        id: "nutricion-1",
        title: "Comer con atención plena: guía práctica de mindful eating",
        slug: "alimentacion-consciente-mindful-eating",
        excerpt:
            "Estrategias simples para comer más despacio, reconocer saciedad y disfrutar la comida.",
        image:
            "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&auto=format&fit=crop&q=80",
        category: "Nutrición",
        readTime: "7 min",
        featured: true,
        publishedAt: "2022-06-07",
    },
    {
        id: "cafe-1",
        title: "¿Qué es el café de especialidad?",
        slug: "que-es-cafe-especialidad",
        excerpt:
            "La definición de la SCA y qué significa para productores, tostadores y amantes del café.",
        image:
            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1600&auto=format&fit=crop&q=80",
        category: "Café",
        readTime: "6 min",
        featured: false,
        publishedAt: "2023-05-01",
    },
    {
        id: "mindfulness-1",
        title: "Cómo practicar mindfulness en la vida cotidiana",
        slug: "mindfulness-vida-cotidiana",
        excerpt:
            "Técnicas sencillas para integrar atención plena en tus rutinas y estar más presente.",
        image:
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&auto=format&fit=crop&q=80",
        category: "Bienestar",
        readTime: "6 min",
        featured: false,
        publishedAt: "2023-08-03",
    },
];

export default function BlogPage() {
    const [term, setTerm] = useState("");
    const [cat, setCat] = useState("all");
    const [mounted, setMounted] = useState(false);

    // Featured (snap como Home)
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [idx, setIdx] = useState(0);
    const featured = RAW_POSTS.filter((p) => p.featured);

    useEffect(() => setMounted(true), []);

    // Autoplay suave (pausa en hover/focus)
    const paused = useRef(false);
    useEffect(() => {
        if (!featured.length) return;
        const el = viewportRef.current;
        const id = setInterval(() => {
            if (paused.current || !el) return;
            const next = (idx + 1) % featured.length;
            el.scrollTo({ left: el.clientWidth * next, behavior: "smooth" });
            setIdx(next);
        }, 5000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx, featured.length]);

    const categories = ["all", ...Array.from(new Set(RAW_POSTS.map((p) => p.category)))];

    const posts = useMemo(() => {
        const t = term.toLowerCase();
        return RAW_POSTS.filter((p) => {
            const hit =
                p.title.toLowerCase().includes(t) ||
                p.excerpt.toLowerCase().includes(t) ||
                p.category.toLowerCase().includes(t);
            const okCat = cat === "all" || p.category === cat;
            return hit && okCat;
        });
    }, [term, cat]);

    if (!mounted) {
        return (
            <Layout>
                <div className="min-h-[60vh] grid place-items-center">
                    <div className="animate-pulse text-emerald-600">Cargando…</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <main className="font-sans">
                {/* ======================= HERO ======================= */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={container}
                    className="relative isolate min-h-[70vh] flex items-end overflow-hidden"
                >
                    <Image
                        src="https://res.cloudinary.com/dfrhrnwwi/image/upload/f_auto,q_80,w_2200/v1756150406/hrushi-chavhan-R_z0epttP-E-unsplash_qcwnqw.jpg"
                        alt="Ambiente BOA con plantas y luz cálida"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-boa-cocoa/55 via-boa-cocoa/25 to-transparent" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-boa-green/12 blur-3xl" />
                    <div className="pointer-events-none absolute -top-24 right-[-60px] w-[24rem] h-[24rem] rounded-full bg-boa-terra/14 blur-3xl" />

                    <div className="relative z-10 container mx-auto px-5 pb-14 sm:pb-20 text-center">
                        <motion.h1
                            variants={item}
                            className="text-white text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,.45)]"
                        >
                            Historias que se saborean
                        </motion.h1>
                        <motion.p variants={item} className="mt-4 max-w-3xl mx-auto text-white/95 text-lg sm:text-xl">
                            Bienestar, arte y café de especialidad. Notas cercanas, útiles y con la vibra BOA.
                        </motion.p>

                        {/* Buscador rápido */}
                        <motion.div variants={item} className="mt-6 flex justify-center">
                            <div className="relative w-full max-w-xl">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                                <Input
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder="Buscar artículos, temas, autores…"
                                    className="pl-10 h-12 bg-white/15 border-white/30 text-white placeholder:text-white/70 backdrop-blur-md"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Brush decor */}
                <div
                    className="relative h-8 -mt-3 opacity-[0.18] bg-[url('/assets/pincelada-verde.png')] bg-no-repeat bg-center bg-contain"
                    aria-hidden
                />

                {/* ======================= FEATURED (snap) ======================= */}
                {featured.length > 0 && (
                    <section className="relative py-16 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,#FEFCF7_0%,#FFFFFF_78%)]" />
                        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl sm:text-5xl font-extrabold text-boa-ink">
                                    Destacados <span className="text-boa-green">de la semana</span>
                                </h2>
                                <p className="mt-3 text-boa-ink/70 max-w-2xl mx-auto">
                                    Lecturas elegidas por el equipo: cortas, útiles y con mucha calidez.
                                </p>
                            </div>

                            <div
                                ref={viewportRef}
                                role="region"
                                aria-roledescription="carousel"
                                aria-label="Artículos destacados"
                                tabIndex={0}
                                className="relative w-full overflow-x-auto snap-x snap-mandatory scroll-smooth flex gap-6 [scrollbar-width:none] [-ms-overflow-style:none]"
                                onMouseEnter={() => (paused.current = true)}
                                onMouseLeave={() => (paused.current = false)}
                                onFocusCapture={() => (paused.current = true)}
                                onBlurCapture={() => (paused.current = false)}
                                style={{ scrollSnapType: "x mandatory" }}
                            >
                                {featured.map((p, i) => (
                                    <article key={p.id} className="snap-center shrink-0 w-full">
                                        <div className="relative h-[480px] md:h-[560px] rounded-[28px] overflow-hidden ring-1 ring-boa-ink/10 shadow-[0_18px_48px_rgba(2,6,23,.12)]">
                                            <Image src={p.image} alt={p.title} fill priority={i === 0} sizes="100vw" className="object-cover" />
                                            <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_80%,rgba(0,0,0,.35)_0%,rgba(0,0,0,.08)_55%,transparent_80%)]" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-boa-ink/45 via-boa-ink/15 to-transparent" />

                                            <div className="absolute inset-x-4 sm:inset-x-6 md:left-8 md:right-auto md:max-w-[560px] bottom-6 md:bottom-8">
                                                <div className="rounded-[20px] bg-boa-cream/95 ring-1 ring-boa-ink/20 shadow-[0_14px_40px_rgba(2,6,23,.22)]">
                                                    <div className="px-6 py-4 flex items-center justify-between">
                                                        <span className="text-[11px] uppercase tracking-[0.12em] text-boa-ink/80">{p.category}</span>
                                                        <span className="inline-flex items-center gap-2 text-[12.5px] text-boa-ink/85">
                                                            <Clock className="h-4 w-4" /> {p.readTime}
                                                        </span>
                                                    </div>
                                                    <div className="px-6 pb-5">
                                                        <h3 className="text-[26px] sm:text-[30px] font-extrabold text-boa-ink leading-tight">{p.title}</h3>
                                                        <p className="mt-2 text-boa-ink/90 text-[1rem] leading-relaxed">{p.excerpt}</p>
                                                        <div className="mt-5 flex gap-3">
                                                            <Link
                                                                href={`/blog/${p.slug}`}
                                                                className="inline-flex items-center gap-2 rounded-full border border-boa-ink/20 bg-white px-5 py-2.5 text-sm font-medium text-boa-ink shadow-[inset_0_1px_0_rgba(255,255,255,.7)] hover:bg-white"
                                                            >
                                                                Leer ahora <ArrowRight className="h-4 w-4" />
                                                            </Link>
                                                            <button className="rounded-full border border-boa-ink/15 bg-white px-3 py-2 text-boa-ink/80 hover:text-boa-ink">
                                                                <Heart className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* contador */}
                                            <div className="absolute top-4 right-5 text-[12px] text-white/90 bg-black/35 px-2.5 py-1 rounded-full ring-1 ring-white/25">
                                                {i + 1} / {featured.length}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="mt-5 flex items-center justify-center gap-2">
                                {featured.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const el = viewportRef.current;
                                            if (!el) return;
                                            setIdx(i);
                                            el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
                                        }}
                                        aria-label={`Ir al slide ${i + 1}`}
                                        className={[
                                            "h-2.5 rounded-full transition-all",
                                            i === idx ? "w-6 bg-boa-green" : "w-2.5 bg-boa-ink/25 hover:bg-boa-ink/35",
                                        ].join(" ")}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ======================= FILTROS ======================= */}
                <section className="py-8 border-y border-neutral-100 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-neutral-600">
                            <Filter className="h-5 w-5" />
                            <span className="font-medium">Explorar artículos</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCat(c)}
                                    className={[
                                        "px-4 py-2 rounded-full text-sm ring-1 transition",
                                        cat === c
                                            ? "bg-boa-green text-white ring-boa-green/50"
                                            : "bg-white text-boa-ink ring-boa-ink/15 hover:ring-boa-ink/25",
                                    ].join(" ")}
                                >
                                    {c === "all" ? "Todas" : c}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ======================= LISTA (cards estilo Home) ======================= */}
                <section className="py-16 bg-white relative">
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.04]"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><defs><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0.1'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.04'/></feComponentTransfer></filter></defs><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                            backgroundSize: "320px 320px",
                        }}
                    />
                    <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {posts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-neutral-500">No se encontraron artículos. Probá otra búsqueda.</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {posts.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/blog/${p.slug}`}
                                        aria-label={`Leer ${p.title}`}
                                        className="group relative block h-[480px] rounded-[32px] overflow-hidden transition-all duration-500 p-[2px]
                    [background:linear-gradient(135deg,rgba(30,122,102,.18),rgba(213,149,121,.18))]
                    hover:[background:linear-gradient(135deg,rgba(30,122,102,.32),rgba(213,149,121,.28))]"
                                    >
                                        <div className="relative h-full w-full rounded-[30px] overflow-hidden ring-1 ring-boa-ink/5 bg-black shadow-[0_12px_28px_rgba(2,6,23,.10)] group-hover:shadow-[0_18px_40px_rgba(2,6,23,.15)] transition-shadow duration-500">
                                            <Image
                                                src={p.image}
                                                alt={p.title}
                                                fill
                                                quality={90}
                                                sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                                                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                                            />
                                            {/* veladuras / viñeta */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-boa-ink/10 via-boa-ink/35 to-boa-ink/60" />
                                            <div className="absolute inset-0 bg-white/6 backdrop-blur-[1px]" />
                                            <span className="pointer-events-none absolute inset-4 rounded-[24px] ring-1 ring-white/15" />

                                            {/* contenido como Home */}
                                            <Card className="relative h-full bg-transparent border-0 text-white">
                                                <CardContent className="p-7 h-full flex flex-col justify-end">
                                                    {/* chip */}
                                                    <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/75 text-boa-green px-3 py-1 text-xs tracking-wide shadow-sm backdrop-blur">
                                                        <Coffee className="h-3.5 w-3.5" />
                                                        {p.category}
                                                    </div>

                                                    <h3 className="text-3xl sm:text-[32px] font-extrabold leading-tight drop-shadow-sm">{p.title}</h3>
                                                    <p className="mt-2 text-sm/relaxed sm:text-base text-white/90 line-clamp-3">{p.excerpt}</p>

                                                    <div className="mt-5 flex items-center gap-3">
                                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-all group-hover:bg-white/25 group-hover:border-white/60">
                                                            Leer <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                        </span>
                                                        <span className="inline-flex items-center text-white/85 text-sm">
                                                            <Clock className="h-4 w-4 mr-1" /> {p.readTime}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ======================= CTA NEWSLETTER ======================= */}
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-neutral-900 to-emerald-800" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08)_0%,transparent_50%)]" />

                    <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="text-left space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-16 h-16 bg-emerald-600/20 backdrop-blur-sm rounded-2xl">
                                        <Coffee className="h-8 w-8 text-emerald-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-emerald-300 text-lg font-semibold">Newsletter BOA</h3>
                                        <p className="text-emerald-200/80 text-sm">Únite a nuestra comunidad</p>
                                    </div>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                                    Ideas ricas cada <span className="text-emerald-300">semana</span>
                                </h2>
                                <p className="text-emerald-100/90">Recibí recetas, prácticas de bienestar y agenda de talleres en tu mail.</p>
                            </div>

                            <div className="lg:pl-8">
                                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl shadow-emerald-900/20">
                                    <CardHeader className="text-center pb-1">
                                        <h3 className="text-2xl font-bold text-neutral-900">Suscribite</h3>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="relative">
                                            <Input
                                                type="email"
                                                placeholder="tu@email.com"
                                                className="h-12 pl-11 text-base border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                            />
                                            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 4h16v16H4z" fill="none" />
                                                <path d="M4 8l8 5 8-5" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold">
                                            Suscribirme <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        <p className="text-center text-xs text-neutral-500">Podés cancelar cuando quieras.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* util local */}
            <style jsx>{`
        :global(.boa-cream) {
          background-color: #faf8f2;
        }
      `}</style>
        </Layout>
    );
}
