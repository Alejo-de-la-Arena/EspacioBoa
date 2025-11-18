// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            /* ===== Paleta base existente + tokens BOA ===== */
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },

                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },

                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",

                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },

                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },

                /* ====== NUEVO: tokens de marca BOA (HSL vars) ====== */
                boa: {
                    cream: "hsl(var(--boa-cream))",   // fondo papel
                    green: "hsl(var(--boa-green))",   // verde identitario
                    sage: "hsl(var(--boa-sage))",    // verde suave
                    terra: "hsl(var(--boa-terra))",   // terracota/acento
                    ink: "hsl(var(--boa-ink))",     // texto
                    cocoa: "hsl(var(--boa-cocoa))",   // café cálido
                    niebla: "hsl(var(--boa-niebla))",  // gris/crema muy claro
                },
            },

            /* 👇 ESTA PARTE VA AQUÍ, NO DENTRO DE "colors" */
            fontFamily: {
                sans: ["Montserrat", "sans-serif"],
                serif: ["Playfair Display", "serif"],
                script: ["var(--font-script)", "cursive"],
                display: ["Playfair Display", "serif"],
            },

            /* Estética cálida: sombras, radios, fondos y easing */
            boxShadow: {
                frame:
                    "0 1px 0 rgba(0,0,0,0.04), 0 6px 18px rgba(0,0,0,0.08)",
                soft: "0 8px 24px rgba(0,0,0,0.06)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl2: "1.25rem",
            },
            backgroundImage: {
                "paper-wash":
                    "linear-gradient(180deg, hsl(var(--boa-cream)) 0%, #ffffff 60%)",
            },
            transitionTimingFunction: {
                smooth: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            },

            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
