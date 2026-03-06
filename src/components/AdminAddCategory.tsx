import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tag, Link as LinkIcon, Image as ImageIcon, ArrowLeft, CheckCircle2, Layers } from 'lucide-react';
import { Category } from '@/src/types';

interface AdminAddCategoryProps {
  onBack: () => void;
  onSuccess: () => void;
  initialData?: Category;
}

const AdminAddCategory: React.FC<AdminAddCategoryProps> = ({ onBack, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    image: initialData?.image || '',
    parentId: initialData?.parentId || '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.filter((c: Category) => c.parentId === null)); // Only parent categories for selection
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-generate slug if name changes and slug is empty or matches previous name slug
      if (name === 'name' && (!prev.slug || prev.slug === prev.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''))) {
        newData.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = initialData ? `/api/categories/${initialData.id}` : '/api/categories';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId === '' ? null : formData.parentId
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.message || 'Failed to save category');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Category {initialData ? 'Updated' : 'Created'} Successfully!
        </h2>
        <p className="text-stone-600">Redirecting to category list...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="p-6 border-bottom border-stone-100 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-stone-200"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              {initialData ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-sm text-stone-500">
              {initialData ? 'Update existing category details' : 'Create a new category for products'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Category Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="e.g. Seeds"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Category Slug
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="e.g. seeds"
              />
              <p className="mt-1 text-xs text-stone-500 italic">URL-friendly name (e.g., seeds-paddy)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Parent Category
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="">None (Top Level)</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Category Image URL
              </label>
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {formData.image && (
              <div className="mt-4">
                <p className="text-xs font-medium text-stone-500 mb-2 uppercase tracking-wider">Preview</p>
                <div className="aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/800/450';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t border-stone-100 pt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              initialData ? 'Update Category' : 'Create Category'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCategory;
