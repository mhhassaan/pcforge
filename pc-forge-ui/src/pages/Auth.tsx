import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Loader2 } from 'lucide-react';
import { AnimatedGridPattern } from '@/components/ui/AnimatedGridPattern';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(`${API}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);

        if (!res.ok) {
            throw new Error(data.detail || "Authentication failed");
        }

        if (isLogin) {
            localStorage.setItem("pcforge_user", JSON.stringify(data.user));
            navigate("/");
        } else {
            alert("Registration successful! Please login.");
            setIsLogin(true);
        }
    } catch (err: any) {
        console.error("Auth Error:", err);
        if (err.name === 'AbortError') {
            setError("Request timed out. Check server connection.");
        } else {
            setError(err.message || "Network error or server unreachable");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative transition-colors duration-300">
      {/* Background Effect - Static Strong Grid */}
      <div className="absolute inset-0 z-0">
        <AnimatedGridPattern
          numSquares={0}
          className="[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] stroke-gray-950/10 dark:stroke-blue-500/20"
        />
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-[#121212] border-4 border-black dark:border-blue-600 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(37,99,235,0.2)] relative z-10 transition-colors">
        {/* Decorative elements */}
        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-600"></div>
        
        <div className="p-8 md:p-12 space-y-10">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-1 italic">
              <ShieldCheck size={12} /> Identity Access Management
            </div>
            <h1 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
              {isLogin ? 'User Login ' : 'User Signup '}
            </h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
              {isLogin ? 'Enter valid credentials.' : 'Initialize new community build profile.'}
            </p>
          </header>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 border border-red-200 dark:border-red-900/30 text-xs font-bold uppercase tracking-wide text-center">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest group-focus-within:text-black dark:group-focus-within:text-white transition-colors italic">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-700" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="BUILDER_01"
                    className="w-full border-2 border-black dark:border-white/10 p-4 pl-12 text-sm font-black uppercase tracking-tight bg-white dark:bg-slate-950 text-black dark:text-white focus:bg-gray-50 dark:focus:bg-slate-900 outline-none transition-all"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest group-focus-within:text-black dark:group-focus-within:text-white transition-colors italic">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-700" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="arch@pcforge.pk"
                  className="w-full border-2 border-black dark:border-white/10 p-4 pl-12 text-sm font-black uppercase tracking-tight bg-white dark:bg-slate-950 text-black dark:text-white focus:bg-gray-50 dark:focus:bg-slate-900 outline-none transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest group-focus-within:text-black dark:group-focus-within:text-white transition-colors italic">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-700" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="********"
                  className="w-full border-2 border-black dark:border-white/10 p-4 pl-12 text-sm font-black uppercase tracking-tight bg-white dark:bg-slate-950 text-black dark:text-white focus:bg-gray-50 dark:focus:bg-slate-900 outline-none transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-black dark:bg-blue-600 text-white font-black py-5 uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-blue-600 dark:hover:bg-blue-500 flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:shadow-[8px_8px_0px_0px_#020617] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (isLogin ? 'Grant Access' : 'Register Profile')} 
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <footer className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest italic">
              {isLogin ? "No valid ID?" : "Already Registered?"}
            </p>
            <button 
              onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
              }}
              className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-black dark:hover:text-white uppercase tracking-[0.2em] border-b-2 border-blue-600 dark:border-blue-400 pb-0.5 transition-colors italic"
            >
              {isLogin ? 'REQUEST NEW ID' : 'RETURN TO LOGIN'}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
