import Link from "next/link";
import styles from "./Tile.css";
import { blog_slug } from "@/app/blog/page";

export function BigImage({ title, type, slug}) {
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
  )
}

export function BlogTile({ title, type }) {
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
        <Link href={`/${type}/${slug}`} className="blog-link">
          Go to {type} →
        </Link>
      </div>
    </div>
  );
}

export function BigTile({ title, text, type, orientation }) {
  let slug = blog_slug(title);
  return (
    <div className="flex lg:flex-row flex-col mt-6 gap-8 gap-x-16">
      {orientation === 'left' && <BigImage title={title} type={type} slug={slug}/>}
      <div className="basis-1/2">
        <p className="lg:text-2xl md:text-xl">{title}</p>
        <p>{text}</p>
        <Link href={`/${type}/${slug}`} className="blog-link">
          Go to {type} →
        </Link>
      </div>
      {orientation === 'right' && <BigImage title={title} type={type} slug={slug}/>}
    </div>
  );
}
