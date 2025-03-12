// src/app/auth/error/config.ts

// Force dynamic rendering to avoid static generation
export const dynamic = 'force-dynamic';

// Tell Next.js to skip this page during static export
export const generateStaticParams = () => {
    return [];
};