import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import Column from '@/components/Column/Column';
import { BlogTile, BigTile } from '@/components/Blog/Tile';
import Link from 'next/link';


export default function Home() {
    return (
        <main>
            <Navbar activeTab="home" />
            <Column >
                <div className='relative px-8 lg:px-12'>
                    <div className='me-auto my-24 px-12'>
                        <h1 className="lg:text-7xl md:text-5xl text-3xl font-extrabold font-satoshi lg:leading-tight text-right pe-4">Blogorithm</h1>
                        <h3 className="lg:text-3xl md:text-2xl text-xl mt-5 text-wrap lg:w-8/9 text-right pe-4">We're <span className='inline-code'>Data Scientists</span> exploring Tech.<br></br>We write about them here after work.</h3>
                        {/* <h3 className="lg:text-3xl md:text-2xl text-xl mt-5 text-wrap lg:w-4/5">We work on our own projects after hours.</h3> */}
                    </div>
                    <div className='mx-auto mx-w-2xl lg:max-w-5xl mb-12'>
                        <div className='flex lg:flex-row md:flex-row md:flex-wrap flex-col'>
                            <div className='basis-1/4 self-center'>
                                <h1 className="text-4xl">Latest in the blog</h1>
                            </div>
                            <div className='basis-3/4'>
                                <div className='flex lg:flex-row md:flex-row md:flex-wrap flex-col justify-between'>
                                    <div className='basis-1/2'>
                                        <BlogTile title="Interview with Rakuten" type="blog" />
                                    </div>
                                    <div className='basis-1/2'>
                                        <BlogTile title="Interview with Rakuten" type="blog" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex lg:flex-row md:flex-row md:flex-wrap flex-col'>
                            {/* <div className='flex-1'>
                                    <BlogTile title="Interview with Rakuten" type="blog" />
                                </div>
                                <div className='flex-1'>
                                    <BlogTile title="" destination="/blog" type="Blogs"/>
                                </div> */}
                        </div>
                    </div>
                    <div className='mx-auto mx-w-2xl lg:max-w-5xl mb-12'>
                        <h1 className="text-4xl">Works</h1>
                        <div className='flex lg:flex-row md:flex-row md:flex-wrap flex-col'>
                            <div className='flex-1 '>
                                <BigTile title="Data Converse" type="work" />
                            </div>
                        </div>
                        {/* <BlogTile title="" destination="/blog" type="Work"/> */}
                    </div>
                    <div className='mx-auto mx-w-2xl lg:max-w-5xl my-24'>
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
                </div>
            </Column>
            <footer className='h-24 w-full'></footer>
        </main>
    );
}
