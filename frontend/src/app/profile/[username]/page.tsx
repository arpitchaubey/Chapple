"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image'; 
import Link from 'next/link'; 
import { useParams } from 'next/navigation'; 

// Placeholder for current user data
const MOCK_CURRENT_USER = {
    username: 'testuser', 
    isAuthenticated: true,
};

interface UserProfile {
    id: number;
    username: string;
    email: string; 
    bio: string | null;
    profile_picture_url: string | null;
    full_name: string | null;
    date_joined: string | null; // Added date_joined
}

// Helper function to format date
const formatDate = (isoString: string | null) => {
    if (!isoString) return "Not available";
    try {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid date";
    }
};

export default function UserProfilePage() {
    const params = useParams();
    const usernameFromRoute = params.username as string;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isOwnProfile = MOCK_CURRENT_USER.isAuthenticated && MOCK_CURRENT_USER.username === usernameFromRoute;

    useEffect(() => {
        if (usernameFromRoute) {
            const fetchProfile = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/profile/${usernameFromRoute}`); 
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error('User not found.');
                        }
                        const errorData = await response.json();
                        throw new Error(errorData.message || `Error: ${response.statusText}`);
                    }
                    const data: UserProfile = await response.json();
                    setProfile(data);
                } catch (err: any) {
                    setError(err.message);
                    console.error("Failed to fetch profile:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProfile();
        }
    }, [usernameFromRoute]);

    if (isLoading) {
        return <p className="text-center text-gray-500 pt-10">Loading profile...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 pt-10 bg-red-50 p-4 rounded-md">{error}</p>;
    }

    if (!profile) {
        return <p className="text-center text-gray-500 pt-10">Profile data is unavailable.</p>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
                <div className="relative h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                        <Image
                            src={profile.profile_picture_url || 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=User'}
                            alt={`${profile.username}'s profile picture`}
                            width={128}
                            height={128}
                            className="rounded-full border-4 border-white shadow-lg object-cover"
                            priority 
                        />
                    </div>
                </div>
                
                <div className="pt-20 pb-6 px-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">{profile.username}</h1>
                    {profile.full_name && (
                        <p className="text-xl text-gray-600 mt-1">{profile.full_name}</p>
                    )}
                </div>

                {isOwnProfile && (
                    <div className="text-center pb-4 px-6">
                        <Link
                            href="/profile/edit"
                            className="inline-block px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Edit Profile
                        </Link>
                    </div>
                )}

                <div className="px-6 py-4 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Bio</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">
                        {profile.bio || <span className="italic text-gray-400">No bio provided.</span>}
                    </p>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Details</h2>
                    <ul className="text-gray-600 space-y-1">
                        <li><strong>Email:</strong> {profile.email}</li> {/* Typically not public */}
                        <li><strong>Joined:</strong> {formatDate(profile.date_joined)}</li> {/* Display formatted date_joined */}
                    </ul>
                </div>
            </div>
        </div>
    );
}
