
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

export default function Layout({ children, className = "" }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className={`flex-1 ${className}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
