import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    const { data: authData } = await sbAnon.auth.getUser(token);
    if (!authData?.user) return res.status(401).json({ error: "Invalid or expired token" });

    const { data: prof } = await sbService.from("profiles").select("is_admin").eq("id", authData.user.id).maybeSingle();
    if (!prof?.is_admin) return res.status(403).json({ error: "Forbidden" });

    const preorder_id = String(req.body?.preorder_id || "");
    if (!preorder_id) return res.status(400).json({ error: "preorder_id required" });

    const { error } = await sbService.from("preorders").update({ status: "paid" }).eq("id", preorder_id);
    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ ok: true });
}
