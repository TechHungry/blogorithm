// src/app/admin-status/page.tsx
'use client';

import React, {useState, useEffect} from 'react';
import {signOut, useSession} from 'next-auth/react';
import Navbar from '@/components/Navbar';
import {Footer} from '@/components/Footer';
import {routes} from '@/app/resources/config';
import {UserRole} from '@/lib/clientUserPermissions';

interface DebugInfo {
    authenticated: boolean;
    user?: {
        name?: string;
        email?: string;
        image?: string;
    };
    isRegisteredAdmin?: boolean;
    adminEmail?: string;
    currentRole?: string;
    sessionRole?: string;
    roleMatch?: boolean;
    admins?: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
    }>;
    primaryAdminEmail?: string;
}

export default function AdminStatusPage() {
    const {data: session, status} = useSession();
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
    const [adminList, setAdminList] = useState<{
        admins: Array<{
            id: string;
            name: string;
            email: string;
            role: string;
        }>;
        primaryAdminEmail?: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchDebugInfo();
            fetchAdmins();
        }
    }, [status]);

    const fetchDebugInfo = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/debug/session');
            if (response.ok) {
                const data = await response.json();
                setDebugInfo(data);
            } else {
                setErrorMsg('Failed to fetch debug info');
            }
        } catch (error) {
            setErrorMsg('Error fetching debug info');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/admins');
            if (response.ok) {
                const data = await response.json();
                setAdminList(data);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    const refreshSession = async () => {
        window.location.reload();
    };

    return (
        <>
            <Navbar routes={routes}/>
            <div className="container mx-auto px-4 py-8 text-white">
                <h1 className={`font-satoshi text-2xl mt-4 mb-16`}>Blogorithm.</h1>

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Admin Status Debug</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => signOut({callbackUrl: '/'})}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={refreshSession}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Refresh Session
                        </button>
                    </div>
                </div>

                {status === 'loading' && (
                    <div className="flex justify-center my-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
                    </div>
                )}

                {status === 'unauthenticated' && (
                    <div className="bg-red-900/30 p-4 rounded-md border border-red-800 mb-6">
                        <p className="text-red-300 font-medium">You are not signed in</p>
                    </div>
                )}

                {status === 'authenticated' && (
                    <div className="space-y-6">
                        <div className="bg-[#161515] p-6 rounded-lg shadow-lg border border-gray-700">
                            <h2 className="text-xl font-semibold mb-4">Session Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 mb-1">Signed in as:</p>
                                    <p className="font-medium">{session.user?.name} ({session.user?.email})</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-1">Session Role:</p>
                                    <p className="font-medium">
                    <span className={`px-2 py-1 rounded text-xs ${
                        (session.user as any)?.role === UserRole.ADMIN
                            ? 'bg-purple-900 text-purple-200'
                            : (session.user as any)?.role === UserRole.WRITER
                                ? 'bg-green-900 text-green-200'
                                : (session.user as any)?.role === UserRole.PENDING
                                    ? 'bg-yellow-900 text-yellow-200'
                                    : 'bg-gray-700 text-gray-300'
                    }`}>
                      {(session.user as any)?.role || 'No role'}
                    </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center my-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : errorMsg ? (
                            <div className="bg-red-900/30 p-4 rounded-md border border-red-800">
                                <p className="text-red-300 font-medium">{errorMsg}</p>
                            </div>
                        ) : debugInfo && (
                            <div className="bg-[#161515] p-6 rounded-lg shadow-lg border border-gray-700">
                                <h2 className="text-xl font-semibold mb-4">Redis Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 mb-1">Registered Admin Email:</p>
                                        <p className="font-medium">{debugInfo.adminEmail || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Is Registered Admin:</p>
                                        <p className="font-medium">
                                            {debugInfo.isRegisteredAdmin
                                                ? <span className="text-green-400">Yes</span>
                                                : <span className="text-red-400">No</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Current Role in Redis:</p>
                                        <p className="font-medium">{debugInfo.currentRole || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Role in Session:</p>
                                        <p className="font-medium">{debugInfo.sessionRole || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Role Match:</p>
                                        <p className="font-medium">
                                            {debugInfo.roleMatch
                                                ? <span className="text-green-400">Yes</span>
                                                : <span
                                                    className="text-red-400">No - Session not in sync with Redis</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {adminList && (
                            <div className="bg-[#161515] p-6 rounded-lg shadow-lg border border-gray-700">
                                <h2 className="text-xl font-semibold mb-4">Admin List</h2>
                                <p className="text-gray-400 mb-1">Primary Admin: {adminList.primaryAdminEmail}</p>

                                {adminList.admins && adminList.admins.length > 0 ? (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium mb-2">All Admins:</h3>
                                        <ul className="space-y-2">
                                            {adminList.admins.map((admin) => (
                                                <li key={admin.id} className="p-2 bg-gray-700 rounded">
                                                    {admin.name} ({admin.email})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-yellow-400">No admin users found in the database.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer/>
        </>
    );
}