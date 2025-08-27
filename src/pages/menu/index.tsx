
import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Coffee,
    Search,
    Heart,
    Star,
    Leaf,
    Sparkles,
    Filter
} from "lucide-react";

export default function MenuPage() {
    const { menuItems, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);

    const filteredItemsByCategory = useMemo(() => {
        const categories = ["Café", "Bebidas frías", "Desayunos", "Almuerzos", "Pastelería"];
        const result: { [key: string]: any[] } = {};

        categories.forEach(category => {
            result[category] = menuItems.filter(item => {
                const matchesCategory = item.category === category;
                const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesCategory && matchesSearch;
            });
        });

        return result;
    }, [menuItems, searchTerm]);

    const toggleFavorite = (itemId: string) => {
        setFavorites(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const specialItems = menuItems.filter(item => item.featured);

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
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-amber-50/30 via-white to-neutral-50 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-12 w-24 h-24 bg-amber-100/50 organic-shape floating-animation" />
                    <div className="absolute bottom-16 left-16 w-32 h-32 bg-emerald-100/40 organic-shape floating-animation" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-neutral-200/40 rounded-full floating-animation" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <Coffee className="h-8 w-8 text-amber-600" />
                            <Sparkles className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h1 className="boa-heading text-5xl sm:text-6xl font-semibold text-neutral-900 mb-6">
                            Gastronomía
                        </h1>
                        <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
                            Café de especialidad, opciones saludables y creaciones culinarias conscientes
                            preparadas con ingredientes frescos y amor por cada detalle.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search & Filters */}
            <section className="py-8 bg-white border-b border-neutral-100">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center space-x-2 text-neutral-600">
                            <Filter className="h-5 w-5" />
                            <span className="font-medium">Explorar nuestro menú</span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                                placeholder="Buscar en el menú..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full sm:w-80"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Specials Section */}
            {specialItems.length > 0 && (
                <section className="py-16 bg-gradient-to-br from-amber-50 to-emerald-50/30">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-4">
                                Especiales del Mes
                            </h2>
                            <p className="text-lg text-neutral-600">
                                Nuestras creaciones destacadas que no puedes perderte
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {specialItems.map((item) => (
                                <Card key={item.id} className="group border-0 shadow-lg shadow-amber-200/60 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 hover:-translate-y-1 bg-white">
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent" />
                                        <Badge className="absolute top-4 left-4 bg-amber-600 text-white">
                                            <Star className="h-3 w-3 mr-1" />
                                            Especial
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white ${favorites.includes(item.id) ? "text-red-500" : "text-neutral-600"
                                                }`}
                                            onClick={() => toggleFavorite(item.id)}
                                        >
                                            <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                                        </Button>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="boa-heading text-lg font-semibold text-neutral-900 mb-1 group-hover:text-amber-600 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <Badge variant="secondary" className="text-xs mb-2">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-amber-600">
                                                    ${item.price}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                                            {item.description}
                                        </p>
                                        {item.isVegan && (
                                            <div className="flex items-center text-emerald-600 text-xs">
                                                <Leaf className="h-3 w-3 mr-1" />
                                                Opción vegana
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Menu Categories */}
            <section className="py-16 bg-neutral-50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs defaultValue="Café" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 mb-12 bg-white rounded-2xl p-1 shadow-lg">
                            <TabsTrigger value="Café" className="rounded-xl">Café</TabsTrigger>
                            <TabsTrigger value="Bebidas frías" className="rounded-xl">Bebidas</TabsTrigger>
                            <TabsTrigger value="Desayunos" className="rounded-xl">Desayunos</TabsTrigger>
                            <TabsTrigger value="Almuerzos" className="rounded-xl">Almuerzos</TabsTrigger>
                            <TabsTrigger value="Pastelería" className="rounded-xl">Postres</TabsTrigger>
                        </TabsList>

                        {Object.entries(filteredItemsByCategory).map(([category, items]) => (
                            <TabsContent key={category} value={category} className="mt-8">
                                {items.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Coffee className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                                            No se encontraron productos
                                        </h3>
                                        <p className="text-neutral-500">
                                            Intenta con otro término de búsqueda
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {items.map((item) => (
                                            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-neutral-200/60 bg-white">
                                                <div className="flex gap-4 p-6">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors">
                                                                    {item.name}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {item.isVegan && (
                                                                        <div className="flex items-center text-emerald-600 text-xs">
                                                                            <Leaf className="h-3 w-3 mr-1" />
                                                                            Vegano
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className={`p-1 ${favorites.includes(item.id) ? "text-red-500" : "text-neutral-400"
                                                                        }`}
                                                                    onClick={() => toggleFavorite(item.id)}
                                                                >
                                                                    <Heart className={`h-3 w-3 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                                                                </Button>
                                                                <span className="font-bold text-emerald-600">
                                                                    ${item.price}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* Coffee Culture Section */}
            <section className="py-20 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            <h2 className="boa-heading text-4xl sm:text-5xl font-semibold mb-6">
                                Café de Especialidad
                            </h2>
                            <p className="text-xl text-neutral-300 leading-relaxed mb-8">
                                Cada taza cuenta una historia. Trabajamos directamente con productores
                                para traerte granos excepcionales, tostados con precisión y preparados
                                con técnicas que resaltan los sabores únicos de cada origen.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-amber-400 mb-2">12+</div>
                                    <div className="text-sm text-neutral-400">Orígenes Diferentes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-amber-400 mb-2">5</div>
                                    <div className="text-sm text-neutral-400">Métodos de Preparación</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-amber-400 mb-2">100%</div>
                                    <div className="text-sm text-neutral-400">Comercio Justo</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-2xl">
                                Conoce Nuestros Orígenes
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 rounded-2xl">
                                Reserva una Cata
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
