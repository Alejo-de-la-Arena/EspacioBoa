// pages/api/admin/giftcards/upsert.ts
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

    const started = Date.now();
    const request_id = (req.body?.request_id as string) || crypto.randomUUID();
    const log = (...a: any[]) => console.log(`[giftcards.upsert ${request_id}]`, ...a);

    try {
        log("START", { method: req.method });

        // Auth
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token) {
            log("401 missing token");
            return res.status(401).json({ error: "Missing bearer token", request_id });
        }

        log("auth.getUser");
        const { data: authData, error: authErr } = await sbAnon.auth.getUser(token);
        if (authErr || !authData?.user) {
            log("401 invalid token", authErr);
            return res.status(401).json({ error: "Invalid or expired token", request_id });
        }
        const userId = authData.user.id;

        // Admin check
        log("check admin", userId);
        const { data: prof, error: profErr } = await sbService
            .from("profiles")
            .select("is_admin")
            .eq("id", userId)
            .maybeSingle();

        if (profErr) {
            log("500 profiles error", profErr);
            return res.status(500).json({ error: profErr.message, request_id });
        }
        if (!prof?.is_admin) {
            log("403 not admin");
            return res.status(403).json({ error: "Forbidden", request_id });
        }

        const p = req.body || {};
        if (!p?.name) {
            log("400 missing name");
            return res.status(400).json({ error: "name is required", request_id });
        }

        const row = {
            name: String(p.name).trim(),
            description: p.description ?? null,
            value: p.value ?? 0,
            benefits: Array.isArray(p.benefits) ? p.benefits : [],
            image_url: p.image_url ?? null,
            is_active: p.is_active ?? true,
            created_by: userId,
        };

        let result: any;
        if (p.id) {
            log("UPDATE", p.id);
            const { data, error } = await sbService
                .from("giftcards")
                .update({ ...row, updated_at: new Date().toISOString() })
                .eq("id", p.id)
                .select("*")
                .maybeSingle();

            if (error) {
                log("400 update error", error);
                return res.status(400).json({ error: error.message, request_id });
            }
            result = data;
        } else {
            log("INSERT");
            const { data, error } = await sbService
                .from("giftcards")
                .insert(row)
                .select("*")
                .maybeSingle();

            if (error) {
                log("400 insert error", error);
                return res.status(400).json({ error: error.message, request_id });
            }
            result = data;
        }

        log("OK", { ms: Date.now() - started });
        return res.status(200).json({ data: result, request_id });
    } catch (e: any) {
        console.error(`[giftcards.upsert ${request_id}] FATAL`, e);
        return res.status(500).json({ error: e?.message || "Unexpected error", request_id });
    }
}
