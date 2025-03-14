// src/app/api/user/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/clients/sanity/client';

// Fetch all posts for a specific user
export async function GET(request: NextRequest) {
    try {
        // Get current session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the email from query params (should match the session user)
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Only allow fetching your own posts unless you're an admin
        if (email !== session.user.email && (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // First, fetch the author document for this email
        const authors = await client.fetch(`*[_type == "author" && email == $email]`, {
            email: email
        });

        if (!authors || authors.length === 0) {
            // No author record found, return empty posts
            return NextResponse.json({ posts: [] });
        }

        const author = authors[0];

        // Now fetch all posts that reference this author
        const posts = await client.fetch(`*[_type == "post" && references($authorId)] | order(publishedAt desc) {
            _id,
            title,
            slug,
            status,
            publishedAt,
            summary
        }`, {
            authorId: author._id
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}