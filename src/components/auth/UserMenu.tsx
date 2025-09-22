"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/stores/useAuth";
import { User2, LogOut, Ticket, UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
    const { user, role, signOut } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // cerrar al hacer click fuera / esc
    useEffect(() => {
        function handle(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
        function onEsc(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
        document.addEventListener("mousedown", handle);
        document.addEventListener("keydown", onEsc);
        return () => { document.removeEventListener("mousedown", handle); document.removeEventListener("keydown", onEsc); };
    }, []);

    if (!user) return null;

    const name = (user.user_metadata?.display_name as string) || user.email;

    return (
        <div className="relative" ref={ref}>
            <button
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white hover:bg-neutral-50"
                onClick={() => setOpen(o => !o)}
                aria-haspopup="menu" aria-expanded={open}
            >
                <User2 className="h-5 w-5" />
                <span className="text-sm">{name}</span>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-xl p-2 z-50"
                >
                    <Link href="/cuenta" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50" onClick={() => setOpen(false)}>
                        <UserCircle2 className="h-4 w-4" /> Mi cuenta
                    </Link>
                    <Link href="/inscripciones" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50" onClick={() => setOpen(false)}>
                        <Ticket className="h-4 w-4" /> Mis inscripciones
                    </Link>
                    {role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50" onClick={() => setOpen(false)}>
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 mr-1.5" /> Admin
                        </Link>
                    )}
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 text-red-600"
                    >
                        <LogOut className="h-4 w-4" /> Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
}
