import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-stone-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 overflow-hidden"
      >
        <div className="p-8 pt-12">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-stone-900 mb-2">Reset Password</h2>
                <p className="text-stone-500">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                  {!loading && <Send className="h-5 w-5" />}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="h-20 w-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Check Your Email</h2>
              <p className="text-stone-500 mb-8">
                We've sent a password reset link to <br />
                <span className="font-bold text-stone-900">{email}</span>
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary font-bold hover:underline"
              >
                Try another email
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" title="Back to Login" className="inline-flex items-center space-x-2 text-stone-500 font-bold hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
