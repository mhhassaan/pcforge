import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminMetrics } from '../api/pcforge';
import { 
  Database, 
  Layout, 
  Users, 
  Package, 
  Activity, 
  Lock, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

interface Metrics {
  category_distribution: { category: string; total: number }[];
  stats: {
    total_products: number;
    total_builds: number;
    total_users: number;
    active_vendors: number;
  };
  recent_activity: {
    title: string;
    user_name: string;
    total_price_pkr: number;
    created_at: string;
  }[];
  recent_users: {
    username: string;
    email: string;
    created_at: string;
  }[];
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('');

  // Demonstration: Simple passcode check for "Admin" access
  const verifyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' && email.includes('@pcforge.pk')) {
      setIsAdmin(true);
      localStorage.setItem('admin_access', 'true');
    } else if (passcode === 'admin123') {
      alert('Admin email endpoint required (@pcforge.pk)');
    } else {
      alert('Unauthorized access attempt logged.');
    }
  };

  useEffect(() => {
    const access = localStorage.getItem('admin_access');
    if (access === 'true') setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    async function load() {
      try {
        const data = await fetchAdminMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-[#121212] border-4 border-black dark:border-blue-600 p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(37,99,235,0.2)] text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 border-2 border-red-600 flex items-center justify-center mx-auto mb-6 text-red-600">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 italic dark:text-white">Restricted Access</h1>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-8">System Administrator Authentication Required</p>
          
          <form onSubmit={verifyAccess} className="space-y-4">
            <input 
              required
              type="email" 
              placeholder="ADMIN EMAIL (@pcforge.pk)"
              className="w-full border-2 border-black dark:border-white/10 p-4 text-center font-black uppercase tracking-[0.1em] outline-none focus:bg-gray-50 dark:bg-[#0a0a0a] dark:text-white dark:focus:bg-[#1a1a1a] transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input 
              required
              type="password" 
              placeholder="ENTER ADMIN PASSCODE"
              className="w-full border-2 border-black dark:border-white/10 p-4 text-center font-black uppercase tracking-[0.2em] outline-none focus:bg-gray-50 dark:bg-[#0a0a0a] dark:text-white dark:focus:bg-[#1a1a1a] transition-all"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
            />
            <button className="w-full bg-black dark:bg-blue-600 text-white font-black py-4 uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              Initialize Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center transition-colors duration-300">
        <Activity size={48} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-600 italic">Loading System Metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-full mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white dark:bg-[#121212] border-4 border-black dark:border-blue-600 p-8 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)]">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 italic bg-blue-50 dark:bg-blue-900/20 px-2 py-1">
              <Database size={12} /> Management Information System
            </div>
            <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter italic leading-none">Command_Console</h1>
            <div className="mt-4 flex gap-4">
              <Link 
                to="/admin/inventory" 
                className="bg-black dark:bg-blue-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center gap-2"
              >
                <Package size={14} /> Manage Inventory
              </Link>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('admin_access'); window.location.reload(); }}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-500 border-b-2 border-red-600 dark:border-red-500 pb-1 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors"
          >
            TERMINATE_SESSION
          </button>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Inventory', value: metrics.stats.total_products, icon: <Package />, color: 'text-black dark:text-white' },
            { label: 'Community Builds', value: metrics.stats.total_builds, icon: <Layout />, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Registered Architects', value: metrics.stats.total_users, icon: <Users />, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Partner Vendors', value: metrics.stats.active_vendors, icon: <Users />, color: 'text-gray-400 dark:text-slate-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 p-6 flex justify-between items-center group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)] transition-all">
              <div>
                <p className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1 italic">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color} tracking-tighter italic`}>{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center text-gray-300 dark:text-slate-700 group-hover:text-black dark:group-hover:text-blue-400 transition-colors">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Category Breakdown */}
          <div className="lg:col-span-7 bg-white dark:bg-[#121212] border-4 border-black dark:border-white/10 p-8 relative overflow-hidden">
            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8 border-b-2 border-black dark:border-white/10 pb-4 flex items-center gap-3 dark:text-white">
              <Package size={20} className="text-blue-600 dark:text-blue-400" /> Inventory_Distribution
            </h2>
            
            <div className="space-y-6">
              {metrics.category_distribution.map((cat) => {
                const percentage = (cat.total / metrics.stats.total_products) * 100;
                return (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-black uppercase tracking-tight italic dark:text-slate-300">{cat.category}</span>
                      <span className="text-[11px] font-black font-mono dark:text-white">{cat.total} Units</span>
                    </div>
                    <div className="h-4 bg-gray-100 dark:bg-[#0a0a0a] border border-black dark:border-white/10 p-0.5 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-5 bg-black dark:bg-[#121212] text-white border-4 border-black dark:border-blue-600 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8 border-b border-gray-800 dark:border-white/10 pb-4 flex items-center gap-3">
              <Activity size={20} className="text-blue-400" /> Recent_Archives
            </h2>
            
            <div className="space-y-4">
              {metrics.recent_activity.map((build, i) => (
                <div key={i} className="group flex items-center justify-between border-b border-gray-900 dark:border-white/5 pb-4 last:border-0 hover:bg-gray-900 dark:hover:bg-[#0a0a0a] p-2 transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase truncate group-hover:text-blue-400 transition-colors">{build.title}</p>
                    <p className="text-[9px] font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest italic">{build.user_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black font-mono text-blue-400">Rs. {build.total_price_pkr.toLocaleString()}</p>
                    <p className="text-[8px] font-black text-gray-600 dark:text-slate-600 uppercase tracking-tighter">
                      {new Date(build.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {metrics.recent_activity.length === 0 && (
                <div className="text-center py-12 text-gray-600 dark:text-slate-700 border-2 border-dashed border-gray-800 dark:border-white/10">
                  <AlertTriangle size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">Zero activity logs recorded.</p>
                </div>
              )}
            </div>

            <button className="w-full mt-8 bg-white dark:bg-blue-600 text-black dark:text-white font-black py-4 uppercase tracking-[0.2em] text-[10px] hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2">
              View All Logs <ArrowUpRight size={14} />
            </button>
          </div>

          {/* User Signups */}
          <div className="lg:col-span-12 bg-white dark:bg-[#121212] border-4 border-black dark:border-white/10 p-8">
            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8 border-b-2 border-black dark:border-white/10 pb-4 flex items-center gap-3 dark:text-white">
              <Users size={20} className="text-blue-600 dark:text-blue-400" /> Recent_User_Acquisition
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.recent_users.map((user, i) => (
                <div key={i} className="bg-gray-50 dark:bg-[#0a0a0a] border-2 border-black dark:border-white/10 p-4 space-y-2 group hover:bg-black dark:hover:bg-blue-600 hover:text-white transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 group-hover:text-white group-hover:dark:text-white">Identity_Token</span>
                    <span className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase group-hover:text-slate-300">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight dark:text-white">{user.username}</p>
                    <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 group-hover:text-slate-300 dark:group-hover:text-blue-100 italic">{user.email}</p>
                  </div>
                </div>
              ))}
              {metrics.recent_users.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-300 dark:text-slate-800 font-black uppercase italic border-2 border-dashed border-gray-200 dark:border-white/5">
                  Zero identity archives detected.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
