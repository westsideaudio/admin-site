'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/products');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button
        onClick={() => signIn('google')}
        className="flex items-center gap-2 rounded-lg bg-white p-4 text-black shadow-md transition-all hover:scale-105 hover:shadow-lg dark:bg-zinc-800 dark:text-white"
      >
        <img src="/google.svg" alt="Google logo" className="h-6 w-6" />
        Login with Google
      </button>
    </div>
  );
}