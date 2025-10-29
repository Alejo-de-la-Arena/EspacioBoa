import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const ContactSchema = z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(160),
    phone: z.string().max(60).optional().nullable(),
    subject: z.string().min(2).max(120),
    message: z.string().min(10).max(5000),
    source: z.string().optional(),
});

function escapeHtml(s: string) {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// rate limit en memoria (simple)
const hits = new Map<string, number[]>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const parsed = ContactSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Datos inválidos", issues: parsed.error.flatten() });
    }
    const data = parsed.data;

    // rate limit por IP
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowMs = 60_000;
    const maxReq = 5;
    const arr = hits.get(ip) || [];
    const recent = arr.filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (recent.length > maxReq) {
        return res.status(429).json({ message: "Demasiadas solicitudes. Probá en un minuto." });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO = process.env.CONTACT_TO || "espacio.boa@gmail.com";
    const FROM = process.env.CONTACT_FROM || "no-reply@your-domain.com";

    const bodyHtml = `
    <h2>Nuevo mensaje desde Contacto</h2>
    <p><b>Nombre:</b> ${escapeHtml(data.name)}</p>
    <p><b>Email:</b> ${escapeHtml(data.email)}</p>
    <p><b>Teléfono:</b> ${escapeHtml(data.phone || "")}</p>
    <p><b>Asunto:</b> ${escapeHtml(data.subject)}</p>
    <p><b>Mensaje:</b></p>
    <pre style="white-space:pre-wrap;font-family:system-ui,Segoe UI,Arial,sans-serif">${escapeHtml(data.message)}</pre>
    <hr/>
    <p style="color:#777"><small>Fuente: ${escapeHtml(data.source || "contact-page")}</small></p>
  `;

    if (RESEND_API_KEY) {
        const resp = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: FROM,
                to: [CONTACT_TO],
                subject: `Contacto BOA: ${data.subject} – ${data.name}`,
                html: bodyHtml,
            }),
        });

        if (!resp.ok) {
            const txt = await resp.text();
            console.error("Resend error:", txt);
            return res.status(502).json({ message: "No se pudo enviar el email en este momento." });
        }
    } else {
        console.log("[CONTACT] Nuevo mensaje:", data);
    }

    return res.status(200).json({ ok: true });
}
