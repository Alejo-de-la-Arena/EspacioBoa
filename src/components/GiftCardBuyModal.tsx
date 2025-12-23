// src/components/GiftCardBuyModal.tsx
"use client";
import * as React from "react";
import { X } from "lucide-react";

type Gift = { id: string; name: string; value: number };
type Props = {
    open: boolean;
    onClose: () => void;
    gift: Gift;
};

type PreorderPayload = {
    gift_id: string;
    gift_name: string;
    gift_value: number;
    buyer_name: string;
    buyer_phone: string;
    buyer_email: string;
    message?: string;

    // NUEVO
    is_gift: boolean;
    recipient_name?: string;
    recipient_phone?: string;
    gift_from_name?: string;
};

async function postJson(url: string, body: any) {
    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const json = await resp.json().catch(() => ({}));
    return { resp, json };
}

export default function GiftCardBuyModal({ open, onClose, gift }: Props) {
    const [name, setName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [message, setMessage] = React.useState("");

    // NUEVO: modo regalo
    const [isGift, setIsGift] = React.useState(false);
    const [recipientName, setRecipientName] = React.useState("");
    const [recipientPhone, setRecipientPhone] = React.useState("");
    const [giftFromName, setGiftFromName] = React.useState(""); // opcional

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Cerrar con ESC
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Lock scroll
    React.useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    function reset() {
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setIsGift(false);
        setRecipientName("");
        setRecipientPhone("");
        setGiftFromName("");
        setError(null);
        setSubmitting(false);
    }

    function validate(): string | null {
        if (!name.trim()) return "Ingresá tu nombre.";
        if (!phone.trim()) return "Ingresá tu teléfono.";
        const em = email.trim();
        if (!em || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return "Ingresá un email válido.";

        if (isGift) {
            if (!recipientName.trim()) return "Ingresá el nombre del destinatario.";
            if (!recipientPhone.trim()) return "Ingresá el teléfono del destinatario.";
        }
        return null;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        setError(null);
        setSubmitting(true);

        const payload: PreorderPayload = {
            gift_id: gift.id,
            gift_name: gift.name,
            gift_value: gift.value,
            buyer_name: name.trim(),
            buyer_phone: phone.trim(),
            buyer_email: email.trim(),
            message: message.trim(),

            // NUEVO
            is_gift: isGift,
            recipient_name: isGift ? recipientName.trim() : undefined,
            recipient_phone: isGift ? recipientPhone.trim() : undefined,
            gift_from_name: isGift ? (giftFromName.trim() || name.trim()) : undefined,
        };

        try {
            // 1) Intento con /api/giftcards/preorder
            let { resp, json } = await postJson("/api/giftcards/preorder", payload);

            // 2) Si no existe (404) o no viene ok, pruebo con /api/preorders (compat)
            if (resp.status === 404) {
                const alt = await postJson("/api/preorders", payload);
                resp = alt.resp;
                json = alt.json;
            }

            if (!resp.ok || !json?.ok) {
                const reason = json?.reason || json?.error || `HTTP ${resp.status}`;
                throw new Error(reason);
            }

            const link: string = json?.data?.whatsapp_link || json?.whatsapp_link || "";
            if (!link) throw new Error("No llegó el enlace de WhatsApp desde el servidor.");

            window.location.href = link;

            reset();
            onClose();
        } catch (err: any) {
            setError(err?.message || "No pude crear la orden. Probá nuevamente.");
        } finally {
            setSubmitting(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-4 py-8">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h3 className="text-lg font-semibold">Comprar Gift Card</h3>
                    <button
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
                        aria-label="Cerrar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={onSubmit} className="px-5 py-4">
                    <div className="mb-4 rounded-lg bg-emerald-50/70 p-3 text-sm">
                        <div className="font-semibold text-emerald-900">Gift seleccionada</div>
                        <div className="mt-0.5 text-emerald-800">
                            {gift.name} — <b>${Number(gift.value).toLocaleString("es-AR")}</b>
                        </div>
                    </div>

                    {/* NUEVO: toggle regalo */}
                    <div className="mb-4 rounded-lg border p-3">
                        <label className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold text-neutral-900">¿Es un regalo?</div>
                                <div className="text-xs text-neutral-500">
                                    Si activás esto, te vamos a pedir los datos del destinatario.
                                </div>
                            </div>

                            <input
                                type="checkbox"
                                checked={isGift}
                                onChange={(e) => setIsGift(e.target.checked)}
                                className="h-5 w-5 accent-boa-green"
                                aria-label="Es un regalo"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <label className="grid gap-1 text-sm">
                            <span>Nombre y apellido *</span>
                            <input
                                className="rounded-lg border px-3 py-2"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Alejo Pérez"
                            />
                        </label>

                        <label className="grid gap-1 text-sm">
                            <span>Teléfono (whatsapp) *</span>
                            <input
                                className="rounded-lg border px-3 py-2"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ej: 11 1234 5678"
                            />
                        </label>

                        <label className="grid gap-1 text-sm">
                            <span>Email *</span>
                            <input
                                className="rounded-lg border px-3 py-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@mail.com"
                            />
                        </label>

                        {/* NUEVO: campos destinatario */}
                        {isGift && (
                            <div className="rounded-lg bg-neutral-50 p-3 border">
                                <div className="text-sm font-semibold mb-2">Datos del destinatario</div>

                                <div className="grid grid-cols-1 gap-3">
                                    <label className="grid gap-1 text-sm">
                                        <span>Nombre del destinatario *</span>
                                        <input
                                            className="rounded-lg border px-3 py-2 bg-white"
                                            value={recipientName}
                                            onChange={(e) => setRecipientName(e.target.value)}
                                            placeholder="Ej: Juan Pérez"
                                        />
                                    </label>

                                    <label className="grid gap-1 text-sm">
                                        <span>Teléfono del destinatario (WhatsApp) *</span>
                                        <input
                                            className="rounded-lg border px-3 py-2 bg-white"
                                            value={recipientPhone}
                                            onChange={(e) => setRecipientPhone(e.target.value)}
                                            placeholder="Ej: 11 9876 5432"
                                        />
                                    </label>

                                    <label className="grid gap-1 text-sm">
                                        <span>De parte de (opcional)</span>
                                        <input
                                            className="rounded-lg border px-3 py-2 bg-white"
                                            value={giftFromName}
                                            onChange={(e) => setGiftFromName(e.target.value)}
                                            placeholder="Si lo dejás vacío, usamos tu nombre"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        <label className="grid gap-1 text-sm">
                            <span>Mensaje para el destinatario (opcional)</span>
                            <textarea
                                className="min-h-[84px] rounded-lg border px-3 py-2"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribí un mensaje que viajará con tu regalo"
                            />
                        </label>
                    </div>

                    {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-end gap-2 border-t pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="h-11 flex-1 sm:flex-none rounded-full border px-4 text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="h-11 flex-1 sm:flex-none rounded-full bg-boa-green px-5 text-sm font-bold text-white disabled:opacity-60"
                        >
                            {submitting ? "Creando orden…" : "Continuar por WhatsApp"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
