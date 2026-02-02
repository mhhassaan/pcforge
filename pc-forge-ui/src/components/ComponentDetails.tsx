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
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50">
        <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 text-gray-300">
            <X size={32} />
        </div>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Selection</h3>
      </div>
    );
  }

  const handleAdd = () => {
    if (onAddOverride) onAddOverride(component);
    else addComponent(component);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto scrollbar-thin">
      <div className="sticky top-0 z-10 bg-white p-4 border-b border-black flex justify-between items-center">
        <h2 className="text-[10px] font-black text-black uppercase tracking-tight truncate pr-4 italic">{component.name}</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Image & Header */}
        <div className="space-y-4">
            <div className="aspect-[2/1] bg-gray-50 rounded-none overflow-hidden border border-gray-200 flex items-center justify-center p-4">
                {component.image_url ? (
                    <img src={component.image_url} alt={component.name} className="w-full h-full object-contain" />
                ) : (
                    <div className="text-gray-200 font-black text-2xl uppercase">No Image</div>
                )}
            </div>
            
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 inline-block">
                        {component.category}
                    </span>
                    <div className="text-3xl font-black text-black tracking-tighter">
                        {component.price_pkr ? `RS. ${component.price_pkr.toLocaleString()}` : 'PRICE TBD'}
                    </div>
                </div>
                <button 
                    onClick={handleAdd}
                    className="bg-black hover:bg-blue-600 text-white font-black px-6 py-3 rounded-none text-[10px] uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]"
                >
                    ADD TO BUILD
                </button>
            </div>
        </div>

        {/* Vendors */}
        <div className="space-y-3">
            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Inventory</h4>
            <div className="space-y-2">
                {(component.prices || []).map((listing, idx) => (
                    <div key={idx} className="bg-white border border-black p-3 flex items-center justify-between">
                        <div>
                            <div className="font-black text-[10px] text-black uppercase tracking-tight">{listing.vendor}</div>
                            <div className="text-[8px] font-black text-blue-600 uppercase mt-0.5">Verified Stock</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-black text-black font-mono">Rs. {listing.price.toLocaleString()}</div>
                            <a 
                                href={listing.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[9px] font-black text-gray-400 hover:text-blue-600 uppercase flex items-center justify-end gap-1 mt-0.5 transition-colors"
                            >
                                Shop <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>
                ))}
                {(!component.prices || component.prices.length === 0) && (
                    <div className="text-[10px] font-bold text-gray-300 uppercase italic">No pricing data found</div>
                )}
            </div>
        </div>

        {/* Technical Specs */}
        <div className="space-y-3 pb-10">
            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Specifications</h4>
            <div className="grid grid-cols-1 border-t border-black">
                {Object.entries(component.specs || {}).map(([key, value]) => (
                    <div key={key} className="bg-white py-3 border-b border-gray-100 flex justify-between gap-4">
                        <span className="text-[9px] uppercase font-black text-gray-400 whitespace-nowrap">{key.replace(/_/g, ' ')}</span>
                        <span className="text-[9px] text-black font-black uppercase text-right">{String(value)}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
