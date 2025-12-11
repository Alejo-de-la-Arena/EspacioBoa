// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, email, phone, subject, message, source } = req.body || {};

    const trimmedName = (name || "").toString().trim();
    const trimmedEmail = (email || "").toString().trim();
    const trimmedSubject = (subject || "").toString().trim();
    const trimmedMessage = (message || "").toString().trim();
    const trimmedPhone = (phone || "").toString().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
        !trimmedName ||
        !trimmedSubject ||
        !trimmedMessage ||
        !emailRegex.test(trimmedEmail)
    ) {
        return res.status(400).json({ message: "Datos incompletos o inválidos." });
    }

    const from = process.env.EMAIL_FROM;
    const to = process.env.EMAIL_CONTACT_TO;

    if (!from || !to) {
        console.error("Faltan EMAIL_FROM o EMAIL_CONTACT_TO");
        return res.status(500).json({ message: "Config de email incompleta." });
    }

    try {
        // 1) Mail hacia BOA (vos / cliente)
        await resend.emails.send({
            from,
            to,
            replyTo: trimmedEmail,
            subject: `[Contacto web BOA] ${trimmedSubject}`,
            text: [
                `Nombre: ${trimmedName}`,
                `Email: ${trimmedEmail}`,
                trimmedPhone ? `Teléfono: ${trimmedPhone}` : "",
                "",
                `Mensaje:`,
                trimmedMessage,
                "",
                source ? `Fuente: ${source}` : "",
            ]
                .filter(Boolean)
                .join("\n"),
        });

        // 2) Mail de confirmación al usuario (opcional)
        await resend.emails.send({
            from,
            to: trimmedEmail,
            replyTo: process.env.EMAIL_REPLY_TO || undefined,
            subject: "Recibimos tu mensaje en Espacio BOA",
            text: `Hola ${trimmedName},\n\nGracias por escribirnos. Recibimos tu mensaje sobre "${trimmedSubject}" y te vamos a responder dentro de las próximas 24 horas.\n\nAbrazo,\nEquipo Espacio BOA`,
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("Contact error", error);
        return res
            .status(500)
            .json({ message: "No pudimos enviar el mensaje. Probá nuevamente." });
    }
}
