// pages/blog/index.tsx
import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Heart, Coffee } from "lucide-react";

/* ================= Animations ================= */
const container = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};
const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ================= Mock data (plug a tu CMS cuando quieras) ================= */
type Post = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    readTime: string; // queda en el tipo/datos pero ya no se muestra
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
            "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    useEffect(() => setMounted(true), []);

    const featured = RAW_POSTS.filter((p) => p.featured);
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

    /* ===== mapping de color por categoría (sutil) ===== */
    const catColor = (c: string) =>
        c === "Café"
            ? "bg-amber-100 text-amber-900"
            : c === "Arte"
                ? "bg-rose-100 text-rose-900"
                : c === "Bienestar"
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-sky-100 text-sky-900";

    return (
        <Layout>
            <main className="font-sans">
                {/* ======================= HERO (nuevo — editorial split) ======================= */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={container}
                    className="relative isolate overflow-hidden py-16 sm:py-20"
                >
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
                            {/* Columna texto */}
                            <motion.div variants={item} className="lg:col-span-5 flex flex-col justify-center">
                                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-boa-ink">
                                    Historias que <span className="text-boa-green">se saborean</span>
                                </h1>
                                <p className="mt-4 text-neutral-700 text-lg">
                                    Bienestar, arte y café de especialidad. Lecturas cercanas, útiles y con la vibra BOA.
                                </p>

                                {/* Buscador + temas populares */}
                                <div className="mt-6 space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                                        <Input
                                            value={term}
                                            onChange={(e) => setTerm(e.target.value)}
                                            placeholder="Buscar artículos, temas, autores…"
                                            className="pl-10 h-12 bg-white border-neutral-200"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Columna collage */}
                            <motion.div variants={item} className="lg:col-span-7">
                                <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[420px] sm:h-[500px]">
                                    {/* alto */}
                                    <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden ring-1 ring-boa-ink/10 shadow-xl">
                                        <Image
                                            src="https://images.unsplash.com/photo-1631130650210-e3863c8d9f8d?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt="Café de especialidad en mesa cálida"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* dos piezas chicas */}
                                    <div className="relative rounded-3xl overflow-hidden ring-1 ring-boa-ink/10">
                                        <Image
                                            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=799&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt="Cuaderno y lápiz — escribir y crear"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative rounded-3xl overflow-hidden ring-1 ring-boa-ink/10">
                                        <Image
                                            src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755904741/boa-bowl_v6wn6a.jpg"
                                            alt="Charla entre amigos"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* halos suaves */}
                    <div className="pointer-events-none absolute -left-24 -bottom-24 w-[28rem] h-[28rem] rounded-full bg-boa-green/10 blur-3xl" />
                    <div className="pointer-events-none absolute -right-24 -top-24 w-[24rem] h-[24rem] rounded-full bg-boa-terra/12 blur-3xl" />
                </motion.section>

                {/* ======================= DESTACADOS (magazine layout) ======================= */}
                {featured.length > 0 && (
                    <section className="relative py-14 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,#FEFCF7_0%,#FFFFFF_78%)]" />
                        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl sm:text-5xl font-extrabold text-boa-ink">
                                    Destacados <span className="text-boa-green">de la semana</span>
                                </h2>
                                <p className="mt-3 text-boa-ink/70 max-w-2xl mx-auto">
                                    Selección editorial del equipo BOA. Para leer con un café al lado.
                                </p>
                            </div>

                            {/* Grid 2/3 + 1/3 (sin slider) */}
                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Principal (2 columnas) */}
                                <article className="lg:col-span-2 relative h-[420px] md:h-[520px] rounded-[28px] overflow-hidden ring-1 ring-boa-ink/10 shadow-[0_18px_48px_rgba(2,6,23,.12)]">
                                    <Image
                                        src={featured[0].image}
                                        alt={featured[0].title}
                                        fill
                                        priority
                                        sizes="100vw"
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-boa-ink/60 via-boa-ink/20 to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="max-w-xl rounded-2xl bg-white/95 ring-1 ring-boa-ink/15 p-6 backdrop-blur">
                                            <div className="flex items-center text-[12px] mb-1">
                                                <span className={`px-2 py-1 rounded-full ${catColor(featured[0].category)}`}>
                                                    {featured[0].category}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl font-extrabold text-boa-ink leading-tight">
                                                {featured[0].title}
                                            </h3>
                                            <p className="mt-2 text-boa-ink/80">{featured[0].excerpt}</p>
                                            <div className="mt-4">
                                                <Link
                                                    href={`/blog/${featured[0].slug}`}
                                                    className="inline-flex items-center gap-2 rounded-full border border-boa-ink/20 bg-white px-4 py-2 text-sm font-medium text-boa-ink hover:bg-boa-cream"
                                                >
                                                    Leer ahora <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>

                                {/* Secundarios apilados */}
                                <div className="space-y-6">
                                    {featured.slice(1, 3).map((p) => (
                                        <article
                                            key={p.id}
                                            className="relative h-[200px] sm:h-[240px] rounded-[20px] overflow-hidden ring-1 ring-boa-ink/10"
                                        >
                                            <Image src={p.image} alt={p.title} fill className="object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-boa-ink/55 via-boa-ink/25 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="rounded-xl bg-white/95 ring-1 ring-boa-ink/15 p-4 backdrop-blur">
                                                    <div className="flex items-center text-[12px] mb-1">
                                                        <span className={`px-2 py-1 rounded-full ${catColor(p.category)}`}>{p.category}</span>
                                                    </div>
                                                    <h3 className="text-[18px] font-extrabold text-boa-ink leading-tight line-clamp-2">
                                                        {p.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ======================= FILTROS ======================= */}
                <section className="py-8 border-y border-neutral-100 bg-white sticky top-0 z-20">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-neutral-600">
                            <Coffee className="h-5 w-5" />
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

                {/* ======================= LISTA (row cards – experiencia de lectura) ======================= */}
                <section className="py-16 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {posts.length === 0 ? (
                            <div className="text-center py-20 text-neutral-500">
                                No se encontraron artículos. Probá otra búsqueda.
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {posts.map((p) => (
                                    <li key={p.id}>
                                        <Link
                                            href={`/blog/${p.slug}`}
                                            className="group grid md:grid-cols-12 gap-4 md:gap-6 p-2 rounded-3xl ring-1 ring-boa-ink/10 hover:ring-boa-ink/20 transition"
                                        >
                                            {/* thumb */}
                                            <div className="relative md:col-span-5 h-[220px] md:h-[180px] rounded-2xl overflow-hidden">
                                                <Image
                                                    src={p.image}
                                                    alt={p.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                                />
                                                <span
                                                    className={`absolute left-3 top-3 px-2 py-1 rounded-full text-xs ${catColor(
                                                        p.category
                                                    )}`}
                                                >
                                                    {p.category}
                                                </span>
                                            </div>

                                            {/* texto */}
                                            <div className="md:col-span-7 flex flex-col justify-center px-2 md:px-0">
                                                <h3 className="text-xl sm:text-2xl font-extrabold text-boa-ink leading-snug">
                                                    {p.title}
                                                </h3>
                                                <p className="mt-2 text-neutral-700 line-clamp-3">{p.excerpt}</p>
                                                <div className="mt-4 flex items-center gap-4 text-sm text-neutral-600">
                                                    {/* quitado: tiempo de lectura */}
                                                    <span className="inline-flex items-center">
                                                        <Heart className="h-4 w-4 mr-1" /> Guardar
                                                    </span>
                                                    <span className="ml-auto inline-flex items-center gap-2 text-boa-green font-semibold">
                                                        Leer{" "}
                                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
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
                                <p className="text-emerald-100/90">
                                    Recibí recetas, prácticas de bienestar y agenda de talleres en tu mail.
                                </p>
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
                                            <svg
                                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path d="M4 4h16v16H4z" fill="none" />
                                                <path
                                                    d="M4 8l8 5 8-5"
                                                    stroke="#9ca3af"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
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
