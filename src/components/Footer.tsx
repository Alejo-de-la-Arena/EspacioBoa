import Link from "next/link";
import { Instagram, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-neutral-950 text-white font-sans overflow-hidden">
            {/* Veladuras sutiles */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-boa-green/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-24 w-[26rem] h-[26rem] rounded-full bg-boa-terra/10 blur-3xl" />
            {/* Ruido muy leve */}
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' fill='black'/></svg>\")",
                    backgroundSize: "420px 420px",
                    mixBlendMode: "soft-light",
                }}
                aria-hidden
            />
            {/* Hairline superior con acento */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-boa-green/30 to-transparent" />

            <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg"
                                alt="Logo BOA"
                                className="w-16 rounded-full"
                            />
                            <div className="hidden sm:block">
                                <div className="text-xl font-semibold tracking-tight">Espacio BOA</div>
                                <div className="text-xs text-neutral-400 -mt-0.5">Martínez · Buenos Aires</div>
                            </div>
                        </div>

                        <p className="text-neutral-300/90 text-sm leading-relaxed mb-6">
                            Café de especialidad, bienestar y comunidad en una casa con historia.
                        </p>

                        <div className="flex gap-3">
                            <a
                                href="https://www.instagram.com/espacio.boa/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-white/10 hover:ring-boa-green/50 transition"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5 text-white/90 group-hover:text-white" />
                            </a>
                            <a
                                href="mailto:hola@espacioboa.com"
                                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-white/10 hover:ring-boa-green/50 transition"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5 text-white/90 group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="mb-4 text-white font-semibold">
                            Navegación
                            <span className="block h-[2px] w-8 mt-2 rounded-full bg-boa-green/70" />
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { name: "Actividades", href: "/activities" },
                                { name: "Eventos", href: "/events" },
                                { name: "Gastronomía", href: "/menu" },
                                { name: "Espacios", href: "/spaces" },
                                { name: "Gift Cards", href: "/giftcards" },
                                { name: "Blog", href: "/blog" },
                                { name: "Nosotros", href: "/about" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-2 text-neutral-300 hover:text-white text-sm transition"
                                    >
                                        <span className="relative">
                                            {item.name}
                                            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-[6px] h-[2px] w-0 rounded-full bg-boa-green/90 transition-all duration-300 group-hover:w-6" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-white font-semibold">
                            Contacto
                            <span className="block h-[2px] w-8 mt-2 rounded-full bg-boa-green/70" />
                        </h3>
                        <div className="space-y-3 text-sm text-neutral-300">
                            <a
                                href="https://maps.google.com/?q=Juncal%20399,%20Mart%C3%ADnez,%20Buenos%20Aires"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 hover:text-white transition"
                            >
                                <MapPin className="mt-0.5 h-4 w-4 text-boa-green flex-shrink-0" />
                                <span>Juncal 399, B1640 Martínez, Provincia de Buenos Aires</span>
                            </a>
                            <a href="tel:+541112345678" className="flex items-center gap-3 hover:text-white transition">
                                <Phone className="h-4 w-4 text-boa-green flex-shrink-0" />
                                <span>+54 11 1234-5678</span>
                            </a>
                            <a href="mailto:hola@espacioboa.com" className="flex items-center gap-3 hover:text-white transition">
                                <Mail className="h-4 w-4 text-boa-green flex-shrink-0" />
                                <span>hola@espacioboa.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="mb-4 text-white font-semibold">
                            Horarios
                            <span className="block h-[2px] w-8 mt-2 rounded-full bg-boa-green/70" />
                        </h3>
                        <div className="space-y-2 text-neutral-300 text-sm">
                            <div className="flex items-center justify-between">
                                <span>Lun–Vie</span>
                                <span className="tabular-nums">7:00 – 22:00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Sábados</span>
                                <span className="tabular-nums">8:00 – 23:00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Domingos</span>
                                <span className="tabular-nums">9:00 – 21:00</span>
                            </div>

                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5">
                                <Clock className="h-4 w-4 text-boa-green" />
                                <span className="text-xs text-neutral-300">
                                    Los horarios pueden variar según actividades especiales.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-neutral-400 text-sm">
                        © {new Date().getFullYear()} Espacio BOA. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link
                            href="/privacy"
                            className="group text-neutral-400 hover:text-white text-sm transition"
                        >
                            <span className="relative">
                                Privacidad
                                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-[6px] h-[2px] w-0 rounded-full bg-boa-green/90 transition-all duration-300 group-hover:w-6" />
                            </span>
                        </Link>
                        <Link
                            href="/terms"
                            className="group text-neutral-400 hover:text-white text-sm transition"
                        >
                            <span className="relative">
                                Términos
                                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-[6px] h-[2px] w-0 rounded-full bg-boa-green/90 transition-all duration-300 group-hover:w-6" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
