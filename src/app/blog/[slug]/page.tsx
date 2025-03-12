import {Metadata} from "next";
import {notFound} from "next/navigation";
import {CMS_NAME} from "@/lib/constants";
import Column from "@/components/Column";
import Navbar from "@/components/Navbar";
import {PostBody} from "@/components/PostBody/PostBody";
import {PostHeader} from "@/components/post-header";
import {routes} from '@/app/resources/config';
import {SanityDocument} from "next-sanity";
import {client} from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import {Footer} from "@/components/Footer";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const BLOGS_QUERY = `*[
  _type == "post" && status == "PUBLISHED"
  && defined(slug.current)
  ]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, coverImage, summary}`;
const AuthorsQuery = `*[_type == "author"]`;

const options = {next: {revalidate: 30}};

export default async function Blog(props: Params) {
    const params = await props.params;
    const post = await client.fetch<SanityDocument>(POST_QUERY, params, options);
    const authors = await client.fetch<SanityDocument>(AuthorsQuery, params, options);



    const {projectId, dataset} = client.config();
    if (!projectId || !dataset) {
        throw new Error("Sanity client configuration is missing projectId or dataset");
    }

    let coverImage = imageUrlBuilder({projectId, dataset}).image(post.coverImage).url()

    if (!post) {
        return notFound();
    }

    post.authors = post.authors.map((author: SanityDocument) => authors.find((a:SanityDocument) => a._id === author._ref));
    // const content = await markdownToHtml(post.content || "");
    return (
        <>
            <Navbar routes={routes}/>
            <Column classes={`mt-32`}>
                <article className="mx-36 mb-32">
                    <PostHeader
                        title={post.title}
                        coverImage={coverImage}
                        date={post.publishedAt}
                        authors={post.authors}
                    />
                    <PostBody body={post.bodyHtml}/>
                </article>
            </Column>
            <Footer/>
        </>
    );
}

type Params = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({params}: Params): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await client.fetch<SanityDocument>(POST_QUERY, resolvedParams, options);

    if (!post) {
        return notFound();
    }

    const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

    return {
        title,
        openGraph: {
            title,
            images: [post.coverImage],
        },
    };
}

export async function generateStaticParams() {
    let sanity_posts = await client.fetch<SanityDocument[]>(BLOGS_QUERY, {}, options);

    return sanity_posts.map((post) => ({
        slug: post.slug.current,
    }));
}