// src/app/unauthorized/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { Footer } from "@/components/Footer";
import { routes } from '@/app/resources/config';

export default function UnauthorizedPage() {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <>
            <Navbar routes={routes} />
            <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
                <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-white">
                    <h1 className="text-2xl font-bold mb-6 text-center">Access Denied</h1>

                    <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-md">
                        <p className="text-red-300 font-medium">You don't have permission to access this page</p>
                        <p className="mt-2 text-gray-300">
                            {session ?
                                "Your account doesn't have the required permissions." :
                                "You need to sign in to access this page."}
                        </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                        {!session && (
                            <button
                                onClick={() => router.push('/api/auth/signin')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Sign In
                            </button>
                        )}
                        {session && (
                            <button
                                onClick={() => router.push('/request-access')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Request Access
                            </button>
                        )}
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}