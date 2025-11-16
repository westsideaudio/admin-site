'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'You are not authorized to access this page.';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="mt-4 text-lg">{errorMessage}</p>
      <Link href="https://westsideaudio-sg.com" className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        Are you lost?
      </Link>
    </div>
  );
}