/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // 🔕 Oculta el Dev Tools/Dev Indicator de Next en desarrollo
    devIndicators: false,

    // Admite imágenes externas en next/image
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "plus.unsplash.com" }
        ],
        // Si preferís domains:
        // domains: ["res.cloudinary.com", "images.unsplash.com"],
    },

    // (Opcional) si tu entorno de dev necesita esto; Next lo ignora si no lo usa.
    allowedDevOrigins: ["*.daytona.work"],
};

export default nextConfig;
