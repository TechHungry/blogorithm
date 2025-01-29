import Link from "next/link";
import { formatDate, blog_slug } from "@/app/utils/utils";
import React from 'react';
import {Post} from "@/interfaces/post";

interface BigImageProps {
  title?: string;
  type: string;
  slug: string;
}

export function BigImage({ title, type, slug }: BigImageProps) {
  return (
    <div className={`${!title && "bg-black"} basis-1/2 rounded-md`}>
      {title && (
        <img
          src={`/assets/${type}/${slug}/tile.jpg`}
          alt={title}
          className="rounded-md object-cover w-full h-full"
        />
      )}
    </div>
  );
}

interface BlogTileProps {
  post_data: Post;
  type: string;
}

export function BlogTile({ post_data, type }: BlogTileProps) {
  const title = post_data.title;
  let slug = blog_slug(title);
  return (
    <div className="mt-6">
      <div className={`${!title && "bg-black"} w-full rounded-md`}>
        {title && (
          <img
            src={`/assets/${type}/${slug}/tile.jpg`}
            alt={title}
            className="rounded-md object-cover w-full h-full"
          />
        )}
      </div>
      <div className="mt-4">
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
  post_data: Post;
  type: string;
  orientation: 'left' | 'right';
}

export function BigTile({ post_data, type, orientation }: BigTileProps) {
  let title: string = post_data.title;
  let text: string = post_data.summary;
  let slug = blog_slug(title);

  return (
    <div className="flex lg:flex-row flex-col mt-6 gap-8 gap-x-16">
      {orientation === 'left' && <BigImage title={title} type={type} slug={slug} />}
      <div className="basis-1/2">
        <p className="lg:text-2xl md:text-xl">{title}</p>
        <p>{text}</p>
        <Link href={`/${type}/${slug}`} className="blog-link">
          Go to {type} →
        </Link>
      </div>
      {orientation === 'right' && <BigImage title={title} type={type} slug={slug} />}
    </div>
  );
}
