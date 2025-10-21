import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = path.resolve("fotos-optim/keep"); // originales
const OUT_DIR = path.resolve("fotos-optim/hero");  // salida hero/1920 y hero/2560
const QUALITY = 88;

// usa: node scripts/build-hero.mjs hero-portada.jpg hero-otra.webp ...
const inputs = process.argv.slice(2);
if (inputs.length === 0) {
    console.log("Uso: node scripts/build-hero.mjs <archivo1> <archivo2> ...");
    console.log("Ej:  node scripts/build-hero.mjs hero-portada.jpg");
    process.exit(1);
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function outName(file) {
    return file.replace(/\.(jpe?g|png|webp|avif)$/i, ".webp");
}

async function buildOne(name) {
    const inputPath = path.join(SRC_DIR, name);
    if (!fs.existsSync(inputPath)) {
        console.error(`No existe: ${inputPath}`);
        return;
    }
    const out1920 = path.join(OUT_DIR, "1920");
    const out2560 = path.join(OUT_DIR, "2560");
    ensureDir(out1920); ensureDir(out2560);

    const base = outName(name);

    await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(path.join(out1920, base));

    await sharp(inputPath)
        .resize({ width: 2560, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(path.join(out2560, base));

    console.log(`✔ Hero generado: ${base} (1920 y 2560)`);
}

for (const f of inputs) await buildOne(f);
console.log("Listo ✅");
