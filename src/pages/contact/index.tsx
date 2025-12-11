"use client";

import { useState } from "react";
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

import {
    MapPin,
    ArrowUpRight,
    Mail,
    Instagram,
} from "lucide-react";

// ======= Defaults =======
const DEFAULT_BG_URL =
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop";
const DEFAULT_BG_OPACITY = 0.06;

const DEFAULT_ICON_URLS = {
    gmail: "https://cdn.simpleicons.org/gmail",
    instagram: "https://cdn.simpleicons.org/instagram",
} as const;

type FormData = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    website?: string; // honeypot (oculto)
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactPage() {
    // ======= Form =======
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website: "", // honeypot
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<
        null | { type: "success" | "error"; msg: string }
    >(null);

    const validate = (data: FormData): FormErrors => {
        const e: FormErrors = {};

        if (!data.name?.trim() || data.name.trim().length < 2)
            e.name = "Decinos tu nombre (mín. 2 caracteres).";

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
        if (!emailOk) e.email = "Ingresá un email válido.";

        if (!data.subject) e.subject = "Elegí un tema.";

        if (!data.message?.trim() || data.message.trim().length < 10)
            e.message = "Contanos un poco más (mín. 10 caracteres).";

        // Teléfono opcional: si viene algo, validamos formato básico
        if (data.phone && data.phone.trim() !== "") {
            const phoneClean = data.phone.trim();
            const phoneOk = /^[0-9+()\s-]{7,}$/.test(phoneClean);
            if (!phoneOk) {
                e.phone =
                    "Ingresá un teléfono válido (solo números, espacios y +).";
            }
        }

        // Honeypot: si viene con algo, es bot
        if (data.website && data.website.trim() !== "")
            e.website = "Bot detectado.";

        return e;
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((p) => ({ ...p, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        const v = validate(formData);
        setErrors(v);
        if (Object.keys(v).length > 0) return;

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    subject: formData.subject,
                    message: formData.message.trim(),
                    source: "contact-page",
                }),
            });

            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message || "No pudimos enviar tu mensaje.");
            }

            setStatus({
                type: "success",
                msg: "¡Gracias! Te respondemos dentro de las próximas 24 horas.",
            });
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
                website: "",
            });
        } catch (err: any) {
            setStatus({
                type: "error",
                msg: err?.message || "Ocurrió un error al enviar. Probá de nuevo.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ======= Cards estáticas (solo Gmail + Instagram) =======
    const contactMethods = [
        {
            key: "mail",
            iconImg: DEFAULT_ICON_URLS.gmail,
            Icon: Mail,
            title: "Email",
            details: "boa.espacio@gmail.com",
            description: "Respuesta en 24 horas",
            action: "Enviar email",
            target: "_blank",
            href: "https://mail.google.com/mail/?view=cm&fs=1&to=boa.espacio@gmail.com",
        },
        {
            key: "ig",
            iconImg: DEFAULT_ICON_URLS.instagram,
            Icon: Instagram,
            title: "Instagram",
            details: "@espacio.boa",
            description: "Novedades y comunidad",
            action: "Ver perfil",
            target: "_blank",
            href: "https://instagram.com/espacio.boa",
        },
    ] as const;

    return (
        <section>
            <div className="relative font-sans">
                {/* BG tenue */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                        backgroundImage: `url(${DEFAULT_BG_URL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: DEFAULT_BG_OPACITY,
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(800px 400px at 10% 10%, rgba(16,185,129,.12), transparent 60%), radial-gradient(600px 300px at 90% 20%, rgba(2,6,23,.06), transparent 60%)",
                    }}
                />

                {/* ======== FORM + MAPA (ARRIBA) ======== */}
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
                                    Contanos en qué te ayudamos.
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-6">
                                {/* Alertas globales */}
                                {status && (
                                    <div
                                        role="alert"
                                        className={`rounded-xl px-4 py-3 text-sm ${status.type === "success"
                                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                : "bg-rose-50 text-rose-800 border border-rose-200"
                                            }`}
                                    >
                                        {status.msg}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    className="space-y-6"
                                >
                                    {/* Honeypot */}
                                    <input
                                        type="text"
                                        name="website"
                                        value={formData.website}
                                        onChange={(e) =>
                                            handleInputChange("website", e.target.value)
                                        }
                                        className="hidden"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Nombre completo *
                                            </label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) =>
                                                    handleInputChange("name", e.target.value)
                                                }
                                                placeholder="Tu nombre"
                                                required
                                                className={`rounded-xl ${errors.name ? "ring-2 ring-rose-300" : ""
                                                    }`}
                                                aria-invalid={!!errors.name}
                                                aria-describedby={
                                                    errors.name ? "err-name" : undefined
                                                }
                                            />
                                            {errors.name && (
                                                <p
                                                    id="err-name"
                                                    className="mt-1 text-xs text-rose-600"
                                                >
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Email *
                                            </label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    handleInputChange("email", e.target.value)
                                                }
                                                placeholder="tu@email.com"
                                                required
                                                className={`rounded-xl ${errors.email ? "ring-2 ring-rose-300" : ""
                                                    }`}
                                                aria-invalid={!!errors.email}
                                                aria-describedby={
                                                    errors.email ? "err-email" : undefined
                                                }
                                            />
                                            {errors.email && (
                                                <p
                                                    id="err-email"
                                                    className="mt-1 text-xs text-rose-600"
                                                >
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Teléfono (opcional)
                                            </label>
                                            <Input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    handleInputChange("phone", e.target.value)
                                                }
                                                placeholder="+54 9 11 1234 5678"
                                                className={`rounded-xl ${errors.phone ? "ring-2 ring-rose-300" : ""
                                                    }`}
                                                aria-invalid={!!errors.phone}
                                                aria-describedby={
                                                    errors.phone ? "err-phone" : undefined
                                                }
                                            />
                                            {errors.phone && (
                                                <p
                                                    id="err-phone"
                                                    className="mt-1 text-xs text-rose-600"
                                                >
                                                    {errors.phone}
                                                </p>
                                            )}
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
                                                <SelectTrigger
                                                    className={`rounded-xl ${errors.subject
                                                            ? "ring-2 ring-rose-300"
                                                            : ""
                                                        }`}
                                                    aria-invalid={!!errors.subject}
                                                    aria-describedby={
                                                        errors.subject
                                                            ? "err-subject"
                                                            : undefined
                                                    }
                                                >
                                                    <SelectValue placeholder="Seleccioná un tema" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Actividades y talleres">
                                                        Actividades
                                                    </SelectItem>
                                                    <SelectItem value="Eventos privados">
                                                        Eventos
                                                    </SelectItem>
                                                    <SelectItem value="Reserva de espacios">
                                                        Reserva de espacios
                                                    </SelectItem>
                                                    <SelectItem value="Menú y alimentación">
                                                        Gastronomía
                                                    </SelectItem>
                                                    <SelectItem value="Colaboraciones">
                                                        Colaboraciones
                                                    </SelectItem>
                                                    <SelectItem value="Sugerencias">
                                                        Sugerencias
                                                    </SelectItem>
                                                    <SelectItem value="Otros">
                                                        Otros
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.subject && (
                                                <p
                                                    id="err-subject"
                                                    className="mt-1 text-xs text-rose-600"
                                                >
                                                    {errors.subject}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                        <div className="sm:col-span-12">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Mensaje *
                                            </label>
                                            <Textarea
                                                value={formData.message}
                                                onChange={(e) =>
                                                    handleInputChange("message", e.target.value)
                                                }
                                                placeholder="¿Qué te gustaría hacer en BOA? Compartinos fecha, cantidad de personas y necesidades especiales."
                                                rows={5}
                                                required
                                                className={`rounded-xl ${errors.message
                                                        ? "ring-2 ring-rose-300"
                                                        : ""
                                                    }`}
                                                aria-invalid={!!errors.message}
                                                aria-describedby={
                                                    errors.message
                                                        ? "err-message"
                                                        : undefined
                                                }
                                            />
                                            {errors.message && (
                                                <p
                                                    id="err-message"
                                                    className="mt-1 text-xs text-rose-600"
                                                >
                                                    {errors.message}
                                                </p>
                                            )}
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

                        {/* MAPA */}
                        <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-8">
                                <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
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

                                {/* Contenedor clickeable que abre Maps en otra pestaña */}
                                <a
                                    href="https://maps.app.goo.gl/HB9MPeM84q3GqV4NA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full rounded-xl overflow-hidden border border-neutral-200"
                                >
                                    <iframe
                                        title="Mapa BOA - Juncal 399, Martínez"
                                        src="https://www.google.com/maps?q=Juncal+399,+Mart%C3%ADnez,+Provincia+de+Buenos+Aires&z=16&output=embed"
                                        width="100%"
                                        height="300"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        style={{ border: 0, pointerEvents: "none" }}
                                    />
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* ======== CARDS DE CONTACTO (ABAJO: EMAIL + IG) ======== */}
                <section className="relative py-10 sm:py-12">
                    <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {contactMethods.map((m) => {
                                const IconComp = m.Icon;
                                return (
                                    <a
                                        key={m.key}
                                        href={m.href}
                                        target={m.target}
                                        rel="noopener noreferrer"
                                        className="no-underline group"
                                    >
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                                            <CardContent className="p-6 text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/75 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                                                    {m.iconImg ? (
                                                        <img
                                                            src={m.iconImg}
                                                            alt={`${m.title} icon`}
                                                            className="h-8 w-8 object-contain"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <IconComp className="h-8 w-8" />
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
                                                    {m.action}{" "}
                                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}
