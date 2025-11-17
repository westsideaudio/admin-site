'use client';

interface HamburgerIconProps {
  onClick: () => void;
}

export default function HamburgerIcon({ onClick }: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
      aria-label="Open main menu"
    >
      <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}