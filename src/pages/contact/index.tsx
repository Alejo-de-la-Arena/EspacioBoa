
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Sparkles,
    Send,
    MessageCircle,
    Calendar,
    Coffee,
    Heart,
    Instagram,
    Facebook,
    Users
} from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "email"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert("¡Mensaje enviado exitosamente! Te responderemos en las próximas 24 horas.");
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
            preferredContact: "email"
        });
        setIsSubmitting(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const contactMethods = [
        {
            icon: <Phone className="h-6 w-6" />,
            title: "Teléfono",
            details: "+56 2 1234 5678",
            description: "Lunes a Domingo, 8:00 - 22:00",
            action: "Llamar ahora"
        },
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email",
            details: "hola@espacioboa.cl",
            description: "Respuesta en 24 horas",
            action: "Enviar email"
        },
        {
            icon: <MessageCircle className="h-6 w-6" />,
            title: "WhatsApp",
            details: "+56 9 8765 4321",
            description: "Chat directo y rápido",
            action: "Abrir chat"
        },
        {
            icon: <Instagram className="h-6 w-6" />,
            title: "Instagram",
            details: "@espacioboa",
            description: "Síguenos para novedades",
            action: "Ver perfil"
        }
    ];

    const faqItems = [
        {
            question: "¿Necesito reservar para las actividades?",
            answer: "Sí, recomendamos reservar con anticipación ya que nuestras actividades tienen cupos limitados. Puedes inscribirte directamente en nuestra web o contactarnos."
        },
        {
            question: "¿Tienen opciones veganas y sin gluten?",
            answer: "¡Por supuesto! Tenemos una amplia variedad de opciones veganas, vegetarianas y sin gluten. Nuestro equipo puede ayudarte a elegir según tus necesidades alimentarias."
        },
        {
            question: "¿Puedo trabajar con mi laptop en BOA?",
            answer: "Sí, nuestro café principal está diseñado para trabajo remoto, con WiFi gratuito, enchufes en cada mesa y un ambiente perfecto para concentrarse."
        },
        {
            question: "¿Realizan eventos privados?",
            answer: "Sí, nuestros espacios están disponibles para eventos privados, talleres corporativos y celebraciones especiales. Contáctanos para conocer disponibilidad y tarifas."
        }
    ];

    return (
        <section>
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
                            <MessageCircle className="h-8 w-8 text-emerald-600" />
                            <Sparkles className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h1 className="boa-heading text-5xl sm:text-6xl font-semibold text-neutral-900 mb-6">
                            Contacto
                        </h1>
                        <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
                            Nos encanta escucharte. Ya sea para una consulta, sugerencia o simplemente
                            para saludar, estamos aquí para conectar contigo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactMethods.map((method, index) => (
                            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white text-center">
                                <CardContent className="p-6">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                                        {method.icon}
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 mb-2">
                                        {method.title}
                                    </h3>
                                    <p className="text-lg font-medium text-emerald-600 mb-1">
                                        {method.details}
                                    </p>
                                    <p className="text-sm text-neutral-500 mb-4">
                                        {method.description}
                                    </p>
                                    <Button size="sm" variant="outline" className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300">
                                        {method.action}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 bg-neutral-50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card className="border-0 shadow-xl bg-white">
                            <CardHeader className="pb-6">
                                <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-4">
                                    Envíanos un Mensaje
                                </h2>
                                <p className="text-neutral-600">
                                    Completa el formulario y nos pondremos en contacto contigo pronto
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Nombre completo *
                                            </label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Tu nombre"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Email *
                                            </label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Teléfono
                                            </label>
                                            <Input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+56 9 1234 5678"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Asunto *
                                            </label>
                                            <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un tema" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">Consulta General</SelectItem>
                                                    <SelectItem value="activities">Actividades y Talleres</SelectItem>
                                                    <SelectItem value="events">Eventos Privados</SelectItem>
                                                    <SelectItem value="menu">Menú y Alimentación</SelectItem>
                                                    <SelectItem value="spaces">Reserva de Espacios</SelectItem>
                                                    <SelectItem value="collaboration">Colaboraciones</SelectItem>
                                                    <SelectItem value="feedback">Sugerencias</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Mensaje *
                                        </label>
                                        <Textarea
                                            value={formData.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            placeholder="Cuéntanos en qué podemos ayudarte..."
                                            rows={5}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Forma preferida de contacto
                                        </label>
                                        <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="phone">Teléfono</SelectItem>
                                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                Enviando...
                                            </div>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Enviar Mensaje
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Location & Hours */}
                        <div className="space-y-8">
                            {/* Location */}
                            <Card className="border-0 shadow-lg bg-white">
                                <CardContent className="p-8">
                                    <div className="flex items-start space-x-4 mb-6">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="boa-heading text-xl font-semibold text-neutral-900 mb-2">
                                                Ubicación
                                            </h3>
                                            <p className="text-neutral-600 mb-4">
                                                Av. Luis Sáenz Peña 399<br />
                                                Providencia, Santiago<br />
                                                Región Metropolitana, Chile
                                            </p>
                                            <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:text-emerald-600">
                                                Ver en Google Maps
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Map placeholder */}
                                    <div className="w-full h-48 bg-neutral-200 rounded-xl flex items-center justify-center">
                                        <div className="text-center text-neutral-500">
                                            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Mapa interactivo</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Hours */}
                            <Card className="border-0 shadow-lg bg-white">
                                <CardContent className="p-8">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="boa-heading text-xl font-semibold text-neutral-900 mb-4">
                                                Horarios de Atención
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-600">Lunes - Viernes</span>
                                                    <span className="font-medium text-neutral-900">8:00 - 22:00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-600">Sábados</span>
                                                    <span className="font-medium text-neutral-900">9:00 - 23:00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-600">Domingos</span>
                                                    <span className="font-medium text-neutral-900">9:00 - 21:00</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                                                <p className="text-emerald-700 text-sm">
                                                    💡 <strong>Tip:</strong> Las mañanas son ideales para trabajo tranquilo,
                                                    las tardes para actividades y encuentros sociales.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    size="lg"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl"
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Reservar Mesa
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="py-4 rounded-2xl border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                >
                                    <Coffee className="mr-2 h-5 w-5" />
                                    Ver Menú
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="boa-heading text-3xl font-semibold text-neutral-900 mb-4">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-lg text-neutral-600">
                            Respuestas a las consultas más comunes de nuestra comunidad
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {faqItems.map((item, index) => (
                            <Card key={index} className="border-0 shadow-lg bg-white">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-neutral-900 mb-3">
                                        {item.question}
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {item.answer}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-neutral-600 mb-4">
                            ¿No encontraste la respuesta que buscabas?
                        </p>
                        <Button variant="outline" className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300">
                            Contáctanos Directamente
                        </Button>
                    </div>
                </div>
            </section>

            {/* Social Media */}
            <section className="py-16 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="boa-heading text-3xl font-semibold mb-4">
                            Síguenos en Redes Sociales
                        </h2>
                        <p className="text-xl text-neutral-300">
                            Mantente conectado con nuestra comunidad y descubre contenido exclusivo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Instagram className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">Instagram</h3>
                            <p className="text-neutral-400 text-sm mb-4">@espacioboa</p>
                            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-neutral-900">
                                Seguir
                            </Button>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Facebook className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">Facebook</h3>
                            <p className="text-neutral-400 text-sm mb-4">Espacio BOA</p>
                            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-neutral-900">
                                Seguir
                            </Button>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">Comunidad</h3>
                            <p className="text-neutral-400 text-sm mb-4">Newsletter BOA</p>
                            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-neutral-900">
                                Suscribirse
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
