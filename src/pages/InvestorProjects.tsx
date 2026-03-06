import { motion } from 'motion/react';
import { Search, Filter, MapPin, Users, Calendar, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { projects as initialProjects } from '@/src/data';
import { useAuth } from '@/src/context/AuthContext';
import InvestmentModal from '@/src/components/InvestmentModal';

export default function InvestorProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          setProjects(await response.json());
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleInvestClick = (project: any) => {
    if (!user) {
      toast.error('You must login to invest as an Investor');
      navigate('/login');
      return;
    }
    if (user.role !== 'INVESTOR' && user.role !== 'ADMIN') {
      toast.error('Only investor accounts can fund projects.');
      return;
    }
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleInvestmentSuccess = () => {
    // Refresh projects data
    const fetchProjects = async () => {
      const response = await fetch('/api/projects');
      if (response.ok) setProjects(await response.json());
    };
    fetchProjects();
  };

  return (
    <div className="pt-24 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Investment Opportunities</h1>
            <p className="text-stone-600">
              Browse through our vetted agricultural projects. Each project is carefully selected for its potential impact and financial returns.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-full md:w-64"
              />
            </div>
            <button className="p-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors">
              <Filter className="h-5 w-5 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full"
            >
              <Link to={`/projects/${p.id}`} className="block h-64 relative overflow-hidden group">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm">
                  {p.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  {p.returns} ROI
                </div>
              </Link>

              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center text-stone-400 text-xs font-medium mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  {p.location}
                </div>
                <Link to={`/projects/${p.id}`} className="block group">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
                </Link>
                <p className="text-stone-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-stone-600">{p.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-stone-600">{p.investorsCount} Investors</span>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-stone-400">Raised: <span className="text-primary">৳{p.raisedAmount.toLocaleString()}</span></span>
                    <span className="text-stone-900">৳{p.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.raisedAmount / p.targetAmount) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                  <button
                    onClick={() => handleInvestClick(p)}
                    className="block w-full text-center bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-2xl font-bold transition-all mt-4"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
            Load More Projects
          </button>
        </div>
      </div>

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
