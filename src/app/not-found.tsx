'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { routes } from '@/app/resources/config'; // Assuming you have routes defined here

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar routes={routes} />

            {/* Main content */}
            <main className="flex-grow flex flex-col items-center justify-center text-white px-4">
                <h1 className="text-9xl font-bold text-white">404</h1>
                <p className="text-2xl mb-8 mt-4 text-center">Oops! The page you're looking for doesn't exist.</p>
                <Link
                    href="/"
                    className="border border-[#872341] bg-[#872341] text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-black"
                >
                    Return to Home
                </Link>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}