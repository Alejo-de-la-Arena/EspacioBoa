export function mediaUrl(path: string, bucket = "boa-media") {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
