import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Column from "@/components/Column";
import Navbar from "@/components/Navbar";
import { PostBody } from "@/components/post-body";
import { PostHeader } from "@/components/post-header";
import { routes } from '@/app/resources/config';
import {join} from "path";

const postsDirectory = join(process.cwd(), "src/app/work/posts");

export default async function Work(props: Params) {
    const params = await props.params;
    const post = getPostBySlug(params.slug, postsDirectory);

    if (!post) {
        return notFound();
    }

    const content = await markdownToHtml(post.content || "");

    return (
        <main>
            <Navbar routes={routes} />
            <Column>
                <article className="mb-32">
                    <PostHeader
                        title={post.title}
                        coverImage={post.coverImage}
                        date={post.publishedAt}
                        author={post.author}
                    />
                    <PostBody content={content}/>
                </article>
            </Column>
            <footer className='h-24 w-full'></footer>
        </main>
    );
}

type Params = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const post = getPostBySlug(params.slug, postsDirectory);

    if (!post) {
        return notFound();
    }

    const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

    return {
        title,
        openGraph: {
            title,
            images: [post.ogImage.url],
        },
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts("work");

    return posts.map((post) => ({
        slug: post.slug,
    }));
}
