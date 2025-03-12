// src/app/authorize/page.tsx
'use client';

import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {routes} from '@/app/resources/config';
import Navbar from '@/components/Navbar';
import {Footer} from "@/components/Footer";

interface Token {
    id: string;
    value: string;
    createdAt: string;
}

export default function AuthorizePage() {
    const [password, setPassword] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newToken, setNewToken] = useState<Token | null>(null);
    const router = useRouter();

    // Function to check password
    const checkPassword = async () => {
        // In a real app, you would hash this password and verify on the server
        // For simplicity, we're just checking against the ADMIN_PASSWORD

        if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'change-this-password')) {
            setIsAuthorized(true);
            await fetchTokens();
        } else {
            alert('Incorrect password');
        }
    };

    // Function to fetch all tokens
    const fetchTokens = async () => {
        console.log("Setting loading to true");
        setIsLoading(true);
        try {
            console.log("Fetching tokens with password:", password);
            const response = await fetch('/api/tokens', {
                method: 'GET',
                headers: {
                    'Authorization': `${password}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                setTokens(data.tokens);
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error('Error fetching tokens:', error);
        } finally {
            console.log("Setting loading to false");
            setIsLoading(false);
        }
    };

    // Function to generate a new token
    const generateNewToken = async () => {
        console.log("Setting loading to true");
        setIsLoading(true);
        try {
            const response = await fetch('/api/tokens', {
                method: 'POST',
                headers: {
                    'Authorization': `${password}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNewToken(data.token);
                setShowModal(true);
                await fetchTokens();
            } else {
                const errorText = await response.text();
                console.error('Error generating token:', errorText);
                alert('Failed to generate token. Please check console for details.');
            }
        } catch (error) {
            console.error('Error generating token:', error);
            alert('Error generating token. Please check console for details.');
        } finally {
            console.log("Setting loading to false");
            setIsLoading(false);
        }
    };

    // Function to delete a token
    const deleteTokenById = async (id: string) => {
        console.log("Setting loading to true");
        setIsLoading(true);
        try {
            const response = await fetch(`/api/tokens?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${password}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                await fetchTokens();
            } else {
                const errorText = await response.text();
                console.error('Error deleting token:', errorText);
                alert('Failed to delete token. Please check console for details.');
            }
        } catch (error) {
            console.error('Error deleting token:', error);
            alert('Error deleting token. Please check console for details.');
        } finally {
            console.log("Setting loading to true");
            setIsLoading(false);
        }
    };

    // Function to copy token link to clipboard
    const copyToClipboard = (tokenValue: string) => {
        const tokenLink = `${window.location.origin}/write?token=${tokenValue}`;
        navigator.clipboard.writeText(tokenLink);
        alert('Link copied to clipboard!');
    };

    // Function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    // If not authorized, show login screen
    if (!isAuthorized) {
        return (
            <>
                <Navbar routes={routes}/>
                <div className="flex items-center justify-around my-auto">
                    <div className="p-6 bg-gray-800 rounded shadow-md text-white w-full max-w-md border border-gray-700">
                        <h1 className="text-2xl font-bold mb-4">Authorization Required</h1>
                        <div className="mb-4">
                            <label className="block mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
                            />
                        </div>
                        <button
                            onClick={checkPassword}
                            className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 text-white transition duration-200"
                        >
                            Login
                        </button>
                    </div>
                </div>
                <Footer/>
            </>
        );
    }

    // If authorized, show token management screen
    return (
        <>
            <Navbar routes={routes}/>
            <div className="container mx-auto p-4  text-white">
                <h1 className={`font-satoshi text-2xl mt-4 mb-16`}>Blogorithm.</h1>

                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={generateNewToken}
                        disabled={isLoading}
                        className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-300 transition duration-200"
                    >
                        Generate New Token
                    </button>

                    <button
                        onClick={() => {
                            setIsAuthorized(false);
                            setPassword('');
                        }}
                        className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200"
                    >
                        Logout
                    </button>
                </div>

                {isLoading && !showModal && (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3 border border-gray-600 text-left">Serial</th>
                            <th className="p-3 border border-gray-600 text-left">Token Preview</th>
                            <th className="p-3 border border-gray-600 text-left">Created At</th>
                            <th className="p-3 border border-gray-600 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tokens.map((token, index) => (
                            <tr key={token.id} className="hover:bg-gray-700">
                                <td className="p-3 border border-gray-600">{index + 1}</td>
                                <td className="p-3 border border-gray-600 font-mono">{token.value.substring(0, 8)}...</td>
                                <td className="p-3 border border-gray-600">{formatDate(token.createdAt)}</td>
                                <td className="p-3 border border-gray-600">
                                    <button
                                        onClick={() => copyToClipboard(token.value)}
                                        className="mr-2 p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                                    >
                                        Copy Link
                                    </button>
                                    <button
                                        onClick={() => deleteTokenById(token.id)}
                                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {tokens.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-3 border border-gray-600 text-center">
                                    No tokens found. Generate one to get started.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Modal for new token */}
                {showModal && newToken && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-70 z-50">
                        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full border border-gray-700 shadow-xl">
                            <h2 className="text-xl font-bold mb-4 text-white">New Token Generated</h2>
                            <p className="mb-2 text-gray-300">Use this link to access the write page:</p>
                            <div className="p-3 bg-gray-900 rounded-md mb-4 break-all font-mono text-sm text-blue-400 border border-gray-700">
                                {`${window.location.origin}/write?token=${newToken.value}`}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => copyToClipboard(newToken.value)}
                                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                                >
                                    Copy to Clipboard
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}