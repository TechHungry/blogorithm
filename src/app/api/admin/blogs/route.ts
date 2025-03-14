// src/app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/clients/sanity/client';
import { getUserRole } from '@/lib/userPermissions';
import { UserRole } from '@/lib/clientUserPermissions';

// Fetch all blogs for admin
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

        // Query to get all blogs with their authors
        const blogs = await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
            _id,
            title,
            slug,
            status,
            publishedAt,
            "authors": authors[]->{ name, _id }
        }`);

        return NextResponse.json({ blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}