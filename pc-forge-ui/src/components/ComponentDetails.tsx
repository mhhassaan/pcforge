import type { Component } from '../types/pcforge';
import { useBuild } from '../context/BuildContext';
import { X, ExternalLink } from 'lucide-react';

interface Props {
  component: Component | null;
  onClose: () => void;
  onAddOverride?: (comp: Component) => void;
}

export default function ComponentDetails({ component, onClose, onAddOverride }: Props) {
  const { addComponent } = useBuild();

  if (!component) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-slate-900/30">
        <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 flex items-center justify-center mb-4 text-gray-300 dark:text-slate-700">
            <X size={32} />
        </div>
        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">No Selection</h3>
      </div>
    );
  }

  const handleAdd = () => {
    if (onAddOverride) onAddOverride(component);
    else addComponent(component);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] overflow-y-auto scrollbar-thin dark:scrollbar-thumb-blue-600 dark:scrollbar-track-slate-900 min-w-0">
      <div className="sticky top-0 z-10 bg-white dark:bg-[#0a0a0a] p-4 border-b border-black dark:border-white/10 flex justify-between items-center min-w-0">
        <h2 className="text-[11px] md:text-xs font-black text-black dark:text-white uppercase tracking-tight truncate pr-4">{component.name}</h2>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-none text-black dark:text-white border border-transparent hover:border-black dark:hover:border-blue-600 transition-all flex-shrink-0">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Image & Header */}
        <div className="space-y-4">
            <div className="aspect-[2/1] bg-gray-50 dark:bg-slate-900/50 rounded-none overflow-hidden border border-gray-200 dark:border-white/5 flex items-center justify-center p-4">
                {component.image_url ? (
                    <img src={component.image_url} alt={component.name} className="w-full h-full object-contain dark:invert dark:brightness-110" />
                ) : (
                    <div className="text-gray-200 dark:text-slate-800 font-black text-2xl uppercase">No Image</div>
                )}
            </div>
            
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 inline-block">
                        {component.category}
                    </span>
                    <div className="text-3xl font-black text-black dark:text-white tracking-tighter">
                        {component.price_pkr ? `RS. ${component.price_pkr.toLocaleString()}` : 'PRICE TBD'}
                    </div>
                </div>
                <button 
                    onClick={handleAdd}
                    className="bg-black dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-black px-6 py-3 rounded-none text-[10px] uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.4)]"
                >
                    ADD TO BUILD
                </button>
            </div>
        </div>

        {/* Vendors */}
        <div className="space-y-3">
            <h4 className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Live Inventory</h4>
            <div className="space-y-2">
                {(component.prices || []).map((listing, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-black dark:border-white/10 p-3 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(37,99,235,0.2)]">
                        <div>
                            <div className="font-black text-[10px] text-black dark:text-white uppercase tracking-tight">{listing.vendor}</div>
                            <div className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase mt-0.5">Verified Stock</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-black text-black dark:text-white font-mono">Rs. {listing.price.toLocaleString()}</div>
                            <a 
                                href={listing.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[9px] font-black text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase flex items-center justify-end gap-1 mt-0.5 transition-colors"
                            >
                                Shop <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>
                ))}
                {(!component.prices || component.prices.length === 0) && (
                    <div className="text-[10px] font-bold text-gray-300 dark:text-slate-700 uppercase italic">No pricing data found</div>
                )}
            </div>
        </div>

        {/* Technical Specs */}
        <div className="space-y-3 pb-10">
            <h4 className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Specifications</h4>
            <div className="grid grid-cols-1 border-t border-black dark:border-white/10">
                {Object.entries(component.specs || {}).map(([key, value]) => (
                    <div key={key} className="bg-white dark:bg-transparent py-3 border-b border-gray-100 dark:border-white/5 flex justify-between gap-4">
                        <span className="text-[9px] uppercase font-black text-gray-400 dark:text-slate-500 whitespace-nowrap">{key.replace(/_/g, ' ')}</span>
                        <span className="text-[9px] text-black dark:text-white font-black uppercase text-right">{String(value)}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
