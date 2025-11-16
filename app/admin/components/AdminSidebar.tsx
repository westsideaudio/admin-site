'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function AdminSidebar() {
  const { data: session } = useSession();

  return (
<header className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        {session && (
          <p className="text-sm hidden md:block">Hello, <span className="font-semibold">{session.user?.email}</span></p>
        )}
      </div>
      <nav className="flex-grow flex justify-center">
        <ul className="flex space-x-3">
          {/* Add more admin links here */}
        </ul>
      </nav>
      {session && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}