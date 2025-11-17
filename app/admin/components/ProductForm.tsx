'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import { Product } from '@/models/product';
import { toast } from './ToastNotification'; // Import toast

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'vinyl-cd', // Default to 'vinyl-cd'
    sku: '', // SKU will be auto-generated
    price: 0,
    stock: 0,
    cloudinaryPublicIds: [],
    attributes: {},
    ...initialData,
  });
  const [attributesList, setAttributesList] = useState<{ key: string; value: string }[]>(
    Object.entries(initialData?.attributes || {}).map(([key, value]) => ({ key, value: String(value) }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update formData.attributes whenever attributesList changes
    const newAttributes = attributesList.reduce((acc, attr) => {
      if (attr.key) {
        acc[attr.key] = attr.value;
      }
      return acc;
    }, {} as Record<string, string>);
    setFormData((prev) => ({ ...prev, attributes: newAttributes }));
  }, [attributesList]); // Dependency on attributesList

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedAttributes = [...attributesList];
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
    setAttributesList(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setAttributesList((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloudinaryPublicIdsChange = useCallback((publicIds: string[]) => {
    setFormData((prev) => ({ ...prev, cloudinaryPublicIds: publicIds }));
  }, []); // No dependencies, as setFormData is stable

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/admin/products/${initialData._id}` : '/api/admin/products';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Product ${initialData ? 'updated' : 'created'} successfully!`);
        router.push('/admin/products');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || `Failed to ${initialData ? 'update' : 'create'} product.`);
        toast.error(errorData.message || `Failed to ${initialData ? 'update' : 'create'} product.`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-base" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-base"></textarea>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select id="category" name="category" value={formData.category || 'vinyl-cd'} onChange={handleCategoryChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-base">
          <option value="vinyl-cd">Vinyl/CDs</option>
          <option value="audio-equipment">Audio Equipment</option>
        </select>
      </div>
      {/* SKU will be auto-generated and displayed, not input directly */}
      {formData.sku && (
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <p className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">{formData.sku}</p>
        </div>
      )}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" id="price" name="price" value={formData.price || 0} onChange={handleNumberChange} required step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-base" />
      </div>
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input type="number" id="stock" name="stock" value={formData.stock || 0} onChange={handleNumberChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-base" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Attributes</label>
        {attributesList.map((attr, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="flex flex-col sm:flex-row sm:space-x-2 mb-2">
              <div className="w-full sm:w-1/3">
                <label htmlFor={`attribute-key-${index}`} className="block text-xs font-medium text-gray-500">Key</label>
                <input
                  type="text"
                  id={`attribute-key-${index}`}
                  placeholder="Attribute Key (e.g., Artist)"
                  value={attr.key}
                  onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-base"
                />
              </div>
              <div className="w-full sm:w-2/3 mt-2 sm:mt-0">
                <label htmlFor={`attribute-value-${index}`} className="block text-xs font-medium text-gray-500">Value</label>
                <input
                  type="text"
                  id={`attribute-value-${index}`}
                  placeholder="Attribute Value (e.g., John Doe)"
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-base"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveAttribute(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-base mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAttribute}
          className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 mt-2 text-base"
        >
          Add Attribute
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <ImageUpload initialCloudinaryPublicIds={formData.cloudinaryPublicIds} onImageUpload={handleCloudinaryPublicIdsChange} />
      </div>
      <div className="flex space-x-2">
        <button type="submit" disabled={loading} className="bg-green-500 text-white px-5 py-3 rounded hover:bg-green-600 disabled:opacity-50 text-base">
          {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="bg-gray-300 text-gray-800 px-5 py-3 rounded hover:bg-gray-400 text-base">
          Cancel
        </button>
      </div>
    </form>
  );
}