// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/tokenStorage';

export function middleware(request: NextRequest) {
    // Skip middleware during build time by checking for Node.js user agent
    // This is a reliable way to detect build/prerender requests
    const userAgent = request.headers.get('user-agent') || '';
    if (!userAgent ||
        userAgent.includes('Node.js') ||
        userAgent.includes('Vercel')) {
        return NextResponse.next();
    }

    // Only protect the /write route
    if (request.nextUrl.pathname === '/write') {
        try {
            const token = request.nextUrl.searchParams.get('token');

            if (!token || !validateToken(token)) {
                // Redirect to unauthorized page
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        } catch (error) {
            // If validation throws an error, redirect to unauthorized
            console.error('Token validation error:', error);
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/write'
};