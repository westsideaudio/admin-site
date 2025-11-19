'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import { Product } from '@/models/product';
import { toast } from './ToastNotification'; // Import toast
import { categories } from '@/app/data/categories';

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

  useEffect(() => {
    if (!initialData) {
      const selectedCategory = categories.find(cat => cat.slug === formData.category);
      if (selectedCategory && selectedCategory.defaultAttributes) {
        const defaultAttrs = selectedCategory.defaultAttributes.map(key => ({ key, value: '' }));
        setAttributesList(defaultAttrs);
      } else {
        setAttributesList([]);
      }
    }
  }, [formData.category, initialData]);

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

    // Validate that at least one image is uploaded
    if (!formData.cloudinaryPublicIds || formData.cloudinaryPublicIds.length === 0) {
      setError('Please upload at least one product image.');
      toast.error('Please upload at least one product image.');
      setLoading(false);
      return;
    }

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
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
      {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-4 text-sm">{error}</div>}
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
        <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full border border-input rounded-md shadow-sm p-3 md:p-2.5 text-base bg-background text-foreground focus:ring-primary focus:border-primary" />
      </div>
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-foreground">Description</label>
        <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required rows={4} className="mt-1 block w-full border border-input rounded-md shadow-sm p-3 md:p-2.5 text-base bg-background text-foreground focus:ring-primary focus:border-primary"></textarea>
      </div>
      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium text-foreground">Category</label>
        <select id="category" name="category" value={formData.category || 'vinyl-cd'} onChange={handleCategoryChange} required className="mt-1 block w-full border border-input rounded-md shadow-sm p-3 md:p-2.5 text-base bg-background text-foreground focus:ring-primary focus:border-primary h-12 md:h-auto">
          <option value="vinyl-cd">Vinyl/CDs</option>
          <option value="audio-equipment">Audio Equipment</option>
        </select>
      </div>
      {/* SKU will be auto-generated and displayed, not input directly */}
      {formData.sku && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">SKU</label>
          <p className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-muted text-muted-foreground">{formData.sku}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="price" className="block text-sm font-medium text-foreground">Price</label>
          <input type="number" id="price" name="price" value={formData.price || 0} onChange={handleNumberChange} required step="0.01" className="mt-1 block w-full border border-input rounded-md shadow-sm p-3 md:p-2.5 text-base bg-background text-foreground focus:ring-primary focus:border-primary" />
        </div>
        <div className="space-y-1">
          <label htmlFor="stock" className="block text-sm font-medium text-foreground">Stock</label>
          <input type="number" id="stock" name="stock" value={formData.stock || 0} onChange={handleNumberChange} required className="mt-1 block w-full border border-input rounded-md shadow-sm p-3 md:p-2.5 text-base bg-background text-foreground focus:ring-primary focus:border-primary" />
        </div>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">Attributes</label>
        {attributesList.map((attr, index) => (
          <div key={index} className="bg-muted/50 border border-border p-4 rounded-md mb-3">
            <div className="flex flex-col sm:flex-row sm:space-x-2 mb-2">
              <div className="w-full sm:w-1/3">
                <label htmlFor={`attribute-key-${index}`} className="block text-xs font-medium text-muted-foreground mb-1">Key</label>
                <input
                  type="text"
                  id={`attribute-key-${index}`}
                  placeholder="Attribute Key (e.g., Artist)"
                  value={attr.key}
                  onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                  className="mt-1 block w-full border border-input rounded-md shadow-sm p-3 text-base bg-background text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="w-full sm:w-2/3 mt-2 sm:mt-0">
                <label htmlFor={`attribute-value-${index}`} className="block text-xs font-medium text-muted-foreground mb-1">Value</label>
                <input
                  type="text"
                  id={`attribute-value-${index}`}
                  placeholder="Attribute Value (e.g., John Doe)"
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  className="mt-1 block w-full border border-input rounded-md shadow-sm p-3 text-base bg-background text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveAttribute(index)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm mt-2 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAttribute}
          className="w-full md:w-auto bg-primary text-primary-foreground px-5 py-3 rounded-md hover:bg-primary/90 text-sm font-medium transition-colors flex items-center justify-center"
        >
          + Add Attribute
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Images <span className="text-red-600">*</span></label>
        <ImageUpload initialCloudinaryPublicIds={formData.cloudinaryPublicIds} onImageUpload={handleCloudinaryPublicIdsChange} />
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border">
        <button type="button" onClick={() => router.push('/admin/products')} className="w-full sm:w-auto bg-secondary text-secondary-foreground px-6 py-3.5 rounded-md hover:bg-secondary/80 text-base font-medium transition-colors text-center">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-accent text-white px-8 py-3.5 rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium transition-colors shadow-sm text-center">
          {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}