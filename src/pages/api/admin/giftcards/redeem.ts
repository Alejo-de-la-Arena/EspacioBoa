// pages/api/giftcards/redeem.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const config = { api: { bodyParser: true } };

const DEFAULT_PIN = process.env.BOA_REDEEM_PIN || "8426";

type Ok = { ok: true; data: { code: string; gift_name: string; buyer_name: string } };
type Err = { ok: false; error: string; reason?: string; data?: any };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Ok | Err>) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST")
        return res.status(405).json({ ok: false, error: "Method not allowed" });

    try {
        const { code: rawCode, pin } = (req.body || {}) as { code?: string; pin?: string };
        const code = String(rawCode || "").toUpperCase().trim();
        const pinStr = String(pin || "").trim();
        if (!code || !pinStr)
            return res
                .status(400)
                .json({ ok: false, error: "Faltan parámetros 'code' y/o 'pin'." });

        const fwd = (req.headers["x-forwarded-for"] as string) || "";
        const used_ip =
            fwd.split(",").map((s) => s.trim())[0] ||
            (req.socket as any)?.remoteAddress ||
            "";

        // === Buscar emisión (exacto o ilike)
        let issued: any = null;
        let qErr: any = null;
        {
            const { data, error } = await supabaseAdmin
                .from("giftcards_issued")
                .select("id, code, status, pin, recipient_name, template_gift_id, used_at")
                .eq("code", code)
                .maybeSingle();
            issued = data;
            qErr = error;
        }
        if (!issued && !qErr) {
            const { data, error } = await supabaseAdmin
                .from("giftcards_issued")
                .select("id, code, status, pin, recipient_name, template_gift_id, used_at")
                .ilike("code", code)
                .maybeSingle();
            issued = data;
            qErr = error;
        }
        if (qErr)
            return res.status(500).json({ ok: false, error: "DB error", reason: qErr.message });
        if (!issued)
            return res.status(404).json({ ok: false, error: "Código inexistente." });

        if (issued.status === "redeemed") {
            return res.status(409).json({
                ok: false,
                error: "La giftcard ya fue utilizada.",
                reason: "already_redeemed",
                data: { code: issued.code, used_at: issued.used_at, buyer_name: issued.recipient_name },
            });
        }

        if (issued.status !== "active") {
            return res.status(409).json({
                ok: false,
                error: "La giftcard no está activa para canje.",
                reason: "not_active",
                data: { status: issued.status },
            });
        }

        // === PIN
        const expectedPin = String(issued.pin ?? DEFAULT_PIN).trim();
        if (expectedPin !== pinStr) {
            return res.status(401).json({ ok: false, error: "PIN incorrecto.", reason: "invalid_pin" });
        }

        // === Nombre del gift (opcional)
        let gift_name = "";
        if (issued.template_gift_id) {
            const { data: gift } = await supabaseAdmin
                .from("giftcards")
                .select("name")
                .eq("id", issued.template_gift_id)
                .maybeSingle();
            gift_name = gift?.name || "";
        }

        // === Marcar como canjeada
        const nowIso = new Date().toISOString();
        const { error: uErr } = await supabaseAdmin
            .from("giftcards_issued")
            .update({ status: "redeemed", used_at: nowIso, used_ip })
            .eq("id", issued.id);

        if (uErr)
            return res.status(500).json({
                ok: false,
                error: "No se pudo marcar como utilizada.",
                reason: uErr.message,
            });

        return res
            .status(200)
            .json({ ok: true, data: { code: issued.code, gift_name, buyer_name: issued.recipient_name || "" } });
    } catch (e: any) {
        return res.status(500).json({ ok: false, error: "Unexpected", reason: e?.message });
    }
}
