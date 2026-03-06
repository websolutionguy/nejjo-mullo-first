import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Package, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface FarmerOrdersProps {
  onBack: () => void;
}

export default function FarmerOrders({ onBack }: FarmerOrdersProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };
    fetchOrders();
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
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Check Orders</h2>
            <p className="text-stone-500 text-sm">Manage orders placed for your products</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-stone-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
            <Package className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 font-medium">No orders found yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-stone-100">
                  <th className="pb-4 font-bold text-stone-500 text-sm">Order ID</th>
                  <th className="pb-4 font-bold text-stone-500 text-sm">Customer</th>
                  <th className="pb-4 font-bold text-stone-500 text-sm">Items</th>
                  <th className="pb-4 font-bold text-stone-500 text-sm">Total</th>
                  <th className="pb-4 font-bold text-stone-500 text-sm">Status</th>
                  <th className="pb-4 font-bold text-stone-500 text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 font-mono text-xs text-stone-500">{order.id}</td>
                    <td className="py-4 font-bold text-stone-800">{order.customerName}</td>
                    <td className="py-4">
                      <div className="text-sm text-stone-600">
                        {order.items.map((item: any, i: number) => (
                          <div key={i}>{item.name} x{item.quantity}</div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 font-bold text-stone-900">৳{order.total.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center w-fit ${
                        order.status === 'Shipped' ? 'bg-green-100 text-green-600' : 
                        order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {order.status === 'Shipped' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-primary font-bold text-xs hover:underline">
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
