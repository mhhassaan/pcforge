import type { Component } from '../types/pcforge';
import { useBuild } from '../context/BuildContext';

interface ComponentGridProps {
  components: Component[];
  selectedId: string | null;
  onSelect: (component: Component) => void;
  onAddOverride?: (component: Component) => void;
}

export default function ComponentGrid({ components, selectedId, onSelect, onAddOverride }: ComponentGridProps) {
  const { addComponent } = useBuild();

  const handleAdd = (component: Component, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddOverride) onAddOverride(component);
    else addComponent(component);
  };

  if (components.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 uppercase font-black tracking-widest text-[10px]">
        No compatible hardware found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {components.map((component) => (
        <div 
          key={component.id} 
          className={`bg-white rounded-none border transition-all cursor-pointer group flex flex-col ${
            selectedId === component.id 
            ? 'border-blue-600 ring-1 ring-blue-600 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]' 
            : 'border-black hover:border-blue-600'
          }`}
          onClick={() => onSelect(component)}
        >
          <div className="aspect-[4/1] bg-gray-50 relative rounded-none overflow-hidden border-b border-gray-100">
            {component.image_url ? (
              <img 
                src={component.image_url} 
                alt={component.name}
                className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity p-2"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
              {component.category}
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-black text-[10px] text-black mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
              {component.name}
            </h3>
            
            <div className="space-y-1.5 mb-4 flex-1">
                {Object.entries(component.specs || {}).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-[8px] uppercase tracking-wider">
                        <span className="text-gray-400 font-black">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-black text-black truncate max-w-[60%] text-right">{String(value)}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
              <span className="text-xs font-black text-blue-600 font-mono">
                {component.price_pkr ? `RS. ${component.price_pkr.toLocaleString()}` : 'N/A'}
              </span>
              <button 
                  onClick={(e) => handleAdd(component, e)}
                  className="bg-black text-white px-3 py-1.5 rounded-none text-[9px] font-black hover:bg-blue-600 transition-colors uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                SELECT
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}