import ProductForm from '../../../components/ProductForm';
import { Product } from '@/models/product';

async function getProduct(id: string): Promise<Product> {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products/${id}`;
  const res = await fetch(apiUrl, { cache: 'no-store' });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch product');
  }
  return res.json();
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product: {product.name}</h1>
      <ProductForm initialData={product} />
    </div>
  );
}