// src/app/api/posts/get-by-slug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/clients/sanity/client';
import { getUserRole } from '@/lib/userPermissions';
import { UserRole } from '@/lib/clientUserPermissions';
import imageUrlBuilder from '@sanity/image-url';

export async function GET(request: NextRequest) {
    try {
        // Get session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the slug from query parameters
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Get user role
        const userRole = await getUserRole(session.user.email);

        // Fetch the post
        const query = `*[_type == "post" && slug.current == $slug][0] {
            _id,
            title,
            slug,
            bodyHtml,
            status,
            publishedAt,
            summary,
            tags,
            coverImage,
            "authors": authors[]->{ _id, name, email }
        }`;

        const post = await client.fetch(query, { slug });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user has permission to edit this post
        const isAdmin = userRole === UserRole.ADMIN;
        const isAuthor = post.authors && post.authors.some((author: any) => author.email === session.user!.email);

        if (!isAdmin && !isAuthor) {
            return NextResponse.json({ error: 'You do not have permission to edit this post' }, { status: 403 });
        }

        // Add Sanity project info for image handling on the clients side
        const projectInfo = {
            post,
            projectId: client.config().projectId,
            dataset: client.config().dataset
        };

        return NextResponse.json(projectInfo);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}