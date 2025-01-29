// import './style.css'
import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import { BlogTile } from '@/components/Tile';
import { routes } from '@/app/resources/config';
import {Post} from "@/interfaces/post";
import {getAllPosts} from "@/lib/api";

export default function WorkHome() {

    const posts = getAllPosts("work");
    posts.sort((a: Post, b: Post) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    let blogs: Post[] = posts.slice(0, 2);


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
