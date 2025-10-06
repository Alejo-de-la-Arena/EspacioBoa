// pages/api/admin/giftcards/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "6mb", // PNG base64
        },
    },
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sbAnon = createClient(url, anon);
const sbService = createClient(url, service);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const request_id = (req.body?.request_id as string) || crypto.randomUUID();
    const log = (...a: any[]) => console.log(`[giftcards.upload ${request_id}]`, ...a);

    try {
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ error: "Missing bearer token", request_id });

        // validar usuario + admin (igual que en upsert)
        const { data: authData, error: authErr } = await sbAnon.auth.getUser(token);
        if (authErr || !authData?.user) {
            return res.status(401).json({ error: "Invalid or expired token", request_id });
        }
        const userId = authData.user.id;
        const { data: prof, error: profErr } = await sbService
            .from("profiles")
            .select("is_admin")
            .eq("id", userId)
            .maybeSingle();
        if (profErr) return res.status(500).json({ error: profErr.message, request_id });
        if (!prof?.is_admin) return res.status(403).json({ error: "Forbidden", request_id });

        // datos
        const dataUrl = req.body?.dataUrl as string | undefined;
        const giftcardId = req.body?.giftcardId as string | undefined;
        if (!dataUrl || !dataUrl.startsWith("data:image/")) {
            return res.status(400).json({ error: "Invalid dataUrl", request_id });
        }
        if (!giftcardId) {
            return res.status(400).json({ error: "giftcardId is required", request_id });
        }

        // pasar base64 a buffer
        const base64 = dataUrl.split(",")[1] || "";
        const buf = Buffer.from(base64, "base64");

        const filePath = `gc-${giftcardId}-${Date.now()}.png`;

        // subir con service-role (sin RLS)
        const { error: upErr } = await sbService.storage
            .from("giftcards")
            .upload(filePath, buf, { contentType: "image/png", upsert: true });
        if (upErr) return res.status(400).json({ error: upErr.message, request_id });

        const { data: pub } = sbService.storage.from("giftcards").getPublicUrl(filePath);
        const publicUrl = pub.publicUrl;

        return res.status(200).json({ url: publicUrl, request_id });
    } catch (e: any) {
        console.error(`[giftcards.upload ${request_id}] FATAL`, e);
        return res.status(500).json({ error: e?.message || "Unexpected error", request_id });
    }
}
