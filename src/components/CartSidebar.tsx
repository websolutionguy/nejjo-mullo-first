import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBasket, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[120]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[130] flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <ShoppingBasket className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-stone-900">Your Cart ({totalItems})</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                    <ShoppingBasket className="h-10 w-10 text-stone-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800">Your cart is empty</h3>
                    <p className="text-stone-500 text-sm">Looks like you haven't added anything yet.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-stone-800 text-sm line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-400 mb-2">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3 bg-stone-50 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-bold text-stone-900 text-sm">৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-stone-500 font-medium">Subtotal</span>
                  <span className="font-bold text-stone-900">৳{totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-stone-400">Shipping and taxes calculated at checkout.</p>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
