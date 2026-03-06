import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import LocationPopup from './components/LocationPopup';
import Home from './pages/Home';
import About from './pages/About';
import InvestorProjects from './pages/InvestorProjects';
import ProjectDetail from './pages/ProjectDetail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [location, setLocation] = useState<{ district: string; thana: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem('agri_invest_location');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else {
      setShowPopup(true);
    }
  }, []);

  const handleLocationSelect = (loc: { district: string; thana: string }) => {
    setLocation(loc);
    localStorage.setItem('agri_invest_location', JSON.stringify(loc));
    setShowPopup(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col">
        {showPopup && <LocationPopup onSelect={handleLocationSelect} />}
        <Navbar location={location} onLocationClick={() => setShowPopup(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<InvestorProjects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </Router>
  );
}
