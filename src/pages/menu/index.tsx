"use client";


import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X, Leaf, ChevronLeft, ChevronRight } from "lucide-react";


// === Imágenes centralizadas ===
import rawImages from "@/data/images.json";
type ImagesJSON = {
    categories: Record<string, string>;
    items: Record<string, string>;
};
const IMAGES = rawImages as ImagesJSON;


/* ========= Tipos ========= */
type MenuItem = {
    name: string;
    price?: number | string;
    note?: string;
    description?: string;
};
type MenuCategory = { id: string; title: string; items: MenuItem[] };


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


/* ========= Diccionario de ingredientes por producto ========= */
const INGREDIENTS: Record<string, string[]> = {
    // Café
    "espresso": ["café de especialidad", "agua filtrada"],
    "americano": ["espresso", "agua caliente"],
    "americano doble": ["espresso doble", "agua caliente"],
    "doppio": ["espresso doble"],
    "latte": ["espresso", "leche texturizada", "microespuma"],
    "flat white": ["doppio", "leche sedosa", "microespuma fina"],
    "iced coffee": ["café filtrado frío", "hielo", "almíbar (opcional)"],
    "capuccino": ["espresso", "leche texturizada", "espuma", "cacao"],
    "• extra shot": ["dosis extra de espresso"],
    "• leche de almendras": ["bebida de almendras", "sin lácteos"],


    // Panadería
    "palmerita": ["masa hojaldre", "manteca", "azúcar orgánica"],
    "roll de canela": ["masa esponjosa", "canela", "glaseado suave"],
    "pain au chocolat": ["hojaldre de manteca", "chocolate amargo"],
    "budines": ["harina", "huevos", "manteca", "cítricos de estación"],
    "croissant": ["manteca", "hojaldre", "fermentación lenta"],
    "medialuna": ["harina", "manteca", "almíbar ligero"],
    "scon": ["harina", "manteca", "leche"],
    "chipá": ["fécula de mandioca", "queso", "huevo"],
    "tostas": ["pan masa madre", "aceite de oliva", "tomate y ajo"],
    "budín cítrico": ["ralladura de limón", "naranja", "glaseado"],
    "alfajor": ["tapitas suaves", "dulce de leche", "coco (opcional)"],
    "brownie / coco c/ centro de frutos rojos": ["cacao amargo", "manteca", "coco", "frutos rojos"],
    "barrita": ["avena", "frutos secos", "miel"],


    // Brunch
    "tostón de palta": ["pan de masa madre", "palta", "limón", "sésamo", "huevo (opcional)"],
    "tostado": ["pan", "queso", "jamón"],


    // Pizzas / Empanadas
    "pizza napolitana": ["masa madre", "salsa de tomate", "mozzarella", "albahaca"],
    "jamón y morrón": ["salsa de tomate", "mozzarella", "jamón", "pimiento asado"],
    "fugazzeta": ["mozzarella", "cebolla", "orégano"],
    "margherita": ["masa ligera", "pomodoro", "fior di latte", "albahaca"],
    "empanadas (verdura / bondiola)": ["masa casera", "relleno de estación"],


    // Wraps
    "wrap veggie": ["tortilla integral", "hummus", "vegetales asados", "hojas verdes"],
    "wrap de pollo": ["pollo grillado", "mix de verdes", "alioli suave"],


    // Bebidas
    "agua (con o sin gas)": ["agua mineral"],
    "limonada / pomelada — vaso": ["cítricos exprimidos", "agua", "hielo"],
    "limonada / pomelada — jarra": ["cítricos exprimidos", "agua", "hielo"],
    "jugo de naranja": ["naranja fresca", "sin azúcar añadida"],
    "kombucha": ["té fermentado", "levaduras naturales"],
    "perrón heineken": ["cerveza tirada"],
    "té (consultar variedad)": ["hebras seleccionadas", "agua a temperatura justa"],


    // Panes
    "brioche": ["manteca", "leche", "huevos", "fermentación lenta"],
    "multisemillas": ["harinas integrales", "semillas mixtas", "masa madre"],
    "molde masa madre": ["harina", "agua", "masa madre", "sal marina"],
};


function describeItem(sectionId: string, name: string, existing?: string) {
    if (existing && existing.trim().length > 0) return existing;
    const key = name.trim().toLowerCase();
    const base = INGREDIENTS[key];
    if (base && base.length) {
        return `Ingredientes: ${base.join(" · ")}. Elaborado de forma artesanal.`;
    }
    switch (sectionId) {
        case "cafe":
            return "Blend de especialidad, extracción precisa y leche texturizada a punto. Consultá por alternativas vegetales.";
        case "panaderia":
            return "Hecho con manteca y fermentaciones lentas para un sabor honesto. Ideal para acompañar con café.";
        case "brunch":
            return "Recetas frescas de estación, pensadas para compartir y disfrutar lento.";
        case "pizzas":
            return "Masa de larga fermentación, tomate maduro y mozzarella; horneado a alta temperatura.";
        case "wraps":
            return "Tortillas suaves con rellenos frescos y salsas caseras. Opción veggie disponible.";
        case "para-tomar":
            return "Bebidas refrescantes preparadas al momento, con frutas reales y botánicos.";
        case "panes":
            return "Panes de masa madre, corteza crujiente y miga húmeda. Fermentación natural.";
        default:
            return "Elaborado con ingredientes de temporada y técnicas que respetan el origen.";
    }
}


