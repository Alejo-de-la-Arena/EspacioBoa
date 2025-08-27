
import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import {
    Heart,
    Search,
    Filter,
    Calendar,
    Clock,
    Users,
    MapPin,
    Sparkles
} from "lucide-react";

export default function ActivitiesPage() {
    const { activities, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDay, setSelectedDay] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredActivities = useMemo(() => {
        return activities.filter(activity => {
            const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDay = selectedDay === "all" || activity.schedule.day === selectedDay;
            const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory;

            return matchesSearch && matchesDay && matchesCategory;
        });
    }, [activities, searchTerm, selectedDay, selectedCategory]);

    const categories = Array.from(new Set(activities.map(activity => activity.category)));
    const days = Array.from(new Set(activities.map(activity => activity.schedule.day)));

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Heart className="h-12 w-12" />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-neutral-50 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-24 h-24 bg-emerald-100/40 organic-shape floating-animation" />
                    <div className="absolute bottom-16 left-16 w-32 h-32 bg-neutral-100/60 organic-shape floating-animation" style={{ animationDelay: '3s' }} />
                </div>

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <Heart className="h-8 w-8 text-emerald-600" />
                            <Sparkles className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h1 className="boa-heading text-5xl sm:text-6xl font-semibold text-neutral-900 mb-6">
                            Actividades
                        </h1>
                        <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
                            Descubre nuestras actividades regulares diseñadas para nutrir tu cuerpo, mente y espíritu.
                            Desde yoga y meditación hasta arte y talleres creativos.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 bg-white border-b border-neutral-100">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center space-x-2 text-neutral-600">
                            <Filter className="h-5 w-5" />
                            <span className="font-medium">Filtrar actividades</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input
                                    placeholder="Buscar actividades..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full sm:w-64"
                                />
                            </div>

                            {/* Day Filter */}
                            <Select value={selectedDay} onValueChange={setSelectedDay}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Día" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los días</SelectItem>
                                    {days.map((day) => (
                                        <SelectItem key={day} value={day}>{day}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Activities Grid */}
            <section className="py-16 bg-neutral-50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredActivities.length === 0 ? (
                        <div className="text-center py-20">
                            <Heart className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-neutral-600 mb-2">
                                No se encontraron actividades
                            </h3>
                            <p className="text-neutral-500 mb-6">
                                Intenta ajustar tus filtros de búsqueda
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedDay("all");
                                    setSelectedCategory("all");
                                }}
                                variant="outline"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredActivities.map((activity) => (
                                <Card key={activity.id} className="group cursor-pointer border-0 shadow-lg shadow-neutral-200/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 bg-white">
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={activity.image}
                                            alt={activity.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent" />
                                        <Badge className="absolute top-4 left-4 bg-white/90 text-neutral-700 hover:bg-white">
                                            {activity.category}
                                        </Badge>
                                        {activity.featured && (
                                            <Badge className="absolute top-4 right-4 bg-emerald-600 text-white">
                                                <Sparkles className="h-3 w-3 mr-1" />
                                                Destacada
                                            </Badge>
                                        )}
                                    </div>

                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <h3 className="boa-heading text-xl font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors">
                                                {activity.title}
                                            </h3>
                                            <span className="text-lg font-bold text-emerald-600">
                                                ${activity.price}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
                                            {activity.description}
                                        </p>

                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-neutral-500">
                                                <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                                                {activity.schedule.day}
                                            </div>
                                            <div className="flex items-center text-sm text-neutral-500">
                                                <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                                                {activity.schedule.time}
                                            </div>
                                            <div className="flex items-center text-sm text-neutral-500">
                                                <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                                                {activity.location}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4">
                                            <div className="flex items-center text-sm">
                                                <Users className="h-4 w-4 mr-1 text-neutral-400" />
                                                <span className={activity.enrolled >= activity.capacity ? "text-red-500 font-medium" : "text-neutral-600"}>
                                                    {activity.enrolled}/{activity.capacity}
                                                </span>
                                            </div>

                                            <Link href={`/activities/${activity.id}`}>
                                                <Button
                                                    size="sm"
                                                    className={activity.enrolled >= activity.capacity
                                                        ? "bg-neutral-400 hover:bg-neutral-400 cursor-not-allowed"
                                                        : "bg-emerald-600 hover:bg-emerald-700"
                                                    }
                                                    disabled={activity.enrolled >= activity.capacity}
                                                >
                                                    {activity.enrolled >= activity.capacity ? "Completo" : "Ver detalles"}
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-4">
                            ¿No encontraste lo que buscabas?
                        </h2>
                        <p className="text-lg text-neutral-600 mb-8">
                            Contáctanos y cuéntanos qué tipo de actividad te gustaría ver en BOA.
                            Siempre estamos abiertos a nuevas ideas y propuestas.
                        </p>
                        <Link href="/contact">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl">
                                Proponer una actividad
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
