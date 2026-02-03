import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import ActivitiesCalendar from "@/components/ActivitiesCalendar";
import { useActivitiesLive } from "@/hooks/useActivitiesLive";
import { useApp } from "@/contexts/AppContext";

export default function CalendarPage() {
    const { events, loading: eventsLoading } = useApp();
    const { activities, loading: activitiesLoading } = useActivitiesLive();

    const loading = eventsLoading || activitiesLoading;

    // ✅ entra directo al calendario (sin que el usuario tenga que scrollear)
    useEffect(() => {
        // lo hacemos en el próximo tick para asegurar DOM listo
        const id = setTimeout(() => {
            const el = document.getElementById("boa-calendar");
            if (el) el.scrollIntoView({ behavior: "instant" as any, block: "start" });
            // si preferís animado:
            // el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
        return () => clearTimeout(id);
    }, []);

    return (
        <>
            <Head>
                <title>Calendario | BOA</title>

                {/* sugerido para QR: no indexar */}
                <meta name="robots" content="noindex,nofollow" />
            </Head>

            {/* ✅ Link accesible para saltar al calendario si por alguna razón queda arriba */}
            <a
                href="#boa-calendar"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:bg-white focus:px-3 focus:py-2 focus:rounded-lg focus:ring-2 focus:ring-emerald-300"
            >
                Ir al calendario
            </a>


            {/* ✅ ANCLA + calendario */}
            <div id="boa-calendar" className="scroll-mt-24">
                {loading ? (
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-emerald-700 animate-pulse">Cargando calendario…</div>
                    </div>
                ) : (
                    <ActivitiesCalendar
                        activities={activities || []}
                        events={events || []}
                        title="Calendario BOA"
                    />
                )}
            </div>
        </>
    );
}
