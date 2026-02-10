import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PriceSummary from "../components/PriceSummary";
import { useBuild } from "../context/BuildContext";
import { Plus, ArrowRight, RotateCcw, X, Loader2 } from "lucide-react";
import { saveToGallery } from "../api/pcforge";

export default function Builder() {
  const navigate = useNavigate();
  const { build, removeComponent, clearBuild } = useBuild();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    user_name: "",
    description: ""
  });

  // Extract selected components from global build state
  const cpu = build.cpu;
  const motherboard = build.motherboard;
  const ram = build.ram;
  const storage = build.storage;
  const chassis = build.case;
  const gpu = build.gpu;
  const psu = build.psu;

  const isComplete = !!(cpu && motherboard && ram && storage && chassis && gpu && psu);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your current build?")) {
        clearBuild();
    }
  };

  const handleRemove = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(category);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    
    setIsSaving(true);
    try {
        await saveToGallery({
            title: formData.title || "Untitled Masterpiece",
            user_name: formData.user_name || "Anonymous",
            description: formData.description,
            cpu_id: (cpu?.id || cpu?.product_id) as string,
            motherboard_id: (motherboard?.id || motherboard?.product_id) as string,
            ram_id: (ram?.id || ram?.product_id) as string,
            gpu_id: (gpu?.id || gpu?.product_id) as string,
            psu_id: (psu?.id || psu?.product_id) as string,
            case_id: (chassis?.id || chassis?.product_id) as string,
            storage_id: (storage?.id || storage?.product_id) as string,
            total_price_pkr: totalPrice
        });
        alert("Build published successfully!");
        navigate("/gallery");
    } catch (err) {
        console.error("Save failed:", err);
        alert("Failed to save build. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };

    const slots = [
          { 
              label: "Processor", 
              category: "cpu", 
              value: cpu, 
              params: "",
              icon: "01",
              required: []
          },
          { 
              label: "Graphics Card", 
              category: "gpu", 
              value: gpu, 
              params: "",
              icon: "02",
              required: ["cpu"]
          },
                    {
                        label: "Motherboard",
                        category: "motherboard",
                        value: motherboard,
                        params: (cpu?.id || cpu?.product_id) ? `&cpu_id=${cpu?.id || cpu?.product_id}` : "",
                        icon: "03",
                        required: ["cpu"]
                    },
                    {
                        label: "Memory (RAM)",
                        category: "ram",
                        value: ram,
                        params: (motherboard?.id || motherboard?.product_id) ? `&motherboard_id=${motherboard?.id || motherboard?.product_id}` : "",
                        icon: "04",
                        required: ["motherboard"]
                    },
                    {
                        label: "Storage",
                        category: "storage",
                        value: storage,
                        params: (motherboard?.id || motherboard?.product_id) ? `&motherboard_id=${motherboard?.id || motherboard?.product_id}` : "",
                        icon: "05",
                        required: ["motherboard"]
                    },
                    {
                        label: "Power Supply",
                        category: "psu",
                        value: psu,
                        params: (cpu?.id || cpu?.product_id) && (gpu?.id || gpu?.product_id) 
                            ? `&cpu_id=${cpu?.id || cpu?.product_id}&gpu_id=${gpu?.id || gpu?.product_id}` 
                            : "",
                        icon: "06",
                        required: ["cpu", "gpu"]
                    },
                    {
                        label: "Chassis (Case)",
                        category: "case",
                        value: chassis,
                        params: (motherboard?.id || motherboard?.product_id) 
                            ? `&motherboard_id=${motherboard?.id || motherboard?.product_id}${gpu?.id || gpu?.product_id ? `&gpu_id=${gpu?.id || gpu?.product_id}` : ""}` 
                            : "",
                        icon: "07",
                        required: ["motherboard", "gpu"]
                    }    ];
            
              const summaryItems = slots
                .filter(s => s.value)
                .map(s => ({
                    id: s.value?.id || s.value?.product_id || "unknown",
                    name: s.value?.name || s.value?.product_name || "Unknown Component",
                    price: s.value?.price_pkr ?? null,
                    category: s.label
                }));  
    const totalPrice = summaryItems.reduce((sum, item) => sum + (item.price || 0), 0);
  
    return (
      <div className="min-h-screen bg-white text-black p-3 md:p-8 font-sans overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto">
          <header className="mb-8 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex-1 min-w-0">
                  <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter mb-4 italic leading-none break-words">CONFIGURATOR</h1>
                  <div className="h-2 w-32 bg-blue-600 mb-6"></div>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]">Architectural Hardware Assembly System v.04</p>
              </div>
              <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors border-b border-gray-100 pb-1"
              >
                  <RotateCcw size={14} /> Reset Configuration
              </button>
          </header>
  
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="lg:col-span-8 space-y-4">
                  {slots.map((slot) => {
                      const isLocked = slot.required.some(req => !build[req]);
  
                      return (
                          <div key={slot.category} className={`group relative border-2 transition-all p-4 md:p-6 ${
                              slot.value ? 'border-black bg-gray-50' :
                              isLocked ? 'border-gray-50 bg-white opacity-40 grayscale pointer-events-none' : 'border-gray-100 bg-white hover:border-gray-300'
                          }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                                  <div className="flex items-start gap-4 md:gap-6 min-w-0">
                                      <div className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center font-black text-xs md:text-sm border-2 ${slot.value ? 'bg-black text-white border-black' : 'bg-white text-gray-200 border-gray-100'}`}>
                                          {slot.icon}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                          <h3 className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${slot.value ? 'text-blue-600' : 'text-gray-300'}`}>
                                              {slot.label}
                                          </h3>
                                          {slot.value ? (
                                              <div className="space-y-1">
                                                  <div className="text-sm md:text-base font-black uppercase leading-tight truncate">{slot.value.name || slot.value.product_name}</div>
                                                  <div className="text-[9px] md:text-[11px] font-bold text-gray-400 font-mono italic">
                                                      ID: {(slot.value.id || slot.value.product_id || "").substring(0, 8)}... • Rs. {slot.value.price_pkr?.toLocaleString()}
                                                  </div>
                                              </div>
                                          ) : (
                                              <div className="text-sm md:text-base font-bold text-gray-200 uppercase tracking-tight italic">
                                                  {isLocked ? `Step ${slot.icon} Required` : 'Awaiting Selection'}
                                              </div>
                                          )}
                                      </div>
                                  </div>
  
                                  <button
                                      onClick={() => navigate(`/components?category=${slot.category}${slot.params}`)}
                                      disabled={isLocked}
                                      className={`flex items-center justify-center gap-2 py-3 px-6 md:px-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                                          slot.value
                                          ? 'bg-white border border-black text-black hover:bg-black hover:text-white'
                                          : 'bg-black text-white hover:bg-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
                                      }`}
                                  >
                                      {slot.value ? (
                                          <>Change <ArrowRight size={14} /></>
                                      ) : (
                                          <>Select <Plus size={14} /></>
                                      )}
                                  </button>
                              </div>
  
                              {slot.value && (
                                  <button 
                                    onClick={(e) => handleRemove(slot.category, e)}
                                    className="absolute -right-2 -top-2 w-6 h-6 bg-white border-2 border-black text-black hover:bg-red-600 hover:text-white flex items-center justify-center shadow-lg transition-colors group/remove"
                                    title={`Remove ${slot.label}`}
                                  >
                                      <X size={14} strokeWidth={4} />
                                  </button>
                              )}
                          </div>
                      );
                  })}
              </div>
                        <div className="lg:col-span-4 sticky top-24">
                            <PriceSummary 
                                items={summaryItems} 
                                total={totalPrice} 
                                isComplete={isComplete}
                                onSave={() => setShowSaveModal(true)}
                            />
                            
                            <div className="mt-8 p-8 border-2 border-black border-dashed bg-gray-50/50">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center italic">Compatibility Core</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                        System Parity Active
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-tight">
                                        Hardware selection is context-aware. The explorer automatically restricts results to components compatible with your existing assembly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    {/* Save Build Modal */}
                    {showSaveModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm p-4">
                            <div className="bg-white border-4 border-black w-full max-w-lg shadow-[16px_16px_0px_0px_rgba(37,99,235,1)]">
                                <div className="flex justify-between items-center p-6 border-b-4 border-black bg-black text-white">
                                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Archive Build</h2>
                                    <button onClick={() => setShowSaveModal(false)} className="hover:text-blue-400 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSave} className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Build Title</label>
                                        <input 
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            placeholder="e.g., The Silent Architect"
                                            className="w-full border-2 border-black p-4 text-sm font-black uppercase tracking-tight focus:bg-gray-50 outline-none"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Builder Name</label>
                                        <input 
                                            type="text"
                                            value={formData.user_name}
                                            onChange={e => setFormData({...formData, user_name: e.target.value})}
                                            placeholder="Your Username"
                                            className="w-full border-2 border-black p-4 text-sm font-black uppercase tracking-tight focus:bg-gray-50 outline-none"
                                        />
                                    </div>
            
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Project Notes</label>
                                        <textarea 
                                            rows={3}
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            placeholder="Describe your configuration choices..."
                                            className="w-full border-2 border-black p-4 text-sm font-black uppercase tracking-tight focus:bg-gray-50 outline-none resize-none"
                                        />
                                    </div>
            
                                    <button 
                                        disabled={isSaving}
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-black text-white font-black py-5 uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3"
                                    >
                                        {isSaving ? (
                                            <><Loader2 size={16} className="animate-spin" /> Publishing...</>
                                        ) : (
                                            'Commit to Archive'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              );
            }
            