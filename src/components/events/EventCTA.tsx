"use client";
import { useState, useMemo } from "react";
import { useEventRegistration } from "@/hooks/useEventRegistration";
import { useAuth } from "@/stores/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function EventCTA({ eventId, priceLabel }: { eventId: string; priceLabel?: string; }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const { loading, isRegistered, spotsLeft, totalCapacity, register, cancel } = useEventRegistration(eventId);
    const isFull = useMemo(() => (spotsLeft !== null && spotsLeft <= 0), [spotsLeft]);

    const handleClick = async () => {
        try {
            if (!user) {
                toast({ title: "Inicia sesión para continuar", variant: "default" });
                // Opcional: abrir modal de login
                return;
            }
            if (isRegistered) {
                await cancel();
                toast({ title: "Inscripción cancelada" });
            } else {
                await register();
                toast({ title: "¡Inscripción confirmada!" });
            }
        } catch (e: any) {
            toast({ title: e?.message ?? "Ocurrió un error", variant: "destructive" });
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Precio si aplica */}
            {priceLabel && (
                <div className="text-2xl font-extrabold tracking-tight">{priceLabel}</div>
            )}

            {/* Indicadores de capacidad */}
            <div className="text-sm text-emerald-700/90">
                {typeof spotsLeft === "number" && typeof totalCapacity === "number" ? (
                    isFull
                        ? "Evento completo"
                        : `${spotsLeft} cupos disponibles`
                ) : "Cargando cupos..."}
            </div>

            <Button
                size="lg"
                className="h-12 text-base"
                disabled={loading || isFull && !isRegistered}
                onClick={handleClick}
            >
                {loading
                    ? "Procesando..."
                    : isRegistered
                        ? "Cancelar mi inscripción"
                        : isFull
                            ? "Evento completo"
                            : "Inscribirme al evento"}
            </Button>

            {isRegistered && (
                <p className="text-xs text-muted-foreground">
                    Ya estás inscripto. Puedes cancelar si no vas a asistir.
                </p>
            )}
        </div>
    );
}
