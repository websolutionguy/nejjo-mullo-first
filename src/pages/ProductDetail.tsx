import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Star,
  ShoppingBasket,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Share2,
  TrendingUp,
  Calendar,
  Package,
  Loader2,
} from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { Product } from "@/src/types";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const allProducts: Product[] = await response.json();
          const found = allProducts.find((p) => p.id === id);
          setProduct(found || null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-stone-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <Package className="h-10 w-10 text-stone-400" />
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-4">
          Product not found
        </h2>
        <p className="text-stone-500 mb-8">
          The product you're looking for might have been removed or is currently
          unavailable.
        </p>
        <Link
          to="/products"
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-stone-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/products"
          className="inline-flex items-center text-stone-500 hover:text-primary mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Image & Details */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-stone-100 aspect-square"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Harvest Info Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">
                    Harvest Date
                  </p>
                  <p className="font-bold text-stone-900">
                    {product.harvestDate || "Recent"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">
                    Available Quantity
                  </p>
                  <p className="font-bold text-stone-900">
                    {product.quantity || "Bulk"} {product.unit || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Transparent Pricing Card */}
            <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16" />
              <h3 className="text-xl font-bold mb-6 flex items-center relative z-10">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Transparent Pricing Breakdown
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Farmer's Price</span>
                  <span className="font-bold">
                    ৳{product.farmerPrice || (product.price * 0.7).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Transportation Cost</span>
                  <span className="text-stone-300">
                    ৳{product.marketInsights?.transportationCost || "5.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Warehouse & Storage</span>
                  <span className="text-stone-300">
                    ৳{product.marketInsights?.warehouseCost || "2.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">
                    Nejjo Mullo Service Charge (10%)
                  </span>
                  <span className="text-stone-300">
                    ৳{(product.price * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-primary font-bold">
                    Your Fair Price
                  </span>
                  <span className="text-3xl font-bold">
                    ৳{product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 mt-4 leading-relaxed">
                  * Our pricing model ensures farmers receive 60-70% more profit
                  than traditional middleman systems while keeping consumer
                  prices 5-10% lower.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex space-x-2">
                  <button className="p-3 rounded-full bg-white shadow-sm border border-stone-100 text-stone-400 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-3 rounded-full bg-white shadow-sm border border-stone-100 text-stone-400 hover:text-primary transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-stone-900">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-xl">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1.5 font-bold text-stone-900">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-stone-400 text-sm font-medium">
                  ({product.reviews} reviews)
                </span>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-600 text-sm font-bold">
                    Verified at Collection Hub
                  </span>
                </div>
              </div>

              <p className="text-stone-600 text-lg leading-relaxed mb-10">
                {product.fullDescription}
              </p>

              <div className="space-y-4 mb-10">
                <h3 className="font-bold text-stone-900 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Key Features:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature: string) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-stone-50 shadow-sm"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-stone-600 text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-grow bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-3"
                >
                  <ShoppingBasket className="h-6 w-6" />
                  <span>Add to Cart</span>
                </button>
                <Link
                  to="/checkout"
                  onClick={() => addToCart(product)}
                  className="bg-stone-900 hover:bg-stone-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center shadow-lg shadow-stone-900/10"
                >
                  Buy Now
                </Link>
              </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-white border border-stone-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-stone-900">
                    Fair Market Guarantee
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    This product is part of our "Fair Market" initiative. We
                    guarantee that the farmer received their determined minimum
                    price, and you are receiving the product at
                    wholesale-equivalent rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
