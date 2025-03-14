// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { client } from '@/clients/sanity/client';
import { extractTextFromBlocks } from '@/lib/auth-image-handler';

// Get user profile from Sanity
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

        // Only allow fetching your own profile unless you're an admin
        if (email !== session.user.email && (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch author profile from Sanity
        const author = await client.fetch(`*[_type == "author" && email == $email][0]`, {
            email: email
        });

        if (!author) {
            // No author record found
            return NextResponse.json({ profile: null });
        }

        // Create a copy of the author object
        let profile = { ...author };

        // Convert block content to plain text for the bio if it exists
        if (profile.bio && Array.isArray(profile.bio)) {
            try {
                // Extract text from block content
                profile.bioText = extractTextFromBlocks(profile.bio);
            } catch (error) {
                console.error('Error parsing bio:', error);
                profile.bioText = '';
            }
        }

        // If there's a profileImage, store the raw image data
        // Don't convert to URL here - we'll let the frontend handle that
        if (profile.profileImage) {
            // We still need to add the projectId and dataset for the frontend
            profile.profileImageData = profile.profileImage;
            profile.projectId = client.config().projectId;
            profile.dataset = client.config().dataset;
        }

        // Include social links if they exist
        if (!profile.socialLinks) {
            profile.socialLinks = [];
        }

        return NextResponse.json({ profile });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}