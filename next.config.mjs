/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    devIndicators: false,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "plus.unsplash.com" },

            {
                protocol: "https",
                hostname: "gzwgocdsdkamimxgmcue.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
        ],
        formats: ["image/avif", "image/webp"],
        deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2560],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },
    allowedDevOrigins: ["*.daytona.work"],
};

export default nextConfig;
