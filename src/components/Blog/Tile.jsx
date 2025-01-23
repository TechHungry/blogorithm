import Link from "next/link";
import styles from "./Tile.css";
import { blog_slug } from "@/app/blog/page";

export function BlogTile({ title, type }) {
  let slug = blog_slug(title);
  return (
    <div className="px-4 mt-6">
      <div className={`${!title && "bg-black"} h-48 w-full rounded-md`}>
        {title && (
          <img
            src={`/assets/${type}/${slug}/tile.jpg`}
            alt={title}
            className="h-48 w-full rounded-md object-cover"
          />
        )}
      </div>
      {/* TODO: add class to make see all vertically aligned */}
      <div className="mt-4">
        <p>{title}</p>
        <Link href={`/${type}/${slug}`} className="blog-link">
          Go to {type} →
        </Link>
      </div>
    </div>
  );
}

export function BigTile({ title, type }) {
  let slug = blog_slug(title);
  return (
    <div className="flex flex-row mt-6">
      <div className={`${!title && "bg-black"} h-96 basis-2/3 rounded-md`}>
        {title && (
          <img
            src={`/assets/${type}/${slug}/tile.jpg`}
            alt={title}
            className="h-96 w-144 rounded-md object-cover"
          />
        )}
      </div>
      {/* TODO: add class to make see all vertically aligned */}
      <div className="basis-1/3">
          <p className="lg:text-2xl md:text-xl">{title}</p>
          <Link href={`/${type}/${slug}`} className="blog-link">
            Go to {type} →
          </Link>
        </div>
    </div>
  );
}
