// src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { Montserrat, Dancing_Script } from "next/font/google";
import AuthHydrator from "./_auth-hydrator";

export const metadata: Metadata = {
    title: "BOA",
    description: "Experiencia BOA",
    icons: {
        icon: [
            { url: "/images/logo-boa.svg", type: "image/svg+xml" },
        ],
    },
};

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "600", "700", "800", "900"],
    variable: "--font-sans",
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
        <html
            lang="es"
            className={`${montserrat.variable} ${dancing.variable}`}
            suppressHydrationWarning
        >
            <body className="min-h-dvh antialiased font-sans" suppressHydrationWarning>
                {/* Hidrata sesión una vez y mantiene suscripción */}
                <AuthHydrator />
                {children}
            </body>
        </html>
    );
}
