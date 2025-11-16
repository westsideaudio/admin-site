import AdminSidebar from './components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Authentication/Authorization checks are deferred for now as per user's instruction.
  // In a real application, you would check for a valid session here.

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}