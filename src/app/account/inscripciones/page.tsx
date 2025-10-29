"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Loader2, CalendarDays, MapPin, TicketX, ArrowLeft } from "lucide-react";

/* ========= Tipos ========= */
type ActivityLite = {
  id: string;
  title: string;
  start_at: string | null;
  location: string | null;
  hero_image: string | null;
  slug?: string | null;
};
type RegistrationRow = {
  id: string;
  activity_id: string;
  status: "confirmed" | "waitlist" | "canceled" | null;
  created_at: string;
  activity: ActivityLite | null;
};

/* ----- Eventos ----- */
type EventLite = {
  id: string;
  title: string;
  start_at?: string | null;
  date?: string | null;
  time?: string | null;
  location: string | null;
  hero_image?: string | null;
  image?: string | null;
  poster?: string | null;
  flyerVertical?: string | null;
};

type EventRegistrationRow = {
  id: string;
  event_id: string;
  status: "confirmed" | "waitlist" | "canceled" | null;
  created_at: string;
  event: EventLite | null;
};



export default function InscripcionesPage() {
  const { user, initialized } = useAuth() as any;
  const { toast } = useToast();

  // ====== Actividades ======
  const [rows, setRows] = React.useState<RegistrationRow[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  // ====== Eventos ======
  const [eventRows, setEventRows] = React.useState<EventRegistrationRow[] | null>(null);
  const [loadingEvents, setLoadingEvents] = React.useState(true);
  const [busyEventId, setBusyEventId] = React.useState<string | null>(null);

  // Evitar updates en componente desmontado
  const mountedRef = React.useRef(true);
  React.useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Evitar carreras (ignorar respuestas viejas)
  const reqSeqRef = React.useRef(0);
  const reqSeqEventsRef = React.useRef(0);

  const fmtDatetime = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("es-AR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
      : "—";

  const fmtDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("es-AR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "—";

  const eventImage = (ev?: EventLite | null) =>
    ev?.hero_image || ev?.flyerVertical || ev?.poster || ev?.image || null;

  const fmtEventWhen = (ev?: EventLite | null) => {
    if (!ev) return "—";
    if (ev.start_at) return fmtDatetime(ev.start_at);

    if (ev.date) {
      const d = new Date(ev.date);
      const valid = !Number.isNaN(d.getTime());
      if (valid) {
        const base = fmtDate(ev.date);
        return ev.time ? `${base} · ${ev.time}` : base;
      }
      return ev.time ? `${ev.date} · ${ev.time}` : String(ev.date);
    }
    return "—";
  };

  /* =================== LOAD ACTIVITIES =================== */
  const loadActivities = React.useCallback(async (opts?: { silent?: boolean }) => {
    const silent = Boolean(opts?.silent);
    if (!user) {
      if (mountedRef.current) {
        setRows(null);
        setLoading(false);
      }
      return;
    }
    if (!silent && mountedRef.current) setLoading(true);

    const mySeq = ++reqSeqRef.current;
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select(`
          id,
          activity_id,
          status,
          created_at,
          activity:activities ( id, title, start_at, location, hero_image, slug )
        `)
        .eq("user_id", user.id)
        .or("status.is.null,status.eq.confirmed,status.eq.waitlist")
        .order("created_at", { ascending: false });

      if (!mountedRef.current || mySeq !== reqSeqRef.current) return;

      if (error) {
        console.error("registrations list error", error);
        setRows([]);
        toast({
          title: "No pudimos cargar tus inscripciones",
          description: "Reintentá en unos segundos.",
          variant: "destructive",
        });
      } else {
        type SupaRow = {
          id: string;
          activity_id: string;
          status: "confirmed" | "waitlist" | "canceled" | null;
          created_at: string;
          activity: ActivityLite | ActivityLite[] | null;
        };
        const raw: SupaRow[] = (data ?? []) as SupaRow[];
        const regs: RegistrationRow[] = raw.map((r) => {
          const act = Array.isArray(r.activity) ? (r.activity[0] ?? null) : r.activity ?? null;
          return { id: r.id, activity_id: r.activity_id, status: r.status, created_at: r.created_at, activity: act };
        });
        regs.sort((a, b) => {
          const sa = a.activity?.start_at ? new Date(a.activity.start_at).getTime() : 0;
          const sb = b.activity?.start_at ? new Date(b.activity.start_at).getTime() : 0;
          return sa - sb;
        });
        setRows(regs);
      }
    } finally {
      if (!mountedRef.current) return;
      if (!silent || mySeq === reqSeqRef.current) setLoading(false);
    }
  }, [toast, user]);

  /* =================== LOAD EVENTS =================== */
  const loadEvents = React.useCallback(async (opts?: { silent?: boolean }) => {
    const silent = Boolean(opts?.silent);
    if (!user) {
      if (mountedRef.current) {
        setEventRows(null);
        setLoadingEvents(false);
      }
      return;
    }
    if (!silent && mountedRef.current) setLoadingEvents(true);

    const mySeq = ++reqSeqEventsRef.current;
    try {
      const { data, error } = await supabase.rpc("my_event_registrations");
      if (!mountedRef.current || mySeq !== reqSeqEventsRef.current) return;

      if (error) {
        console.error("my_event_registrations error", error);
        setEventRows([]);
        toast({
          title: "No pudimos cargar tus eventos inscritos",
          description: "Reintentá en unos segundos.",
          variant: "destructive",
        });
        return;
      }

      type Row = { id: string; event_id: string; created_at: string; event: any | null };

      const regs: EventRegistrationRow[] = (data ?? []).map((r: Row) => ({
        id: r.id,
        event_id: r.event_id,
        status: "confirmed",
        created_at: r.created_at,
        event: r.event
          ? {
            id: r.event.id,
            title: r.event.title,
            start_at: r.event.start_at ?? null,
            hero_image: r.event.hero_image ?? null,
            date: r.event.date ?? null,
            time: r.event.time ?? null,
            location: r.event.location ?? null,
            image: r.event.image ?? null,
            poster: r.event.poster ?? null,
            flyerVertical: r.event.flyerVertical ?? null,
          }
          : null,
      }));

      regs.sort((a, b) => {
        const sa = a.event?.date ? new Date(a.event.date).getTime() : 0;
        const sb = b.event?.date ? new Date(b.event.date).getTime() : 0;
        return sa - sb;
      });

      setEventRows(regs);
    } finally {
      if (!mountedRef.current) return;
      if (!silent || mySeq === reqSeqEventsRef.current) setLoadingEvents(false);
    }
  }, [toast, user]);

  // Cargar cuando la sesión esté lista y haya usuario
  React.useEffect(() => {
    if (!initialized) return;
    if (!user) return;
    loadActivities({ silent: false });
    loadEvents({ silent: false });
  }, [initialized, user, loadActivities, loadEvents]);

  // Re-cargas silenciosas: foco/visibilidad y cambios de auth (para refrescar listas)
  React.useEffect(() => {
    const onFocus = () => { loadActivities({ silent: true }); loadEvents({ silent: true }); };
    const onVisibility = () => {
      if (document.visibilityState === "visible") { loadActivities({ silent: true }); loadEvents({ silent: true }); }
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    const { data: authSub } = supabase.auth.onAuthStateChange(() => {
      loadActivities({ silent: true });
      loadEvents({ silent: true });
    });

    /* =================== CANCEL HANDLERS =================== */
    const cancelOne = async (activityId: string, regId: string) => {
      if (!user) return;
      setBusyId(regId);
      try {
        const { error } = await supabase.rpc("cancel_activity", { p_activity_id: activityId });
        if (error) throw error;

        // optimista
        setRows(prev => (prev ? prev.filter(r => r.id !== regId) : prev));
        toast({ title: "Inscripción cancelada", description: "Se liberó tu lugar. ¡Te esperamos en otra actividad! ✨" });

        // refresco silencioso
        loadActivities({ silent: true });
      } catch {
        toast({
          title: "No pudimos cancelar",
          description: "Probá de nuevo en unos instantes.",
          variant: "destructive",
        });
      } finally {
        setBusyId(null);
      }
    };

    const cancelEventOne = async (eventId: string, regId: string) => {
      if (!user) return;
      setBusyEventId(regId);
      try {
        const { error } = await supabase.rpc("cancel_event_registration", { eid: eventId });
        if (error) throw error;

        // optimista
        setEventRows(prev => (prev ? prev.filter(r => r.id !== regId) : prev));
        toast({ title: "Inscripción cancelada", description: "Se liberó tu lugar en el evento." });

        // refresco silencioso
        loadEvents({ silent: true });
      } catch {
        toast({
          title: "No pudimos cancelar",
          description: "Probá de nuevo en unos instantes.",
          variant: "destructive",
        });
      } finally {
        setBusyEventId(null);
      }
    };


    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      authSub.subscription.unsubscribe();
    };
  }, [loadActivities, loadEvents]);

  // Guards de sesión
  if (!initialized) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10 font-sans">
        <div className="rounded-xl border p-6 text-center text-neutral-600">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Verificando tu sesión…
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10 font-sans">
        <div className="rounded-xl border p-6 text-center">
          <h1 className="text-2xl font-semibold">Necesitás iniciar sesión</h1>
          <p className="mt-2 text-neutral-600">Ingresá para ver tus inscripciones.</p>
          <Button asChild className="mt-4"><Link href="/login">Ir a iniciar sesión</Link></Button>
        </div>
      </main>
    );
  }

  const hasActivities = !!rows && rows.length > 0;
  const hasEvents = !!eventRows && eventRows.length > 0;

  /* =================== CANCEL HANDLERS =================== */
  const cancelOne = async (activityId: string, regId: string) => {
    if (!user) return;
    setBusyId(regId);
    try {
      const { error } = await supabase.rpc("cancel_activity", { p_activity_id: activityId });
      if (error) throw error;

      // optimista
      setRows(prev => (prev ? prev.filter(r => r.id !== regId) : prev));
      toast({ title: "Inscripción cancelada", description: "Se liberó tu lugar. ¡Te esperamos en otra actividad! ✨" });

      // refresco silencioso
      loadActivities({ silent: true });
    } catch {
      toast({
        title: "No pudimos cancelar",
        description: "Probá de nuevo en unos instantes.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const cancelEventOne = async (eventId: string, regId: string) => {
    if (!user) return;
    setBusyEventId(regId);
    try {
      const { error } = await supabase.rpc("cancel_event_registration", { eid: eventId });
      if (error) throw error;

      // optimista
      setEventRows(prev => (prev ? prev.filter(r => r.id !== regId) : prev));
      toast({ title: "Inscripción cancelada", description: "Se liberó tu lugar en el evento." });

      // refresco silencioso
      loadEvents({ silent: true });
    } catch {
      toast({
        title: "No pudimos cancelar",
        description: "Probá de nuevo en unos instantes.",
        variant: "destructive",
      });
    } finally {
      setBusyEventId(null);
    }
  };


  return (
    <main className="container justify-center mx-auto max-w-4xl px-4 mt-10 py-10 font-sans
                     bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft
                     border relative
                     before:absolute before:inset-0 before:-z-10
                     before:bg-paper-wash
                     after:absolute after:inset-0 after:-z-10
                     after:[background-image:var(--boa-noise)]">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" asChild className="hover:bg-boa-green/10">
          <Link href="/" aria-label="Volver">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">Mis inscripciones</h1>
        <div className="w-[88px]" aria-hidden />
      </div>

      {/* ======= ACTIVIDADES ======= */}
      {loading ? (
        <div className="mt-6 rounded-xl border p-8 text-center text-neutral-600">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Cargando tus actividades…
        </div>
      ) : hasActivities ? (
        <>
          <h2 className="mt-2 mb-3 text-xl font-semibold">Actividades</h2>
          <ul className="mt-2 grid gap-4">
            {rows!.map((row) => {
              const a = row.activity;
              if (!a) return null;
              return (
                <li key={row.id} className="flex flex-col rounded-xl border md:flex-row overflow-hidden bg-white">
                  {/* Imagen */}
                  <div className="relative h-40 w-full md:h-auto md:w-56 bg-neutral-100">
                    {a.hero_image ? (
                      <Image
                        src={a.hero_image}
                        alt={a.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 224px"
                      />
                    ) : null}
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 text-lg font-semibold">{a.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{fmtDatetime(a.start_at)}</span>
                          {a.location ? (<span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{a.location}</span>) : null}
                        </div>
                      </div>

                      <Badge
                        variant={row.status === "confirmed" ? "default" : row.status === "waitlist" ? "secondary" : "outline"}
                        className="shrink-0"
                      >
                        {row.status === "confirmed" ? "Confirmada" : row.status === "waitlist" ? "En lista" : "—"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Button variant="outline" asChild><Link href={`/activities/${a.id}`}>Ver detalles</Link></Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            disabled={busyId === row.id}
                            className="border-2 group hover:bg-red-500 hover:text-white"
                            style={{ borderColor: "#E84D4D", color: "#E84D4D" }}
                          >
                            {busyId === row.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelando…
                              </>
                            ) : (
                              <>
                                <TicketX className="mr-2 h-4 w-4 transition-colors group-hover:text-white" />
                                <span className="transition-colors group-hover:text-white">Cancelar</span>
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Cancelar esta inscripción?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Se liberará tu lugar y puede que no se recupere. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3 sm:gap-2">
                            <AlertDialogCancel className="rounded-full px-6 py-3 border-2" style={{ borderColor: "#E84D4D", color: "#E84D4D", background: "transparent" }}>
                              Volver
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={() => cancelOne(a.id, row.id)} className="rounded-full px-6 py-3 border-2 bg-transparent" style={{ borderColor: "#1E7A66", color: "#1E7A66" }}>
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
        </>
      ) : null}

      {/* ======= EVENTOS ======= */}
      {loadingEvents ? (
        <div className="mt-10 rounded-xl border p-8 text-center text-neutral-600">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Cargando tus eventos…
        </div>
      ) : hasEvents ? (
        <>
          <h2 className="mt-10 mb-3 text-xl font-semibold">Eventos</h2>
          <ul className="mt-2 grid gap-4">
            {eventRows!.map((row) => {
              const ev = row.event;
              if (!ev) return null;
              const img = eventImage(ev);

              return (
                <li key={row.id} className="flex flex-col rounded-xl border md:flex-row overflow-hidden bg-white">
                  {/* Imagen */}
                  <div className="relative h-40 w-full md:h-auto md:w-56 bg-neutral-100">
                    {img ? (
                      <Image
                        src={img}
                        alt={ev.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 224px"
                      />
                    ) : null}
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 text-lg font-semibold">{ev.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{fmtEventWhen(ev)}</span>
                          {ev.location ? (<span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{ev.location}</span>) : null}
                        </div>
                      </div>

                      <Badge
                        variant={row.status === "confirmed" ? "default" : row.status === "waitlist" ? "secondary" : "outline"}
                        className="shrink-0"
                      >
                        {row.status === "confirmed" ? "Confirmado" : row.status === "waitlist" ? "En lista" : "—"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Button variant="outline" asChild><Link href={`/events/${ev.id}`}>Ver detalles</Link></Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            disabled={busyEventId === row.id}
                            className="border-2 group hover:bg-red-500 hover:text-white"
                            style={{ borderColor: "#E84D4D", color: "#E84D4D" }}
                          >
                            {busyEventId === row.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelando…
                              </>
                            ) : (
                              <>
                                <TicketX className="mr-2 h-4 w-4 transition-colors group-hover:text-white" />
                                <span className="transition-colors group-hover:text-white">Cancelar</span>
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Cancelar esta inscripción?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Se liberará tu lugar y puede que no se recupere. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3 sm:gap-2">
                            <AlertDialogCancel className="rounded-full px-6 py-3 border-2" style={{ borderColor: "#E84D4D", color: "#E84D4D", background: "transparent" }}>
                              Volver
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={() => cancelEventOne(ev.id, row.id)} className="rounded-full px-6 py-3 border-2 bg-transparent" style={{ borderColor: "#1E7A66", color: "#1E7A66" }}>
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
        </>
      ) : null}

      {!loading && !loadingEvents && !hasActivities && !hasEvents ? <EmptyState /> : null}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-xl border p-8 text-center font-sans">
      <p className="text-neutral-700">No tenés inscripciones activas.</p>
      <div className="mt-4 flex gap-3 justify-center">
        <Button asChild><Link href="/activities">Explorar actividades</Link></Button>
        <Button asChild variant="outline"><Link href="/events">Explorar eventos</Link></Button>
      </div>
    </div>
  );
}
