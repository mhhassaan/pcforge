import { useEffect, useState } from "react";
import { fetchStorage } from "../api/pcforge";
import type { Storage } from "../types/pcforge";

interface Props {
  motherboardId: string | null;
  selectedId: string | null;
  onSelect: (storage: Storage) => void;
}

export default function StorageSelect({ motherboardId, selectedId, onSelect }: Props) {
  const [storageList, setStorageList] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!motherboardId) {
      setStorageList([]);
      return;
    }

    setLoading(true);
    fetchStorage(motherboardId)
      .then((data) => setStorageList(data.storage))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [motherboardId]);

  if (!motherboardId) return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 border-dashed text-center h-full flex items-center justify-center">
        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Select Motherboard first</span>
    </div>
  );
  
  if (loading) return <div className="text-center p-6 animate-pulse text-slate-500 text-sm font-black uppercase">Loading Storage...</div>;

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
      <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-sm text-[10px]">4</span>
        Select Storage
      </h2>
      <select
        value={selectedId || ""}
        onChange={(e) => {
            const storage = storageList.find(s => s.product_id === e.target.value);
            if (storage) onSelect(storage);
        }}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white text-base font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase tracking-wide cursor-pointer appearance-none"
      >
        <option value="" className="bg-slate-900">-- Choose Drive --</option>
        {storageList.map((storage) => (
          <option key={storage.product_id} value={storage.product_id} className="bg-slate-900 text-white text-sm">
            {storage.product_name} ({storage.capacity_gb}GB)
          </option>
        ))}
      </select>
    </div>
  );
}
