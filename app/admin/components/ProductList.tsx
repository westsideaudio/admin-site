'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/models/product';
import { useRouter } from 'next/navigation';

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'}/image/upload/`;

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter();

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Product deleted successfully!');
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Failed to delete product: ${errorData.message}`);
      }
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="hidden md:table-header-group">
          <tr>
            <th className="py-2 px-4 text-left">Product</th>
            <th className="py-2 px-4 text-left hidden md:table-cell">Category</th>
            <th className="py-2 px-4 text-left hidden md:table-cell w-24">Price</th>
            <th className="py-2 px-4 text-left hidden md:table-cell w-24">Stock</th>
            <th className="py-2 px-4 hidden md:table-cell"></th> {/* Empty header for alignment */}
            <th className="py-2 px-4 text-right md:text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="grid grid-cols-2 md:table-row border-b border-gray-200 mb-4 md:mb-0 p-2 md:p-0 gap-2">
              <td className="py-2 px-4 flex items-center md:table-cell col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2">
                  {product.cloudinaryPublicIds && product.cloudinaryPublicIds.length > 0 && (
                    <Image src={`${CLOUDINARY_BASE_URL}${product.cloudinaryPublicIds[0]}`} alt={product.name} width={50} height={50} style={{ objectFit: "cover" }} className="rounded-md" />
                  )}
                  <span className="font-medium text-lg text-gray-800">{product.name}</span>
                </div>
              </td>
              <td className="py-2 px-4 hidden md:table-cell text-base">{product.category}</td>
              <td className="py-2 px-4 hidden md:table-cell text-base">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4 hidden md:table-cell text-base">{product.stock}</td>
              <td className="py-2 px-4 hidden md:table-cell"></td> {/* Empty cell for image on desktop */}
              <td className="py-2 px-4 flex justify-end md:justify-start items-center space-x-2 col-span-2 md:col-span-1">
                <Link href={`/admin/products/${product._id}/edit`} className="p-2 text-blue-500 border rounded-md">
                  <Image src="/edit.svg" alt="Edit" width={24} height={24} />
                </Link>
                <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 border rounded-md">
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