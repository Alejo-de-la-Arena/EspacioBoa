// pages/api/newsletter.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email } = req.body || {};
    const raw = (email || "").toString().trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(raw)) {
        return res.status(400).json({ message: "Email inválido." });
    }

    const from = process.env.EMAIL_FROM;
    if (!from || !process.env.RESEND_API_KEY) {
        console.error("Faltan EMAIL_FROM o RESEND_API_KEY");
        return res.status(500).json({ message: "Config de email incompleta." });
    }

    try {
        // 1) Mail de bienvenida al usuario
        await resend.emails.send({
            from,
            to: raw,
            replyTo: process.env.EMAIL_REPLY_TO || undefined,
            subject: "¡Bienvenid@ al newsletter de Espacio BOA!",
            html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5;">
            <h1>Gracias por sumarte a BOA ✨</h1>
            <p>Te vamos a escribir sólo cuando tengamos algo rico que compartir: 
            recetas, ideas de bienestar y agenda de talleres.</p>
            <p style="margin-top:16px;">Si alguna vez ya no querés recibir nuestras ideas, 
            podés responder a este mail y te damos de baja.</p>
            <p style="margin-top:24px;">Abrazo,</p>
            <p>Equipo Espacio BOA</p>
        </div>
        `,
        });

        // 2) Mail interno para que BOA se entere (a tu Gmail)
        const contactTo = process.env.EMAIL_CONTACT_TO;
        if (contactTo) {
            await resend.emails.send({
                from,
                to: contactTo,
                subject: "Nueva suscripción al newsletter BOA",
                text: `Se suscribió: ${raw}`,
            });
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("Newsletter error", error);
        return res
            .status(500)
            .json({ message: "No pudimos suscribirte. Probá de nuevo en un ratito." });
    }
}
