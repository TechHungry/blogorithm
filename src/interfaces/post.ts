import { type Author } from "./author";

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
