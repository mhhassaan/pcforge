import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Plus, Monitor, Loader2, Hammer } from 'lucide-react';
import { fetchUserBuilds } from '../api/pcforge';
import type { GalleryBuild } from '../types/pcforge';

export default function MyBuilds() {
  const navigate = useNavigate();
  const [builds, setBuilds] = useState<GalleryBuild[]>([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('pcforge_user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }

    async function loadMyBuilds() {
      try {
        const data = await fetchUserBuilds(user.id);
        setBuilds(data);
      } catch (err) {
        console.error("Failed to fetch my builds:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMyBuilds();
  }, [user?.id, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white p-3 md:p-8 font-sans overflow-x-hidden transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex-1 min-w-0">
                <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 italic leading-none break-words">MY ARCHIVES</h1>
                <div className="h-2 w-32 bg-blue-600 mb-6"></div>
                <p className="text-gray-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]">Your personal collection of hardware configurations.</p>
            </div>
            <Link 
                to="/builder"
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-black dark:bg-blue-600 text-white font-black py-4 md:py-5 px-10 rounded-none transition-all uppercase tracking-widest text-[10px] shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)]"
            >
                New Assembly <Plus size={16} />
            </Link>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 md:py-40">
            <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-600 italic">Accessing Personal Archives...</p>
          </div>
        ) : builds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {builds.map((build) => (
                  <div key={build.id} className="group border-2 border-black dark:border-white/10 bg-white dark:bg-slate-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.2)] transition-all flex flex-col min-w-0">
                      <div className="aspect-[4/3] bg-gray-50 dark:bg-slate-950 border-b-2 border-black dark:border-white/10 relative flex items-center justify-center overflow-hidden flex-shrink-0">
                          <Camera size={48} className="text-gray-200 dark:text-slate-800 group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute top-3 left-3 bg-black dark:bg-blue-600 text-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">
                              Ref: {build.id.toString().padStart(4, '0')}
                          </div>
                          {build.total_price_pkr && (
                            <div className="absolute bottom-3 right-3 bg-blue-600 dark:bg-blue-600 text-white px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-black font-mono shadow-lg">
                                Rs. {build.total_price_pkr.toLocaleString()}
                            </div>
                          )}
                      </div>
                      
                      <div className="p-4 md:p-6 space-y-4 flex-1 flex flex-col min-w-0">
                          <div className="min-w-0">
                              <h3 className="text-base font-black text-black dark:text-white uppercase tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 truncate">
                                  {build.title}
                              </h3>
                              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest truncate">
                                  <Monitor size={10} /> {build.user_name || 'Anonymous'}
                              </div>
                          </div>
                          
                          <div className="space-y-1.5 border-t border-gray-100 dark:border-white/5 pt-4">
                              <div className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tighter flex justify-between">
                                  <span>CPU</span>
                                  <span className="text-black dark:text-slate-200">{build.cpu_name?.split(' ').slice(0, 3).join(' ') || 'N/A'}</span>
                              </div>
                              <div className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tighter flex justify-between">
                                  <span>GPU</span>
                                  <span className="text-black dark:text-slate-200">{build.gpu_name?.split(' ').slice(0, 3).join(' ') || 'N/A'}</span>
                              </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-300 dark:text-slate-700 uppercase tracking-widest italic">STATUS: ARCHIVED</span>
                              <Link 
                                to={`/gallery/${build.id}`}
                                className="text-[10px] font-black text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest underline decoration-2 underline-offset-4 transition-colors"
                              >
                                  Details
                              </Link>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        ) : (
          <div className="mt-20 p-20 border-2 border-black dark:border-white/10 border-dashed bg-gray-50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-white dark:bg-slate-900 border-2 border-black dark:border-blue-600 flex items-center justify-center mb-6 transition-colors">
                  <Hammer size={32} className="text-black dark:text-white" />
               </div>
               <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-[0.3em] mb-4">Archives Empty</h2>
               <p className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase max-w-sm leading-relaxed mb-8">
                  You haven't archived any hardware configurations yet. Start your first build to catalog it here.
               </p>
               <Link 
                to="/builder"
                className="bg-black dark:bg-blue-600 text-white font-black py-4 px-10 uppercase tracking-widest text-xs hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.2)]"
               >
                Initialize First Build
               </Link>
          </div>
        )}
      </div>
    </div>
  );
}
