import type { Metadata } from "next";
import LoginView from "@/components/auth/LoginView";

export const metadata: Metadata = {
    title: "Iniciar sesión | BOA",
    description: "Accedé a tu cuenta BOA",
};

export default function LoginPage() {
    // Server Component que renderiza el Client Component
    return <LoginView />;
}
