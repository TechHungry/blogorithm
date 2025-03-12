// src/app/about/page.tsx
import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import { routes } from '@/app/resources/config';
import { Footer } from "@/components/Footer";
import CollaborateForm from '@/components/CollaborateForm';

export default async function AboutHome() {
    return (
        <>
            <Navbar routes={routes}/>
            <Column classes={`mt-28`}>
                <div className='relative'>
                    <div className='me-auto my-24 px-12'>
                        <div className='my-12'>
                            <h1 className="lg:text-8xl md:text-6xl text-6xl font-extrabold font-satoshi lg:leading-tight text-center">About Us.</h1>
                        </div>
                    </div>

                    {/* Collaboration Section */}
                    <div className="container lg:w-2/3 bg-[#1D1C1C] rounded-lg p-8 my-12 mx-auto">
                        <h2 className="text-3xl font-bold mb-4 text-white">Want to Contribute?</h2>
                        <p className="text-gray-300 mb-6">
                            Interested in writing a blog post for us? Share your ideas and and we'll get back to you soon!
                        </p>
                        <CollaborateForm />
                    </div>
                </div>
            </Column>
            <Footer />
        </>
    );
}