// app/account/inscripciones/page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { useAuth } from "@/stores/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, CalendarDays, MapPin, TicketX } from "lucide-react";

type EventLite = {
  id: string;
  title: string;
  starts_at: string; // ISO
  location?: string | null;
  cover_url?: string | null;
  slug?: string | null;
};

type Row = {
  id: string;
  status: "confirmed" | "reserved" | "cancelled";
  created_at: string;
  event: EventLite | null;
};

export default function InscripcionesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      // Traemos inscripciones con su evento asociado
      const { data, error } = await supabase
        .from("inscripciones")
        .select(
          `
          id,
          status,
          created_at,
          event:events (
            id, title, starts_at, location, cover_url, slug
          )
        `
        ) // 👆 ajustá "events" si tu FK se llama diferente
        .eq("user_id", user.id)
        .neq("status", "cancelled")
        .order("created_at", { ascending: false });

      if (error) {
        setRows([]);
        setLoading(false);
        toast({
          title: "No pudimos cargar tus inscripciones",
          description: "Reintentá en unos segundos.",
          variant: "destructive",
        });
        return;
      }

      const now = Date.now();
      const upcoming = (data as Row[]).filter(
        (r) => r.event && new Date(r.event.starts_at).getTime() > now
      );
      // Orden por fecha de evento
      upcoming.sort(
        (a, b) =>
          new Date(a.event!.starts_at).getTime() -
          new Date(b.event!.starts_at).getTime()
      );

      setRows(upcoming);
      setLoading(false);
    };

    load();
  }, [user, toast]);

  if (!user) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-xl border p-6 text-center">
          <h1 className="text-2xl font-semibold">Necesitás iniciar sesión</h1>
          <p className="mt-2 text-neutral-600">
            Ingresá para ver tus inscripciones.
          </p>
          <Button asChild className="mt-4">
            <a href="/login">Ir a iniciar sesión</a>
          </Button>
        </div>
      </main>
    );
  }

  const cancelOne = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from("inscripciones")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    setBusyId(null);

    if (error) {
      toast({
        title: "No pudimos cancelar",
        description: "Probá de nuevo en unos instantes.",
        variant: "destructive",
      });
      return;
    }

    setRows((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    toast({
      title: "Inscripción cancelada",
      description: "Te esperamos en una próxima actividad ✨",
    });
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Mis inscripciones</h1>

      {loading ? (
        <div className="mt-6 rounded-xl border p-8 text-center text-neutral-600">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Cargando tus próximas actividades…
        </div>
      ) : rows && rows.length > 0 ? (
        <ul className="mt-6 grid gap-4">
          {rows.map((row) => {
            const ev = row.event!;
            return (
              <li
                key={row.id}
                className="flex flex-col rounded-xl border md:flex-row overflow-hidden"
              >
                {/* Imagen */}
                <div className="relative h-40 w-full md:h-auto md:w-52 bg-neutral-100">
                  {ev.cover_url ? (
                    <Image
                      src={ev.cover_url}
                      alt={ev.title}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-lg font-semibold">
                        {ev.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {fmt(ev.starts_at)}
                        </span>
                        {ev.location ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {ev.location}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <Badge
                      variant={row.status === "confirmed" ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {row.status === "confirmed" ? "Confirmada" : "Reservada"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    {ev.slug ? (
                      <Button variant="outline" asChild>
                        <a href={`/actividades/${ev.slug}`}>Ver detalle</a>
                      </Button>
                    ) : null}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          disabled={busyId === row.id}
                        >
                          {busyId === row.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cancelando…
                            </>
                          ) : (
                            <>
                              <TicketX className="mr-2 h-4 w-4" />
                              Cancelar
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Cancelar esta inscripción?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Se liberará tu lugar y es posible que no se pueda
                            recuperar. Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Volver</AlertDialogCancel>
                          <AlertDialogAction onClick={() => cancelOne(row.id)}>
                            Sí, cancelar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-6 rounded-xl border p-8 text-center">
          <p className="text-neutral-700">
            No tenés próximas inscripciones.
          </p>
          <Button asChild className="mt-4">
            <a href="/actividades">Explorar actividades</a>
          </Button>
        </div>
      )}
    </main>
  );
}
