// components/EventFlyerCard.tsx
import Link from "next/link";

export type FlyerEvent = {
    id: string | number;
    title: string;
    image: string;
    flyerVertical?: string;
    poster?: string;
    date: string;
    location?: string;
    category?: string;
    artist?: string; dj?: string; speaker?: string; facilitator?: string;
    host?: string; teacher?: string; guide?: string;
    [k: string]: any;
};

export default function EventFlyerCard({
    ev,
    fullHeight = false,
    overrideSrc,
}: {
    ev: FlyerEvent;
    fullHeight?: boolean;
    overrideSrc?: string;
}) {
    const d = new Date(ev.date);
    const dd = d.getDate().toString().padStart(2, "0");
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const weekday = d.toLocaleDateString("es-ES", { weekday: "long" }).toUpperCase();

    const signature =
        ev.artist || ev.dj || ev.speaker || ev.facilitator ||
        ev.host || ev.teacher || ev.guide || ev.category || "BOA";

    const imgSrc = overrideSrc || ev.flyerVertical || ev.poster || ev.image;

    return (
        <Link href={`/events/${ev.id}`} className="group block h-full">
            <div
                className={[
                    "relative isolate w-full overflow-hidden rounded-[32px]",
                    "shadow-[0_18px_40px_rgba(0,0,0,0.14)] ring-1 ring-neutral-200/70",
                    fullHeight ? "h-full" : "aspect-[4/5]",
                    "bg-neutral-900",
                ].join(" ")}
            >
                {/* Imagen: ocupar siempre todo el card */}
                <img
                    src={imgSrc}
                    alt={ev.title}
                    className="absolute inset-0 z-10 h-full w-full object-cover object-center"
                    draggable={false}
                />

                {/* Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Título */}
                    <div className="px-5 sm:px-6 pt-5 sm:pt-6">
                        <div className="max-w-[72%] text-white font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(22px,4vw,42px)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                            {ev.title.split(" ").map((w, i) => (
                                <span key={i} className="block">{w}</span>
                            ))}
                        </div>
                    </div>

                    {/* Footer fijo visible */}
                    <div className="mt-auto px-4 sm:px-5 pb-4 sm:pb-5">
                        <div
                            className="mb-2 sm:mb-3 text-white/95 text-[clamp(24px,4.5vw,38px)] font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
                            style={{ fontFamily: "'Brush Script MT','Segoe Script','Lucida Handwriting',cursive" }}
                        >
                            {signature}
                        </div>

                        <div className="flex items-center justify-between gap-3 rounded-xl bg-black/42 px-3 py-2 backdrop-blur-[2px] ring-1 ring-white/10">
                            <div className="text-white text-[12px] sm:text-sm font-extrabold uppercase tracking-wide">
                                {`${weekday} ${dd}/${mm}`}
                            </div>
                            <div className="text-white/95 text-[10px] sm:text-xs font-semibold truncate max-w-[65%] sm:max-w-[70%]">
                                {ev.location || "ESPACIO BOA – MARTÍNEZ"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* (Eliminado) Marca “boa” abajo a la izquierda */}
            </div>
        </Link>
    );
}
