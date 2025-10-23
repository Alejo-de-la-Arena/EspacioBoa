"use client";




import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";




import rawImages from "@/data/images.json";
type ImagesJSON = {
    categories: Record<string, string>;
    items: Record<string, string>;
};
const IMAGES = rawImages as ImagesJSON;




type MenuItemOption = { name: string; price: number | string };


type MenuItem = {
    name: string;
    price?: number | string;
    note?: string;
    description?: string;
    options?: MenuItemOption[];
};


type MenuCategory = {
    id: string;
    title: string;
    items: MenuItem[];
    extras?: MenuItemOption[];
    extrasLabel?: string;
};


/* ========= Utils ========= */
const formatARS = (n?: number | string) =>
    typeof n === "number"
        ? new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(n)
        : n ?? "—";




const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&q=80&auto=format&fit=crop";




const CATEGORY_IMAGES: Record<string, string> = IMAGES.categories || {};




const imgForItem = (sectionId: string, name: string) => {
    const key = name.trim().toLowerCase();
    return IMAGES.items[key] || CATEGORY_IMAGES[sectionId] || FALLBACK_IMAGE;
};




const withFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const t = e.currentTarget;
    if (t.src !== FALLBACK_IMAGE) t.src = FALLBACK_IMAGE;
};




function describeItem(sectionId: string, name: string, existing?: string) {
    if (existing && existing.trim().length > 0) return existing.trim();
    return "";
}




const MENU: MenuCategory[] = [
    {
        id: "cafe",
        title: "café",
        items: [
            { name: "Espresso", price: 3300 },
            { name: "Americano", price: 3700 },
            { name: "Americano doble", price: 4800 },
            { name: "Doppio", price: 4200 },
            { name: "Latte", price: 5000 },
            { name: "Flat white", price: 5500 },
            { name: "Iced coffee", price: 6000 },
            { name: "Capuccino", price: 6000 },
            { name: "Espresso Tonic", price: 7000 },
            { name: "Nitro Americano", price: 5200 },
        ],
        extrasLabel: "Extras",
        extras: [
            { name: "Extra shot", price: "+1200" },
            { name: "Leches vegetales", price: "+1200" },
        ],
    },


    {
        id: "panaderia",
        title: "panadería",
        items: [
            { name: "Palmerita", price: 3500 },
            { name: "Roll de canela", price: 4200 },
            { name: "Pain au chocolat", price: 4200 },
            { name: "Budines", price: 4600 },
            {
                name: "Croissant",
                price: 4000,
                options: [{ name: "Jamón y queso", price: "+3000" }],
            },
            {
                name: "Medialuna",
                price: 3100,
                options: [{ name: "Jamón y queso", price: "+3000" }],
            },
            { name: "Tostadas", price: 6000 },
            { name: "Chipa", price: 4400 },
            { name: "Cookies", price: 3300 },
        ],
    },


    {
        id: "para-tomar",
        title: "para tomar",
        items: [
            { name: "Agua (con o sin gas)", price: 3000 },
            {
                name: "Limonada",
                options: [
                    { name: "Vaso", price: 3800 },
                    { name: "Jarra", price: 7700 },
                ],
            },
            {
                name: "Pomelada",
                options: [
                    { name: "Vaso", price: 3800 },
                    { name: "Jarra", price: 7700 },
                ],
            },
            { name: "Jugo de naranja", price: 4200 },
            { name: "Kombucha", price: 5500 },
            { name: "Porrón Heineken", price: 6000 },
            { name: "Porrón Blue Moon", price: 7500 },
            { name: "Té", price: 3000, note: "Consultar variedad" },
            { name: "Chocolate", price: 4000 },
            { name: "Gaseosas", price: 4200 },
        ],
    },


    {
        id: "sin-tacc",
        title: "SIN T.A.C.C.",
        items: [
            { name: "Cookie de banana", price: 5500 },
            { name: "Brownie patagónico", price: 7500 },
            { name: "Carrot cake", price: 11000, options: [{ name: "Mitad de porción", price: 6000 }] },
            { name: "Lingote de chocolate & maní", price: 12000, options: [{ name: "Mitad de porción", price: 6500 }] },
        ],
    },


    {
        id: "brunch",
        title: "brunch",
        items: [
            { name: "Tostón de palta", price: 9200, options: [{ name: "Huevo", price: "+4500" }] },
            { name: "Tostado", price: 10200 },
            { name: "Bowl de yogur", price: 10200, note: "con granola y frutas" },
            { name: "Huevos revueltos", price: 9200 },
        ],
    },


    {
        id: "pizzas",
        title: "pizzas y empanadas",
        items: [
            { name: "Jamón y morrón", price: 17500 },
            { name: "Fugazzeta", price: 16500 },
            { name: "Margherita", price: 15500 },
            { name: "Empanadas", price: 4500 },
        ],
    },


    {
        id: "wraps",
        title: "wraps",
        items: [
            { name: "Wrap veggie", price: 14500 },
            { name: "Wrap de bondiola", price: 15500 },
        ],
    },


    {
        id: "al-plato",
        title: "al plato",
        items: [
            { name: "Risotto de hongos", price: 18000 },
            { name: "Arroz yamaní con pollo", price: 18000 },
            { name: "Sopa de arvejas", price: 12500, note: "con panceta crocante" },
            { name: "Bondiola", price: 21000, note: "con puré de batata" },
            { name: "Pollo al curry", price: 19000 },
        ],
    },


    {
        id: "panes",
        title: "panes",
        items: [
            { name: "Brioche", price: 16000 },
            { name: "Multisemillas", price: 16000 },
            { name: "Molde masa madre", price: 13000 },
        ],
    },
];






