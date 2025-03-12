// src/app/api/users/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserRole, setUserRole, UserRole, getUser } from '@/lib/userPermissions';

export async function PUT(request: NextRequest) {
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

        // Get email and role from request body
        const { email, role } = await request.json();

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }

        // Validate the role
        if (!Object.values(UserRole).includes(role as UserRole)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Prevent changing admin role
        const targetUserRole = await getUserRole(email);
        if (targetUserRole === UserRole.ADMIN) {
            return NextResponse.json({ error: 'Cannot change admin role' }, { status: 403 });
        }

        // Set user role - this now updates both the user object and the dedicated role key
        await setUserRole(email, role as UserRole);

        // Log the change
        console.log(`Role updated for ${email} to ${role} by admin ${session.user.email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 });
    }
}