// src/app/api/fix-admin-role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from 'redis';
import { getAdminEmail, UserRole } from '@/lib/userPermissions';

// Get Redis client
async function getRedisClient() {
    const client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    if (!client.isOpen) {
        await client.connect();
    }

    return client;
}

export async function POST(request: NextRequest) {
    try {
        // Get current session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the registered admin email
        const adminEmail = await getAdminEmail();

        // Only allow the registered admin email to use this endpoint
        if (session.user.email !== adminEmail) {
            return NextResponse.json({
                error: 'Only the registered admin can use this endpoint',
                yourEmail: session.user.email,
                adminEmail: adminEmail
            }, { status: 403 });
        }

        // If we're here, the user is the registered admin, so update Redis directly
        const client = await getRedisClient();

        // Update the user role
        const userKey = `user:${session.user.email}`;

        // Check if user exists in Redis
        const userData = await client.get(userKey);

        if (userData) {
            // Update existing user
            const user = JSON.parse(userData);
            user.role = UserRole.ADMIN;
            await client.set(userKey, JSON.stringify(user));
        } else {
            // Create new user entry
            const newUser = {
                id: crypto.randomUUID(), // Generate a new ID instead of using session.user.id
                name: session.user.name || 'Admin User',
                email: session.user.email,
                image: session.user.image,
                role: UserRole.ADMIN,
                createdAt: new Date().toISOString()
            };

            await client.set(userKey, JSON.stringify(newUser));

            // Add to users list
            const usersListStr = await client.get('users:list');
            const usersList = usersListStr ? JSON.parse(usersListStr) : [];
            usersList.push(newUser);
            await client.set('users:list', JSON.stringify(usersList));
        }

        // Additionally, ensure the user's role key is set correctly
        await client.set(`user:${session.user.email}:role`, UserRole.ADMIN);

        return NextResponse.json({
            success: true,
            message: 'Admin role successfully updated in Redis. Please sign out and sign in again to refresh your session.'
        });
    } catch (error) {
        console.error('Error fixing admin role:', error);
        return NextResponse.json({
            error: 'Server error',
            details: String(error)
        }, { status: 500 });
    }
}