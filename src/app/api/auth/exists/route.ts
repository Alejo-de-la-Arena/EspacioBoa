// src/app/api/auth/exists/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ ok: false, error: "Email requerido" }, { status: 400 });
        }

        const redirectTo =
            (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/reset-password";

        const { error } = await supabaseAdmin.auth.admin.generateLink({
            type: "recovery",
            email,
            options: { redirectTo },
        });

        if (error) {
            const msg = (error.message || "").toLowerCase();
            const notFound =
                msg.includes("not found") ||
                msg.includes("no user") ||
                error.status === 422;

            if (notFound) {
                return NextResponse.json({ ok: true, exists: false });
            }
            return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true, exists: true });
    } catch {
        return NextResponse.json({ ok: false, error: "Error inesperado" }, { status: 500 });
    }
}
