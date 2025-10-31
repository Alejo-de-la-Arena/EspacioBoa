import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
    try {
        // Solo habilitado en desarrollo y si lo permitís explícitamente
        if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_ALLOW_DEV_RECOVERY_LINK !== "1") {
            return NextResponse.json({ ok: false, error: "Not allowed" }, { status: 403 });
        }

        const { email } = await req.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ ok: false, error: "Email requerido" }, { status: 400 });
        }

        const redirectTo =
            (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/reset-password";

        // Genera el deep link de recuperación sin enviar email.
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: "recovery",
            email,
            options: { redirectTo },
        });

        if (error) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
        }

        // data.properties.action_link trae la URL completa
        const link =
            (data as any)?.properties?.action_link ||
            (data as any)?.action_link ||
            null;

        if (!link) {
            return NextResponse.json({ ok: false, error: "No se pudo generar el enlace" }, { status: 500 });
        }

        return NextResponse.json({ ok: true, link });
    } catch {
        return NextResponse.json({ ok: false, error: "Error inesperado" }, { status: 500 });
    }
}
