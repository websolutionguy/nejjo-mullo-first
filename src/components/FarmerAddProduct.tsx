import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Tag, Image as ImageIcon, ArrowLeft, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { Category } from '@/src/types';

interface FarmerAddProductProps {
  onBack: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function FarmerAddProduct({ onBack, onSuccess, initialData }: FarmerAddProductProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.farmerPrice || initialData?.price || '', // Farmer's determined minimum price
    category: initialData?.category || '',
    description: initialData?.description || '',
    fullDescription: initialData?.fullDescription || '',
    quantity: initialData?.quantity || '',
    unit: initialData?.unit || 'kg',
    harvestDate: initialData?.harvestDate || '',
    image: initialData?.image || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800'
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

  // Mock Market Insights
  const marketInsights = initialData?.marketInsights || {
    todayMarketPrice: 45,
    avgWholesaleRate: 40,
    transportationCost: 5,
    warehouseCost: 2,
    serviceChargePercent: 10
  };

  const calculateRetailPrice = () => {
    const farmerPrice = Number(formData.price) || 0;
    const transport = marketInsights.transportationCost;
    const warehouse = marketInsights.warehouseCost;
    const serviceCharge = farmerPrice * (marketInsights.serviceChargePercent / 100);
    return farmerPrice + transport + warehouse + serviceCharge;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const retailPrice = calculateRetailPrice();
      const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: retailPrice, // Consumer price
          farmerPrice: Number(formData.price),
          quantity: Number(formData.quantity),
          unit: formData.unit,
          harvestDate: formData.harvestDate,
          marketInsights: {
            ...marketInsights,
            retailPrice
          },
          rating: initialData?.rating || 5.0,
          reviews: initialData?.reviews || 0,
          features: initialData?.features || ['New Arrival', 'Farmer Direct', 'Quality Checked'],
          farmerId: initialData?.farmerId || user?.id || 'farmer-1',
          farmerName: initialData?.farmerName || user?.name || 'Platform',
          status: initialData?.status || 'Pending' // Initial status for Collection Hub check
        }),
      });
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving product:', error);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
              <p className="text-stone-500 text-sm">{initialData ? 'Update product details' : 'List your harvest for sale with transparent pricing'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Fresh Organic Potatoes"
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
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Livestock</option>
                    <option>Poultry</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Quantity</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="flex-1 px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. 500"
                />
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-24 px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                >
                  <option>kg</option>
                  <option>maund</option>
                  <option>ton</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Harvest Date</label>
              <input
                type="date"
                required
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Your Minimum Price (৳ per {formData.unit})</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. 40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Product Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Image URL"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Short Description</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Brief overview of the product"
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
                placeholder="Detailed product specifications and benefits"
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Product to Store')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Market Insights Sidebar */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-xl"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Market Insights
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-stone-400 text-sm">Today's Market Price</span>
                <span className="font-bold">৳{marketInsights.todayMarketPrice}/{formData.unit}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-stone-400 text-sm">Avg. Wholesale Rate</span>
                <span className="font-bold">৳{marketInsights.avgWholesaleRate}/{formData.unit}</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-4">Pricing Breakdown</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Your Price</span>
                    <span className="font-bold">৳{formData.price || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Transport</span>
                    <span className="text-stone-300">৳{marketInsights.transportationCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Warehouse</span>
                    <span className="text-stone-300">৳{marketInsights.warehouseCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">Service Charge ({marketInsights.serviceChargePercent}%)</span>
                    <span className="text-stone-300">৳{(Number(formData.price) * (marketInsights.serviceChargePercent / 100)).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-primary font-bold">Estimated Retail</span>
                    <span className="text-2xl font-bold">৳{calculateRetailPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-white p-6 rounded-[2rem] border border-stone-100">
            <h4 className="font-bold text-stone-900 mb-4 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
              Collection Hub Info
            </h4>
            <p className="text-sm text-stone-500 leading-relaxed">
              Once listed, your product will be directed to the nearest <strong>Collection Hub</strong> for quality verification. 
              You will receive <strong>70% instant payment</strong> upon verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
