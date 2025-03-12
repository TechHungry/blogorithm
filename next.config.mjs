/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // This creates a standalone build with better optimization

    reactStrictMode: true,
    serverExternalPackages: ['redis'],
    images: {
        domains: ['cdn.sanity.io'],
    },
    headers: () => [
        {
            source: '/components',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'no-store',
                },
            ],
        },
    ],
};

export default nextConfig;
