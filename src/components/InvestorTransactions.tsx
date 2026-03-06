import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowLeft, ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react';

interface InvestorTransactionsProps {
  onBack: () => void;
}

export default function InvestorTransactions({ onBack }: InvestorTransactionsProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        setTransactions(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Transaction History</h2>
              <p className="text-stone-500 text-sm">Track all your deposits, investments, and payouts</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-stone-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="p-2 bg-stone-50 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-500">Loading transactions...</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-stone-800">{tx.description}</p>
                    <p className="text-xs text-stone-500">{new Date(tx.date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-stone-900'}`}>
                    {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">{tx.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
