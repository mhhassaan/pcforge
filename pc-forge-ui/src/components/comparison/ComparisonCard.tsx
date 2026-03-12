import React from 'react';
import { Trash2, RefreshCw, TrendingUp } from 'lucide-react';
import type { Component } from '../../types/pcforge';

interface ComparisonCardProps {
  product: Component;
  onRemove: (id: string) => void;
  onReplace: () => void;
  isBestValue?: boolean;
  performanceScore?: number;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  product,
  onRemove,
  onReplace,
  isBestValue,
  performanceScore = 80,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(37,99,235,1)] relative group p-5">
      
      {/* Badges */}
      <div className="absolute top-0 left-0 z-20">
        {isBestValue && (
          <div className="bg-green-500 text-white text-[9px] font-black px-3 py-1 border-b-2 border-r-2 border-black uppercase tracking-[0.2em] italic flex items-center gap-1">
            <TrendingUp size={12} />
            Best Value
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          onClick={onReplace}
          className="p-2 bg-black text-white hover:bg-blue-600 transition-colors border border-black"
          title="Replace"
        >
          <RefreshCw size={14} />
        </button>
        <button
          onClick={() => onRemove(product.id)}
          className="p-2 bg-black text-white hover:bg-red-600 transition-colors border border-black"
          title="Remove"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gray-50 dark:bg-[#0a0a0a] border border-black dark:border-white/5 mb-6 flex items-center justify-center p-4 relative overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain dark:invert dark:brightness-110" />
        ) : (
          <div className="text-gray-300 dark:text-slate-800 font-black text-[10px] uppercase tracking-[0.3em] italic">No Image</div>
        )}
        
        {/* Decorative scan lines or grid could go here if needed, keeping it clean for now */}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-1 italic">
            Component Profile
        </div>
        <h3 className="font-black text-sm md:text-base text-black dark:text-white leading-tight mb-3 line-clamp-2 h-10 md:h-12 uppercase italic tracking-tighter">
          {product.name}
        </h3>
        
        <div className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 mb-6 font-mono tracking-tighter">
          {product.price_pkr ? `Rs. ${product.price_pkr.toLocaleString()}` : 'Price TBD'}
        </div>

        {/* Performance Score */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] italic">
            <span>Performance Index</span>
            <span className="text-black dark:text-white font-mono">{performanceScore}%</span>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-gray-800 border border-black dark:border-white/10 flex p-[2px]">
            <div 
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000"
              style={{ width: `${performanceScore}%` }}
            ></div>
          </div>
        </div>

        {/* Compatibility & Notes */}
        <div className="mt-auto pt-4 border-t-2 border-black dark:border-white/10 space-y-2">
            {product.specs?.tdp && parseInt(product.specs.tdp) > 100 && (
                <div className="text-[9px] font-black text-amber-600 dark:text-amber-500 flex items-center gap-2 uppercase italic tracking-wider">
                    <div className="w-2 h-2 bg-amber-600 animate-pulse"></div>
                    High TDP Warning
                </div>
            )}
            {product.category === 'cpu' && !product.specs?.graphics && (
                 <div className="text-[9px] font-black text-gray-400 dark:text-slate-500 flex items-center gap-2 uppercase italic tracking-wider">
                    <div className="w-2 h-2 bg-gray-400"></div>
                    Requires GPU
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
