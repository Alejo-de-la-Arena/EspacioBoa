// src/components/GiftCardCard.tsx
"use client";
import * as React from "react";
import type { GiftCard } from "@/types";

type Mode = "public" | "admin";

const GENERIC_TITLE = "Gift Card";
const GENERIC_DESC = "Un regalo abierto para disfrutar Boa a tu manera.";

export function GiftCardCard({
    gc,
    mode = "admin",
    onBuy,
}: {
    gc: GiftCard;
    mode?: Mode;
    onBuy?: () => void;
}) {
    const flowerURI =
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'><g fill='%23308a73'><circle cx='7' cy='3' r='2'/><circle cx='11' cy='7' r='2'/><circle cx='7' cy='11' r='2'/><circle cx='3' cy='7' r='2'/><circle cx='9.8' cy='4.2' r='1.5'/><circle cx='9.8' cy='9.8' r='1.5'/><circle cx='4.2' cy='9.8' r='1.5'/><circle cx='4.2' cy='4.2' r='1.5'/><circle cx='7' cy='7' r='2.2'/></g></svg>\")";

    return (
        <div
            style={{
                width: "100%",
                maxWidth: 680,
                borderRadius: 0,
                padding: 18,
                background: `conic-gradient(
          from 160deg at 50% 50%,
          rgba(164,216,195,.95) 0%,
          rgba(207,232,221,.95) 10%,
          rgba(252,236,212,.95) 20%,
          rgba(255,218,199,.95) 30%,
          rgba(230,242,233,.95) 40%,
          rgba(183,227,207,.95) 50%,
          rgba(244,239,226,.95) 60%,
          rgba(214,232,221,.95) 70%,
          rgba(255,225,210,.95) 80%,
          rgba(240,247,241,.95) 90%,
          rgba(164,216,195,.95) 100%
        )`,
                boxShadow: "inset 0 0 0 3px rgba(255,255,255,.65), 0 18px 42px rgba(41,51,45,.14)",
            }}
        >
            <div
                style={{
                    position: "relative",
                    borderRadius: 26,
                    padding: 36,
                    minHeight: 320,
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #FFFBF4 0%, #FFF7EB 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(92, 74, 56, .07)",
                }}
            >
                {/* Watermark + texturas (igual que antes) */}
                <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                                "url('https://res.cloudinary.com/dasch1s5i/image/upload/v1755904587/logo-boa_1_gf2bhl.svg')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "min(76%, 520px)",
                            opacity: 0.14,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: `
                radial-gradient(55% 45% at 18% 16%, rgba(200,222,209,.26), transparent 60%),
                radial-gradient(45% 40% at 82% 12%, rgba(244,239,226,.28), transparent 62%),
                radial-gradient(65% 55% at 50% 98%, rgba(214,232,221,.24), transparent 60%)
              `,
                            mixBlendMode: "multiply",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "radial-gradient(120% 90% at 50% 0%, rgba(103,130,111,.08) 0%, rgba(103,130,111,0) 60%)",
                        }}
                    />
                </div>

                {/* Textura de papel */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.06,
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='9'/><feColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 .75 0 0  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23g)' fill='%23b7c6b6' opacity='.22'/></svg>\")",
                        backgroundSize: "270px 270px",
                        pointerEvents: "none",
                        mixBlendMode: "multiply",
                    }}
                />

                {/* Halos */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        top: -70,
                        left: -60,
                        width: 240,
                        height: 240,
                        borderRadius: 999,
                        background: "radial-gradient(closest-side, rgba(214,232,221,.34), rgba(214,232,221,0))",
                        filter: "blur(2px)",
                    }}
                />
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        bottom: -80,
                        right: -60,
                        width: 250,
                        height: 250,
                        borderRadius: 999,
                        background: "radial-gradient(closest-side, rgba(250,241,224,.32), rgba(250,241,224,0))",
                        filter: "blur(2px)",
                    }}
                />

                {/* Contenido */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <h3
                        style={{
                            fontSize: 32,
                            lineHeight: "36px",
                            fontWeight: 800,
                            color: "#1b2a22",
                            marginBottom: 12,
                        }}
                    >
                        {GENERIC_TITLE}
                    </h3>

                    <p
                        style={{
                            color: "#2c3a33",
                            fontSize: 18,
                            lineHeight: "26px",
                            margin: "6px 0 28px",
                        }}
                    >
                        {GENERIC_DESC}
                    </p>

                    {/* Precio */}
                    <div
                        style={{
                            fontSize: 44,
                            fontWeight: 900,
                            color: "#1b2a22",
                            marginBottom: 26,
                            position: "relative",
                        }}
                    >
                        ${Number(gc.value || 0).toLocaleString("es-AR")}
                        <span
                            aria-hidden
                            style={{
                                position: "absolute",
                                left: -4,
                                right: 140,
                                bottom: -6,
                                height: 10,
                                backgroundImage:
                                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='10' viewBox='0 0 220 10'><path d='M2 7 C 40 2, 80 12, 120 6 S 200 2, 218 6' stroke='%2391a68f' stroke-width='3' fill='none' stroke-linecap='round' opacity='.75'/></svg>\")",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                                pointerEvents: "none",
                            }}
                        />
                    </div>

                    {/* Separador decorado con flor */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            margin: "20px 0 20px",
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height: 1,
                                background:
                                    "linear-gradient(90deg, rgba(43,58,50,.04), rgba(43,58,50,.16), rgba(43,58,50,.04))",
                            }}
                        />
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 999,
                                backgroundColor: "rgba(31,122,99,.06)",
                                boxShadow: "0 0 0 1px rgba(31,122,99,.16)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                aria-hidden
                                style={{
                                    width: 14,
                                    height: 14,
                                    display: "inline-block",
                                    backgroundImage: flowerURI,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "14px 14px",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                flex: 1,
                                height: 1,
                                background:
                                    "linear-gradient(90deg, rgba(43,58,50,.04), rgba(43,58,50,.16), rgba(43,58,50,.04))",
                            }}
                        />
                    </div>

                    {mode === "public" && (
                        <>
                            <button
                                onClick={onBuy}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    maxWidth: 260,
                                    margin: "18px auto 10px",
                                    background: "linear-gradient(135deg, #1f7a63, #2aa27e)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    letterSpacing: "0.02em",
                                    padding: "10px 26px",
                                    borderRadius: 999,
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                                }}
                            >
                                Comprar una giftcard
                            </button>

                            <p
                                style={{
                                    color: "#2f3d36",
                                    fontSize: 14,
                                    lineHeight: "20px",
                                    textAlign: "center",
                                    marginTop: 4,
                                }}
                            >
                                <strong>¿Cómo usarla?</strong> Mostrá esta gift card en <strong>BOA</strong> al momento de pagar.
                            </p>
                        </>
                    )}

                    {mode === "admin" && (
                        <p
                            style={{
                                color: "#2f3d36",
                                fontSize: 14,
                                lineHeight: "20px",
                                margin: 0,
                            }}
                        >
                            <strong>¿Cómo usarla?</strong> Mostrá esta gift card en <strong>BOA</strong> al momento de pagar.
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
}
