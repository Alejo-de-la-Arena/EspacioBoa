"use client";


import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Leaf, ChevronLeft, ChevronRight } from "lucide-react";


/* ========= Tipos ========= */
type MenuItem = {
    name: string;
    price?: number | string;
    note?: string;
    image?: string;
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
        : (n ?? "—");


const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&q=80&auto=format&fit=crop";


/* ========= Fotos por sección (cambiables) ========= */
const CATEGORY_IMAGES: Record<string, string> = {
    cafe:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1600&q=80&auto=format&fit=crop",
    panaderia:
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1600&q=80&auto=format&fit=crop",
    brunch:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop",
    pizzas:
        "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1757996232/Need_a_side_hustle_that_pays__Fiverr_is_the_rmosdb.jpg",
    wraps:
        "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?w=1600&q=80&auto=format&fit=crop",
    "para-tomar":
        "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=1600&q=80&auto=format&fit=crop",
    panes:
        "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1757996275/19327356-e68b-4793-91d1-9ef85d08108b_ztib8k.jpg",
};


/* ========= Fotos por producto (opcional/editable) ========= */
const ITEM_IMAGES: Record<string, string> = {
    espresso:
        "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=1200&q=80&auto=format&fit=crop",
    americano:
        "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=1200&q=80&auto=format&fit=crop",
    latte:
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&q=80&auto=format&fit=crop",
    "flat white":
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=1200&q=80&auto=format&fit=crop",
    cappuccino:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80&auto=format&fit=crop",
    croissant:
        "https://images.unsplash.com/photo-1541599188778-cdc73298e8f8?w=1200&q=80&auto=format&fit=crop",
    "roll de canela":
        "https://images.unsplash.com/photo-1541592553160-82008b127ccb?w=1200&q=80&auto=format&fit=crop",
    "pain au chocolat":
        "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?w=1200&q=80&auto=format&fit=crop",
    "tostón de palta":
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1200&q=80&auto=format&fit=crop",
    "pizza napolitana":
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80&auto=format&fit=crop",
    "wrap veggie":
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80&auto=format&fit=crop",
    kombucha:
        "https://images.unsplash.com/photo-1598015570440-0e8d2f9d9f96?w=1200&q=80&auto=format&fit=crop",
};


const imgForItem = (sectionId: string, name: string, explicit?: string) => {
    if (explicit) return explicit;
    const key = name.trim().toLowerCase();
    return ITEM_IMAGES[key] || CATEGORY_IMAGES[sectionId] || FALLBACK_IMAGE;
};


const withFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const t = e.currentTarget;
    if (t.src !== FALLBACK_IMAGE) t.src = FALLBACK_IMAGE;
};


/* ========= Data (editable) ========= */
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


