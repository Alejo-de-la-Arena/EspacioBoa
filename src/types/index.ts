
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

export interface Activity {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    schedule: Schedule;
    capacity: number;
    enrolled: number;
    price: number;
    instructor?: Person;
    featured?: boolean;
    location: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    time: string;
    capacity: number;
    enrolled: number;
    price: number;
    featured?: boolean;
    category: string;
    location?: string;
    facilitator?: Person;
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
