import Link from "next/link";
import {formatDate} from "@/app/utils/utils";
import React from 'react';
import {PortableText, SanityDocument} from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import {client} from "@/sanity/client";
import Image from 'next/image';
import {IconButton} from "@/components/Icons";

const {projectId, dataset} = client.config();

interface AuthorTileProps {
    author_data: SanityDocument;
}

interface socialLinkURL {
    url: string,
    platform: string
}

export default function AuthorTile({author_data}: AuthorTileProps) {
    // console.log(author_data)
    const name = author_data.name;
    let slug = author_data.slug.current;

    if (!projectId || !dataset) {
        throw new Error("Sanity client configuration is missing projectId or dataset");
    }
    let profileImage = imageUrlBuilder({projectId, dataset}).image(author_data.profileImage).url();
    let bio = author_data.bio;
    let socialLinks = author_data.socialLinks;

    return (
        <div className="blog-tile shadow-lg overflow-hidden h-full mb-8 blog-tile-content">
            <div className={`flex gap-8 px-4 my-4`}>
                <Image
                    src={profileImage}
                    alt={name}
                    className="object-cover"
                    width={50}
                    height={50}
                />
                <div className={`w-full`}>
                    <div className={`flex gap-2 justify-between`}>
                        <Link href={`/authors/${slug}`} className="text-2xl font-satoshi font-extrabold"
                              id={`auth_${slug}`}>
                            {name}
                        </Link>
                        <div className={`flex flex-row gap-x-1`} id={`social_${slug}`}>
                            {socialLinks.map((link: socialLinkURL, index: number) => (
                                <Link href={link.url} target="_blank" rel="noopener noreferrer"
                                      key={`social_${slug}_${index}`} className={`self-center`}>
                                    <IconButton iconName={link.platform.toLowerCase()} href={link.url}/>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {Array.isArray(bio) && <PortableText value={bio}/>}
                </div>
            </div>
            <div className={`h-64 flex gap-16 justify-center`}>
                    <div className={`h-56 w-1/3 bg-white self-center rounded-lg`}></div>
                    <div className={`h-56 w-1/3 bg-white self-center rounded-lg`}></div>
                    <div className={`h-56 w-1/3 bg-white self-center rounded-lg`}></div>
            </div>
        </div>
    );
}