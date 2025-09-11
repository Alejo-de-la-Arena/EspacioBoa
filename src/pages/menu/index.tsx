"use client";


import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, Heart, Leaf, Sparkles } from "lucide-react";


export default function MenuPage() {
    const { menuItems, loading } = useApp();
    const [favorites, setFavorites] = useState<string[]>([]);


    const filteredItemsByCategory = useMemo(() => {
        const categories = ["Café", "Bebidas frías", "Desayunos", "Almuerzos", "Pastelería"];
        const result: Record<string, any[]> = {};
        categories.forEach((c) => (result[c] = menuItems.filter((i) => i.category === c)));
        return result;
    }, [menuItems]);


    const toggleFavorite = (id: string) =>
        setFavorites((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));


    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Coffee className="h-12 w-12" />
                    </div>
                </div>
            </Layout>
        );
    }


    return (
        <Layout>
            {/* ===== HERO BOA: cálido, cultural, artístico ===== */}
            <section
                className="
          relative overflow-hidden py-24 sm:py-28
          bg-[radial-gradient(160%_120%_at_30%_-10%,#ECFDF5_0%,#F7FFF9_35%,#FAFDFB_62%,#F8F4EE_100%)]
        "
            >
                <div className="pointer-events-none absolute inset-0">
                    <div
                        className="absolute -top-20 -left-16 w-[32rem] h-[32rem] rounded-[52%] blur-3xl opacity-60"
                        style={{
                            background:
                                "radial-gradient(50% 50% at 50% 50%, rgba(16,185,129,.18) 0%, rgba(16,185,129,0) 70%)",
                        }}
                    />
                    <div
                        className="absolute -bottom-24 -right-16 w-[38rem] h-[38rem] rounded-[46%] blur-3xl opacity-60"
                        style={{
                            background:
                                "radial-gradient(50% 50% at 50% 50%, rgba(5,150,105,.16) 0%, rgba(5,150,105,0) 70%)",
                        }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />
                </div>


                <div className="relative z-10 container max-w-6xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/70 backdrop-blur px-4 py-2 text-emerald-700 mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-medium tracking-wide">
                            Sabores que conectan comunidad
                        </span>
                    </div>


                    <h1 className="boa-heading text-5xl sm:text-6xl font-semibold text-neutral-900">
                        Gastronomía BOA
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                        Café de especialidad, recetas honestas y alimentos conscientes. Un menú hecho para
                        disfrutar lento, compartir y volver.
                    </p>
                </div>
            </section>


            {/* ===== BARRA DE CATEGORÍAS (glass + tinta) ===== */}
            <section
                className="
          relative py-10
          bg-[conic-gradient(from_180deg_at_50%_0%,#F6FBF7_0%,#FFFFFF_40%,#F1F8F3_100%)]
          border-y border-emerald-100/60
        "
            >
                <div
                    className="pointer-events-none absolute inset-x-0 -top-10 mx-auto w-72 h-24 blur-2xl opacity-60"
                    style={{
                        background:
                            "radial-gradient(60% 50% at 50% 50%, rgba(16,185,129,.20) 0%, rgba(16,185,129,0) 70%)",
                    }}
                />
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs defaultValue="Café" className="w-full">
                        <TabsList
                            className="
                grid w-full grid-cols-5 rounded-2xl p-1
                bg-white/70 backdrop-blur shadow-[0_8px_30px_rgb(16_185_129_/0.08)]
                ring-1 ring-emerald-200/60
              "
                        >
                            {["Café", "Bebidas frías", "Desayunos", "Almuerzos", "Pastelería"].map((c) => (
                                <TabsTrigger
                                    key={c}
                                    value={c}
                                    className="
                    rounded-xl px-4 py-2 text-sm text-neutral-700
                    data-[state=active]:bg-[radial-gradient(60%_80%_at_50%_0%,#E9FBF2_0%,#FFFFFF_100%)]
                    data-[state=active]:text-emerald-800
                    data-[state=active]:shadow-[inset_0_0_0_1px_rgba(5,150,105,.15)]
                  "
                                >
                                    {c}
                                </TabsTrigger>
                            ))}
                        </TabsList>


                        <div className="text-center mt-10 mb-6">
                            <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-2">
                                Conocé nuestro menú
                            </h2>
                            <p className="text-neutral-600">Nuestras creaciones destacadas que no te podés perder</p>
                        </div>


                        {Object.entries(filteredItemsByCategory).map(([category, items]) => (
                            <TabsContent key={category} value={category} className="mt-6">
                                {items.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Coffee className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                                            No se encontraron productos
                                        </h3>
                                        <p className="text-neutral-500">Pronto sumaremos más opciones.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-2xl p-[1px] bg-[linear-gradient(180deg,rgba(16,185,129,.25),rgba(16,185,129,0))]"
                                            >
                                                <Card className="group bg-white rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                                    <div className="flex gap-4 p-6">
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-emerald-100">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                                                                        {item.name}
                                                                    </h4>
                                                                    <div className="mt-1">
                                                                        <Badge className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                            {item.category}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className={`p-1 ${favorites.includes(item.id) ? "text-emerald-600" : "text-neutral-400"
                                                                            }`}
                                                                        onClick={() => toggleFavorite(item.id)}
                                                                        aria-label="Favorito"
                                                                    >
                                                                        <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                                                                    </Button>
                                                                    <span className="font-bold text-emerald-700">${item.price}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                                                                {item.description}
                                                            </p>
                                                            {item.isVegan && (
                                                                <div className="flex items-center text-emerald-600 text-xs mt-2">
                                                                    <Leaf className="h-3 w-3 mr-1" />
                                                                    Opción vegana
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>


            {/* ===== CAFÉ DE ESPECIALIDAD (valores y ventaja competitiva, tonos claros) ===== */}
            <section className="relative py-20 bg-[radial-gradient(120%_100%_at_50%_0%,#F2FFF7_0%,#FFFFFF_55%,#F7FAF8_100%)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="boa-heading text-4xl sm:text-5xl font-semibold text-neutral-900">
                            Café de Especialidad
                        </h2>
                        <p className="mt-4 text-lg text-neutral-600">
                            Relación directa con productores, tostado de autor y un servicio que celebra el ritual del café.
                        </p>


                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-white/80 backdrop-blur border border-emerald-100">
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-3 h-10 w-10 rounded-full grid place-items-center bg-emerald-50 text-emerald-700">
                                        <Leaf className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900">Origen Directo & Comercio Justo</h3>
                                    <p className="mt-2 text-sm text-neutral-600">
                                        Trazabilidad completa y precios justos que impactan positivamente en las comunidades productoras.
                                    </p>
                                </CardContent>
                            </Card>


                            <Card className="bg-white/80 backdrop-blur border border-emerald-100">
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-3 h-10 w-10 rounded-full grid place-items-center bg-emerald-50 text-emerald-700">
                                        <Coffee className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900">Tostado de Autor</h3>
                                    <p className="mt-2 text-sm text-neutral-600">
                                        Perfiles de tueste pensados para resaltar dulzor, cuerpo y notas únicas de cada origen.
                                    </p>
                                </CardContent>
                            </Card>


                            <Card className="bg-white/80 backdrop-blur border border-emerald-100">
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-3 h-10 w-10 rounded-full grid place-items-center bg-emerald-50 text-emerald-700">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900">Comunidad & Ritual</h3>
                                    <p className="mt-2 text-sm text-neutral-600">
                                        Talleres, catas y un servicio humano para compartir el ritual alrededor de una buena taza.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>


                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-2xl">
                                Conocé Nuestros Orígenes
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-emerald-700 text-emerald-800 hover:bg-emerald-700 hover:text-white px-8 py-3 rounded-2xl"
                            >
                                Reservá una Cata
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

