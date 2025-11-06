// app/api/giftcards/redeem/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
    try {
        const { code: rawCode, pin } = (await req.json()) as { code?: string; pin?: string };

        const code = String(rawCode || "").toUpperCase().trim();
        const pinStr = String(pin || "").trim();
        if (!code || !pinStr) {
            return NextResponse.json({ ok: false, error: "Faltan parámetros 'code' y/o 'pin'." }, { status: 400 });
        }

        // 1) Buscar emisión por código
        let issued: any = null; let qErr: any = null;
        {
            const { data, error } = await supabaseAdmin
                .from("giftcards_issued")
                .select("id, code, status, pin, recipient_name, template_gift_id, redeemed_at")
                .eq("code", code)
                .maybeSingle();
            issued = data; qErr = error;
        }
        if (!issued && !qErr) {
            const { data, error } = await supabaseAdmin
                .from("giftcards_issued")
                .select("id, code, status, pin, recipient_name, template_gift_id, redeemed_at")
                .ilike("code", code)
                .maybeSingle();
            issued = data; qErr = error;
        }

        if (qErr) return NextResponse.json({ ok: false, error: "DB error", reason: qErr.message }, { status: 500 });
        if (!issued) return NextResponse.json({ ok: false, error: "Código inexistente." }, { status: 404 });

        // 2) Estado
        if (issued.status === "redeemed") {
            return NextResponse.json({
                ok: false,
                error: "La giftcard ya fue utilizada.",
                reason: "already_redeemed",
                data: { code: issued.code, redeemed_at: issued.redeemed_at, buyer_name: issued.recipient_name }
            }, { status: 409 });
        }
        if (issued.status !== "active") {
            return NextResponse.json({ ok: false, error: "La giftcard no está activa para canje.", reason: "not_active" }, { status: 409 });
        }

        // 3) PIN
        if (String(issued.pin || "").trim() !== pinStr) {
            return NextResponse.json({ ok: false, error: "PIN incorrecto.", reason: "invalid_pin" }, { status: 401 });
        }

        // 4) Nombre del gift (opcional)
        let gift_name = "";
        if (issued.template_gift_id) {
            const { data: gift } = await supabaseAdmin
                .from("giftcards")
                .select("name")
                .eq("id", issued.template_gift_id)
                .maybeSingle();
            gift_name = gift?.name || "";
        }

        // 5) Marcar como canjeada → usar redeemed_at (existe en tu schema)
        const nowIso = new Date().toISOString();
        const { error: uErr } = await supabaseAdmin
            .from("giftcards_issued")
            .update({ status: "redeemed", redeemed_at: nowIso })
            .eq("id", issued.id);

        if (uErr) {
            return NextResponse.json({ ok: false, error: "DB error", reason: uErr.message }, { status: 500 });
        }

        return NextResponse.json({
            ok: true,
            data: { code: issued.code, gift_name, buyer_name: issued.recipient_name || "" }
        });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: "Unexpected", reason: e?.message }, { status: 500 });
    }
}
