import { useEffect, useState } from "react";
import { fetchCases } from "../api/pcforge";
import type { Case } from "../types/pcforge";

interface Props {
  motherboardId: string | null;
  selectedId: string | null;
  onSelect: (c: Case) => void;
}

export default function CaseSelect({ motherboardId, selectedId, onSelect }: Props) {
  const [caseList, setCaseList] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!motherboardId) {
      setCaseList([]);
      return;
    }

    setLoading(true);
    fetchCases(motherboardId)
      .then((data) => setCaseList(data.cases))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [motherboardId]);

  if (!motherboardId) return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 border-dashed text-center">
        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Select Motherboard first</span>
    </div>
  );
  
  if (loading) return <div className="text-center p-6 animate-pulse text-slate-500 text-sm font-black uppercase">Loading Cases...</div>;

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
      <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-sm text-[10px]">5</span>
        Select Case
      </h2>
      <select
        value={selectedId || ""}
        onChange={(e) => {
            const c = caseList.find(item => item.product_id === e.target.value);
            if (c) onSelect(c);
        }}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white text-base font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase tracking-wide cursor-pointer appearance-none"
      >
        <option value="" className="bg-slate-900">-- Choose Chassis --</option>
        {caseList.map((c) => (
          <option key={c.product_id} value={c.product_id} className="bg-slate-900 text-white text-sm">
            {c.product_name} ({c.case_form_factor})
          </option>
        ))}
      </select>
    </div>
  );
}
