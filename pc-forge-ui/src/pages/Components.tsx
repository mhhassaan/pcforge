import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
    fetchComponents, 
    fetchAllFilters, 
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
import { ChevronDown, ChevronUp, Filter, Hammer, Check } from 'lucide-react';
import { useBuild } from '../context/BuildContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addComponent } = useBuild();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [allAvailableFilters, setAllAvailableFilters] = useState<Record<string, Record<string, string[]>>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [filtersLoading, setFiltersLoading] = useState(true);

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
            const res = await fetchMotherboards(cpuId);
            data = res?.motherboards || [];
        } else if (category === 'ram' && mbId) {
            const res = await fetchRAM(mbId);
            data = res?.ram || [];
        } else if (category === 'storage' && mbId) {
            const res = await fetchStorage(mbId);
            data = res?.storage || [];
        } else if (category === 'case' && (mbId || gpuId)) {
            const res = await fetchCases(mbId, gpuId);
            data = res?.cases || [];
        } else if (category === 'gpu' && caseId) {
            const res = await fetchGPUs(caseId);
            data = res?.gpus || [];
        } else if (category === 'psu' && (cpuId || gpuId)) {
            const res = await fetchPSUs(cpuId, gpuId);
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
        const standardizedData = data.map(item => ({
            ...item,
            id: item.product_id || item.id,
            name: item.product_name || item.name,
            category: item.category || category
        }));

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
            const data = await fetchAllFilters();
            setAllAvailableFilters(data);
        } catch (e) {
            console.error("Failed to load filters", e);
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

  return (
    <div className="h-[calc(100vh-64px)] bg-white text-black flex overflow-hidden font-sans">
      
      {/* 1. Left Sidebar: Categories & Filters */}
      <aside className="w-64 flex-shrink-0 border-r border-black flex flex-col bg-gray-50">
        <div className="p-6 border-b border-black flex-shrink-0">
          <h1 className="text-2xl font-black text-black uppercase tracking-tighter leading-none mb-6 italic">COMPONENTS</h1>
          
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center justify-between w-full bg-white border border-black hover:bg-gray-100 text-black px-4 py-2 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-colors outline-none focus:ring-2 focus:ring-blue-600">
                {selectedCatObj.label}
                <ChevronDown size={14} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1 w-56 z-[100] animate-in fade-in zoom-in-95 duration-100" sideOffset={5} align="start">
                {CATEGORIES.map((cat) => (
                  <DropdownMenu.Item 
                    key={cat.value}
                    className="flex items-center justify-between px-3 py-2 text-[10px] font-black text-gray-400 hover:text-white hover:bg-black rounded-none cursor-pointer outline-none uppercase tracking-widest"
                    onSelect={() => {
                        navigate(`?category=${cat.value}`);
                    }}
                  >
                    <span>{cat.label}</span>
                    {category === cat.value && <Check size={12} className="text-blue-600" />}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Filter size={12} /> Filters
                    </span>
                    <button 
                        onClick={clearAllFilters}
                        className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest"
                    >
                        Clear
                    </button>
                </div>

                <div className="space-y-4">
                    {filtersLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-2 bg-gray-200 w-1/2 rounded"></div>
                                    <div className="h-8 bg-gray-200 w-full rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        Object.entries(availableFilters).map(([key, options]) => (
                            <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
                                <button 
                                    onClick={() => setOpenSections(prev => ({...prev, [key]: !prev[key]}))}
                                    className="flex items-center justify-between w-full text-left mb-2 group"
                                >
                                    <span className="text-[10px] font-black text-black group-hover:text-blue-600 uppercase tracking-widest">
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
                                                        ? 'bg-black text-white' 
                                                        : 'text-gray-500 hover:bg-gray-200 hover:text-black'
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

        <div className="p-6 border-t border-black flex-shrink-0 bg-white">
            <Link to="/" className="text-gray-400 hover:text-black font-black uppercase text-[9px] tracking-widest transition-colors">
                &larr; Exit to Home
            </Link>
        </div>
      </aside>

      {/* 2. Middle Column: Grid */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="p-4 border-b border-black flex items-center justify-between bg-gray-50 flex-shrink-0">
              <div className="text-[10px] font-black text-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Hammer size={12} className="text-blue-600" />
                  <Link to="/builder" className="hover:underline">Builder</Link> 
                  <span className="text-gray-300">/</span> 
                  {category.toUpperCase()} EXPLORER
              </div>
              <div className="flex items-center gap-4">
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
                    className="bg-white border border-black rounded-none py-1.5 px-3 text-[10px] font-black uppercase tracking-widest text-black placeholder:text-gray-300 focus:border-blue-600 outline-none w-48 transition-all"
                  />
                  <SortFilter />
              </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 border border-red-200 uppercase font-black text-[10px] tracking-wide text-center">
                    {error}
                </div>
              )}
              
              {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {[...Array(9)].map((_, i) => (
                          <div key={i} className="bg-gray-50 h-40 border border-gray-200 animate-pulse" />
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

      {/* 3. Right Sidebar: Details */}
      <aside className="w-80 xl:w-96 flex-shrink-0 border-l border-black">
          <ComponentDetails 
            component={selectedComponent} 
            onClose={() => setSelectedComponent(null)} 
            onAddOverride={handleAddComponent}
          />
      </aside>

    </div>
  );
}