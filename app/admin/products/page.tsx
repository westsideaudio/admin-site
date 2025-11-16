import Link from 'next/link';
import ProductList from '../components/ProductList';
import { Product } from '@/models/product';

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Link href="/admin/products/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Product
        </Link>
      </div>
      <ProductList products={products} />
    </div>
  );
}
