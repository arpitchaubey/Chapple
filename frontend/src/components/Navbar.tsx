"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    // Basic styling for active link
    const activeLinkStyle = "text-blue-500 font-bold";
    const inactiveLinkStyle = "text-gray-700 hover:text-blue-500";

    return (
        <nav className="bg-gray-100 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-semibold text-gray-800">
                    MyApp
                </Link>
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/" className={pathname === '/' ? activeLinkStyle : inactiveLinkStyle}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className={pathname === '/login' ? activeLinkStyle : inactiveLinkStyle}>
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link href="/register" className={pathname === '/register' ? activeLinkStyle : inactiveLinkStyle}>
                            Register
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard" className={pathname === '/dashboard' ? activeLinkStyle : inactiveLinkStyle}>
                            Dashboard
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
