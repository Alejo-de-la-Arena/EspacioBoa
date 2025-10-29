import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Activity, Event, MenuItem, AppContextType } from "@/types";
import { useGiftCards } from "@/hooks/useGiftCards";
import { supabase } from "@/lib/supabaseClient";

const AppContext = createContext<AppContextType>({
    activities: [],
    events: [],
    menuItems: [],
    giftCards: [],
    loading: true,
});

export function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    // Giftcards reales desde Supabase (is_active = true) + realtime
    const { giftCards, loading: giftCardsLoading /*, error: giftCardsError */ } = useGiftCards();

    // Loading global = eventos cargando || giftcards cargando
    const [eventsLoading, setEventsLoading] = useState(true);
    const loading = eventsLoading || giftCardsLoading;

    // ===== Carga pública de eventos (solo publicados) + realtime =====
    useEffect(() => {
        let alive = true;

        const adapt = (r: any) => ({
            ...r,
            // compat con UI actual:
            date: r.start_at,
            time: r.end_at ? "" : "",
            image: r.hero_image ?? (Array.isArray(r.gallery) ? r.gallery[0] : null),
            flyerVertical: Array.isArray(r.gallery) ? r.gallery[0] : null,
            poster: Array.isArray(r.gallery) ? r.gallery[1] : null,
            enrolled: r.enrolled ?? 0,
        });

        async function load() {
            setEventsLoading(true);
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .eq("is_published", true)
                .order("start_at", { ascending: true });

            if (!alive) return;

            if (error) {
                console.error("events load error:", error);
                setEvents([]);
                setEventsLoading(false);
                return;
            }

            setEvents((data ?? []).map(adapt));
            setEventsLoading(false);
        }

        load();

        // realtime para que el listado público se actualice solo
        const ch = supabase
            .channel("rt-events-public")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "events" },
                () => load()
            )
            .subscribe();

        return () => {
            alive = false;
            supabase.removeChannel(ch);
        };
    }, []);

    // ===== Mock solo para menú (se mantiene igual) =====
    useEffect(() => {
        const mockMenuItems: MenuItem[] = [
            {
                id: "1",
                name: "Espresso Single Origin",
                description: "Café de origen único de Colombia, notas a chocolate y caramelo",
                image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
                price: 3500,
                category: "Café",
                featured: true,
            },
            {
                id: "2",
                name: "Bowl de Açaí",
                description: "Bowl energético con açaí, granola casera, frutas frescas y miel",
                image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
                price: 8500,
                category: "Desayunos",
                featured: true,
                isVegan: true,
            },
            {
                id: "3",
                name: "Avocado Toast",
                description: "Pan integral con palta, tomates cherry, aceite de oliva y semillas",
                image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
                price: 7500,
                category: "Desayunos",
                featured: false,
                isVegan: true,
            },
        ];

        setMenuItems(mockMenuItems);
    }, []);

    // (Opcional) Si querés derivar una giftcard "popular" sin tocar DB:
    // const giftCardsWithPopular = useMemo(() => {
    //   if (!giftCards?.length) return giftCards;
    //   const max = Math.max(...giftCards.map((g: any) => Number(g.value ?? 0)));
    //   return giftCards.map((g: any) => ({ ...g, popular: Number(g.value ?? 0) === max }));
    // }, [giftCards]);

    const value: AppContextType = {
        activities,
        events,
        menuItems,
        giftCards, // usar giftcards reales (si querés el derivado, cambia por giftCardsWithPopular)
        loading,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppContextProvider");
    }
    return context;
}

export default AppContext;
