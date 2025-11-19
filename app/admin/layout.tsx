import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import { ToastNotification } from './components/ToastNotification'; // Import ToastNotification as a default export

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email || !(process.env.ALLOWED_ADMIN_EMAILS?.split(',').includes(session.user.email))) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
      <ToastNotification /> {/* Add ToastNotification here */}
    </div>
  );
}