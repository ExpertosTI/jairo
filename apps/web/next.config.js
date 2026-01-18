/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'placehold.co' },
            { protocol: 'https', hostname: '**' },
        ],
    },
};

export default nextConfig;
