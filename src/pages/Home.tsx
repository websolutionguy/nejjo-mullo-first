import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  TrendingUp,
  Users,
  ShieldCheck,
  Leaf,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { projects as initialProjects } from "@/src/data";
import { useAuth } from "@/src/context/AuthContext";
import InvestmentModal from "@/src/components/InvestmentModal";

const stats = [
  { label: "Active Farmers", value: "5,000+", icon: Users },
  { label: "Investor Returns", value: "12-18%", icon: TrendingUp },
  { label: "Funds Raised", value: "৳2.5M+", icon: ShieldCheck },
  { label: "Acres Cultivated", value: "10,000+", icon: Leaf },
];

const heroSlides = [
  {
    image: "https://nejjomullo.com/images/1.jpg",
    title: "Empowering Bangladeshi Farmers",
    description:
      "We connect smiling farmers with the resources they need to thrive and scale their production.",
  },
  {
    image: "https://nejjomullo.com/images/2.jpg",
    title: "Global Market Access",
    description:
      "Ensuring efficient logistics and export of high-quality agricultural products to international markets.",
  },
  {
    image: "https://nejjomullo.com/images/3.jpg",
    title: "Precision Agriculture for Better Yields",
    description:
      "Leveraging real-time data and modern machinery to help farmers optimize their harvest and reduce waste.",
  },
  {
    image: "https://nejjomullo.com/images/4.jpg",
    title: "High-Quality Seeds & Fertilizers",
    description:
      "Access a wide range of certified seeds and micronutrients to ensure healthy crop growth from day one.",
  },
  {
    image: "https://nejjomullo.com/images/5.jpg",
    title: "Fair Pricing & Transparent Trade",
    description:
      "We eliminate middlemen to ensure farmers receive the right value for their hard work and dedication.",
  },
];

const testimonials = [
  {
    name: "John Doe",
    role: "Investor",
    content:
      "Nejjo Mullo has made it so easy for me to diversify my portfolio into agriculture. The transparency and regular updates are fantastic.",
    avatar: "https://picsum.photos/seed/user1/100/100",
  },
  {
    name: "Sarah Smith",
    role: "Farm Owner",
    content:
      "The technology and funding provided by Nejjo Mullo helped us scale our organic poultry farm. We are now exporting to neighboring regions.",
    avatar: "https://picsum.photos/seed/user2/100/100",
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          setProjects(await response.json());
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.slice(0, 9));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchFarmers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setFarmers(data.filter((u: any) => u.role === "FARMER").slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.filter((c: any) => !c.parentId));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProjects();
    fetchFeaturedProducts();
    fetchFarmers();
    fetchCategories();

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );

  const handleInvestClick = (project: any) => {
    if (!user) {
      toast.error("You must login to invest as an Investor");
      navigate("/login");
      return;
    }
    if (user.role !== "INVESTOR" && user.role !== "ADMIN") {
      toast.error("Only investor accounts can fund projects.");
      return;
    }
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleInvestmentSuccess = () => {
    const fetchProjects = async () => {
      const response = await fetch("/api/projects");
      if (response.ok) setProjects(await response.json());
    };
    fetchProjects();
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover scale-105 animate-slow-zoom"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light text-sm font-semibold mb-6">
                Empowering Agriculture through Fintech
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {heroSlides[currentSlide].title.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={
                      word === "Bangladeshi" || word === "Global"
                        ? "text-primary"
                        : ""
                    }
                  >
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <p className="text-lg md:text-xl text-stone-200 mb-10 leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/projects"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center group"
                >
                  View Projects
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all text-center"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-10 z-20 flex space-x-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-10 z-20 flex space-x-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-8 bg-primary" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-stone-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-stone-500 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Carousel */}
      <section className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Explore by Category</h2>
              <p className="text-stone-500">
                Find the right investment or product for your needs.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const el = document.getElementById("category-scroll");
                  if (el) el.scrollBy({ left: -300, behavior: "smooth" });
                }}
                className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("category-scroll");
                  if (el) el.scrollBy({ left: 300, behavior: "smooth" });
                }}
                className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            id="category-scroll"
            className="flex space-x-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 w-64 group cursor-pointer"
              >
                <Link to={`/products?category=${cat.slug}`}>
                  <div className="relative h-80 rounded-[2rem] overflow-hidden mb-4">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-xl font-bold">{cat.name}</h3>
                      <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore Products
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmers Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Verified Farmers</h2>
            <p className="text-stone-600">
              Meet the hardworking individuals behind your fresh produce and
              agri-products.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            {farmers.map((farmer, i) => (
              <motion.div
                key={farmer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link
                  to={`/products?farmerId=${farmer.id}`}
                  className="block text-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-stone-50 group-hover:border-primary transition-all shadow-sm">
                    <img
                      src={`https://picsum.photos/seed/${farmer.id}/200/200`}
                      alt={farmer.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-primary transition-colors">
                    {farmer.name}
                  </h3>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">
                    Verified Farmer
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-stone-600 max-w-xl">
                Discover high-potential agricultural projects vetted by our
                experts for sustainability and profitability.
              </p>
            </div>
            <Link
              to="/projects"
              className="hidden md:flex items-center text-primary font-bold hover:underline"
            >
              All Projects <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.slice(0, 9).map((p, i) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 flex flex-col h-full"
              >
                <div className="h-56 relative">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                    {p.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {p.location}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-stone-500 text-sm mb-6 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span>
                        Raised:{" "}
                        <span className="text-primary">
                          ৳{p.raisedAmount.toLocaleString()}
                        </span>
                      </span>
                      <span className="text-stone-400">
                        Target: ৳{p.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{
                          width: `${(p.raisedAmount / p.targetAmount) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-stone-400">
                        {p.investorsCount} Investors
                      </span>
                      <button
                        onClick={() => handleInvestClick(p)}
                        className="text-primary font-bold text-sm hover:underline"
                      >
                        Invest Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-stone-600 max-w-xl">
                High-quality agricultural supplies and fresh produce delivered
                directly from our verified farmers.
              </p>
            </div>
            <Link
              to="/products"
              className="flex items-center text-primary font-bold hover:underline"
            >
              All Products <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-64 relative overflow-hidden">
                  <Link to={`/products/${p.id}`}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <Link to={`/products/${p.id}`}>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                    <span className="text-xl font-bold text-stone-900">
                      ৳{p.price.toLocaleString()}
                    </span>
                    <Link
                      to={`/products/${p.id}`}
                      className="text-primary font-bold text-sm flex items-center hover:underline"
                    >
                      Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What People Say</h2>
            <p className="text-stone-600">
              Hear from our community of farmers and investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 relative"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-14 w-14 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900">{t.name}</h4>
                    <p className="text-sm text-primary font-medium">{t.role}</p>
                  </div>
                </div>
                <p className="text-stone-600 italic leading-relaxed">
                  "{t.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <SproutIcon className="w-full h-full text-white" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to grow your wealth and the planet?
              </h2>
              <p className="text-stone-400 text-lg mb-10">
                Join thousands of investors who are making a real impact in the
                agricultural sector while earning competitive returns.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/contact"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold transition-all text-center"
                >
                  Get Started Today
                </Link>
                <Link
                  to="/contact"
                  className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold transition-all text-center"
                >
                  Talk to an Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && selectedProject && (
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          onSuccess={handleInvestmentSuccess}
        />
      )}
    </div>
  );
}

function SproutIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-3 5.5-13 0-16" />
      <path d="M14 20c-5.5-3-5.5-13 0-16" />
      <path d="M12 20v-4" />
      <path d="M12 11V7" />
    </svg>
  );
}
