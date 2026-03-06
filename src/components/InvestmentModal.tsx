import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, TrendingUp, Calendar, Wallet, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    category: string;
    returns: string;
    duration: string;
    targetAmount: number;
    raisedAmount: number;
  };
  onSuccess: () => void;
}

export default function InvestmentModal({ isOpen, onClose, project, onSuccess }: InvestmentModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');

  const remaining = project.targetAmount - project.raisedAmount;
  const estimatedReturn = amount ? (Number(amount) * (parseFloat(project.returns) / 100)).toFixed(2) : '0';

  const handleInvest = async () => {
    if (!user || (user.role !== 'INVESTOR' && user.role !== 'ADMIN')) {
      alert('Please log in as an investor to fund this project.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          investorId: user.id,
          amount: Number(amount),
          projectName: project.title,
          category: project.category,
          expectedReturn: project.returns,
          payoutDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mock 6 months
        }),
      });

      if (response.ok) {
        setStep('success');
        onSuccess();
      } else {
        alert('Investment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error investing:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 transition-colors z-10"
          >
            <X className="h-5 w-5 text-stone-400" />
          </button>

          {step === 'input' && (
            <div className="p-10">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Investment</span>
                <h2 className="text-3xl font-bold text-stone-900">{project.title}</h2>
                <p className="text-stone-500 text-sm mt-2">Enter the amount you wish to invest in this project.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Investment Amount (৳)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">৳</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Min. ৳5,000"
                      className="w-full pl-10 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 font-medium">Remaining goal: ৳{remaining.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                    <TrendingUp className="h-4 w-4 text-primary mb-2" />
                    <p className="text-[10px] text-stone-400 uppercase font-bold">Est. Return</p>
                    <p className="text-lg font-bold text-stone-900">৳{estimatedReturn}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                    <Calendar className="h-4 w-4 text-primary mb-2" />
                    <p className="text-[10px] text-stone-400 uppercase font-bold">Duration</p>
                    <p className="text-lg font-bold text-stone-900">{project.duration}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Your investment is protected by our AgriShield guarantee. Funds are only released to farmers upon milestone completion.
                  </p>
                </div>

                <button
                  disabled={!amount || Number(amount) < 5000 || Number(amount) > remaining}
                  onClick={() => setStep('confirm')}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Confirm
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-stone-900">Confirm Investment</h2>
                <p className="text-stone-500 text-sm mt-2">Please review your investment details before proceeding.</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 text-sm">Project</span>
                    <span className="font-bold text-stone-900">{project.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 text-sm">Investment Amount</span>
                    <span className="font-bold text-stone-900">৳{Number(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 text-sm">Expected ROI</span>
                    <span className="font-bold text-green-600">{project.returns}</span>
                  </div>
                  <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                    <span className="text-stone-900 font-bold">Total Payout</span>
                    <span className="text-xl font-bold text-primary">৳{(Number(amount) + Number(estimatedReturn)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest justify-center">
                  <Wallet className="h-3 w-3" />
                  <span>Funds will be deducted from your wallet</span>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep('input')}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-900 py-5 rounded-2xl font-bold transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleInvest}
                    disabled={loading}
                    className="flex-2 bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
                  >
                    {loading ? 'Processing...' : 'Confirm & Invest'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-stone-900 mb-4">Investment Successful!</h2>
              <p className="text-stone-500 text-sm mb-8">
                Congratulations! You have successfully invested ৳{Number(amount).toLocaleString()} in {project.title}. 
                You can track your investment progress in your dashboard.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl font-bold transition-all"
              >
                Done
              </button>
            </div>
          )}
      </motion.div>
    </div>
  );
}
