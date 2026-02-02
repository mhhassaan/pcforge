import { useEffect, useState } from "react";
import { fetchCPUs } from "../api/pcforge";
import type { CPU } from "../types/pcforge";

interface Props {
  selectedId: string | null;
  onSelect: (cpu: CPU) => void;
}

export default function CpuSelect({ selectedId, onSelect }: Props) {
  const [cpus, setCpus] = useState<CPU[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCPUs()
      .then((data) => setCpus(data.cpus))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-4 animate-pulse text-slate-500 text-xs font-black uppercase">Loading CPUs...</div>;

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
      <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-sm text-[10px]">1</span>
        Select CPU
      </h2>
      <select
        value={selectedId || ""}
        onChange={(e) => {
            const cpu = cpus.find(c => c.product_id === e.target.value);
            if (cpu) onSelect(cpu);
        }}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white text-base font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase tracking-wide cursor-pointer appearance-none"
      >
        <option value="" className="bg-slate-900">-- Choose Processor --</option>
        {cpus.map((cpu) => (
          <option key={cpu.product_id} value={cpu.product_id} className="bg-slate-900 text-white">
            {cpu.manufacturer} {cpu.product_name}
          </option>
        ))}
      </select>
    </div>
  );
}