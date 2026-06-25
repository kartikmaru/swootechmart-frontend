/** @type {import('next').NextConfig} */
const nextConfig = {
    // React Compiler — performance optimization (stable key in Next.js 16)
    reactCompiler: true,

    // Image domains — allow external image sources used across the app
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'swootechmart-backend.onrender.com',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
