// pages/api/preorders.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function normalizePhone(raw: string) {
    // muy simple; si usás otro país/validaciones, lo vemos luego
    return raw.replace(/[^\d]/g, "");
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    try {
        const {
            gift_id,
            gift_name,
            gift_value,
            buyer_name,
            buyer_phone,
            buyer_email,
            message,
        } = req.body || {};

        // validaciones mínimas
        if (!gift_id || !gift_name) return res.status(400).json({ ok: false, error: "gift_id y gift_name son requeridos" });
        if (!buyer_name || !buyer_phone || !buyer_email)
            return res.status(400).json({ ok: false, error: "Datos de contacto incompletos" });

        const phone = normalizePhone(String(buyer_phone));
        const ip =
            (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            (req.socket?.remoteAddress as string) ||
            null;

        // rate limit muy básico por teléfono (3 pedidos en 10 minutos)
        {
            const { data: recent, error: recentErr } = await supabaseAdmin
                .from("preorders")
                .select("id, created_at")
                .eq("buyer_phone", phone)
                .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

            if (!recentErr && (recent?.length || 0) >= 3) {
                return res.status(429).json({
                    ok: false,
                    error: "Demasiados intentos recientes. Por favor, intentá de nuevo en unos minutos.",
                });
            }
        }

        const code = makeCode();
        const number = process.env.BOA_WHATSAPP_NUMBER || "5491170961318";

        const msg =
            `Hola! Quiero comprar la GiftCard *${gift_name}*.\n` +
            `Preorder: ${code}\n` +
            `Nombre: ${buyer_name}\n` +
            `Tel: ${phone}\n` +
            `Email: ${buyer_email}\n` +
            (message ? `Mensaje para destinatario: ${message}\n` : "");

        const link = waLink(number, msg);

        // guardar en Supabase
        const { error: insErr, data: inserted } = await supabaseAdmin
            .from("preorders")
            .insert([
                {
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
                },
            ])
            .select()
            .maybeSingle();

        if (insErr) return res.status(400).json({ ok: false, error: insErr.message });

        return res.status(200).json({
            ok: true,
            preorder_id: inserted?.id,
            preorder_code: code,
            whatsapp_link: link,
        });
    } catch (e: any) {
        console.error("[preorders] fatal", e);
        return res.status(500).json({ ok: false, error: e?.message || "Unexpected error" });
    }
}
