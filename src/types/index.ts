
export interface Schedule {
    day: string;
    time: string;
}

// types.ts
export interface Person {
    id: string;
    name: string;
    specialty?: string;
    bio?: string;
    image?: string;
}

export interface Activity {
    id: string ;              // ← vuelve a permitir number
    slug?: string;
    title: string;
    description: string;
    images?: string[];                // ← ahora opcional
    image?: string;
    category: string;
    price?: number;
    featured?: boolean;
    schedule: { day: string; time: string }; // seguimos exigiendo schedule
    location: string;
    enrolled: number;
    capacity: number;
    instructor?: Person;
    start_at?: string; // ISO
    end_at?: string;   // ISO
    is_published?: boolean;
    hero_image?: string;
    gallery?: string[] | any;
}


export interface Event {
    id: string;
    title: string;
    description: string;
    image: string;
    flyerVertical?: string;  
    poster?: string;    
    date: string;
    time: string;
    capacity: number;
    enrolled: number;
    price: number;
    featured?: boolean;
    category: string;
    location?: string;
    facilitator?: Person;

    // opcionales para el “flyer signature”
    artist?: string;
    dj?: string;
    speaker?: string;
    facilitatorName?: string;
    host?: string;
    teacher?: string;
    guide?: string;
}


export interface MenuItem {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    featured?: boolean;
    isVegan?: boolean;
}

export interface GiftCard {
    id: string;
    name: string;
    description: string;
    value: number;
    benefits: string[];
    popular?: boolean;
}

export interface AppContextType {
    activities: Activity[];
    events: Event[];
    menuItems: MenuItem[];
    giftCards: GiftCard[];
    loading: boolean;
}