/* ========= Data del menú ========= */
const MENU: MenuCategory[] = [
    {
        id: "cafe",
        title: "café",
        items: [
            { name: "Espresso", price: 2700 },
            { name: "Americano", price: 3000 },
            { name: "Americano doble", price: 4000 },
            { name: "Doppio", price: 3600 },
            { name: "Latte", price: 4300 },
            { name: "Flat white", price: 4600 },
            { name: "Iced coffee", price: 5600 },
            { name: "Capuccino", price: 5000 },
            { name: "• extra shot", price: "+1000" },
            { name: "• leche de almendras", price: "+1000" },
        ],
    },
    {
        id: "panaderia",
        title: "panadería",
        items: [
            { name: "Palmerita", price: 2800 },
            { name: "Roll de canela", price: 3500 },
            { name: "Pain au chocolat", price: 3500 },
            { name: "Budines", price: 4500 },
            { name: "Croissant", price: 3500 },
            { name: "Medialuna", price: 3200 },
            { name: "Scon", price: 3500 },
            { name: "Chipá", price: 3800 },
            { name: "Tostas", price: 2800 },
            { name: "Budín cítrico", price: 4500 },
            { name: "Alfajor", price: 3500 },
            { name: "Brownie / coco c/ centro de frutos rojos", price: 4500 },
            { name: "Barrita", price: 5500 },
        ],
    },
    {
        id: "brunch",
        title: "brunch",
        items: [
            { name: "Tostón de palta", price: 6500 },
            { name: "Tostado", price: 8000 },
        ],
    },
    {
        id: "pizzas",
        title: "pizzas y empanadas",
        items: [
            { name: "Pizza napolitana", price: 13000 },
            { name: "Jamón y morrón", price: 15000 },
            { name: "Fugazzeta", price: 14000 },
            { name: "Margherita", price: 13000 },
            { name: "Empanadas (verdura / bondiola)", price: 4000 },
        ],
    },
    {
        id: "wraps",
        title: "wraps",
        items: [
            { name: "Wrap veggie", price: 12000 },
            { name: "Wrap de pollo", price: 13000 },
        ],
    },
    {
        id: "para-tomar",
        title: "para tomar",
        items: [
            { name: "Agua (con o sin gas)", price: 2200 },
            { name: "Limonada / Pomelada — vaso", price: 3200 },
            { name: "Limonada / Pomelada — jarra", price: 5600 },
            { name: "Jugo de naranja", price: 3500 },
            { name: "Kombucha", price: 4800 },
            { name: "Perrón Heineken", price: 5500 },
            { name: "Té (consultar variedad)", price: 2500 },
        ],
    },
    {
        id: "panes",
        title: "panes",
        items: [
            { name: "Brioche", price: 15500 },
            { name: "Multisemillas", price: 15500 },
            { name: "Molde masa madre", price: 19500 },
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


                        {/* Contenido: descripción + precio sutil abajo de ingredientes */}
                        <div className="min-h-0">
                            <p className="text-neutral-700 leading-relaxed text-[15.5px]">
                                {description}
                            </p>
                            {item.note && (
                                <p className="mt-1.5 text-xs text-neutral-500">{item.note}</p>
                            )}


                            {/* Precio debajo, cálido/sutil */}
                            <div className="mt-3">
                                <span className="inline-flex items-center gap-2">
                                    <span className="text-[12px] text-neutral-500">Valor</span>
                                    <span className="px-3 py-1.5 rounded-full font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200">
                                        {formatARS(item.price)}
                                    </span>
                                </span>
                            </div>


                            {/* línea decorativa suave */}
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
                                                    className="
                            group relative w-full text-left rounded-3xl
                            ring-1 ring-emerald-100/70 bg-white
                            shadow-[0_6px_26px_rgba(16,185,129,.08)]
                            hover:shadow-[0_16px_44px_rgba(16,185,129,.16)]
                            hover:ring-emerald-200 transition-all
                            px-4 py-3 sm:px-5 sm:py-4
                          "
                                                    aria-label={`Ver ${it.name}`}
                                                >
                                                    <div className="grid grid-cols-[112px_1fr_auto] items-center gap-4">
                                                        {/* Imagen protagonista */}
                                                        <div className="relative">
                                                            <div className="w-[112px] h-[112px] rounded-2xl overflow-hidden">
                                                                <div
                                                                    className="absolute inset-0 rounded-2xl p-[1px]
                                              bg-[linear-gradient(180deg,rgba(16,185,129,.35),rgba(16,185,129,0))]"
                                                                />
                                                                <img
                                                                    src={thumb}
                                                                    onError={withFallback}
                                                                    alt={it.name}
                                                                    className="relative z-[1] w-full h-full object-cover
                                             transition-transform duration-500 group-hover:scale-[1.06]
                                             saturate-[1.08] contrast-[1.05] rounded-2xl"
                                                                    loading="lazy"
                                                                />
                                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-50/60 to-transparent" />
                                                            </div>
                                                        </div>


                                                        {/* Texto: título + subtítulo */}
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-neutral-900 truncate">
                                                                    {it.name}
                                                                </span>
                                                                {isVegan && (
                                                                    <span className="inline-flex items-center text-emerald-600 text-[11px]">
                                                                        <Leaf className="h-3 w-3 mr-1" /> Vegano
                                                                    </span>
                                                                )}
                                                            </div>


                                                            {short && (
                                                                <p className="text-[12px] text-neutral-500 mt-1 line-clamp-1">
                                                                    {short}
                                                                </p>
                                                            )}


                                                            <div className="mt-2 h-px w-24 bg-gradient-to-r from-emerald-100 via-emerald-50 to-transparent" />
                                                        </div>


                                                        {/* Precio pill */}
                                                        <span
                                                            className="
                                px-3 py-1.5 rounded-full font-semibold text-emerald-700
                                bg-emerald-50 ring-1 ring-emerald-200 whitespace-nowrap
                                group-hover:bg-emerald-100/60 transition-colors
                              "
                                                        >
                                                            {formatARS(it.price)}
                                                        </span>
                                                    </div>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
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
        rounded-[1.75rem] overflow-hidden ring-1 ring-emerald-200/70 bg-white
        shadow-[0_14px_44px_rgba(16,185,129,.12)] transition-transform
        hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
      "
            aria-label={`Abrir ${category.title}`}
        >
            <img
                src={src}
                onError={withFallback}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-5">
                <span className="inline-flex items-center gap-2 text-white/90 text-sm mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Menú BOA
                </span>
                <h3 className="capitalize text-white text-3xl sm:text-4xl font-semibold drop-shadow">
                    {category.title}
                </h3>
                <div className="mt-3">
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            bg-white/90 text-emerald-800 ring-1 ring-emerald-100"
                    >
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
            {/* HERO — sobrio, sin chips ni CTAs, con fondo detallado en verde/blanco/negro */}
            {/* HERO — alineado, limpio y artístico (verde / blanco / negro) */}
            <section aria-labelledby="boa-hero" className="relative overflow-hidden">
                {/* Fondo sobrio con detalles geométricos muy sutiles */}
                <div className="absolute inset-0 -z-10">
                    {/* base radial verde → blanco */}
                    <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_30%_-10%,#ECFDF5_0%,#FFFFFF_65%)]" />
                    {/* grid fino con máscara para no invadir el centro */}
                    <div className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(85%_70%_at_50%_45%,black,transparent)] bg-[length:24px_24px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]" />
                    {/* halo suave superior e inferior para dar profundidad */}
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-50/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-50/60 to-transparent" />
                </div>


                <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* micro-pill discreta */}
                        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-emerald-700">
                            Sabores, arte y comunidad
                        </div>


                        {/* título centrado y compacto */}
                        <h1
                            id="boa-hero"
                            className="mt-4 text-4xl sm:text-6xl font-semibold leading-[1.1] tracking-tight text-neutral-900"
                        >
                            Gastronomía <span className="text-emerald-700">BOA</span>
                        </h1>


                        {/* subrayado artístico (SVG) perfectamente centrado bajo el título */}
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


                        {/* bajada */}
                        <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-700">
                            Cocina de especialidad, honesta y consciente. Un ritual para disfrutar
                            lento, compartir y volver.
                        </p>


                        {/* CTAs alineados y consistentes */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="#menu-categorias"
                                className="inline-flex items-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(16,185,129,.20)] transition-colors hover:bg-emerald-800"
                            >
                                Ver el menú
                            </a>
                            <a
                                href="/origenes"
                                className="inline-flex items-center rounded-full border border-emerald-200 bg-white/90 px-6 py-3 text-sm font-medium text-emerald-800 hover:bg-white"
                            >
                                Orígenes & Café
                            </a>
                        </div>
                    </div>
                </div>
            </section>






            {/* GRID de categorías */}
            <section className="py-8 sm:py-12">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {categories.map((cat) => (
                            <CategoryCard key={cat.id} category={cat} onOpen={openCategory} />
                        ))}
                    </div>
                </div>
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
        </section>
    );
}












