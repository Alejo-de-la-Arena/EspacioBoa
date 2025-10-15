// src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import AuthInit from "@/components/auth/AuthInit";
import { Montserrat, Dancing_Script } from "next/font/google";

export const metadata: Metadata = {
    title: "BOA",
    description: "Experiencia BOA",
};

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "600", "700", "800", "900"],
    variable: "--font-sans",   // 👈 alimenta a Tailwind (font-sans)
    display: "swap",
});

const dancing = Dancing_Script({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-script",
    display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${montserrat.variable} ${dancing.variable}`} suppressHydrationWarning>
            <body
                className="
          min-h-dvh antialiased font-sans
        "
                suppressHydrationWarning
            >
                <AuthInit />
                {children}
            </body>
        </html>
    );
}
