"use client";

import { useEffect, useState } from 'react';
import PostCard, { Post } from '@/components/PostCard'; // Adjusted import path
import CreatePostForm from '@/components/CreatePostForm'; // Adjusted import path

export default function DashboardPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Placeholder for user authentication state
    // In a real app, this would come from an AuthContext or similar
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume logged in for now for display purposes
                                                        // The backend will still enforce auth for creating posts.

    const fetchPosts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/get_posts'); // Using relative path for API route
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch posts: ${response.statusText}`);
            }
            const data: Post[] = await response.json();
            setPosts(data);
        } catch (err: any) {
            setError(err.message);
            console.error("Failed to fetch posts:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = () => {
        fetchPosts(); // Re-fetch posts after a new one is created
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard & Post Feed</h1>

            {isLoggedIn ? (
                <CreatePostForm onPostCreated={handlePostCreated} />
            ) : (
                <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-md shadow">
                    Please <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold">login</a> to create posts and interact.
                </p>
            )}

            <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-700">Recent Posts</h2>
            {isLoading && <p className="text-center text-gray-500">Loading posts...</p>}
            {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">Error loading posts: {error}</p>}
            {!isLoading && !error && posts.length === 0 && (
                <p className="text-center text-gray-500">No posts yet. Be the first to create one!</p>
            )}
            {!isLoading && !error && posts.length > 0 && (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
