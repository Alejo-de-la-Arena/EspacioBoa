
import React, { createContext, useContext, useState, useEffect } from "react";
import { Activity, Event, MenuItem, GiftCard, AppContextType, Person } from "@/types";

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

            // Mock activities
            const mockActivities: Activity[] = [
                {
                    id: "1",
                    title: "Yoga Matutino",
                    description:
                        "Comenzá tu día con energía positiva a través de una práctica de yoga suave y meditación guiada.",
                    images: [
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800",
                        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
                    ],
                    category: "Bienestar",
                    schedule: { day: "Lunes", time: "08:00 - 09:00" },
                    capacity: 15,
                    enrolled: 12,
                    price: 12000,
                    instructor: instructor1,
                    featured: true,
                    location: "Terraza Zen",
                },
                {
                    id: "2",
                    title: "Arte Terapia",
                    description:
                        "Sesiones de expresión artística para liberar emociones y conectar con tu creatividad interior.",
                    images: [
                        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
                        "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?w=800",
                    ],
                    category: "Arte",
                    schedule: { day: "Miércoles", time: "19:00 - 20:30" },
                    capacity: 10,
                    enrolled: 8,
                    price: 18000,
                    instructor: instructor2,
                    featured: false,
                    location: "Salón de Eventos",
                },
                {
                    id: "3",
                    title: "Meditación Mindfulness",
                    description:
                        "Práctica de atención plena para reducir el estrés y encontrar paz interior.",
                    images: [
                        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
                        "https://images.unsplash.com/photo-1518183214770-9cffbec72538?w=800",
                        "https://images.unsplash.com/photo-1523248822161-8fa923c92b51?w=800",
                    ],
                    category: "Bienestar",
                    schedule: { day: "Viernes", time: "18:30 - 19:30" },
                    capacity: 20,
                    enrolled: 15,
                    price: 10000,
                    instructor: instructor3,
                    featured: true,
                    location: "Café Principal",
                },
                {
                    id: "4",
                    title: "AeroYoga Flow",
                    description:
                        "Práctica en columpios de tela para trabajar fuerza, elongación y juego en suspensión. No se requiere experiencia.",
                    images: [
                        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800",
                        "https://images.unsplash.com/photo-1540206395-68808572332f?w=800",
                        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
                    ],
                    category: "Aeroyoga",
                    schedule: { day: "Martes", time: "19:00 - 20:00" },
                    capacity: 12,
                    enrolled: 9,
                    price: 16000,
                    instructor: instructor1,
                    featured: false,
                    location: "Sala Aérea",
                },
                {
                    id: "5",
                    title: "Astrología: Carta Natal",
                    description:
                        "Encuentro introductorio para explorar tu carta natal y entender energías presentes. Traé tu fecha y hora de nacimiento.",
                    images: [
                        "https://images.unsplash.com/photo-1637757935037-a7837f36807d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://plus.unsplash.com/premium_photo-1701001123089-c86e2a5f5ad9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://images.unsplash.com/photo-1612323272007-3e7c28f6eb05?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    ],
                    category: "Astrología",
                    schedule: { day: "Jueves", time: "18:30 - 20:00" },
                    capacity: 18,
                    enrolled: 14,
                    price: 14000,
                    instructor: instructor2,
                    featured: true,
                    location: "Salón Luz",
                },
                {
                    id: "6",
                    title: "Taller de Café de Autor",
                    description:
                        "Introducción al barismo: molienda, proporciones, métodos de filtrado (V60, prensa) y latte art básico. Degustación incluida.",
                    images: [
                        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1061&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://images.unsplash.com/photo-1494314671902-399b18174975?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    ],
                    category: "Café",
                    schedule: { day: "Sábado", time: "11:00 - 12:30" },
                    capacity: 16,
                    enrolled: 11,
                    price: 15000,
                    instructor: instructor3,
                    featured: false,
                    location: "Café Principal",
                },
            ];



            // Mock events
            // Mock events
            const mockEvents: Event[] = [
                {
                    id: "1",
                    title: "Taller de Café de Especialidad",
                    description: "Aprende sobre el proceso completo del café, desde el grano hasta la taza perfecta.",
                    image: "https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=749&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    date: "2025-09-25",
                    time: "10:00 - 12:00",
                    capacity: 12,
                    enrolled: 8,
                    price: 25000,
                    featured: true,
                    category: "Café",
                    location: "Café Principal"
                },
                {
                    id: "2",
                    title: "Noche de Poesía y Café",
                    description: "Una velada íntima donde la poesía se encuentra con el aroma del café de especialidad.",
                    image: "https://images.unsplash.com/photo-1589469264504-e78bf7fc5ab0?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    date: "2025-010-03",
                    time: "19:00 - 21:00",
                    capacity: 25,
                    enrolled: 20,
                    price: 15000,
                    featured: true,
                    category: "Arte",
                    location: "Salón de Eventos"
                },
                {
                    id: "ecstatic-dance",
                    title: "Ecstatic Dance en la Cocina",
                    description: "Sesión de baile libre con DJ, energía alta y foco en expresión corporal.",
                    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",      // fallback horizontal
                    flyerVertical: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // versión vertical para el slider
                    date: "2025-010-27",
                    time: "20:00 - 22:00",
                    capacity: 80,
                    enrolled: 45,
                    price: 18000,
                    featured: true,
                    category: "Danza",
                    location: "ESPACIO BOA – MARTÍNEZ",
                    dj: "SofiLofi"
                }
            ];


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

            const normalizedActivities: Activity[] = mockActivities.map((a) => ({
                ...a,
                images: a.images?.length ? a.images : (a.image ? [a.image] : []),
                image: a.images?.[0] ?? a.image, // compatibilidad legacy
            }));

            setActivities(normalizedActivities);
            setEvents(mockEvents);
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
