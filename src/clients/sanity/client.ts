import { createClient } from "next-sanity";

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9ykzm040',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_SECRET_TOKEN
});