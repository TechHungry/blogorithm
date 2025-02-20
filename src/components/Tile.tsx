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
        <div className={`${!title && "bg-black"} rounded-md`}>
            {title && (
                <Image
                    src={source}
                    alt={title}
                    className="rounded-md object-cover w-full h-full"
                    width={1000}
                    height={560}
                    layout="responsive"
                    objectFit="cover"
                />
            )}
        </div>
    );
}

interface BlogTileProps {
    post_data: SanityDocument;
    type: string;
}

export function BlogTile({post_data, type}: BlogTileProps) {
    const title = post_data.title;
    let slug = post_data.slug.current;

    if (!projectId || !dataset) {
        throw new Error("Sanity client configuration is missing projectId or dataset");
    }
    let coverImage = imageUrlBuilder({projectId, dataset}).image(post_data.coverImage).url();

    return (
        <div className="blog-tile flex flex-row rounded-md shadow-lg overflow-hidden h-full">
            <div className="w-2/5 h-full flex relative">
                {title && (
                    <Image
                        src={coverImage}
                        alt={title}
                        className="object-cover"
                        layout="fill"
                    />
                )}
            </div>
            <div className="w-3/5 p-4 blog-tile-content">
                <p className="text-lg font-satoshi">{title}</p>
                <p className="text-gray-500 text-sm">{formatDate(post_data.publishedAt)}</p>
                <p className="my-3 text-sm">
                    {post_data.summary.length > 75 ? `${post_data.summary.slice(0, 75)} ...` : post_data.summary}
                </p>
                <Link href={`/${type}/${slug}`} className="blog-link hover:underline mt-4 block text-right">
                    Go to {type} →
                </Link>
            </div>
        </div>
    );
}

interface BigTileProps {
    post_data: SanityDocument;
    type: string;
    orientation: 'left' | 'right';
}

export function BigTile({post_data, type, orientation}: BigTileProps) {
    let title: string = post_data.title;
    let text: string = post_data.summary;
    let slug = post_data.slug.current;

    if (!projectId || !dataset) {
        throw new Error("Sanity client configuration is missing projectId or dataset");
    }
    let coverImage = imageUrlBuilder({projectId, dataset}).image(post_data.coverImage).url();

    return (
        <div className="mt-6 flex gap-8">
            <div className={`basis-2/3`}>
                <BigImage source={coverImage} title={title}/>
            </div>
            <div className="basis-1/3 flex flex-col justify-between">
                <div className={`basis-1/3`}>
                    <p className="lg:text-2xl md:text-xl">{title}</p>
                    {/*<PersonPhoto imgSrc={`/assets/authors/Arfi_Photo.png`}/>*/}
                    <p className="my-4 text-justify ">{`${text.slice(0, 150)} ...`}</p>
                    <Link href={`/${type}/${slug}`} className="blog-link">
                        Go to {type} →
                    </Link>

                </div>
                {/*<div >*/}

                {/*    <Link href={`/${type}/${slug}`} className="blog-link">*/}
                {/*        Go to {type} →*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
