'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/models/product';
import { useRouter } from 'next/navigation';

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
        <thead>
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Image</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Stock</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">
                {product.imageUrls && product.imageUrls.length > 0 && (
                  <Image src={product.imageUrls[0]} alt={product.name} width={50} height={50} style={{ objectFit: "cover" }} />
                )}
              </td>
              <td className="py-2 px-4">{product.category}</td>
              <td className="py-2 px-4">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4">{product.stock}</td>
              <td className="py-2 px-4">
                <div className="flex items-center space-x-2">
                  <Link href={`/admin/products/${product._id}/edit`} className="p-2 text-blue-500 border">
                    <Image src="/edit.svg" alt="Edit" width={24} height={24} />
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 border">
                    <Image src="/delete.svg" alt="Delete" width={24} height={24}/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}