// pages/api/admin/events/upsert.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
        if (!token) return res.status(401).json({ error: "missing token" });

        const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
        if (userErr || !userData?.user) return res.status(401).json({ error: "invalid token" });

        const userId = userData.user.id;

        const { data: prof, error: profErr } = await supabaseAdmin
            .from("profiles").select("is_admin").eq("id", userId).maybeSingle();
        if (profErr) return res.status(500).json({ error: profErr.message });
        if (!prof?.is_admin) return res.status(403).json({ error: "not authorized" });

        const p = req.body || {};
        const row = {
            slug: p.slug ?? null,
            title: p.title,
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
            created_by: userId,
        };

        let resp;
        if (p.id) {
            resp = await supabaseAdmin.from("events")
                .update(row).eq("id", p.id).select().single();
        } else {
            resp = await supabaseAdmin.from("events")
                .insert(row).select().single();
        }
        if (resp.error) return res.status(400).json({ error: resp.error.message });

        return res.status(200).json({ data: resp.data });
    } catch (e: any) {
        return res.status(500).json({ error: e?.message ?? "server error" });
    }
}
