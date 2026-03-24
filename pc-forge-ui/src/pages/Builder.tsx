import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PriceSummary from "../components/PriceSummary";
import { useBuild } from "../context/BuildContext";
import { Plus, ArrowRight, RotateCcw, X, Loader2, Sparkles, Store, ExternalLink } from "lucide-react";
import { saveToGallery, fetchAIRecommendation, fetchComponents, updateBuild, fetchGalleryBuild, fetchMerchantPrices, fetchComponentById } from "../api/pcforge";
import { getVendorLogo } from "../lib/vendorLogos";
import { STARTER_PRESETS } from "../lib/starterPresets";

export default function Builder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { build, addComponent, removeComponent, clearBuild, editingBuildId } = useBuild();
  const [view, setView] = useState<"config" | "merchant">("config");
  const [merchantPrices, setMerchantPrices] = useState<any[]>([]);
  const [isMerchantLoading, setIsMerchantLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  // Handle Preset Query Param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const presetParam = params.get("preset");
    if (presetParam) {
        handlePresetBuild(presetParam);
        // Clear param to prevent re-runs
        navigate("/builder", { replace: true });
    }
  }, [location.search]);

  // Handle AI Prompt from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const promptParam = params.get("prompt");
    if (promptParam && aiPrompt === promptParam && !isAiGenerating && !aiExplanation) {
      handleAIBuild();
      navigate("/builder", { replace: true });
    }
  }, [aiPrompt, location.search, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const promptParam = params.get("prompt");
    if (promptParam) {
      setAiPrompt(promptParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (view === "merchant") {
        loadMerchantPrices();
    }
  }, [view, build]);

  const loadMerchantPrices = async () => {
    const productIds = Object.values(build)
        .filter(c => !!c)
        .map(c => c!.id || c!.product_id) as string[];
    
    if (productIds.length === 0) {
        setMerchantPrices([]);
        return;
    }

    setIsMerchantLoading(true);
    try {
        const data = await fetchMerchantPrices(productIds);
        setMerchantPrices(data);
    } catch (err) {
        console.error("Failed to fetch merchant prices:", err);
    } finally {
        setIsMerchantLoading(false);
    }
  };

  const handlePresetBuild = async (presetKeyOrIds: string) => {
    setIsAiGenerating(true); // Re-use loading state
    setAiExplanation("Initializing architectural preset...");

    try {
        clearBuild(); // Reset before loading preset

        // 1. Check if it's a local preset key (budget, gaming, workstation)
        if (STARTER_PRESETS[presetKeyOrIds]) {
            const localComponents = STARTER_PRESETS[presetKeyOrIds];
            for (const comp of localComponents) {
                addComponent(comp);
            }
            setAiExplanation("Local preset loaded instantly.");
        } 
        // 2. Fallback to comma-separated IDs (for deep links)
        else {
            const productIds = presetKeyOrIds.split(",");
            for (const id of productIds) {
                if (!id) continue;
                const component = await fetchComponentById(id);
                if (component) {
                    addComponent(component);
                }
            }
            setAiExplanation("Remote configuration synchronized.");
        }
    } catch (err) {
        console.error("Failed to load preset:", err);
        alert("Failed to load preset configuration.");
    } finally {
        setIsAiGenerating(false);
    }
  };


  const cpu = build.cpu;
  const motherboard = build.motherboard;
  const ram = build.ram;
  const storage = build.storage;
  const chassis = build.case;
  const gpu = build.gpu;
  const psu = build.psu;

  const isComplete = !!(cpu && motherboard && ram && storage && chassis && gpu && psu);

  const userStr = localStorage.getItem('pcforge_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleAIBuild = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiExplanation("");
    try {
        const result = await fetchAIRecommendation(aiPrompt);
        if (result.error) {
            alert("AI Error: " + result.error);
            return;
        }
        setAiExplanation(result.explanation);
        const categories = ["cpu", "gpu", "motherboard", "psu", "ram", "storage", "case"];
        for (const cat of categories) {
            const componentId = result.components[cat];
            if (componentId) {
                const components = await fetchComponents(cat);
                const found = components.find(c => (c.id || c.product_id) === componentId);
                if (found) addComponent(found);
            }
        }
    } catch (err) {
        console.error("AI Build failed:", err);
        alert("Failed to generate AI build.");
    } finally {
        setIsAiGenerating(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your current build?")) {
        clearBuild();
    }
  };

  const handleRemove = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(category);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isComplete) return;
    
    setIsSaving(true);
    try {
        const buildPayload = {
            title: formData.title || "Untitled Masterpiece",
            user_name: user?.username || "Anonymous",
            user_id: user?.id,
            description: formData.description,
            cpu_id: (cpu?.id || cpu?.product_id) as string,
            motherboard_id: (motherboard?.id || motherboard?.product_id) as string,
            ram_id: (ram?.id || ram?.product_id) as string,
            gpu_id: (gpu?.id || gpu?.product_id) as string,
            psu_id: (psu?.id || psu?.product_id) as string,
            case_id: (chassis?.id || chassis?.product_id) as string,
            storage_id: (storage?.id || storage?.product_id) as string,
            total_price_pkr: totalPrice,
            is_public: false,
            version_label: editingBuildId ? `Update: ${formData.title}` : "Initial build"
        };

        if (editingBuildId) {
            await updateBuild(editingBuildId, buildPayload);
            alert("Build updated successfully!");
        } else {
            await saveToGallery(buildPayload);
            alert("Build archived successfully!");
        }
        clearBuild();
        navigate("/saved-builds");
    } catch (err) {
        console.error("Save failed:", err);
        alert("Failed to archive build.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!isComplete) return;
    setIsSharing(true);
    try {
        const buildPayload = {
            title: formData.title || "Shared Masterpiece",
            user_name: user?.username || "Anonymous",
            user_id: user?.id,
            description: formData.description,
            cpu_id: (cpu?.id || cpu?.product_id) as string,
            motherboard_id: (motherboard?.id || motherboard?.product_id) as string,
            ram_id: (ram?.id || ram?.product_id) as string,
            gpu_id: (gpu?.id || gpu?.product_id) as string,
            psu_id: (psu?.id || psu?.product_id) as string,
            case_id: (chassis?.id || chassis?.product_id) as string,
            storage_id: (storage?.id || storage?.product_id) as string,
            total_price_pkr: totalPrice,
            is_public: false,
            version_label: editingBuildId ? `Update & Shared` : "Initial build"
        };

        let shareToken = "";
        if (editingBuildId) {
            await updateBuild(editingBuildId, buildPayload);
            const result = await fetchGalleryBuild(editingBuildId);
            shareToken = result.share_id;
        } else {
            const result = await saveToGallery(buildPayload);
            shareToken = result.share_id;
        }
        
        const shareUrl = `${window.location.origin}/build/${shareToken}`;
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
        if (!editingBuildId) {
            clearBuild();
            navigate(`/build/${shareToken}`);
        }
    } catch (err) {
        console.error("Share failed:", err);
        alert("Failed to generate share link.");
    } finally {
        setIsSharing(false);
    }
  };

  const slots = [
    { label: "Processor", category: "cpu", value: cpu, params: "", icon: "01", required: [] },
    { label: "Motherboard", category: "motherboard", value: motherboard, params: (cpu?.id || cpu?.product_id) ? `&cpu_id=${cpu?.id || cpu?.product_id}` : "", icon: "02", required: ["cpu"] },
    { label: "Graphics Card", category: "gpu", value: gpu, params: "", icon: "03", required: ["cpu"] },
    { label: "Memory (RAM)", category: "ram", value: ram, params: (motherboard?.id || motherboard?.product_id) ? `&motherboard_id=${motherboard?.id || motherboard?.product_id}` : "", icon: "04", required: ["motherboard"] },
    { label: "Storage", category: "storage", value: storage, params: (motherboard?.id || motherboard?.product_id) ? `&motherboard_id=${motherboard?.id || motherboard?.product_id}` : "", icon: "05", required: ["motherboard"] },
    { label: "Power Supply", category: "psu", value: psu, params: (cpu?.id || cpu?.product_id) && (gpu?.id || gpu?.product_id) ? `&cpu_id=${cpu?.id || cpu?.product_id}&gpu_id=${gpu?.id || gpu?.product_id}` : "", icon: "06", required: ["cpu", "gpu"] },
    { label: "Chassis (Case)", category: "case", value: chassis, params: (motherboard?.id || motherboard?.product_id) ? `&motherboard_id=${motherboard?.id || motherboard?.product_id}${gpu?.id || gpu?.product_id ? `&gpu_id=${gpu?.id || gpu?.product_id}` : ""}` : "", icon: "07", required: ["motherboard", "gpu"] }
  ];
            
  const summaryItems = slots.filter(s => s.value).map(s => ({
    id: s.value?.id || s.value?.product_id || "unknown",
    name: s.value?.name || s.value?.product_name || "Unknown Component",
    price: s.value?.price_pkr ?? null,
    category: s.label
  }));  
  const totalPrice = summaryItems.reduce((sum, item) => sum + (item.price || 0), 0);
  
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white p-3 md:p-8 font-sans overflow-x-hidden transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter italic leading-none break-words">
                    {view === "config" ? "CONFIGURATOR" : "MERCHANT PRICING"}
                  </h1>
                  {editingBuildId && (
                      <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest animate-pulse">
                          EDITING MODE
                      </span>
                  )}
                </div>
                <div className="h-2 w-32 bg-blue-600 mb-6"></div>
                
                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-slate-900 p-1 w-fit border border-black dark:border-white/10 mb-2">
                    <button 
                        onClick={() => setView("config")}
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === "config" ? "bg-black dark:bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-black dark:hover:text-white"}`}
                    >
                        Configurator
                    </button>
                    <button 
                        onClick={() => setView("merchant")}
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === "merchant" ? "bg-black dark:bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-black dark:hover:text-white"}`}
                    >
                        Price By Merchant
                    </button>
                </div>
            </div>
            <div className="flex gap-6">
              {editingBuildId && (
                  <button onClick={clearBuild} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-black dark:hover:text-white transition-colors border-b border-blue-600 dark:border-blue-400 pb-1">
                      <X size={14} /> Cancel Edit
                  </button>
              )}
              <button onClick={handleReset} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors border-b border-gray-100 dark:border-white/5 pb-1">
                  <RotateCcw size={14} /> Reset Configuration
              </button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="lg:col-span-8 space-y-4">
                {view === "config" ? (
                    <>
                        <div className="mb-8 p-6 md:p-8 border-4 border-black dark:border-blue-600 bg-gray-50 dark:bg-slate-900/40 relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={120} className="text-blue-600" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="text-blue-600 animate-pulse" size={20} />
                                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter italic">AI Forge Architect</h2>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <textarea
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="What kind of PC are we building today?"
                                        className="flex-1 bg-white dark:bg-slate-950 border-2 border-black dark:border-white/10 p-4 text-sm font-bold tracking-tight focus:border-blue-600 outline-none resize-none min-h-[80px]"
                                    />
                                    <button
                                        onClick={handleAIBuild}
                                        disabled={isAiGenerating || !aiPrompt.trim()}
                                        className="bg-black dark:bg-blue-600 text-white font-black px-8 py-4 uppercase tracking-widest text-[10px] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed h-fit"
                                    >
                                        {isAiGenerating ? <><Loader2 size={16} className="animate-spin" /> Architects Thinking...</> : <><Sparkles size={16} /> Generate Build</>}
                                    </button>
                                </div>
                                {aiExplanation && (
                                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600">
                                        <p className="text-[11px] font-bold text-blue-800 dark:text-blue-300 italic leading-relaxed">"{aiExplanation}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {slots.map((slot) => {
                            const isLocked = slot.required.some(req => !build[req]);
                            return (
                                <div key={slot.category} className={`group relative border-2 transition-all p-4 md:p-6 ${
                                    slot.value ? 'border-black dark:border-blue-600 bg-gray-50 dark:bg-slate-900/40' :
                                    isLocked ? 'border-gray-50 dark:border-white/5 bg-white dark:bg-slate-950 opacity-40 grayscale pointer-events-none' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900/20 hover:border-gray-300 dark:hover:border-blue-600'
                                }`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                                        <div className="flex items-start gap-4 md:gap-6 min-w-0">
                                            <div className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center font-black text-xs md:text-sm border-2 ${slot.value ? 'bg-black dark:bg-blue-600 text-white border-black dark:border-blue-600' : 'bg-white dark:bg-slate-950 text-gray-200 dark:text-slate-800 border-gray-100 dark:border-white/5'}`}>
                                                {slot.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${slot.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-slate-700'}`}>
                                                    {slot.label}
                                                </h3>
                                                {slot.value ? (
                                                    <div className="space-y-1">
                                                        <div className="text-sm md:text-base font-black uppercase leading-tight truncate text-black dark:text-white">{slot.value.name || slot.value.product_name}</div>
                                                        <div className="text-[9px] md:text-[11px] font-bold text-gray-400 dark:text-slate-500 font-mono italic">
                                                            ID: {(slot.value.id || slot.value.product_id || "").substring(0, 8)}... • Rs. {slot.value.price_pkr?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm md:text-base font-bold text-gray-200 dark:text-slate-800 uppercase tracking-tight italic">
                                                        {isLocked ? `Step ${slot.icon} Required` : 'Awaiting Selection'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => navigate(`/components?category=${slot.category}${slot.params}`)} disabled={isLocked} className={`flex items-center justify-center gap-2 py-3 px-6 md:px-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${slot.value ? 'bg-white dark:bg-slate-800 border border-black dark:border-white/20 text-black dark:text-white hover:bg-black dark:hover:bg-blue-600 hover:text-white' : 'bg-black dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)]'}`}>
                                            {slot.value ? <>Change <ArrowRight size={14} /></> : <>Select <Plus size={14} /></>}
                                        </button>
                                    </div>
                                    {slot.value && (
                                        <button onClick={(e) => handleRemove(slot.category, e)} className="absolute -right-2 -top-2 w-6 h-6 bg-white dark:bg-slate-900 border-2 border-black dark:border-blue-600 text-black dark:text-white hover:bg-red-600 hover:text-white flex items-center justify-center shadow-lg transition-colors group/remove">
                                            <X size={14} strokeWidth={4} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div className="space-y-8">
                        {isMerchantLoading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Querying Global Merchant Network...</p>
                            </div>
                        ) : merchantPrices.length > 0 ? (
                            merchantPrices.map(vendor => (
                                <div key={vendor.name} className="border-4 border-black dark:border-white/10 bg-white dark:bg-slate-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[12px_12px_0px_0px_rgba(37,99,235,0.1)]">
                                    <div className="bg-black dark:bg-blue-600 p-4 flex justify-between items-center text-white">
                                        <div className="flex items-center gap-3">
                                            {getVendorLogo(vendor.name) ? (
                                                <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
                                                    <img src={getVendorLogo(vendor.name)!} alt={vendor.name} className="w-full h-full object-contain" />
                                                </div>
                                            ) : (
                                                <Store size={20} />
                                            )}
                                            <h3 className="font-black uppercase tracking-tighter text-lg italic">{vendor.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black uppercase opacity-70 tracking-widest mb-0.5">Merchant Subtotal</p>
                                            <p className="text-xl font-black font-mono">Rs. {vendor.subtotal.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {vendor.items.map((item: any) => (
                                            <div key={item.product_id} className="flex items-center justify-between group border-b border-gray-100 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase text-gray-400">
                                                        {item.category.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic mb-0.5">{item.category}</p>
                                                        <p className="text-sm font-black uppercase tracking-tight text-black dark:text-white leading-tight">{item.product_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Unit Price</p>
                                                        <p className="text-sm font-black font-mono">Rs. {item.price.toLocaleString()}</p>
                                                    </div>
                                                    <a 
                                                        href={item.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 border-2 border-black dark:border-white/10 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-blue-600 transition-colors"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 border-2 border-black dark:border-white/10 border-dashed bg-gray-50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center">
                                <Store size={48} className="text-gray-300 dark:text-slate-700 mb-6" />
                                <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-[0.2em] mb-4">No Merchant Data</h2>
                                <p className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase max-w-sm">Select components in the configurator to compare pricing across different vendors.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="lg:col-span-4 sticky top-24">
                <PriceSummary 
                    items={summaryItems} 
                    total={totalPrice} 
                    isComplete={isComplete}
                    onSave={handleSave}
                    onShare={handleShare}
                    title={formData.title}
                    description={formData.description}
                    onTitleChange={(val) => setFormData({ ...formData, title: val })}
                    onDescriptionChange={(val) => setFormData({ ...formData, description: val })}
                    isSaving={isSaving}
                    isSharing={isSharing}
                />
                
                <div className="mt-8 p-8 border-2 border-black dark:border-white/10 border-dashed bg-gray-50/50 dark:bg-slate-900/20">
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 text-center italic">Compatibility Core</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
                            System Parity Active
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                            Hardware selection is context-aware. The explorer automatically restricts results to components compatible with your existing assembly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
