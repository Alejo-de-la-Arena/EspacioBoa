// components/RevealOnScroll.tsx
import { useRef } from "react";
import { motion as m, useInView } from "framer-motion";
import React from "react";

type RevealVariant =
    | "fadeUp"
    | "slideLeft"
    | "pop"
    | "tiltUp"
    | "blurRise"
    | "zoomRotate";

type RevealOnScrollProps = {
    children: React.ReactNode;
    className?: string;
    amount?: number;
    delay?: number;
    duration?: number;
    once?: boolean;
    variant?: RevealVariant;
    as?: React.ElementType;           // ⬅️ cambio clave
    style?: React.CSSProperties;
};

const VARIANTS: Record<
    RevealVariant,
    { hidden: any; visible: any; transition?: any }
> = {
    fadeUp: {
        hidden: { opacity: 0, y: 18, filter: "blur(0px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
    slideLeft: {
        hidden: { opacity: 0, x: 22 },
        visible: { opacity: 1, x: 0 },
    },
    pop: {
        hidden: { opacity: 0, scale: 0.97 },
        visible: { opacity: 1, scale: 1 },
    },
    tiltUp: {
        hidden: { opacity: 0, y: 18, rotateX: -6 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { type: "spring", stiffness: 120, damping: 18 },
        },
    },
    blurRise: {
        hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
    zoomRotate: {
        hidden: {
            opacity: 0,
            y: 26,
            scale: 0.985,
            rotateX: -8,
            filter: "blur(6px) saturate(0.9)",
            transformPerspective: 900,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px) saturate(1)",
            transformPerspective: 900,
            transition: { type: "spring", stiffness: 160, damping: 20 },
        },
    },
};

export function RevealOnScroll({
    children,
    className = "",
    amount = 0.25,
    delay = 0,
    duration = 0.55,
    once = false,
    variant = "fadeUp",
    as: Tag = "section",
    style,
}: RevealOnScrollProps) {
    const ref = useRef<HTMLElement | null>(null);
    const inView = useInView(ref, { amount, margin: "0px 0px -10% 0px", once });

    const state = inView ? "visible" : "hidden";
    const v = VARIANTS[variant];

    const TagComp = Tag as React.ElementType; // ⬅️ evita la unión “inrepresentable”

    return (
        <TagComp
            ref={ref as any} // ⬅️ simplificamos el ref para evitar más unions
            className={["relative isolate", className].filter(Boolean).join(" ")}
            style={{
                overflow: "hidden",
                contain: "paint",
                willChange: "transform",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                ...style,
            }}
            data-reveal={variant}
        >
            <m.div
                initial="hidden"
                animate={state}
                variants={v}
                transition={{
                    duration,
                    ease: "easeOut",
                    delay,
                    ...(v.transition || {}),
                }}
                className="relative z-10 will-change-transform"
            >
                <div className="py-16 sm:py-18 md:py-20 lg:py-24">{children}</div>
            </m.div>
        </TagComp>
    );
}

export const REVEAL_PRESET_CYCLE: RevealVariant[] = [
    "fadeUp",
    "slideLeft",
    "pop",
    "tiltUp",
    "blurRise",
    "zoomRotate",
];
