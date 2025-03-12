// src/app/request-access/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { routes } from '@/app/resources/config';
import { UserRole, requestAccess } from '@/lib/clientUserPermissions';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues with the session refresher
const SessionRefresher = dynamic(
    () => import('@/components/SessionRefresher/SessionRefresher'),
    { ssr: false }
);

export default function RequestAccessPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [requestStatus, setRequestStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    // Check the user's ACTUAL role from Redis on page load
    useEffect(() => {
        async function checkUserRole() {
            if (status === 'authenticated' && session?.user?.email) {
                setIsCheckingStatus(true);
                try {
                    // Get the current role from the API
                    const response = await fetch('/api/auth/refresh-session');
                    if (response.ok) {
                        const data = await response.json();
                        const currentRole = data.updatedRole; // Get the role from Redis

                        console.log("Actual role from Redis:", currentRole);

                        // If already writer or admin, redirect to write page
                        if (currentRole === UserRole.WRITER || currentRole === UserRole.ADMIN) {
                            // Update the session with the new role first
                            await update();
                            router.push('/write');
                            return;
                        }

                        // If pending, show pending message
                        if (currentRole === UserRole.PENDING) {
                            console.log("User has PENDING status in Redis");
                            setRequestStatus('pending');
                        }
                    } else {
                        console.error("Failed to check role from API");
                    }
                } catch (error) {
                    console.error("Error checking user role:", error);
                } finally {
                    setIsCheckingStatus(false);
                }
            } else if (status === 'unauthenticated') {
                signIn('google');
            } else if (status !== 'loading') {
                setIsCheckingStatus(false);
            }
        }

        checkUserRole();
    }, [session, status, router, update]);

    const handleRequestAccess = async () => {
        if (!session?.user?.email) return;

        setIsLoading(true);

        try {
            const success = await requestAccess(session.user.email);

            if (success) {
                console.log("Request successful, setting status to pending");
                setRequestStatus('pending');

                // Update the session to reflect the new role
                await update();
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
        await signOut({ redirect: false });
        signIn('google', { callbackUrl: '/write' });
    };

    // Handle successful role update
    const handleRoleUpdate = (newRole: UserRole) => {
        console.log("Role updated to:", newRole);
        if (newRole === UserRole.WRITER || newRole === UserRole.ADMIN) {
            setTimeout(() => router.push('/write'), 1500);
        }
    };

    console.log("requestStatus", requestStatus);

    return (
        <>
            <Navbar routes={routes} />
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-white">
                    <h1 className="text-2xl font-bold mb-6 text-center">Writer Access Request</h1>

                    {(status === 'loading' || isCheckingStatus) && (
                        <div className="flex justify-center my-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
                            <span className="ml-3 text-gray-300">Checking access status...</span>
                        </div>
                    )}

                    {status === 'authenticated' && !isCheckingStatus && requestStatus !== 'pending' && (
                        <div className="space-y-6">
                            <p>
                                Hello, <span className="font-medium">{session?.user?.name || 'User'}</span>! You need special access to create blog posts on this platform.
                            </p>
                            <p>
                                Click the button below to request writer access. An administrator will review your request.
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

                    {status === 'authenticated' && !isCheckingStatus && requestStatus === 'pending' && (
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
                                    If an administrator has approved your request, you can check your access status or sign out and back in to refresh your permissions.
                                </p>

                                {/* New SessionRefresher component */}
                                <SessionRefresher onRoleUpdate={handleRoleUpdate} />

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

                    {requestStatus === 'error' && (
                        <div className="bg-red-900/30 p-4 rounded-md border border-red-800">
                            <p className="text-red-300 font-medium">Something went wrong!</p>
                            <p className="mt-2 text-gray-300">
                                There was an error submitting your request. Please try again later or contact the administrator.
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
            <Footer />
        </>
    );
}