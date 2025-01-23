import './style.css'
import Navbar from '@/components/Navbar';
import Column from '@/components/Column/Column';
import React from 'react';


export default function About() {
    return (
        <main>
            <Navbar />
            <Column >
                <div className='relative px-4 sm:px-8 lg:px-12'>
                    <div className='mx-auto mx-w-2xl lg:max-w-5xl'>
                        <h1 className="text-4xl text-center font-extrabold">ARFATH AHMED SYED</h1>
                        <h3 className="text-2xl text-center mt-2">DATA SCIENTIST</h3>
                    </div>
                </div>
            </Column>
        </main>
    );
}
