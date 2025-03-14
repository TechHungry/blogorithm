// src/app/profile/new-post/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { routes } from '@/app/resources/config';
import { UserRole } from '@/lib/clientUserPermissions';

// Using dynamic import with ssr: false to completely skip server-side rendering
const DynamicEditor = dynamic(() => import('@/components/WYSIWYGEditor/WYSIWYGEditor'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
        </div>
    )
});

export default function NewPostPage() {
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        tags: [] as string[],
        tagInput: '',
        content: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
            return;
        }

        // Check user role
        if (status === 'authenticated') {
            const userRole = (session.user as any)?.role;
            if (userRole !== UserRole.WRITER && userRole !== UserRole.ADMIN) {
                router.push('/request-access');
            }
        }
    }, [status, session, router]);

    // Helper to handle a file object
    const handleFile = useCallback((file: File) => {
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }, []);

    // File input onChange
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    // Drag and drop events
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    // Handle form input changes - memoize to prevent unnecessary re-renders
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }, []);

    // Handle editor content changes - memoize and use functional state update
    const handleEditorChange = useCallback((htmlContent: string) => {
        setFormData(prevData => ({ ...prevData, content: htmlContent }));
    }, []);

    // Tag input handlers - memoize to prevent unnecessary re-renders
    const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevData => ({ ...prevData, tagInput: e.target.value }));
    }, []);

    const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && formData.tagInput.trim()) {
            e.preventDefault();
            setFormData(prevData => ({
                ...prevData,
                tags: [...prevData.tags, prevData.tagInput.trim()],
                tagInput: ''
            }));
        } else if (e.key === 'Backspace' && !formData.tagInput && formData.tags.length > 0) {
            // Remove the last tag when backspace is pressed and input is empty
            setFormData(prevData => ({
                ...prevData,
                tags: prevData.tags.slice(0, -1)
            }));
        }
    }, [formData.tagInput, formData.tags]);

    const removeTag = useCallback((index: number) => {
        setFormData(prevData => ({
            ...prevData,
            tags: prevData.tags.filter((_, i) => i !== index)
        }));
    }, []);

    // Handle form submission
    const handleSubmit = useCallback(async (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();

        if (!formData.title || formData.title.trim() === '') {
            alert('Please add a title before submitting');
            return;
        }

        if (!formData.content || formData.content.trim() === '') {
            alert('Please add some content before submitting');
            return;
        }

        if (!imageFile) {
            alert('Please add a cover image before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData object
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('summary', formData.summary);
            submitData.append('status', isDraft ? 'DRAFT' : 'PENDING');

            // Add tags as JSON string
            submitData.append('tags', JSON.stringify(formData.tags));

            // Add the cover image
            submitData.append('coverImage', imageFile);

            // Submit to API
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                body: submitData,
            });

            const data = await response.json();

            if (data.success) {
                alert(isDraft ? 'Draft saved successfully!' : 'Post submitted for review!');
                router.push('/profile');
            } else {
                throw new Error(data.message || 'Failed to submit post');
            }
        } catch (error) {
            console.error('Error submitting post:', error);
            alert('Failed to submit your post. Please try again.');
            setIsSubmitting(false); // Only set isSubmitting to false on error
        }
        // Don't set isSubmitting to false here, as we're redirecting on success
    }, [formData, imageFile, router]);

    if (status === 'loading') {
        return (
            <>
                <Navbar routes={routes} />
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar routes={routes} />
            <div className="container mx-auto p-4 text-white mt-28 mb-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Create New Post</h1>
                    <div className="flex space-x-2">
                        <Link
                            href="/profile"
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                    {/* Row 1: Title and Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title Field */}
                        <div>
                            <label className="block text-gray-300 mb-2">Title*</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        {/* Tags Field */}
                        <div>
                            <label className="block text-gray-300 mb-2">Tags</label>
                            <div className="flex flex-wrap items-center bg-gray-700 text-white rounded p-2 border border-gray-600 focus-within:border-blue-500 min-h-[42px]">
                                {formData.tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-gray-600 text-white text-sm mr-2 mb-1 px-2 py-1 rounded"
                                    >
                                        <span className="mr-1">{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            className="text-white hover:text-gray-300 focus:outline-none"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    value={formData.tagInput}
                                    onChange={handleTagInputChange}
                                    onKeyDown={handleTagKeyDown}
                                    className="flex-grow min-w-[120px] bg-transparent outline-none text-white"
                                    placeholder={formData.tags.length === 0 ? "Add tags (press Enter after each tag)" : ""}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Summary and Cover Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Summary Field */}
                        <div>
                            <label className="block text-gray-300 mb-2">Summary</label>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none h-32"
                                placeholder="Brief summary of your post (optional)"
                            ></textarea>
                        </div>

                        {/* Cover Image Field */}
                        <div>
                            <label className="block text-gray-300 mb-2">Cover Image*</label>
                            <div className="flex flex-col h-32 border border-gray-600 bg-gray-700 rounded overflow-hidden">
                                <div
                                    className="p-2 flex items-center justify-between border-b border-gray-600"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    {previewUrl ? (
                                        <span className="truncate max-w-[150px]">{imageFile?.name}</span>
                                    ) : (
                                        <span className="text-gray-400">Drag or paste image here</span>
                                    )}
                                    <div className="flex space-x-2">
                                        <label
                                            htmlFor="imageInput"
                                            className="cursor-pointer bg-blue-600 text-white rounded px-3 py-1 text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            Browse
                                            <input
                                                type="file"
                                                id="imageInput"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                            />
                                        </label>
                                        {previewUrl && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setPreviewUrl('');
                                                }}
                                                className="bg-red-600 text-white rounded px-3 py-1 text-sm hover:bg-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {previewUrl ? (
                                    <div className="flex-1 bg-[#161515] flex items-center justify-center p-2 overflow-hidden">
                                        <img
                                            src={previewUrl}
                                            alt="Cover preview"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1 bg-[#161515] flex items-center justify-center">
                                        <span className="text-gray-500">No image selected</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-gray-300 mb-2">Content*</label>
                        <DynamicEditor
                            onContentChange={handleEditorChange}
                            initialContent=""
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#872341] text-white rounded hover:bg-[#6f1b36] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}