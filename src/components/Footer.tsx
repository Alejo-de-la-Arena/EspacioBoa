
import Link from "next/link";
import { Instagram, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-white">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            {/* Logo */}
                            <img
                                src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg"
                                alt="Logo-BOA"
                                className="flex items-center space-x-2 group w-20 shadow rounded-full"
                            />
                        </div>
                        <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                            Un espacio integral donde el café de especialidad se encuentra con el bienestar,
                            la creatividad y la comunidad. Más de 100 años de historia, infinitas posibilidades.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-emerald-600 flex items-center justify-center transition-colors duration-300"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:hola@espacioboa.com"
                                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-emerald-600 flex items-center justify-center transition-colors duration-300"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Navegación</h3>
                        <ul className="space-y-2">
                            {[
                                { name: "Actividades", href: "/activities" },
                                { name: "Eventos", href: "/events" },
                                { name: "Gastronomía", href: "/menu" },
                                { name: "Espacios", href: "/spaces" },
                                { name: "Gift Cards", href: "/giftcards" },
                                { name: "Blog", href: "/blog" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-neutral-300 hover:text-emerald-400 transition-colors duration-300 text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Contacto</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-neutral-300 text-sm">
                                <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <span>Juncal 399, B1640 Martínez, Provincia de Buenos Aires</span>
                            </div>
                            <div className="flex items-center space-x-3 text-neutral-300 text-sm">
                                <Phone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <span>+54 11 1234-5678</span>
                            </div>
                            <div className="flex items-center space-x-3 text-neutral-300 text-sm">
                                <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <span>hola@espacioboa.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Horarios</h3>
                        <div className="space-y-2 text-neutral-300 text-sm">
                            <div className="flex justify-left gap-5">
                                <span>Lun - Vie</span>
                                <span>7:00 - 22:00</span>
                            </div>
                            <div className="flex justify-left gap-5">
                                <span>Sábados</span>
                                <span>8:00 - 23:00</span>
                            </div>
                            <div className="flex justify-left gap-4">
                                <span>Domingos</span>
                                <span>9:00 - 21:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-neutral-400 text-sm">
                        © 2024 Espacio BOA. Todos los derechos reservados.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link
                            href="/privacy"
                            className="text-neutral-400 hover:text-emerald-400 transition-colors duration-300 text-sm"
                        >
                            Privacidad
                        </Link>
                        <Link
                            href="/terms"
                            className="text-neutral-400 hover:text-emerald-400 transition-colors duration-300 text-sm"
                        >
                            Términos
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
