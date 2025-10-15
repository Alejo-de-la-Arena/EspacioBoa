"use client";


import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X, Leaf, ChevronLeft, ChevronRight } from "lucide-react";


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


    if (!open || !item) return null;
    const img = imgForItem(sectionId, item.name);
    const description = describeItem(sectionId, item.name, item.description);


    return (
        <div
            className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-sm grid place-items-center p-3 sm:p-6 overscroll-contain"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-full max-w-4xl rounded-2xl bg-white overflow-hidden ring-1 ring-emerald-200/70 shadow-[0_30px_90px_rgba(16,185,129,.22)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* X sin invadir contenido */}
                <button
                    className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 ring-1 ring-emerald-200 text-neutral-700 hover:text-neutral-900"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5" />
                </button>


                <div className="grid grid-cols-1 md:grid-cols-[48%_52%]">
                    {/* Imagen ajustada al grid */}
                    <div className="relative h-52 md:h-72 overflow-hidden">
                        <img
                            src={img}
                            onError={withFallback}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 via-transparent to-amber-900/10" />
                        <div className="absolute bottom-3 left-3">
                        </div>
                    </div>


                    {/* Panel derecho en grilla: header / contenido / footer */}
                    <div className="p-5 md:p-6 pr-14 grid grid-rows-[auto_1fr_auto] gap-4">
                        {/* Header: título + sello */}
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

                        {/* Contenido: descripción + precio */}
                        {/* Contenido: (sin ingredientes auto) + opciones + precio */}
                        <div className="min-h-0">
                            {description && (
                                <p className="text-neutral-700 leading-relaxed text-[15.5px]">{description}</p>
                            )}

                            {item.note && (
                                <p className="mt-1.5 text-[13px] text-neutral-600">{item.note}</p>
                            )}

                            {Array.isArray(item.options) && item.options.length > 0 && (
                                <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                                    <div className="text-[12px] font-semibold text-emerald-800 mb-1.5">Opciones</div>
                                    <ul className="space-y-1">
                                        {item.options.map((op, i) => (
                                            <li key={i} className="flex items-center justify-between text-[14px]">
                                                <span>{op.name}</span>
                                                <span className="font-semibold text-emerald-700">{formatARS(op.price)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {(item.price ?? null) !== null && (
                                <div className="mt-3">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="text-[12px] text-neutral-500">{item.options?.length ? "Desde" : "Valor"}</span>
                                        <span className="px-3 py-1.5 rounded-full font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200">
                                            {formatARS(item.price)}
                                        </span>
                                    </span>
                                </div>
                            )}

                            <div className="mt-4 h-px w-full bg-gradient-to-r from-emerald-100 via-amber-100 to-transparent" />
                        </div>



                        {/* Footer: navegación abajo */}
                        <div className="flex items-center justify-between pt-1">
                            <Button
                                variant="outline"
                                className="h-9 px-4 rounded-full"
                                onClick={onPrev}
                            >
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
            </div>
        </div>
    );
}


/* ==================== Modal de categoría (con “zona X” en la lista) ==================== */
/* ==================== Modal de categoría (rediseñado con cards cálidas BOA) ==================== */
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


    if (!open || !category) return null;


    const img = CATEGORY_IMAGES[category.id] || FALLBACK_IMAGE;


    return (
        <div
            className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm grid place-items-center p-3 sm:p-6 overscroll-contain"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-full max-w-6xl max-h-[88vh] bg-white rounded-[24px] ring-1 ring-emerald-200/70 shadow-[0_28px_90px_rgba(16,185,129,.22)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="grid grid-cols-1 md:grid-cols-[44%_56%] h-[82vh] md:h-[76vh]">
                    {/* IZQ: imagen + título centrado */}
                    <div className="relative overflow-hidden">
                        <img
                            src={img}
                            onError={withFallback}
                            alt={category.title}
                            className="absolute inset-0 w-full h-full object-cover scale-[1.04] saturate-110 contrast-105"
                        />
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,.15) 70%, rgba(0,0,0,0) 100%)",
                            }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.25),rgba(0,0,0,.08),transparent)]" />
                        <div className="absolute inset-0 backdrop-blur-[2px]" />


                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="text-center text-white drop-shadow-sm">
                                <div className="inline-flex px-3 py-1 rounded-full text-xs tracking-wide bg-white/18 backdrop-blur ring-1 ring-white/35 mb-3">
                                    Gastronomía BOA
                                </div>
                                <h3 className="capitalize text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                                    {category.title}
                                </h3>
                                <p className="text-[12px] sm:text-sm opacity-95 mt-2">
                                    Arte, comunidad y sabores de especialidad
                                </p>
                            </div>
                        </div>


                        {/* X sólo en mobile encima de la imagen */}
                        <button
                            className="md:hidden absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 ring-1 ring-emerald-200 text-neutral-700 hover:text-neutral-900"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>


                    {/* DER: lista de productos rediseñada */}
                    <div className="relative min-h-0 flex flex-col h-full">
                        {/* Barra de cierre en desktop */}
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


                        {/* LISTA NUEVA */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 pr-14 md:pr-5">
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
                                            .replace(
                                                /\. Elaborado de forma artesanal\.$/i,
                                                ""
                                            );


                                        const isVegan = String(it.name)
                                            .toLowerCase()
                                            .includes("veg");


                                        return (
                                            <li key={i}>
                                                <button
                                                    onClick={() => onSelectItem(i)}
                                                    className="group relative w-full text-left rounded-3xl ring-1 ring-emerald-100/70 bg-white shadow-[0_6px_26px_rgba(16,185,129,.08)] hover:shadow-[0_16px_44px_rgba(16,185,129,.16)] hover:ring-emerald-200 transition-all px-4 py-3 sm:px-5 sm:py-4"
                                                    aria-label={`Ver ${it.name}`}
                                                >
                                                    <div className="grid grid-cols-[112px_1fr_auto] items-center gap-4">
                                                        {/* Imagen */}
                                                        <div className="relative">
                                                            <div className="w-[112px] h-[112px] rounded-2xl overflow-hidden">
                                                                <div className="absolute inset-0 rounded-2xl p-[1px] bg-[linear-gradient(180deg,rgba(16,185,129,.35),rgba(16,185,129,0))]" />
                                                                <img src={thumb} onError={withFallback} alt={it.name}
                                                                    className="relative z-[1] w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06] saturate-[1.08] contrast-[1.05] rounded-2xl" loading="lazy" />
                                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-50/60 to-transparent" />
                                                            </div>
                                                        </div>

                                                        {/* Texto */}
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-neutral-900 truncate">{it.name}</span>
                                                            </div>

                                                            {/* Nota bajo el título (si hay) */}
                                                            {it.note && (
                                                                <p className="text-[12px] text-neutral-500 mt-1 line-clamp-1">{it.note}</p>
                                                            )}

                                                            {/* Variantes / extras del ítem */}
                                                            {it.options?.length ? (
                                                                <div className="mt-2 space-y-1.5">
                                                                    {it.options.map((op, k) => (
                                                                        <div key={k} className="flex items-center justify-between text-[13px] text-neutral-700">
                                                                            <span className="inline-flex items-center gap-2 w-full">
                                                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                                                                {op.name}
                                                                            </span>
                                                                            <span className="font-semibold flex items-start pl-0 w-full text-gray-600">{formatARS(op.price)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : null}

                                                            {/* Línea decorativa */}
                                                            <div className="mt-2 h-px w-24 bg-gradient-to-r from-emerald-100 via-emerald-50 to-transparent" />
                                                        </div>

                                                        {/* Precio “pill”: solo si NO hay options */}
                                                        {!it.options?.length ? (
                                                            <span className="px-3 py-1.5 rounded-full font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 whitespace-nowrap group-hover:bg-emerald-100/60 transition-colors">
                                                                {formatARS(it.price)}
                                                            </span>
                                                        ) : (
                                                            // Si tiene options pero también precio base, lo mostramos como “desde”
                                                            it.price ? (
                                                                <span className="px-3 py-1.5 rounded-full font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 whitespace-nowrap group-hover:bg-emerald-100/60 transition-colors">
                                                                    {formatARS(it.price)}
                                                                </span>
                                                            ) : <span />
                                                        )}
                                                    </div>
                                                </button>
                                            </li>

                                        );
                                    })}
                                </ul>

                            )}
                            {category.extras?.length ? (
                                <div className="mt-5">
                                    <div className="mb-2 text-[12px] uppercase tracking-wide text-emerald-700/90 font-semibold">
                                        {category.extrasLabel || "Extras"}
                                    </div>
                                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 sm:p-4">
                                        <ul className="divide-y divide-emerald-100/70">
                                            {category.extras.map((ex, k) => (
                                                <li key={k} className="py-2 flex items-center justify-between text-[13.5px]">
                                                    <span className="inline-flex items-center gap-2 text-neutral-800">
                                                        <Sparkles className="h-4 w-4 text-emerald-600" />
                                                        {ex.name}
                                                    </span>
                                                    <span className="font-semibold text-emerald-700">{formatARS(ex.price)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-[#1E7A66] ring-1 ring-[#1E7A66]/20">
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
        <section>
            <section
                aria-labelledby="boa-hero"
                className="relative overflow-hidden"
                style={{
                    // base crema + radiales salvia/crema suaves
                    background:
                        "radial-gradient(140% 120% at 20% -10%, rgba(214,232,221,0.35) 0%, rgba(214,232,221,0) 55%), radial-gradient(120% 100% at 85% 0%, rgba(250,241,224,0.28) 0%, rgba(250,241,224,0) 60%), radial-gradient(120% 120% at 50% 110%, rgba(200,222,209,0.22) 0%, rgba(200,222,209,0) 60%), #FFFBF4",
                }}
            >
                {/* textura papel y viñeta leve */}
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='7'/></filter><rect width='100%' height='100%' filter='url(%23n)' fill='%23a3b7a8' opacity='.22'/></svg>\")",
                        backgroundSize: "360px 360px",
                        mixBlendMode: "multiply",
                        opacity: 0.035,
                    }}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-50/70 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F6EFE0]/80 to-transparent" />

                {/* HERO */}
                <section aria-labelledby="boa-hero" className="relative z-10">
                    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-20 text-center">
                        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-emerald-700">
                            Sabores, arte y comunidad
                        </div>

                        <h1
                            id="boa-hero"
                            className="mt-4 text-4xl sm:text-6xl font-bold leading-[1.1] tracking-tight text-neutral-900"
                        >
                            Gastronomía <span className="text-emerald-700">BOA</span>
                        </h1>

                        <div className="mx-auto mt-2 w-[min(520px,90%)]">
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
                        </div>

                        <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-700">
                            Cocina de especialidad, honesta y consciente. Un ritual para
                            disfrutar lento, compartir y volver.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="#categories"
                                className="inline-flex items-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(16,185,129,.20)] transition-colors hover:bg-emerald-800"
                            >
                                Ver el menú
                            </a>
                        </div>
                    </div>
                </section>
                {/* GRID de categorías */}
                <section className="py-8 sm:py-12">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6" id="categories">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {categories.map((cat) => (
                                <CategoryCard key={cat.id} category={cat} onOpen={openCategory} />
                            ))}
                        </div>
                    </div>
                </section>

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












