// src/app/api/redis-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function GET(request: NextRequest) {
    try {
        const client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        await client.connect();
        await client.ping();
        await client.disconnect();
        return NextResponse.json({ status: 'Redis connection successful' });
    } catch (error) {
        console.error('Redis connection failed:', error);
        return NextResponse.json({ status: 'Redis connection failed', error: String(error) }, { status: 500 });
    }
}