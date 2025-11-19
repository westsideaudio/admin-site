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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Westside Audio</h1>
            <p className="text-muted-foreground">Admin Portal</p>
          </div>

          {/* Login Button */}
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-6 py-3 transition-all hover:shadow-md font-medium"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Sign in with Google
          </button>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Westside Audio. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}