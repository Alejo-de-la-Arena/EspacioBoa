// pages/api/admin/giftcards/issue.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { makeGiftCode } from "@/lib/gcCode";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

const DEFAULT_PIN = process.env.BOA_REDEEM_PIN || "8426";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    // Autenticación (solo admins)
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    const { data: authData } = await sbAnon.auth.getUser(token);
    if (!authData?.user) return res.status(401).json({ error: "Invalid or expired token" });

    const { data: prof } = await sbService
        .from("profiles")
        .select("is_admin")
        .eq("id", authData.user.id)
        .maybeSingle();

    if (!prof?.is_admin) return res.status(403).json({ error: "Forbidden" });

    const {
        preorder_id,
        template_gift_id,
        gift_name,
        gift_value,
        recipient_name,
        recipient_email,
        recipient_phone,
        expires_at,
    } = req.body || {};

    if (!preorder_id || !template_gift_id || !gift_name) {
        return res.status(400).json({
            error: "preorder_id, template_gift_id y gift_name son requeridos",
        });
    }

    // 🔸 Inactivar emisiones previas activas del mismo preorder
    await sbService
        .from("giftcards_issued")
        .update({ status: "cancelled" })
        .eq("preorder_id", preorder_id)
        .eq("status", "active");

    // 🔸 Generar código único
    const code = makeGiftCode(8); // ej: BOA-ABCD2345

    // 🔸 Crear emisión con PIN
    const { data, error } = await sbService
        .from("giftcards_issued")
        .insert([
            {
                preorder_id,
                template_gift_id,
                code,
                amount: gift_value ?? null,
                recipient_name: recipient_name ?? null,
                recipient_email: recipient_email ?? null,
                recipient_phone: recipient_phone ?? null,
                expires_at: expires_at ?? null,
                status: "active",
                pin: DEFAULT_PIN, // 👈 pin configurable desde .env
            },
        ])
        .select("*")
        .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });

    // 🔸 URL pública de verificación
    const protocol =
        (req.headers["x-forwarded-proto"] as string) || "https";
    const host = req.headers.host || "boa.com";
    const verifyUrl = `${protocol}://${host}/gc/${encodeURIComponent(code)}`;

    return res.status(200).json({
        ok: true,
        data: { ...data, verifyUrl },
    });
}
