import '@/app/globals.css';
import Header from '@/components/Header';
import Column from '@/components/Column/Column';
import { BlogTile, BigTile } from '@/components/Blog/Tile';
import Link from 'next/link';
// import Carousel from '@/components/Carousel';

export default function Home() {
    return (
        <main>
            <Header activeTab="home" />
            <Column >
                <div className='relative'>
                    <div className='me-auto my-24 px-12'>
                        <h1 className="lg:text-7xl md:text-5xl text-4xl font-extrabold font-satoshi lg:leading-tight md:text-right pe-4">Blogorithm</h1>
                        <h3 className="lg:text-3xl md:text-2xl text-xl mt-5 text-wrap lg:w-8/9 md:text-right pe-4">We're <span className='inline-code'>Engineers</span> exploring Tech.<br></br>We write about Tech here after work.</h3>
                        {/* <h3 className="lg:text-3xl md:text-2xl text-xl mt-5 text-wrap lg:w-4/5">We work on our own projects after hours.</h3> */}
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
                                <div className='lg:col-span-2 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8'>
                                    <div>
                                        <div className="aspect-w-16 aspect-h-9">
                                            <BlogTile title="Interview with Rakuten" type="blog" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="aspect-w-16 aspect-h-9">
                                            <BlogTile title="Segmentation with SAM and YOLO" type="blog" />
                                        </div>
                                    </div>
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
                                <div className='flex-1 '>
                                    <BigTile title="Data Converse" text="Data Converse is a Gen-AI powered tool that revolutionizes analytics by generating automated insights and real-time visualizations—all through a user-friendly interface." type="work" orientation='left'/>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='subscribe-section mx-w-2xl px-12'>
                        <div className='mx-auto my-24'>
                            {/* <h1 className="text-4xl">Subscribe</h1> */}
                            <div className='w-full flex justify-center items-center border border-[#872341] rounded-lg bg-[#161515]'>
                                <div className='p-12 w-full max-w-2xl text-center'>
                                    <h2 className='text-2xl font-bold mb-4 '>Stay Updated</h2>
                                    <p className='mb-4'>Subscribe to get the latest updates.</p>
                                    <form>
                                        <input
                                            type='email'
                                            placeholder='Enter your email'
                                            className='w-full p-2 mb-4 border border-gray-300 rounded'
                                        />
                                        <button
                                            type='submit'
                                            className='w-full bg-[#fff] text-[#000] p-2 rounded border border-[#872341] hover:bg-[#000] hover:text-[#fff]'
                                        >
                                            Subscribe
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Column >
            <footer className='h-24 w-full'></footer>
        </main >
    );
}
