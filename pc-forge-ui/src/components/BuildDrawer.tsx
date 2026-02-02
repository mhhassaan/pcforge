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
        className="fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition-all hover:scale-105 flex items-center gap-2 uppercase tracking-widest font-black text-[10px] shadow-blue-900/50"
      >
        <span className="font-black">Current Build</span>
        <span className="bg-white text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-black">
            {Object.keys(build).length}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 shadow-2xl z-[150] transform transition-transform duration-300 ease-in-out border-l border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Your Build</h2>
        <button 
          onClick={() => toggleDrawer(false)}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {categories.map(cat => {
            const item = build[cat];
            return (
                <div key={cat} className="border-b border-slate-800 pb-2 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{cat.replace('_', ' ')}</span>
                        {!item && (
                           <Link 
                             to={`/components?category=${cat}`}
                             onClick={() => toggleDrawer(false)}
                             className="text-[10px] font-black text-blue-500 hover:text-blue-400 hover:underline uppercase"
                           >
                             + Add
                           </Link>
                        )}
                    </div>
                    {item ? (
                        <div className="flex justify-between items-start group">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white line-clamp-1 uppercase tracking-tight">{item.name}</p>
                                <p className="text-xs text-slate-400 font-mono mt-0.5 font-bold">
                                    {item.price_pkr ? `Rs. ${item.price_pkr.toLocaleString()}` : 'N/A'}
                                </p>
                            </div>
                            <button 
                                onClick={() => removeComponent(cat)}
                                className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 ml-2 transition-opacity"
                                title="Remove"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="h-6 bg-slate-800/50 rounded border border-dashed border-slate-700 text-[10px] text-slate-600 flex items-center px-2 uppercase font-black tracking-wider">
                            Empty
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Total:</span>
            <span className="text-xl font-black text-blue-500 font-mono">Rs. {totalPrice.toLocaleString()}</span>
        </div>
        <Link 
            to="/builder"
            onClick={() => toggleDrawer(false)}
            className="flex items-center justify-center gap-2 w-full text-center bg-blue-600 text-white py-3 rounded-lg font-black hover:bg-blue-500 transition-colors uppercase tracking-widest text-[10px] shadow-lg shadow-blue-900/20"
        >
            <Hammer size={14} /> View Full Configurator
        </Link>
      </div>
    </div>
  );
}
