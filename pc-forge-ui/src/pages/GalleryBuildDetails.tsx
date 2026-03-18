import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Monitor, Cpu, HardDrive, Zap, Box, Layout, Bookmark, CheckCircle, History, ArrowRight, Edit3, Share2, Globe, Trash2 } from 'lucide-react';
import { fetchGalleryBuild, saveToGallery, fetchBuildTimeline, fetchVersionDiff, fetchComponents, getSessionId, updateBuild, getSharedBuild, deleteBuild } from '../api/pcforge';
import type { GalleryBuild, BuildVersion, BuildVersionDiff } from '../types/pcforge';
import { useBuild } from '../context/BuildContext';

export default function GalleryBuildDetails() {
  const { id, shareId } = useParams<{ id?: string; shareId?: string }>();
  const navigate = useNavigate();
  const { setBuild, setEditingBuildId } = useBuild();
  const [buildData, setBuildData] = useState<GalleryBuild | null>(null);
  const [timeline, setTimeline] = useState<BuildVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [diff, setDiff] = useState<BuildVersionDiff | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userStr = localStorage.getItem('pcforge_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isOwner = (user && buildData?.user_id === user.id) || (buildData?.session_id === getSessionId());

  useEffect(() => {
    async function loadData() {
      if (!id && !shareId) return;
      try {
        const data = shareId 
            ? await getSharedBuild(shareId)
            : await fetchGalleryBuild(parseInt(id!));
            
        setBuildData(data);
        
        const timelineData = await fetchBuildTimeline(data.id);
        setTimeline(timelineData);
        
        if (timelineData.length > 0) {
            setSelectedVersion(timelineData[timelineData.length - 1].version_number);
        }
      } catch (err) {
        console.error("Failed to fetch build details or timeline:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, shareId]);

  const handleVersionClick = async (vNumber: number) => {
      if (!buildData || !selectedVersion) return;
      if (vNumber === selectedVersion) {
          setDiff(null);
          return;
      }
      
      try {
          const diffData = await fetchVersionDiff(buildData.id, vNumber, timeline[timeline.length - 1].version_number);
          setDiff(diffData);
          setSelectedVersion(vNumber);
      } catch (err) {
          console.error("Failed to fetch diff:", err);
      }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handlePublish = async () => {
    if (!buildData) return;
    setIsPublishing(true);
    try {
        await updateBuild(buildData.id, {
            ...buildData,
            is_public: true,
            version_label: "Published to Gallery"
        } as any);
        setBuildData({ ...buildData, is_public: true });
        alert("Build is now live in the public gallery!");
    } catch (err) {
        console.error("Publish failed:", err);
        alert("Failed to publish build.");
    } finally {
        setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!buildData) return;
    if (!confirm("Are you sure you want to permanently delete this build and all its version history?")) return;
    
    setIsDeleting(true);
    try {
        await deleteBuild(buildData.id);
        alert("Build deleted successfully.");
        navigate('/saved-builds');
    } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete build.");
    } finally {
        setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!buildData) return;
    setLoading(true);
    try {
        const categories = [
            { key: 'cpu', id: buildData.cpu_id },
            { key: 'motherboard', id: buildData.motherboard_id },
            { key: 'ram', id: buildData.ram_id },
            { key: 'gpu', id: buildData.gpu_id },
            { key: 'psu', id: buildData.psu_id },
            { key: 'case', id: buildData.case_id },
            { key: 'storage', id: buildData.storage_id },
        ];

        const newBuildState: any = {};
        for (const cat of categories) {
            const components = await fetchComponents(cat.key);
            const found = components.find(c => (c.id || c.product_id) === cat.id);
            if (found) {
                newBuildState[cat.key] = found;
            }
        }

        setBuild(newBuildState);
        // Only set editing ID if the current user is the owner.
        // If not owner, it will save as a NEW build for the current user.
        if (isOwner) {
            setEditingBuildId(buildData.id);
        } else {
            setEditingBuildId(null);
        }
        navigate('/builder');
    } catch (err) {
        console.error("Failed to load build for editing:", err);
        alert("Failed to initialize editor.");
    } finally {
        setLoading(false);
    }
  };

  const handleSaveToMyBuilds = async () => {
    if (!buildData) return;
    setIsSaving(true);
    try {
      await saveToGallery({
        title: `Copy of ${buildData.title}`,
        description: buildData.description,
        cpu_id: buildData.cpu_id,
        motherboard_id: buildData.motherboard_id,
        ram_id: buildData.ram_id,
        gpu_id: buildData.gpu_id,
        psu_id: buildData.psu_id,
        case_id: buildData.case_id,
        storage_id: buildData.storage_id,
        user_id: user?.id,
        user_name: user?.username || "Anonymous",
        total_price_pkr: buildData.total_price_pkr,
        is_public: false
      });
      setSaved(true);
      setTimeout(() => navigate('/saved-builds'), 1500);
    } catch (err) {
      console.error("Failed to save build copy:", err);
      alert("Failed to save build to your collection.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-8 transition-colors duration-300">
        <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-600 italic">Processing Data Stream...</p>
      </div>
    );
  }

  if (!buildData) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center transition-colors duration-300">
        <h1 className="text-4xl font-black uppercase mb-4 italic dark:text-white">Build Not Found</h1>
        <Link to="/gallery" className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs underline decoration-2 underline-offset-4">Return to Archives</Link>
      </div>
    );
  }

  const components = [
    { label: "Processor", name: buildData.cpu_name, icon: <Cpu size={20} /> },
    { label: "Motherboard", name: buildData.motherboard_name, icon: <Layout size={20} /> },
    { label: "Graphics Card", name: buildData.gpu_name, icon: <Monitor size={20} /> },
    { label: "Memory", name: buildData.ram_name, icon: <Zap size={20} /> },
    { label: "Storage", name: buildData.storage_name, icon: <HardDrive size={20} /> },
    { label: "Power Supply", name: buildData.psu_name, icon: <Zap size={20} /> },
    { label: "Chassis", name: buildData.case_name, icon: <Box size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-12">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-white transition-colors mb-8 border-b border-gray-100 dark:border-white/5 pb-1">
                <ArrowLeft size={14} /> Back to Archives
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter mb-2 italic leading-none">{buildData.title}</h1>
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Monitor size={12} /> {buildData.user_name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>REF: {buildData.id.toString().padStart(4, '0')}</span>
                    </div>
                </div>
                <div className="bg-blue-600 text-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)]">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Final Total</p>
                    <p className="text-3xl font-black font-mono">Rs. {buildData.total_price_pkr?.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-4">
                {isOwner && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all bg-white dark:bg-slate-900 text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white shadow-[8px_8px_0px_0px_rgba(220,38,38,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Delete Build
                    </button>
                )}

                <button
                    onClick={handleShare}
                    className="flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-white/10 hover:border-blue-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                    <Share2 size={16} /> {shareCopied ? "Link Copied!" : "Share Build"}
                </button>

                {buildData && !buildData.is_public && (
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all bg-blue-600 text-white hover:bg-black shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                        {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                        Publish to Gallery
                    </button>
                )}

                <button
                    onClick={handleEdit}
                    className="flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black dark:border-white/10 hover:border-blue-600 dark:hover:border-blue-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                    <Edit3 size={16} /> Edit Build
                </button>

                {!isOwner && (
                    <button
                        onClick={handleSaveToMyBuilds}
                        disabled={isSaving || saved}
                        className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                            saved 
                            ? 'bg-green-600 text-white' 
                            : 'bg-black dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
                        }`}
                    >
                        {isSaving ? (
                            <><Loader2 size={16} className="animate-spin" /> Archiving...</>
                        ) : saved ? (
                            <><CheckCircle size={16} /> Saved to Collection</>
                        ) : (
                            <><Bookmark size={16} /> Save to My Builds</>
                        )}
                    </button>
                )}
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
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

                {diff && Object.keys(diff).length > 0 && (
                <div className="border-2 border-blue-600 p-8 bg-white dark:bg-slate-900">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-blue-600 border-b border-blue-100 dark:border-blue-900/30 pb-2 flex items-center gap-2">
                        <ArrowRight size={14} /> Version Differences (v{timeline[timeline.length-1].version_number} → v{selectedVersion})
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(diff).map(([comp, changes]) => (
                            <div key={comp} className="border-l-4 border-blue-600 pl-4 py-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 italic mb-1">{comp}</p>
                                <div className="flex flex-col gap-1">
                                    {changes.old && (
                                        <div className="flex items-center gap-2 text-red-500 text-xs font-mono line-through opacity-70">
                                            <span className="w-16">Removed:</span> {changes.old}
                                        </div>
                                    )}
                                    {changes.new && (
                                        <div className="flex items-center gap-2 text-green-500 text-xs font-mono font-bold">
                                            <span className="w-16">Added:</span> {changes.new}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}
            </div>

            <div className="space-y-8">
                <div className="border-2 border-black dark:border-white/10 p-8 dark:bg-slate-900/30">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-black dark:text-white italic">Project Notes</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-bold uppercase leading-relaxed tracking-tight">
                        {buildData.description || "No technical notes provided for this configuration archive."}
                    </p>
                </div>

                {timeline.length > 0 && (
                <div className="border-2 border-black dark:border-white/10 p-8 bg-gray-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-white/10 pb-2">
                        <History size={16} className="text-blue-600 dark:text-blue-400" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 italic">Version Timeline</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {timeline.map((version, index) => (
                            <div 
                                key={version.version_id} 
                                onClick={() => handleVersionClick(version.version_number)}
                                className={`flex flex-col border-l-2 pl-4 py-1 cursor-pointer transition-all ${
                                    selectedVersion === version.version_number 
                                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' 
                                    : 'border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30'
                                }`}
                            >
                                <span className="text-[11px] font-black uppercase tracking-tight text-black dark:text-white flex items-center gap-2">
                                    v{version.version_number}
                                    {index === timeline.length - 1 && <span className="bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-sm">LATEST</span>}
                                </span>
                                <span className="text-[9px] text-gray-500 dark:text-slate-400 font-bold italic">{version.label || 'Snapshot'}</span>
                                <span className="text-[8px] text-gray-400 font-mono mt-1">{new Date(version.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
                )}

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
                                {new Date(buildData.created_at).toLocaleDateString()}
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
