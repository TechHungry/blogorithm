// src/app/auth/signin/page.tsx
'use client';

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Footer } from "@/components/Footer";
import { routes } from '@/app/resources/config';
import SignInForm from './SignInForm'; // We'll create this component

export default function SignInPage() {
    return (
        <>
            <Navbar routes={routes} />
            <div className="flex items-center justify-center min-h-screen px-4">
                <Suspense fallback={
                    <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-white">
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    </div>
                }>
                    <SignInForm />
                </Suspense>
            </div>
            <Footer />
        </>
    );
}