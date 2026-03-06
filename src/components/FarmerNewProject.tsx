import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sprout, MapPin, Target, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { Category } from '@/src/types';

interface FarmerNewProjectProps {
  onBack: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function FarmerNewProject({ onBack, onSuccess, initialData }: FarmerNewProjectProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    fullDescription: initialData?.fullDescription || '',
    location: initialData?.location || '',
    targetAmount: initialData?.targetAmount || '',
    category: initialData?.category || '',
    duration: initialData?.duration || '12 Months',
    returns: initialData?.returns || '15%',
    image: initialData?.image || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800'
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
        if (!formData.category && data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].name }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/projects/${initialData.id}` : '/api/projects';
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetAmount: Number(formData.targetAmount),
          raisedAmount: initialData?.raisedAmount || 0,
          investorsCount: initialData?.investorsCount || 0,
          highlights: initialData?.highlights || ['New Project', 'Sustainable'],
          farmerId: initialData?.farmerId || user?.id || 'farmer-1',
          farmerName: initialData?.farmerName || user?.name || 'Platform'
        }),
      });
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center text-stone-500 hover:text-stone-900 font-bold transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100"
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900">{initialData ? 'Edit Project' : 'Create New Project'}</h2>
            <p className="text-stone-500 text-sm">{initialData ? 'Update project details' : 'List a new investment opportunity for your farm'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Project Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. Organic Maize Expansion"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
            >
              {categories.map(cat => {
                const parent = cat.parentId ? categories.find(c => c.id === cat.parentId) : null;
                const displayName = parent ? `${parent.name} > ${cat.name}` : cat.name;
                return (
                  <option key={cat.id} value={cat.name}>
                    {displayName}
                  </option>
                );
              })}
              {categories.length === 0 && (
                <>
                  <option>Crops</option>
                  <option>Livestock</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Short Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Brief overview of the project"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Full Description</label>
            <textarea
              required
              rows={4}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Detailed information about the project goals, location, and impact"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Green Valley, Central Region"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Target Amount (৳)</label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="number"
                required
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="e.g. 5000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Duration</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="e.g. 12 Months"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Expected Returns (%)</label>
            <input
              type="text"
              required
              value={formData.returns}
              onChange={(e) => setFormData({ ...formData, returns: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. 15%"
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Submit Project for Approval')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
