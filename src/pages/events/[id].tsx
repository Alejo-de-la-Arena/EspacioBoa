
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    Star,
    ArrowLeft,
    Sparkles,
    User,
    Phone,
    Mail,
    CheckCircle
} from "lucide-react";

export default function EventDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { events, loading } = useApp();
    const [isEnrolling, setIsEnrolling] = useState(false);

    const event = events.find(e => e.id === id);

    const handleEnroll = async () => {
        setIsEnrolling(true);
        // Simulate enrollment process
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsEnrolling(false);
        // Here you would typically update the event enrollment count
        alert("¡Inscripción exitosa! Recibirás un email de confirmación con todos los detalles.");
    };

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

    if (!event) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Evento no encontrado</h1>
                        <Button onClick={() => router.push("/events")}>
                            Volver a eventos
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    const eventDate = new Date(event.date);
    const isFullyBooked = event.enrolled >= event.capacity;
    const spotsRemaining = event.capacity - event.enrolled;
    const isPast = eventDate < new Date();
    const isToday = eventDate.toDateString() === new Date().toDateString();

    return (
        <Layout>
            {/* Back Button */}
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4 hover:bg-neutral-100"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>

            {/* Hero Section */}
            <section className="relative pb-16">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <div className="relative">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-96 object-cover rounded-3xl shadow-xl shadow-neutral-900/10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent rounded-3xl" />
                            {event.featured && (
                                <Badge className="absolute top-6 left-6 bg-emerald-600 text-white">
                                    <Star className="h-3 w-3 mr-1" />
                                    Evento destacado
                                </Badge>
                            )}
                            {isPast && (
                                <div className="absolute inset-0 bg-neutral-900/50 rounded-3xl flex items-center justify-center">
                                    <Badge className="bg-neutral-800 text-white text-lg px-4 py-2">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Evento Finalizado
                                    </Badge>
                                </div>
                            )}
                            {isToday && !isPast && (
                                <Badge className="absolute top-6 right-6 bg-red-600 text-white animate-pulse">
                                    ¡Hoy!
                                </Badge>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            <div>
                                <Badge className="mb-4">{event.category}</Badge>
                                <h1 className="boa-heading text-4xl sm:text-5xl font-semibold text-neutral-900 mb-4">
                                    {event.title}
                                </h1>
                                <p className="text-xl text-neutral-600 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            {/* Event Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center text-neutral-600">
                                    <Calendar className="h-5 w-5 mr-3 text-emerald-500" />
                                    <span>{eventDate.toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Clock className="h-5 w-5 mr-3 text-emerald-500" />
                                    <span>{event.time}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <MapPin className="h-5 w-5 mr-3 text-emerald-500" />
                                    <span>{event.location || 'BOA - Espacio Principal'}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Users className="h-5 w-5 mr-3 text-emerald-500" />
                                    <span>{event.enrolled}/{event.capacity} participantes</span>
                                </div>
                            </div>

                            {/* Price & Enrollment */}
                            {!isPast && (
                                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="text-3xl font-bold text-emerald-600 mb-1">
                                                    ${event.price}
                                                </div>
                                                <div className="text-sm text-neutral-600">Por persona</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-semibold ${isFullyBooked ? "text-red-500" : "text-emerald-600"}`}>
                                                    {isFullyBooked ? "¡Completo!" : `${spotsRemaining} cupos disponibles`}
                                                </div>
                                                <div className="text-sm text-neutral-500">
                                                    {isFullyBooked ? "Lista de espera disponible" : "¡Reserva tu lugar!"}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleEnroll}
                                            disabled={isEnrolling}
                                            className={`w-full py-3 rounded-2xl transition-all duration-300 ${isFullyBooked
                                                    ? "bg-neutral-400 hover:bg-neutral-400"
                                                    : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
                                                }`}
                                            size="lg"
                                        >
                                            {isEnrolling ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                    Procesando...
                                                </div>
                                            ) : (
                                                isFullyBooked ? "Unirse a lista de espera" : "Inscribirme al evento"
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Facilitator/Speaker */}
            {event.facilitator && (
                <section className="py-16 bg-neutral-50">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-12 text-center">
                            Facilitador
                        </h2>

                        <Card className="max-w-2xl mx-auto bg-white shadow-lg border-0">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={event.facilitator.image} alt={event.facilitator.name} />
                                        <AvatarFallback>
                                            <User className="h-12 w-12" />
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                                            {event.facilitator.name}
                                        </h3>
                                        <p className="text-emerald-600 font-medium mb-4">
                                            {event.facilitator.specialty}
                                        </p>
                                        <p className="text-neutral-600 leading-relaxed mb-6">
                                            {event.facilitator.bio}
                                        </p>

                                        {event.facilitator.experience && (
                                            <div className="flex items-center justify-center md:justify-start mb-4">
                                                <Star className="h-4 w-4 text-amber-500 mr-2" />
                                                <span className="text-sm text-neutral-600">
                                                    {event.facilitator.experience} años de experiencia
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                                            {event.facilitator.phone && (
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    {event.facilitator.phone}
                                                </div>
                                            )}
                                            {event.facilitator.email && (
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    {event.facilitator.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Related Events */}
            <section className="py-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-12 text-center">
                        Otros Eventos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {events
                            .filter(e => e.id !== event.id && e.category === event.category)
                            .slice(0, 3)
                            .map((relatedEvent) => {
                                const relatedEventDate = new Date(relatedEvent.date);
                                const isRelatedPast = relatedEventDate < new Date();

                                return (
                                    <Card key={relatedEvent.id} className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={relatedEvent.image}
                                                alt={relatedEvent.title}
                                                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {isRelatedPast && (
                                                <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center">
                                                    <Badge className="bg-neutral-800 text-white text-xs">Finalizado</Badge>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                                {relatedEvent.title}
                                            </h3>
                                            <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                                                {relatedEvent.description}
                                            </p>
                                            <p className="text-xs text-neutral-500 mb-4">
                                                {relatedEventDate.toLocaleDateString('es-ES')} - {relatedEvent.time}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-emerald-600">
                                                    ${relatedEvent.price}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.push(`/events/${relatedEvent.id}`)}
                                                    disabled={isRelatedPast}
                                                    className={isRelatedPast ? "bg-neutral-400 hover:bg-neutral-400" : ""}
                                                >
                                                    {isRelatedPast ? "Finalizado" : "Ver detalles"}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
