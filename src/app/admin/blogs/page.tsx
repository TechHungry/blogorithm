// src/app/admin/blogs/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SanityDocument } from "next-sanity";
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { routes } from '@/app/resources/config';
import { UserRole } from '@/lib/clientUserPermissions';

export default function AdminBlogsPage() {
    const { data: session, status } = useSession();
    const [blogs, setBlogs] = useState<SanityDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
                // Fetch blogs
                fetchBlogs();
            } else {
                // Should not normally reach here due to middleware
                router.push('/unauthorized');
            }
        }
    }, [session, status, router]);

    // Function to fetch all blogs
    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/blogs');
            if (response.ok) {
                const data = await response.json();
                setBlogs(data.blogs);
            } else {
                console.error('Error fetching blogs:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Functions for blog actions
    const publishBlog = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/blogs/publish?id=${id}`, {
                method: 'POST',
            });
            if (response.ok) {
                fetchBlogs(); // Refresh the list
            } else {
                console.error('Error publishing blog:', await response.text());
            }
        } catch (error) {
            console.error('Error publishing blog:', error);
        }
    };

    const unpublishBlog = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/blogs/unpublish?id=${id}`, {
                method: 'POST',
            });
            if (response.ok) {
                fetchBlogs(); // Refresh the list
            } else {
                console.error('Error unpublishing blog:', await response.text());
            }
        } catch (error) {
            console.error('Error unpublishing blog:', error);
        }
    };

    const deleteBlog = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const response = await fetch(`/api/admin/blogs/delete?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchBlogs(); // Refresh the list
            } else {
                console.error('Error deleting blog:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    // If loading, show spinner
    if (status === 'loading' || (status === 'authenticated' && isLoading)) {
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

    // Admin blogs management interface
    return (
        <>
            <Navbar routes={routes}/>
            <div className="container mx-auto p-4 text-white mt-28">
                <h1 className="text-3xl font-bold mb-8">Blog Management</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-[#161515] border border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3 border border-gray-600 text-left">Title</th>
                            <th className="p-3 border border-gray-600 text-left">Author</th>
                            <th className="p-3 border border-gray-600 text-left">Status</th>
                            <th className="p-3 border border-gray-600 text-left">Date</th>
                            <th className="p-3 border border-gray-600 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog._id} className="hover:bg-gray-700">
                                <td className="p-3 border border-gray-600">
                                    <a href={`/blog/${blog.slug.current}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">
                                        {blog.title}
                                    </a>
                                </td>
                                <td className="p-3 border border-gray-600">
                                    {blog.authors && blog.authors.map((author: any) => author.name).join(', ')}
                                </td>
                                <td className="p-3 border border-gray-600">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            blog.status === 'PUBLISHED'
                                                ? 'bg-green-900 text-green-200'
                                                : blog.status === 'DRAFT'
                                                    ? 'bg-yellow-900 text-yellow-200'
                                                    : blog.status === 'PENDING'
                                                        ? 'bg-blue-900 text-blue-200'
                                                        : 'bg-gray-700 text-gray-300'
                                        }`}>
                                            {blog.status}
                                        </span>
                                </td>
                                <td className="p-3 border border-gray-600">
                                    {new Date(blog.publishedAt).toLocaleDateString()}
                                </td>
                                <td className="p-3 border border-gray-600">
                                    <div className="flex space-x-2">
                                        <a
                                            href={`/profile/edit/${blog.slug.current}`}
                                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Edit
                                        </a>
                                        {blog.status !== 'PUBLISHED' && (
                                            <button
                                                onClick={() => publishBlog(blog._id)}
                                                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                            >
                                                Publish
                                            </button>
                                        )}
                                        {blog.status === 'PUBLISHED' && (
                                            <button
                                                onClick={() => unpublishBlog(blog._id)}
                                                className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                                            >
                                                Unpublish
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteBlog(blog._id)}
                                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {blogs.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={5} className="p-3 border border-gray-600 text-center">
                                    No blogs found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer/>
        </>
    );
}