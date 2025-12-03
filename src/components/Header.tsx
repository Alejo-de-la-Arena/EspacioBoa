"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import HeaderAuth from "@/components/auth/HeaderAuth";
import { useAuth } from "@/stores/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    Coffee,
    Heart,
    Calendar,
    Gift,
    BookOpen,
    Users,
    MapPin,
    ChevronRight,
    LayoutDashboard,
    HeartHandshake,
    X,
    UserRound,
    Ticket,
    LogOut,
    Shield,
} from "lucide-react";

const LOGO_SRC =
    "https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg";

const navigation = [
    { name: "Inicio", href: "/", icon: Coffee },
    { name: "Actividades", href: "/activities", icon: Heart },
    { name: "Eventos", href: "/events", icon: Calendar },
    { name: "Gastronomía", href: "/menu", icon: Coffee },
    { name: "Espacios", href: "/spaces", icon: MapPin },
    { name: "Gift Cards", href: "/giftcards", icon: Gift },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Nosotros", href: "/about", icon: Users },
    { name: "Contacto", href: "/contact", icon: HeartHandshake },
];

export default function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);

    const { user, signOut } = useAuth();
    const { toast } = useToast();

    // admin real: metadata + tabla profiles
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const metaAdmin =
            user?.user_metadata?.is_admin === true ||
            user?.user_metadata?.role === "admin" ||
            (Array.isArray(user?.app_metadata?.roles) &&
                user.app_metadata.roles.includes("admin"));

        if (metaAdmin) {
            setIsAdmin(true);
            return;
        }

        if (!user?.id) {
            setIsAdmin(false);
            return;
        }

        const checkAdminFromProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("is_admin")
                    .eq("id", user.id)
                    .single();

                if (cancelled) return;

                if (error) {
                    setIsAdmin(false);
                    return;
                }

                setIsAdmin(Boolean(data?.is_admin));
            } catch {
                if (!cancelled) setIsAdmin(false);
            }
        };

        checkAdminFromProfile();

        return () => {
            cancelled = true;
        };
    }, [user?.id]);


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

    const handleLogout = async () => {
        try {
            await Promise.resolve(signOut());
            await Promise.resolve(supabase.auth.signOut({ scope: "local" }));
            await Promise.resolve(supabase.auth.signOut({ scope: "global" }));
        } catch { }

        toast({
            title: "Sesión cerrada",
            description: "Te esperamos pronto en BOA.",
        });

        if (typeof window !== "undefined") {
            const url = `${window.location.origin}/?signedout=${Date.now()}`;
            window.location.href = url;
        }
    };

    return (
        <motion.header
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.6 }}
            className={[
                "sticky top-0 z-50 w-full font-sans transition-all duration-300",
                scrolled
                    ? "bg-white/85 backdrop-blur-md ring-1 ring-boa-ink/10 shadow-[0_8px_30px_rgba(2,6,23,.06)]"
                    : "bg-white/95 border-b border-neutral-200/60",
            ].join(" ")}
            style={
                {
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
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link href="/" aria-label="Ir a inicio" className="flex items-center gap-2">
                            <img
                                src={LOGO_SRC}
                                alt="BOA"
                                className={[
                                    "w-12 h-12 rounded-full transition-transform duration-300",
                                    scrolled ? "scale-[0.95]" : "scale-100",
                                ].join(" ")}
                            />
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navigation.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.02 * i, duration: 0.18 }}
                                >
                                    <Link
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
                                            <span
                                                className={[
                                                    "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[-6px] h-[2px] rounded-full bg-boa-green transition-all duration-300",
                                                    isActive
                                                        ? "w-6 opacity-100"
                                                        : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100",
                                                ].join(" ")}
                                            />
                                        </span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>

                    {/* Desktop Right (auth) */}
                    <div className="hidden md:flex items-center gap-2">
                        <HeaderAuth />
                    </div>

                    {/* Mobile Right: trigger menú */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="font-sans hover:bg-neutral-100 active:scale-95 transition"
                                    aria-label="Abrir menú"
                                    aria-expanded={isOpen}
                                >
                                    <Menu className="h-10 w-10 transition-transform duration-150 group-data-[state=open]:rotate-90" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-80 bg-white border-l border-neutral-200/60 p-0 overflow-x-hidden [&>button.absolute.right-4.top-4]:hidden"
                            >
                                {/* Header del sheet (sin dropdown de usuario) */}
                                <div className="relative px-5 pt-5 pb-4 border-b border-neutral-200/60 bg-gradient-to-br from-emerald-50/70 to-white">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-neutral-700">
                                            Menú
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <SheetClose asChild>
                                                <button
                                                    aria-label="Cerrar menú"
                                                    className="inline-flex items-center justify-center rounded-full h-10 w-10 text-neutral-700/80 hover:text-neutral-900 hover:bg-neutral-100/80 transition-opacity"
                                                >
                                                    <X className="h-6 w-6" />
                                                </button>
                                            </SheetClose>
                                        </div>
                                    </div>
                                </div>

                                {/* Navegación móvil */}
                                <div className="p-5 overflow-y-auto max-h-[calc(100vh-64px)]">
                                    <AnimatePresence mode="popLayout">
                                        <nav className="flex flex-col space-y-2">
                                            {navigation.map((item, i) => {
                                                const Icon = item.icon;
                                                const isActive = pathname === item.href;
                                                return (
                                                    <motion.div
                                                        key={item.name}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 6 }}
                                                        transition={{ delay: 0.02 * i, duration: 0.18 }}
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setIsOpen(false)}
                                                            className={[
                                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                                                                isActive
                                                                    ? "bg-emerald-50 text-boa-green shadow-sm"
                                                                    : "text-neutral-800 hover:bg-neutral-50 hover:text-boa-green",
                                                            ].join(" ")}
                                                        >
                                                            <Icon className="h-5 w-5" />
                                                            <span className="flex-1 font-sans font-medium">
                                                                {item.name}
                                                            </span>
                                                            <ChevronRight className="h-4 w-4 opacity-60" />
                                                        </Link>
                                                    </motion.div>
                                                );
                                            })}

                                            {/* Sección "Tu cuenta" solo si hay usuario */}
                                            {user && (
                                                <>
                                                    <div className="h-px my-3 bg-neutral-200/80" />
                                                    <p className="px-4 pb-1 pt-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                                                        Tu cuenta
                                                    </p>

                                                    {/* Mi perfil */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 6 }}
                                                        transition={{
                                                            delay: 0.02 * (navigation.length + 1),
                                                            duration: 0.18,
                                                        }}
                                                    >
                                                        <Link
                                                            href="/account"
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-neutral-800 hover:bg-neutral-50 hover:text-boa-green"
                                                        >
                                                            <UserRound className="h-5 w-5" />
                                                            <span className="flex-1">Mi perfil</span>
                                                            <ChevronRight className="h-4 w-4 opacity-60" />
                                                        </Link>
                                                    </motion.div>

                                                    {/* Mis inscripciones */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 6 }}
                                                        transition={{
                                                            delay: 0.02 * (navigation.length + 2),
                                                            duration: 0.18,
                                                        }}
                                                    >
                                                        <Link
                                                            href="/account/inscripciones"
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-neutral-800 hover:bg-neutral-50 hover:text-boa-green"
                                                        >
                                                            <Ticket className="h-5 w-5" />
                                                            <span className="flex-1">Mis inscripciones</span>
                                                            <ChevronRight className="h-4 w-4 opacity-60" />
                                                        </Link>
                                                    </motion.div>

                                                    {/* Administrar BOA (solo admins) */}
                                                    {isAdmin && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 6 }}
                                                            transition={{
                                                                delay: 0.02 * (navigation.length + 3),
                                                                duration: 0.18,
                                                            }}
                                                        >
                                                            <Link
                                                                href="/admin"
                                                                onClick={() => setIsOpen(false)}
                                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-neutral-50 hover:text-boa-green"
                                                            >
                                                                <Shield className="h-5 w-5" />
                                                                <span className="flex-1">Administrar BOA</span>
                                                                <ChevronRight className="h-4 w-4 opacity-60" />
                                                            </Link>
                                                        </motion.div>
                                                    )}

                                                    {/* Cerrar sesión */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 6 }}
                                                        transition={{
                                                            delay: 0.02 * (navigation.length + 4),
                                                            duration: 0.18,
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                handleLogout();
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                                                        >
                                                            <LogOut className="h-5 w-5" />
                                                            <span className="flex-1 text-left">Cerrar sesión</span>
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </nav>
                                    </AnimatePresence>

                                    {/* Si NO hay usuario, mostramos HeaderAuth para login/registro */}
                                    {!user && (
                                        <div className="mt-5 pt-4 border-t border-neutral-200/70">
                                            <HeaderAuth />
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
