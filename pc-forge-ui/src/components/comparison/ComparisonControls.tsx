import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface ComparisonControlsProps {
  showOnlyDifferences: boolean;
  setShowOnlyDifferences: (val: boolean) => void;
  highlightBestValues: boolean;
  setHighlightBestValues: (val: boolean) => void;
  sortBy: 'price' | 'performance' | 'none';
  setSortBy: (val: 'price' | 'performance' | 'none') => void;
}

const ComparisonControls: React.FC<ComparisonControlsProps> = ({
  showOnlyDifferences,
  setShowOnlyDifferences,
  highlightBestValues,
  setHighlightBestValues,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-6 bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.05)]">
      
      <div className="flex flex-wrap items-center gap-10">
        {/* Toggle 1 */}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}>
            <div className={`w-12 h-6 border-2 border-black relative transition-colors ${showOnlyDifferences ? 'bg-blue-600' : 'bg-gray-100 dark:bg-black'}`}>
                <div className={`absolute top-0 w-5 h-full bg-white border-x-2 border-black transition-all ${showOnlyDifferences ? 'left-[calc(100%-1.25rem)]' : 'left-0'}`}></div>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest italic group-hover:text-blue-600 transition-colors">
                    Show Differences
                </span>
                <span className="text-[7px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest leading-none">
                    {showOnlyDifferences ? 'Enabled' : 'Disabled'}
                </span>
            </div>
        </div>

        {/* Toggle 2 */}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setHighlightBestValues(!highlightBestValues)}>
            <div className={`w-12 h-6 border-2 border-black relative transition-colors ${highlightBestValues ? 'bg-blue-600' : 'bg-gray-100 dark:bg-black'}`}>
                <div className={`absolute top-0 w-5 h-full bg-white border-x-2 border-black transition-all ${highlightBestValues ? 'left-[calc(100%-1.25rem)]' : 'left-0'}`}></div>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest italic group-hover:text-blue-600 transition-colors">
                    Highlight Best
                </span>
                <span className="text-[7px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest leading-none">
                    {highlightBestValues ? 'Enabled' : 'Disabled'}
                </span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-50 dark:bg-black/20 border-2 border-black dark:border-white/10 p-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] italic">
          <ArrowUpDown size={14} className="text-blue-600" />
          Sort By:
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-white dark:bg-[#1a1a1a] border border-black dark:border-white/10 px-3 py-1.5 text-[10px] font-black text-black dark:text-white uppercase italic outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
        >
          <option value="none">Default</option>
          <option value="price">Price Low to High</option>
          <option value="performance">Performance Score</option>
        </select>
      </div>
    </div>
  );
};

export default ComparisonControls;
