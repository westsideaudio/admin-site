'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/models/product';
import { useRouter } from 'next/navigation';
import { toast } from './ToastNotification'; // Import toast

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
    <div className="overflow-x-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-auto">
          <label htmlFor="categoryFilter" className="sr-only">Filter by Category</label>
          <select
            id="categoryFilter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm text-base"
          >
            <option value="all">All Categories</option>
            <option value="vinyl-cd">Vinyl/CDs</option>
            <option value="audio-equipment">Audio Equipment</option>
          </select>
        </div>
        <div className="w-full md:w-auto">
          <label htmlFor="sortOrder" className="sr-only">Sort by</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm text-base"
          >
            <option value="none">No Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="hidden md:table-header-group">
          <tr>
            <th className="py-2 px-4 text-left">Product</th>
            <th className="py-2 px-4 text-left hidden md:table-cell">Category</th>
            <th className="py-2 px-4 text-left hidden md:table-cell w-24">Price</th>
            <th className="py-2 px-4 text-right md:text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product._id} className="flex flex-col md:table-row border-b border-gray-200 mb-4 md:mb-0 p-2 md:p-0">
              <td className="py-2 px-4 flex items-center justify-between md:table-cell">
                <div className="flex items-center space-x-2">
                  {product.cloudinaryPublicIds && product.cloudinaryPublicIds.length > 0 && (
                    <Image
                      src={`${CLOUDINARY_BASE_URL}${product.cloudinaryPublicIds[0]}`}
                      alt={product.name}
                      width={50}
                      height={50}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                      loading="lazy"
                    />
                  )}
                  <span className="font-medium text-lg text-gray-800">{product.name}</span>
                </div>
                <div className="flex items-center space-x-2 md:hidden"> {/* Actions for mobile */}
                  <button onClick={() => toggleFeatured(product._id, product.featured)} className="p-2 text-#e3b419-500 rounded-md">
                    <Image src={product.featured ? "/star-filled.svg" : "/star-outline.svg"} alt="Toggle Featured" width={24} height={24} />
                  </button>
                  <Link href={`/admin/products/${product._id}/edit`} className="p-2 text-blue-500 rounded-md">
                    <Image src="/edit.svg" alt="Edit" width={24} height={24} />
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 rounded-md">
                    <Image src="/delete.svg" alt="Delete" width={24} height={24}/>
                  </button>
                </div>
              </td>
              <td className="py-2 px-4 hidden md:table-cell text-base">{product.category}</td>
              <td className="py-2 px-4 hidden md:table-cell text-base">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4 hidden md:table-cell justify-start items-center space-x-2"> {/* Actions for desktop */}
                <button onClick={() => toggleFeatured(product._id, product.featured)} className="p-2 text-#e3b419-500 rounded-md">
                  <Image src={product.featured ? "/star-filled.svg" : "/star-outline.svg"} alt="Toggle Featured" width={24} height={24} />
                </button>
                <Link href={`/admin/products/${product._id}/edit`} className="p-2 text-blue-500 rounded-md">
                  <Image src="/edit.svg" alt="Edit" width={24} height={24} />
                </Link>
                <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 rounded-md">
                  <Image src="/delete.svg" alt="Delete" width={24} height={24}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}