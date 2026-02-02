
interface SummaryItem {
    id: string;
    name: string;
    price: number | null;
    category: string;
}

interface Props {
  items: SummaryItem[];
  total: number;
}

export default function PriceSummary({ items, total }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                <th className="p-4">Component</th>
                <th className="p-4 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-xs">
              {items.length === 0 ? (
                <tr>
                    <td colSpan={2} className="p-8 text-center text-slate-600 font-black uppercase tracking-widest">
                        No components selected
                    </td>
                </tr>
              ) : (
                items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                        <div className="font-bold text-white uppercase tracking-tight">{item.name}</div>
                        <div className="text-[9px] text-slate-500 font-black uppercase mt-0.5">{item.category}</div>
                    </td>
                    <td className="p-4 text-right font-bold text-blue-400 font-mono">
                        {item.price ? `Rs. ${item.price.toLocaleString()}` : 'N/A'}
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div>
              <h3 className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1 text-center md:text-left">Estimated Build Total</h3>
              <p className="text-4xl font-black text-blue-500 font-mono tracking-tighter">Rs. {total.toLocaleString()}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-lg shadow-lg shadow-blue-900/30 uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 w-full md:w-auto">
              Confirm & Save Build
          </button>
      </div>
    </div>
  );
}
