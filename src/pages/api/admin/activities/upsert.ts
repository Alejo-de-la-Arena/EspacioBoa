// pages/api/admin/activities/upsert.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-side

const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const started = Date.now();
    const request_id = (req.body?.request_id as string) || crypto.randomUUID();
    const log = (...a: any[]) => console.log(`[activities.upsert ${request_id}]`, ...a);

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

        // Admin
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

        // Normalizar payload
        const p = req.body || {};
        if (!p?.title) {
            log("400 missing title");
            return res.status(400).json({ error: "title is required", request_id });
        }

        // Recurrencia (validación mínima)
        const is_recurring = !!p.is_recurring;
        const recurrence =
            p.recurrence && typeof p.recurrence === "object" ? p.recurrence : null;

        if (is_recurring) {
            const by = Array.isArray(recurrence?.byWeekday) ? recurrence.byWeekday : [];
            if (!by.length) {
                return res.status(400).json({
                    error: "recurrence.byWeekday is required when is_recurring=true",
                    request_id,
                });
            }
        }


        const row = {
            slug: p.slug ?? null,
            title: String(p.title).trim(),
            description: p.description ?? null,
            start_at: p.start_at ?? null,
            end_at: p.end_at ?? null,
            capacity: p.capacity ?? null,
            price: p.price ?? null,
            is_published: !!p.is_published,
            category: p.category ?? null,
            location: p.location ?? null,
            hero_image: p.hero_image ?? null,
            gallery: Array.isArray(p.gallery) ? p.gallery : [],
            featured: !!p.featured,
            is_recurring: !!p.is_recurring,
            recurrence: p.recurrence ?? null,
            created_by: userId,
        };

        // Upsert
        let result: any;
        if (p.id) {
            log("UPDATE", p.id);
            const { data, error } = await sbService
                .from("activities")
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
                .from("activities")
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
        console.error(`[activities.upsert ${request_id}] FATAL`, e);
        return res.status(500).json({ error: e?.message ?? "server error", request_id });
    }
}
