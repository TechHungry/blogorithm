// sanity.js
import { client } from '@/clients/sanity/client'
import {SanityPayload} from '@/interfaces/post'

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
    // const result = clients.create(post)
    // return result
}

export async function updateDocumentTitle(_id: string, title: string) {
    const result = client.patch(_id).set({title})
    return result
}