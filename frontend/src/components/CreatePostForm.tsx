"use client";

import { useState, FormEvent } from 'react';

interface CreatePostFormProps {
    onPostCreated: () => void; // Callback to refresh posts list
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Placeholder for checking if the user is logged in.
    // In a real app, this would come from an auth context or similar.
    const isLoggedIn = true; // Assume user is logged in for now.

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!content.trim()) {
            setMessage('Post content cannot be empty.');
            return;
        }
        setMessage('');
        setIsLoading(true);

        const response = await fetch('/api/create_post', { // Using relative path for API route
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });

        const data = await response.json();
        setIsLoading(false);

        if (response.ok) {
            setMessage(`Success: ${data.message}`);
            setContent(''); // Clear the form
            onPostCreated(); // Trigger refresh of post list
        } else {
            setMessage(`Error: ${data.message || 'Failed to create post.'}`);
        }
    };

    if (!isLoggedIn) {
        return <p className="text-center text-gray-600">Please <a href="/login" className="text-indigo-600 hover:text-indigo-500">login</a> to create a post.</p>;
    }

    return (
        <div className="my-6 p-4 bg-white shadow-md rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Create a New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 sr-only">
                        Post Content
                    </label>
                    <textarea
                        id="postContent"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        required
                        placeholder="What's on your mind?"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                    {isLoading ? 'Posting...' : 'Create Post'}
                </button>
            </form>
            {message && (
                <p className={`mt-3 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
