"use client";

import Link from "next/link";
import { useAuth } from "@/stores/useAuth";
import UserMenu from "./UserMenu";

export default function HeaderAuth() {
    const { user } = useAuth();

    if (user) return <UserMenu />;

    return (
        <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-2 rounded border hover:bg-neutral-50">Ingresar</Link>
            <Link href="/register" className="px-3 py-2 rounded bg-boa-green text-white hover:bg-boa-green/90">Crear cuenta</Link>
        </div>
    );
}
