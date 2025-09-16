// src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css"; // tu ruta correcta

export const metadata: Metadata = {
    title: "BOA",
    description: "Experiencia BOA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" suppressHydrationWarning>
            {/* añadí suppressHydrationWarning tb en body */}
            <body className="min-h-dvh bg-white antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
