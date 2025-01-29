import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import { routes } from '@/app/resources/config';

export default function About() {

    return (
        <main>
            <Navbar routes={routes}/>
            <Column >
                <div className='relative'>
                    <div className='me-auto my-24 px-12'>
                        <div className='grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 gap-16 justify-between'>
                            <div className='md:self-center self-end'>
                                <h1 className="lg:text-8xl md:text-6xl text-6xl font-extrabold font-satoshi lg:leading-tight">Authors.</h1>
                                {/* <h1 className="lg:text-4xl md:text-5xl text-4xl font-extrabold font-satoshi lg:leading-tight pe-4 self-start">on Blogorithm.</h1> */}
                            </div>
                        </div>
                    </div>
                </div>
            </Column>
            <footer className='h-24 w-full'></footer>
        </main>
    );
}
