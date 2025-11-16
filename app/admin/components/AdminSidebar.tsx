'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function AdminSidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <Link href="/admin/products" className="hover:text-gray-300">Products</Link>
          </li>
          {/* Add more admin links here */}
        </ul>
      </nav>
      {session && (
        <div className="mt-auto">
          <p className="text-sm mb-2">Logged in as:</p>
          <p className="font-semibold mb-4">{session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}