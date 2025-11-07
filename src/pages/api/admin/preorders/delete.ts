import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    // auth admin
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: "Missing bearer token" });
    const { data: a } = await sbAnon.auth.getUser(token);
    if (!a?.user) return res.status(401).json({ ok: false, error: "Invalid or expired token" });
    const { data: prof } = await sbService.from("profiles").select("is_admin").eq("id", a.user.id).maybeSingle();
    if (!prof?.is_admin) return res.status(403).json({ ok: false, error: "Forbidden" });

    const { preorder_id } = req.body || {};
    if (!preorder_id) return res.status(400).json({ ok: false, error: "preorder_id requerido" });

    // 1) cancelar cualquier código activo ligado a la preorder
    await sbService
        .from("giftcards_issued")
        .update({ status: "cancelled" })
        .eq("preorder_id", preorder_id)
        .eq("status", "active");

    // 2) eliminar (o soft-delete) la preorden
    const { error } = await sbService.from("preorders").delete().eq("id", preorder_id);
    if (error) return res.status(400).json({ ok: false, error: error.message });

    return res.status(200).json({ ok: true });
}
