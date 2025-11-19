import { Suspense } from 'react';
import Link from 'next/link';
import ProductList from '../components/ProductList';
import ProductListSkeleton from '../components/ProductListSkeleton';
import { Product } from '@/models/product';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/product';

async function getProducts(): Promise<Product[]> {
  await dbConnect();
  // Use lean() for performance and to return POJOs. Sort by newest first.
  const products = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
  // Serialize _id and other non-serializable fields
  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory, prices, and featured items.</p>
        </div>
        <Link href="/admin/products/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium shadow-sm">
          Add New Product
        </Link>
      </div>
      <Suspense fallback={<ProductListSkeleton />}>
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <ProductList products={products} />
        </div>
      </Suspense>
    </div>
  );
}
