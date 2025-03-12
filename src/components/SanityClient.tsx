// sanity.js
import {createClient} from '@sanity/client'
import {SanityPayload} from '@/interfaces/post'

export const client = createClient({
    projectId: '9ykzm040',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2025-02-06', // use current date (YYYY-MM-DD) to target the latest API version. Note: this should always be hard coded. Setting API version based on a dynamic value (e.g. new Date()) may break your application at a random point in the future.
    token: process.env.SANITY_SECRET_TOKEN // Needed for certain operations like updating content, accessing drafts or using draft perspectives
})

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getPosts() {
    const posts = await client.fetch('*[_type == "post"]')
    return posts
}

export async function createPost(post: SanityPayload) {
    const transaction = client.transaction();
    const draftId = `drafts.${post._type}-${Date.now()}`;
    transaction.create({
        _id: draftId,
        ...post
    });
    const result = await transaction.commit();
    console.log('Created draft post:', result);
    return result.results[0];
    // const result = client.create(post)
    // return result
}

export async function updateDocumentTitle(_id: string, title: string) {
    const result = client.patch(_id).set({title})
    return result
}