import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
    fetchComponents, 
    fetchAllFilters, 
    fetchCategoryCounts,
    fetchMotherboards, 
    fetchRAM, 
    fetchStorage, 
    fetchCases, 
    fetchGPUs, 
    fetchPSUs 
} from '../api/pcforge';
import type { Component } from '../types/pcforge';
import ComponentGrid from '../components/ComponentGrid';
import SortFilter from '../components/SortFilter';
import ComponentDetails from '../components/ComponentDetails';
import { ChevronDown, ChevronUp, Filter, Hammer, Check, X } from 'lucide-react';
import { useBuild } from '../context/BuildContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ScrollProgress } from '../components/ui/ScrollProgress';

const CATEGORIES = [
  { label: 'CPU', value: 'cpu' },
  { label: 'MOTHERBOARD', value: 'motherboard' },
  { label: 'RAM', value: 'ram' },
  { label: 'GPU', value: 'gpu' },
  { label: 'STORAGE', value: 'storage' },
  { label: 'POWER SUPPLY', value: 'psu' },
  { label: 'CASE', value: 'case' },
];

export default function Components() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addComponent } = useBuild();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [allAvailableFilters, setAllAvailableFilters] = useState<Record<string, Record<string, string[]>>>({});
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [filtersLoading, setFiltersLoading] = useState(true);
  
  // Mobile UI States
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Close details on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedComponent(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const category = searchParams.get('category') || 'cpu';
  const selectedCatObj = CATEGORIES.find(c => c.value === category) || CATEGORIES[0];
  const sortBy = searchParams.get('sort_by') || '';
  const order = searchParams.get('order') || 'asc';
  const q = searchParams.get('q') || '';

  // Compatibility IDs from URL
  const cpuId = searchParams.get('cpu_id');
  const mbId = searchParams.get('motherboard_id');
  const caseId = searchParams.get('case_id');
  const gpuId = searchParams.get('gpu_id');

  // Load components when searchParams change
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        let data: any[] = [];
        
        // If compatibility IDs are present, use the specialized endpoints
        if (category === 'motherboard' && cpuId) {
            const res = await fetchMotherboards(cpuId, sortBy, order);
            data = res?.motherboards || [];
        } else if (category === 'ram' && mbId) {
            const res = await fetchRAM(mbId, sortBy, order);
            data = res?.ram || [];
        } else if (category === 'storage' && mbId) {
            const res = await fetchStorage(mbId, sortBy, order);
            data = res?.storage || [];
        } else if (category === 'case' && (mbId || gpuId)) {
            const res = await fetchCases(mbId, gpuId, sortBy, order);
            data = res?.cases || [];
        } else if (category === 'gpu' && caseId) {
            const res = await fetchGPUs(caseId, sortBy, order);
            data = res?.gpus || [];
        } else if (category === 'psu' && (cpuId || gpuId)) {
            const res = await fetchPSUs(cpuId, gpuId, sortBy, order);
            data = res?.psus || [];
        } else {
            // Standard fetch
            const extraParams: Record<string, string> = {};
            searchParams.forEach((value, key) => {
                if (!["category", "q", "sort_by", "order", "cpu_id", "motherboard_id", "case_id", "gpu_id"].includes(key)) {
                    extraParams[key] = value;
                }
            });
            data = await fetchComponents(category, q, sortBy, order, extraParams);
        }

        // Standardize the ID field
        const standardizedData = Array.isArray(data) ? data.map(item => ({
            ...item,
            id: item.product_id || item.id,
            name: item.product_name || item.name,
            category: item.category || category
        })) : [];

        setComponents(standardizedData);
        setSelectedComponent(null);
      } catch (e) {
        setError("Failed to load components.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams, category, sortBy, order, q, cpuId, mbId, caseId, gpuId]);

  // Load all available filters once on mount
  useEffect(() => {
    async function loadAllFilters() {
        setFiltersLoading(true);
        try {
            const [filters, counts] = await Promise.all([
                fetchAllFilters(),
                fetchCategoryCounts()
            ]);
            setAllAvailableFilters(filters);
            setCategoryCounts(counts);
        } catch (e) {
            console.error("Failed to load filters or counts", e);
        } finally {
            setFiltersLoading(false);
        }
    }
    loadAllFilters();
  }, []);

  // Update open sections when category or filters change
  useEffect(() => {
    const filters = allAvailableFilters[category] || {};
    const initialOpen: Record<string, boolean> = {};
    Object.keys(filters).forEach(k => initialOpen[k] = true);
    setOpenSections(initialOpen);
  }, [category, allAvailableFilters]);

  const availableFilters = allAvailableFilters[category] || {};

  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.get(key)?.split(',') || [];
    
    let newValues;
    if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value);
    } else {
        newValues = [...currentValues, value];
    }

    if (newValues.length > 0) {
        params.set(key, newValues.join(','));
    } else {
        params.delete(key);
    }
    navigate(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    navigate(`?category=${category}`);
  };

  const handleAddComponent = (comp: Component) => {
    addComponent(comp);
    navigate('/builder');
  };

  // Shared Filter UI Content
  const FiltersContent = () => (
    <>
      <div className="p-6 border-b border-black dark:border-white/10 flex-shrink-0">
        <h1 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-6 italic">COMPONENTS</h1>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center justify-between w-full bg-white dark:bg-slate-900 border border-black dark:border-white/20 hover:bg-gray-100 dark:hover:bg-slate-800 text-black dark:text-white px-4 py-2 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-colors outline-none focus:ring-2 focus:ring-blue-600">
              {selectedCatObj.label} {categoryCounts[category] !== undefined && `(${categoryCounts[category]})`}
              <ChevronDown size={14} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white dark:bg-slate-900 border-2 border-black dark:border-blue-600 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)] p-1 w-56 z-[100] animate-in fade-in zoom-in-95 duration-100" sideOffset={5} align="start">
              {CATEGORIES.map((cat) => (
                <DropdownMenu.Item 
                  key={cat.value}
                  className="flex items-center justify-between px-3 py-2 text-[10px] font-black text-gray-400 dark:text-slate-500 hover:text-white hover:bg-black dark:hover:bg-blue-600 rounded-none cursor-pointer outline-none uppercase tracking-widest"
                  onSelect={() => {
                      navigate(`?category=${cat.value}`);
                      setShowMobileFilters(false);
                  }}
                >
                  <span>{cat.label} {categoryCounts[cat.value] !== undefined && `(${categoryCounts[cat.value]})`}</span>
                  {category === cat.value && <Check size={12} className="text-blue-600 dark:text-blue-400" />}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin dark:scrollbar-thumb-blue-600 dark:scrollbar-track-slate-900">
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Filter size={12} /> Filters
                  </span>
                  <button 
                      onClick={clearAllFilters}
                      className="text-[9px] font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest"
                  >
                      Clear
                  </button>
              </div>

              <div className="space-y-4">
                  {filtersLoading ? (
                      <div className="space-y-4 animate-pulse">
                          {[...Array(3)].map((_, i) => (
                              <div key={i} className="space-y-2">
                                  <div className="h-2 bg-gray-200 dark:bg-slate-800 w-1/2 rounded"></div>
                                  <div className="h-8 bg-gray-200 dark:bg-slate-800 w-full rounded"></div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      Object.entries(availableFilters).map(([key, options]) => (
                          <div key={key} className="border-b border-gray-200 dark:border-white/5 pb-4 last:border-0">
                              <button 
                                  onClick={() => setOpenSections(prev => ({...prev, [key]: !prev[key]}))}
                                  className="flex items-center justify-between w-full text-left mb-2 group"
                              >
                                  <span className="text-[10px] font-black text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 uppercase tracking-widest">
                                      {key.replace(/_/g, ' ')}
                                  </span>
                                  {openSections[key] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>

                              {openSections[key] && (
                                  <div className="space-y-1 mt-2">
                                      {options.map(opt => {
                                          const isActive = (searchParams.get(key)?.split(',') || []).includes(opt);
                                          return (
                                              <button
                                                  key={opt}
                                                  onClick={() => toggleFilter(key, opt)}
                                                  className={`flex items-center gap-2 w-full text-left px-2 py-1 transition-colors text-[9px] font-bold uppercase tracking-tight ${
                                                      isActive 
                                                      ? 'bg-black dark:bg-blue-600 text-white' 
                                                      : 'text-gray-500 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white'
                                                  }`}
                                              >
                                                  {opt}
                                              </button>
                                          );
                                      })}
                                  </div>
                              )}
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>
    </>
  );

  return (
    <div className="h-[calc(100vh-64px)] bg-white dark:bg-[#0a0a0a] text-black dark:text-white flex overflow-hidden font-sans relative transition-colors duration-300">
      <ScrollProgress container={scrollContainerRef} className="bg-blue-600" />
      
      {/* 1. Left Sidebar: Filters (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-black dark:border-white/10 flex-col bg-gray-50 dark:bg-slate-900/30">
        <FiltersContent />
        <div className="p-6 border-t border-black dark:border-white/10 flex-shrink-0 bg-white dark:bg-[#0a0a0a]">
            <Link to="/" className="text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-white font-black uppercase text-[9px] tracking-widest transition-colors">
                &larr; Exit to Home
            </Link>
        </div>
      </aside>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80 backdrop-blur-sm lg:hidden flex justify-start">
            <div className="w-[85%] max-w-[320px] bg-white dark:bg-[#0a0a0a] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 border-r border-black dark:border-blue-600">
                <div className="flex justify-end p-4 border-b border-gray-100 dark:border-white/10">
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800">
                        <X size={20} />
                    </button>
                </div>
                <FiltersContent />
            </div>
        </div>
      )}

      {/* 2. Middle Column: Grid */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0a0a0a] relative">
          <div className="p-4 border-b border-black dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between bg-gray-50 dark:bg-slate-900/30 flex-shrink-0 gap-4">
              <div className="flex items-center justify-between w-full md:w-auto">
                <div className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <Hammer size={12} className="text-blue-600 dark:text-blue-400" />
                    <Link to="/builder" className="hover:underline">Builder</Link> 
                    <span className="text-gray-300 dark:text-slate-700">/</span> 
                    {category.toUpperCase()} {categoryCounts[category] !== undefined && `(${categoryCounts[category]})`}
                </div>
                
                {/* Mobile Filter Toggle */}
                <button 
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 bg-black dark:bg-blue-600 text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest"
                >
                    <Filter size={10} /> Filters
                </button>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Search model..."
                    value={q}
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams);
                        if (e.target.value) params.set('q', e.target.value);
                        else params.delete('q');
                        navigate(`?${params.toString()}`);
                    }}
                    className="bg-white dark:bg-slate-900 border border-black dark:border-white/20 rounded-none py-1.5 px-3 text-[10px] font-black tracking-widest text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-600 focus:border-blue-600 outline-none w-full md:w-48 transition-all"
                  />
                  <div className="hidden md:block">
                    <SortFilter />
                  </div>
              </div>
          </div>

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin dark:scrollbar-thumb-blue-600 dark:scrollbar-track-slate-900">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 border border-red-200 dark:border-red-900/20 uppercase font-black text-[10px] tracking-wide text-center">
                    {error}
                </div>
              )}
              
              {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {[...Array(9)].map((_, i) => (
                          <div key={i} className="bg-gray-50 dark:bg-slate-900/30 h-40 border border-gray-200 dark:border-white/5 animate-pulse" />
                      ))}
                  </div>
              ) : (
                  <ComponentGrid 
                    components={components} 
                    selectedId={selectedComponent?.id || null}
                    onSelect={setSelectedComponent}
                    onAddOverride={handleAddComponent}
                  />
              )}
          </div>
      </main>

      {/* 3. Right Sidebar: Details (Desktop) */}
      {selectedComponent && (
        <aside className="hidden xl:flex w-80 2xl:w-96 flex-shrink-0 border-l border-black dark:border-white/10 bg-white dark:bg-[#0a0a0a] min-w-0 animate-in slide-in-from-right duration-300 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
            <div className="w-full h-full min-w-0">
              <ComponentDetails 
                  component={selectedComponent} 
                  onClose={() => setSelectedComponent(null)} 
                  onAddOverride={handleAddComponent}
              />
            </div>
        </aside>
      )}

      {/* Mobile Details Overlay */}
      {selectedComponent && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm xl:hidden flex justify-end">
            <div className="w-full max-w-[400px] h-full bg-white dark:bg-[#0a0a0a] shadow-2xl border-l-2 border-black dark:border-blue-600 animate-in slide-in-from-right duration-300 flex flex-col min-w-0">
                 {/* Explicit Mobile Close Bar */}
                 <div className="bg-black dark:bg-blue-600 text-white p-4 flex justify-between items-center flex-shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest">Component Analysis</span>
                    <button 
                        onClick={() => setSelectedComponent(null)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 dark:hover:text-black transition-colors"
                    >
                        Close <X size={18} />
                    </button>
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <ComponentDetails 
                        component={selectedComponent} 
                        onClose={() => setSelectedComponent(null)} 
                        onAddOverride={handleAddComponent}
                    />
                 </div>
            </div>
        </div>
      )}

    </div>
  );
}
