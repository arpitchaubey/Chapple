"use client";

import Link from 'next/link'; // Import Link for navigation
import { Key } from 'react';

// Define a type for the Post object
export interface Post {
    id: Key | null | undefined;
    content: string;
    author_username: string;
    timestamp: string; // Assuming timestamp is an ISO string
    user_id: number; // Assuming user_id is part of the post data for linking
}

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center mb-2">
                {/* Link the author's username to their profile page */}
                <Link href={`/profile/${post.author_username}`} className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                    {post.author_username}
                </Link>
                <span className="text-xs text-gray-500 ml-auto">
                    {new Date(post.timestamp).toLocaleString()}
                </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
    );
}
