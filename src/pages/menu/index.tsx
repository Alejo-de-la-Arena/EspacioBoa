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
            { name: "Empanadas (verdura/bondiola)", price: 4500 },
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



/* ==================== Modal de producto (ajustado) ==================== */
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

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-sm grid place-items-center p-3 sm:p-6 overscroll-contain"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full max-w-5xl rounded-2xl bg-white overflow-hidden ring-1 ring-emerald-200/70 shadow-[0_30px_90px_rgba(16,185,129,.22)]"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 30, scale: 0.98, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 12, scale: 0.985, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.7 }}
                    >
                        {/* X */}
                        <button
                            className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 ring-1 ring-emerald-200 text-neutral-700 hover:text-neutral-900"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Imagen más grande (col izquierda) */}
                        <div className="grid grid-cols-1 md:grid-cols-[56%_44%]">
                            <div className="relative h-64 sm:h-80 md:h-[420px] overflow-hidden">
                                <img
                                    src={img}
                                    onError={withFallback}
                                    alt={item.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Panel derecho */}
                            <div className="p-5 md:p-6 pr-14 grid grid-rows-[auto_1fr_auto] gap-4">
                                <div>
                                    <h3 className="text-2xl md:text-[28px] font-semibold text-neutral-900 leading-tight">
                                        {item.name}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            BOA
                                        </Badge>
                                        {String(item.name).toLowerCase().includes("veg") && (
                                            <span className="inline-flex items-center text-emerald-600 text-[11px]">
                                                <Leaf className="h-3 w-3 mr-1" /> Vegano
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="min-h-0">
                                    {description && (
                                        <p className="text-neutral-700 leading-relaxed text-[15.5px]">{description}</p>
                                    )}
                                    {item.note && (
                                        <p className="mt-1.5 text-[13px] text-neutral-600">{item.note}</p>
                                    )}

                                    {Array.isArray(item.options) && item.options.length > 0 && (
                                        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                                            <div className="text-[12px] font-semibold text-emerald-800 mb-1.5">
                                                Opciones
                                            </div>
                                            <ul className="space-y-1">
                                                {item.options.map((op, i) => (
                                                    <li key={i} className="flex items-center justify-between text-[14px]">
                                                        <span>{op.name}</span>
                                                        <span className="font-semibold text-emerald-700">
                                                            {formatARS(op.price)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {(item.price ?? null) !== null && (
                                        <div className="mt-3">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="text-[12px] text-neutral-500">
                                                    {item.options?.length ? "Desde" : "Valor"}
                                                </span>
                                                <span className="px-3 py-1.5 rounded-full font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200">
                                                    {formatARS(item.price)}
                                                </span>
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-4 h-px w-full bg-gradient-to-r from-emerald-100 via-amber-100 to-transparent" />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <Button variant="outline" className="h-9 px-4 rounded-full" onClick={onPrev}>
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                                    </Button>
                                    <Button
                                        className="h-9 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800"
                                        onClick={onNext}
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
                    {/* Contenedor: fullscreen en mobile, ventana en desktop */}
                    <motion.div
                        className="relative w-screen h-screen md:w-full md:h-auto md:max-w-6xl md:max-h-[88vh] bg-white rounded-none md:rounded-[24px] ring-0 md:ring-1 md:ring-emerald-200/70 shadow-none md:shadow-[0_28px_90px_rgba(16,185,129,.22)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 24, opacity: 0, scale: 1 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 110, damping: 18 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-[44%_56%] h-full md:h-[76vh]">
                            {/* IZQ: Imagen con overlay suave y título centrado (solo desktop) */}
                            <div className="relative overflow-hidden hidden md:block">
                                <img
                                    src={img}
                                    onError={withFallback}
                                    alt={category.title}
                                    className="absolute inset-0 w-full h-full object-cover saturate-110 contrast-105"
                                />

                                {/* Overlay suave: combina radial + linear para legibilidad sin tapar la foto */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background:
                                            "radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,.38) 0%, rgba(0,0,0,.22) 48%, rgba(0,0,0,.10) 70%, rgba(0,0,0,0) 100%)",
                                    }}
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,.18)_100%)] pointer-events-none" />

                                {/* Título centrado con detalle “cool” */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center p-6 text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                                >
                                    <div className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.25)]">
                                        <div className="inline-flex px-3 py-1 rounded-full text-xs tracking-wide bg-white/18 backdrop-blur ring-1 ring-white/35 mb-3">
                                            Gastronomía BOA
                                        </div>

                                        <h3 className="capitalize text-4xl lg:text-5xl font-semibold leading-tight">
                                            {category.title}
                                        </h3>

                                        {/* Subrayado orgánico con SVG (detalle sutil) */}
                                        <div className="mt-3">
                                            <svg
                                                viewBox="0 0 520 28"
                                                className="mx-auto h-6 w-[min(420px,80%)] opacity-90"
                                                aria-hidden="true"
                                                preserveAspectRatio="none"
                                            >
                                                <path
                                                    d="M6 22 C 140 4, 380 4, 514 22"
                                                    stroke="rgba(255,255,255,.85)"
                                                    strokeWidth="6"
                                                    strokeLinecap="round"
                                                    fill="none"
                                                />
                                            </svg>
                                        </div>

                                        <p className="text-[13px] opacity-95 mt-2">
                                            Arte, comunidad y sabores de especialidad
                                        </p>
                                    </div>
                                </motion.div>
                            </div>


                            {/* DER: Lista + barras superiores según viewport */}
                            <div className="relative min-h-0 flex flex-col h-full">
                                {/* MOBILE: Topbar con título de sección + X negra grande */}
                                <div className="md:hidden sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-neutral-200">
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <h3 className="capitalize text-lg font-semibold text-neutral-900">
                                            {category.title}
                                        </h3>
                                        <button
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black ring-1 ring-neutral-300"
                                            onClick={onClose}
                                            aria-label="Cerrar"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* DESKTOP: Barra de cierre */}
                                <div className="hidden md:block sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-emerald-100/60">
                                    <div className="flex items-center justify-end px-4 py-3">
                                        <button
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200 text-neutral-700 hover:text-neutral-900"
                                            onClick={onClose}
                                            aria-label="Cerrar"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* LISTA */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-5 pr-4 md:pr-5">
                                    {category.items.length === 0 ? (
                                        <p className="text-neutral-600">
                                            No hay productos en esta sección todavía.
                                        </p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {category.items.map((it, i) => {
                                                const thumb = imgForItem(category.id, it.name);
                                                const short = describeItem(
                                                    category.id,
                                                    it.name,
                                                    it.description
                                                )
                                                    .replace(/^Ingredientes:\s*/i, "")
                                                    .replace(/\. Elaborado de forma artesanal\.$/i, "");

                                                return (
                                                    <li key={i}>
                                                        <button
                                                            onClick={() => onSelectItem(i)}
                                                            className="group relative w-full text-left rounded-3xl ring-1 ring-emerald-100/70 bg-white shadow-[0_6px_26px_rgba(16,185,129,.08)] hover:shadow-[0_16px_44px_rgba(16,185,129,.16)] hover:ring-emerald-200 transition-all px-4 py-3 sm:px-5 sm:py-4"
                                                            aria-label={`Ver ${it.name}`}
                                                        >
                                                            <div className="grid grid-cols-[116px_1fr_auto] items-center gap-4">
                                                                {/* Imagen SIN separaciones ni overlays */}
                                                                <div className="relative">
                                                                    <div className="w-[116px] h-[116px] rounded-2xl overflow-hidden">
                                                                        <img
                                                                            src={thumb}
                                                                            onError={withFallback}
                                                                            alt={it.name}
                                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                                                                            loading="lazy"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Texto */}
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium text-neutral-900 truncate">
                                                                            {it.name}
                                                                        </span>
                                                                    </div>

                                                                    {it.note && (
                                                                        <p className="text-[12px] text-neutral-500 mt-1 line-clamp-1">
                                                                            {it.note}
                                                                        </p>
                                                                    )}

                                                                    {it.options?.length ? (
                                                                        <div className="mt-2 space-y-1.5">
                                                                            {it.options.map((op, k) => (
                                                                                <div
                                                                                    key={k}
                                                                                    className="flex items-center justify-between text-[13px] text-neutral-700"
                                                                                >
                                                                                    <span className="inline-flex items-center gap-2 w-full">
                                                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                                                                        {op.name}
                                                                                    </span>
                                                                                    <span className="font-semibold flex items-start pl-0 w-full text-gray-600">
                                                                                        {formatARS(op.price)}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : null}

                                                                    <div className="mt-2 h-px w-24 bg-gradient-to-r from-emerald-100 via-emerald-50 to-transparent" />
                                                                </div>

                                                                {/* Precio pill */}
                                                                {!it.options?.length ? (
                                                                    <span className="px-3 py-1.5 rounded-full font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 whitespace-nowrap group-hover:bg-emerald-100/60 transition-colors">
                                                                        {formatARS(it.price)}
                                                                    </span>
                                                                ) : it.price ? (
                                                                    <span className="px-3 py-1.5 rounded-full font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 whitespace-nowrap group-hover:bg-emerald-100/60 transition-colors">
                                                                        {formatARS(it.price)}
                                                                    </span>
                                                                ) : (
                                                                    <span />
                                                                )}
                                                            </div>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}

                                    {/* Extras */}
                                    {category.extras?.length ? (
                                        <div className="mt-5">
                                            <div className="mb-2 text-[12px] uppercase tracking-wide text-emerald-700/90 font-semibold">
                                                {category.extrasLabel || "Extras"}
                                            </div>
                                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 sm:p-4">
                                                <ul className="divide-y divide-emerald-100/70">
                                                    {category.extras.map((ex, k) => (
                                                        <li
                                                            key={k}
                                                            className="py-2 flex items-center justify-between text-[13.5px]"
                                                        >
                                                            <span className="inline-flex items-center gap-2 text-neutral-800">
                                                                <Sparkles className="h-4 w-4 text-emerald-600" />
                                                                {ex.name}
                                                            </span>
                                                            <span className="font-semibold text-emerald-700">
                                                                {formatARS(ex.price)}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : null}
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
        group relative text-left h-[16rem] sm:h-[20rem] lg:h-[22rem] w-full
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
                    className="container mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-20 text-center"
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












