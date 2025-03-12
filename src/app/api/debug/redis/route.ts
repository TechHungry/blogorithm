// src/app/api/debug/redis/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/userPermissions';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
    try {
        // Security check - only admins should access this
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the target email from query params
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
        }

        const client = await getRedisClient();

        // Get all relevant Redis keys for this user
        const userKey = `user:${email}`;
        const roleKey = `user:${email}:role`;

        const userData = await client.get(userKey);
        const roleData = await client.get(roleKey);
        const usersListStr = await client.get('users:list');

        // Extract user from the users list for comparison
        let userInList = null;
        if (usersListStr) {
            const usersList = JSON.parse(usersListStr);
            userInList = usersList.find((u: any) => u.email === email);
        }

        return NextResponse.json({
            userObject: userData ? JSON.parse(userData) : null,
            dedicatedRole: roleData,
            userInList: userInList,
            consistency: {
                hasUserObject: !!userData,
                hasDedicatedRole: !!roleData,
                isInUsersList: !!userInList,
                rolesMatch: userData && roleData ?
                    JSON.parse(userData).role === roleData : false
            }
        });
    } catch (error) {
        console.error('Redis debug error:', error);
        return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 });
    }
}