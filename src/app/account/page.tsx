// app/account/page.tsx
"use client";


import * as React from "react";
import { useAuth } from "@/stores/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";


function initialsFromName(name: string) {
    const parts = String(name).trim().split(/\s+/);
    if (!parts[0]) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}
function initialsFromUser(user: any) {
    const name =
        user?.user_metadata?.display_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "";
    return initialsFromName(name);
}


export default function AccountPage() {
    const authStore = useAuth() as any;
    const user = authStore?.user;
    const setUser =
        typeof authStore?.setUser === "function" ? authStore.setUser : undefined;


    const { toast } = useToast();
    const [displayName, setDisplayName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [saving, setSaving] = React.useState(false);


    React.useEffect(() => {
        if (!user) return;
        setDisplayName(
            user.user_metadata?.display_name || user.user_metadata?.name || ""
        );
        setPhone(user.user_metadata?.phone || "");
    }, [user]);


    if (!user) {
        return (
            <main className="relative h-[100svh] overflow-hidden font-sans md:h-screen">
                {/* fondo cálido */}
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(253,251,245,0.95),rgba(247,249,246,0.95))]" />
                    <div className="absolute -top-48 -left-40 h-[560px] w-[560px] rounded-full blur-2xl bg-[radial-gradient(closest-side,rgba(251,247,236,0.95),rgba(251,247,236,0.55),transparent)]" />
                    <div className="absolute -right-40 -top-24 h-[500px] w-[500px] rounded-full blur-2xl bg-[radial-gradient(closest-side,rgba(234,247,240,0.9),rgba(234,247,240,0.45),transparent)]" />
                    <div className="absolute bottom-[-160px] left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(255,232,204,0.6),transparent)]" />
                </div>


                {/* LAYOUT CENTRADO */}
                <div className="container mx-auto max-w-3xl px-4">
                    <div className="grid min-h-[100svh] place-content-center">
                        <div className="rounded-2xl border border-amber-100/60 bg-white/80 backdrop-blur-sm p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Necesitás iniciar sesión
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Ingresá para ver y editar tu perfil.
                            </p>
                            <Button asChild className="mt-5">
                                <a href="/login">Ir a iniciar sesión</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }


    const emailVerified = Boolean(user.email_confirmed_at);
    const createdAt = new Date(user.created_at).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });


    const avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        user.user_metadata?.image ||
        "";


    // --- Navegación dura con cache-buster (evita quedarte en la página)
    const hardHome = () => {
        const url = `${window.location.origin}/?updated=${Date.now()}`;
        try {
            window.location.replace(url);
        } catch { }
        setTimeout(() => {
            try {
                if (window.location.href !== url) window.location.href = url;
            } catch { }
        }, 120);
        setTimeout(() => {
            try {
                if (window.location.href !== url) window.location.assign(url);
            } catch { }
        }, 240);
        setTimeout(() => {
            try {
                window.location.reload();
            } catch { }
        }, 700);
    };


    // --- Guardado optimista + background
    const onSave = () => {
        setSaving(true);


        // 1) Actualizar store inmediatamente para que el UI ya refleje el cambio
        if (setUser && user) {
            const patched = {
                ...user,
                user_metadata: {
                    ...user.user_metadata,
                    display_name: displayName,
                    phone,
                },
            };
            try {
                setUser(patched);
            } catch { }
        }


        // 2) Disparar actualización en Supabase en background (sin await)
        Promise.resolve(
            supabase.auth
                .updateUser({ data: { display_name: displayName, phone } })
                .then(async () => {
                    // Refrescar usuario desde Supabase cuando termine (no bloquea la nav)
                    try {
                        const { data } = await supabase.auth.getUser();
                        if (data?.user && setUser) setUser(data.user);
                    } catch { }
                })
                .catch(() => { })
                .finally(() => setSaving(false))
        ).catch(() => { });


        // 3) Feedback y salida inmediata
        toast({
            title: "Perfil actualizado",
            description: "Redirigiendo al inicio…",
        });
        hardHome();
    };


    const fallbackInitials = displayName?.trim()
        ? initialsFromName(displayName)
        : initialsFromUser(user);


    return (
        <main className="relative h-[100svh] overflow-hidden font-sans md:h-screen">
            {/* fondo cálido */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(253,251,245,0.95),rgba(247,249,246,0.95))]" />
                <div className="absolute -top-48 -left-40 h-[560px] w-[560px] rounded-full blur-2xl bg-[radial-gradient(closest-side,rgba(251,247,236,0.95),rgba(251,247,236,0.55),transparent)]" />
                <div className="absolute -right-40 -top-24 h-[500px] w-[500px] rounded-full blur-2xl bg-[radial-gradient(closest-side,rgba(234,247,240,0.9),rgba(234,247,240,0.45),transparent)]" />
                <div className="absolute bottom-[-160px] left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(255,232,204,0.6),transparent)]" />
            </div>


            {/* LAYOUT CENTRADO */}
            <div className="container mx-auto max-w-5xl px-4">
                <div className="grid min-h-[100svh] place-content-center">
                    <div className="w-full">
                        {/* Encabezado */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-extrabold tracking-tight">Mi perfil</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Gestioná tus datos personales. Tu correo sólo se usa para
                                notificaciones y acceso.
                            </p>
                        </div>


                        {/* Card */}
                        <section className="rounded-2xl border border-amber-100/70 bg-white/85 backdrop-blur-[2px] shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                            <div className="h-2 w-full rounded-t-2xl bg-[linear-gradient(90deg,#39b889,#6bd0a7,#39b889)]" />
                            <div className="grid gap-8 p-6 md:grid-cols-[300px,1fr] md:p-8">
                                {/* Identidad */}
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="relative">
                                        <Avatar className="h-28 w-28 ring-4 ring-emerald-500/15 shadow-sm">
                                            {avatarUrl ? (
                                                <AvatarImage src={avatarUrl} alt={user.email ?? "Usuario"} />
                                            ) : null}
                                            <AvatarFallback className="text-xl">
                                                {fallbackInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        {emailVerified && (
                                            <span className="absolute -right-1 -bottom-1 rounded-full bg-emerald-600 text-white p-1.5 shadow-md">
                                                <ShieldCheck className="h-4 w-4" />
                                            </span>
                                        )}
                                    </div>


                                    <div className="mt-4 text-center md:text-left">
                                        <p className="text-xl font-semibold">
                                            {displayName || user.email}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Miembro desde {createdAt}
                                        </p>
                                    </div>
                                </div>


                                {/* Formulario */}
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="displayName" className="text-sm font-medium">
                                            Nombre completo
                                        </Label>
                                        <Input
                                            id="displayName"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Tu nombre y apellido"
                                            className="h-11 rounded-xl border-amber-100 bg-white/80 focus-visible:ring-emerald-500"
                                            disabled={saving}
                                        />
                                    </div>


                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email
                                        </Label>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                id="email"
                                                value={user.email ?? ""}
                                                readOnly
                                                className="h-11 rounded-xl border-amber-100 bg-amber-50/50 text-muted-foreground"
                                            />
                                            {emailVerified ? (
                                                <Badge className="gap-1 rounded-full bg-emerald-600 hover:bg-emerald-600 text-white">
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                    verificado
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="gap-1 rounded-full">
                                                    <ShieldAlert className="h-3.5 w-3.5" />
                                                    sin verificar
                                                </Badge>
                                            )}
                                        </div>
                                    </div>


                                    <div className="grid gap-2">
                                        <Label htmlFor="phone" className="text-sm font-medium">
                                            Teléfono (opcional)
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+54 9 11 0000-0000"
                                            className="h-11 rounded-xl border-amber-100 bg-white/80 focus-visible:ring-emerald-500"
                                            disabled={saving}
                                        />
                                    </div>


                                    <div className="flex items-center justify-end pt-2">
                                        <Button
                                            onClick={onSave}
                                            disabled={saving}
                                            className="h-11 rounded-xl px-6 bg-emerald-600 hover:bg-emerald-600/90 text-white shadow-sm"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Guardando…
                                                </>
                                            ) : (
                                                "Guardar cambios"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}



