
export interface Schedule {
    day: string;
    time: string;
}

export interface Person {
    name: string;
    specialty: string;
    bio: string;
    image: string;
    experience?: number;
    phone?: string;
    email?: string;
}

export type Activity = {
    id: string | number;
    title: string;
    description: string;
    images: string[];
    image?: string;
    category: string;
    price?: number;
    featured?: boolean;
    schedule: { day: string; time: string };
    location: string;
    enrolled: number;
    capacity: number;
    instructor: Person;
};

export interface Event {
    id: string;
    title: string;
    description: string;
    image: string;
    flyerVertical?: string;   // <- ahora opcional
    poster?: string;          // <- alias opcional (si lo querés usar)
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
