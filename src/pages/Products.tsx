import { motion } from "motion/react";
import {
  ShoppingBasket,
  Star,
  ArrowRight,
  Loader2,
  Filter,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/src/context/CartContext";
import { Product, cn } from "@/src/types";

const ITEMS_PER_PAGE = 8;

export default function Products() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const farmerId = searchParams.get("farmerId");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    if (farmerId) {
      filtered = filtered.filter((p) => p.farmerId === farmerId);
    }
    return filtered;
  }, [allProducts, activeCategory, farmerId]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const categories = ["All", "Seeds", "Supplies", "Equipment", "Feed"];

  return (
    <div className="pt-15 min-h-screen bg-stone-50/50">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,255,127,0.1),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold mb-6">
                Premium <span className="text-primary">Agri</span> Products
              </h1>
              <p className="text-xl text-stone-400 leading-relaxed">
                High-quality supplies and equipment to boost your farm's
                productivity. Vetted by our experts and delivered directly from
                verified sources.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className={cn(
                    "px-6 py-2.5 rounded-2xl border transition-all font-bold text-sm",
                    activeCategory === cat
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white border-stone-200 text-stone-600 hover:border-primary hover:text-primary",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4 text-stone-500 bg-white px-4 py-2 rounded-xl border border-stone-100 shadow-sm">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">
                Showing {visibleProducts.length} of {filteredProducts.length}{" "}
                products
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-stone-500 font-medium">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-stone-100 shadow-sm">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBasket className="h-10 w-10 text-stone-300" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                No products found
              </h3>
              <p className="text-stone-500">
                Try selecting a different category or check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {visibleProducts.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (idx % 4) * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="h-64 relative overflow-hidden">
                      <Link to={`/products/${p.id}`}>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm">
                          {p.category}
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        className="absolute bottom-4 right-4 bg-white p-4 rounded-2xl shadow-lg text-primary hover:bg-primary hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
                      >
                        <ShoppingBasket className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star className="h-3 w-3 fill-current mr-1" />
                          <span className="text-[10px] font-bold">
                            {p.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                          {p.reviews} Reviews
                        </span>
                      </div>
                      <Link to={`/products/${p.id}`}>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-stone-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-stone-400 font-bold uppercase">
                            Price
                          </span>
                          <span className="text-xl font-bold text-stone-900">
                            ৳{p.price.toLocaleString()}
                          </span>
                        </div>
                        <Link
                          to={`/products/${p.id}`}
                          className="p-2 rounded-xl bg-stone-50 text-stone-400 hover:bg-primary hover:text-white transition-all"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-16 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-10 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-stone-600 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-md text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Get Exclusive Offers
                </h2>
                <p className="text-stone-400">
                  Subscribe to our newsletter and get 10% off your first
                  purchase of agri-supplies.
                </p>
              </div>
              <div className="flex w-full md:w-auto space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow md:w-80 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
