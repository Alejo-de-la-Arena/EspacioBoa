
import { useState, useMemo, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
    BookOpen,
    Search,
    Filter,
    Calendar,
    Clock,
    Heart,
    Share2,
    ArrowRight,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    Coffee,
    Leaf,
    Palette,
    MapPin,
    Star,
    Mail,
    CheckCircle
} from "lucide-react";

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [mounted, setMounted] = useState(false);

    // Slider states
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mock data - updated with real articles and accurate information
    const blogPosts = [
        {
            id: "yoga-1",
            title: "Rutina de Yoga Matutina de 20 minutos",
            slug: "yoga-matutino-20-minutos",
            excerpt:
                "Una secuencia corta y accesible para activar el cuerpo, despejar la mente y arrancar el día con energía.",
            content: "Práctica guiada enfocada en respiración, estiramientos suaves y equilibrio.",
            // Imagen relacionada (yoga por la mañana)
            image:
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop&q=80",
            category: "Bienestar",
            author: {
                name: "Yoga Journal",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b4b12eb1?w=100",
                bio: "Guías y prácticas de yoga",
            },
            publishedAt: "2024-08-01",
            publishedFormatted: "ago 2024",
            readTime: "10 min",
            tags: ["yoga", "mañana", "bienestar", "movilidad"],
            featured: true,
            sortOrder: 1,
            icon: Heart,
            subtitle: "Yoga, meditación y bienestar",
            externalUrl:
                "https://www.yogajournal.com/practice/a-superquick-20-minute-morning-yoga-routine/"
        },

        {
            id: "arte-1",
            title: "El poder de la Arteterapia: cómo la expresión creativa sana",
            slug: "arteterapia-expresion-creativa",
            excerpt:
                "Por qué crear arte es una vía efectiva para procesar emociones, reducir estrés y mejorar el bienestar mental.",
            content: "Principios de la arteterapia y evidencia clínica reciente.",
            // Imagen de pinceles/arte
            image:
                "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&auto=format&fit=crop&q=80",
            category: "Arte",
            author: {
                name: "Psychology Today",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b4b12eb1?w=100",
                bio: "Publicación de psicología y salud mental",
            },
            publishedAt: "2025-01-30",
            publishedFormatted: "ene 2025",
            readTime: "8 min",
            tags: ["arte", "terapia", "emociones", "salud mental"],
            featured: true,
            sortOrder: 2,
            icon: Palette,
            subtitle: "Creatividad, expresión y talleres artísticos",
            externalUrl:
                "https://www.psychologytoday.com/intl/blog/arts-and-health/202501/the-magic-of-art-therapy"
        },

        {
            id: "nutricion-1",
            title: "Comer con atención plena: guía práctica de mindful eating",
            slug: "alimentacion-consciente-mindful-eating",
            excerpt:
                "Estrategias simples para comer más despacio, reconocer saciedad y disfrutar más la comida.",
            content: "Mindful eating aplicado al día a día, con base en investigación.",
            // Imagen comida saludable
            image:
                "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&auto=format&fit=crop&q=80",
            category: "Nutrición",
            author: {
                name: "Harvard Health Publishing",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
                bio: "Harvard Medical School",
            },
            publishedAt: "2022-06-07",
            publishedFormatted: "jun 2022",
            readTime: "7 min",
            tags: ["alimentación", "consciente", "nutrición", "salud"],
            featured: true,
            sortOrder: 3,
            icon: Leaf,
            subtitle: "Alimentación consciente y opciones saludables",
            externalUrl:
                "https://www.health.harvard.edu/blog/slow-down-and-try-mindful-eating-202206072764"
        },

        {
            id: "cafe-1",
            title: "¿Qué es el café de especialidad? (definición SCA)",
            slug: "que-es-cafe-especialidad-sca",
            excerpt:
                "La definición basada en atributos de la Specialty Coffee Association y qué significa para productores, tostadores y consumidores.",
            content: "Marco de calidad de la SCA y puntos clave para entender el concepto.",
            // Imagen café de especialidad
            image:
                "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1600&auto=format&fit=crop&q=80",
            category: "Café",
            author: {
                name: "Specialty Coffee Association",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
                bio: "Organización líder del sector",
            },
            publishedAt: "2023-05-01",
            publishedFormatted: "may 2023",
            readTime: "6 min",
            tags: ["café", "especialidad", "calidad", "SCA"],
            featured: false,
            sortOrder: 4,
            icon: Coffee,
            subtitle: "Café de especialidad, procesos y cultura",
            externalUrl:
                "https://sca.coffee/research/definition-of-specialty-coffee"
        },

        {
            id: "mindfulness-1",
            title: "Cómo practicar mindfulness en la vida cotidiana",
            slug: "mindfulness-vida-cotidiana",
            excerpt:
                "Técnicas sencillas para integrar atención plena en tus rutinas y estar más presente en lo diario.",
            content: "Respiración, anclajes y hábitos micro para el día a día.",
            // Imagen mindfulness
            image:
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&auto=format&fit=crop&q=80",
            category: "Bienestar",
            author: {
                name: "Mindful Magazine",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
                bio: "Expertos en mindfulness y meditación",
            },
            publishedAt: "2023-08-03",
            publishedFormatted: "ago 2023",
            readTime: "6 min",
            tags: ["mindfulness", "meditación", "rutina"],
            featured: false,
            sortOrder: 5,
            icon: Heart,
            subtitle: "Atención plena y equilibrio",
            externalUrl:
                "https://www.mindful.org/how-to-practice-mindfulness-in-daily-life/"
        }
    ];

    const filteredPosts = useMemo(() => {
        return blogPosts
            .filter((post) => {
                const term = searchTerm.toLowerCase();
                const matchesSearch =
                    post.title.toLowerCase().includes(term) ||
                    post.excerpt.toLowerCase().includes(term) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(term));
                const matchesCategory =
                    selectedCategory === "all" || post.category === selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [searchTerm, selectedCategory]);

    const categories = Array.from(new Set(blogPosts.map((p) => p.category)));
    const featuredPosts = blogPosts.filter((p) => p.featured);

    // Slider logic
    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [featuredPosts.length, isTransitioning]);

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [featuredPosts.length, isTransitioning]);

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning || index === currentSlide) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [currentSlide, isTransitioning]);

    // Auto-play effect
    useEffect(() => {
        if (!isAutoPlaying || featuredPosts.length <= 1) return;

        const interval = setInterval(nextSlide, 2500); // Reduced from 4000 to 2500ms
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, featuredPosts.length]);

    // Pause auto-play on user interaction
    const handleUserInteraction = () => {
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    if (!mounted) {
        return (
            <Layout>
                <div className="font-sans min-h-screen bg-white">
                    <div className="py-24 bg-gradient-to-br from-neutral-50 via-emerald-50/30 to-white">
                        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-4xl mx-auto">
                                <div className="h-8 w-8 mx-auto mb-6 bg-emerald-100 rounded animate-pulse" />
                                <div className="h-12 bg-neutral-100 rounded mx-auto mb-6 max-w-md animate-pulse" />
                                <div className="h-6 bg-neutral-100 rounded mx-auto max-w-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="font-sans">
                {/* Hero Section */}
                <section className="relative min-h-[64vh] md:min-h-[72vh] flex items-center justify-center overflow-hidden">
                    {/* Fondo */}
                    <div className="absolute inset-0 -z-10">
                        <Image
                            src="https://res.cloudinary.com/dfrhrnwwi/image/upload/f_auto,q_80,w_2000/v1756150406/hrushi-chavhan-R_z0epttP-E-unsplash_qcwnqw.jpg"
                            alt="Ambiente de café con plantas en BOA"
                            fill
                            priority
                            className="object-cover opacity-[0.8]"
                            sizes="100vw"
                        />
                    </div>
                    {/* Overlays para legibilidad */}
                    <div className="absolute inset-0 bg-black/45 -z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10 -z-10" />

                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                {/* Marca de agua del logo (decorativo) */}
                            </div>

                            <h1 className="font-sans text-white text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                                Blog
                            </h1>
                            <p className="font-sans text-white/90 text-xl leading-relaxed max-w-3xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                                Descubre artículos inspiradores sobre bienestar, café de especialidad, mindfulness
                                y todo lo que nos apasiona en el universo BOA.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Featured Posts Slider */}
                {featuredPosts.length > 0 && (
                    <section className="py-20 bg-gradient-to-br from-emerald-50 via-neutral-50 to-amber-50/30 overflow-hidden">
                        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-6">
                                    Artículos <span className="text-emerald-600 font-extrabold">Destacados</span>
                                </h2>
                            </div>

                            {/* Slider Container */}
                            <div className="relative max-w-8xl mx-auto">
                                {/* Slider Viewport */}
                                <div className="relative h-[520px] overflow-hidden rounded-[2rem] shadow-2xl">
                                    <div
                                        className="flex transition-all duration-1000 ease-in-out h-full"
                                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                    >
                                        {featuredPosts.map((post, index) => {
                                            const IconComponent = post.icon || Heart;
                                            return (
                                                <div
                                                    key={post.id}
                                                    className="relative flex-shrink-0 w-full h-full"
                                                >
                                                    {/* Background Image */}
                                                    <div className="absolute inset-0">
                                                        <img
                                                            src={post.image}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Overlay Gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/45 to-neutral-900/20" />

                                                    {/* Content */}
                                                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 md:p-12">
                                                        <div className="max-w-2xl">


                                                            {/* Title - Centered */}
                                                            <h3 className="font-sans text-white text-2xl md:text-3xl font-bold mb-3 leading-tight">
                                                                {post.category === "Bienestar" && "BOA Actividades"}
                                                                {post.category === "Arte" && "BOA Arte"}
                                                                {post.category === "Nutrición" && "BOA Gastronomía"}
                                                            </h3>

                                                            {/* Subtitle - Centered */}
                                                            <p className="font-sans text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                                                                {post.subtitle}
                                                            </p>

                                                            {/* CTA Button - Centered */}
                                                            <div className="flex justify-center">
                                                                <a
                                                                    href={post.externalUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex"
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="lg"
                                                                        className="font-sans bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 text-white backdrop-blur-sm transition-all duration-300 group"
                                                                    >
                                                                        Explorar
                                                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                                    </Button>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Navigation Arrows - Updated with green-cream gradient */}
                                <Button
                                    onClick={() => { prevSlide(); handleUserInteraction(); }}
                                    variant="outline"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 text-white hover:text-white"
                                    aria-label="Artículo anterior"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <Button
                                    onClick={() => { nextSlide(); handleUserInteraction(); }}
                                    variant="outline"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 text-white hover:text-white"
                                    aria-label="Siguiente artículo"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>

                                {/* Dots Indicator */}
                                <div className="flex justify-center mt-8 space-x-3">
                                    {featuredPosts.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => { goToSlide(index); handleUserInteraction(); }}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                                    ? 'bg-emerald-600 w-8'
                                                    : 'bg-neutral-300 hover:bg-neutral-400'
                                                }`}
                                            aria-label={`Ir al artículo ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Search & Filters - MOVED BELOW THE SLIDER */}
                <section className="py-8 bg-white border-b border-neutral-100">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center space-x-2 text-neutral-600">
                                <Filter className="h-5 w-5" aria-hidden="true" />
                                <span className="font-sans font-medium">Explorar artículos</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                {/* Search */}
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
                                        aria-hidden="true"
                                    />
                                    <Input
                                        placeholder="Buscar artículos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="font-sans pl-10 w-full sm:w-64"
                                    />
                                </div>

                                {/* Category Filter */}
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="font-sans w-full sm:w-40">
                                        <SelectValue placeholder="Categoría" />
                                    </SelectTrigger>
                                    <SelectContent className="font-sans">
                                        <SelectItem value="all" className="font-sans">Todas</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category} className="font-sans">
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* All Posts */}
                <section className="py-16 bg-white">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-20">
                                <BookOpen className="h-16 w-16 text-neutral-300 mx-auto mb-4" aria-hidden="true" />
                                <h3 className="font-sans text-2xl font-semibold text-neutral-600 mb-2">
                                    No se encontraron artículos
                                </h3>
                                <p className="font-sans text-neutral-500 mb-6">Intenta ajustar tus filtros de búsqueda</p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory("all");
                                    }}
                                    variant="outline"
                                    className="font-sans"
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post) => (
                                    <Card
                                        key={post.id}
                                        className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                                    >
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={post.image}
                                                alt={`Imagen del artículo: ${post.title}`}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <CardHeader>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="secondary" className="font-sans">{post.category}</Badge>
                                                <div className="flex items-center text-sm text-neutral-500 font-sans">
                                                    <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                                                    {post.readTime}
                                                </div>
                                            </div>
                                            <h3 className="font-sans text-lg font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <p className="font-sans text-neutral-600 text-sm leading-relaxed line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between pt-4">
                                                <div className="font-sans text-xs text-neutral-500">
                                                    {post.publishedFormatted}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" variant="ghost" className="p-1" aria-label="Me gusta">
                                                        <Heart className="h-3 w-3" aria-hidden="true" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="p-1" aria-label="Compartir">
                                                        <Share2 className="h-3 w-3" aria-hidden="true" />
                                                    </Button>
                                                    <a
                                                        href={post.externalUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={`Leer: ${post.title}`}
                                                    >
                                                        <Button size="sm" className="font-sans bg-emerald-600 hover:bg-emerald-700 text-white">
                                                            Leer
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Enhanced Newsletter Section */}
                <section className="relative py-24 overflow-hidden">
                    {/* Background with Patterns */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-neutral-900 to-emerald-800" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08)_0%,transparent_50%)]" />

                    {/* Decorative Elements */}
                    <div className="absolute top-12 left-12 w-24 h-24 bg-emerald-500/10 rounded-[2rem] animate-pulse" style={{ animationDelay: "0s", animationDuration: "6s" }} />
                    <div className="absolute bottom-16 right-16 w-32 h-32 bg-emerald-400/5 rounded-[2rem] animate-pulse" style={{ animationDelay: "3s", animationDuration: "8s" }} />
                    <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-emerald-300/8 rounded-full animate-pulse" style={{ animationDelay: "1.5s", animationDuration: "7s" }} />

                    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left Content */}
                            <div className="text-left space-y-8">
                                {/* Logo/Icon */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-16 h-16 bg-emerald-600/20 backdrop-blur-sm rounded-2xl">
                                        <Coffee className="h-8 w-8 text-emerald-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-sans text-emerald-300 text-lg font-semibold">Newsletter BOA</h3>
                                        <p className="font-sans text-emerald-200/80 text-sm">Únete a nuestra comunidad</p>
                                    </div>
                                </div>

                                {/* Main Heading */}
                                <div className="space-y-4">
                                    <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                                        Inspírate cada
                                        <span className="text-emerald-300 block">semana con BOA</span>
                                    </h2>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4">
                                    {[
                                        "Artículos exclusivos sobre bienestar y mindfulness",
                                        "Recetas saludables y tips de alimentación consciente",
                                        "Invitaciones especiales a eventos y talleres",
                                        "Descuentos exclusivos para suscriptores"
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                            <span className="font-sans text-neutral-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Content - Newsletter Form */}
                            <div className="lg:pl-8">
                                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl shadow-emerald-900/20">
                                    <CardHeader className="text-center pb-6">
                                        <div className="flex justify-center mb-4">
                                            <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl">
                                                <Mail className="h-6 w-6 text-emerald-600" />
                                            </div>
                                        </div>
                                        <h3 className="font-sans text-2xl font-bold text-neutral-900 mb-2">
                                            Suscríbete
                                        </h3>

                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        {/* Email Input */}
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Input
                                                    type="email"
                                                    placeholder="tu@email.com"
                                                    className="font-sans h-12 pl-12 text-base border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                                    aria-label="Correo electrónico"
                                                />
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                            </div>

                                            <Button
                                                className="font-sans w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                            >
                                                Suscribirme ahora
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Trust Indicators */}
                                        <div className="pt-4 border-t border-neutral-100">
                                            <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500">
                                                <div className="flex items-center space-x-2">


                                                </div>
                                                <div className="flex items-center justify-center space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                    <span className="font-sans items-center">Cancela cuando quieras</span>
                                                </div>
                                            </div>

                                            <div className="text-center mt-3">

                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}