/* ==================== Modal de producto ==================== */
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
    const img = imgForItem(sectionId, item.name, item.image);


    return (
        <div className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-sm grid place-items-center p-3 sm:p-6" onClick={onClose}>
            <div
                className="relative w-full max-w-5xl rounded-[28px] bg-white overflow-hidden ring-1 ring-emerald-200 shadow-[0_50px_140px_rgba(16,185,129,.25)]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 ring-1 ring-emerald-200 text-neutral-700 hover:text-neutral-900"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5" />
                </button>


                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-48 md:h-[28rem]">
                        <img
                            src={img}
                            onError={withFallback}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>


                    <div className="p-6 md:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="text-2xl md:text-3xl font-semibold text-neutral-900">{item.name}</h3>
                            <span className="font-bold text-emerald-700 text-xl md:text-2xl whitespace-nowrap">
                                {formatARS(item.price)}
                            </span>
                        </div>


                        <div className="mt-4 flex items-center gap-2">
                            <Badge className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100">
                                BOA
                            </Badge>
                            {String(item.name).toLowerCase().includes("veg") && (
                                <span className="inline-flex items-center text-emerald-600 text-[11px]">
                                    <Leaf className="h-3 w-3 mr-1" /> Vegano
                                </span>
                            )}
                        </div>


                        <p className="mt-5 text-neutral-700 leading-relaxed text-base">
                            {item.description ||
                                "Elaborado con ingredientes de temporada y técnicas que respetan el origen. Preguntanos por maridajes del día."}
                        </p>
                        {item.note && <p className="mt-2 text-sm text-neutral-500">{item.note}</p>}


                        <div className="mt-8 flex items-center justify-between">
                            <Button variant="outline" className="rounded-full" onClick={onPrev}>
                                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                            </Button>
                            <Button className="rounded-full bg-emerald-700 hover:bg-emerald-800" onClick={onNext}>
                                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


/* ==================== Modal de categoría (centrado y con scroll perfecto) ==================== */
function CategoryModal({
    open,
    category,
    onClose,
}: {
    open: boolean;
    category?: MenuCategory;
    onClose: () => void;
}) {
    const [idx, setIdx] = useState(0);
    const items = category?.items || [];
    const item = items[idx];


    useEffect(() => setIdx(0), [category?.id]);


    const prev = () => setIdx((i) => (i - 1 + items.length) % Math.max(items.length, 1));
    const next = () => setIdx((i) => (i + 1) % Math.max(items.length, 1));


    const [openProduct, setOpenProduct] = useState(false);


    if (!open || !category) return null;


    const headerImg = CATEGORY_IMAGES[category.id] || FALLBACK_IMAGE;


    return (
        <div className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm grid place-items-center p-3 sm:p-6" onClick={onClose}>
            <div
                className="relative w-full max-w-4xl md:max-w-5xl bg-white rounded-3xl ring-1 ring-emerald-200 shadow-[0_40px_120px_rgba(16,185,129,.25)] overflow-hidden max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* header */}
                <div className="relative">
                    <img
                        src={headerImg}
                        onError={withFallback}
                        alt={category.title}
                        className="w-full h-44 md:h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <button
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 ring-1 ring-emerald-200 text-neutral-700 hover:text-neutral-900"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-4 text-white drop-shadow">
                        <h3 className="text-xl md:text-2xl font-semibold capitalize">{category.title}</h3>
                        <p className="text-xs md:text-sm opacity-90">Menú de la sección</p>
                    </div>
                </div>


                {/* lista scrolleable solo aquí */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-11rem)] md:max-h-[calc(90vh-13rem)]">
                    {items.length === 0 ? (
                        <p className="text-neutral-600">No hay productos en esta sección todavía.</p>
                    ) : (
                        <ul className="space-y-3">
                            {items.map((it, i) => {
                                const thumb = imgForItem(category.id, it.name, it.image);
                                return (
                                    <li key={i}>
                                        <button
                                            onClick={() => {
                                                setIdx(i);
                                                setOpenProduct(true);
                                            }}
                                            className="
                        w-full text-left rounded-2xl ring-1 ring-neutral-100 hover:ring-emerald-200
                        bg-white/90 hover:bg-emerald-50/50 transition-colors px-4 py-3.5
                      "
                                            aria-label={`Ver ${it.name}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden ring-1 ring-neutral-200 flex-shrink-0">
                                                    <img
                                                        src={thumb}
                                                        onError={withFallback}
                                                        alt={it.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>


                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-baseline gap-3">
                                                        <span className="font-medium text-neutral-900 truncate">{it.name}</span>
                                                        <span className="hidden sm:block flex-1 border-b border-dotted border-neutral-300/90" />
                                                        <span className="font-semibold text-emerald-700 whitespace-nowrap">
                                                            {formatARS(it.price)}
                                                        </span>
                                                    </div>
                                                    {it.note && <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{it.note}</p>}
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>


            {/* modal de producto */}
            <ProductModal
                open={openProduct}
                item={item}
                sectionId={category.id}
                onClose={() => setOpenProduct(false)}
                onPrev={prev}
                onNext={next}
            />
        </div>
    );
}


/* ==================== Card de sección (grande y full grid) ==================== */
function CategoryCard({
    category,
    onOpen,
}: {
    category: MenuCategory;
    onOpen: (c: MenuCategory) => void;
}) {
    const src = CATEGORY_IMAGES[category.id] || FALLBACK_IMAGE;
    return (
        <div
            className="
        group relative h-[16rem] sm:h-[20rem] lg:h-[22rem]
        rounded-[1.75rem] overflow-hidden ring-1 ring-emerald-200/70 bg-white
        shadow-[0_14px_44px_rgba(16,185,129,.12)]
      "
        >
            <img
                src={src}
                onError={withFallback}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />


            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <h3 className="capitalize text-white text-3xl sm:text-4xl font-semibold drop-shadow">
                    {category.title}
                </h3>
                <Button
                    className="mt-3 rounded-full bg-white/90 text-emerald-800 hover:bg-white"
                    onClick={() => onOpen(category)}
                    size="sm"
                >
                    Ver menú
                </Button>
            </div>
        </div>
    );
}


/* ==================== Página ==================== */
export default function MenuPage() {
    const categories = useMemo(() => MENU, []);
    const [openCategory, setOpenCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<MenuCategory | undefined>(undefined);


    return (
        <section>
            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="relative bg-[radial-gradient(120%_120%_at_20%_-10%,#E9FBF2_0%,#F6FAF7_40%,#FFFFFF_70%),radial-gradient(120%_120%_at_110%_20%,#F2FFF7_0%,#FFFFFF_60%)] border-b border-emerald-100/60">
                    <div
                        className="pointer-events-none absolute -top-16 -left-16 w-[24rem] h-[24rem] rounded-[50%] blur-3xl opacity-40"
                        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(16,185,129,.20) 0%, rgba(16,185,129,0) 70%)" }}
                    />
                    <div
                        className="pointer-events-none absolute -bottom-20 -right-24 w-[30rem] h-[30rem] rounded-[50%] blur-3xl opacity-40"
                        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(5,150,105,.18) 0%, rgba(5,150,105,0) 70%)" }}
                    />
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-900">
                            Gastronomía <span className="text-emerald-700">BOA</span>
                        </h1>
                        <p className="mt-3 text-base sm:text-lg text-neutral-700 max-w-3xl mx-auto">
                            Arte, comunidad y sabores de especialidad. Un menú{" "}
                            <span className="text-emerald-700 font-medium">honesto</span> y{" "}
                            <span className="text-emerald-700 font-medium">consciente</span> para disfrutar lento.
                        </p>
                    </div>
                </div>
            </section>


            {/* GRID de secciones a todo el ancho (sin contenedor verde ni títulos extra) */}
            <section className="py-8 sm:py-12">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {categories.map((cat) => (
                            <CategoryCard
                                key={cat.id}
                                category={cat}
                                onOpen={(c) => {
                                    setSelectedCategory(c);
                                    setOpenCategory(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>


            {/* Modales */}
            <CategoryModal
                open={openCategory}
                category={selectedCategory}
                onClose={() => setOpenCategory(false)}
            />
        </section>
    );
}











