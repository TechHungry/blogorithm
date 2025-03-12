import Link from "next/link";
import {formatDate} from "@/app/utils/utils";
import React from 'react';
import {SanityDocument} from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import {client} from "@/sanity/client";
import Image from 'next/image';
import PersonPhoto from "@/components/PersonPhoto";

const {projectId, dataset} = client.config();

interface BigImageProps {
    source?: any;
    title: string;
}

export function BigImage({source, title}: BigImageProps) {
    return (
        <div className={`${!title && "bg-black h-full"} w-full h-full relative`}>
            {title && (
                <Image
                    src={source}
                    alt={title}
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            )}
        </div>
    );
}

interface BlogTileProps {
    post_data: SanityDocument;
}

export function BlogTile({post_data}: BlogTileProps) {
    const type = post_data.content_type;
    const title = post_data.title;
    let slug = post_data.slug.current;

    if (!projectId || !dataset) {
        throw new Error("Sanity client configuration is missing projectId or dataset");
    }
    let coverImage = imageUrlBuilder({projectId, dataset}).image(post_data.coverImage).url();

    return (
        <div className="blog-tile rounded-md shadow-lg overflow-hidden h-full">
            <div className="flex flex-row h-full" key={post_data._id}>
                <div className="w-2/5 relative">
                    {title && (
                        <div className="aspect-square w-full relative">
                            <Image
                                src={coverImage}
                                alt={title}
                                className="object-cover"
                                fill
                                sizes="(max-width: 768px) 100vw, 30vw"
                            />
                        </div>
                    )}
                </div>
                <div className="w-3/5 p-4 blog-tile-content flex flex-col justify-between">
                    <div>
                        <p className="text-lg font-satoshi">{title}</p>
                        <p className="text-gray-500 text-sm">{formatDate(post_data.publishedAt)}</p>
                        <p className="my-3 text-sm">
                            {post_data.summary.length > 75 ? `${post_data.summary.slice(0, 75)} ...` : post_data.summary}
                        </p>
                    </div>
                    <div>
                        <Link href={`/${type}/${slug}`} className="blog-link hover:underline block text-right">
                            Go to {type} →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BigBlogTile({post_data}: BlogTileProps) {
    const type = post_data.content_type;
    const title = post_data.title;
    let slug = post_data.slug.current;
    if (!projectId || !dataset) {
        throw new Error("Sanity client configuration is missing projectId or dataset");
    }
    let coverImage = imageUrlBuilder({projectId, dataset}).image(post_data.coverImage).url();
    return (
        <div className="blog-tile row-span-2 flex flex-col rounded-md shadow-lg overflow-hidden h-full">
            <div className="aspect-video w-full relative">
                <Image
                    src={coverImage}
                    alt={title}
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            <div className="blog-tile-content p-4 flex-grow">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-gray-500 text-sm">{formatDate(post_data.publishedAt)}</p>
                <p className="my-3 text-sm">
                    {post_data.summary.length > 75 ? `${post_data.summary.slice(0, 150)} ...` : post_data.summary}
                </p>
                <Link href={`/${type}/${slug}`} className="blog-link hover:underline mt-4 block text-right">
                    Go to {type} →
                </Link>
            </div>
        </div>
    );
}