import React, { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { User, Mail, Lock, CheckCircle2, AlertCircle, Briefcase, ShieldCheck, CreditCard, Upload } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfileSettings() {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Investor specific fields
  const [investorType, setInvestorType] = useState(user?.investorType || 'Individual');
  const [capacityRange, setCapacityRange] = useState(user?.capacityRange || '');
  const [preferences, setPreferences] = useState<string[]>(user?.preferences || []);
  
  // KYC fields
  const [nidNumber, setNidNumber] = useState(user?.nidNumber || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [bankAccountName, setBankAccountName] = useState(user?.bankAccountName || '');
  const [bankAccountNumber, setBankAccountNumber] = useState(user?.bankAccountNumber || '');
  const [bankName, setBankName] = useState(user?.bankName || '');
  const [bkashNumber, setBkashNumber] = useState(user?.bkashNumber || '');
  const [annualIncomeRange, setAnnualIncomeRange] = useState(user?.annualIncomeRange || '');
  const [sourceOfFunds, setSourceOfFunds] = useState(user?.sourceOfFunds || '');
  const [tinNumber, setTinNumber] = useState(user?.tinNumber || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProfileStatus(null);
    
    const updateData: any = { name, email };
    
    if (user?.role === 'INVESTOR') {
      updateData.investorType = investorType;
      updateData.capacityRange = capacityRange;
      updateData.preferences = preferences;
      updateData.nidNumber = nidNumber;
      updateData.dob = dob;
      updateData.bankAccountName = bankAccountName;
      updateData.bankAccountNumber = bankAccountNumber;
      updateData.bankName = bankName;
      updateData.bkashNumber = bkashNumber;
      updateData.annualIncomeRange = annualIncomeRange;
      updateData.sourceOfFunds = sourceOfFunds;
      updateData.tinNumber = tinNumber;
    }
    
    const result = await updateProfile(updateData);
    if (result.success) {
      setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
    } else {
      setProfileStatus({ type: 'error', message: result.message || 'Failed to update profile' });
    }
    setLoading(false);
  };

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setPasswordStatus(null);
    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordStatus({ type: 'error', message: result.message || 'Failed to change password' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpdateProfile} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100"
          >
            <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Basic Information
            </h3>
            
            <div className="space-y-4">
              {profileStatus && (
                <div className={`p-4 rounded-2xl flex items-center space-x-2 ${
                  profileStatus.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {profileStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <span className="text-sm font-medium">{profileStatus.message}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Investor Profile */}
          {user?.role === 'INVESTOR' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100"
            >
              <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Investment Profile
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 ml-1">Investor Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Individual', 'Company', 'Institutional'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setInvestorType(type)}
                        className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                          investorType === type 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-stone-100 text-stone-400 hover:border-stone-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 ml-1">Investment Capacity Range</label>
                  <select
                    value={capacityRange}
                    onChange={(e) => setCapacityRange(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">Select Range</option>
                    <option value="৳ 50,000 – ৳ 2 lakh">৳ 50,000 – ৳ 2 lakh</option>
                    <option value="৳ 2 lakh – ৳ 10 lakh">৳ 2 lakh – ৳ 10 lakh</option>
                    <option value="৳ 10 lakh+">৳ 10 lakh+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 ml-1">Annual Income Range</label>
                  <select
                    value={annualIncomeRange}
                    onChange={(e) => setAnnualIncomeRange(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">Select Income Range</option>
                    <option value="Below ৳ 5 Lakh">Below ৳ 5 Lakh</option>
                    <option value="৳ 5 Lakh – ৳ 15 Lakh">৳ 5 Lakh – ৳ 15 Lakh</option>
                    <option value="৳ 15 Lakh – ৳ 50 Lakh">৳ 15 Lakh – ৳ 50 Lakh</option>
                    <option value="Above ৳ 50 Lakh">Above ৳ 50 Lakh</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 ml-1">Source of Funds</label>
                  <input
                    type="text"
                    value={sourceOfFunds}
                    onChange={(e) => setSourceOfFunds(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. Salary, Business, Savings"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 ml-1">Investment Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {['Crop-based', 'Livestock', 'Short-term', 'Long-term'].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => togglePreference(pref)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                          preferences.includes(pref)
                            ? 'border-primary bg-primary text-white'
                            : 'border-stone-100 text-stone-400 hover:border-stone-200'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* KYC Section */}
        {user?.role === 'INVESTOR' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100"
          >
            <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              Legal & Compliance (KYC)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">National ID (NID) Number</label>
                <input
                  type="text"
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Enter NID Number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Tax Identification Number (TIN)</label>
                <input
                  type="text"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Enter 12-digit TIN"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Upload NID Photo (Front & Back)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center text-stone-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs font-bold">Front Side</span>
                  </div>
                  <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center text-stone-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs font-bold">Back Side</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <h4 className="text-sm font-bold text-stone-900 mb-4 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-primary" />
                  Bank Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 ml-1">Bank Account Name</label>
                    <input
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="Account Holder Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 ml-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="Account Number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 ml-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="Bank Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 ml-1">bKash/Nagad Number (Optional)</label>
                    <input
                      type="text"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="Mobile Wallet Number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-12 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Change Password */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100"
      >
        <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
          <Lock className="h-5 w-5 mr-2 text-primary" />
          Security Settings
        </h3>
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordStatus && (
            <div className={`p-4 rounded-2xl flex items-center space-x-2 ${
              passwordStatus.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {passwordStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span className="text-sm font-medium">{passwordStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Current Password"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="New Password"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Confirm New Password"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Update Security Credentials'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
