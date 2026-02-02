import { useNavigate } from "react-router-dom";
import PriceSummary from "../components/PriceSummary";
import { useBuild } from "../context/BuildContext";
import { Plus, Check, ArrowRight, RotateCcw } from "lucide-react";

export default function Builder() {
  const navigate = useNavigate();
  const { build, clearBuild } = useBuild();

  // Extract selected components from global build state
  const cpu = build.cpu;
  const motherboard = build.motherboard;
  const ram = build.ram;
  const storage = build.storage;
  const chassis = build.case;
  const gpu = build.gpu;
  const psu = build.psu;

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your current build?")) {
        clearBuild();
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
              params: (cpu?.product_id || (cpu as any)?.id) ? `&cpu_id=${cpu?.product_id || (cpu as any)?.id}` : "",
              icon: "03",
              required: ["cpu"]
          },
          { 
              label: "Memory (RAM)", 
              category: "ram", 
              value: ram, 
              params: (motherboard?.product_id || (motherboard as any)?.id) ? `&motherboard_id=${motherboard?.product_id || (motherboard as any)?.id}` : "",
              icon: "04",
              required: ["motherboard"]
          },
          { 
              label: "Storage", 
              category: "storage", 
              value: storage, 
              params: (motherboard?.product_id || (motherboard as any)?.id) ? `&motherboard_id=${motherboard?.product_id || (motherboard as any)?.id}` : "",
              icon: "05",
              required: ["motherboard"]
          },
          { 
              label: "Power Supply", 
              category: "psu", 
              value: psu, 
              params: (cpu?.product_id || (cpu as any)?.id) && (gpu?.product_id || (gpu as any)?.id) 
                  ? `&cpu_id=${cpu?.product_id || (cpu as any)?.id}&gpu_id=${gpu?.product_id || (gpu as any)?.id}` 
                  : "",
              icon: "06",
              required: ["cpu", "gpu"]
          },
          { 
              label: "Chassis (Case)", 
              category: "case", 
              value: chassis, 
              params: (motherboard?.product_id || (motherboard as any)?.id) 
                  ? `&motherboard_id=${motherboard?.product_id || (motherboard as any)?.id}${gpu?.product_id || (gpu as any)?.id ? `&gpu_id=${gpu?.product_id || (gpu as any)?.id}` : ""}` 
                  : "",
              icon: "07",
              required: ["motherboard", "gpu"]
          }    ];
  
    const summaryItems = slots
      .filter(s => s.value)
      .map(s => ({
          id: s.value?.product_id || (s.value as any)?.id || "unknown",
          name: s.value?.product_name || (s.value as any)?.name || "Unknown Component",
          price: s.value?.price_pkr,
          category: s.label
      }));
  
    const totalPrice = summaryItems.reduce((sum, item) => sum + (item.price || 0), 0);
  
    return (
      <div className="min-h-screen bg-white text-black p-4 md:p-8 font-sans">
        <div className="max-w-[1400px] mx-auto">
          <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="flex-1">
                  <h1 className="text-6xl font-black text-black uppercase tracking-tighter mb-4 italic leading-none">CONFIGURATOR</h1>
                  <div className="h-2 w-32 bg-blue-600 mb-6"></div>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Architectural Hardware Assembly System v.04</p>
              </div>
              <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors border-b border-gray-100 pb-1"
              >
                  <RotateCcw size={14} /> Reset Configuration
              </button>
          </header>
  
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8 space-y-4">
                  {slots.map((slot) => {
                      const isLocked = slot.required.some(req => !build[req]);
  
                      return (
                          <div key={slot.category} className={`group relative border-2 transition-all p-6 ${
                              slot.value ? 'border-black bg-gray-50' :
                              isLocked ? 'border-gray-50 bg-white opacity-40 grayscale pointer-events-none' : 'border-gray-100 bg-white hover:border-gray-300'
                          }`}>
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                  <div className="flex items-start gap-6">
                                      <div className={`w-12 h-12 flex items-center justify-center font-black text-sm border-2 ${slot.value ? 'bg-black text-white border-black' : 'bg-white text-gray-200 border-gray-100'}`}>
                                          {slot.icon}
                                      </div>
                                      <div>
                                          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${slot.value ? 'text-blue-600' : 'text-gray-300'}`}>
                                              {slot.label}
                                          </h3>
                                          {slot.value ? (
                                              <div className="space-y-1">
                                                  <div className="text-sm font-black uppercase leading-tight">{slot.value?.product_name || (slot.value as any)?.name}</div>
                                                  <div className="text-[10px] font-bold text-gray-400 font-mono italic">
                                                      ID: {(slot.value?.product_id || (slot.value as any)?.id || "").substring(0, 8)}... • Rs. {slot.value?.price_pkr?.toLocaleString()}
                                                  </div>
                                              </div>
                                          ) : (
                                              <div className="text-sm font-bold text-gray-200 uppercase tracking-tight italic">
                                                  {isLocked ? `Complete Step ${slot.icon} Required` : 'Awaiting Component Selection'}
                                              </div>
                                          )}
                                      </div>
                                  </div>
  
                                  <button
                                      onClick={() => navigate(`/components?category=${slot.category}${slot.params}`)}
                                      disabled={isLocked}
                                      className={`flex items-center justify-center gap-2 py-3 px-8 text-[10px] font-black uppercase tracking-widest transition-all ${
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
                                  <div className="absolute -right-2 -top-2 w-6 h-6 bg-blue-600 text-white flex items-center justify-center shadow-lg">
                                      <Check size={14} strokeWidth={4} />
                                  </div>
                              )}
                          </div>
                      );
                  })}
              </div>
            <div className="lg:col-span-4 sticky top-24">
                <PriceSummary items={summaryItems} total={totalPrice} />
                
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
      </div>
    </div>
  );
}