// src/lib/auth-image-handler.ts
import { client } from '@/clients/sanity/client';

/**
 * Downloads an image from a URL and uploads it to Sanity
 *
 * @param imageUrl The URL of the image to download
 * @param filename The filename to use for the uploaded image
 * @returns The Sanity image asset reference
 */
export async function uploadImageFromUrl(imageUrl: string, filename: string = 'profile-image'): Promise<any> {
    try {
        // Fetch the image from the URL
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image from ${imageUrl}`);
        }

        // Get the content type to detect image format
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // Convert to buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Sanity
        const imageAsset = await client.assets.upload('image', buffer, {
            filename: filename,
            contentType: contentType
        });

        // Return the image reference
        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: imageAsset._id
            }
        };
    } catch (error) {
        console.error('Error uploading image from URL:', error);
        return null;
    }
}

/**
 * Extracts plain text from Sanity block content
 *
 * @param blocks The block content array
 * @returns The extracted plain text
 */
export function extractTextFromBlocks(blocks: any[]): string {
    if (!blocks || !Array.isArray(blocks)) {
        return '';
    }

    let text = '';

    blocks.forEach(block => {
        if (block._type === 'block' && block.children) {
            block.children.forEach((child: any) => {
                if (child._type === 'span') {
                    text += child.text + ' ';
                }
            });
        }
    });

    return text.trim();
}