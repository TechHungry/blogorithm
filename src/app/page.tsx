import '@/app/globals.css';
import React from 'react';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import {BlogTile, BigBlogTile} from '@/components/Tile';
import Link from 'next/link';
import {routes} from '@/app/resources/config';
import {IconButton} from "@/components/Icons";
import SubscribeForm from '@/components/SubscribeForm';
import {type SanityDocument} from "next-sanity";
import {client} from "@/clients/sanity/client";
import {Footer} from "@/components/Footer";
const BLOGS_QUERY = `*[
  _type == "post" && status == "PUBLISHED"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, content_type, title, slug, publishedAt, coverImage, summary}`;

const options = {next: {revalidate: 30}};

export default async function Home() {
    let sanity_posts = await client.fetch<SanityDocument[]>(BLOGS_QUERY, {}, options);
    let blogs: SanityDocument[] = sanity_posts.slice(0, 4);

    return (
        <>
            <Navbar routes={routes}/>
            <Column>
                <section className="h-screen flex flex-col justify-center items-center relative">
                    <div className="text-center px-12">
                        <h1 className="xl:text-[192px] md:text-9xl text-7xl font-extrabold font-satoshi lg:leading-tight my-12">Blogorithm<span>.</span>
                        </h1>
                        <h3 className="lg:text-3xl md:text-2xl text-xl text-wrap lg:w-8/9">We&apos;re <span
                            className="inline-code text-[#d10a0a] font-funnel">Engineers</span> exploring Tech.<br/>We
                            write about Tech here after work.</h3>
                    </div>
                    <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2">
                        <IconButton href="#home-content" iconName="downArrow"/>
                    </div>
                </section>
                <section id="home-content" className="px-32">
                    <Column>
                    <section className="blogs-section">
                        <div className="mx-auto mb-16">
                            <div className="flex justify-between">
                                <h1 className="lg:text-4xl md:text-3xl text-2xl font-funnel">Latest in the blog</h1>
                                <Link href="/blog" className="blog-link self-end">
                                    See All →
                                </Link>
                            </div>
                            <hr className={`h-px mt-4 mb-12 bg-gray-500 border-0`}/>
                            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-8 my-16">
                                {blogs.map((post, index) => {
                                    if (index <= 1)  {
                                        // First post → Big tile
                                        return <BigBlogTile key={post._id} post_data={post} />;
                                    }
                                    return <BlogTile key={post._id} post_data={post} />;
                                })}
                            </div>

                        </div>
                    </section>
                    </Column>
                </section>
                <section className="subscribe-section mx-w-2xl my-16 px-32">
                    <div className="mx-auto my-24 px-8">
                        <div
                            className="w-full flex justify-center items-center border border-[#872341] rounded-lg bg-[#161515]">
                            <div className="p-12 w-full max-w-2xl text-center">
                                <h2 className="text-2xl font-bold mb-4 font-funnel">Stay Updated</h2>
                                <p className="mb-4">Subscribe to get the latest updates.</p>
                                <SubscribeForm/>
                            </div>
                        </div>
                    </div>
                </section>
            </Column>
            <Footer/>
        </>
    );
}


// 'https://cdn.sanity.io/images/9ykzm040/production/cb3a2dbbd2a04599413d0d44748afbbdfbcc6e81-2132x1408.jpg'
// 'https://cdn.sanity.io/images/9ykzm040/production/36b5ebe8c69864df615066bb6bc61726f6747f63-360x240.jpg'
// 'https://cdn.sanity.io/images/9ykzm040/production/519623ec5a0039001ce3660cdcab126418b1af32-1000x600.jpg'