import {type Author} from "./author";

export type Post = {
    slug: string;
    status: string;
    title: string;
    date: string;
    publishedAt: string;
    summary: string;
    coverImage: string;
    author: Author;
    excerpt: string;
    ogImage: {
        url: string;
    };
    content: string;
    preview?: boolean;
};

export type coverImageType = {
    _type: string,
    asset: {
        _type: string,
        _ref: string
    }
};

export type SanityPayload = {
    _type: string, // Use your Sanity schema type
    title: string,
    publishedAt: string,
    status: string,
    content_type: string,
    summary: string,
    tags: any[],
    bodyHtml: string,
    coverImage: coverImageType | null,
    slug: {
        current: string
    },
    _draft: boolean
}