// pages/api/admin/preorders/list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

type ComputedStatus = "used" | "active" | "paid" | "pending" | "sent" | "cancelled";

function getBaseUrl(req: NextApiRequest) {
    const proto =
        (req.headers["x-forwarded-proto"] as string) ||
        (process.env.NODE_ENV === "development" ? "http" : "https");
    const host = req.headers.host || "boa.com";
    return `${proto}://${host}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // ---- Auth admin ----
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ error: "Missing bearer token" });

        const { data: authData, error: authErr } = await sbAnon.auth.getUser(token);
        if (authErr || !authData?.user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const { data: prof, error: profErr } = await sbService
            .from("profiles")
            .select("is_admin")
            .eq("id", authData.user.id)
            .maybeSingle();

        if (profErr) return res.status(500).json({ error: profErr.message });
        if (!prof?.is_admin) return res.status(403).json({ error: "Forbidden" });

        // ---- 1) Preorders (incluye campos regalo) ----
        const { data: preorders, error: poErr } = await sbService
            .from("preorders")
            .select(
                `
        id,
        preorder_code,
        gift_id,
        gift_name,
        gift_value,
        buyer_name,
        buyer_phone,
        buyer_email,
        message,
        status,
        created_at,
        is_gift,
        recipient_name,
        recipient_phone,
        gift_from_name
      `
            )
            .order("created_at", { ascending: false });

        if (poErr) return res.status(400).json({ error: poErr.message });

        const ids = (preorders ?? []).map((p: any) => p.id);
        if (!ids.length) return res.status(200).json({ ok: true, data: [] });

        // ---- 2) Última emisión por preorder (NO existe verify_url en DB) ----
        const { data: issuedRows, error: giErr } = await sbService
            .from("giftcards_issued")
            .select("id, preorder_id, code, status, redeemed_at, created_at")
            .in("preorder_id", ids)
            .order("created_at", { ascending: false });

        if (giErr) return res.status(400).json({ error: giErr.message });

        const lastByPreorder: Record<string, any> = {};
        (issuedRows || []).forEach((r: any) => {
            if (!lastByPreorder[r.preorder_id]) lastByPreorder[r.preorder_id] = r;
        });

        const baseUrl = getBaseUrl(req);

        // ---- 3) computed_status + debug útil ----
        const out = (preorders || []).map((p: any) => {
            const last = lastByPreorder[p.id];

            let computed: ComputedStatus = p.status as ComputedStatus;

            // prioridad: si está canjeada → used
            if (p.status === "used" || last?.status === "redeemed") {
                computed = "used";
            }
            // si hay un código activo emitido → active (aunque el preorder esté "paid")
            else if (last?.status === "active") {
                computed = "active";
            } else {
                computed = p.status as ComputedStatus;
            }

            // link de verificación calculado (sin columna en DB)
            const verifyUrl = last?.code ? `${baseUrl}/gc/${encodeURIComponent(last.code)}` : null;

            return {
                ...p,
                computed_status: computed,

                // debug/soporte (opcionales)
                last_issued_status: last?.status ?? null,
                last_redeemed_at: last?.redeemed_at ?? null,
                last_issued_id: last?.id ?? null,
                last_issued_code: last?.code ?? null,
                last_verify_url: verifyUrl,
            };
        });

        return res.status(200).json({ ok: true, data: out });
    } catch (e: any) {
        console.error("[preorders/list] fatal", e);
        return res.status(500).json({ error: e?.message || "Unexpected" });
    }
}
