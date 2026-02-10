
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
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="bg-gray-50 border-b-2 border-black p-4 text-[10px] uppercase tracking-widest text-gray-400 font-black flex justify-between">
            <span>Manifest Summary</span>
            <span>Estimated Price</span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {items.length === 0 ? (
                <div className="p-8 text-center text-gray-300 font-black uppercase tracking-widest italic text-[10px]">
                    No components selected
                </div>
            ) : (
                items.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="font-black text-black uppercase tracking-tight text-[11px] md:text-xs truncate">{item.name}</div>
                            <div className="text-[9px] text-gray-400 font-black uppercase mt-0.5 italic">{item.category}</div>
                        </div>
                        <div className="text-right font-black text-blue-600 font-mono text-[11px] md:text-xs whitespace-nowrap">
                            {item.price ? `Rs. ${item.price.toLocaleString()}` : 'N/A'}
                        </div>
                    </div>
                ))
            )}
          </div>
      </div>

      <div className="flex flex-col gap-4 bg-white p-6 md:p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
          <div className="text-center md:text-left">
              <h3 className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 italic">Project Total</h3>
              <p className="text-3xl md:text-4xl font-black text-black font-mono tracking-tighter italic">Rs. {total.toLocaleString()}</p>
          </div>
          <button 
            disabled={!isComplete}
            onClick={onSave}
            className={`font-black py-4 md:py-5 px-8 rounded-none uppercase tracking-widest text-[10px] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                isComplete 
                ? 'bg-blue-600 hover:bg-black text-white cursor-pointer' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200'
            }`}
          >
              {isComplete ? 'Publish to Gallery' : 'Steps Incomplete'}
          </button>
      </div>
    </div>
  );
}
