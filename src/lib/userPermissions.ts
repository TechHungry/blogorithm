// src/lib/userPermissions.ts
// Note: We're removing the 'use server' directive since we'll handle server actions differently

import { createClient } from 'redis';

export enum UserRole {
    VISITOR = 'visitor',
    WRITER = 'writer',
    PENDING = 'pending',
    ADMIN = 'admin',
}

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
    createdAt: string;
}

// Redis client setup
let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        await redisClient.connect();
    }

    return redisClient;
}

// Keys for Redis
const USERS_LIST_KEY = 'users:list';
const ADMIN_EMAIL_KEY = 'admin:email';

// Set the admin email (should be done during setup)
export async function setAdminEmail(email: string): Promise<void> {
    try {
        const client = await getRedisClient();
        await client.set(ADMIN_EMAIL_KEY, email);
        await setUserRole(email, UserRole.ADMIN);
    } catch (error) {
        console.error('Error setting admin email:', error);
    }
}

// Get the admin email
export async function getAdminEmail(): Promise<string | null> {
    try {
        const client = await getRedisClient();
        return await client.get(ADMIN_EMAIL_KEY);
    } catch (error) {
        console.error('Error getting admin email:', error);
        return null;
    }
}

// Check if a user is admin
export async function isAdmin(email: string): Promise<boolean> {
    try {
        const adminEmail = await getAdminEmail();
        return email === adminEmail;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Add this new helper function to src/lib/userPermissions.ts
async function updateUserInList(updatedUser: User): Promise<void> {
    try {
        const client = await getRedisClient();
        const usersListStr = await client.get(USERS_LIST_KEY);

        if (!usersListStr) return;

        const usersList: User[] = JSON.parse(usersListStr);
        const updatedList = usersList.map(user =>
            user.email === updatedUser.email ? { ...user, role: updatedUser.role } : user
        );

        await client.set(USERS_LIST_KEY, JSON.stringify(updatedList));
        console.log(`Updated ${updatedUser.email} in users list`);
    } catch (error) {
        console.error('Error updating user in list:', error);
    }
}

// Set user role
export async function setUserRole(email: string, role: UserRole): Promise<void> {
    try {
        const client = await getRedisClient();
        const userKey = `user:${email}`;
        const roleKey = `user:${email}:role`;

        // Update both the complete user object and the dedicated role key
        const userData = await client.get(userKey);

        if (userData) {
            const user = JSON.parse(userData);
            user.role = role;
            await client.set(userKey, JSON.stringify(user));

            // Also update the users list
            await updateUserInList(user);
        }

        // Always set the dedicated role key
        await client.set(roleKey, role);

        console.log(`Role set for ${email} to ${role} in Redis`);
    } catch (error) {
        console.error('Error setting user role:', error);
        throw error;
    }
}

// Get user role
export async function getUserRole(email: string): Promise<UserRole> {
    try {
        const client = await getRedisClient();
        const userKey = `user:${email}`;

        // Try to get complete user data first
        const userData = await client.get(userKey);

        if (userData) {
            const user = JSON.parse(userData);
            return user.role;
        }

        // Fallback to just the role key
        const role = await client.get(`user:${email}:role`);
        return role as UserRole || UserRole.VISITOR;
    } catch (error) {
        console.error('Error getting user role:', error);
        return UserRole.VISITOR;
    }
}

// Save complete user data
export async function saveUser(user: User): Promise<void> {
    try {
        const client = await getRedisClient();
        const userKey = `user:${user.email}`;

        // Save user data
        await client.set(userKey, JSON.stringify(user));

        // Add to users list if not already there
        const usersList = await getUsers();
        if (!usersList.some(u => u.email === user.email)) {
            usersList.push(user);
            await client.set(USERS_LIST_KEY, JSON.stringify(usersList));
        }
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

// Get user by email
export async function getUser(email: string): Promise<User | null> {
    try {
        const client = await getRedisClient();
        const userKey = `user:${email}`;
        const userData = await client.get(userKey);

        if (!userData) return null;

        return JSON.parse(userData);
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

// Get all users
export async function getUsers(): Promise<User[]> {
    try {
        const client = await getRedisClient();
        const usersData = await client.get(USERS_LIST_KEY);

        if (!usersData) return [];

        return JSON.parse(usersData);
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

// Request writer access
export async function requestAccess(email: string): Promise<void> {
    await setUserRole(email, UserRole.PENDING);
}

// Check if user can write
export async function canUserWrite(email: string): Promise<boolean> {
    try {
        const role = await getUserRole(email);
        return role === UserRole.WRITER || role === UserRole.ADMIN;
    } catch (error) {
        console.error('Error checking if user can write:', error);
        return false;
    }
}