import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, ArrowLeft, TrendingUp, Calendar, CheckCircle2, Clock, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface InvestorPortfolioProps {
  onBack: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function InvestorPortfolio({ onBack }: InvestorPortfolioProps) {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch('/api/investments');
        const data = await response.json();
        setInvestments(data);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
      setLoading(false);
    };
    fetchInvestments();
  }, []);

  const categoryData = investments.reduce((acc: any[], inv) => {
    const existing = acc.find(item => item.name === inv.category);
    if (existing) {
      existing.value += inv.amount;
    } else {
      acc.push({ name: inv.category, value: inv.amount });
    }
    return acc;
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">My Investments</h2>
                  <p className="text-stone-500 text-sm">Detailed view of your active and completed investments</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-stone-500">Loading investments...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-stone-100">
                      <th className="pb-4 font-bold text-stone-500 text-sm">Project</th>
                      <th className="pb-4 font-bold text-stone-500 text-sm">Amount</th>
                      <th className="pb-4 font-bold text-stone-500 text-sm">ROI</th>
                      <th className="pb-4 font-bold text-stone-500 text-sm">Status</th>
                      <th className="pb-4 font-bold text-stone-500 text-sm">Payout Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {investments.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-4 font-bold text-stone-800">{inv.projectName}</td>
                        <td className="py-4 text-stone-600">৳{inv.amount.toLocaleString()}</td>
                        <td className="py-4 text-green-600 font-bold">{inv.expectedReturn}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center w-fit ${
                            inv.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {inv.status === 'Active' ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 text-stone-500 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {inv.payoutDate}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100"
          >
            <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
              Diversification
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `৳${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {categoryData.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-stone-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-stone-900">
                    {Math.round((item.value / investments.reduce((sum, inv) => sum + inv.amount, 0)) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary p-8 rounded-[2.5rem] shadow-lg shadow-primary/20 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 opacity-50" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">Performance</span>
            </div>
            <p className="text-sm opacity-80 mb-1">Estimated Net ROI</p>
            <h4 className="text-4xl font-bold mb-4">16.4%</h4>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[82%]" />
            </div>
            <p className="text-[10px] mt-4 opacity-70 leading-relaxed">
              Based on your current active investments and historical performance.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
