import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Coffee, Heart, Calendar, Gift, BookOpen, Users, MapPin } from "lucide-react";

const navigation = [
    { name: "Inicio", href: "/", icon: Coffee },
    { name: "Actividades", href: "/activities", icon: Heart },
    { name: "Eventos", href: "/events", icon: Calendar },
    { name: "Gastronomía", href: "/menu", icon: Coffee },
    { name: "Espacios", href: "/spaces", icon: MapPin },
    { name: "Gift Cards", href: "/giftcards", icon: Gift },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Nosotros", href: "/about", icon: Users }
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/95 backdrop-blur-sm font-sans">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <img
                        src="https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg"
                        alt="Logo-BOA"
                        className="flex items-center space-x-2 group w-14 shadow rounded-full"
                    />

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const isActive = router.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium font-sans transition-all duration-300 hover:bg-neutral-50 hover:text-emerald-600 ${isActive ? "bg-emerald-50 text-emerald-600 shadow-sm" : "text-neutral-700"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Contact Button */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/contact">
                            <Button
                                variant="outline"
                                className="bg-transparent hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all duration-300 font-sans"
                            >
                                Reservar actividad
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="sm" className="font-sans">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 bg-white border-l border-neutral-200/60">
                            <div className="flex flex-col h-full font-sans">
                                <div className="flex items-center space-x-2 mb-8 pt-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600" />
                                    <span className="boa-logo text-2xl font-medium text-neutral-900 font-sans">boa</span>
                                </div>

                                <nav className="flex flex-col space-y-2 flex-1">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = router.pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium font-sans transition-all duration-300 ${isActive
                                                        ? "bg-emerald-50 text-emerald-600 shadow-sm"
                                                        : "text-neutral-700 hover:bg-neutral-50 hover:text-emerald-600"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="mt-6 pt-6 border-t border-neutral-200">
                                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans">
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
