
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Gift,
    Heart,
    Star,
    Sparkles,
    Check,
    CreditCard,
    Mail,
    Calendar,
    Users
} from "lucide-react";

export default function GiftCardsPage() {
    const { giftCards, loading } = useApp();
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [personalMessage, setPersonalMessage] = useState("");
    const [senderName, setSenderName] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");

    const handlePurchase = async () => {
        // Simulate purchase process
        alert("¡Gift Card creada exitosamente! Recibirás un email de confirmación con los detalles.");
        setSelectedCard(null);
        // Reset form
        setCustomAmount("");
        setRecipientName("");
        setRecipientEmail("");
        setPersonalMessage("");
        setSenderName("");
        setDeliveryDate("");
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600">
                        <Gift className="h-12 w-12" />
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
                    <div className="absolute top-16 left-10 w-28 h-28 bg-emerald-100/50 organic-shape floating-animation" />
                    <div className="absolute bottom-20 right-12 w-24 h-24 bg-neutral-100/70 organic-shape floating-animation" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-emerald-200/30 rounded-full floating-animation" style={{ animationDelay: '4s' }} />
                </div>

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <Gift className="h-8 w-8 text-emerald-600" />
                            <Sparkles className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h1 className="boa-heading text-5xl sm:text-6xl font-semibold text-neutral-900 mb-6">
                            Gift Cards
                        </h1>
                        <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
                            Regala momentos únicos de bienestar, conexión y creatividad.
                            Nuestras gift cards abren las puertas a experiencias transformadoras en BOA.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gift Cards Grid */}
            <section className="py-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {giftCards.map((giftCard) => (
                            <Card key={giftCard.id} className="group cursor-pointer border-0 shadow-lg shadow-emerald-200/60 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-1 bg-white">
                                <div className="relative overflow-hidden rounded-t-lg">
                                    <div className="h-48 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <Gift className="h-16 w-16 mx-auto mb-4 opacity-90" />
                                            <div className="text-3xl font-bold mb-2">${giftCard.value.toLocaleString()}</div>
                                            <div className="text-sm opacity-90">Gift Card BOA</div>
                                        </div>
                                    </div>
                                    {giftCard.popular && (
                                        <Badge className="absolute top-4 left-4 bg-amber-500 text-white">
                                            <Star className="h-3 w-3 mr-1" />
                                            Popular
                                        </Badge>
                                    )}
                                </div>

                                <CardHeader>
                                    <h3 className="boa-heading text-xl font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors">
                                        {giftCard.name}
                                    </h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">
                                        {giftCard.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-neutral-900 text-sm">Incluye:</h4>
                                        {giftCard.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center text-sm text-neutral-600">
                                                <Check className="h-3 w-3 mr-2 text-emerald-500" />
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl"
                                                    onClick={() => setSelectedCard(giftCard)}
                                                >
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    Comprar Gift Card
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="boa-heading text-2xl">
                                                        Personalizar Gift Card
                                                    </DialogTitle>
                                                </DialogHeader>

                                                {selectedCard && (
                                                    <div className="space-y-6">
                                                        {/* Gift Card Preview */}
                                                        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-8 text-white text-center">
                                                            <Gift className="h-12 w-12 mx-auto mb-4 opacity-90" />
                                                            <div className="text-2xl font-bold mb-2">
                                                                ${selectedCard.value.toLocaleString()}
                                                            </div>
                                                            <div className="text-sm opacity-90">{selectedCard.name}</div>
                                                        </div>

                                                        {/* Form */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                                    Tu nombre
                                                                </label>
                                                                <Input
                                                                    value={senderName}
                                                                    onChange={(e) => setSenderName(e.target.value)}
                                                                    placeholder="Nombre del remitente"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                                    Nombre del destinatario
                                                                </label>
                                                                <Input
                                                                    value={recipientName}
                                                                    onChange={(e) => setRecipientName(e.target.value)}
                                                                    placeholder="Para quién es el regalo"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                                    Email del destinatario
                                                                </label>
                                                                <Input
                                                                    type="email"
                                                                    value={recipientEmail}
                                                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                                                    placeholder="correo@ejemplo.com"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                                    Fecha de entrega
                                                                </label>
                                                                <Input
                                                                    type="date"
                                                                    value={deliveryDate}
                                                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                                Mensaje personal
                                                            </label>
                                                            <Textarea
                                                                value={personalMessage}
                                                                onChange={(e) => setPersonalMessage(e.target.value)}
                                                                placeholder="Escribe un mensaje especial..."
                                                                rows={3}
                                                            />
                                                        </div>

                                                        <Button
                                                            onClick={handlePurchase}
                                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl"
                                                            size="lg"
                                                        >
                                                            <CreditCard className="mr-2 h-5 w-5" />
                                                            Comprar por ${selectedCard.value.toLocaleString()}
                                                        </Button>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Custom Amount Card */}
                        <Card className="group cursor-pointer border-2 border-dashed border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1 bg-emerald-50/50">
                            <CardContent className="p-8 text-center space-y-6">
                                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                    <Heart className="h-8 w-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="boa-heading text-xl font-semibold text-neutral-900 mb-2">
                                        Monto Personalizado
                                    </h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                                        Crea una gift card con el monto exacto que desees regalar
                                    </p>
                                    <Input
                                        type="number"
                                        placeholder="Ingresa el monto"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className="mb-4"
                                    />
                                </div>
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl"
                                    disabled={!customAmount || parseFloat(customAmount) < 1000}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Crear Gift Card
                                </Button>
                                <p className="text-xs text-neutral-500">
                                    Monto mínimo: $1,000 CLP
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 bg-neutral-50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="boa-heading text-4xl font-semibold text-neutral-900 mb-4">
                            ¿Cómo Funciona?
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                            Regalar experiencias nunca fue tan fácil
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                <CreditCard className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="boa-heading text-xl font-semibold text-neutral-900 mb-3">
                                1. Elige y Personaliza
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Selecciona la gift card perfecta y personalízala con un mensaje especial
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                <Mail className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="boa-heading text-xl font-semibold text-neutral-900 mb-3">
                                2. Envío Digital
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                La gift card se envía por email al destinatario en la fecha que elijas
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                <Sparkles className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="boa-heading text-xl font-semibold text-neutral-900 mb-3">
                                3. Disfruta en BOA
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                El destinatario puede canjearla en cualquier experiencia o producto de BOA
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Gifts */}
            <section className="py-20 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="boa-heading text-4xl sm:text-5xl font-semibold mb-6">
                            Regalos Corporativos
                        </h2>
                        <p className="text-xl text-neutral-300 leading-relaxed mb-8">
                            ¿Buscas el regalo perfecto para tu equipo, clientes o socios de negocio?
                            Nuestras gift cards corporativas ofrecen experiencias de bienestar que fortalecen vínculos.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">25+</div>
                                <div className="text-sm text-neutral-400">Gift Cards = 10% descuento</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">50+</div>
                                <div className="text-sm text-neutral-400">Gift Cards = 15% descuento</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-400 mb-2">100+</div>
                                <div className="text-sm text-neutral-400">Gift Cards = 20% descuento</div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl">
                                <Users className="mr-2 h-5 w-5" />
                                Consultar Regalos Corporativos
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 rounded-2xl">
                                Descargar Catálogo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
