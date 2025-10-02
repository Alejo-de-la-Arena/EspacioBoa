
import React, { createContext, useContext, useState, useEffect } from "react";
import { Activity, Event, MenuItem, GiftCard, AppContextType, Person } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const AppContext = createContext<AppContextType>({
    activities: [],
    events: [],
    menuItems: [],
    giftCards: [],
    loading: true
});

export function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
    const [loading, setLoading] = useState(true);



    // …

    useEffect(() => {
        let alive = true;

        const adapt = (r: any) => ({
            ...r,
            // compatibilidad con tu UI actual:
            date: r.start_at,                                     // EventsPage usa `event.date`
            time: r.end_at ? "" : "",                             // si más adelante querés derivar hora: new Date(r.start_at).toLocaleTimeString(...)
            image: r.hero_image ?? (Array.isArray(r.gallery) ? r.gallery[0] : null),
            flyerVertical: Array.isArray(r.gallery) ? r.gallery[0] : null,
            poster: Array.isArray(r.gallery) ? r.gallery[1] : null,
            enrolled: r.enrolled ?? 0,                            // si no tenés inscriptos, usamos 0
        });

        async function load() {
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .eq("is_published", true)        // público: solo publicados
                .order("start_at", { ascending: true });

            if (!alive) return;
            if (error) {
                console.error("events load error:", error);
                setEvents([]);                   // no rompas UI
                setLoading(false);
                return;
            }
            setEvents((data ?? []).map(adapt));
            setLoading(false);
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




    useEffect(() => {
        const initializeData = () => {
            // Mock instructors/facilitators
            const instructor1: Person = {
                name: "María González",
                specialty: "Yoga y Meditación",
                bio: "Instructora certificada con más de 10 años de experiencia en yoga vinyasa y mindfulness. Le apasiona guiar a otros en su camino hacia el bienestar integral.",
                image: "https://images.unsplash.com/photo-1494790108755-2616b4b12eb1?w=300",
                experience: 10,
                phone: "+56 9 1234 5678",
                email: "maria@espacioboa.cl"
            };

            const instructor2: Person = {
                name: "Carlos Mendoza",
                specialty: "Arte Terapia",
                bio: "Artista y terapeuta especializado en procesos creativos. Combina técnicas tradicionales de pintura con enfoques terapéuticos modernos.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
                experience: 8,
                phone: "+56 9 2345 6789",
                email: "carlos@espacioboa.cl"
            };

            const instructor3: Person = {
                name: "Ana Rodríguez",
                specialty: "Mindfulness y Relajación",
                bio: "Especialista en técnicas de relajación y reducción de estrés. Certificada en MBSR y con formación en psicología clínica.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
                experience: 12
            };

            // Mock menu items
            const mockMenuItems: MenuItem[] = [
                {
                    id: "1",
                    name: "Espresso Single Origin",
                    description: "Café de origen único de Colombia, notas a chocolate y caramelo",
                    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
                    price: 3500,
                    category: "Café",
                    featured: true
                },
                {
                    id: "2",
                    name: "Bowl de Açaí",
                    description: "Bowl energético con açaí, granola casera, frutas frescas y miel",
                    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
                    price: 8500,
                    category: "Desayunos",
                    featured: true,
                    isVegan: true
                },
                {
                    id: "3",
                    name: "Avocado Toast",
                    description: "Pan integral con palta, tomates cherry, aceite de oliva y semillas",
                    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
                    price: 7500,
                    category: "Desayunos",
                    featured: false,
                    isVegan: true
                }
            ];

            // Mock gift cards
            const mockGiftCards: GiftCard[] = [
                {
                    id: "1",
                    name: "Experiencia Bienestar",
                    description: "Perfect para quien busca relajación y conexión",
                    value: 25000,
                    benefits: ["3 clases de yoga", "1 sesión de meditación", "Café de bienvenida"],
                    popular: true
                },
                {
                    id: "2",
                    name: "Café Lover",
                    description: "Para los amantes del café de especialidad",
                    value: 40000,
                    benefits: ["5 cafés premium", "1 taller de barismo", "Descuento en granos"],
                    popular: false
                },
                {
                    id: "2",
                    name: "Tarot",
                    description: "Para los amantes del tarot de calidad",
                    value: 12500,
                    benefits: ["2 sesiónes gratis", "1 taller de instruccion", "Descuento en actividades relacionadas"],
                    popular: false
                }
            ];

            setMenuItems(mockMenuItems);
            setGiftCards(mockGiftCards);
            setLoading(false);
        };

        // Simulate loading time
        const t = setTimeout(initializeData, 1000);
        return () => clearTimeout(t);
    }, []);

    const value: AppContextType = {
        activities,
        events,
        menuItems,
        giftCards,
        loading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppContextProvider");
    }
    return context;
}

export default AppContext;
