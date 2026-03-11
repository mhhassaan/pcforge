
interface SummaryItem {
    id: string;
    name: string;
    price: number | null;
    category: string;
}

interface Props {
  items: SummaryItem[];
  total: number;
  onSave?: () => void;
  isComplete?: boolean;
}

export default function PriceSummary({ items, total, onSave, isComplete }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white/10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.1)] overflow-hidden transition-colors">
          <div className="bg-gray-50 dark:bg-slate-950 border-b-2 border-black dark:border-white/10 p-4 text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-500 font-black flex justify-between">
            <span>Manifest Summary</span>
            <span>Estimated Price</span>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {items.length === 0 ? (
                <div className="p-8 text-center text-gray-300 dark:text-slate-700 font-black uppercase tracking-widest italic text-[10px]">
                    No components selected
                </div>
            ) : (
                items.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="font-black text-black dark:text-white uppercase tracking-tight text-[11px] md:text-xs truncate">{item.name}</div>
                            <div className="text-[9px] text-gray-400 dark:text-slate-500 font-black uppercase mt-0.5 italic">{item.category}</div>
                        </div>
                        <div className="text-right font-black text-blue-600 dark:text-blue-400 font-mono text-[11px] md:text-xs whitespace-nowrap">
                            {item.price ? `Rs. ${item.price.toLocaleString()}` : 'N/A'}
                        </div>
                    </div>
                ))
            )}
          </div>
      </div>

      <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 md:p-8 border-2 border-black dark:border-blue-600 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)] transition-colors">
          <div className="text-center md:text-left">
              <h3 className="text-[9px] md:text-[10px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-widest mb-1 italic">Project Total</h3>
              <p className="text-3xl md:text-4xl font-black text-black dark:text-white font-mono tracking-tighter italic transition-colors">Rs. {total.toLocaleString()}</p>
          </div>
          <button 
            disabled={!isComplete}
            onClick={onSave}
            className={`font-black py-4 md:py-5 px-8 rounded-none uppercase tracking-widest text-[10px] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                isComplete 
                ? 'bg-blue-600 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white cursor-pointer' 
                : 'bg-gray-100 dark:bg-slate-950 text-gray-300 dark:text-slate-800 cursor-not-allowed border-gray-200 dark:border-white/5'
            }`}
          >
              {isComplete ? 'Publish to Gallery' : 'Steps Incomplete'}
          </button>
      </div>
    </div>
  );
}
