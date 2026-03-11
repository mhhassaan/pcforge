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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4 overflow-hidden">
        {components.map((component) => (
          <div
            key={component.id}
            className={`bg-white dark:bg-slate-900 rounded-none border-2 transition-all cursor-pointer group flex flex-col min-w-0 ${
              selectedId === component.id
              ? 'border-blue-600 ring-1 ring-blue-600 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.4)]'
              : 'border-black dark:border-white/10 hover:border-blue-600 dark:hover:border-blue-500'
            }`}
            onClick={() => onSelect(component)}
          >
            <div className="aspect-square md:aspect-[3/2] bg-gray-50 dark:bg-slate-950 relative rounded-none overflow-hidden border-b-2 border-black dark:border-white/10 flex-shrink-0">
              {component.image_url ? (
                <img
                  src={component.image_url}
                  alt={component.name}
                  className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity p-2 md:p-3 dark:invert dark:brightness-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-slate-800 bg-gray-50 dark:bg-slate-950">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 md:w-6 md:h-6">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                )}
                </div>

                <div className="p-2 md:p-4 flex-1 flex flex-col min-w-0">
                  <h3 className="font-black text-[10px] md:text-sm text-black dark:text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tighter leading-tight break-words">
                    {component.name}
                  </h3>

                  <div className="space-y-1 md:space-y-1.5 mb-3 md:mb-4 flex-1 min-w-0">
                    {Object.entries(component.specs || {}).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-[8px] md:text-[10px] uppercase tracking-tight gap-1">
                        <span className="text-gray-400 dark:text-slate-500 font-black italic whitespace-nowrap">{key.replace(/_/g, ' ').substring(0, 8)}:</span>
                        <span className="font-black text-black dark:text-slate-200 truncate text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 md:gap-3 pt-2 md:pt-3 border-t-2 border-black dark:border-white/10 mt-auto">
                    <span className="text-[10px] md:text-lg font-black text-blue-600 dark:text-blue-400 font-mono truncate">
                      {component.price_pkr ? `RS. ${component.price_pkr.toLocaleString()}` : 'PRICE_TBD'}
                    </span>
                    <button
                      onClick={(e) => handleAdd(component, e)}
                      className="w-full bg-black dark:bg-blue-600 text-white py-1.5 md:py-3 rounded-none text-[8px] md:text-[10px] font-black hover:bg-blue-600 dark:hover:bg-blue-500 transition-all uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                    >
                      DEPLOY
                    </button>
                  </div>
                </div>
          </div>
        ))}
      </div>
    );

  }

  