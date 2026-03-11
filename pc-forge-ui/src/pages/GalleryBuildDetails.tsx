import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Monitor, Cpu, HardDrive, Zap, Box, Layout } from 'lucide-react';
import { fetchGalleryBuild } from '../api/pcforge';
import type { GalleryBuild } from '../types/pcforge';

export default function GalleryBuildDetails() {
  const { id } = useParams<{ id: string }>();
  const [build, setBuild] = useState<GalleryBuild | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBuild() {
      if (!id) return;
      try {
        const data = await fetchGalleryBuild(parseInt(id));
        setBuild(data);
      } catch (err) {
        console.error("Failed to fetch build details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBuild();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-8 transition-colors duration-300">
        <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-600 italic">Decompressing Build Manifest...</p>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center transition-colors duration-300">
        <h1 className="text-4xl font-black uppercase mb-4 italic dark:text-white">Build Not Found</h1>
        <Link to="/gallery" className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs underline decoration-2 underline-offset-4">Return to Archives</Link>
      </div>
    );
  }

  const components = [
    { label: "Processor", name: build.cpu_name, icon: <Cpu size={20} /> },
    { label: "Motherboard", name: build.motherboard_name, icon: <Layout size={20} /> },
    { label: "Graphics Card", name: build.gpu_name, icon: <Monitor size={20} /> },
    { label: "Memory", name: build.ram_name, icon: <Zap size={20} /> },
    { label: "Storage", name: build.storage_name, icon: <HardDrive size={20} /> },
    { label: "Power Supply", name: build.psu_name, icon: <Zap size={20} /> },
    { label: "Chassis", name: build.case_name, icon: <Box size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto">
        <header className="mb-12">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-white transition-colors mb-8 border-b border-gray-100 dark:border-white/5 pb-1">
                <ArrowLeft size={14} /> Back to Archives
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter mb-2 italic leading-none">{build.title}</h1>
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Monitor size={12} /> {build.user_name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>REF: {build.id.toString().padStart(4, '0')}</span>
                    </div>
                </div>
                <div className="bg-blue-600 text-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)]">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Final Total</p>
                    <p className="text-3xl font-black font-mono">Rs. {build.total_price_pkr?.toLocaleString()}</p>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-4">
                <div className="border-2 border-black dark:border-white/10 p-8 bg-gray-50 dark:bg-slate-900/50">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-blue-600 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/30 pb-2">Manifest Components</h2>
                    <div className="space-y-6">
                        {components.map((comp, idx) => (
                            <div key={idx} className="flex items-start gap-4 group">
                                <div className="mt-1 text-gray-300 dark:text-slate-700 group-hover:text-black dark:group-hover:text-white transition-colors">{comp.icon}</div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 italic mb-0.5">{comp.label}</p>
                                    <p className="text-base font-black uppercase tracking-tight dark:text-slate-200">{comp.name || 'Not specified'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="border-2 border-black dark:border-white/10 p-8 dark:bg-slate-900/30">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-black dark:text-white italic">Project Notes</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-bold uppercase leading-relaxed tracking-tight">
                        {build.description || "No technical notes provided for this configuration archive."}
                    </p>
                </div>

                <div className="bg-black dark:bg-slate-900 text-white p-8 border-2 border-transparent dark:border-blue-600">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-blue-400 italic">Build Status</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-800 dark:border-white/5 pb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500">Validation</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-green-500 dark:text-green-400 italic">PASSED</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-800 dark:border-white/5 pb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500">Parity</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 dark:text-blue-400 italic">SYNCED</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500">Timestamp</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-400 font-mono">
                                {new Date(build.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
