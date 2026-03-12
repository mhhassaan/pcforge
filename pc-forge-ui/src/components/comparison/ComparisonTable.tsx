import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Star } from 'lucide-react';
import type { Component } from '../../types/pcforge';
import { cn } from '../../lib/utils';

interface ComparisonTableProps {
  products: Component[];
  showOnlyDifferences: boolean;
  highlightBestValues: boolean;
}

const SPEC_CATEGORIES: Record<string, string[]> = {
  'Performance': ['cores', 'threads', 'base_clock', 'boost_clock', 'cache', 'speed', 'vram', 'vram_gb', 'interface', 'ram_type', 'speed_mhz'],
  'Power': ['tdp', 'wattage', 'efficiency_rating', 'modular'],
  'Compatibility': ['socket', 'chipset', 'form_factor', 'case_form_factor', 'max_ram_gb', 'ram_slots', 'length_mm', 'max_gpu_length_mm'],
  'Storage': ['capacity_gb', 'type', 'interface'],
  'Physical': ['dimensions', 'color', 'side_panel_window'],
};

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  products,
  showOnlyDifferences,
  highlightBestValues,
}) => {
  if (products.length === 0) return null;

  const allSpecKeys = Array.from(new Set(products.flatMap(p => Object.keys(p.specs || {}))));
  const visibleKeys = allSpecKeys.filter(key => {
    if (!showOnlyDifferences) return true;
    const values = products.map(p => String(p.specs?.[key] ?? '-'));
    return new Set(values).size > 1;
  });

  const getBestValueForKey = (key: string) => {
    if (!highlightBestValues) return null;
    const values = products.map(p => {
        const val = p.specs?.[key];
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
            const numeric = parseFloat(val);
            if (!isNaN(numeric)) return numeric;
        }
        return null;
    });
    if (values.every(v => v === null)) return null;
    const filteredValues = values.filter((v): v is number => v !== null);
    if (filteredValues.length === 0) return null;
    if (key.toLowerCase().includes('tdp')) return Math.min(...filteredValues);
    return Math.max(...filteredValues);
  };

  const renderSpecRow = (key: string, index: number) => {
    const bestValue = getBestValueForKey(key);
    const label = key.replace(/_/g, ' ');

    return (
      <div 
        key={key} 
        className={cn(
            "grid grid-cols-[160px_repeat(auto-fit,minmax(0,1fr))] border-b border-black dark:border-white/5 transition-colors group/row",
            index % 2 === 0 ? "bg-white dark:bg-[#121212]" : "bg-gray-50/30 dark:bg-white/[0.01]"
        )}
      >
        <div className="p-4 py-5 text-[10px] font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest flex items-center bg-gray-50 dark:bg-black/60 sticky left-0 z-10 border-r-2 border-black dark:border-white/10 italic group-hover/row:text-blue-600 transition-colors">
          {label}
        </div>
        {products.map(product => {
          const rawValue = product.specs?.[key];
          const value = String(rawValue ?? '-');
          const isBest = bestValue !== null && (
            (typeof rawValue === 'number' && rawValue === bestValue) ||
            (typeof rawValue === 'string' && parseFloat(rawValue) === bestValue)
          );

          return (
            <div 
              key={product.id} 
              className={cn(
                "p-4 py-5 text-xs font-bold flex flex-col justify-center items-center text-center border-r border-black dark:border-white/5 last:border-0 transition-colors",
                isBest && highlightBestValues ? "bg-blue-600/90 text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" : "text-gray-900 dark:text-slate-200"
              )}
            >
              <div className="flex items-center gap-2 tracking-tight">
                {value}
                {isBest && highlightBestValues && <Star size={12} className="fill-current text-white" />}
              </div>
              
              {typeof rawValue === 'number' && bestValue !== null && bestValue > 0 && (
                 <div className={cn(
                    "w-full h-1.5 border border-black mt-3 overflow-hidden max-w-[100px]",
                    isBest && highlightBestValues ? "bg-white/20 border-white" : "bg-gray-200 dark:bg-gray-800/50"
                 )}>
                    <div 
                        className={cn(
                            "h-full transition-all duration-700 ease-out",
                            isBest && highlightBestValues ? "bg-white" : "bg-blue-600"
                        )}
                        style={{ width: `${Math.min(100, (rawValue / bestValue) * 100)}%` }}
                    ></div>
                 </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const categories = Object.entries(SPEC_CATEGORIES).filter(([_, keys]) => 
    keys.some(key => visibleKeys.includes(key))
  );

  const uncategorizedKeys = visibleKeys.filter(key => 
    !Object.values(SPEC_CATEGORIES).flat().includes(key)
  );

  return (
    <div className="bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)] mb-12">
      <Accordion.Root type="multiple" defaultValue={categories.map(([name]) => name)} className="w-full">
        {categories.map(([name, keys]) => {
          const visibleCategoryKeys = keys.filter(k => visibleKeys.includes(k));
          if (visibleCategoryKeys.length === 0) return null;

          return (
            <Accordion.Item key={name} value={name} className="border-b-2 border-black dark:border-white/10 last:border-0">
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex flex-1 items-center justify-between p-4 bg-gray-50 dark:bg-black/60 hover:bg-gray-100 dark:hover:bg-black transition-all group outline-none data-[state=open]:border-b-2 border-black dark:border-white/10">
                  <span className="text-xs font-black text-black dark:text-white uppercase tracking-[0.3em] italic flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-600 border border-black"></div>
                    {name} Specs
                  </span>
                  <ChevronDown className="w-5 h-5 text-black dark:text-white group-data-[state=open]:rotate-180 transition-transform duration-300" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="flex flex-col">
                  {visibleCategoryKeys.map((key, i) => renderSpecRow(key, i))}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}

        {uncategorizedKeys.length > 0 && (
          <Accordion.Item value="other" className="border-b-2 border-black dark:border-white/10 last:border-0">
            <Accordion.Header className="flex">
              <Accordion.Trigger className="flex flex-1 items-center justify-between p-4 bg-gray-50 dark:bg-black/60 hover:bg-gray-100 dark:hover:bg-black transition-all group outline-none">
                <span className="text-xs font-black text-black dark:text-white uppercase tracking-[0.3em] italic flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 border border-black"></div>
                  Other Details
                </span>
                <ChevronDown className="w-5 h-5 text-black dark:text-white group-data-[state=open]:rotate-180 transition-transform duration-300" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="flex flex-col">
                {uncategorizedKeys.map((key, i) => renderSpecRow(key, i))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        )}
      </Accordion.Root>
    </div>
  );
};

export default ComparisonTable;
