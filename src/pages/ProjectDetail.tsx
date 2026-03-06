import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  MapPin,
  Users,
  Calendar,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { projects as initialProjects } from "@/src/data";
import { useAuth } from "@/src/context/AuthContext";
import InvestmentModal from "@/src/components/InvestmentModal";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
    fetchProjects();
  }, []);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Link
          to="/projects"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const progress = (project.raisedAmount / project.targetAmount) * 100;

  const handleInvestClick = () => {
    if (!user) {
      toast.error("You must login to invest as an Investor");
      navigate("/login");
      return;
    }
    if (user.role !== "INVESTOR" && user.role !== "ADMIN") {
      toast.error("Only investor accounts can fund projects.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleInvestmentSuccess = () => {
    // Refresh projects data
    const fetchProjects = async () => {
      const response = await fetch("/api/projects");
      if (response.ok) setProjects(await response.json());
    };
    fetchProjects();
  };

  return (
    <div className="pt-24 min-h-screen bg-stone-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/projects"
          className="inline-flex items-center text-stone-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-stone-100">
              <div className="h-[400px] relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-primary shadow-sm">
                  {project.category}
                </div>
              </div>
              <div className="p-10">
                <div className="flex items-center text-stone-400 text-sm font-medium mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.location}
                </div>
                <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
                <p className="text-stone-600 text-lg leading-relaxed mb-10">
                  {project.fullDescription}
                </p>

                <h2 className="text-2xl font-bold mb-6">Project Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.highlights.map((highlight: string) => (
                    <div
                      key={highlight}
                      className="flex items-center space-x-3 p-4 rounded-2xl bg-primary-light border border-primary/10"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium text-stone-800">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100">
              <h2 className="text-2xl font-bold mb-6">Investment Security</h2>
              <div className="flex items-start space-x-4 p-6 rounded-3xl bg-stone-50 border border-stone-100">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Vetted & Verified</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Every project on Nejjo Mullo undergoes a rigorous 5-step
                    verification process, including soil testing, market
                    analysis, and farmer background checks to ensure your
                    investment is secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-stone-100 sticky top-28">
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-3xl font-bold text-primary">
                      ৳{project.raisedAmount.toLocaleString()}
                    </span>
                    <span className="text-stone-400 text-sm ml-2">
                      raised of ৳{project.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-primary font-bold">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className="bg-primary h-full rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-center">
                  <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="text-lg font-bold text-stone-900">
                    {project.returns}
                  </div>
                  <div className="text-xs text-stone-400 uppercase font-bold tracking-wider">
                    Est. Return
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-center">
                  <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="text-lg font-bold text-stone-900">
                    {project.duration}
                  </div>
                  <div className="text-xs text-stone-400 uppercase font-bold tracking-wider">
                    Duration
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Total Investors</span>
                  <span className="font-bold text-stone-900">
                    {project.investorsCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Risk Level</span>
                  <span className="font-bold text-emerald-600">Low</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Payout Frequency</span>
                  <span className="font-bold text-stone-900">End of Cycle</span>
                </div>
              </div>

              <button
                onClick={handleInvestClick}
                className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary/20 mb-4"
              >
                Invest Now
              </button>
              <p className="text-center text-xs text-stone-400">
                By clicking Invest Now, you agree to our Investment Terms &
                Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={project}
          onSuccess={handleInvestmentSuccess}
        />
      )}
    </div>
  );
}
