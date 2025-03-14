// src/app/api/admin/blogs/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserRole } from '@/lib/userPermissions';
import { UserRole } from '@/lib/clientUserPermissions';
import { client } from '@/clients/sanity/client'

// Delete a blog
export async function DELETE(request: NextRequest) {
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

        // Get the blog ID from query parameters
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
        }

        // Delete the blog
        await client.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({
            error: 'Server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}