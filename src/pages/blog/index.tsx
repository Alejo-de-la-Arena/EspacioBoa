// pages/blog/index.tsx
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Coffee } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";



/* ================= Animations ================= */
const container = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};
const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const sectionFade = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ================= Hero images ================= */
const HERO_IMAGES = [
    {
        src: "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5210.webp",
        alt: "Café de especialidad en mesa cálida",
    },
    {
        src: "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5420.webp",
        alt: "Cuaderno y lápiz — escribir y crear",
    },
    {
        src: "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5190.webp",
        alt: "Charla entre amigos",
    },
];

/* ================= Mock data ================= */
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
            "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5251.webp",
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
            "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5527.webp",
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
            "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5605.webp",
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
            "https://gzwgocdsdkamimxgmcue.supabase.co/storage/v1/object/public/boa-media/1200/img-5266.webp",
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

type Article = {
    title: string;
    subtitle: string;
    sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

const POST_ARTICLES: Record<string, Article> = {
    "que-es-cafe-especialidad": {
        title: "¿Qué es el café de especialidad?",
        subtitle:
            "Una guía simple para entender por qué se habla tanto de “especialidad” y qué cambia realmente en la taza.",
        sections: [
            {
                heading: "La idea central",
                paragraphs: [
                    "Café de especialidad no significa “caro” ni “snob”. Significa que el café fue producido, procesado y tostado con estándares muy altos, cuidando cada paso.",
                    "En la práctica, se traduce en una taza más limpia, con aromas claros, acidez agradable y dulzor natural. No es magia: es trabajo bien hecho a lo largo de toda la cadena."
                ],
            },
            {
                heading: "Qué lo diferencia del café común",
                paragraphs: [
                    "El diferencial más grande es la trazabilidad: se conoce de dónde viene, quién lo produce y cómo se procesó. Eso permite consistencia y calidad.",
                ],
                bullets: [
                    "Origen y lote identificables (trazabilidad).",
                    "Procesos cuidados (lavado, natural, honey, etc.).",
                    "Tostado pensado para resaltar el perfil del grano, no para taparlo.",
                ],
            },
            {
                heading: "Cómo lo disfrutás en BOA",
                paragraphs: [
                    "La misma bolsa puede cambiar muchísimo según molienda, método y receta. Por eso hay una búsqueda: encontrar el punto donde ese café brilla.",
                    "Si querés empezar simple: pedí un filtro (V60 o similar) o un flat white bien calibrado y probá prestar atención a aromas y postgusto."
                ],
            },
        ],
    },

    "yoga-matutino-20-minutos": {
        title: "Rutina de Yoga Matutina de 20 minutos",
        subtitle:
            "Una secuencia corta para activar el cuerpo sin exigirte: movilidad, respiración y foco.",
        sections: [
            {
                heading: "Por qué funciona",
                paragraphs: [
                    "A la mañana, el cuerpo suele estar rígido y la mente acelerada. Una rutina breve ordena la respiración, mejora movilidad y te deja con energía estable.",
                    "La clave no es “hacer perfecto”, sino moverte con intención y salir del modo automático."
                ],
            },
            {
                heading: "Estructura sugerida (20 min)",
                paragraphs: [
                    "Podés repetirla 3–5 días por semana. Si estás muy duro, hacé menos rango, pero mantené la respiración."
                ],
                bullets: [
                    "2 min: respiración nasal + estiramiento suave.",
                    "6 min: movilidad de columna y caderas (gato-vaca, rotaciones).",
                    "8 min: postura de pie + fuerza suave (guerreros, plancha modificada).",
                    "4 min: relajación corta + intención para el día.",
                ],
            },
            {
                heading: "Tips para que se vuelva hábito",
                paragraphs: [
                    "Dejá la esterilla lista la noche anterior. Si dudás, hacé solo 5 minutos: la mayoría de las veces terminás haciendo más.",
                    "Si te mareás o te agitás, bajá intensidad y volvé a respiración nasal."
                ],
            },
        ],
    },

    "arteterapia-expresion-creativa": {
        title: "El poder de la Arteterapia: cómo la expresión creativa sana",
        subtitle:
            "No se trata de talento: se trata de usar lo creativo como herramienta de regulación emocional.",
        sections: [
            {
                heading: "Qué es (sin vueltas)",
                paragraphs: [
                    "La arteterapia usa procesos creativos (dibujar, pintar, collage, escritura) para explorar emociones, bajar estrés y generar claridad.",
                    "No estás “produciendo arte”: estás procesando. La obra final es secundaria."
                ],
            },
            {
                heading: "Por qué ayuda tanto",
                paragraphs: [
                    "Cuando algo cuesta ponerlo en palabras, lo creativo habilita otra vía. Eso reduce rumiación y le da salida a lo que queda trabado.",
                ],
                bullets: [
                    "Te saca del pensamiento repetitivo y te trae al cuerpo.",
                    "Hace visible lo interno (y eso ordena).",
                    "Baja activación: foco + repetición + presencia.",
                ],
            },
            {
                heading: "Una práctica BOA simple",
                paragraphs: [
                    "Probá 10 minutos: elegí 3 colores y dibujá sin objetivo. Después escribí una frase: “Esto se siente como…”.",
                    "No busques lindo. Buscá honesto."
                ],
            },
        ],
    },

    "alimentacion-consciente-mindful-eating": {
        title: "Comer con atención plena: guía práctica de mindful eating",
        subtitle:
            "Herramientas concretas para comer más lento, registrar saciedad y disfrutar sin culpa.",
        sections: [
            {
                heading: "Qué es (y qué no es)",
                paragraphs: [
                    "Mindful eating no es una dieta. Es una forma de comer con atención: registrar hambre, ritmo, sabor y saciedad.",
                    "Te ayuda especialmente si comés apurado, ansioso o con distracciones constantes."
                ],
            },
            {
                heading: "Reglas simples que cambian todo",
                paragraphs: [
                    "No hace falta hacerlo perfecto. Con aplicar 1 o 2 cosas por comida, ya cambia la experiencia."
                ],
                bullets: [
                    "Primeros 3 bocados: comelos lento, notando sabor y textura.",
                    "Pausa a mitad de plato: 30 segundos de respiración.",
                    "Chequeo de saciedad: “¿seguiría comiendo esto si no estuviera tan rico?”",
                ],
            },
            {
                heading: "El objetivo real",
                paragraphs: [
                    "Que tu cuerpo vuelva a tener voz. Cuando comés con atención, es más fácil regular porciones sin pelearte con la comida.",
                ],
            },
        ],
    },

    "mindfulness-vida-cotidiana": {
        title: "Cómo practicar mindfulness en la vida cotidiana",
        subtitle:
            "Micro-hábitos que podés aplicar hoy: sin mística, con impacto real en estrés y foco.",
        sections: [
            {
                heading: "Mindfulness aplicado",
                paragraphs: [
                    "Mindfulness es entrenar atención. No es dejar la mente en blanco: es notar cuándo te fuiste y volver.",
                    "En la vida cotidiana, se traduce en menos ruido mental y decisiones más claras."
                ],
            },
            {
                heading: "Tres prácticas fáciles",
                bullets: [
                    "1 minuto de respiración nasal antes de abrir WhatsApp.",
                    "Una sola tarea por 10 minutos (sin cambiar de pestaña).",
                    "Caminar 2 minutos prestando atención al cuerpo (pies, postura, aire).",
                ],
                paragraphs: [
                    "Elegí una y repetila. El poder está en la frecuencia, no en la duración."
                ],
            },
            {
                heading: "Cómo sostenerlo",
                paragraphs: [
                    "Pegalo a algo que ya hacés (café, ducha, computadora). Si esperás “tener tiempo”, no pasa.",
                ],
            },
        ],
    },
};

const getArticle = (slug: string): Article =>
    POST_ARTICLES[slug] || {
        title: "Artículo",
        subtitle: "Una lectura breve para inspirarte en BOA.",
        sections: [
            {
                heading: "Pronto",
                paragraphs: ["Estamos preparando este contenido. Volvé en unos días 💚"],
            },
        ],
    };



export default function BlogPage() {
    const [term, setTerm] = useState("");
    const [cat, setCat] = useState("all");
    const [mounted, setMounted] = useState(false);

    const [openPost, setOpenPost] = useState<Post | null>(null);
    const isModalOpen = !!openPost;


    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterLoading, setNewsletterLoading] = useState(false);
    const [newsletterStatus, setNewsletterStatus] = useState<
        null | { type: "success" | "error"; msg: string }
    >(null);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNewsletterStatus(null);

        const email = newsletterEmail.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setNewsletterStatus({
                type: "error",
                msg: "Ingresá un email válido.",
            });
            return;
        }

        try {
            setNewsletterLoading(true);
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message || "No pudimos suscribirte.");
            }

            setNewsletterStatus({
                type: "success",
                msg: "¡Listo! Te vamos a escribir cuando haya novedades ricas.",
            });
            setNewsletterEmail("");
        } catch (err: any) {
            setNewsletterStatus({
                type: "error",
                msg: err?.message || "Ocurrió un error. Probá de nuevo.",
            });
        } finally {
            setNewsletterLoading(false);
        }
    };


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
            <section>
                <div className="min-h-[60vh] grid place-items-center">
                    <div className="animate-pulse text-emerald-600">Cargando…</div>
                </div>
            </section>
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
        <section>
            <main className="font-sans">
                {/* ======================= HERO (texto + imágenes) ======================= */}
                <motion.section
                    className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24"
                    variants={sectionFade}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-12 gap-2 items-stretch">
                            {/* Columna texto */}
                            <motion.div
                                variants={item}
                                className="lg:col-span-5 flex flex-col justify-center"
                            >
                                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-boa-ink">
                                    Historias que{" "}
                                    <span className="text-boa-green lg:block lg:mt-1">
                                        se saborean
                                    </span>
                                </h1>
                                <p className="mt-4 text-neutral-700 text-lg max-w-md">
                                    Bienestar, arte y café de especialidad. Lecturas cercanas, útiles
                                    y con la vibra BOA.
                                </p>
                            </motion.div>

                            {/* Columna imágenes */}
                            <motion.div variants={item} className="lg:col-span-7">
                                <div className="sm:hidden mt-8">
                                    <div className="relative">
                                        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent" />
                                        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />
                                        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 pl-1 pr-6 [-ms-overflow-style:none] [scrollbar-width:none]">
                                            {HERO_IMAGES.map((img) => (
                                                <div
                                                    key={img.src}
                                                    className="relative group snap-center shrink-0 w-[82%] h-[320px] rounded-[32px] overflow-hidden ring-1 ring-boa-ink/10 bg-neutral-100/40"
                                                >
                                                    <Image
                                                        src={img.src}
                                                        alt={img.alt}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                                    />
                                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 mix-blend-multiply" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop / tablet: collage original, solo >= sm */}
                                <div className="hidden sm:grid grid-cols-3 grid-rows-2 gap-4 h-[420px] sm:h-[500px]">
                                    {/* alto */}
                                    <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden ring-1 ring-boa-ink/10 shadow-xl">
                                        <Image
                                            src={HERO_IMAGES[0].src}
                                            alt={HERO_IMAGES[0].alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* dos piezas chicas */}
                                    <div className="relative rounded-3xl overflow-hidden ring-1 ring-boa-ink/10">
                                        <Image
                                            src={HERO_IMAGES[1].src}
                                            alt={HERO_IMAGES[1].alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative rounded-3xl overflow-hidden ring-1 ring-boa-ink/10">
                                        <Image
                                            src={HERO_IMAGES[2].src}
                                            alt={HERO_IMAGES[2].alt}
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

                {/* ======================= DESTACADOS ======================= */}
                {featured.length > 0 && (
                    <motion.section
                        className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
                        variants={sectionFade}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,#FEFCF7_0%,#FFFFFF_78%)]" />
                        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl sm:text-5xl font-extrabold text-boa-ink">
                                    Destacados{" "}
                                    <span className="text-boa-green">de la semana</span>
                                </h2>
                                <p className="mt-3 text-boa-ink/70 max-w-2xl mx-auto">
                                    Selección editorial del equipo BOA. Para leer con un café al
                                    lado.
                                </p>
                            </div>

                            {/* Grid 2/3 + 1/3 */}
                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Principal */}
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
                                                <span
                                                    className={`px-2 py-1 rounded-full ${catColor(
                                                        featured[0].category
                                                    )}`}
                                                >
                                                    {featured[0].category}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl font-extrabold text-boa-ink leading-tight">
                                                {featured[0].title}
                                            </h3>
                                            <p className="mt-2 text-boa-ink/80">
                                                {featured[0].excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </article>

                                {/* Secundarios */}
                                <div className="space-y-6">
                                    {featured.slice(1, 3).map((p) => (
                                        <article
                                            key={p.id}
                                            className="relative h-[200px] sm:h-[240px] rounded-[20px] overflow-hidden ring-1 ring-boa-ink/10"
                                        >
                                            <Image
                                                src={p.image}
                                                alt={p.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-boa-ink/55 via-boa-ink/25 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="rounded-xl bg-white/95 ring-1 ring-boa-ink/15 p-4 backdrop-blur">
                                                    <div className="flex items-center text-[12px] mb-1">
                                                        <span
                                                            className={`px-2 py-1 rounded-full ${catColor(
                                                                p.category
                                                            )}`}
                                                        >
                                                            {p.category}
                                                        </span>
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
                    </motion.section>
                )}

                {/* ======================= FILTROS + BUSCADOR ======================= */}
                <section className="py-8 border-y border-neutral-100 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                        <div className="flex items-center gap-2 text-neutral-600">
                            <Coffee className="h-5 w-5" />
                            <span className="font-medium">Explorar artículos</span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center md:justify-start">
                            {/* Búsqueda */}
                            <div className="relative w-full md:w-[360px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                                <Input
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder="Buscar artículos, temas…"
                                    className="pl-9 h-11 bg-white border-neutral-200 w-full"
                                />
                            </div>

                            {/* Select de categorías */}
                            <div className="w-full xs:w-auto md:w-auto">
                                <Select value={cat} onValueChange={setCat}>
                                    <SelectTrigger
                                        className="w-full h-10 md:h-11 rounded-full border border-boa-ink/15 bg-white text-sm text-boa-ink px-6 mr-2 shadow-sm focus:ring-2 focus:ring-boa-green/40 focus:border-boa-green cursor-pointer hover:border-boa-green/60 hover:bg-boa-cream/70"
                                    >
                                        <SelectValue placeholder="Todas las categorías" />
                                    </SelectTrigger>

                                    <SelectContent className="rounded-2xl border border-boa-ink/10 bg-white shadow-xl">
                                        {categories.map((c) => (
                                            <SelectItem
                                                key={c}
                                                value={c}
                                                className="py-2.5 px-3 text-sm font-medium text-boa-ink/90 data-[highlighted]:bg-boa-cream/80 data-[highlighted]:text-boa-ink"
                                            >
                                                {c === "all" ? "Todas las categorías" : c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ======================= LISTA (artículos) ======================= */}
                <section className="py-8 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {posts.length === 0 ? (
                            <div className="text-center py-20 text-neutral-500">
                                No se encontraron artículos. Probá otra búsqueda.
                            </div>
                        ) : (
                            <motion.ul
                                className="space-y-6"
                                variants={container}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {posts.map((p) => (
                                    <motion.li key={p.id} variants={item}>
                                        <a
                                            href={`/blog/${p.slug}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpenPost(p);
                                            }}
                                            className="group grid md:grid-cols-12 gap-4 md:gap-6 p-2 rounded-3xl ring-1 ring-boa-ink/10 hover:ring-boa-ink/20 transition cursor-pointer"
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

                                                <div className="mt-4 flex items-center text-sm text-neutral-600">
                                                    <span className="ml-auto mr-3 inline-flex items-center gap-2 text-boa-green font-semibold">
                                                        Leer{" "}
                                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </div>
                </section>

                {openPost && (
                    <Dialog open={isModalOpen} onOpenChange={(v) => !v && setOpenPost(null)}>
                        <DialogContent className="w-[96vw] max-w-5xl p-0 overflow-hidden rounded-[28px]">
                            {/* contenedor scrolleable */}
                            <div className="h-[90vh] overflow-y-auto">
                                {/* HERO del artículo */}
                                <div className="relative h-[320px] sm:h-[380px]">
                                    <Image
                                        src={openPost.image}
                                        alt={openPost.title}
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="(max-width: 640px) 96vw, 1024px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

                                    {/* info arriba */}
                                    <div className="absolute left-6 right-6 bottom-6">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${catColor(openPost.category)}`}>
                                                {openPost.category}
                                            </span>
                                            <span className="text-xs text-white/80">
                                                {new Date(openPost.publishedAt).toLocaleDateString("es-AR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                                            {getArticle(openPost.slug).title}
                                        </h2>
                                        <p className="mt-2 text-white/85 max-w-3xl">
                                            {getArticle(openPost.slug).subtitle}
                                        </p>
                                    </div>

                                    {/* botón cerrar flotante */}
                                    <div className="absolute top-4 right-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setOpenPost(null)}
                                            className="bg-white/90 hover:bg-white border-white/40 rounded-full"
                                        >
                                            Cerrar
                                        </Button>
                                    </div>
                                </div>

                                {/* CUERPO */}
                                <div className="px-6 sm:px-10 py-8 bg-white">
                                    <div className="prose prose-neutral max-w-none">
                                        {getArticle(openPost.slug).sections.map((s) => (
                                            <section key={s.heading} className="mb-8">
                                                <h3 className="text-xl sm:text-2xl font-extrabold text-boa-ink mb-3">
                                                    {s.heading}
                                                </h3>

                                                {s.paragraphs.map((p, idx) => (
                                                    <p key={idx} className="text-neutral-700 leading-relaxed">
                                                        {p}
                                                    </p>
                                                ))}

                                                {s.bullets?.length ? (
                                                    <ul className="mt-3 space-y-2">
                                                        {s.bullets.map((b) => (
                                                            <li key={b} className="text-neutral-700">
                                                                {b}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : null}
                                            </section>
                                        ))}

                                        {/* mini cierre BOA */}
                                        <div className="mt-10 rounded-2xl bg-boa-cream/60 ring-1 ring-boa-ink/10 p-5">
                                            <p className="text-boa-ink/80">
                                                Si querés, cuando vengas a BOA preguntanos por recomendaciones para acompañar esta lectura
                                                (un café, una práctica o un taller).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}


                {/* ======================= CTA NEWSLETTER ======================= */}
                <motion.section
                    className="relative pt-24 pb-20 overflow-hidden"
                    variants={sectionFade}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
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
                                        <h3 className="text-emerald-300 text-lg font-semibold">
                                            Newsletter BOA
                                        </h3>
                                        <p className="text-emerald-200/80 text-sm">
                                            Únite a nuestra comunidad
                                        </p>
                                    </div>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                                    Ideas ricas cada{" "}
                                    <span className="text-emerald-300">semana</span>
                                </h2>
                                <p className="text-emerald-100/90">
                                    Recibí recetas, prácticas de bienestar y agenda de talleres en
                                    tu mail.
                                </p>
                            </div>

                            <div className="lg:pl-8">
                                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl shadow-emerald-900/20">
                                    <CardHeader className="text-center pb-1">
                                        <h3 className="text-2xl font-bold text-neutral-900">
                                            Suscribite
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                            <div className="relative">
                                                <Input
                                                    type="email"
                                                    placeholder="tu@email.com"
                                                    className="h-12 pl-11 text-base border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                                    value={newsletterEmail}
                                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                                    disabled={newsletterLoading}
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

                                            <Button
                                                type="submit"
                                                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold"
                                                disabled={newsletterLoading}
                                            >
                                                {newsletterLoading ? (
                                                    <span className="inline-flex items-center">
                                                        <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Enviando...
                                                    </span>
                                                ) : (
                                                    <>
                                                        Suscribirme <ArrowRight className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>

                                        {newsletterStatus && (
                                            <p
                                                className={`text-center text-xs ${newsletterStatus.type === "success"
                                                    ? "text-emerald-700"
                                                    : "text-rose-600"
                                                    }`}
                                            >
                                                {newsletterStatus.msg}
                                            </p>
                                        )}

                                        <p className="text-center text-xs text-neutral-500">
                                            Podés cancelar cuando quieras.
                                        </p>
                                    </CardContent>

                                </Card>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>
        </section>
    );
}
