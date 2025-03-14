// src/lib/clientUserPermissions.ts
// This file contains clients-safe code with no direct Redis dependencies

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

// Client-side function to request access
export async function requestAccess(email: string): Promise<boolean> {
    try {
        const response = await fetch('/api/request-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to request access');
        }

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error requesting access:', error);
        return false;
    }
}

// Client-side function to fetch users
export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch('/api/users');

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Client-side function to update user role

export async function updateUserRole(email: string, role: UserRole): Promise<boolean> {
    try {
        const response = await fetch('/api/users/role', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, role }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error updating role:', data.error);
            return false;
        }

        console.log(`Role update request sent for ${email} with new role ${role}`);
        return data.success;
    } catch (error) {
        console.error('Error updating user role:', error);
        return false;
    }
}