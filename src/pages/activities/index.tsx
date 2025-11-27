import Head from "next/head";
import { Heart, Sparkles } from "lucide-react";
import { mediaUrl } from "@/lib/mediaUrl";
import Activities from "@/components/Activities";
import ActivitiesCalendar from "@/components/ActivitiesCalendar";
import { useActivitiesLive } from "@/hooks/useActivitiesLive";
import { useAuth } from "@/stores/useAuth";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";


export default function ActivitiesPage() {
    const { initialized } = useAuth();
    const { activities, loading: dataLoading } = useActivitiesLive();


    const isLoading = !initialized || dataLoading;

    const [stuck, setStuck] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            setStuck(false);
            return;
        }
        const id = setTimeout(() => setStuck(true), 10000);
        return () => clearTimeout(id);
    }, [isLoading]);

    return (
        <>
            <Head>
                <title>Actividades | BOA</title>
            </Head>

            {isLoading && !stuck ? (
                <section>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="animate-pulse text-emerald-600">
                            <Heart className="h-12 w-12" />
                        </div>
                    </div>
                </section>
            ) : stuck && isLoading ? (
                <section className="min-h-screen grid place-items-center">
                    <div className="text-center space-y-3">
                        <p className="text-neutral-700">Tardó demasiado en cargar. Podés reintentar.</p>
                        <button
                            onClick={() => {
                                setStuck(false);
                                router.reload();
                            }}
                            className="px-4 py-2 rounded-lg ring-1 ring-emerald-300 hover:bg-emerald-50"
                        >
                            Reintentar
                        </button>
                    </div>
                </section>
            ) : (
                <section>
                    <section className="relative min-h-[80vh] sm:min-h-[100vh] pt-28 pb-16 font-sans overflow-hidden grid place-items-center">
                        <div className="absolute inset-0 -z-10">
                            <div
                                className="absolute inset-0 hidden sm:block"
                                style={{
                                    backgroundImage: `url('${mediaUrl("hero-activities/activities-bg.webp")}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    filter: "saturate(0.96) brightness(1) contrast(1.04)",
                                }}
                            />
                            <div
                                className="absolute inset-0 block sm:hidden"
                                style={{
                                    backgroundImage: `url('${mediaUrl(
                                        "hero-activities/activities-bg-mobile.webp"
                                    )}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center 18%",
                                    backgroundRepeat: "no-repeat",
                                    filter: "saturate(0.96) brightness(1) contrast(1.04)",
                                }}
                            />
                            <div className="absolute inset-0 bg-[#FBF7EC]/60 mix-blend-multiply" />
                            <div
                                aria-hidden
                                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                                style={{ backgroundImage: "var(--boa-noise)", backgroundSize: "420px 420px" }}
                            />
                        </div>

                        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative isolate max-w-3xl mx-auto text-center">
                                <div className="relative z-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-boa-green/25 backdrop-blur-md ring-1 ring-boa-green/40 text-boa-green-foreground"
                                    >
                                        <Sparkles className="h-4 w-4 text-boa-green" />
                                        <span className="text-[12px] font-semibold tracking-wide text-boa-green">
                                            Cuerpo • Mente • Comunidad
                                        </span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
                                        className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900"
                                    >
                                        Actividades que te <span className="text-boa-green">hacen bien</span>
                                    </motion.h1>

                                    <motion.svg
                                        className="mt-3 mx-auto w-56 h-4 relative z-20"
                                        viewBox="0 0 220 18"
                                        fill="none"
                                        aria-hidden="true"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, ease: "easeOut", delay: 0.16 }}
                                    >
                                        <path
                                            d="M6 10C55 15 125 15 214 8"
                                            stroke="hsl(var(--boa-green))"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                        />
                                    </motion.svg>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.22 }}
                                        className="mt-4 text-base sm:text-xl leading-relaxed relative z-20 text-neutral-800 max-w-[100%] mx-auto"
                                    >
                                        Movimiento, arte y bienestar en un mismo lugar. <br /> Descubrí tu próxima
                                        clase y reservá en segundos.
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Activities activities={activities} />
                    <ActivitiesCalendar activities={activities} />
                </section>
            )}
        </>
    );
}
