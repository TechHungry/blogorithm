import '@/app/globals.css';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import { BlogTile, BigTile } from '../components/Tile';
import Link from 'next/link';
import { routes } from '@/app/resources/config';
import { getAllPosts } from '@/lib/api';
import {Post} from "@/interfaces/post";
import SubscribeForm from '@/components/SubscribeForm';



export default function Home() {

    const blog_posts = getAllPosts("blog");
    blog_posts.sort((a: Post, b: Post) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    let blogs: Post[] = blog_posts.slice(0, 2);

    const work_posts = getAllPosts("work");
    work_posts.sort((a: Post, b: Post) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    let works: Post[] = work_posts.slice(0, 2);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        // Add submit logic here
    };

    return (
        <main>
            <Navbar routes={routes} />
            <Column>
                <div className='relative'>
                    <div className='me-auto my-24 px-12 flex flex-row justify-between'>
                        <h1 className="lg:text-8xl md:text-5xl text-4xl font-extrabold font-satoshi lg:leading-tight md:text-right pe-4">Blogorithm.</h1>
                        <h3 className="lg:text-3xl md:text-2xl text-xl text-wrap lg:w-8/9 md:text-right pe-4 self-center">We're <span className='inline-code text-[#d10a0a]'>Engineers</span> exploring Tech.<br></br>We write about Tech here after work.</h3>
                    </div>
                    <section className='blogs-section px-12'>
                        <div className='mx-auto mb-12'>
                            <div className='grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 gap-4 justify-between'>
                                <div className='lg:self-center'>
                                    <h1 className="lg:text-4xl md:text-3xl text-2xl">Latest in the blog</h1>
                                    <div className="mt-4">
                                        <Link href={`/blog`} className="blog-link">
                                            See All →
                                        </Link>
                                    </div>
                                </div>
                                <div className='lg:col-span-2 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-16'>
                                    {blogs.map((post) => (
                                        <div key={post.slug}>
                                            <div className="aspect-w-16 aspect-h-9">
                                                <BlogTile post_data={post} type="blog" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='works-section mx-w-2xl px-12'>
                        <div className='mx-auto mb-12'>
                            <h1 className="lg:text-4xl md:text-3xl text-2xl">Project Spotlight</h1>
                            <div className="mt-4">
                                <Link href={`/work`} className="blog-link">
                                    See All →
                                </Link>
                            </div>
                            <div className='flex lg:flex-row md:flex-row md:flex-wrap flex-col'>
                                {works.map((post) => (
                                    <div className="flex-1" key={post.slug}>
                                            <BigTile post_data={post} orientation="left" type="work" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className='subscribe-section mx-w-2xl px-12'>
                        <div className='mx-auto my-24'>
                            <div className='w-full flex justify-center items-center border border-[#872341] rounded-lg bg-[#161515]'>
                                <div className='p-12 w-full max-w-2xl text-center'>
                                    <h2 className='text-2xl font-bold mb-4'>Stay Updated</h2>
                                    <p className='mb-4'>Subscribe to get the latest updates.</p>
                                    <SubscribeForm />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Column>
            <footer className='h-24 w-full'></footer>
        </main>
    );
}
