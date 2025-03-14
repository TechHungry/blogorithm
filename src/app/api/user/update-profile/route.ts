// src/app/api/user/update-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/clients/sanity/client';

export async function POST(request: NextRequest) {
    try {
        // Get current session
        const session = await getServerSession();

        // Check if user is authenticated
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse the form data
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const bio = formData.get('bio') as string;
        const profileImageFile = formData.get('profileImage') as File | null;
        const socialLinksJson = formData.get('socialLinks') as string;

        // Only allow updating your own profile
        if (email !== session.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if an author document already exists for this email
        const existingAuthors = await client.fetch(`*[_type == "author" && email == $email]`, {
            email: email
        });

        let authorId;
        let authorSlug;
        let updatePayload: any = {};

        // Add bio to update payload - convert to block content format
        updatePayload.bio = [
            {
                _type: 'block',
                children: [
                    {
                        _type: 'span',
                        text: bio
                    }
                ],
                style: 'normal'
            }
        ];

        // Parse and add social links if provided
        if (socialLinksJson) {
            try {
                const socialLinks = JSON.parse(socialLinksJson);
                if (Array.isArray(socialLinks)) {
                    // Ensure each social link has a _key
                    updatePayload.socialLinks = socialLinks.map(link => {
                        if (!link._key) {
                            link._key = Date.now().toString() + Math.random().toString(36).substring(2, 9);
                        }
                        return {
                            _key: link._key,
                            platform: link.platform,
                            url: link.url
                        };
                    });
                }
            } catch (error) {
                console.error('Error parsing social links:', error);
                // Continue without updating social links
            }
        }

        // Handle profile image upload
        if (profileImageFile) {
            try {
                const arrayBuffer = await profileImageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const imageAsset = await client.assets.upload('image', buffer, {
                    filename: profileImageFile.name,
                    contentType: profileImageFile.type
                });

                // Add the image to the update payload
                updatePayload.profileImage = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id
                    }
                };
            } catch (error) {
                console.error('Error uploading profile image:', error);
                return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
            }
        }

        // Create or update the author document
        if (existingAuthors && existingAuthors.length > 0) {
            // Update existing author
            authorId = existingAuthors[0]._id;
            await client.patch(authorId)
                .set(updatePayload)
                .commit();
        } else {
            // Create a new author document
            const displayName = session.user.name || email.split('@')[0];
            authorSlug = displayName.toLowerCase().replace(/\s+/g, '-');

            // Create complete new author document
            const newAuthor = {
                _type: 'author',
                name: displayName,
                email: email,
                slug: {
                    current: authorSlug
                },
                ...updatePayload
            };

            await client.create(newAuthor);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// Configure Next.js to properly handle file uploads
export const config = {
    api: {
        bodyParser: false, // Disables body parsing, necessary for file uploads
    },
};