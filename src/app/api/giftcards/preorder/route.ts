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

function formatArs(value: any) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "";
    return n.toLocaleString("es-AR");
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

            // NUEVO
            is_gift,
            recipient_name,
            recipient_phone,
            gift_from_name,
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

        const isGift = Boolean(is_gift);

        // Validación extra si es regalo
        if (isGift) {
            if (!recipient_name || !String(recipient_name).trim()) {
                return NextResponse.json(
                    { ok: false, error: "Falta el nombre del destinatario" },
                    { status: 400 }
                );
            }
            if (!recipient_phone || !String(recipient_phone).trim()) {
                return NextResponse.json(
                    { ok: false, error: "Falta el teléfono del destinatario" },
                    { status: 400 }
                );
            }
        }

        const buyerPhone = normalizePhone(buyer_phone);
        const recPhone = isGift ? normalizePhone(recipient_phone) : null;

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

        // rate limit básico (3 pedidos en 10 min) por buyer_phone
        {
            const { data: recent, error: recentErr } = await supabaseAdmin
                .from("preorders")
                .select("id, created_at")
                .eq("buyer_phone", buyerPhone)
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

        const ars = formatArs(gift_value);
        const giftLabel = ars ? `${gift_name} — $${ars}` : String(gift_name);

        const fromNameResolved = isGift
            ? String(gift_from_name || buyer_name || "").trim()
            : null;

        const text =
            `Hola! Quiero comprar la GiftCard *${giftLabel}*.\n` +
            `Preorder: ${code}\n` +
            `Nombre: ${buyer_name}\n` +
            `Tel: ${buyerPhone}\n` +
            `Email: ${buyer_email}\n` +
            (isGift
                ? `Regalo: Sí\n` +
                `Destinatario: ${String(recipient_name).trim()}\n` +
                `Tel destinatario: ${recPhone}\n` +
                (fromNameResolved ? `De parte de: ${fromNameResolved}\n` : "")
                : `Regalo: No\n`) +
            (message ? `Mensaje para destinatario: ${message}\n` : "");

        const link = waLink(number, text);

        const { data: inserted, error: insErr } = await supabaseAdmin
            .from("preorders")
            .insert([
                {
                    preorder_code: code,
                    gift_id,
                    gift_name,
                    gift_value: gift_value ?? null,
                    buyer_name,
                    buyer_phone: buyerPhone,
                    buyer_email,
                    message: message ?? null,
                    status: "pending",
                    whatsapp_link: link,
                    ip,

                    // NUEVO
                    is_gift: isGift,
                    recipient_name: isGift ? String(recipient_name).trim() : null,
                    recipient_phone: isGift ? recPhone : null,
                    gift_from_name: isGift ? fromNameResolved : null,
                },
            ])
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
