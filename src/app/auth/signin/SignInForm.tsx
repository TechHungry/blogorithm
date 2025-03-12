// src/app/auth/signin/SignInForm.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignInForm() {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/';
    const error = searchParams?.get('error') || '';

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signIn('google', { callbackUrl });
    };

    return (
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-900/30 border border-red-800 rounded-md">
                    <p className="text-red-300">
                        {error === 'OAuthSignin' && 'Error starting the sign in process.'}
                        {error === 'OAuthCallback' && 'Error during the OAuth callback.'}
                        {error === 'OAuthCreateAccount' && 'Error creating the OAuth user.'}
                        {error === 'EmailCreateAccount' && 'Error creating the email user.'}
                        {error === 'Callback' && 'Error in the OAuth callback.'}
                        {error === 'OAuthAccountNotLinked' && 'This email is already used with a different sign in method.'}
                        {error === 'EmailSignin' && 'Error sending the email sign in link.'}
                        {error === 'CredentialsSignin' && 'Sign in failed. Check the credentials.'}
                        {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'CredentialsSignin'].includes(error) && 'An unknown error occurred.'}
                    </p>
                </div>
            )}

            <p className="mb-6 text-gray-300">
                Sign in with your Google account to access the writing platform.
            </p>

            <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 space-x-2 bg-white text-gray-800 rounded-md hover:bg-gray-200 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                        <span>Signing in...</span>
                    </div>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            <path fill="none" d="M1 1h22v22H1z" />
                        </svg>
                        <span>Sign in with Google</span>
                    </>
                )}
            </button>
        </div>
    );
}