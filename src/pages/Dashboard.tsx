import { useAuth } from '@/src/context/AuthContext';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Sprout, 
  ShoppingBag, 
  MessageSquare, 
  Settings,
  Plus,
  ArrowUpRight,
  Wallet,
  Clock,
  User as UserIcon,
  PieChart as PieChartIcon,
  ShieldCheck,
  Edit,
  Trash2
} from 'lucide-react';
import { projects as initialProjects, products as initialProducts } from '@/src/data';
import ProfileSettings from '@/src/components/ProfileSettings';
import FarmerNewProject from '@/src/components/FarmerNewProject';
import FarmerAddProduct from '@/src/components/FarmerAddProduct';
import FarmerOrders from '@/src/components/FarmerOrders';
import FarmerMessages from '@/src/components/FarmerMessages';
import InvestorPortfolio from '@/src/components/InvestorPortfolio';
import InvestorTransactions from '@/src/components/InvestorTransactions';
import AdminAddUser from '@/src/components/AdminAddUser';
import AdminAddCategory from '@/src/components/AdminAddCategory';
import { ArrowLeft, Layers } from 'lucide-react';

type FarmerView = 'overview' | 'new-project' | 'add-product' | 'orders' | 'messages';
type InvestorView = 'overview' | 'portfolio' | 'transactions' | 'messages';
type RetailerView = 'overview' | 'bulk-orders' | 'inventory' | 'messages';
type ConsumerView = 'overview' | 'my-orders' | 'subscriptions' | 'messages';
type AdminView = 'overview' | 'projects' | 'products' | 'users' | 'orders' | 'categories' | 'farmer-inventory' | 'add-project' | 'add-product' | 'add-user' | 'add-category' | 'edit-project' | 'edit-product' | 'edit-user' | 'edit-category';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [farmerView, setFarmerView] = useState<FarmerView>('overview');
  const [investorView, setInvestorView] = useState<InvestorView>('overview');
  const [retailerView, setRetailerView] = useState<RetailerView>('overview');
  const [consumerView, setConsumerView] = useState<ConsumerView>('overview');
  const [adminView, setAdminView] = useState<AdminView>('overview');
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [investments, setInvestments] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [projectsRes, productsRes, investmentsRes, usersRes, ordersRes, categoriesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/products'),
        fetch('/api/investments'),
        fetch('/api/users'),
        fetch('/api/orders'),
        fetch('/api/categories')
      ]);
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (investmentsRes.ok) setInvestments(await investmentsRes.json());
      if (usersRes.ok) setAllUsers(await usersRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (categoriesRes.ok) setAllCategories(await categoriesRes.json());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [farmerView, investorView, retailerView, consumerView, adminView]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        // Refresh data for any relevant event
        fetchData();
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onopen = () => console.log('WebSocket connected');
    ws.onclose = () => console.log('WebSocket disconnected');
    ws.onerror = (error) => console.error('WebSocket error:', error);

    return () => {
      ws.close();
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Please log in to view your dashboard</h2>
        </div>
      </div>
    );
  }

  const renderAdminDashboard = () => {
    if (adminView === 'add-project') return <FarmerNewProject onBack={() => setAdminView('overview')} onSuccess={() => setAdminView('overview')} />;
    if (adminView === 'add-product') return <FarmerAddProduct onBack={() => setAdminView('overview')} onSuccess={() => setAdminView('overview')} />;
    if (adminView === 'add-user') return <AdminAddUser onBack={() => setAdminView('overview')} onSuccess={() => setAdminView('overview')} />;
    if (adminView === 'add-category') return <AdminAddCategory onBack={() => setAdminView('overview')} onSuccess={() => setAdminView('overview')} />;
    if (adminView === 'edit-project') return <FarmerNewProject initialData={editingProject} onBack={() => setAdminView('projects')} onSuccess={() => setAdminView('projects')} />;
    if (adminView === 'edit-product') return <FarmerAddProduct initialData={editingProduct} onBack={() => setAdminView('products')} onSuccess={() => setAdminView('products')} />;
    if (adminView === 'edit-user') return <AdminAddUser initialData={editingUser} onBack={() => setAdminView('users')} onSuccess={() => setAdminView('users')} />;
    if (adminView === 'edit-category') return <AdminAddCategory initialData={editingCategory} onBack={() => setAdminView('categories')} onSuccess={() => setAdminView('categories')} />;

    const handleDelete = async (type: 'projects' | 'products' | 'users' | 'categories', id: string) => {
      if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
      try {
        const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    };

    const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const userRoles = allUsers.reduce((acc: any, u: any) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});

    if (adminView === 'projects') {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setAdminView('overview')} className="flex items-center space-x-2 text-stone-500 font-bold hover:text-stone-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </button>
            <button onClick={() => setAdminView('add-project')} className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </button>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-6">All Projects</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-stone-100">
                    <th className="pb-4 font-bold text-stone-500 text-sm">Project</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Location</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Target</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Raised</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Progress</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <img src={project.image} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-stone-800">{project.title}</span>
                        </div>
                      </td>
                      <td className="py-4 text-stone-600 text-sm">{project.location}</td>
                      <td className="py-4 text-stone-600 text-sm">৳{project.targetAmount.toLocaleString()}</td>
                      <td className="py-4 text-stone-600 text-sm">৳{project.raisedAmount.toLocaleString()}</td>
                      <td className="py-4">
                        <span className="font-bold text-primary">{project.targetAmount ? Math.round((project.raisedAmount / project.targetAmount) * 100) : 0}%</span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => { setEditingProject(project); setAdminView('edit-project'); }}
                            className="p-2 text-stone-400 hover:text-primary transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete('projects', project.id)}
                            className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (adminView === 'products') {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setAdminView('overview')} className="flex items-center space-x-2 text-stone-500 font-bold hover:text-stone-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </button>
            <button onClick={() => setAdminView('add-product')} className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-6">All Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-stone-100">
                    <th className="pb-4 font-bold text-stone-500 text-sm">Product</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Category</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Price</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Farmer</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-stone-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-stone-600 text-sm">{product.category}</td>
                      <td className="py-4 text-stone-600 text-sm">৳{product.price.toLocaleString()}</td>
                      <td className="py-4 text-stone-600 text-sm">{product.farmerName || 'Platform'}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => { setEditingProduct(product); setAdminView('edit-product'); }}
                            className="p-2 text-stone-400 hover:text-primary transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete('products', product.id)}
                            className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (adminView === 'users') {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setAdminView('overview')} className="flex items-center space-x-2 text-stone-500 font-bold hover:text-stone-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </button>
            <button onClick={() => setAdminView('add-user')} className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-6">All Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-stone-100">
                    <th className="pb-4 font-bold text-stone-500 text-sm">Name</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Email</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Role</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Joined</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {allUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="py-4 font-bold text-stone-800">{u.name}</td>
                      <td className="py-4 text-stone-600 text-sm">{u.email}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider">{u.role}</span>
                      </td>
                      <td className="py-4 text-stone-500 text-sm">March 2026</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => { setEditingUser(u); setAdminView('edit-user'); }}
                            className="p-2 text-stone-400 hover:text-primary transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete('users', u.id)}
                            className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (adminView === 'categories') {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setAdminView('overview')} className="flex items-center space-x-2 text-stone-500 font-bold hover:text-stone-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </button>
            <button onClick={() => setAdminView('add-category')} className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-6">All Categories</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-stone-100">
                    <th className="pb-4 font-bold text-stone-500 text-sm">Category</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Slug</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Parent</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {allCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <img src={cat.image} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-stone-800">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-stone-600 text-sm">{cat.slug}</td>
                      <td className="py-4 text-stone-600 text-sm">
                        {cat.parentId ? allCategories.find(c => c.id === cat.parentId)?.name || 'Unknown' : 'None'}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => { setEditingCategory(cat); setAdminView('edit-category'); }}
                            className="p-2 text-stone-400 hover:text-primary transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete('categories', cat.id)}
                            className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (adminView === 'farmer-inventory') {
      const farmers = allUsers.filter(u => u.role === 'FARMER');
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setAdminView('overview')} className="flex items-center space-x-2 text-stone-500 font-bold hover:text-stone-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </button>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-6">Farmer Inventory Breakdown</h3>
            <div className="space-y-8">
              {farmers.map(farmer => {
                const farmerProducts = products.filter(p => p.farmerId === farmer.id);
                const productsByCategory = farmerProducts.reduce((acc: any, p) => {
                  if (!acc[p.category]) acc[p.category] = [];
                  acc[p.category].push(p);
                  return acc;
                }, {});

                return (
                  <div key={farmer.id} className="p-6 rounded-3xl bg-stone-50 border border-stone-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900">{farmer.name}</h4>
                          <p className="text-xs text-stone-500">{farmer.email}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {farmerProducts.length} Products
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(productsByCategory).map(([category, catProducts]: [string, any]) => (
                        <div key={category} className="bg-white p-4 rounded-2xl border border-stone-100">
                          <h5 className="text-sm font-bold text-stone-800 mb-3 flex items-center">
                            <Layers className="h-4 w-4 mr-2 text-primary" />
                            {category}
                          </h5>
                          <div className="space-y-2">
                            {catProducts.map((p: any) => (
                              <div key={p.id} className="flex items-center justify-between text-xs">
                                <span className="text-stone-600 truncate mr-2">{p.name}</span>
                                <span className="font-bold text-stone-900">৳{p.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {farmerProducts.length === 0 && (
                        <p className="text-xs text-stone-400 italic col-span-full">No products listed by this farmer.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (adminView === 'orders') {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setAdminView('overview')} className="flex items-center space-x-2 text-stone-500 font-bold hover:text-stone-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </button>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-6">All Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-stone-100">
                    <th className="pb-4 font-bold text-stone-500 text-sm">Order ID</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Customer</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Amount</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Status</th>
                    <th className="pb-4 font-bold text-stone-500 text-sm">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-4 font-bold text-stone-800">#{order.id.slice(-5)}</td>
                      <td className="py-4 text-stone-600 text-sm">{order.customerName}</td>
                      <td className="py-4 text-stone-600 text-sm">৳{order.total.toLocaleString()}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider">{order.status}</span>
                      </td>
                      <td className="py-4 text-stone-500 text-sm">{order.date}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Projects', value: projects.length, icon: Sprout, color: 'bg-green-500', action: () => setAdminView('projects') },
            { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'bg-blue-500', action: () => setAdminView('products') },
            { label: 'Total Categories', value: allCategories.length, icon: Layers, color: 'bg-yellow-500', action: () => setAdminView('categories') },
            { label: 'Total Users', value: allUsers.length, icon: Users, color: 'bg-purple-500', action: () => setAdminView('users') },
            { label: 'Farmer Inventory', value: allUsers.filter(u => u.role === 'FARMER').length, icon: ShoppingBag, color: 'bg-orange-500', action: () => setAdminView('farmer-inventory') },
            { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-indigo-500', action: () => setAdminView('orders') },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={stat.action}
              className={`bg-white p-5 rounded-3xl shadow-sm border border-stone-100 ${stat.action ? 'cursor-pointer hover:border-primary/30 transition-all' : ''}`}
            >
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-stone-500 text-xs font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-stone-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-900">User Breakdown</h3>
              <div className="flex items-center space-x-2 text-sm text-stone-500">
                <Users className="h-4 w-4" />
                <span>{allUsers.length} Total Users</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(userRoles).map(([role, count]: [string, any]) => (
                <div key={role} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{role}</p>
                  <p className="text-2xl font-bold text-stone-900">{count}</p>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(count / allUsers.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Add Project', icon: Plus, color: 'text-green-500', action: () => setAdminView('add-project') },
                { label: 'Add Product', icon: Plus, color: 'text-blue-500', action: () => setAdminView('add-product') },
                { label: 'Add Category', icon: Plus, color: 'text-yellow-500', action: () => setAdminView('add-category') },
                { label: 'Add User', icon: Plus, color: 'text-purple-500', action: () => setAdminView('add-user') },
                { label: 'View Orders', icon: ShoppingBag, color: 'text-indigo-500', action: () => setAdminView('orders') },
              ].map((action, i) => (
                <button 
                  key={i} 
                  onClick={action.action}
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors text-left w-full"
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="font-bold text-stone-700 text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-900">Recent Projects</h3>
              <button onClick={() => setAdminView('projects')} className="text-primary font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 4).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50">
                  <div className="flex items-center space-x-4">
                    <img src={project.image} alt="" className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-stone-800">{project.title}</p>
                      <p className="text-xs text-stone-500">{project.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{project.targetAmount ? Math.round((project.raisedAmount / project.targetAmount) * 100) : 0}%</p>
                    <p className="text-[10px] text-stone-400 uppercase font-bold">Funded</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-900">Recent Products</h3>
              <button onClick={() => setAdminView('products')} className="text-primary font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-stone-800">{product.name}</p>
                      <p className="text-xs text-stone-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stone-800">৳{product.price.toLocaleString()}</p>
                    <p className="text-[10px] text-stone-400 uppercase font-bold">Price</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInvestorDashboard = () => {
    if (investorView === 'portfolio') return <InvestorPortfolio onBack={() => setInvestorView('overview')} />;
    if (investorView === 'transactions') return <InvestorTransactions onBack={() => setInvestorView('overview')} />;
    if (investorView === 'messages') return <FarmerMessages onBack={() => setInvestorView('overview')} />;

    const totalInvested = investments.filter(inv => inv.investorId === user.id).reduce((sum, inv) => sum + inv.amount, 0);
    const isKycComplete = user.nidNumber && user.dob && user.bankAccountNumber;

    return (
      <div className="space-y-8">
        {!isKycComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between"
          >
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Complete Your Investor Profile</h4>
                <p className="text-sm text-stone-500">Please complete your KYC and bank details to enable full investment features.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-500/20"
            >
              Complete KYC
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Invested', value: `৳${totalInvested.toLocaleString()}`, icon: Wallet, color: 'bg-blue-500' },
            { label: 'Active Projects', value: investments.filter(inv => inv.investorId === user.id && inv.status === 'Active').length, icon: Sprout, color: 'bg-green-500' },
            { label: 'Estimated Returns', value: '৳35,000', icon: TrendingUp, color: 'bg-orange-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-stone-900">My Investments</h3>
                <button 
                  onClick={() => setInvestorView('portfolio')}
                  className="text-primary font-bold text-sm hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-stone-100">
                      <th className="pb-4 font-bold text-stone-500 text-sm">Project</th>
                      <th className="pb-4 font-bold text-stone-500 text-sm">Amount</th>
                      <th className="pb-4 font-bold text-stone-500 text-sm">Status</th>
                      <th className="pb-4 font-bold text-stone-500 text-sm">Next Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {investments.filter(inv => inv.investorId === user.id).slice(0, 3).map((inv, i) => (
                      <tr key={i}>
                        <td className="py-4 font-bold text-stone-800">{inv.projectName}</td>
                        <td className="py-4 text-stone-600">৳{inv.amount.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 text-stone-500 text-sm">{inv.payoutDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold text-stone-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Portfolio Details', icon: PieChartIcon, color: 'text-blue-500', action: () => setInvestorView('portfolio') },
                  { label: 'Transactions', icon: Wallet, color: 'text-green-500', action: () => setInvestorView('transactions') },
                  { label: 'Messages', icon: MessageSquare, color: 'text-purple-500', action: () => setInvestorView('messages') },
                  { label: 'Settings', icon: Settings, color: 'text-stone-500', action: () => setActiveTab('settings') },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    onClick={action.action}
                    className="flex items-center space-x-3 p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors text-left w-full"
                  >
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="font-bold text-stone-700 text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFarmerDashboard = () => {
    if (farmerView === 'new-project') return <FarmerNewProject onBack={() => setFarmerView('overview')} onSuccess={() => setFarmerView('overview')} />;
    if (farmerView === 'add-product') return <FarmerAddProduct onBack={() => setFarmerView('overview')} onSuccess={() => setFarmerView('overview')} />;
    if (farmerView === 'orders') return <FarmerOrders onBack={() => setFarmerView('overview')} />;
    if (farmerView === 'messages') return <FarmerMessages onBack={() => setFarmerView('overview')} />;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'My Products', value: products.filter(p => p.farmerId === user.id).length, icon: ShoppingBag, color: 'bg-blue-500' },
            { label: 'Active Projects', value: projects.filter(p => p.farmerId === user.id).length, icon: Sprout, color: 'bg-green-500' },
            { label: 'Total Sales', value: '৳85,400', icon: TrendingUp, color: 'bg-orange-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-stone-900">My Projects</h3>
                <button 
                  onClick={() => setFarmerView('new-project')}
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </button>
              </div>
              <div className="space-y-4">
                {projects.filter(p => p.farmerId === user.id).length === 0 ? (
                  <p className="text-stone-500 text-center py-8">No projects found.</p>
                ) : (
                  projects.filter(p => p.farmerId === user.id).map((project) => (
                    <div key={project.id} className="p-6 rounded-3xl bg-stone-50 border border-stone-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-stone-800 text-lg">{project.title}</h4>
                          <p className="text-sm text-stone-500">{project.location}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          Funding
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-500">Progress</span>
                          <span className="font-bold text-stone-800">{project.targetAmount ? Math.round((project.raisedAmount / project.targetAmount) * 100) : 0}%</span>
                        </div>
                        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${project.targetAmount ? (project.raisedAmount / project.targetAmount) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold text-stone-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Add Product', icon: Plus, color: 'text-blue-500', action: () => setFarmerView('add-product') },
                  { label: 'Check Orders', icon: ShoppingBag, color: 'text-green-500', action: () => setFarmerView('orders') },
                  { label: 'Messages', icon: MessageSquare, color: 'text-purple-500', action: () => setFarmerView('messages') },
                  { label: 'Settings', icon: Settings, color: 'text-stone-500', action: () => setActiveTab('settings') },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    onClick={action.action}
                    className="flex items-center space-x-3 p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors text-left w-full"
                  >
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="font-bold text-stone-700 text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRetailerDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Bulk Orders', value: '12', icon: ShoppingBag, color: 'bg-blue-500' },
          { label: 'Active Subscriptions', value: '5', icon: Sprout, color: 'bg-green-500' },
          { label: 'Wholesale Savings', value: '৳12,400', icon: TrendingUp, color: 'bg-orange-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold text-stone-900 mb-6">Wholesale Inventory</h3>
          <div className="space-y-4">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50">
                <div className="flex items-center space-x-4">
                  <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-stone-800">{product.name}</p>
                    <p className="text-xs text-stone-500">Retail: ৳{product.price} | Wholesale: ৳{(product.price * 0.85).toFixed(0)}</p>
                  </div>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold">Order Bulk</button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold text-stone-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-stone-700 text-sm">Place Bulk Order</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="font-bold text-stone-700 text-sm">Order History</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <span className="font-bold text-stone-700 text-sm">Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsumerDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'My Orders', value: '4', icon: ShoppingBag, color: 'bg-blue-500' },
          { label: 'Active Subscriptions', value: '1', icon: Sprout, color: 'bg-green-500' },
          { label: 'Total Savings', value: '৳1,200', icon: TrendingUp, color: 'bg-orange-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold text-stone-900 mb-6">Recent Orders</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-stone-800">Order #12345</p>
                  <p className="text-xs text-stone-500">March 03, 2026 • 3 Items</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider">Delivered</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold text-stone-900 mb-6">Subscription Packages</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <h4 className="font-bold text-primary mb-1">Weekly Veggie Box</h4>
              <p className="text-xs text-stone-500 mb-3">Fresh seasonal vegetables delivered every Monday.</p>
              <button className="w-full bg-primary text-white py-2 rounded-xl text-xs font-bold">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-2">
              Hello, {user.name}
            </h1>
            <p className="text-stone-500">
              Welcome to your {user.role.toLowerCase()} dashboard.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-stone-100">
            <button
              onClick={() => { setActiveTab('overview'); setFarmerView('overview'); setRetailerView('overview'); setConsumerView('overview'); setAdminView('overview'); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'overview' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'settings' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {user.role === 'ADMIN' && renderAdminDashboard()}
            {user.role === 'INVESTOR' && renderInvestorDashboard()}
            {user.role === 'FARMER' && renderFarmerDashboard()}
            {user.role === 'RETAILER' && renderRetailerDashboard()}
            {user.role === 'CONSUMER' && renderConsumerDashboard()}
          </>
        ) : (
          <ProfileSettings />
        )}
      </div>
    </div>
  );
}
