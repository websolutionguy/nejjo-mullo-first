import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sprout,
  MapPin,
  ChevronDown,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/types";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";
import CartSidebar from "./CartSidebar";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Investor Project", href: "/projects" },
  { name: "Products", href: "/products" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

interface NavbarProps {
  location: { district: string; thana: string } | null;
  onLocationClick: () => void;
}

export default function Navbar({ location, onLocationClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const isHomePage = routerLocation.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showSolidNav = scrolled || !isHomePage;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Sprout className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-display text-primary">
                  Nejjo Mullo
                </span>
              </Link>

              {/* Location Display */}
              <button
                onClick={onLocationClick}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all bg-stone-50 border-stone-100 text-stone-600 hover:bg-stone-100"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold truncate max-w-[150px]">
                  {location
                    ? `${location.thana}, ${location.district}`
                    : "Select Location"}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    routerLocation.pathname === item.href
                      ? "text-primary"
                      : "text-stone-600",
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-1 pl-3 rounded-full border transition-all bg-stone-50 border-stone-200 text-stone-700"
                  >
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold leading-none">
                        {user.name}
                      </span>
                      <span className="text-[10px] opacity-70 leading-none mt-1 uppercase tracking-wider">
                        {user.role}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 overflow-hidden">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-primary/20"
                >
                  Login
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full transition-all text-stone-600 hover:bg-stone-100"
              >
                <ShoppingBasket className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={onLocationClick}
                className="p-2 rounded-md text-stone-600"
              >
                <MapPin className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-stone-600"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2"
                >
                  <Sprout className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold font-display text-primary">
                    Nejjo Mullo
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-6 px-4">
                {user && (
                  <div className="flex items-center space-x-3 p-4 mb-6 bg-stone-50 rounded-2xl">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                        {user.role}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all",
                        routerLocation.pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-stone-100 space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full bg-stone-100 text-stone-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-stone-200 transition-all"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center w-full bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
