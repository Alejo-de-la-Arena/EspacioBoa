import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function normalizePhone(raw: string) {
    return String(raw || "").replace(/[^\d]/g, "");
}

function makeCode(len = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return `BOA-GC-${out}`;
}

function waLink(number: string, text: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            gift_id,
            gift_name,
            gift_value,
            buyer_name,
            buyer_phone,
            buyer_email,
            message,
        } = body || {};

        if (!gift_id || !gift_name) {
            return NextResponse.json(
                { ok: false, error: "gift_id y gift_name son requeridos" },
                { status: 400 }
            );
        }
        if (!buyer_name || !buyer_phone || !buyer_email) {
            return NextResponse.json(
                { ok: false, error: "Datos de contacto incompletos" },
                { status: 400 }
            );
        }

        const phone = normalizePhone(buyer_phone);
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

        // rate limit básico (3 pedidos en 10 min)
        {
            const { data: recent, error: recentErr } = await supabaseAdmin
                .from("preorders")
                .select("id, created_at")
                .eq("buyer_phone", phone)
                .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

            if (!recentErr && (recent?.length || 0) >= 3) {
                return NextResponse.json(
                    { ok: false, error: "Demasiados intentos recientes. Probá en unos minutos." },
                    { status: 429 }
                );
            }
        }

        const code = makeCode();
        const number = process.env.BOA_WHATSAPP_NUMBER || "5491170961318";

        const text =
            `Hola! Quiero comprar la GiftCard *${gift_name}*.\n` +
            `Preorder: ${code}\n` +
            `Nombre: ${buyer_name}\n` +
            `Tel: ${phone}\n` +
            `Email: ${buyer_email}\n` +
            (message ? `Mensaje para destinatario: ${message}\n` : "");

        const link = waLink(number, text);

        const { data: inserted, error: insErr } = await supabaseAdmin
            .from("preorders") // 👈 IMPORTANTE: esta tabla SÍ existe en tu flujo (redeem también la usa)
            .insert([{
                preorder_code: code,
                gift_id,
                gift_name,
                gift_value: gift_value ?? null,
                buyer_name,
                buyer_phone: phone,
                buyer_email,
                message: message ?? null,
                status: "pending",
                whatsapp_link: link,
                ip,
            }])
            .select("id")
            .maybeSingle();

        if (insErr) {
            return NextResponse.json(
                { ok: false, error: "DB insert error", reason: insErr.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            ok: true,
            data: { id: inserted!.id, preorder_code: code, whatsapp_link: link },
        });
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: "Unexpected", reason: e?.message },
            { status: 500 }
        );
    }
}
