import { useEffect, useState } from "react";
import { fetchGPUs } from "../api/pcforge";
import type { GPU } from "../types/pcforge";

interface Props {
  caseId: string | null;
  selectedId: string | null;
  onSelect: (gpu: GPU) => void;
}

export default function GpuSelect({ caseId, selectedId, onSelect }: Props) {
  const [gpus, setGpus] = useState<GPU[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!caseId) {
      setGpus([]);
      return;
    }

    setLoading(true);
    fetchGPUs(caseId)
      .then((data) => setGpus(data.gpus))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [caseId]);

  if (!caseId) return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 border-dashed text-center">
        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Select a Case first</span>
    </div>
  );
  
  if (loading) return <div className="text-center p-6 animate-pulse text-slate-500 text-sm font-black uppercase">Loading GPUs...</div>;

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
      <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-sm text-[10px]">6</span>
        Select GPU
      </h2>
      <select
        value={selectedId || ""}
        onChange={(e) => {
            const gpu = gpus.find(g => g.product_id === e.target.value);
            if (gpu) onSelect(gpu);
        }}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white text-base font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase tracking-wide cursor-pointer appearance-none"
      >
        <option value="" className="bg-slate-900">-- Choose Video Card --</option>
        {gpus.map((gpu) => (
          <option key={gpu.product_id} value={gpu.product_id} className="bg-slate-900 text-white text-sm">
            {gpu.product_name} ({gpu.chipset}, {gpu.vram_gb}GB)
          </option>
        ))}
      </select>
    </div>
  );
}
