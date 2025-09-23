// src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import AuthInit from "@/components/auth/AuthInit";

export const metadata: Metadata = {
    title: "BOA",
    description: "Experiencia BOA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className="min-h-dvh bg-white antialiased" suppressHydrationWarning>
                <AuthInit />   {/* 👈 hidrata el store apenas carga la app */}
                {children}
            </body>
        </html>
    );
}
