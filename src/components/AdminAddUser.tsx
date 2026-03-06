import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Lock, Shield, ArrowLeft, Check } from 'lucide-react';

interface AdminAddUserProps {
  onBack: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function AdminAddUser({ onBack, onSuccess, initialData }: AdminAddUserProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'CONSUMER'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/users/${initialData.id}` : '/api/register';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-stone-100 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
          <Check className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-stone-900 mb-2">{initialData ? 'User Updated Successfully' : 'User Added Successfully'}</h3>
        <p className="text-stone-500">{initialData ? 'The user details have been updated.' : 'The new user has been registered on the platform.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-stone-500 hover:text-stone-800 transition-colors font-bold text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Overview</span>
      </button>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-stone-100">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">{initialData ? 'Edit User' : 'Add New User'}</h2>
            <p className="text-stone-500">{initialData ? 'Update user account details.' : 'Create a new account for the platform.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">{initialData ? 'New Password (optional)' : 'Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    required={!initialData}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">User Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                  >
                    <option value="CONSUMER">Consumer</option>
                    <option value="FARMER">Farmer</option>
                    <option value="INVESTOR">Investor</option>
                    <option value="RETAILER">Retailer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update User Account' : 'Create User Account')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
