"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Placeholder for current user data - in a real app, this would come from an auth context/store
const MOCK_CURRENT_USER = {
    username: 'testuser', // Assume this is the logged-in user
    isAuthenticated: true, // Simulate user is logged in
};

export default function Navbar() {
    const pathname = usePathname();

    const activeLinkStyle = "text-indigo-600 font-bold border-b-2 border-indigo-600";
    const inactiveLinkStyle = "text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-500";
    const baseLinkStyle = "pb-1"; // For consistent spacing with border-b

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-indigo-700 hover:text-indigo-500">
                            MyApp
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <ul className="ml-10 flex items-baseline space-x-4">
                            <li>
                                <Link href="/" className={`${baseLinkStyle} ${pathname === '/' ? activeLinkStyle : inactiveLinkStyle}`}>
                                    Home
                                </Link>
                            </li>
                            {MOCK_CURRENT_USER.isAuthenticated ? (
                                <>
                                    <li>
                                        <Link href="/dashboard" className={`${baseLinkStyle} ${pathname === '/dashboard' ? activeLinkStyle : inactiveLinkStyle}`}>
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/profile/${MOCK_CURRENT_USER.username}`} className={`${baseLinkStyle} ${pathname === `/profile/${MOCK_CURRENT_USER.username}` ? activeLinkStyle : inactiveLinkStyle}`}>
                                            My Profile
                                        </Link>
                                    </li>
                                    {/* Consider adding a logout button/link here in a real app */}
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/login" className={`${baseLinkStyle} ${pathname === '/login' ? activeLinkStyle : inactiveLinkStyle}`}>
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/register" className={`${baseLinkStyle} ${pathname === '/register' ? activeLinkStyle : inactiveLinkStyle}`}>
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