/* ==================== Modal de producto (redimensionado y con mejores espaciados) ==================== */
/* ==================== Modal de producto (warm + espaciados optimizados) ==================== */
function ProductModal({
    open,
    item,
    sectionId,
    onClose,
    onPrev,
    onNext,
}: {
    open: boolean;
    item?: MenuItem;
    sectionId: string;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    useEffect(() => {
        if (!open) return;
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);


    if (!item) return null;
    const img = imgForItem(sectionId, item.name);
    const description = describeItem(sectionId, item.name, item.description);


    /* Paleta por categoría (tonos cálidos + verde BOA) */
    const THEME: Record<
        string,
        { cream: string; accent: string; accentSoft: string; ring: string }
    > = {
        cafe: { cream: "#FFF8EE", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        "panaderia": { cream: "#FFF7E9", accent: "#2E7D59", accentSoft: "rgba(46,125,89,.10)", ring: "rgba(46,125,89,.32)" },
        "para-tomar": { cream: "#FFF9F1", accent: "#0F7C68", accentSoft: "rgba(15,124,104,.10)", ring: "rgba(15,124,104,.33)" },
        "sin-tacc": { cream: "#FFF8F0", accent: "#1F805E", accentSoft: "rgba(31,128,94,.10)", ring: "rgba(31,128,94,.33)" },
        brunch: { cream: "#FFF7EE", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        pizzas: { cream: "#FFF6EC", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        wraps: { cream: "#FFF7ED", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        "al-plato": { cream: "#FFF7EE", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        panes: { cream: "#FFF6EA", accent: "#2E7D59", accentSoft: "rgba(46,125,89,.10)", ring: "rgba(46,125,89,.32)" },
    };
    const t = THEME[sectionId] || THEME.cafe;


    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-sm grid place-items-center p-0 md:p-6 overscroll-contain"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 30, scale: 0.98, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 12, scale: 0.985, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.7 }}
                        /* Tamaño grande y fondo cálido */
                        className="relative w-screen md:w-full md:max-w-6xl h-[100vh] supports-[height:100svh]:h-[100svh] md:h-[60vh] rounded-none md:rounded-2xl overflow-hidden shadow-[0_30px_90px_rgba(16,185,129,.22)]"
                        style={{
                            background: `linear-gradient(180deg, ${t.cream} 0%, #FFFFFF 140%)`,
                            boxShadow: `0 30px 90px ${t.accentSoft}`,
                            outline: `1px solid ${t.ring}`,
                        }}
                    >
                        {/* X */}
                        <button
                            className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 ring-1 text-neutral-700 hover:text-neutral-900"
                            style={{ ringColor: t.ring as any }}
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            <X className="h-5 w-5" />
                        </button>


                        {/* Layout 58/42 */}
                        <div className="grid grid-cols-1 md:grid-cols-[58%_42%] h-full">
                            {/* Imagen a toda la altura */}
                            <div className="relative h-[38vh] md:h-full overflow-hidden">
                                <img
                                    src={img}
                                    onError={withFallback}
                                    alt={item.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>


                            {/* Panel derecho: centrado visual + espaciados compactos */}
                            <div className="grid grid-rows-[auto_1fr_auto] gap-4 sm:gap-5 p-5 sm:p-6 md:p-8 md:pr-14 h-full overflow-hidden">
                                {/* Header compacto */}
                                <div className="max-w-[560px] mx-auto w-full">
                                    <h3 className="text-[24px] md:text-[28px] font-semibold text-neutral-900 leading-tight tracking-[-0.01em]">
                                        {item.name}
                                    </h3>
                                    <div className="mt-1.5 flex items-center gap-2">
                                        <Badge
                                            className="text-[10px] border"
                                            style={{ backgroundColor: "#ECFDF5", color: t.accent }}
                                        >
                                            BOA
                                        </Badge>
                                    </div>
                                </div>


                                {/* Body: scrollea si hay mucho texto; tarjeta de descripción cálida */}
                                <div className="min-h-0 overflow-y-auto pr-1 max-w-[560px] mx-auto w-full">
                                    {description && (
                                        <div
                                            className="rounded-2xl p-4 md:p-5 mb-3"
                                            style={{
                                                background: "rgba(255,255,255,.75)",
                                                borderLeft: `4px solid ${t.accent}`,
                                                boxShadow: `inset 0 0 0 1px ${t.accentSoft}`,
                                            }}
                                        >
                                            <p className="text-[15.5px] md:text-[16px] leading-relaxed text-neutral-800">
                                                {description}
                                            </p>
                                        </div>
                                    )}


                                    {item.note && (
                                        <p className="mt-2 text-[13.5px] text-neutral-600">{item.note}</p>
                                    )}


                                    {Array.isArray(item.options) && item.options.length > 0 && (
                                        <div
                                            className="mt-4 rounded-xl p-4"
                                            style={{
                                                background: "rgba(236,253,245,.65)",
                                                boxShadow: `inset 0 0 0 1px ${t.accentSoft}`,
                                            }}
                                        >
                                            <div
                                                className="text-[12px] font-semibold mb-2"
                                                style={{ color: t.accent }}
                                            >
                                                Opciones
                                            </div>
                                            <ul className="space-y-1.5">
                                                {item.options.map((op, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-center justify-between text-[14.5px]"
                                                    >
                                                        <span className="text-neutral-800">{op.name}</span>
                                                        <span className="font-semibold" style={{ color: t.accent }}>
                                                            {formatARS(op.price)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}


                                    {(item.price ?? null) !== null && (
                                        <div className="mt-4">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="text-[12.5px] text-neutral-500">
                                                    {item.options?.length ? "Desde" : "Valor"}
                                                </span>
                                                <span
                                                    className="px-3.5 py-1.5 rounded-full font-semibold text-[15px]"
                                                    style={{
                                                        color: t.accent,
                                                        background: "rgba(236,253,245,.9)",
                                                        boxShadow: `inset 0 0 0 1px ${t.accentSoft}`,
                                                    }}
                                                >
                                                    {formatARS(item.price)}
                                                </span>
                                            </span>
                                        </div>
                                    )}


                                    <div
                                        className="mt-4 h-px w-full"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, rgba(16,185,129,.15), rgba(251,191,36,.25), transparent)",
                                        }}
                                    />
                                </div>


                                {/* Footer fijo */}
                                <div className="flex items-center justify-between gap-3 max-w-[560px] mx-auto w-full pt-1">
                                    <Button
                                        variant="outline"
                                        className="h-10 px-5 rounded-full"
                                        onClick={onPrev}
                                        style={{ boxShadow: `inset 0 0 0 1px ${t.accentSoft}` }}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                                    </Button>
                                    <Button
                                        className="h-10 px-5 rounded-full text-white"
                                        onClick={onNext}
                                        style={{ backgroundColor: t.accent }}
                                    >
                                        Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}








/* ==================== Modal de categoría (con “zona X” en la lista) ==================== */
/* ==================== Modal de categoría (warm + mismas medidas del modal de producto) ==================== */
/* ==================== Modal de categoría — Horizontal cálido con degradado ==================== */
/* ==================== Modal de categoría — horizontal cálido, X segura y scroll con aire ==================== */
function CategoryModal({
    open,
    category,
    onClose,
    onSelectItem,
}: {
    open: boolean;
    category?: MenuCategory;
    onClose: () => void;
    onSelectItem: (index: number) => void;
}) {
    useEffect(() => {
        if (!open) return;
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);


    if (!category) return null;
    const img = CATEGORY_IMAGES[category.id] || FALLBACK_IMAGE;


    /* Paleta por categoría */
    const THEME: Record<
        string,
        { cream: string; accent: string; accentSoft: string; ring: string }
    > = {
        cafe: { cream: "#FFF8EE", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        panaderia: { cream: "#FFF6EA", accent: "#2E7D59", accentSoft: "rgba(46,125,89,.10)", ring: "rgba(46,125,89,.32)" },
        "para-tomar": { cream: "#FFF9F1", accent: "#0F7C68", accentSoft: "rgba(15,124,104,.10)", ring: "rgba(15,124,104,.33)" },
        "sin-tacc": { cream: "#FFF8F0", accent: "#1F805E", accentSoft: "rgba(31,128,94,.10)", ring: "rgba(31,128,94,.33)" },
        brunch: { cream: "#FFF7EE", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        pizzas: { cream: "#FFF6EC", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        wraps: { cream: "#FFF7ED", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
        "al-plato": { cream: "#FFF7EE", accent: "#1E7A66", accentSoft: "rgba(30,122,102,.10)", ring: "rgba(30,122,102,.35)" },
    };
    const t = THEME[category.id] || THEME.cafe;


    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm grid place-items-center p-0 md:p-6 overscroll-contain"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 110, damping: 18 }}
                        className="relative w-screen md:w-full md:max-w-7xl h-[92vh] supports-[height:100svh]:h-[92svh] md:h-[86vh] rounded-none md:rounded-2xl overflow-hidden shadow-[0_28px_90px_rgba(16,185,129,.22)]"
                        style={{
                            background: `linear-gradient(180deg, ${t.cream} 0%, #FFFFFF 160%)`,
                            outline: `1px solid ${t.ring}`,
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-[50%_50%] h-full">
                            {/* IZQ: Hero */}
                            <div className="relative overflow-hidden hidden md:block">
                                <img
                                    src={img}
                                    onError={withFallback}
                                    alt={category.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(70%_60%_at_50%_50%,rgba(0,0,0,.34)_0%,rgba(0,0,0,.20)_48%,rgba(0,0,0,.10)_70%,rgba(0,0,0,0)_100%)]" />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,.16)_100%)] pointer-events-none" />


                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                                    <span className="text-xs uppercase tracking-wide bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                                        Gastronomía BOA
                                    </span>
                                    <h3 className="capitalize text-5xl font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,.3)]">
                                        {category.title}
                                    </h3>
                                    <svg viewBox="0 0 520 28" className="mx-auto h-6 w-[min(420px,80%)] opacity-90 mt-3">
                                        <path d="M6 22 C 140 4, 380 4, 514 22" stroke="rgba(255,255,255,.9)" strokeWidth="6" strokeLinecap="round" fill="none" />
                                    </svg>
                                    <p className="text-[13px] mt-2 opacity-90">Arte, comunidad y sabores de especialidad</p>
                                </div>
                            </div>


                            {/* DER: Topbar sticky (X) + lista con scroll espacioso */}
                            <div className="relative min-h-0 flex flex-col h-full">
                                {/* Topbar desktop con X (no pisa contenido) */}
                                <div
                                    className="hidden md:flex sticky top-0 z-30 items-center justify-end px-4"
                                    style={{
                                        height: 72,
                                        background: `linear-gradient(180deg, ${t.cream} 0%, rgba(255,255,255,.85) 120%)`,
                                        boxShadow: `inset 0 -1px 0 ${t.accentSoft}`,
                                        backdropFilter: "saturate(160%) blur(4px)",
                                    }}
                                >
                                    <button
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-800"
                                        style={{ boxShadow: `inset 0 0 0 1px ${t.ring}` }}
                                        onClick={onClose}
                                        aria-label="Cerrar"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>


                                {/* Topbar mobile con título + X */}
                                <div
                                    className="md:hidden sticky top-0 z-30"
                                    style={{ background: `${t.cream}`, boxShadow: `inset 0 -1px 0 ${t.accentSoft}` }}
                                >
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <h3 className="capitalize text-lg font-semibold text-neutral-900">{category.title}</h3>
                                        <button
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
                                            style={{ boxShadow: `inset 0 0 0 1px ${t.ring}` }}
                                            onClick={onClose}
                                            aria-label="Cerrar"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>


                                {/* LISTA scroll: más padding y gutter reservado para que no “corte” nada */}
                                <div
                                    className="flex-1 overflow-y-auto p-5 pr-6 lg:pr-8"
                                    style={{
                                        scrollbarGutter: "stable both-edges",
                                    }}
                                >
                                    <ul className="space-y-4 pb-16">
                                        {category.items.map((it, i) => {
                                            const thumb = imgForItem(category.id, it.name);
                                            const short = describeItem(category.id, it.name, it.description)
                                                .replace(/^Ingredientes:\s*/i, "")
                                                .replace(/\. Elaborado de forma artesanal\.$/i, "");
                                            const brownSoft = "rgba(181,138,90,.12)";
                                            const greenSoft = t.accentSoft || "rgba(30,122,102,.12)";


                                            return (
                                                <li key={i}>
                                                    <button
                                                        onClick={() => onSelectItem(i)}
                                                        aria-label={`Ver ${it.name}`}
                                                        className="group relative w-full text-left transition-all"
                                                        style={{
                                                            borderRadius: 24,
                                                            padding: "16px 20px",
                                                            background: `
                                linear-gradient(180deg, rgba(255,248,238,.96) 0%, rgba(255,246,228,.94) 100%),
                                linear-gradient(135deg, ${brownSoft} 0%, ${greenSoft} 100%)
                              `,
                                                            boxShadow: `0 6px 20px ${greenSoft}, inset 0 0 0 1px ${greenSoft}`,
                                                        }}
                                                    >
                                                        <div className="grid grid-cols-[110px_1fr_auto] items-center gap-5">
                                                            {/* Thumb */}
                                                            <div className="relative">
                                                                <div className="w-[110px] h-[110px] rounded-[18px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,.08)]">
                                                                    <img
                                                                        src={thumb}
                                                                        onError={withFallback}
                                                                        alt={it.name}
                                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                            </div>


                                                            {/* Texto */}
                                                            <div className="min-w-0">
                                                                <h4 className="font-medium text-[18px] text-neutral-900 leading-tight truncate">
                                                                    {it.name}
                                                                </h4>
                                                                {short && (
                                                                    <p className="mt-1 text-[13.5px] text-neutral-700/90 line-clamp-2">
                                                                        {short}
                                                                    </p>
                                                                )}
                                                                {Array.isArray(it.options) && it.options.length > 0 && (
                                                                    <div className="mt-2 space-y-1.5">
                                                                        {it.options.map((op, k) => (
                                                                            <div key={k} className="flex items-center justify-between text-[14px] text-neutral-800">
                                                                                <span className="inline-flex items-center gap-2 w-full">
                                                                                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.accent }} />
                                                                                    {op.name}
                                                                                </span>
                                                                                <span className="font-semibold" style={{ color: t.accent }}>
                                                                                    {formatARS(op.price)}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            {/* Precio */}
                                                            {(it.price ?? null) !== null && (
                                                                <span
                                                                    className="px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap text-[15px]"
                                                                    style={{
                                                                        color: t.accent,
                                                                        background: "rgba(236,253,245,.9)",
                                                                        boxShadow: `inset 0 0 0 1px ${greenSoft}`,
                                                                    }}
                                                                >
                                                                    {formatARS(it.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
















/* ==================== Card de categoría ==================== */
function CategoryCard({
    category,
    onOpen,
}: {
    category: MenuCategory;
    onOpen: (c: MenuCategory) => void;
}) {
    const src = CATEGORY_IMAGES[category.id] || FALLBACK_IMAGE;


    return (
        <button
            onClick={() => onOpen(category)}
            className="
        group relative text-left h-[18rem] sm:h-[20rem] lg:h-[22rem] w-full
        rounded-[1.75rem] overflow-hidden bg-[#FFFBF4]
        ring-[2.5px] ring-[#1E7A66]/70 shadow-[0_14px_44px_rgba(16,185,129,.08)]
        transition-transform hover:-translate-y-0.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7A66]
      "
            aria-label={`Abrir ${category.title}`}
        >
            {/* Imagen a full, sin padding, cubre todo */}
            <img
                src={src}
                onError={withFallback}
                alt={category.title}
                className="
          absolute inset-0 w-full h-full object-cover object-center
          transition-transform duration-700 group-hover:scale-[1.02]
        "
            />


            {/* Overlay crema sutil para consistencia visual */}
            <div className="absolute inset-0 bg-[#FFFBF4]/30 mix-blend-soft-light" />


            {/* Detalles y texto */}
            <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-5">
                <span className="inline-flex items-center gap-2 text-emerald-900/90 text-sm mb-1">
                    <span className="h-2 w-2 rounded-full bg-[#1E7A66]" />
                    Menú BOA
                </span>
                <h3 className="capitalize text-neutral-900 text-3xl sm:text-4xl font-semibold drop-shadow-sm">
                    {category.title}
                </h3>
                <div className="mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-[#1E7A66] ring-1 ring-[#1E7A66]/20 hover:bg-boa-green hover:border hover:border-boa-cream hover:text-white">
                        Ver productos
                    </span>
                </div>
            </div>
        </button>
    );
}








/* ==================== Página ==================== */
export default function MenuPage() {
    const categories = useMemo(() => MENU, []);
    const [catOpen, setCatOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<MenuCategory | undefined>(undefined);




    const [idx, setIdx] = useState<number>(0);
    const [productOpen, setProductOpen] = useState(false);




    const items = selectedCategory?.items || [];
    const item = items[idx];




    const openCategory = (c: MenuCategory) => {
        setSelectedCategory(c);
        setIdx(0);
        setProductOpen(false);
        setCatOpen(true);
    };




    const closeCategory = () => {
        setCatOpen(false);
        setProductOpen(false);
    };




    return (
        <section
            aria-labelledby="boa-hero"
            className="relative overflow-hidden"
            style={{
                backgroundImage:
                    "url(https://res.cloudinary.com/dasch1s5i/image/upload/v1760568862/menu-bg_ezlbwv.png)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            {/* HERO */}
            <section aria-labelledby="boa-hero" className="relative z-10">
                <motion.div
                    className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-12 text-center"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    <h1
                        id="boa-hero"
                        className="mt-4 text-4xl sm:text-6xl font-bold leading-[1.1] tracking-tight text-neutral-900"
                    >
                        Gastronomía <span className="text-emerald-700">BOA</span>
                    </h1>


                    <motion.div
                        className="mx-auto mt-2 w-[min(520px,90%)]"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    >
                        <svg
                            viewBox="0 0 520 28"
                            className="mx-auto h-6 w-full"
                            aria-hidden="true"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M6 22 C 140 4, 380 4, 514 22"
                                className="stroke-emerald-600/70"
                                strokeWidth="6"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                    </motion.div>


                    <motion.p
                        className="mx-auto mt-4 max-w-3xl text-lg text-neutral-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Cocina de especialidad, honesta y consciente. Un ritual para
                        disfrutar lento, compartir y volver.
                    </motion.p>


                    <motion.div
                        className="mt-8 flex flex-wrap items-center justify-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <a
                            href="#categories"
                            className="inline-flex items-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(16,185,129,.20)] transition-colors hover:bg-emerald-800"
                        >
                            Ver el menú
                        </a>
                    </motion.div>
                </motion.div>
            </section>


            {/* GRID de categorías */}
            <section className="py-8 sm:py-12">
                <motion.div
                    className="mx-auto w-full max-w-7xl px-4 sm:px-6"
                    id="categories"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ staggerChildren: 0.15 }}
                >
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                        variants={{
                            visible: { transition: { staggerChildren: 0.15 } },
                        }}
                    >
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                            >
                                <CategoryCard category={cat} onOpen={openCategory} />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>


            {/* MODALES */}
            <CategoryModal
                open={catOpen}
                category={selectedCategory}
                onClose={closeCategory}
                onSelectItem={(i) => {
                    setIdx(i);
                    setProductOpen(true);
                }}
            />


            <ProductModal
                open={productOpen && Boolean(item)}
                item={item}
                sectionId={selectedCategory?.id || "cafe"}
                onClose={() => setProductOpen(false)}
                onPrev={() =>
                    setIdx((i) => (i - 1 + items.length) % Math.max(items.length, 1))
                }
                onNext={() => setIdx((i) => (i + 1) % Math.max(items.length, 1))}
            />
        </section >
    );
}
