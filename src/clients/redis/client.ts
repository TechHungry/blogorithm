// src/clients/redis/client.ts;
import { createClient } from 'redis';

// Get Redis clients
export default async function getRedisClient() {
    const client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    if (!client.isOpen) {
        await client.connect();
    }

    return client;
}