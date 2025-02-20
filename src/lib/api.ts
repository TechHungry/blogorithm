import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

export function getPostSlugs(content_type: string, postsDirectory: string) {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, postsDirectory: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(content_type: string): Post[] {
  let postsDirectory: string = "";
  if (content_type === "work") {
    postsDirectory = join(process.cwd(), "src/app/work/posts");
  } else if (content_type === "blog") {
    postsDirectory = join(process.cwd(), "src/app/blog/posts");
  }

  const slugs = getPostSlugs(content_type, postsDirectory);
  return slugs
    .map((slug) => getPostBySlug(slug, postsDirectory))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
    // filter posts by status
    .filter((post) => post.status === "PUBLISHED");
}
