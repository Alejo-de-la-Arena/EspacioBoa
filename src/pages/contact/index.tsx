"use client";


import { useMemo, useState } from "react";
import { motion } from "framer-motion";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


// Marca (fallbacks)
import { MdLocalPhone } from "react-icons/md";
import { SiGmail } from "react-icons/si";
import { FaWhatsapp, FaInstagram } from "react-icons/fa6";


import { MapPin, ArrowUpRight, Mail } from "lucide-react";


// ======= Defaults (podés cambiarlos sin tocar más código) =======
const DEFAULT_BG_URL =
    // referencia: papel/grano muy sutil
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop";
const DEFAULT_BG_OPACITY = 0.06; // 6% (muy tenue)


const DEFAULT_ICON_URLS = {
    phone: "", // vacío => usa fallback vector (MdLocalPhone)
    gmail: "https://cdn.simpleicons.org/gmail", // color oficial (SVG)
    whatsapp: "https://cdn.simpleicons.org/whatsapp",
    instagram: "https://cdn.simpleicons.org/instagram",
};


export default function ContactPage() {
    // ======= Controles visuales (inputs) =======
    const [bgUrl, setBgUrl] = useState<string>(DEFAULT_BG_URL);
    const [bgOpacity, setBgOpacity] = useState<number>(DEFAULT_BG_OPACITY);


    const [iconUrls, setIconUrls] = useState<Record<"phone" | "gmail" | "whatsapp" | "instagram", string>>({
        ...DEFAULT_ICON_URLS,
    });


    const [showStylePanel, setShowStylePanel] = useState<boolean>(true); // dejalo true para editar fácil


    // ======= Form =======
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1000));
        alert("¡Gracias! Te respondemos dentro de las próximas 24 horas.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSubmitting(false);
    };


    const handleInputChange = (field: string, value: string) =>
        setFormData((p) => ({ ...p, [field]: value }));


    // ======= Cards =======
    const contactMethods = useMemo(
        () => [
            {
                key: "tel",
                iconFallback: MdLocalPhone,
                img: iconUrls.phone,
                title: "Teléfono",
                details: "+54 9 11 3245 5628",
                description: "Lunes a Domingo, 8:00 – 22:00",
                action: "Llamar ahora",
                href: "tel:+5491132455628",
                skew: "-rotate-1 -translate-y-1",
                span: "lg:col-span-3 md:col-span-2",
            },
            {
                key: "mail",
                iconFallback: SiGmail,
                img: iconUrls.gmail,
                title: "Email",
                details: "espacio.boa@gmail.com",
                description: "Respuesta en 24 horas",
                action: "Enviar email",
                href: "mailto:espacio.boa@gmail.com",
                skew: "rotate-[0.8deg] md:-translate-y-3",
                span: "lg:col-span-3 md:col-span-2",
            },
            {
                key: "wa",
                iconFallback: FaWhatsapp,
                img: iconUrls.whatsapp,
                title: "WhatsApp",
                details: "+54 9 11 8765 4321",
                description: "Chat directo y rápido",
                action: "Abrir chat",
                href: "https://wa.me/5491187654321",
                skew: "-rotate-[0.6deg] md:-translate-y-1",
                span: "lg:col-span-3 md:col-span-2",
            },
            {
                key: "ig",
                iconFallback: FaInstagram,
                img: iconUrls.instagram,
                title: "Instagram",
                details: "@espacio.boa",
                description: "Novedades y comunidad",
                action: "Ver perfil",
                href: "https://instagram.com/espacio.boa",
                skew: "rotate-1 md:-translate-y-4",
                span: "lg:col-span-3 md:col-span-2",
            },
        ],
        [iconUrls]
    );


    return (
        <section>
            {/* Wrapper global con font-sans + background imagen MUY tenue */}
            <div className="relative font-sans">
                {/* Capa de imagen (editable) */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                        backgroundImage: `url(${bgUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: bgOpacity,
                    }}
                />
                {/* Capa de textura/gradiente que ya tenías */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(800px 400px at 10% 10%, rgba(16,185,129,.12), transparent 60%), radial-gradient(600px 300px at 90% 20%, rgba(2,6,23,.06), transparent 60%)",
                    }}
                />




                {/* ======== CARDS DE CONTACTO ======== */}
                <section className="relative py-12 sm:py-14">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
                            {contactMethods.map((m, i) => {
                                const IconFallback = m.iconFallback as any;
                                return (
                                    <motion.a
                                        key={m.key}
                                        href={m.href}
                                        target={m.key === "ig" ? "_blank" : undefined}
                                        rel={m.key === "ig" ? "noopener noreferrer" : undefined}
                                        initial={{ y: 14, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.35, delay: i * 0.05 }}
                                        className={`no-underline ${m.span} group`}
                                    >
                                        <Card
                                            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${m.skew}`}
                                        >
                                            <CardContent className="p-6 text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/75 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition overflow-hidden">
                                                    {m.img ? (
                                                        <img
                                                            src={m.img}
                                                            alt={`${m.title} icon`}
                                                            className="h-8 w-8 object-contain"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <IconFallback className="h-8 w-8" />
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-neutral-900 mb-1">
                                                    {m.title}
                                                </h3>
                                                <p className="text-lg font-medium text-emerald-700">
                                                    {m.details}
                                                </p>
                                                <p className="text-sm text-neutral-600 mt-1">
                                                    {m.description}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-4 rounded-xl bg-white/70 backdrop-blur border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                >
                                                    {m.action} <ArrowUpRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </section>


                {/* ======== FORM + MAPA ======== */}
                <section className="py-12 bg-neutral-50">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* FORM */}
                        <Card className="border-0 shadow-xl bg-white">
                            <CardHeader className="pb-0">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900">
                                        Escribinos
                                    </h2>
                                </div>
                                <p className="mt-3 text-neutral-600">
                                    Contanos en qué te ayudamos.{" "}
                                    <span className="text-emerald-700">Respondemos en &lt; 24h.</span>
                                </p>
                            </CardHeader>


                            <CardContent className="space-y-6 pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Nombre completo *
                                            </label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                placeholder="Tu nombre"
                                                required
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Email *
                                            </label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                placeholder="tu@email.com"
                                                required
                                                className="rounded-xl"
                                            />
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Teléfono
                                            </label>
                                            <Input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                placeholder="+54 9 11 1234 5678"
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Asunto *
                                            </label>
                                            <Select
                                                value={formData.subject}
                                                onValueChange={(value) =>
                                                    handleInputChange("subject", value)
                                                }
                                            >
                                                <SelectTrigger className="rounded-xl">
                                                    <SelectValue placeholder="Seleccioná un tema" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Actividades y talleres">
                                                        Actividades y talleres
                                                    </SelectItem>
                                                    <SelectItem value="Eventos privados">
                                                        Eventos privados
                                                    </SelectItem>
                                                    <SelectItem value="Reserva de espacios">
                                                        Reserva de espacios
                                                    </SelectItem>
                                                    <SelectItem value="Menú y alimentación">
                                                        Menú y alimentación
                                                    </SelectItem>
                                                    <SelectItem value="Colaboraciones">
                                                        Colaboraciones
                                                    </SelectItem>
                                                    <SelectItem value="Sugerencias">Sugerencias</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                        <div className="sm:col-span-12">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Mensaje *
                                            </label>
                                            <Textarea
                                                value={formData.message}
                                                onChange={(e) => handleInputChange("message", e.target.value)}
                                                placeholder="¿Qué te gustaría hacer en BOA? Compartinos fecha, cantidad de personas y necesidades especiales."
                                                rows={5}
                                                required
                                                className="rounded-xl"
                                            />
                                            <p className="mt-2 text-xs text-neutral-500">
                                                Si es urgente, escribinos por WhatsApp y te respondemos más rápido.
                                            </p>
                                        </div>
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
                                            <>Enviar mensaje</>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>


                        {/* Mapa */}
                        <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                            Ubicación
                                        </h3>
                                        <p className="text-neutral-600 mb-4">
                                            Juncal 399
                                            <br />
                                            Martínez, Provincia de Buenos Aires, Argentina
                                        </p>
                                    </div>
                                </div>


                                <div className="w-full rounded-xl overflow-hidden border border-neutral-200">
                                    <iframe
                                        title="Mapa BOA - Juncal 399, Martínez"
                                        src="https://www.google.com/maps?q=Juncal+399,+Mart%C3%ADnez,+Provincia+de+Buenos+Aires&z=16&output=embed"
                                        width="100%"
                                        height="300"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        style={{ border: 0 }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </section>
    );
}



