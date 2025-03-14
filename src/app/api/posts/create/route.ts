// src/app/api/posts/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserRole, canUserWrite } from '@/lib/userPermissions';
import { client } from '@/clients/sanity/client'

function titleToSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export async function POST(req: NextRequest) {
    try {
        // Get session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user can write
        const canWrite = await canUserWrite(session.user.email);
        if (!canWrite) {
            return NextResponse.json({ error: 'You do not have permission to create posts' }, { status: 403 });
        }

        // Get form data
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const summary = formData.get('summary') as string;
        const statusInput = formData.get('status') as string;
        const tags = JSON.parse(formData.get('tags') as string || '[]');
        const coverImageFile = formData.get('coverImage') as File | null;

        // Validate input
        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        // Make sure the status is valid
        const status = ['DRAFT', 'PENDING', 'PUBLISHED'].includes(statusInput) ? statusInput : 'DRAFT';

        // Get or create author document
        let authorId;
        const authors = await client.fetch(`*[_type == "author" && email == $email][0]`, {
            email: session.user.email
        });

        if (!authors) {
            // Create a new author document
            const authorName = session.user.name || session.user.email.split('@')[0];
            const newAuthor = {
                _type: 'author',
                name: authorName,
                email: session.user.email,
                slug: {
                    current: authorName.toLowerCase().replace(/\s+/g, '-')
                }
            };

            const createdAuthor = await client.create(newAuthor);
            authorId = createdAuthor._id;
        } else {
            authorId = authors._id;
        }

        // Create a base payload without the coverImage
        let payload: any = {
            _type: 'post',
            title: title,
            slug: { current: titleToSlug(title) },
            publishedAt: new Date().toISOString(),
            status: status,
            content_type: "blog",
            summary: summary || "Summary of the blog post",
            tags: tags,
            bodyHtml: content,
            authors: [{ _type: 'reference', _ref: authorId }]
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

                // Add coverImage only when we have a successful upload
                payload.coverImage = {
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

        // Create the post in Sanity
        const result = await client.create(payload);

        return NextResponse.json({ success: true, id: result._id });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create post: ' + (error instanceof Error ? error.message : String(error)) },
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