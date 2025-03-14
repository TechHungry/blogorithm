// src/app/api/posts/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserRole } from '@/lib/userPermissions';
import { UserRole } from '@/lib/clientUserPermissions';
import { client } from '@/clients/sanity/client'

export async function POST(req: NextRequest) {
    try {
        // Get session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user role
        const userRole = await getUserRole(session.user.email);

        // Get form data
        const formData = await req.formData();
        const postId = formData.get('id') as string;
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const summary = formData.get('summary') as string;
        const statusInput = formData.get('status') as string;
        const tags = JSON.parse(formData.get('tags') as string || '[]');
        const coverImageFile = formData.get('coverImage') as File | null;

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        // Fetch the post to check permissions
        const post = await client.fetch(`*[_type == "post" && _id == $id][0] {
            _id,
            "authors": authors[]->{ _id, email }
        }`, { id: postId });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user has permission to edit this post
        const isAdmin = userRole === UserRole.ADMIN;
        const isAuthor = post.authors && post.authors.some((author: any) => author.email === session.user!.email);

        if (!isAdmin && !isAuthor) {
            return NextResponse.json({ error: 'You do not have permission to edit this post' }, { status: 403 });
        }

        // Make sure the status is valid
        // Only admins can directly publish
        let status = statusInput;
        if (status === 'PUBLISHED' && !isAdmin) {
            status = 'PENDING';
        }

        // Create update payload
        let updatePayload: any = {
            title: title,
            bodyHtml: content,
            summary: summary || "Summary of the blog post",
            tags: tags,
            status: status
        };

        // Process the image file if it exists
        if (coverImageFile) {
            try {
                const arrayBuffer = await coverImageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const imageAsset = await client.assets.upload('image', buffer, {
                    filename: coverImageFile.name,
                    contentType: coverImageFile.type
                });

                // Add coverImage to update payload
                updatePayload.coverImage = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id
                    }
                };
            } catch (error) {
                console.error('Error uploading image:', error);
                return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
            }
        }

        // Update the post in Sanity
        await client.patch(postId)
            .set(updatePayload)
            .commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// Configure Next.js to properly handle file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};