// pages/api/admin/events/upsert.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

type EventDb = {
    id?: string | null;
    slug?: string | null;
    title: string;
    description?: string | null;
    start_at?: string | null;
    end_at?: string | null;
    capacity?: number | null;
    price?: number | null;
    is_published?: boolean | null;
    category?: string | null;
    location?: string | null;
    hero_image?: string | null;
    gallery?: string[]; // guardamos como array
    featured?: boolean | null;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const started = Date.now();
    const request_id = (req.body?.request_id as string) || crypto.randomUUID();
    const log = (...args: any[]) => console.log(`[events.upsert ${request_id}]`, ...args);

    try {
        log("START", { method: req.method });

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

        log("check admin", userId);
        const { data: prof, error: profErr } = await sbService
            .from("profiles").select("is_admin").eq("id", userId).maybeSingle();
        if (profErr) {
            log("500 profiles error", profErr);
            return res.status(500).json({ error: profErr.message, request_id });
        }
        if (!prof?.is_admin) {
            log("403 not admin");
            return res.status(403).json({ error: "Forbidden", request_id });
        }

        const body = req.body || {};
        if (!body?.title) {
            log("400 missing title");
            return res.status(400).json({ error: "title is required", request_id });
        }

        // normalización
        const norm = {
            id: body.id ?? null,
            slug: body.slug ?? null,
            title: String(body.title).trim(),
            description: body.description ?? null,
            start_at: body.start_at ?? null,
            end_at: body.end_at ?? null,
            capacity: body.capacity ?? null,
            price: body.price ?? null,
            is_published: body.is_published ?? false,
            category: body.category ?? null,
            location: body.location ?? null,
            hero_image: body.hero_image ?? null,
            gallery: Array.isArray(body.gallery) ? body.gallery : [],
            featured: body.featured ?? false,
            created_by: userId,
        };

        let result;
        if (norm.id) {
            log("UPDATE", norm.id);
            const { data, error } = await sbService
                .from("events")
                .update({
                    slug: norm.slug, title: norm.title, description: norm.description,
                    start_at: norm.start_at, end_at: norm.end_at,
                    capacity: norm.capacity, price: norm.price,
                    is_published: norm.is_published, category: norm.category, location: norm.location,
                    hero_image: norm.hero_image, gallery: norm.gallery, featured: norm.featured,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", norm.id)
                .select("*")
                .maybeSingle();

            if (error) { log("400 update error", error); return res.status(400).json({ error: error.message, request_id }); }
            result = data;
        } else {
            log("INSERT");
            const { data, error } = await sbService
                .from("events")
                .insert({
                    slug: norm.slug, title: norm.title, description: norm.description,
                    start_at: norm.start_at, end_at: norm.end_at,
                    capacity: norm.capacity, price: norm.price,
                    is_published: norm.is_published, category: norm.category, location: norm.location,
                    hero_image: norm.hero_image, gallery: norm.gallery, featured: norm.featured,
                    created_by: norm.created_by,
                })
                .select("*")
                .maybeSingle();

            if (error) { log("400 insert error", error); return res.status(400).json({ error: error.message, request_id }); }
            result = data;
        }

        log("OK", { ms: Date.now() - started });
        return res.status(200).json({ data: result, request_id });
    } catch (e: any) {
        console.error(`[events.upsert ${request_id}] FATAL`, e);
        return res.status(500).json({ error: e?.message || "Unexpected error", request_id });
    }
}
