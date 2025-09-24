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

function initialsFrom(user: any) {
    const name =
        user?.user_metadata?.display_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "";
    const parts = String(name).trim().split(/\s+/);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function AccountPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [displayName, setDisplayName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (!user) return;
        setDisplayName(
            user.user_metadata?.display_name ||
            user.user_metadata?.name ||
            ""
        );
        setPhone(user.user_metadata?.phone || "");
    }, [user]);

    if (!user) {
        return (
            <main className="container mx-auto max-w-3xl px-4 py-10">
                <div className="rounded-xl border p-6 text-center">
                    <h1 className="text-2xl font-semibold">Necesitás iniciar sesión</h1>
                    <p className="mt-2 text-neutral-600">
                        Ingresá para ver y editar tu perfil.
                    </p>
                    <Button asChild className="mt-4">
                        <a href="/login">Ir a iniciar sesión</a>
                    </Button>
                </div>
            </main>
        );
    }

    const emailVerified = Boolean(user.email_confirmed_at);
    const provider = user.app_metadata?.provider ?? "email";
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

    const onSave = async () => {
        setSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { display_name: displayName, phone },
        });
        setSaving(false);

        if (error) {
            toast({
                title: "No pudimos guardar",
                description: "Reintentá en unos segundos.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Perfil actualizado",
            description: "Los cambios se guardaron correctamente.",
        });
    };

    return (
        <main className="container mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-2xl font-bold tracking-tight">Mi perfil</h1>

            <section className="mt-6 grid gap-6 rounded-xl border p-6 md:grid-cols-[auto,1fr]">
                <div className="flex flex-col items-center justify-start gap-3">
                    <Avatar className="h-20 w-20">
                        {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={user.email ?? "Usuario"} />
                        ) : null}
                        <AvatarFallback>{initialsFrom(user)}</AvatarFallback>
                    </Avatar>

                </div>

                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="displayName">Nombre completo</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Tu nombre y apellido"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2">
                            <Input id="email" value={user.email ?? ""} readOnly />
                            {emailVerified ? (
                                <Badge className="gap-1">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    verificado
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="gap-1">
                                    <ShieldAlert className="h-3.5 w-3.5" />
                                    sin verificar
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Teléfono (opcional)</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+54 9 11 0000-0000"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm text-neutral-600">
                        <span>Miembro desde {createdAt}</span>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={onSave} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin boa-bg-green" />
                                    Guardando…
                                </>
                            ) : (
                                "Guardar cambios"
                            )}
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
