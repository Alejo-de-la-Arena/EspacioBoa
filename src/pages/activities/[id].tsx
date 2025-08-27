
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Heart,
    Calendar,
    Clock,
    Users,
    MapPin,
    Star,
    ArrowLeft,
    Sparkles,
    User,
    Phone,
    Mail
} from "lucide-react";

export default function ActivityDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { activities, loading } = useApp();
    const [isEnrolling, setIsEnrolling] = useState(false);

    const activity = activities.find(a => a.id === id);

    const handleEnroll = async () => {
        setIsEnrolling(true);
        // Simulate enrollment process
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsEnrolling(false);
        // Here you would typically update the activity enrollment count
        alert("¡Inscripción exitosa! Recibirás un email de confirmación.");
    };

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

    if (!activity) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Actividad no encontrada</h1>
                        <Button onClick={() => router.push("/activities")}>
                            Volver a actividades
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    const isFullyBooked = activity.enrolled >= activity.capacity;
    const spotsRemaining = activity.capacity - activity.enrolled;

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
                                src={activity.image}
                                alt={activity.title}
                                className="w-full h-96 object-cover rounded-3xl shadow-xl shadow-neutral-900/10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent rounded-3xl" />
                            {activity.featured && (
                                <Badge className="absolute top-6 left-6 bg-emerald-600 text-white">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Actividad destacada
                                </Badge>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            <div>
                                <Badge className="mb-4">{activity.category}</Badge>
                                <h1 className="boa-heading text-4xl sm:text-5xl font-semibold text-neutral-900 mb-4">
                                    {activity.title}
                                </h1>
                                <p className="text-xl text-neutral-600 leading-relaxed">
                                    {activity.description}
                                </p>
                            </div>

                            {/* Schedule & Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center text-neutral-600">
                                    <Calendar className="h-5 w-5 mr-3 text-emerald-500" />
                                    <span>{activity.schedule.day}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Clock className="h-5 w-5 mr-3 text-emerald-500" />
                                    <span>{activity.schedule.time}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <MapPin className="h-5 w-5 mr-3 text-emerald-500" />
                                    <span>{activity.location}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Users className="h-5 w-5 mr-3 text-emerald-500" />
                                    <span>{activity.enrolled}/{activity.capacity} participantes</span>
                                </div>
                            </div>

                            {/* Price & Enrollment */}
                            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="text-3xl font-bold text-emerald-600 mb-1">
                                                ${activity.price}
                                            </div>
                                            <div className="text-sm text-neutral-600">Por clase</div>
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
                                            isFullyBooked ? "Unirse a lista de espera" : "Inscribirme ahora"
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instructor */}
            {activity.instructor && (
                <section className="py-16 bg-neutral-50">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-12 text-center">
                            Tu Instructor
                        </h2>

                        <Card className="max-w-2xl mx-auto bg-white shadow-lg border-0">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={activity.instructor.image} alt={activity.instructor.name} />
                                        <AvatarFallback>
                                            <User className="h-12 w-12" />
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                                            {activity.instructor.name}
                                        </h3>
                                        <p className="text-emerald-600 font-medium mb-4">
                                            {activity.instructor.specialty}
                                        </p>
                                        <p className="text-neutral-600 leading-relaxed mb-6">
                                            {activity.instructor.bio}
                                        </p>

                                        {activity.instructor.experience && (
                                            <div className="flex items-center justify-center md:justify-start mb-4">
                                                <Star className="h-4 w-4 text-amber-500 mr-2" />
                                                <span className="text-sm text-neutral-600">
                                                    {activity.instructor.experience} años de experiencia
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                                            {activity.instructor.phone && (
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    {activity.instructor.phone}
                                                </div>
                                            )}
                                            {activity.instructor.email && (
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    {activity.instructor.email}
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

            {/* Related Activities */}
            <section className="py-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-12 text-center">
                        Actividades Relacionadas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {activities
                            .filter(a => a.id !== activity.id && a.category === activity.category)
                            .slice(0, 3)
                            .map((relatedActivity) => (
                                <Card key={relatedActivity.id} className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={relatedActivity.image}
                                            alt={relatedActivity.title}
                                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                            {relatedActivity.title}
                                        </h3>
                                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                                            {relatedActivity.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-emerald-600">
                                                ${relatedActivity.price}
                                            </span>
                                            <Button
                                                size="sm"
                                                onClick={() => router.push(`/activities/${relatedActivity.id}`)}
                                            >
                                                Ver detalles
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
