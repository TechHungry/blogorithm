// src/app/api/admins/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from 'redis';
import { getAdminEmail, getUserRole, getUsers } from '@/lib/userPermissions';
import { UserRole } from '@/lib/clientUserPermissions';

// Function to get Redis client
async function getRedisClient() {
    const client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    if (!client.isOpen) {
        await client.connect();
    }

    return client;
}

// GET all admins - only accessible by admin
export async function GET(request: NextRequest) {
    try {
        // Get current session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the primary admin email
        const primaryAdminEmail = await getAdminEmail();

        // Check if user is admin (for now, only the primary admin can see this)
        const userRole = await getUserRole(session.user.email);
        if (userRole !== UserRole.ADMIN && session.user.email !== primaryAdminEmail) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get all users
        const allUsers = await getUsers();

        // Filter admin users
        const admins = allUsers.filter(user => user.role === UserRole.ADMIN);

        // If primary admin isn't in the list (might happen if they haven't signed in yet)
        if (primaryAdminEmail && !admins.some(admin => admin.email === primaryAdminEmail)) {
            admins.push({
                id: 'primary-admin',
                name: 'Primary Admin',
                email: primaryAdminEmail,
                role: UserRole.ADMIN,
                createdAt: new Date().toISOString()
            });
        }

        return NextResponse.json({
            admins,
            primaryAdminEmail
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// Support adding additional admins (only the primary admin can do this)
export async function POST(request: NextRequest) {
    try {
        // Get current session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the primary admin email
        const primaryAdminEmail = await getAdminEmail();

        // Only the primary admin can add other admins
        if (session.user.email !== primaryAdminEmail) {
            return NextResponse.json({ error: 'Only the primary admin can add other admins' }, { status: 403 });
        }

        // Get email from request body
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Set the user as admin
        const client = await getRedisClient();
        const userKey = `user:${email}`;
        const userData = await client.get(userKey);

        if (userData) {
            // Update existing user
            const user = JSON.parse(userData);
            user.role = UserRole.ADMIN;
            await client.set(userKey, JSON.stringify(user));
        } else {
            // Create new user
            const newUser = {
                id: crypto.randomUUID(),
                name: email.split('@')[0], // Temporary name based on email
                email,
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

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding admin:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}