import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    const { data: authData, error: authErr } = await sbAnon.auth.getUser(token);
    if (authErr || !authData?.user) return res.status(401).json({ error: "Invalid or expired token" });

    const { data: prof, error: profErr } = await sbService
        .from("profiles")
        .select("is_admin")
        .eq("id", authData.user.id)
        .maybeSingle();
    if (profErr) return res.status(500).json({ error: profErr.message });
    if (!prof?.is_admin) return res.status(403).json({ error: "Forbidden" });

    const { data, error } = await sbService
        .from("preorders")
        .select("*")
        .in("status", ["pending", "paid"])
        .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ data });
}
