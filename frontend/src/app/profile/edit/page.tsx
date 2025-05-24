"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Placeholder for current user data - in a real app, this would come from an auth context/store
const MOCK_CURRENT_USER = {
    username: 'testuser', // Assume this is the logged-in user
    isAuthenticated: true,
};

interface UserProfileData {
    username?: string; // username might not be part of the editable fields but good to have
    full_name: string;
    bio: string;
    profile_picture_url: string;
}

export default function EditProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<UserProfileData>({
        full_name: '',
        bio: '',
        profile_picture_url: '',
    });
    const [initialProfilePicture, setInitialProfilePicture] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Simulate auth check and fetch user data
    useEffect(() => {
        if (!MOCK_CURRENT_USER.isAuthenticated) {
            router.push('/login?message=Please login to edit your profile.');
            return;
        }

        const fetchProfileData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/profile/${MOCK_CURRENT_USER.username}`);
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || `Failed to fetch profile data: ${response.status}`);
                }
                const data: UserProfileData = await response.json();
                setFormData({
                    full_name: data.full_name || '',
                    bio: data.bio || '',
                    profile_picture_url: data.profile_picture_url || '',
                });
                setInitialProfilePicture(data.profile_picture_url || 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=User');
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching profile data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update profile.');
            }
            setSuccessMessage('Profile updated successfully! Redirecting...');
            setTimeout(() => {
                router.push(`/profile/${MOCK_CURRENT_USER.username}`);
            }, 2000); // Redirect after 2 seconds
        } catch (err: any) {
            setError(err.message);
            console.error("Error updating profile:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p className="text-center text-gray-500 pt-10">Loading profile for editing...</p>;
    }

    if (error && !isSubmitting) { // Don't show initial loading error if a submission error occurs
        return <p className="text-center text-red-500 pt-10 bg-red-50 p-4 rounded-md">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Your Profile</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-6">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Your full name"
                    />
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        id="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Tell us a little about yourself"
                    />
                </div>

                <div>
                    <label htmlFor="profile_picture_url" className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture URL
                    </label>
                    <input
                        type="text"
                        name="profile_picture_url"
                        id="profile_picture_url"
                        value={formData.profile_picture_url}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="https://example.com/your-image.png"
                    />
                    {formData.profile_picture_url && (
                        <div className="mt-3">
                             <Image
                                src={formData.profile_picture_url || initialProfilePicture}
                                alt="Profile preview"
                                width={100}
                                height={100}
                                className="rounded-md object-cover shadow-sm"
                                onError={() => {
                                    // Handle broken image links if needed, e.g., show placeholder
                                    const tempFormData = {...formData, profile_picture_url: initialProfilePicture};
                                    setFormData(tempFormData);
                                }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {successMessage && (
                    <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{successMessage}</p>
                )}
                {error && isSubmitting && ( // Show submission specific errors here
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
                )}
            </form>
        </div>
    );
}
