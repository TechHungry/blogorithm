// src/app/authorize/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { routes } from '@/app/resources/config';
import Navbar from '@/components/Navbar';
import { Footer } from "@/components/Footer";
import { UserRole, fetchUsers, updateUserRole } from '@/lib/clientUserPermissions';
import type { User } from '@/lib/clientUserPermissions';

export default function AuthorizePage() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // If not authenticated, the middleware should redirect
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
            return;
        }

        // If authenticated, check if admin
        if (status === 'authenticated') {
            const userRole = (session.user as any)?.role;

            if (userRole === UserRole.ADMIN) {
                // Fetch users
                getUsers();
            } else {
                // Should not normally reach here due to middleware
                router.push('/unauthorized');
            }
        }
    }, [session, status, router]);

    // Function to fetch all users
    const getUsers = async () => {
        setIsLoading(true);
        try {
            const usersList = await fetchUsers();
            setUsers(usersList);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to update user role with automatic refresh
    const handleUpdateUserRole = async (email: string, role: UserRole) => {
        setIsLoading(true);
        try {
            // First update the role via API
            const response = await fetch('/api/users/role', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error response from server:', data);
                alert(`Failed to update user role: ${data.error || 'Unknown error'}`);
                return;
            }

            console.log(`Role update succeeded for ${email}: ${role}`);

            // Update local state immediately for responsive UI
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.email === email ? { ...user, role } : user
                )
            );

            // Fetch fresh data to ensure complete consistency
            setTimeout(() => {
                getUsers();
            }, 1000);
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Error updating user role. Please check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    // If loading, show spinner
    if (status === 'loading' || (status === 'authenticated' && !users.length && !isLoading)) {
        return (
            <>
                <Navbar routes={routes}/>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
                </div>
                <Footer/>
            </>
        );
    }

    // Admin user management interface
    return (
        <>
            <Navbar routes={routes}/>
            <div className="container mx-auto p-4 text-white">
                <h1 className={`font-satoshi text-2xl mt-4 mb-16`}>Blogorithm.</h1>

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">User Management</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={getUsers}
                            disabled={isLoading}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-300 transition duration-200"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3 border border-gray-600 text-left">User</th>
                            <th className="p-3 border border-gray-600 text-left">Email</th>
                            <th className="p-3 border border-gray-600 text-left">Role</th>
                            <th className="p-3 border border-gray-600 text-left">Joined</th>
                            <th className="p-3 border border-gray-600 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-700">
                                <td className="p-3 border border-gray-600">
                                    <div className="flex items-center space-x-3">
                                        {user.image && (
                                            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                                        )}
                                        <span>{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-3 border border-gray-600">{user.email}</td>
                                <td className="p-3 border border-gray-600">
                    <span className={`px-2 py-1 rounded text-xs ${
                        user.role === UserRole.ADMIN
                            ? 'bg-purple-900 text-purple-200'
                            : user.role === UserRole.WRITER
                                ? 'bg-green-900 text-green-200'
                                : user.role === UserRole.PENDING
                                    ? 'bg-yellow-900 text-yellow-200'
                                    : 'bg-gray-700 text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                                </td>
                                <td className="p-3 border border-gray-600">{formatDate(user.createdAt)}</td>
                                <td className="p-3 border border-gray-600">
                                    {user.role === UserRole.ADMIN ? (
                                        <span className="text-gray-500">Admin</span>
                                    ) : user.role === UserRole.WRITER ? (
                                        <button
                                            onClick={() => handleUpdateUserRole(user.email, UserRole.VISITOR)}
                                            className="mr-2 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                                        >
                                            Revoke Access
                                        </button>
                                    ) : user.role === UserRole.PENDING ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdateUserRole(user.email, UserRole.WRITER)}
                                                className="mr-2 p-1 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleUpdateUserRole(user.email, UserRole.VISITOR)}
                                                className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200"
                                            >
                                                Deny
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdateUserRole(user.email, UserRole.WRITER)}
                                            className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                                        >
                                            Grant Access
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={5} className="p-3 border border-gray-600 text-center">
                                    No users found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
}