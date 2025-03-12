// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUsers, getUserRole, UserRole } from '@/lib/userPermissions';

// GET all users - only accessible by admin
export async function GET(request: NextRequest) {
    try {
        // Get current session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const userRole = await getUserRole(session.user.email);
        if (userRole !== UserRole.ADMIN) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch all users
        const users = await getUsers();

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}