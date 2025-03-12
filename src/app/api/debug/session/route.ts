// src/app/api/debug/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/options';
import { getAdminEmail, getUserRole } from '@/lib/userPermissions';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({
                error: 'Not authenticated',
                authenticated: false
            });
        }

        // Check if the current user is registered as admin
        const adminEmail = await getAdminEmail();
        const isRegisteredAdmin = session.user.email === adminEmail;

        // Get the current role from Redis
        const currentRole = await getUserRole(session.user.email);

        // Get the role from session
        const sessionRole = (session.user as any).role;

        return NextResponse.json({
            authenticated: true,
            user: {
                name: session.user.name,
                email: session.user.email,
                image: session.user.image
            },
            isRegisteredAdmin,
            adminEmail,
            currentRole,
            sessionRole,
            roleMatch: currentRole === sessionRole
        });
    } catch (error) {
        console.error('Error in debug session API:', error);
        return NextResponse.json({
            error: 'Server error',
            errorDetails: String(error)
        }, { status: 500 });
    }
}