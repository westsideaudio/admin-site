'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'There was an issue with your login. Please try again.';
  if (error === 'UnauthorizedAdmin') {
    errorMessage = 'You are not authorized to access the admin panel. Please use an allowed admin email.';
  } else if (error === 'Unauthorized') {
    errorMessage = 'You need to be logged in to access this page.';
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Login Failed</h1>
      <p>{errorMessage}</p>
    </div>
  );
}