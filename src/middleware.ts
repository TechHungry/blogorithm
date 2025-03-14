// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from './lib/clientUserPermissions';

export async function middleware(request: NextRequest) {
    // Skip middleware during build time
    const userAgent = request.headers.get('user-agent') || '';
    if (!userAgent ||
        userAgent.includes('Node.js') ||
        userAgent.includes('Vercel')) {
        return NextResponse.next();
    }

    try {
        // Get the session token (for all protected routes)
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        // Log token details for debugging
        console.log(`Middleware token:`, {
            email: token?.email,
            role: token?.role,
            path: request.nextUrl.pathname
        });

        // Only protect the /write route
        if (request.nextUrl.pathname === '/write') {
            // If no token (not signed in) redirect to sign in
            if (!token) {
                const signInUrl = new URL('/api/auth/signin', request.url);
                signInUrl.searchParams.set('callbackUrl', request.url);
                return NextResponse.redirect(signInUrl);
            }

            // Check if user has write permission
            const role = token.role as UserRole;
            if (role !== UserRole.WRITER && role !== UserRole.ADMIN) {
                // Redirect to access request page
                return NextResponse.redirect(new URL('/request-access', request.url));
            }
        }

        // Also protect the /authorize admin page
        if (request.nextUrl.pathname === '/authorize') {
            // If not signed in, redirect to sign in
            if (!token) {
                const signInUrl = new URL('/api/auth/signin', request.url);
                signInUrl.searchParams.set('callbackUrl', request.url);
                return NextResponse.redirect(signInUrl);
            }

            // Check if the user is an admin
            const role = token.role as UserRole;
            console.log(`Admin check: ${token.email} has role ${role}`);

            if (role !== UserRole.ADMIN) {
                // If not an admin, redirect to unauthorized
                console.log(`Access denied for ${token.email} to /authorize`);
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/write',
        '/authorize',
        '/admin/:path*',
        '/profile',
        '/profile/new-post',
        '/profile/edit/:path*'
    ]
};