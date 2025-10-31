// pages/gc/[code].tsx
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Props = {
    found: boolean;
    code: string;
    status?: "active" | "redeemed" | "cancelled" | "expired";
    recipient_name?: string | null;
    gift_name?: string | null;
    redeemed_at?: string | null;
    expires_at?: string | null;
};

export default function GCVerifyPage(p: Props) {
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const [redeemedInfo, setRedeemedInfo] = useState<null | {
        gift_name: string;
        buyer_name: string;
    }>(null);

    const isActive = p.found && p.status === "active" && !done;

    async function handleRedeem(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErrorMsg(null);
        setRedeemedInfo(null);

        const cleanPin = pin.trim();
        if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
            setErrorMsg("Ingresá el PIN de 4 dígitos.");
            return;
        }

        setLoading(true);
        try {
            const resp = await fetch("/api/giftcards/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: p.code, pin: cleanPin }),
            });

            const json = await resp.json().catch(() => null);

            if (!resp.ok) {
                if (json?.reason === "invalid_pin") {
                    setErrorMsg("PIN incorrecto. Verificalo e intentá de nuevo.");
                } else if (json?.reason === "already_redeemed") {
                    setErrorMsg(
                        `Esta giftcard ya fue utilizada${json?.data?.buyer_name ? ` por ${json.data.buyer_name}` : ""
                        }.`
                    );
                } else if (json?.reason === "not_issued") {
                    // si el API usa "not_issued" para "no active"
                    setErrorMsg("La giftcard todavía no está lista para canjear.");
                } else if (resp.status === 404) {
                    setErrorMsg("Código inexistente.");
                } else {
                    setErrorMsg(json?.error || `Error ${resp.status}`);
                }
                return;
            }

            if (json?.ok) {
                setDone(true);
                setRedeemedInfo({
                    gift_name: json.data?.gift_name || p.gift_name || "",
                    buyer_name: json.data?.buyer_name || p.recipient_name || "",
                });
                setPin("");
            } else {
                setErrorMsg(json?.error || "No se pudo canjear. Probá de nuevo.");
            }
        } catch (err: any) {
            setErrorMsg(err?.message || "Error de red al validar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-emerald-50 px-4 py-10">
            <Head>
                <title>Verificación de Giftcard</title>
                <meta name="robots" content="noindex" />
            </Head>

            <div className="w-[min(560px,94vw)] rounded-2xl bg-white shadow-xl p-6 text-center">
                <h1 className="text-3xl font-extrabold text-boa-ink">
                    Verificación de Giftcard
                </h1>
                <p className="mt-1 text-boa-ink/70 text-sm">
                    Código: <b>{p.code}</b>
                </p>

                {!p.found && (
                    <div className="mt-6 text-red-600 font-semibold">
                        Código inexistente
                    </div>
                )}

                {isActive && (
                    <div className="mt-6">
                        <div className="text-emerald-700 font-extrabold text-2xl">
                            ✅ Giftcard válida
                        </div>
                        {p.gift_name && (
                            <div className="mt-1 text-sm">
                                Gift: <b>{p.gift_name}</b>
                            </div>
                        )}
                        {p.recipient_name && (
                            <div className="text-sm">
                                A nombre de: <b>{p.recipient_name}</b>
                            </div>
                        )}
                        {p.expires_at && (
                            <div className="text-xs text-boa-ink/60 mt-1">
                                Vence: {new Date(p.expires_at).toLocaleDateString()}
                            </div>
                        )}

                        <form onSubmit={handleRedeem} className="mt-5 space-y-3">
                            <label className="block text-sm font-semibold text-boa-ink">
                                PIN de canje (sólo staff)
                            </label>
                            <input
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                inputMode="numeric"
                                maxLength={4}
                                className="mt-1 w-full rounded-lg border px-4 py-3 text-center text-xl tracking-[0.4em]"
                                placeholder="••••"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !/^\d{4}$/.test(pin.trim())}
                                className="mt-1 w-full rounded-lg bg-boa-green px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                            >
                                {loading ? "Validando..." : "Validar y canjear"}
                            </button>
                            <p className="text-xs text-boa-ink/60">
                                * Esta acción marca la giftcard como utilizada.
                            </p>

                            {errorMsg && (
                                <p className="text-red-600 text-sm mt-2">{errorMsg}</p>
                            )}
                        </form>
                    </div>
                )}

                {(p.status === "redeemed" || done) && (
                    <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <div className="font-bold text-emerald-800 text-lg">
                            ¡Canje realizado!
                        </div>
                        <p className="text-emerald-900 text-sm mt-1">
                            {(redeemedInfo?.gift_name || p.gift_name || "Giftcard")} — a
                            nombre de{" "}
                            {redeemedInfo?.buyer_name || p.recipient_name || "el cliente"}.
                        </p>
                        <p className="text-xs text-boa-ink/60 mt-1">
                            {p.redeemed_at
                                ? `Canjeada: ${new Date(p.redeemed_at).toLocaleString()}`
                                : "Se marcó como utilizada ahora."}
                        </p>
                    </div>
                )}

                {p.status === "cancelled" && (
                    <div className="mt-6 text-red-600 font-semibold">
                        Giftcard cancelada
                    </div>
                )}
                {p.status === "expired" && (
                    <div className="mt-6 text-red-600 font-semibold">
                        Giftcard vencida
                    </div>
                )}
            </div>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const code = String(ctx.params?.code || "").toUpperCase();
    if (!code) return { props: { found: false, code: "" } };

    // Traemos la emisión (giftcards_issued)
    const { data, error } = await supabaseAdmin
        .from("giftcards_issued")
        .select("status,recipient_name,expires_at,redeemed_at,template_gift_id")
        .eq("code", code)
        .maybeSingle();

    if (error || !data) return { props: { found: false, code } };

    // Nombre de la plantilla (giftcards)
    let gift_name: string | null = null;
    if (data?.template_gift_id) {
        const { data: tpl } = await supabaseAdmin
            .from("giftcards")
            .select("name")
            .eq("id", data.template_gift_id)
            .maybeSingle();
        gift_name = tpl?.name ?? null;
    }

    return {
        props: {
            found: true,
            code,
            status: (data.status as any) ?? null,
            recipient_name: data.recipient_name ?? null,
            gift_name,
            redeemed_at: data.redeemed_at ?? null,
            expires_at: data.expires_at ?? null,
        },
    };
};
