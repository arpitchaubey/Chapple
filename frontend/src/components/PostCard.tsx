"use client";

import { Key } from 'react';

// Define a type for the Post object
export interface Post {
    id: Key | null | undefined;
    content: string;
    author_username: string;
    timestamp: string; // Assuming timestamp is an ISO string
}

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center mb-2">
                <p className="text-lg font-semibold text-gray-800">{post.author_username}</p>
                <span className="text-xs text-gray-500 ml-auto">
                    {new Date(post.timestamp).toLocaleString()}
                </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
    );
}
