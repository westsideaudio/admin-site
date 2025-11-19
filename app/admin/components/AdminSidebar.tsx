'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import HamburgerIcon from './HamburgerIcon';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden bg-primary text-primary-foreground py-3 px-4 flex items-center justify-between shadow-md z-50 sticky top-0">
        <div className="flex items-center space-x-3">
          <HamburgerIcon onClick={toggleMobileMenu} />
          <h2 className="text-lg font-bold tracking-tight">Admin Panel</h2>
        </div>
        {session && (
          <div className="text-xs opacity-80">{session.user?.email}</div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={toggleMobileMenu}>
          <nav className="absolute top-[52px] left-0 w-64 h-[calc(100vh-52px)] bg-card text-card-foreground shadow-xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-2 rounded-md transition-colors ${isActive(link.href) ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
                    onClick={toggleMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 border-t border-border">
              <button
                onClick={() => { signOut(); toggleMobileMenu(); }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-primary-foreground min-h-screen flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-primary-foreground/10">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
          {session && (
            <p className="text-xs text-primary-foreground/70 mt-1 truncate" title={session.user?.email || ''}>{session.user?.email}</p>
          )}
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-3 rounded-md transition-colors ${isActive(link.href) ? 'bg-primary-foreground/10 font-medium' : 'hover:bg-primary-foreground/5 text-primary-foreground/80'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}