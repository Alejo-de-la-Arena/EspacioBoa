// src/lib/gcPreorderClient.ts
export type PreorderPayload = {
    gift_id: string;
    gift_name: string;
    gift_value: number;
    buyer_name: string;
    buyer_phone: string;
    buyer_email: string;
    message?: string;
};

export async function createGiftcardPreorder(p: PreorderPayload) {
    const resp = await fetch("/api/giftcards/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok || !json?.ok) {
        const msg =
            json?.reason || json?.error || `HTTP ${resp.status} al crear preorder`;
        throw new Error(msg);
    }
    return json.data as { id: string; preorder_code: string; whatsapp_link: string };
}
