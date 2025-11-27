import { useState, useMemo, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventsHero from "@/components/EventsHero";
import Link from "next/link";
import { Calendar, Search, Clock, Users, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function EventsPage() {
  const { events, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [onlyToday, setOnlyToday] = useState(false);
  const [onlyWeekend, setOnlyWeekend] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadCounts(ids: string[]) {
      const pairs = await Promise.all(
        ids.map(async (eid) => {
          const { count } = await supabase
            .from("event_registrations")
            .select("id", { count: "exact", head: true })
            .eq("event_id", eid);
          return [eid, Number(count ?? 0)] as const;
        })
      );
      if (!ignore) {
        const next: Record<string, number> = {};
        for (const [k, v] of pairs) next[k] = v;
        setCounts(next);
      }
    }

    const ids = (events || []).map((e: any) => String(e.id));
    if (ids.length) loadCounts(ids);

    const ch = supabase
      .channel("events-index-registrations")
      .on(
        "postgres_changes",
        { schema: "public", table: "event_registrations", event: "*" },
        async (payload: any) => {
          const eid = String(payload.new?.event_id ?? payload.old?.event_id ?? "");
          if (!eid) return;
          const { count } = await supabase
            .from("event_registrations")
            .select("id", { count: "exact", head: true })
            .eq("event_id", eid);
          if (!ignore) {
            setCounts((prev) => ({ ...prev, [eid]: Number(count ?? 0) }));
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(ch);
    };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event: any) => {
        const title = (event.title ?? "").toLowerCase();
        const desc = (event.description ?? "").toLowerCase();
        const matchesSearch =
          title.includes(searchTerm.toLowerCase()) ||
          desc.includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          (event.category ?? "") === selectedCategory;

        const d = new Date(event.date);
        const eventMonth = d.getMonth();
        const matchesMonth =
          selectedMonth === "all" || parseInt(selectedMonth, 10) === eventMonth;

        return matchesSearch && matchesCategory && matchesMonth;
      })
      .sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [events, searchTerm, selectedCategory, selectedMonth]);

  const enhancedFilteredEvents = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;

    const isWeekend = (d: Date) => {
      const day = d.getDay();
      return day === 6 || day === 0;
    };

    return filteredEvents.filter((ev: any) => {
      const d = new Date(ev.date);
      const t = d.getTime();

      if (onlyToday && !(t >= startOfToday && t <= endOfToday)) return false;
      if (onlyWeekend && !isWeekend(d)) return false;

      return true;
    });
  }, [filteredEvents, onlyToday, onlyWeekend, counts]);

  const groupedByMonth = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("es-ES", {
      month: "long",
      year: "numeric",
    });
    const groups: Record<
      string,
      { label: string; items: typeof enhancedFilteredEvents }
    > = {};

    const items = [...enhancedFilteredEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const ev of items) {
      const d = new Date(ev.date);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      if (!groups[key]) groups[key] = { label: fmt.format(d), items: [] as any };
      groups[key].items.push(ev);
    }
    return groups;
  }, [enhancedFilteredEvents]);

  const categories = useMemo(
    () => Array.from(new Set(events.map((e: any) => e.category).filter(Boolean))),
    [events]
  );

  const months = [
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" },
  ];

  if (loading) {
    return (
      <section>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-emerald-600">
            <Calendar className="h-12 w-12" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <EventsHero events={events} />

      <section id="explorar" className="py-10 bg-white font-sans">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-sans"
          >
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-emerald-100/70 bg-white/85 backdrop-blur-sm shadow-[0_10px_30px_rgba(16,185,129,0.07)]">
              <div className="absolute inset-x-0 top-0 h-1.5 opacity-60 bg-[linear-gradient(90deg,#34d399_0%,#a7f3d0_35%,#fff7ed_100%)]" />
              <div className="p-4 sm:p-5">
                {/* DESKTOP: tabs de categorías */}
                <nav className="border-b border-emerald-100/70 hidden sm:block">
                  <ul className="flex flex-wrap gap-4 sm:gap-6">
                    {["all", ...categories].map((cat) => {
                      const label = cat === "all" ? "Todos los eventos" : cat;
                      const active = selectedCategory === cat;
                      return (
                        <li key={cat}>
                          <button
                            onClick={() => setSelectedCategory(cat)}
                            aria-pressed={active}
                            className={`relative pb-2 text-[14px] sm:text-[15px] transition-colors focus:outline-none ${active
                              ? "text-emerald-800 font-semibold"
                              : "text-neutral-700 hover:text-emerald-700"
                              }`}
                          >
                            {label}
                            {active && (
                              <motion.span
                                layoutId="cat-underline"
                                className="absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full bg-emerald-600"
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 30,
                                }}
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* MOBILE: categoría + mes + search + chips */}
                <div className="mt-3 space-y-3 sm:hidden">
                  {/* Row 1: categoría + mes */}
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="h-10 w-full rounded-xl border border-emerald-100 bg-white focus:ring-emerald-300 font-sans">
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent className="font-sans">
                        <SelectItem className="font-sans" value="all">
                          Todos los eventos
                        </SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c} className="font-sans">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="h-10 w-full rounded-xl border border-emerald-100 bg-white focus:ring-emerald-300 font-sans">
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent className="font-sans">
                        <SelectItem className="font-sans" value="all">
                          Todos los meses
                        </SelectItem>
                        {months.map((m) => (
                          <SelectItem
                            className="font-sans"
                            key={m.value}
                            value={m.value}
                          >
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Row 2: search */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      placeholder="Buscar experiencias…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-10 pl-9 pr-3 rounded-xl border border-emerald-100 bg-white focus:ring-emerald-300 placeholder:text-neutral-400 font-sans"
                    />
                  </div>

                  {/* Row 3: Hoy / Fin de semana */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOnlyToday((v) => !v)}
                      className={`h-10 px-3 rounded-md text-[13px] ring-1 transition font-sans ${onlyToday
                        ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                        : "bg-white text-neutral-700 ring-emerald-100 hover:bg-emerald-50/60"
                        }`}
                    >
                      Hoy
                    </button>
                    <button
                      onClick={() => setOnlyWeekend((v) => !v)}
                      className={`h-10 px-3 rounded-md text-[13px] ring-1 transition font-sans ${onlyWeekend
                        ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                        : "bg-white text-neutral-700 ring-emerald-100 hover:bg-emerald-50/60"
                        }`}
                    >
                      Fin de semana
                    </button>
                  </div>
                </div>

                {/* DESKTOP: search + mes + chips en una fila */}
                <div className="mt-4 hidden sm:flex sm:flex-row sm:items-center sm:gap-3">
                  <div className="relative w-full sm:w-[280px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      placeholder="Buscar experiencias…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-10 pl-9 pr-3 rounded-xl border border-emerald-100 bg-white focus:ring-emerald-300 placeholder:text-neutral-400 font-sans"
                    />
                  </div>

                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="h-10 w-48 rounded-xl border border-emerald-100 bg-white focus:ring-emerald-300 font-sans">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent className="font-sans">
                      <SelectItem className="font-sans" value="all">
                        Todos los meses
                      </SelectItem>
                      {months.map((m) => (
                        <SelectItem
                          className="font-sans"
                          key={m.value}
                          value={m.value}
                        >
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOnlyToday((v) => !v)}
                      className={`h-10 px-3 rounded-md text-[13px] ring-1 transition font-sans ${onlyToday
                        ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                        : "bg-white text-neutral-700 ring-emerald-100 hover:bg-emerald-50/60"
                        }`}
                    >
                      Hoy
                    </button>
                    <button
                      onClick={() => setOnlyWeekend((v) => !v)}
                      className={`h-10 px-3 rounded-md text-[13px] ring-1 transition font-sans ${onlyWeekend
                        ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                        : "bg-white text-neutral-700 ring-emerald-100 hover:bg-emerald-50/60"
                        }`}
                    >
                      Fin de semana
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.header>


          <div className="pt-8 event-list">
            {enhancedFilteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-center py-20 rounded-3xl bg-emerald-50/40 ring-1 ring-emerald-100"
              >
                <Calendar className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-neutral-700 mb-2">
                  No se encontraron eventos
                </h3>
                <p className="text-neutral-500 mb-6">
                  Probá ajustar tus filtros o limpiar la búsqueda
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedMonth("all");
                    setSelectedCategory("all");
                    setOnlyToday(false);
                    setOnlyWeekend(false);
                  }}
                  variant="outline"
                  className="rounded-full"
                >
                  Limpiar filtros
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedByMonth).map(([key, group]) => (
                  <section key={key} className="space-y-4 grid gap-5">
                    <div className="sticky top-[64px] z-[5] -mx-4 sm:mx-0 px-4 sm:px-0">
                      <div
                        className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold text-neutral-800 capitalize ring-1 ring-emerald-100 bg-white"
                        style={{
                          background:
                            "linear-gradient(90deg,#FFF7ED 0%, rgba(255,247,237,0) 100%)",
                        }}
                      >
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span className="font-sans">{(group as any).label}</span>
                      </div>
                    </div>

                    <div className="space-y-3 grid gap-5">
                      {(group as any).items.map((event: any) => {
                        const d = new Date(event.date);
                        const isPast = d.getTime() < Date.now();
                        const isToday = d.toDateString() === new Date().toDateString();
                        const dd = d.getDate().toString().padStart(2, "0");
                        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
                        const weekday = d
                          .toLocaleDateString("es-ES", { weekday: "long" })
                          .toUpperCase();
                        const cap = event.capacity ?? 0;
                        const enr = counts[String(event.id)] ?? event.enrolled ?? 0;
                        const hasSpots = cap > 0 ? cap - enr > 0 : true;
                        const pct =
                          cap > 0 ? Math.min(100, Math.max(0, (enr / cap) * 100)) : 0;

                        return (
                          <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="group block"
                          >
                            <motion.article
                              initial={{ opacity: 0, y: 8 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.25 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="grid grid-cols-1 sm:grid-cols-[180px,1fr,auto] items-stretch gap-3 sm:gap-6 rounded-xl overflow-hidden relative bg-gradient-to-br from-white to-emerald-50/20 ring-1 ring-inset ring-emerald-100/70 hover:ring-emerald-200 hover:shadow-[0_12px_28px_rgba(16,185,129,0.10)] border-l-4 border-l-emerald-200/70 transition-[transform,box-shadow,border-color] duration-200 ease-out cursor-pointer sm:min-h-[220px]"
                            >
                              <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle_at_1px_1px,#10b981_1px,transparent_1px)] [background-size:14px_14px]" />

                              {/* Imagen */}
                              <div
                                className="relative overflow-hidden w-full h-[200px] sm:w-[180px] sm:h-[220px]rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                              >
                                <img
                                  src={event.flyerVertical || event.poster || event.image}
                                  alt={event.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                  loading="lazy"
                                />
                                {isToday && !isPast && (
                                  <span className="absolute top-2 left-2 rounded-md bg-emerald-600/95 px-2 py-0.5 text-[11px] font-semibold text-white">
                                    ¡Hoy!
                                  </span>
                                )}
                                {isPast && (
                                  <span className="absolute top-2 left-2 rounded-md bg-neutral-800/90 px-2 py-0.5 text-[11px] font-semibold text-white">
                                    Finalizado
                                  </span>
                                )}
                              </div>
                              {/* Contenido */}
                              <div className="grid grid-cols-[1fr_auto] gap-2 px-3 pb-3 pt-2 sm:contents">
                                <div className="py-3 pr-2 sm:py-3 sm:pr-2 sm:pl-0">
                                  <h4 className="text-[20px] sm:text-[22px] font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors font-sans">
                                    {event.title}
                                  </h4>

                                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-neutral-700 font-sans">
                                    <span className="inline-flex items-center gap-1.5">
                                      <Calendar className="h-4 w-4 text-emerald-600" />
                                      {`${weekday} ${dd}/${mm}`}
                                    </span>
                                    {event.time && (
                                      <span className="inline-flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-emerald-600" />
                                        {event.time}
                                      </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 min-w-0">
                                      <MapPin className="h-4 w-4 text-emerald-600" />
                                      <span className="truncate">
                                        {event.location || "BOA – Espacio Principal"}
                                      </span>
                                    </span>
                                  </div>

                                  {typeof cap === "number" && cap > 0 ? (
                                    <div className="mt-3 inline-flex items-center gap-3 rounded-lg bg-emerald-50/40 ring-1 ring-emerald-100 px-2.5 py-1.5 font-sans">
                                      <div
                                        className="relative h-8 w-8 rounded-full grid place-items-center"
                                        style={{
                                          background: `conic-gradient(#10b981 ${pct}%, #e6f5ef ${pct}% 100%)`,
                                        }}
                                        aria-label={`Capacidad ${enr} de ${cap}`}
                                        role="img"
                                      >
                                        <div className="absolute inset-[3px] rounded-full bg-white" />
                                        <span className="relative text-[10px] font-bold text-emerald-700 tabular-nums">
                                          {Math.max(0, cap - enr)}
                                        </span>
                                      </div>
                                      <div className="leading-tight">
                                        <div className="text-[12px] font-semibold text-neutral-900">
                                          Capacidad
                                        </div>
                                        <div className="text-[12px] text-neutral-700 tabular-nums">
                                          {enr}/{cap}{" "}
                                          <span className="text-neutral-500">•</span>{" "}
                                          Quedan {Math.max(0, cap - enr)}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-neutral-50 ring-1 ring-neutral-200 px-2.5 py-1">
                                      <Users className="h-4 w-4 text-neutral-500" />
                                      <span className="text-[12px] text-neutral-700 font-sans">
                                        Capacidad no definida
                                      </span>
                                    </div>
                                  )}

                                  {event.description && (
                                    <p className="mt-2 text-[13px] text-neutral-600 line-clamp-2 font-sans">
                                      {event.description}
                                    </p>
                                  )}
                                </div>

                                <div className="px-1 sm:px-4 py-3 flex flex-col items-end gap-2 sm:gap-3">
                                  <div className="text-[15px] font-bold text-emerald-700 font-sans">
                                    ${event.price}
                                  </div>
                                  {/* Este botón ahora es puramente visual; el Link exterior maneja el click */}
                                  <Button
                                    size="sm"
                                    className={`rounded-full font-sans ${isPast || !hasSpots
                                      ? "bg-neutral-400 hover:bg-neutral-400 cursor-not-allowed"
                                      : "bg-emerald-600 hover:bg-emerald-700"
                                      }`}
                                    disabled={isPast || !hasSpots}
                                  >
                                    {isPast
                                      ? "Finalizado"
                                      : !hasSpots
                                        ? "Completo"
                                        : "Ver detalles"}
                                  </Button>
                                </div>
                              </div>
                            </motion.article>
                          </Link>
                        );
                      })}

                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-sans text-3xl font-semibold text-neutral-900 mb-4">
              ¿Querés formar parte de nuestros Eventos?
            </h2>

            <p className="font-sans text-lg text-neutral-600 mb-8">
              En BOA nos encanta colaborar con talentosos artistas.
              <br />
              Si tenés una propuesta para un taller, charla o evento especial,
              contánoslo.
            </p>

            <div className="flex justify-center">
              <Link href="/contact" className="group">
                <Button
                  size="lg"
                  className="relative overflow-hidden font-sans px-8 py-3 rounded-2xl bg-emerald-700 text-white shadow-[0_12px_30px_rgba(16,185,129,.22)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                  style={{ willChange: "transform" }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_0_1px_rgba(255,255,255,.06),0_22px_40px_rgba(16,185,129,.28)]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-y-8 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-120%] group-hover:translate-x-[320%] transition-transform duration-700 ease-out"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl ring-1 ring-emerald-300/40 group-hover:ring-emerald-200/70 transition duration-300"
                  />
                  Contáctanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </section>
  );
}
