'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Session } from 'next-auth';

interface ClientPageProps {
  session: Session;
}

export default function ClientPage({ session }: ClientPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Welcome, {session.user?.email}!</h1>
      <p>You are logged in to the admin panel.</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}