import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  User as UserIcon,
  CheckCircle2,
  ShoppingBasket
} from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    deliveryMethod: 'inside' as 'inside' | 'outside',
  });

  const shippingFee = formData.deliveryMethod === 'inside' ? 80 : 150;
  const grandTotal = totalPrice + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send this to an API
    console.log('Order placed:', { ...formData, items: cart, total: grandTotal });
    setIsOrdered(true);
    clearCart();
    
    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-stone-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl text-center border border-stone-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-4">Order Placed!</h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Thank you for your purchase. Your order has been received and is being processed. 
            We will contact you shortly for confirmation.
          </p>
          <div className="space-y-4">
            <Link 
              to="/" 
              className="block w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all"
            >
              Back to Home
            </Link>
            <p className="text-xs text-stone-400">Redirecting to home in 5 seconds...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-stone-100 text-stone-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBasket className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Your cart is empty</h2>
          <Link to="/products" className="text-primary font-bold hover:underline">
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center text-stone-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shopping
        </Link>

        <h1 className="text-4xl font-bold text-stone-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 ml-1">Email (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-stone-700 ml-1">Full Address</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House no, Road no, Area, District"
                      rows={3}
                      className="w-full px-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery Method */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  Delivery Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'inside' })}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      formData.deliveryMethod === 'inside'
                        ? 'border-primary bg-primary/5'
                        : 'border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-stone-800">Inside Dhaka</span>
                      <span className="font-bold text-primary">৳80</span>
                    </div>
                    <p className="text-xs text-stone-500">Delivery within 2-3 business days</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'outside' })}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      formData.deliveryMethod === 'outside'
                        ? 'border-primary bg-primary/5'
                        : 'border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-stone-800">Outside Dhaka</span>
                      <span className="font-bold text-primary">৳150</span>
                    </div>
                    <p className="text-xs text-stone-500">Delivery within 5-7 business days</p>
                  </button>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Payment Method
                </h3>
                <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-800">Cash on Delivery</p>
                      <p className="text-xs text-stone-500">Pay when you receive the product</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 sticky top-32">
              <h3 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl border border-stone-100 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-stone-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-stone-100">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-stone-900">৳{shippingFee}</span>
                </div>
                <div className="flex justify-between text-xl pt-3 border-t border-stone-100">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="font-bold text-primary">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-lg mt-8 shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5"
              >
                Place Order
              </button>
              
              <p className="text-center text-[10px] text-stone-400 mt-4 uppercase tracking-widest font-bold">
                Secure Checkout Guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
