import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email || !(process.env.ALLOWED_ADMIN_EMAILS?.split(',').includes(session.user.email))) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}