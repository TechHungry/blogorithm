// import './style.css'
import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import { BlogTile } from '@/components/Tile';
import { routes } from '@/app/resources/config';
import {client} from "@/sanity/client";
import type {SanityDocument} from "next-sanity";
import  { Footer } from "@/components/Footer";
import AuthorTile from '@/components/authorTileNew';

const AUTHORS_QUERY = `*[
  _type == "author" && defined(slug.current)
]|order(_createdAt asc)[0...12]{_id, name, slug, _updatedAt, profileImage, bio, socialLinks, _type}`;

const options = { next: { revalidate: 30 } };

export default async function WorkHome() {

    let sanity_posts = await client.fetch<SanityDocument[]>(AUTHORS_QUERY, {}, options)
    let posts: SanityDocument[] = sanity_posts;
    posts = [...posts, ...posts]
    // console.log(posts);

    return (
        <>
            <Navbar routes={routes}/>
            <Column classes={`mt-32`}>
                <div className='relative'>
                    <div className='me-auto my-24 px-12'>
                        <div className='my-12'>
                            <h1 className="lg:text-8xl md:text-6xl text-6xl font-extrabold font-satoshi lg:leading-tight text-center">Authors.</h1>
                            {/* <h1 className="lg:text-4xl md:text-5xl text-4xl font-extrabold font-satoshi lg:leading-tight pe-4 self-start">on Blogorithm.</h1> */}
                        </div>
                        <div className="my-16 w-full">
                            {posts.map((post) => (
                                <AuthorTile author_data={post} key={`author_${post.slug.current}`}/>
                            ))}
                        </div>
                    </div>
                </div>
            </Column>
            <Footer />
        </>
    );
}
