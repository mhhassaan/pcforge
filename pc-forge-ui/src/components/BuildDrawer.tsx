import { useBuild } from '../context/BuildContext';
import { Link } from 'react-router-dom';
import { X, Hammer } from 'lucide-react';

export default function BuildDrawer() {
  const { build, totalPrice, isDrawerOpen, toggleDrawer, removeComponent } = useBuild();

  // Categories to display in order
  const categories = [
    'cpu', 'motherboard', 'gpu', 'ram', 'storage', 
    'psu', 'case'
  ];

  if (!isDrawerOpen) {
    return (
      <button 
        onClick={() => toggleDrawer(true)}
        className="fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all hover:-translate-y-1 flex items-center gap-2 uppercase tracking-widest font-black text-[10px]"
      >
        <span className="font-black">Current Assembly</span>
        <span className="bg-black text-white dark:bg-white dark:text-blue-600 text-[10px] px-2 py-0.5 rounded-none font-black">
            {Object.keys(build).length}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-[#0a0a0a] shadow-2xl z-[150] transform transition-transform duration-300 ease-in-out border-l-2 border-black dark:border-blue-600 flex flex-col">
      <div className="p-6 border-b-2 border-black dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-[#121212]">
        <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter italic">Your_Build</h2>
        <button 
          onClick={() => toggleDrawer(false)}
          className="p-2 border-2 border-transparent hover:border-black dark:hover:border-blue-600 text-black dark:text-slate-400 hover:text-black dark:hover:text-white transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin dark:scrollbar-thumb-blue-600 dark:scrollbar-track-[#0a0a0a]">
        {categories.map(cat => {
            const item = build[cat];
            return (
                <div key={cat} className="border-b border-gray-100 dark:border-white/5 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-slate-500 tracking-widest italic">{cat.replace('_', ' ')}</span>
                        {!item && (
                           <Link 
                             to={`/components?category=${cat}`}
                             onClick={() => toggleDrawer(false)}
                             className="text-[9px] font-black text-blue-600 dark:text-blue-400 hover:underline uppercase italic"
                           >
                             + Initialize
                           </Link>
                        )}
                    </div>
                    {item ? (
                        <div className="flex justify-between items-start group">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-black dark:text-white line-clamp-1 uppercase tracking-tight italic">{item.name}</p>
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono mt-1 font-black">
                                    {item.price_pkr ? `Rs. ${item.price_pkr.toLocaleString()}` : 'N/A'}
                                </p>
                            </div>
                            <button 
                                onClick={() => removeComponent(cat)}
                                className="text-red-600 dark:text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 ml-2 transition-opacity"
                                title="Remove Component"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <div className="h-10 bg-gray-50 dark:bg-[#121212] border-2 border-dashed border-gray-200 dark:border-white/5 text-[9px] text-gray-300 dark:text-slate-700 flex items-center px-3 uppercase font-black tracking-widest italic">
                            Empty_Module
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      <div className="p-6 border-t-2 border-black dark:border-white/10 bg-gray-50 dark:bg-[#121212]">
        <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest italic">Est. Total:</span>
            <span className="text-2xl font-black text-black dark:text-white font-mono italic">Rs. {totalPrice.toLocaleString()}</span>
        </div>
        <Link 
            to="/builder"
            onClick={() => toggleDrawer(false)}
            className="flex items-center justify-center gap-2 w-full text-center bg-black dark:bg-blue-600 text-white py-4 rounded-none font-black hover:bg-blue-600 dark:hover:bg-blue-500 transition-all uppercase tracking-widest text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)]"
        >
            <Hammer size={14} /> View Full Configurator
        </Link>
      </div>
    </div>
  );
}
