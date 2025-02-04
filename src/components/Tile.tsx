import Link from "next/link";
import { formatDate } from "@/app/utils/utils";
import React from 'react';
import {SanityDocument} from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";
import Image from 'next/image';

const { projectId, dataset } = client.config();

interface BigImageProps {
  source?: any;
  title: string;
}

export function BigImage({ source, title }: BigImageProps) {
  return (
    <div className={`${!title && "bg-black"} basis-1/2 rounded-md`}>
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

export function BlogTile({ post_data, type }: BlogTileProps) {
  const title = post_data.title;
  let slug = post_data.slug.current;

  if (!projectId || !dataset) {
    throw new Error("Sanity client configuration is missing projectId or dataset");
  }
  let coverImage = imageUrlBuilder({projectId, dataset}).image(post_data.coverImage).url();
  return (
    <div className="mt-6 grid grid-cols-5 gap-8">
      <div className={`${!title && "bg-black"} w-full rounded-md`}>
        <Link href={`/${type}/${slug}`}>
        {title && (
          <Image
            src={coverImage}
            alt={title}
            className="rounded-md object-cover w-full h-full"
            width={400}
            height={225}
            layout="responsive"
            objectFit="cover"
          />
        )}
        </Link>
      </div>
      <div className="px-12 col-span-4 self-start">
        <p>{title}</p>
        <p className="">{formatDate(post_data.publishedAt)}</p>
        <Link href={`/${type}/${slug}`} className="blog-link">
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

export function BigTile({ post_data, type, orientation }: BigTileProps) {
  let title: string = post_data.title;
  let text: string = post_data.summary;
  let slug = post_data.slug.current;

  if (!projectId || !dataset) {
    throw new Error("Sanity client configuration is missing projectId or dataset");
  }
  let coverImage = imageUrlBuilder({projectId, dataset}).image(post_data.coverImage).url();

  return (
    <div className="flex flex-row mt-6 gap-8 gap-x-16">
      {orientation === 'left' &&
          <BigImage source={coverImage} title={title} />
      }
      <div className="basis-1/2">
        <p className="lg:text-2xl md:text-xl">{title}</p>
        <p className="my-4 text-justify">{`${text.slice(0, 100)} ...` }</p>
        <Link href={`/${type}/${slug}`} className="blog-link">
          Go to {type} →
        </Link>
      </div>
      {orientation === 'right' && <BigImage source={coverImage} title={title} />}
    </div>
  );
}
