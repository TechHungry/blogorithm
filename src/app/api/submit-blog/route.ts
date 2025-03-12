// app/api/submit-blog/route.ts
import {createPost, client} from "@/components/SanityClient";
import {NextResponse} from 'next/server';
import {SanityPayload} from '@/interfaces/post'

function titleToSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')      // remove non-word characters
        .replace(/\s+/g, '-')          // replace spaces with hyphens
        .replace(/-+/g, '-');          // remove duplicate hyphens
}

export async function POST(req: Request) {
    try {
        // Get formData instead of JSON
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const tags: any[] = JSON.parse(formData.get('tags') as string);
        const coverImageFile = formData.get('coverImage') as File | null;

        // Create a base payload without the coverImage
        let payload: SanityPayload = {
            _type: 'post',
            title: title,
            slug: {current: titleToSlug(title)},
            publishedAt: new Date().toISOString(),
            status: "DRAFT",
            content_type: "blog",
            summary: "Summary of the blog post",
            tags: tags,
            newbody: content,
            coverImage: null
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

                console.log('Upload successful', imageAsset);

                // Add coverImage only when we have a successful upload
                payload.coverImage = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id
                    }
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
            console.log('Payload ready for Sanity:', payload);
            const result = await createPost(payload);

            return NextResponse.json({success: true, id: result._id});
        }
    } catch
        (error) {
        console.error('Error submitting to Sanity:', error);
        return NextResponse.json(
            {success: false, message: 'Failed to submit post'},
            {status: 500}
        );
    }
}

// Configure Next.js to properly handle large file uploads
export const config = {
    api: {
        bodyParser: false, // Disables body parsing, necessary for file uploads
    },
};