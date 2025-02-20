import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import { routes } from '@/app/resources/config';
import  { Footer } from "@/components/Footer";

export default function About() {

    return (
        <>
            <Navbar routes={routes}/>
            <Column classes={`mt-32`}>
                <div className='relative'>
                    <div className='me-auto my-24 px-12'>
                        <div className='grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 gap-16 justify-between'>
                            <div className='my-12'>
                                <h1 className="lg:text-8xl md:text-6xl text-6xl font-extrabold font-satoshi lg:leading-tight hidden">Authors.</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </Column>
            <Footer />
        </>
    );
}
