'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import HamburgerIcon from './HamburgerIcon'; // Import the new component

export default function AdminSidebar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        {session && (
          <p className="text-sm hidden md:block">Hello, <span className="font-semibold">{session.user?.email}</span></p>
        )}
      </div>

      {/* Hamburger menu for mobile */}
      <HamburgerIcon onClick={toggleMobileMenu} />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-grow justify-center">
        <ul className="flex space-x-3">
          <li>
            <Link href="/admin" className="hover:text-gray-300">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/products" className="hover:text-gray-300">Products</Link>
          </li>
          {/* Add more admin links here */}
        </ul>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-gray-700 z-10">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link href="/admin" className="block hover:text-gray-300" onClick={toggleMobileMenu}>Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/products" className="block hover:text-gray-300" onClick={toggleMobileMenu}>Products</Link>
            </li>
            {/* Add more admin links here */}
            {session && (
              <li>
                <button
                  onClick={() => { signOut(); toggleMobileMenu(); }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}

      {session && (
        <div className="hidden md:flex items-center space-x-2">
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