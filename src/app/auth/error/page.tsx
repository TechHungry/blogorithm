// src/app/auth/error/page.tsx
'use client';

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Footer } from "@/components/Footer";
import { routes } from '@/app/resources/config';
import ErrorContent from './ErrorContent'; // We'll create this component

export default function ErrorPage() {
    return (
        <>
            <Navbar routes={routes} />
            <div className="flex items-center justify-center min-h-screen px-4">
                <Suspense fallback={
                    <div className="w-full max-w-md p-6 bg-[#161515] rounded-lg shadow-xl border border-gray-700 text-white">
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    </div>
                }>
                    <ErrorContent />
                </Suspense>
            </div>
            <Footer />
        </>
    );
}