
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
    Calendar,
    Search,
    Filter,
    Clock,
    Users,
    MapPin,
    Sparkles,
    Star
} from "lucide-react";

export default function EventsPage() {
    const { events, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;

            const eventDate = new Date(event.date);
            const eventMonth = eventDate.getMonth();
            const matchesMonth = selectedMonth === "all" || parseInt(selectedMonth) === eventMonth;

            return matchesSearch && matchesCategory && matchesMonth;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [events, searchTerm, selectedCategory, selectedMonth]);

    const categories = Array.from(new Set(events.map(event => event.category)));
    const months = [
        { value: "0", label: "Enero" },
        { value: "1", label: "Febrero" },
        { value: "2", label: "Marzo" },
        { value: "3", label: "Abril" },
        { value: "4", label: "Mayo" },
        { value: "5", label: "Junio" },
        { value: "6", label: "Julio" },
        { value: "7", label: "Agosto" },
        { value: "8", label: "Septiembre" },
        { value: "9", label: "Octubre" },
        { value: "10", label: "Noviembre" },
        { value: "11", label: "Diciembre" }
    ];

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Calendar className="h-12 w-12" />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[92vh] overflow-hidden font-sans py-24">

                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "url('https://res.cloudinary.com/dasch1s5i/image/upload/v1757016089/boa-events-bg_lcgamh.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <Calendar className="h-8 w-8 text-emerald-600" />
                            <Sparkles className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h1 className="boa-heading text-5xl sm:text-6xl font-semibold text-neutral-900 mb-6">
                            Eventos Especiales
                        </h1>
                        <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
                            Talleres únicos, charlas inspiradoras, ferias y experiencias especiales que enriquecen
                            tu camino hacia el bienestar y la creatividad.
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
                            <span className="font-medium">Filtrar eventos</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input
                                    placeholder="Buscar eventos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full sm:w-64"
                                />
                            </div>

                            {/* Month Filter */}
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Mes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los meses</SelectItem>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
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

            {/* Events Grid */}
            <section className="py-16 bg-neutral-50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-20">
                            <Calendar className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-neutral-600 mb-2">
                                No se encontraron eventos
                            </h3>
                            <p className="text-neutral-500 mb-6">
                                Intenta ajustar tus filtros de búsqueda
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedMonth("all");
                                    setSelectedCategory("all");
                                }}
                                variant="outline"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event) => {
                                const eventDate = new Date(event.date);
                                const isUpcoming = eventDate > new Date();
                                const isPast = eventDate < new Date();
                                const isToday = eventDate.toDateString() === new Date().toDateString();

                                return (
                                    <Card key={event.id} className="group cursor-pointer border-0 shadow-lg shadow-neutral-200/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 bg-white">
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent" />
                                            <Badge className="absolute top-4 left-4 bg-white/90 text-neutral-700 hover:bg-white">
                                                {event.category}
                                            </Badge>
                                            {event.featured && (
                                                <Badge className="absolute top-4 right-4 bg-emerald-600 text-white">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Destacado
                                                </Badge>
                                            )}
                                            {isPast && (
                                                <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center">
                                                    <Badge className="bg-neutral-800 text-white">Finalizado</Badge>
                                                </div>
                                            )}
                                            {isToday && (
                                                <Badge className="absolute bottom-4 left-4 bg-red-600 text-white animate-pulse">
                                                    ¡Hoy!
                                                </Badge>
                                            )}
                                        </div>

                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <h3 className="boa-heading text-xl font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors">
                                                    {event.title}
                                                </h3>
                                                <span className="text-lg font-bold text-emerald-600">
                                                    ${event.price}
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
                                                {event.description}
                                            </p>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                                                    {eventDate.toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                                                    {event.location || 'BOA - Espacio Principal'}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center text-sm">
                                                    <Users className="h-4 w-4 mr-1 text-neutral-400" />
                                                    <span className={event.enrolled >= event.capacity ? "text-red-500 font-medium" : "text-neutral-600"}>
                                                        {event.enrolled}/{event.capacity}
                                                    </span>
                                                </div>

                                                <Link href={`/events/${event.id}`}>
                                                    <Button
                                                        size="sm"
                                                        className={isPast
                                                            ? "bg-neutral-400 hover:bg-neutral-400 cursor-not-allowed"
                                                            : event.enrolled >= event.capacity
                                                                ? "bg-neutral-400 hover:bg-neutral-400 cursor-not-allowed"
                                                                : "bg-emerald-600 hover:bg-emerald-700"
                                                        }
                                                        disabled={isPast || event.enrolled >= event.capacity}
                                                    >
                                                        {isPast ? "Finalizado" : event.enrolled >= event.capacity ? "Completo" : "Ver detalles"}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-4">
                            ¿Tienes una idea para un evento?
                        </h2>
                        <p className="text-lg text-neutral-600 mb-8">
                            En BOA nos encanta colaborar con talentosos facilitadores y artistas.
                            Si tienes una propuesta para un taller, charla o evento especial, cuéntanos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl">
                                    Proponer un evento
                                </Button>
                            </Link>
                            <Link href="/activities">
                                <Button size="lg" variant="outline" className="bg-transparent hover:bg-neutral-50 px-8 py-3 rounded-2xl border-neutral-300 hover:border-emerald-300 hover:text-emerald-600">
                                    Ver actividades regulares
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
