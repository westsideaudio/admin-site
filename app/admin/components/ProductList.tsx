'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/models/product';
import { useRouter } from 'next/navigation';
import { toast } from './ToastNotification';

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'}/image/upload/`;

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('none');

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Product deleted successfully!');
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to delete product: ${errorData.message}`);
      }
    }
  };

  const toggleFeatured = async (productId: string, currentFeaturedStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentFeaturedStatus }),
      });

      if (res.ok) {
        toast.success('Product featured status updated!');
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to update featured status: ${errorData.message}`);
      }
    } catch (error: any) {
      toast.error(`An unexpected error occurred: ${error.message}`);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filterCategory === 'all') return true;
    return product.category === filterCategory;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.price - b.price;
    }
    if (sortOrder === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-card rounded-t-lg">
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <select
            id="categoryFilter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="block w-full md:w-48 p-2 border border-input rounded-md shadow-sm text-sm bg-background text-foreground focus:ring-primary focus:border-primary"
          >
            <option value="all">All Categories</option>
            <option value="vinyl-cd">Vinyl/CDs</option>
            <option value="audio-equipment">Audio Equipment</option>
          </select>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="block w-full md:w-48 p-2 border border-input rounded-md shadow-sm text-sm bg-background text-foreground focus:ring-primary focus:border-primary"
          >
            <option value="none">Sort by...</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {sortedProducts.length} products
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="py-3 px-4 font-medium">Product</th>
              <th className="py-3 px-4 font-medium">Category</th>
              <th className="py-3 px-4 font-medium">Price</th>
              <th className="py-3 px-4 font-medium">Stock</th>
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedProducts.map((product) => (
              <tr key={product._id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {product.cloudinaryPublicIds && product.cloudinaryPublicIds.length > 0 ? (
                        <Image
                          src={`${CLOUDINARY_BASE_URL}${product.cloudinaryPublicIds[0]}`}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                      )}
                    </div>
                    <span className="font-medium text-foreground">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                <td className="py-3 px-4 font-medium">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-muted-foreground">{product.stock}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">
                  <div>Created: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</div>
                  {product.updatedAt && product.updatedAt !== product.createdAt && (
                    <div className="text-[10px] opacity-75">Upd: {new Date(product.updatedAt).toLocaleDateString()}</div>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      onClick={() => toggleFeatured(product._id, product.featured)}
                      className={`p-2 rounded-md transition-colors ${product.featured ? 'text-yellow-500 bg-yellow-500/10' : 'text-muted-foreground hover:bg-muted'}`}
                      title="Toggle Featured"
                    >
                      <Image src={product.featured ? "/star-filled.svg" : "/star-outline.svg"} alt="Toggle Featured" width={18} height={18} />
                    </button>
                    <Link href={`/admin/products/${product._id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                      <Image src="/edit.svg" alt="Edit" width={18} height={18} />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                      <Image src="/delete.svg" alt="Delete" width={18} height={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-4 bg-muted/10">
        {sortedProducts.map((product) => (
          <div key={product._id} className="bg-card border border-border rounded-lg shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                  {product.cloudinaryPublicIds && product.cloudinaryPublicIds.length > 0 ? (
                    <Image
                      src={`${CLOUDINARY_BASE_URL}${product.cloudinaryPublicIds[0]}`}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
              <button
                onClick={() => toggleFeatured(product._id, product.featured)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${product.featured ? 'bg-yellow-500/10 text-yellow-600' : 'bg-muted text-muted-foreground'}`}
              >
                <Image src={product.featured ? "/star-filled.svg" : "/star-outline.svg"} alt="" width={16} height={16} />
                {product.featured ? 'Featured' : 'Feature'}
              </button>
              <div className="flex items-center gap-2">
                <Link href={`/admin/products/${product._id}/edit`} className="p-2 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                  <Image src="/edit.svg" alt="Edit" width={18} height={18} />
                </Link>
                <button onClick={() => handleDelete(product._id)} className="p-2 bg-red-50 text-red-600 rounded-md border border-red-100">
                  <Image src="/delete.svg" alt="Delete" width={18} height={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {sortedProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}