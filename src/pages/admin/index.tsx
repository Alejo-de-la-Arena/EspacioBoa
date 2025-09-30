"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/stores/useAuth";
import { supabase } from "@/lib/supabaseClient";

export default function AdminHome() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        let ok = true;
        (async () => {
            if (!user) { setIsAdmin(false); return; }
            const { data } = await supabase.from("profiles")
                .select("is_admin").eq("id", user.id).maybeSingle();
            if (ok) setIsAdmin(Boolean(data?.is_admin));
        })();
        return () => { ok = false; };
    }, [user]);

    if (isAdmin === null) return null;

    if (!isAdmin) {
        return (
            <main className="container mx-auto max-w-4xl px-4 py-16">
                <div className="rounded-xl border p-8 text-center">
                    <h1 className="text-2xl font-semibold">Acceso restringido</h1>
                    <p className="mt-2 text-neutral-600">Necesitás permisos de administrador.</p>
                </div>
            </main>
        );
    }

    const cards = [
        { href: "/admin/activities", title: "Administrar Actividades", desc: "Crear, editar y eliminar actividades." },
        { href: "/admin/events", title: "Administrar Eventos", desc: "CRUD de eventos. (Próximamente)" },
        { href: "/admin/giftcards", title: "Administrar Giftcards", desc: "CRUD de giftcards. (Próximamente)" },
    ];

    return (
        <main className="container mx-auto max-w-6xl px-4 py-12 min-h-[50vh]">
            <h1 className="text-3xl font-bold tracking-tight">Panel de administración</h1>
            <p className="mt-2 text-neutral-600">Gestioná el contenido del sitio.</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5 content-center h-full">
                {cards.map(c => (
                    <Link key={c.href} href={c.href}
                        className="rounded-2xl border p-6 hover:shadow-md transition">
                        <h3 className="text-lg font-semibold">{c.title}</h3>
                        <p className="mt-1 text-sm text-neutral-600">{c.desc}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
