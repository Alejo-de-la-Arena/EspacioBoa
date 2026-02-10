
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
    email?: string;
    experience?: string;
    phone?: number;
}

export type RecurrenceRule = {
    byWeekday: number[]; // ej: [4] si usás JUE=4 (ver nota abajo)
    until?: string | null; // ISO opcional
};

export interface Activity {
    id: string;
    slug?: string;
    title: string;
    description: string;
    images?: string[];
    image?: string;
    category: string;
    price?: number;
    featured?: boolean;
    schedule: { day: string; time: string };
    location: string;
    enrolled: number;
    capacity: number;
    seatsRemaining?: number;
    instructor?: Person;
    start_at?: string;
    end_at?: string;
    is_published?: boolean;
    hero_image?: string;
    gallery?: string[] | any;
    is_recurring?: boolean;
    recurrence?: { byWeekday?: number[]; until?: string | null } | null;
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
    image_url?: string | null;
    is_active?: boolean | null;
}

export interface AppContextType {
    activities: Activity[];
    events: Event[];
    menuItems: MenuItem[];
    giftCards: GiftCard[];
    loading: boolean;
}
