"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HeaderAuth from '@/components/auth/HeaderAuth'
import { Menu, Coffee, Heart, Calendar, Gift, BookOpen, Users, MapPin } from "lucide-react";


const navigation = [
    { name: "Inicio", href: "/", icon: Coffee },
    { name: "Actividades", href: "/activities", icon: Heart },
    { name: "Eventos", href: "/events", icon: Calendar },
    { name: "Gastronomía", href: "/menu", icon: Coffee },
    { name: "Espacios", href: "/spaces", icon: MapPin },
    { name: "Gift Cards", href: "/giftcards", icon: Gift },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Nosotros", href: "/about", icon: Users },
];

export default function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || 0;
            setScrolled(y > 6);
            const h = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(h > 0 ? Math.min(1, Math.max(0, y / h)) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={[
                "sticky top-0 z-50 w-full font-sans transition-all duration-300",
                scrolled
                    ? "bg-white/80 backdrop-blur-md ring-1 ring-boa-ink/10 shadow-[0_8px_30px_rgba(2,6,23,.06)]"
                    : "bg-white/95 border-b border-neutral-200/60",
            ].join(" ")}
            style={
                {
                    // barra de progreso (ancho controlado por var interna)
                    ["--boa-progress" as any]: `${progress * 100}%`,
                } as React.CSSProperties
            }
        >
            {/* Scroll progress bar */}
            <div
                aria-hidden
                className="absolute left-0 top-0 h-[2px] bg-boa-green transition-[width] duration-200"
                style={{ width: `var(--boa-progress)` }}
            />

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" aria-label="Ir a inicio" className="flex items-center gap-2">
                        <img
                            src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg"
                            alt="Logo-BOA"
                            className={[
                                "w-14 rounded-full transition-transform duration-300",
                                scrolled ? "scale-[0.95]" : "scale-100",
                            ].join(" ")}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={[
                                        "group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                                        "text-neutral-700 hover:text-boa-green hover:bg-neutral-50",
                                        isActive ? "bg-emerald-50 text-boa-green shadow-sm" : "",
                                    ].join(" ")}
                                >
                                    <span className="relative">
                                        {item.name}
                                        {/* micro-subrayado animado */}
                                        <span
                                            className={[
                                                "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[-6px] h-[2px] rounded-full bg-boa-green transition-all duration-300",
                                                isActive ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100",
                                            ].join(" ")}
                                        />
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Contact Button */}
                    <div className="hidden md:flex items-center space-x-4">


                        <div className="flex gap-2">
                            <HeaderAuth />
                        </div>

                    </div>

                    {/* Mobile menu trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="sm" className="font-sans">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-80 bg-white border-l border-neutral-200/60 p-0 overflow-hidden"
                        >
                            {/* Encabezado del sheet */}
                            <div className="relative px-5 pt-5 pb-4 border-b border-neutral-200/60 bg-gradient-to-br from-emerald-50/70 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-boa-green to-emerald-600" />
                                    <span className="boa-logo text-2xl font-medium text-neutral-900 font-sans">boa</span>
                                </div>
                            </div>

                            {/* Navegación móvil */}
                            <div className="p-5">
                                <nav className="flex flex-col space-y-2">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={[
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                                                    isActive
                                                        ? "bg-emerald-50 text-boa-green shadow-sm"
                                                        : "text-neutral-700 hover:bg-neutral-50 hover:text-boa-green",
                                                ].join(" ")}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="mt-6 pt-6 border-t border-neutral-200">
                                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-boa-green hover:bg-boa-green/90 text-white font-sans">
                                            Reservar actividad
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
