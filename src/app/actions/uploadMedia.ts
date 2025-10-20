"use server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type UploadOpts = {
    key: string;                 // ej: "800/cafe-latte.webp"
    bucket?: string;             // default: "boa-media"
    contentType?: string;        // "image/webp" | "image/avif" | etc.
    upsert?: boolean;            // default: true
};

export async function uploadMediaAction(file: File | Blob, opts: UploadOpts) {
    const { key, bucket = "boa-media", contentType = "image/webp", upsert = true } = opts;

    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(key, file, {
            cacheControl: "31536000", // 1 año
            upsert,
            contentType,
        });

    if (error) throw error;
    return data;
}
