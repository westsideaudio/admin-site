import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/admin/products" className="hover:text-gray-300">Products</Link>
          </li>
          {/* Add more admin links here */}
        </ul>
      </nav>
    </aside>
  );
}