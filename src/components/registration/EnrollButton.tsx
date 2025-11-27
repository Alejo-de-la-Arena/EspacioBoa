"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/stores/useAuth"; 
import { Loader2, Check, Clock, X } from "lucide-react";

type Props = { kind: "activity" | "event"; id: string; seatsRemaining?: number };

export default function EnrollButton({ kind, id, seatsRemaining }: Props) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    async function requireAuth() {
        if (!user) {
            toast({ title: "Inicia sesión", description: "Necesitas iniciar sesión para inscribirte." });
            // redirigí si querés
            return false;
        }
        return true;
    }

    const register = async () => {
        if (!(await requireAuth())) return;
        try {
            setLoading(true);
            const fn = kind === "activity" ? "register_activity" : "register_event";
            const key = kind === "activity" ? "p_activity_id" : "p_event_id";
            const { data, error } = await supabase.rpc(fn as any, { [key]: id });
            if (error) throw error;

            const row = Array.isArray(data) ? data[0] : data;
            const status = row?.status as "confirmed" | "waitlist";
            toast({
                title: status === "confirmed" ? "¡Inscripción confirmada!" : "Te sumamos a la lista de espera",
                description:
                    status === "confirmed"
                        ? "Nos vemos en BOA ✨"
                        : "Te avisaremos automáticamente si se libera un cupo.",
            });
        } catch (e: any) {
            toast({ title: "No pudimos inscribirte", description: e.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const cancel = async () => {
        if (!(await requireAuth())) return;
        try {
            setLoading(true);
            const fn = kind === "activity" ? "cancel_activity" : "cancel_event";
            const key = kind === "activity" ? "p_activity_id" : "p_event_id";
            const { data, error } = await supabase.rpc(fn as any, { [key]: id });
            if (error) throw error;

            const promoted = Array.isArray(data) ? data[0]?.promoted_user : null;
            toast({
                title: "Inscripción cancelada",
                description: promoted ? "Se liberó un cupo para la lista de espera." : "Listo. ¡Gracias por avisar!",
            });
        } catch (e: any) {
            toast({ title: "No pudimos cancelar", description: e.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const isFull = typeof seatsRemaining === "number" && seatsRemaining <= 0;

    return (
        <div className="flex gap-2">
            <button
                onClick={register}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : isFull ? <Clock size={16} /> : <Check size={16} />}
                {loading ? "Procesando..." : isFull ? "Unirme a la lista de espera" : "Inscribirme ahora"}
            </button>
            <button
                onClick={cancel}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 disabled:opacity-60"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <X size={16} />}
                {loading ? "Procesando..." : "Cancelar inscripción"}
            </button>
        </div>
    );
}
