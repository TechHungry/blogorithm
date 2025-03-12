// src/app/request-access/page.tsx
'use client';

import {useState, useEffect} from 'react';
import {useSession, signIn, signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Navbar from '@/components/Navbar';
import {Footer} from '@/components/Footer';
import {routes} from '@/app/resources/config';
import {UserRole, requestAccess} from '@/lib/clientUserPermissions';
import SessionRefresher from '@/components/SessionRefresher';

interface SessionRefresherProps {
    onSuccess?: (newRole: UserRole) => void
}

export default function RequestAccessPage({onSuccess}: SessionRefresherProps) {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [requestStatus, setRequestStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // If not authenticated, prompt sign in
        if (status === 'unauthenticated') {
            signIn('google');
            return;
        }

        // If authenticated, check current role from session
        if (status === 'authenticated') {
            const userRole = (session.user as any)?.role;

            // If already writer or admin, redirect to write page
            if (userRole === UserRole.WRITER || userRole === UserRole.ADMIN) {
                router.push('/write');
            }
            // If pending, show pending message
            else if (userRole === UserRole.PENDING) {
                setRequestStatus('pending');
            }
        }
    }, [session, status, router]);

    const handleRequestAccess = async () => {
        if (!session?.user?.email) return;

        setIsLoading(true);

        try {
            const success = await requestAccess(session.user.email);

            if (success) {
                setRequestStatus('success');
            } else {
                setRequestStatus('error');
            }
        } catch (error) {
            console.error('Error requesting access:', error);
            setRequestStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOutAndIn = async () => {
        await signOut({redirect: false});
        signIn('google', {callbackUrl: '/write'});
    };

    // Handle successful role update
    const handleSessionUpdate = (newRole: UserRole) => {
        if (newRole === UserRole.WRITER || newRole === UserRole.ADMIN) {
            setTimeout(() => router.push('/write'), 1500);
        }
    };

    return (
        <>
            <Navbar routes={routes}/>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
                <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-white">
                    <h1 className="text-2xl font-bold mb-6 text-center">Writer Access Request</h1>

                    {status === 'loading' && (
                        <div className="flex justify-center my-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
                        </div>
                    )}

                    {status === 'authenticated' && !requestStatus && (
                        <div className="space-y-6">
                            <p>
                                Hello, <span className="font-medium">{session?.user?.name || 'User'}</span>! You need
                                special access to create blog posts on this platform.
                            </p>
                            <p>
                                Click the button below to request writer access. An administrator will review your
                                request.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleRequestAccess}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-[#872341] text-white rounded-md hover:bg-[#6f1b36] transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Requesting...' : 'Request Writer Access'}
                                </button>
                            </div>
                        </div>
                    )}

                    {requestStatus === 'pending' && (
                        <div className="space-y-4">
                            <div className="bg-yellow-900/30 p-4 rounded-md border border-yellow-800">
                                <p className="text-yellow-300 font-medium">Your access request is pending approval</p>
                                <p className="mt-2 text-gray-300">
                                    An administrator will review your request soon.
                                </p>
                            </div>

                            {/* Session Refresh Section */}
                            <div className="mt-4 p-4 bg-gray-700/30 rounded-md border border-gray-700">
                                <h3 className="text-lg font-medium mb-2">Already approved?</h3>
                                <p className="text-gray-300 mb-4">
                                    If an administrator has approved your request, you can check your access status or
                                    sign out and back in to refresh your permissions.
                                </p>

                                {/* New SessionRefresher component */}
                                <SessionRefresher onSuccess={handleSessionUpdate}/>

                                <div className="mt-4 border-t border-gray-700 pt-4">
                                    <p className="text-gray-400 text-sm mb-2">Alternative method:</p>
                                    <button
                                        onClick={handleSignOutAndIn}
                                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                                    >
                                        Sign Out and Sign Back In
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-200"
                                >
                                    Return to Homepage
                                </button>
                            </div>
                        </div>
                    )}

                    {requestStatus === 'success' && (
                        <div className="bg-green-900/30 p-4 rounded-md border border-green-800">
                            <p className="text-green-300 font-medium">Request Submitted Successfully!</p>
                            <p className="mt-2 text-gray-300">
                                Your request for writer access has been submitted. An administrator will review it soon.
                                <span className="block mt-2 font-medium">Important: After your request is approved, you'll need to refresh your session for the changes to take effect.</span>
                            </p>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-200"
                                >
                                    Return to Homepage
                                </button>
                            </div>
                        </div>
                    )}

                    {requestStatus === 'error' && (
                        <div className="bg-red-900/30 p-4 rounded-md border border-red-800">
                            <p className="text-red-300 font-medium">Something went wrong!</p>
                            <p className="mt-2 text-gray-300">
                                There was an error submitting your request. Please try again later or contact the
                                administrator.
                            </p>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => setRequestStatus(null)}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-200"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
}