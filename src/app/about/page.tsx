// import './style.css'
import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import { routes } from '@/app/resources/config';
import  { Footer } from "@/components/Footer";


export default async function AboutHome() {
    return (
        <>
            <Navbar routes={routes}/>
            <Column classes={`mt-32`}>
                <div className='relative'>
                    <div className='me-auto my-24 px-12'>
                        <div className='my-12'>
                            <h1 className="lg:text-8xl md:text-6xl text-6xl font-extrabold font-satoshi lg:leading-tight text-center">About Us.</h1>
                            {/* <h1 className="lg:text-4xl md:text-5xl text-4xl font-extrabold font-satoshi lg:leading-tight pe-4 self-start">on Blogorithm.</h1> */}
                        </div>
                    </div>
                </div>
            </Column>
            <Footer />
        </>
    );
}
