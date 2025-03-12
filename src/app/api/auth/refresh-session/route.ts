// src/app/api/auth/refresh-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserRole } from '@/lib/userPermissions';

/**
 * This route refreshes the user's session by forcing an update of their role from Redis
 * It's particularly useful after an admin changes a user's role, without requiring them to sign out
 */
export async function GET(request: NextRequest) {
    try {
        // Get current session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get updated role from Redis
        const updatedRole = await getUserRole(session.user.email);

        // Return the updated role - the client will use this to guide the user
        return NextResponse.json({
            success: true,
            session: {
                user: {
                    ...session.user,
                    role: updatedRole
                }
            },
            roleUpdated: (session.user as any).role !== updatedRole
        });
    } catch (error) {
        console.error('Error refreshing session:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}