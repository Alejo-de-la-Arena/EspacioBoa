/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Admite imágenes externas en next/image
    images: {
        // Podés usar 'domains' o 'remotePatterns'. Acá dejo ambos hosts por patrón.
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
        ],
        // Si preferís domains, también serviría:
        // domains: ['res.cloudinary.com', 'images.unsplash.com'],
    },

    // (Opcional) si tu entorno de dev necesita esto; Next lo ignora si no lo usa.
    allowedDevOrigins: ['*.daytona.work'],
};

export default nextConfig;

