// src/app/auth/error/ErrorContent.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function ErrorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams?.get('error') || 'Unknown error';

    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'Configuration':
                return 'There is a problem with the server configuration.';
            case 'AccessDenied':
                return 'You do not have permission to sign in.';
            case 'Verification':
                return 'The verification link was invalid or has expired.';
            default:
                return 'An unexpected error occurred during sign in.';
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Authentication Error</h1>

            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-md">
                <p className="text-red-300 font-medium">Error Code: {error}</p>
                <p className="mt-2 text-gray-300">{getErrorMessage(error)}</p>
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => router.push('/auth/signin')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Try Again
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                >
                    Return Home
                </button>
            </div>
        </div>
    );
}