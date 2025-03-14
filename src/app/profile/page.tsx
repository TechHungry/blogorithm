// src/app/profile/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Plus, Github, Linkedin, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { routes } from '@/app/resources/config';
import { UserRole } from '@/lib/clientUserPermissions';
import { SanityDocument } from 'next-sanity';

type SocialLink = {
    platform: string;
    url: string;
    _key?: string;
};

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [userPosts, setUserPosts] = useState<SanityDocument[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'posts' | 'settings'>('posts');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Form state for profile settings
    const [bio, setBio] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [newLink, setNewLink] = useState<SocialLink>({ platform: '', url: '' });

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
        }

        if (status === 'authenticated' && session?.user?.email) {
            fetchUserPosts();
            fetchUserProfile();
        }
    }, [status, session, router]);

    const fetchUserPosts = async () => {
        if (!session?.user?.email) return;

        try {
            const response = await fetch(`/api/user/posts?email=${encodeURIComponent(session.user.email)}`);

            if (response.ok) {
                const data = await response.json();
                setUserPosts(data.posts);
            } else {
                console.error('Error fetching user posts:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        if (!session?.user?.email) return;

        try {
            const response = await fetch(`/api/user/profile?email=${encodeURIComponent(session.user.email)}`);

            if (response.ok) {
                const data = await response.json();
                setUserProfile(data.profile);
            } else {
                console.error('Error fetching user profile:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    // Initialize form values when profile is loaded
    useEffect(() => {
        if (userProfile) {
            // Set bio from bioText field (converted from block content)
            setBio(userProfile.bioText || '');

            // Set social links if available
            if (userProfile.socialLinks && Array.isArray(userProfile.socialLinks)) {
                setSocialLinks(userProfile.socialLinks);
            }

            // Set profile image preview URL if available
            if (userProfile.profileImageData) {
                const imageRef = userProfile.profileImageData.asset._ref;
                const imageUrl = `https://cdn.sanity.io/images/${userProfile.projectId}/${userProfile.dataset}/${imageRef
                    .replace('image-', '')
                    .replace('-jpg', '.jpg')
                    .replace('-png', '.png')
                    .replace('-webp', '.webp')
                    .replace('-jpeg', '.jpeg')}`;
                setPreviewUrl(imageUrl);
            } else if (userProfile.profileImage) {
                setPreviewUrl(userProfile.profileImage);
            }
        }
    }, [userProfile]);

    // Handler for file selection
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }, []);

    // Social link handlers
    const handleAddLink = useCallback(() => {
        if (newLink.platform && newLink.url) {
            // Generate a unique key for the new link
            const _key = Date.now().toString();
            setSocialLinks(prev => [...prev, { ...newLink, _key }]);
            setNewLink({ platform: '', url: '' });
        }
    }, [newLink]);

    const handleRemoveLink = useCallback((index: number) => {
        setSocialLinks(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleLinkChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: 'platform' | 'url') => {
        setNewLink(prev => ({ ...prev, [field]: e.target.value }));
    }, []);

    // Handler for profile update
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user?.email) return;

        setIsUpdating(true);

        try {
            // Create FormData for image upload
            const formData = new FormData();
            formData.append('email', session.user.email);
            formData.append('bio', bio);

            // Add social links as JSON
            formData.append('socialLinks', JSON.stringify(socialLinks));

            if (imageFile) {
                formData.append('profileImage', imageFile);
            }

            const response = await fetch('/api/user/update-profile', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                // Refresh profile data
                fetchUserProfile();
            } else {
                console.error('Error updating profile:', await response.text());
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating your profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    // Helper to get icon for social link platform
    const getSocialIcon = (platform: string) => {
        platform = platform.toLowerCase();
        if (platform.includes('github')) return <Github size={16} />;
        if (platform.includes('linkedin')) return <Linkedin size={16} />;
        return <Globe size={16} />;
    };

    if (status === 'loading' || (status === 'authenticated' && isLoading)) {
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
            <div className="container mx-auto p-4 text-white mt-28">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    {/* Profile Summary */}
                    <div className="md:w-1/3 bg-[#161515] rounded-lg p-6 flex flex-col items-center">
                        {/* Profile Image with Fallback */}
                        <div className="relative w-32 h-32 mb-4">
                            {previewUrl || userProfile?.profileImageData || session?.user?.image ? (
                                <>
                                    <img
                                        src={
                                            previewUrl ??
                                            (userProfile?.profileImageData ?
                                                `https://cdn.sanity.io/images/${userProfile.projectId}/${userProfile.dataset}/${userProfile.profileImageData.asset._ref
                                                    .replace('image-', '')
                                                    .replace('-jpg', '.jpg')
                                                    .replace('-png', '.png')
                                                    .replace('-webp', '.webp')
                                                    .replace('-jpeg', '.jpeg')}`
                                                : session?.user?.image)
                                        }
                                        alt={session?.user?.name || 'User'}
                                        className="w-full h-full rounded-full object-cover"
                                        onError={(e) => {
                                            // Hide the broken image
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';

                                            // Show the fallback
                                            const fallback = target.parentElement?.querySelector('.profile-fallback');
                                            if (fallback) {
                                                (fallback as HTMLElement).style.display = 'flex';
                                            }
                                        }}
                                    />

                                    {/* Hidden fallback that becomes visible on image error */}
                                    <div
                                        className="profile-fallback w-full h-full rounded-full bg-[#872341] text-white flex items-center justify-center text-2xl font-bold absolute top-0 left-0"
                                        style={{ display: 'none' }}
                                    >
                                        {session?.user?.name
                                            ? session.user.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)
                                            : 'U'}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full rounded-full bg-[#872341] text-white flex items-center justify-center text-2xl font-bold">
                                    {session?.user?.name
                                        ? session.user.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)
                                        : 'U'}
                                </div>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold mb-2">{session?.user?.name}</h1>
                        <p className="text-gray-300 mb-4">{session?.user?.email}</p>

                        <div className="w-full">
                            <p className="text-gray-300 mb-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    (session?.user as any)?.role === UserRole.ADMIN
                                        ? 'bg-purple-900 text-purple-200'
                                        : (session?.user as any)?.role === UserRole.WRITER
                                            ? 'bg-green-900 text-green-200'
                                            : (session?.user as any)?.role === UserRole.PENDING
                                                ? 'bg-yellow-900 text-yellow-200'
                                                : 'bg-gray-700 text-gray-300'
                                }`}>
                                    {(session?.user as any)?.role || 'VISITOR'}
                                </span>
                            </p>
                            {userProfile?.bioText && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                                    <p className="text-gray-300">{userProfile.bioText}</p>
                                </div>
                            )}

                            {/* Social Links */}
                            {userProfile?.socialLinks && userProfile.socialLinks.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2">Connect</h3>
                                    <div className="flex flex-col gap-2">
                                        {userProfile.socialLinks.map((link: SocialLink, index: number) => (
                                            <a
                                                key={link._key || index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                                            >
                                                {getSocialIcon(link.platform)}
                                                <span>{link.platform}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(session?.user as any)?.role === UserRole.ADMIN && (
                                <Link href="/admin/blogs" className="block w-full text-center bg-purple-600 text-white rounded px-4 py-2 mt-2 hover:bg-purple-700 transition-colors">
                                    Admin Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full bg-red-600 text-white rounded px-4 py-2 mt-4 hover:bg-red-700 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:w-2/3 bg-[#161515] rounded-lg p-6">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-700 mb-6">
                            <button
                                className={`px-4 py-2 ${activeTab === 'posts' ? 'text-white border-b-2 border-[#872341]' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('posts')}
                            >
                                My Posts
                            </button>
                            <button
                                className={`px-4 py-2 ${activeTab === 'settings' ? 'text-white border-b-2 border-[#872341]' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                Profile Settings
                            </button>
                        </div>

                        {/* Posts Tab */}
                        {activeTab === 'posts' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">My Blog Posts</h2>
                                    <Link href="/profile/new-post" className="bg-[#872341] text-white rounded px-4 py-2 hover:bg-[#6f1b36] transition-colors">
                                        Write New Post
                                    </Link>
                                </div>

                                {userPosts.length > 0 ? (
                                    <div className="grid gap-4">
                                        {userPosts.map((post) => (
                                            <div key={post._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                                                    <span className={`px-2 py-1 h-6 rounded text-xs ${
                                                        post.status === 'PUBLISHED'
                                                            ? 'bg-green-900 text-green-200'
                                                            : post.status === 'DRAFT'
                                                                ? 'bg-yellow-900 text-yellow-200'
                                                                : post.status === 'PENDING'
                                                                    ? 'bg-blue-900 text-blue-200'
                                                                    : 'bg-gray-700 text-gray-300'
                                                    }`}>
                                                        {post.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 mb-3 text-sm">
                                                    {new Date(post.publishedAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-gray-300 mb-4">{post.summary}</p>
                                                <div className="flex space-x-2">
                                                    {post.status === 'PUBLISHED' && (
                                                        <Link href={`/blog/${post.slug.current}`} className="text-blue-400 hover:underline">
                                                            View
                                                        </Link>
                                                    )}
                                                    <Link href={`/profile/edit/${post.slug.current}`} className="text-blue-400 hover:underline">
                                                        Edit
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-300 mb-4">You haven&#39;t written any posts yet!</p>
                                        <Link href="/profile/new-post" className="bg-[#872341] text-white rounded px-4 py-2 hover:bg-[#6f1b36] transition-colors">
                                            Create Your First Post
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                                <form onSubmit={handleProfileUpdate}>
                                    <div className="mb-6">
                                        <label className="block text-gray-300 mb-2">Profile Picture</label>
                                        <div className="flex items-center space-x-4">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Profile preview"
                                                    className="w-24 h-24 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-[#872341] text-white flex items-center justify-center text-xl font-bold">
                                                    {session?.user?.name ? session.user.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded block text-center">
                                                    Choose Image
                                                    <input
                                                        type="file"
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
                                                            setPreviewUrl(userProfile?.profileImage || '');
                                                        }}
                                                        className="mt-2 text-sm text-red-400 hover:underline"
                                                    >
                                                        Reset Image
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-300 mb-2">Bio</label>
                                        <textarea
                                            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                            rows={4}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Write something about yourself..."
                                        ></textarea>
                                    </div>

                                    {/* Social Links Section */}
                                    <div className="mb-6">
                                        <label className="block text-gray-300 mb-2">Social Links</label>

                                        {/* Existing Links */}
                                        {socialLinks.length > 0 && (
                                            <div className="mb-4 space-y-2">
                                                {socialLinks.map((link, index) => (
                                                    <div key={link._key || index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                                                        <div className="flex items-center gap-2">
                                                            {getSocialIcon(link.platform)}
                                                            <span>{link.platform}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <a
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-400 hover:underline text-sm"
                                                            >
                                                                {link.url.length > 30 ? link.url.substring(0, 30) + '...' : link.url}
                                                            </a>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveLink(index)}
                                                                className="text-red-400 hover:text-red-300"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add New Link */}
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <select
                                                value={newLink.platform}
                                                onChange={(e) => handleLinkChange(e, 'platform')}
                                                className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="">Select Platform</option>
                                                <option value="GitHub">GitHub</option>
                                                <option value="LinkedIn">LinkedIn</option>
                                                <option value="Website">Website</option>
                                                <option value="Twitter">Twitter</option>
                                                <option value="Custom">Custom</option>
                                            </select>

                                            {newLink.platform === 'Custom' && (
                                                <input
                                                    type="text"
                                                    placeholder="Platform name"
                                                    value={newLink.platform === 'Custom' ? '' : newLink.platform}
                                                    onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                                                    className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                                />
                                            )}

                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                value={newLink.url}
                                                onChange={(e) => handleLinkChange(e, 'url')}
                                                className="flex-1 bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                            />

                                            <button
                                                type="button"
                                                onClick={handleAddLink}
                                                disabled={!newLink.platform || !newLink.url}
                                                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-1"
                                            >
                                                <Plus size={16} />
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="bg-[#872341] text-white rounded px-4 py-2 hover:bg-[#6f1b36] transition-colors disabled:bg-gray-600"
                                    >
                                        {isUpdating ? 'Updating...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}