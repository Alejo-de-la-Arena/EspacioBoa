// pages/api/admin/preorders/list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");

    try {
        // ---- Auth admin igual que en tus otros endpoints ----
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

        // ---- 1) Traigo preorders ----
        const { data: preorders, error: poErr } = await sbService
            .from("preorders")
            .select("*")
            .order("created_at", { ascending: false });

        if (poErr) return res.status(400).json({ error: poErr.message });

        const ids = (preorders ?? []).map((p) => p.id);
        if (!ids.length) return res.status(200).json({ ok: true, data: [] });

        // ---- 2) Traigo la ÚLTIMA emisión por preorder ----
        // Nota: supabase no soporta "distinct on" directo, así que traigo todas ordenadas y me quedo con la última en código
        const { data: issuedRows, error: giErr } = await sbService
            .from("giftcards_issued")
            .select("id, preorder_id, status, redeemed_at, created_at")
            .in("preorder_id", ids)
            .order("created_at", { ascending: false });

        if (giErr) return res.status(400).json({ error: giErr.message });

        const lastByPreorder: Record<string, any> = {};
        (issuedRows || []).forEach((r) => {
            if (!lastByPreorder[r.preorder_id]) lastByPreorder[r.preorder_id] = r;
        });

        // ---- 3) Armo status efectivo ----
        const out = (preorders || []).map((p) => {
            const last = lastByPreorder[p.id];
            let computed: "used" | "active" | "paid" | "pending" | "sent" | "cancelled" = p.status;
            if (last?.status === "redeemed" || p.status === "used") computed = "used";
            else if (last?.status === "active") computed = "active";

            return {
                ...p,
                computed_status: computed,
                last_issued_status: last?.status ?? null,
                last_redeemed_at: last?.redeemed_at ?? null,
            };
        });

        return res.status(200).json({ ok: true, data: out });
    } catch (e: any) {
        console.error("[preorders/list] fatal", e);
        return res.status(500).json({ error: e?.message || "Unexpected" });
    }
}
