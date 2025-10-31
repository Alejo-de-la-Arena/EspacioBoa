// pages/api/giftcards/preorder.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

type Ok = {
    ok: true;
    data: {
        id: string;
        preorder_code: string;
        whatsapp_link: string;
    };
};
type Err = { ok: false; error: string; reason?: string };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// NUNCA uses anon acá – usamos service-role para evitar RLS y asegurar inserción
const sb = createClient(url, service);

function makePreorderCode(len = 6) {
    const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < len; i++) s += ABC[Math.floor(Math.random() * ABC.length)];
    return `BOA-GC-${s}`;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Ok | Err>
) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST")
        return res.status(405).json({ ok: false, error: "Method not allowed" });

    try {
        const {
            gift_id,
            gift_name,
            gift_value,
            buyer_name,
            buyer_phone,
            buyer_email,
            message,
        } = (req.body || {}) as {
            gift_id?: string;
            gift_name?: string;
            gift_value?: number | string;
            buyer_name?: string;
            buyer_phone?: string;
            buyer_email?: string;
            message?: string;
        };

        if (!gift_id || !gift_name)
            return res
                .status(400)
                .json({ ok: false, error: "Faltan gift_id y/o gift_name" });

        // IP para auditoría
        const fwd = (req.headers["x-forwarded-for"] as string) || "";
        const ip =
            fwd.split(",").map((s) => s.trim())[0] ||
            (req.socket as any)?.remoteAddress ||
            "";

        // Código único (se reintenta si choca con único)
        let preorder_code = makePreorderCode();
        for (let i = 0; i < 3; i++) {
            const { data: exists } = await sb
                .from("giftcards_preorders")
                .select("id")
                .eq("preorder_code", preorder_code)
                .maybeSingle();
            if (!exists) break;
            preorder_code = makePreorderCode();
        }

        // WhatsApp de BOA
        const boaPhone = "5491170961318"; // con 54 + 9
        const text =
            `Hola! Quiero comprar la GiftCard *${gift_name}*.\n` +
            `Preorder: ${preorder_code}\n` +
            (buyer_name ? `Nombre: ${buyer_name}\n` : "") +
            (buyer_phone ? `Tel: ${buyer_phone}\n` : "") +
            (buyer_email ? `Email: ${buyer_email}\n` : "") +
            (message ? `Mensaje: ${message}\n` : "");
        const whatsapp_link = `https://wa.me/${boaPhone}?text=${encodeURIComponent(
            text
        )}`;

        const { data, error } = await sb
            .from("giftcards_preorders")
            .insert([
                {
                    preorder_code,
                    gift_id,
                    gift_name,
                    gift_value: gift_value ?? null,
                    buyer_name: buyer_name ?? null,
                    buyer_phone: buyer_phone ?? null,
                    buyer_email: buyer_email ?? null,
                    message: message ?? null,
                    status: "pending",
                    whatsapp_link,
                    ip,
                },
            ])
            .select("id, preorder_code")
            .maybeSingle();

        if (error)
            return res
                .status(400)
                .json({ ok: false, error: "DB insert error", reason: error.message });

        return res.status(200).json({
            ok: true,
            data: { id: data!.id, preorder_code, whatsapp_link },
        });
    } catch (e: any) {
        return res
            .status(500)
            .json({ ok: false, error: "Unexpected", reason: e?.message });
    }
}
