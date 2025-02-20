// import './style.css'
import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import { BlogTile } from '@/components/Tile';
import { routes } from '@/app/resources/config';
import {client} from "@/sanity/client";
import type {SanityDocument} from "next-sanity";
import  { Footer } from "@/components/Footer";

const POSTS_QUERY = `*[
  _type == "post" && status == "PUBLISHED" && content_type == "work"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, coverImage, summary}`;

const options = { next: { revalidate: 30 } };

export default async function WorkHome() {

    let sanity_posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options)
    let posts: SanityDocument[] = sanity_posts;

    return (
        <>
            <Navbar routes={routes}/>
            <Column classes={`mt-32`}>
                <div className='relative'>
                    <div className='me-auto my-24 px-12'>
                        <div className='my-12'>
                            <h1 className="lg:text-8xl md:text-6xl text-6xl font-extrabold font-satoshi lg:leading-tight text-center">Projects.</h1>
                            {/* <h1 className="lg:text-4xl md:text-5xl text-4xl font-extrabold font-satoshi lg:leading-tight pe-4 self-start">on Blogorithm.</h1> */}
                        </div>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-8 my-16">

                            {posts.map((post) => (
                                <div key={post.slug}>
                                    <div className="aspect-w-16 aspect-h-9" key={`blogs_${post._id}`}>
                                        <BlogTile post_data={post} type="blog"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Column>
            <Footer />
        </>
    );
}
