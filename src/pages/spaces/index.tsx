
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
    MapPin,
    Users,
    Clock,
    Calendar,
    Wifi,
    Coffee,
    Music,
    Sparkles,
    Camera,
    Star,
    Quote
} from "lucide-react";

export default function SpacesPage() {
    const [activeSpace, setActiveSpace] = useState(0);

    const spaces = [
        {
            id: "cafe-principal",
            name: "Café Principal",
            description: "Nuestro espacio central, perfecto para conversaciones, trabajo remoto y encuentros casuales.",
            capacity: 45,
            features: ["WiFi de alta velocidad", "Enchufes en cada mesa", "Música ambiente", "Luz natural"],
            atmosphere: "Cálido y acogedor",
            bestFor: ["Trabajo remoto", "Reuniones informales", "Primera cita", "Lectura"],
            images: [
                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
                "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800"
            ]
        },
        {
            id: "salon-eventos",
            name: "Salón de Eventos",
            description: "Espacio versátil diseñado para talleres, charlas, exhibiciones y celebraciones privadas.",
            capacity: 80,
            features: ["Sistema de sonido", "Proyector HD", "Iluminación ajustable", "Cocina equipada"],
            atmosphere: "Versátil y dinámico",
            bestFor: ["Talleres", "Celebraciones", "Conferencias", "Arte"],
            images: [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
                "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800",
                "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800"
            ]
        },
        {
            id: "terraza-zen",
            name: "Terraza Zen",
            description: "Un oasis urbano al aire libre, rodeado de plantas y diseñado para la contemplación y relajación.",
            capacity: 25,
            features: ["Jardín vertical", "Agua corriente", "Sombra natural", "Mobiliario cómodo"],
            atmosphere: "Zen y natural",
            bestFor: ["Meditación", "Yoga matutino", "Lecturas", "Desconexión digital"],
            images: [
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
                "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800"
            ]
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: "María González",
            role: "Freelancer",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b4b12eb1?w=100",
            text: "BOA se ha convertido en mi oficina favorita. El ambiente es perfecto para concentrarse y el café es excepcional.",
            rating: 5
        },
        {
            id: 2,
            name: "Carlos Mendez",
            role: "Organizador de eventos",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
            text: "Realizamos nuestro último workshop en BOA y fue increíble. El equipo es muy profesional y el espacio inspirador.",
            rating: 5
        },
        {
            id: 3,
            name: "Ana Rodríguez",
            role: "Instructora de yoga",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
            text: "La terraza zen es mágica para las sesiones de yoga. Mis estudiantes siempre salen renovados.",
            rating: 5
        }
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-neutral-50 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-16 left-12 w-28 h-28 bg-emerald-100/50 organic-shape floating-animation" />
                    <div className="absolute bottom-20 right-14 w-20 h-20 bg-neutral-100/70 organic-shape floating-animation" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-emerald-200/30 rounded-full floating-animation" style={{ animationDelay: '4s' }} />
                </div>

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <MapPin className="h-8 w-8 text-emerald-600" />
                            <Sparkles className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h1 className="boa-heading text-5xl sm:text-6xl font-semibold text-neutral-900 mb-6">
                            Espacios
                        </h1>
                        <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
                            Tres ambientes únicos diseñados para inspirar, crear y conectar.
                            Cada espacio cuenta con su propia personalidad y energía especial.
                        </p>
                    </div>
                </div>
            </section>

            {/* Interactive Spaces Gallery */}
            <section className="py-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Space Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-neutral-100 p-1 rounded-2xl">
                            {spaces.map((space, index) => (
                                <button
                                    key={space.id}
                                    onClick={() => setActiveSpace(index)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeSpace === index
                                            ? "bg-white text-emerald-600 shadow-md"
                                            : "text-neutral-600 hover:text-emerald-600"
                                        }`}
                                >
                                    {space.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Space Display */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Images */}
                        <div className="space-y-4">
                            <div className="relative">
                                <img
                                    src={spaces[activeSpace].images[0]}
                                    alt={spaces[activeSpace].name}
                                    className="w-full h-80 object-cover rounded-3xl shadow-xl"
                                />
                                <Badge className="absolute top-6 left-6 bg-emerald-600 text-white">
                                    <Camera className="h-3 w-3 mr-1" />
                                    Espacio principal
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {spaces[activeSpace].images.slice(1).map((image, idx) => (
                                    <img
                                        key={idx}
                                        src={image}
                                        alt={`${spaces[activeSpace].name} - vista ${idx + 2}`}
                                        className="w-full h-32 object-cover rounded-2xl shadow-md"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Space Details */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="boa-heading text-4xl font-semibold text-neutral-900 mb-4">
                                    {spaces[activeSpace].name}
                                </h2>
                                <p className="text-xl text-neutral-600 leading-relaxed mb-6">
                                    {spaces[activeSpace].description}
                                </p>
                            </div>

                            {/* Space Stats */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center text-neutral-600">
                                    <Users className="h-5 w-5 mr-3 text-emerald-500" />
                                    <div>
                                        <div className="font-semibold">Capacidad</div>
                                        <div className="text-sm">{spaces[activeSpace].capacity} personas</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Sparkles className="h-5 w-5 mr-3 text-emerald-500" />
                                    <div>
                                        <div className="font-semibold">Ambiente</div>
                                        <div className="text-sm">{spaces[activeSpace].atmosphere}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-3">Características</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {spaces[activeSpace].features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-neutral-600">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Best For */}
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-3">Ideal para</h3>
                                <div className="flex flex-wrap gap-2">
                                    {spaces[activeSpace].bestFor.map((use, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-emerald-100 text-emerald-700">
                                            {use}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/contact">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Reservar espacio
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="bg-transparent hover:bg-neutral-50 px-8 py-3 rounded-2xl border-neutral-300 hover:border-emerald-300 hover:text-emerald-600">
                                    <Coffee className="mr-2 h-5 w-5" />
                                    Agendar visita
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-emerald-50/30">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="boa-heading text-4xl font-semibold text-neutral-900 mb-4">
                            Lo que dicen nuestros visitantes
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                            Cada espacio ha sido el escenario de momentos únicos y experiencias transformadoras
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-4">
                                        <Quote className="h-6 w-6 text-emerald-500 mr-2" />
                                        <div className="flex">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-neutral-600 mb-6 leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center">
                                        <Avatar className="w-12 h-12 mr-4">
                                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                                            <div className="text-sm text-neutral-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Private Events CTA */}
            <section className="py-20 bg-neutral-900 text-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="boa-heading text-4xl sm:text-5xl font-semibold mb-6">
                            Eventos Privados
                        </h2>
                        <p className="text-xl text-neutral-300 leading-relaxed mb-8">
                            ¿Tienes una celebración especial en mente? Nuestros espacios se transforman
                            para crear experiencias únicas y memorables para ti y tus invitados.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">50+</div>
                                <div className="text-sm text-neutral-400">Eventos realizados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">3</div>
                                <div className="text-sm text-neutral-400">Espacios configurables</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">24h</div>
                                <div className="text-sm text-neutral-400">Disponibilidad</div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl">
                                    Consultar disponibilidad
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 rounded-2xl">
                                Ver galería de eventos
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
