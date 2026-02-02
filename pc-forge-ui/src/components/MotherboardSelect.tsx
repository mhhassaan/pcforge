import { useEffect, useState } from "react";
import { fetchMotherboards } from "../api/pcforge";
import type { Motherboard } from "../types/pcforge";

interface Props {
  cpuId: string | null;
  selectedId: string | null;
  onSelect: (mb: Motherboard) => void;
}

export default function MotherboardSelect({ cpuId, selectedId, onSelect }: Props) {
  const [mbs, setMbs] = useState<Motherboard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cpuId) {
      setMbs([]);
      return;
    }

    setLoading(true);
    fetchMotherboards(cpuId)
      .then((data) => setMbs(data.motherboards))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [cpuId]);

  if (!cpuId) return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 border-dashed text-center">
        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Select a CPU first</span>
    </div>
  );
  
  if (loading) return <div className="text-center p-6 animate-pulse text-slate-500 text-sm font-black uppercase">Loading Motherboards...</div>;

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
      <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-sm text-[10px]">2</span>
        Select Motherboard
      </h2>
      <select
        value={selectedId || ""}
        onChange={(e) => {
            const mb = mbs.find(m => m.product_id === e.target.value);
            if (mb) onSelect(mb);
        }}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white text-base font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase tracking-wide cursor-pointer appearance-none"
      >
        <option value="" className="bg-slate-900">-- Choose Motherboard --</option>
        {mbs.map((mb) => (
          <option key={mb.product_id} value={mb.product_id} className="bg-slate-900 text-white text-sm">
            {mb.product_name} ({mb.form_factor}) {mb.price_pkr ? `• Rs. ${mb.price_pkr.toLocaleString()}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
