import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.BUCKET_NAME || "boa-media";

// Carpeta local donde están tus imágenes ya optimizadas:
const ROOT = path.resolve("fotos-optim"); // ajústalo si la carpeta está en otro lado

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("Faltan envs: NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

const VALID_EXT = new Set([".webp", ".avif", ".jpg", ".jpeg", ".png"]);

function* walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) yield* walk(p);
        else yield p;
    }
}

function contentTypeFor(ext) {
    if (ext === ".webp") return "image/webp";
    if (ext === ".avif") return "image/avif";
    if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
    if (ext === ".png") return "image/png";
    return "application/octet-stream";
}

async function main() {
    let count = 0, ok = 0, fail = 0;
    for (const filePath of walk(ROOT)) {
        const ext = path.extname(filePath).toLowerCase();
        if (!VALID_EXT.has(ext)) continue;

        // Clave en el bucket respetando estructura de carpetas (400/800/1200/hero/…)
        const key = path.relative(ROOT, filePath).replaceAll("\\", "/");
        const bin = fs.readFileSync(filePath);
        const contentType = contentTypeFor(ext);

        count++;
        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(key, bin, {
                upsert: true,
                cacheControl: "31536000",
                contentType,
            });

        if (error) {
            fail++;
            console.error(`✗ ${key}: ${error.message}`);
        } else {
            ok++;
            if (ok % 25 === 0) console.log(`✓ ${ok}/${count} subidas…`);
        }
    }
    console.log(`\nDone. OK: ${ok}  Fail: ${fail}  Total: ${count}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
