// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppContextProvider } from "@/contexts/AppContext";
import { Montserrat, Dancing_Script } from "next/font/google";

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

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={`${montserrat.variable} ${dancing.variable} font-sans`}>
            <AppContextProvider>
                <Component {...pageProps} />
            </AppContextProvider>
        </div>
    );
}
