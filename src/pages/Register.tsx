import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Briefcase,
  Sprout,
  Phone,
  MapPin,
  Package,
  Tag,
  ShoppingBag,
  Users,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { UserRole } from "@/src/types";

export default function Register() {
  const [role, setRole] = useState<UserRole>("INVESTOR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (role === "INVESTOR" && !otpVerified) {
      setError("Please verify your mobile number with OTP");
      setLoading(false);
      return;
    }

    const registrationData: any = {
      email,
      password,
      name,
      role,
    };

    if (role === "FARMER") {
      registrationData.phone = phone;
      registrationData.address = address;
      registrationData.productType = productType;
      registrationData.quantity = quantity;
      registrationData.minPrice = minPrice;
    }

    if (role === "INVESTOR") {
      registrationData.phone = phone;
      registrationData.country = country;
      registrationData.city = city;
    }

    const result = await register(registrationData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Registration failed");
    }
    setLoading(false);
  };

  const handleSendOtp = () => {
    if (!phone) {
      setError("Please enter your mobile number first");
      return;
    }
    setOtpLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setOtpLoading(false);
      setError("");
      alert("OTP sent to " + phone + " (Use 123456 for demo)");
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp === "123456") {
      setOtpVerified(true);
      setError("");
    } else {
      setError("Invalid OTP. Use 123456");
    }
  };

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    {
      id: "INVESTOR",
      label: "Investor",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    { id: "FARMER", label: "Farmer", icon: Sprout, color: "bg-green-500" },
    {
      id: "RETAILER",
      label: "Retailer",
      icon: ShoppingBag,
      color: "bg-orange-500",
    },
    { id: "CONSUMER", label: "Consumer", icon: Users, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-stone-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 overflow-hidden"
      >
        <div className="p-8 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              Join Nejjo Mullo
            </h2>
            <p className="text-stone-500">Create an account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-bold text-stone-700 block ml-1">
                I am a...
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                      role === r.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-stone-100 hover:border-stone-200 text-stone-400"
                    }`}
                  >
                    <r.icon className="h-6 w-6 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative md:col-span-2">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  placeholder={
                    role === "INVESTOR"
                      ? "Full Name (as per NID/Passport)"
                      : "Full Name"
                  }
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="relative md:col-span-2">
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

              {role === "INVESTOR" && (
                <>
                  <div className="relative md:col-span-2">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <div className="flex space-x-2">
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        required
                        disabled={otpVerified}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all disabled:bg-stone-50"
                      />
                      {!otpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpLoading || !phone}
                          className="px-4 py-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
                        >
                          {otpLoading ? "..." : otpSent ? "Resend" : "Send OTP"}
                        </button>
                      )}
                    </div>
                  </div>

                  {otpSent && !otpVerified && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative md:col-span-2"
                    >
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="flex-1 pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-4 py-4 bg-primary text-white rounded-2xl font-bold text-sm transition-all"
                        >
                          Verify
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {otpVerified && (
                    <div className="md:col-span-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                      Mobile Number Verified
                    </div>
                  )}

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Country"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </>
              )}

              <div className="relative md:col-span-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              {role === "FARMER" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                >
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Address"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Type of product (e.g. Potato, Rice)"
                      required
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Production quantity (e.g. 500kg)"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="relative md:col-span-2">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="number"
                      placeholder="Determined minimum price (৳)"
                      required
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Processing..." : "Create Account"}</span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-stone-500">
              Already have an account?{" "}
              <Link
                to="/login"
                title="Log In"
                className="text-primary font-bold hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
