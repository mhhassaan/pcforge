import { useEffect, useState } from "react";
import { fetchPSUs } from "../api/pcforge";
import type { PSU } from "../types/pcforge";

interface Props {
  cpuId: string | null;
  gpuId: string | null;
  selectedId: string | null;
  onSelect: (psu: PSU) => void;
}

export default function PsuSelect({ cpuId, gpuId, selectedId, onSelect }: Props) {
  const [psus, setPsus] = useState<PSU[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cpuId || !gpuId) {
      setPsus([]);
      return;
    }

    setLoading(true);
    fetchPSUs(cpuId, gpuId)
      .then((data) => setPsus(data.psus))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [cpuId, gpuId]);

  if (!cpuId || !gpuId) return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 border-dashed text-center">
        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Select CPU and GPU first</span>
    </div>
  );
  
  if (loading) return <div className="text-center p-6 animate-pulse text-slate-500 text-sm font-black uppercase">Loading PSUs...</div>;

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
      <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-sm text-[10px]">7</span>
        Select PSU
      </h2>
      <select
        value={selectedId || ""}
        onChange={(e) => {
            const psu = psus.find(p => p.product_id === e.target.value);
            if (psu) onSelect(psu);
        }}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white text-base font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase tracking-wide cursor-pointer appearance-none"
      >
        <option value="" className="bg-slate-900">-- Choose Power Supply --</option>
        {psus.map((psu) => (
          <option key={psu.product_id} value={psu.product_id} className="bg-slate-900 text-white text-sm">
            {psu.product_name} ({psu.wattage}W)
          </option>
        ))}
      </select>
    </div>
  );
}
