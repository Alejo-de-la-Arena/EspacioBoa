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
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true };
}
