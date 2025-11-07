// app/api/giftcards/redeem/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
    const tag = "[redeem]";
    try {
        const body = await req.json();
        const rawCode = body?.code as string | undefined;
        const pin = body?.pin as string | undefined;

        const code = String(rawCode || "").toUpperCase().trim();
        const pinStr = String(pin || "").trim();

        console.log(tag, "payload", { code, pin: pinStr ? "***" : "(empty)" });

        if (!code || !pinStr) {
            console.log(tag, "missing params");
            return NextResponse.json({ ok: false, error: "Faltan parámetros 'code' y/o 'pin'." }, { status: 400 });
        }

        // 1) Buscar emisión por código (incluye preorder_id)
        let issued: any = null; let qErr: any = null;
        {
            const r1 = await supabaseAdmin
                .from("giftcards_issued")
                .select("id, code, status, pin, recipient_name, template_gift_id, redeemed_at, preorder_id")
                .eq("code", code)
                .maybeSingle();
            issued = r1.data; qErr = r1.error;
            console.log(tag, "query #1", { found: !!r1.data, error: r1.error?.message });

            if (!issued && !qErr) {
                const r2 = await supabaseAdmin
                    .from("giftcards_issued")
                    .select("id, code, status, pin, recipient_name, template_gift_id, redeemed_at, preorder_id")
                    .ilike("code", code)
                    .maybeSingle();
                issued = r2.data; qErr = r2.error;
                console.log(tag, "query #2 (ilike)", { found: !!r2.data, error: r2.error?.message });
            }
        }

        if (qErr) {
            console.error(tag, "DB error on select", qErr);
            return NextResponse.json({ ok: false, error: "DB error", reason: qErr.message }, { status: 500 });
        }
        if (!issued) {
            console.log(tag, "code not found");
            return NextResponse.json({ ok: false, error: "Código inexistente." }, { status: 404 });
        }

        console.log(tag, "issued row", {
            id: issued.id,
            status: issued.status,
            preorder_id: issued.preorder_id,
            has_pin: !!issued.pin,
            redeemed_at: issued.redeemed_at,
        });

        // 2) Estado
        if (issued.status === "redeemed") {
            console.log(tag, "already redeemed");
            return NextResponse.json({
                ok: false,
                error: "La giftcard ya fue utilizada.",
                reason: "already_redeemed",
                data: { code: issued.code, redeemed_at: issued.redeemed_at, buyer_name: issued.recipient_name }
            }, { status: 409 });
        }
        if (issued.status !== "active") {
            console.log(tag, "not active");
            return NextResponse.json({ ok: false, error: "La giftcard no está activa para canje.", reason: "not_active" }, { status: 409 });
        }

        // 3) PIN
        if (String(issued.pin || "").trim() !== pinStr) {
            console.log(tag, "invalid pin");
            return NextResponse.json({ ok: false, error: "PIN incorrecto.", reason: "invalid_pin" }, { status: 401 });
        }

        // 4) Nombre del gift (opcional)
        let gift_name = "";
        if (issued.template_gift_id) {
            const rGift = await supabaseAdmin
                .from("giftcards")
                .select("name")
                .eq("id", issued.template_gift_id)
                .maybeSingle();
            gift_name = rGift.data?.name || "";
            console.log(tag, "gift_name", gift_name, "error:", rGift.error?.message);
        }

        // 5) Marcar emisión como canjeada
        const nowIso = new Date().toISOString();
        {
            const rUpd = await supabaseAdmin
                .from("giftcards_issued")
                .update({ status: "redeemed", redeemed_at: nowIso })
                .eq("id", issued.id);
            console.log(tag, "update issued", { error: rUpd.error?.message });
            if (rUpd.error) {
                return NextResponse.json({ ok: false, error: "DB error", reason: rUpd.error.message }, { status: 500 });
            }
        }

        // 6) Marcar la PREORDER como usada
        let preorderUpdateOk = false;
        let preorderUpdateError: string | undefined;
        if (issued.preorder_id) {
            const rPre = await supabaseAdmin
                .from("preorders")
                .update({ status: "used" }) // <- acá fijate si el enum lo permite
                .eq("id", issued.preorder_id)
                .in("status", ["paid", "pending"]);
            preorderUpdateOk = !rPre.error;
            preorderUpdateError = rPre.error?.message;
            console.log(tag, "update preorder", {
                preorder_id: issued.preorder_id,
                ok: preorderUpdateOk,
                error: preorderUpdateError,
            });
        } else {
            console.warn(tag, "issued without preorder_id (no se podrá reflejar 'used' en preorders)");
        }

        return NextResponse.json({
            ok: true,
            data: { code: issued.code, gift_name, buyer_name: issued.recipient_name || "" },
            debug: {
                preorder_id: issued.preorder_id ?? null,
                preorderUpdateOk,
                preorderUpdateError: preorderUpdateError || null,
            }
        });
    } catch (e: any) {
        console.error("[redeem] fatal", e);
        return NextResponse.json({ ok: false, error: "Unexpected", reason: e?.message }, { status: 500 });
    }
}
