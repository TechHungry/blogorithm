// src/app/api/request-access/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { requestAccess, getUser, saveUser } from '@/lib/userPermissions';
import { UserRole } from '@/lib/clientUserPermissions';

export async function POST(request: NextRequest) {
    try {
        // Get the current session to verify the user
        const session = await getServerSession();

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get email from request body as a double-check
        const { email } = await request.json();

        // Verify the email matches the session
        if (email !== session.user.email) {
            return NextResponse.json({ error: 'Email mismatch' }, { status: 401 });
        }

        // Get or create user
        let user = await getUser(email);

        if (!user) {
            // Create new user
            user = {
                id: crypto.randomUUID(),
                name: session.user.name || 'Unknown',
                email: session.user.email,
                image: session.user.image || undefined,
                role: UserRole.PENDING,
                createdAt: new Date().toISOString()
            };

            // Save the new user
            await saveUser(user);
        } else {
            // Update existing user to pending
            user.role = UserRole.PENDING;
            await saveUser(user);
        }

        // Set the user role to pending
        await requestAccess(email);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing access request:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}