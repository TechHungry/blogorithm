// import './style.css'
import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import { BlogTile } from '@/components/Tile';
import { routes } from '@/app/resources/config';
import {client} from "@/sanity/client";
import type {SanityDocument} from "next-sanity";

const POSTS_QUERY = `*[
  _type == "post" && status == "PUBLISHED" && content_type == "work"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, coverImage, summary}`;

const options = { next: { revalidate: 30 } };

export default async function WorkHome() {

    let sanity_posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options)
    let blogs: SanityDocument[] = sanity_posts;

    return (
        <main>
            <Navbar routes={routes}/>
            <Column >
                <div className='relative'>
                    <div className='me-auto my-24 px-12'>
                        <div className='grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 gap-16 justify-between'>
                            <div className='md:self-center self-end'>
                                <h1 className="lg:text-8xl md:text-6xl text-6xl font-extrabold font-satoshi lg:leading-tight">Works.</h1>
                                {/* <h1 className="lg:text-4xl md:text-5xl text-4xl font-extrabold font-satoshi lg:leading-tight pe-4 self-start">on Blogorithm.</h1> */}
                            </div>
                            {blogs.map((post) => (
                                <div key={post.slug}>
                                    <div className="aspect-w-16 aspect-h-9">
                                        <BlogTile post_data={post} type="work" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Column>
            <footer className='h-24 w-full'></footer>
        </main>
    );
}
