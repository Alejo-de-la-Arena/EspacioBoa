// lib/services/auth.ts
type RegisterPayload = {
    name: string;
    email: string;
    phone: string | null;
    password: string;
    csrfToken?: string;
    recaptchaToken?: string | null;
};

type ServiceResult = { ok: boolean; message?: string };

export async function registerUser(payload: RegisterPayload): Promise<ServiceResult> {
    // TODO: reemplazar por tu endpoint real
    // Ejemplo:
    // const res = await fetch("/api/auth/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    //   credentials: "include",
    // });
    // if (!res.ok) return { ok: false, message: (await res.json()).message };
    // return { ok: true };

    // Stub temporal (simula éxito)
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true };
}
