import { useState, useMemo } from 'react';
import { fetchComponents } from '../api/pcforge';
import type { Component } from '../types/pcforge';
import { X, Search, Plus, ChevronDown, Check, Scale, Info } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Modal from '../components/ui/Modal';

// New Components
import ComparisonCard from '../components/comparison/ComparisonCard';
import ComparisonControls from '../components/comparison/ComparisonControls';
import ComparisonTable from '../components/comparison/ComparisonTable';

const CATEGORIES = [
  { label: 'CPU', value: 'cpu' },
  { label: 'MOTHERBOARD', value: 'motherboard' },
  { label: 'RAM', value: 'ram' },
  { label: 'GPU', value: 'gpu' },
  { label: 'STORAGE', value: 'storage' },
  { label: 'POWER SUPPLY', value: 'psu' },
  { label: 'CASE', value: 'case' },
];

export default function Compare() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [products, setProducts] = useState<Component[]>([]);
  const [searchResults, setSearchResults] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState<Component[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  // Controls State
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [highlightBestValues, setHighlightBestValues] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'performance' | 'none'>('none');

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const productLimit = isMobile ? 3 : 5;

  const openSelectionModal = async (index: number | null = null) => {
    if (index === null && products.length >= productLimit) {
        alert(`MAXIMUM_${productLimit}_UNITS_REACHED_FOR_DEVICE`);
        return;
    }
    setReplaceIndex(index);
    setIsModalOpen(true);
    setIsModalLoading(true);
    try {
      const data = await fetchComponents(selectedCategory.value);
      setModalProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await fetchComponents(selectedCategory.value, query);
      setSearchResults(data.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  const addToCompare = (product: Component) => {
    if (replaceIndex !== null) {
        const newProducts = [...products];
        newProducts[replaceIndex] = product;
        setProducts(newProducts);
        setReplaceIndex(null);
    } else {
        if (products.length >= productLimit) {
            alert(`MAXIMUM_${productLimit}_UNITS_REACHED`);
            return;
        }
        if (products.find(p => p.id === product.id)) return;
        setProducts([...products, product]);
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsModalOpen(false);
  };

  const removeFromCompare = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const clearAll = () => setProducts([]);

  const getMockScore = (p: Component) => {
    const price = p.price_pkr || 0;
    return 70 + (price % 30);
  };

  const sortedProducts = useMemo(() => {
    let result = [...products];
    if (sortBy === 'price') {
      result.sort((a, b) => (a.price_pkr || 0) - (b.price_pkr || 0));
    } else if (sortBy === 'performance') {
      result.sort((a, b) => getMockScore(b) - getMockScore(a));
    }
    return result;
  }, [products, sortBy]);

  const bestValueId = useMemo(() => {
    if (products.length < 2) return null;
    return [...products].sort((a, b) => (a.price_pkr || 0) - (b.price_pkr || 0))[0]?.id;
  }, [products]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 pb-32">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-10 z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 pt-12 md:pt-20">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] italic border-2 border-black">
                    <Scale size={14} /> Component Comparison
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white uppercase tracking-tighter leading-none italic">
                    SIDE-BY-SIDE
                </h1>
                <p className="text-gray-600 dark:text-slate-400 text-lg font-medium max-w-lg uppercase leading-tight italic">
                    Analyze hardware specifications and performance data.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="flex items-center gap-4 bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-blue-600 transition-colors text-black dark:text-white px-6 py-4 font-black text-xs uppercase tracking-[0.2em] italic outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)]">
                            {selectedCategory.label}
                            <ChevronDown size={14} />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 p-1 w-64 z-[100] animate-in fade-in zoom-in-95 duration-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.2)]" sideOffset={8} align="end">
                            {CATEGORIES.map((cat) => (
                            <DropdownMenu.Item 
                                key={cat.value}
                                className="flex items-center justify-between px-4 py-3 text-[10px] font-black text-gray-400 dark:text-slate-500 hover:text-white hover:bg-black dark:hover:bg-blue-600 cursor-pointer outline-none uppercase tracking-widest italic"
                                onSelect={() => {
                                    setSelectedCategory(cat);
                                    setProducts([]);
                                }}
                            >
                                <span>{cat.label}</span>
                                {selectedCategory.value === cat.value && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                            </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <div className="relative min-w-[320px]">
                    <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-black dark:text-white" />
                    <input 
                        type="text" 
                        placeholder={`Search ${selectedCategory.label}...`} 
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 py-4 pl-14 pr-6 text-black dark:text-white text-xs font-black placeholder:text-gray-300 dark:placeholder:text-slate-800 focus:border-blue-600 dark:focus:border-blue-400 outline-none transition-all uppercase tracking-[0.2em] italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)]"
                    />
                    
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(37,99,235,0.3)] z-50 overflow-hidden">
                            <div className="p-2 border-b-2 border-black dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3 italic">Search Results</span>
                                <button onClick={() => setSearchResults([])} className="p-1 hover:bg-red-600 hover:text-white transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                            {searchResults.map(product => (
                                <button 
                                    key={product.id}
                                    onClick={() => addToCompare(product)}
                                    className="flex items-center gap-4 w-full p-4 hover:bg-blue-600 hover:text-white transition-all group border-b border-black dark:border-white/5 last:border-0"
                                >
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-black rounded-none border border-black dark:border-white/10 flex items-center justify-center flex-shrink-0">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt="" className="w-full h-full object-contain dark:invert" />
                                        ) : (
                                            <div className="text-[7px] text-gray-400 font-black">IMAGE</div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-black uppercase tracking-tight line-clamp-1 italic">{product.name}</div>
                                        <div className="text-[10px] font-black font-mono mt-1 opacity-70">
                                            {product.price_pkr ? `Rs. ${product.price_pkr.toLocaleString()}` : 'Price TBD'}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {products.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="p-4 bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.1)]"
                        title="Clear All"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
          </div>
        </header>

        {/* Comparison Grid */}
        <div className="space-y-16">
            
            {/* Component Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {sortedProducts.map((product) => (
                    <ComparisonCard 
                        key={product.id}
                        product={product}
                        onRemove={removeFromCompare}
                        onReplace={() => openSelectionModal(products.indexOf(product))}
                        isBestValue={product.id === bestValueId}
                        performanceScore={getMockScore(product)}
                    />
                ))}
                
                {/* Placeholders */}
                {[...Array(productLimit - products.length)].map((_, i) => (
                    <button 
                        key={`placeholder-${i}`} 
                        onClick={() => openSelectionModal()}
                        className="group flex flex-col items-center justify-center h-full min-h-[420px] bg-gray-50 dark:bg-[#121212]/30 border-2 border-dashed border-black dark:border-white/10 hover:border-blue-600 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-[#121212] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)]"
                    >
                        <div className="w-16 h-16 bg-white dark:bg-black border-2 border-black dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all mb-6">
                            <Plus size={32} />
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-black text-gray-400 dark:text-slate-700 uppercase tracking-[0.3em] italic">Add Component</div>
                            <div className="text-[9px] font-black text-gray-300 dark:text-slate-800 uppercase mt-2 italic">Product {products.length + i + 1}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Specifications Section */}
            {products.length > 0 && (
                <div className="space-y-8">
                    <ComparisonControls 
                        showOnlyDifferences={showOnlyDifferences}
                        setShowOnlyDifferences={setShowOnlyDifferences}
                        highlightBestValues={highlightBestValues}
                        setHighlightBestValues={setHighlightBestValues}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />

                    <ComparisonTable 
                        products={sortedProducts}
                        showOnlyDifferences={showOnlyDifferences}
                        highlightBestValues={highlightBestValues}
                    />
                    
                    {/* Advisory Disclaimer */}
                    <div className="p-8 bg-gray-50 dark:bg-[#121212] border-2 border-black dark:border-white/10 flex items-start gap-6 relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-2 bg-blue-600"></div>
                        <div className="bg-black text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
                            <Info size={24} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-widest italic flex items-center gap-3">
                                <span className="text-blue-600">//</span> Important Note
                            </h4>
                            <p className="text-[11px] text-gray-600 dark:text-slate-400 font-bold uppercase tracking-tight leading-relaxed italic max-w-2xl">
                                Compatibility Warning: Final hardware compatibility depends on specific BIOS versions and physical dimensions. 
                                Please cross-reference all manufacturer specifications before purchasing. 
                                <span className="text-blue-600 dark:text-blue-500 font-black ml-2 underline underline-offset-4 decoration-2">Verified Compatibility</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Selection Modal Adaptation */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Select ${selectedCategory.label}`}
      >
        {isModalLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 border-4 border-black dark:border-blue-600 border-t-blue-600 animate-spin mb-8"></div>
                <div className="text-black dark:text-white font-black uppercase tracking-[0.4em] text-xs italic animate-pulse">
                    Loading Components...
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin dark:scrollbar-thumb-blue-600 dark:scrollbar-track-black">
                {modalProducts.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed border-black dark:border-white/10">
                        <span className="text-xs font-black text-gray-300 dark:text-slate-800 uppercase tracking-widest italic">No components found</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {modalProducts.map((product) => {
                            const isAlreadyAdded = products.find(p => p.id === product.id);
                            return (
                                <button
                                    key={product.id}
                                    disabled={!!isAlreadyAdded && replaceIndex === null}
                                    onClick={() => addToCompare(product)}
                                    className={`flex items-center gap-6 p-5 border-2 transition-all text-left group w-full ${
                                        isAlreadyAdded && replaceIndex === null
                                        ? 'bg-gray-50 dark:bg-black border-black/10 dark:border-white/5 opacity-40 cursor-not-allowed' 
                                        : 'bg-white dark:bg-[#121212] border-black dark:border-white/10 hover:border-blue-600 dark:hover:border-blue-600 hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]'
                                    }`}
                                >
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-black border-2 border-black dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt="" className="w-full h-full object-contain dark:invert" />
                                        ) : (
                                            <div className="text-[8px] text-gray-300 font-black italic">NO IMAGE</div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black text-black dark:text-white uppercase tracking-tight mb-2 truncate group-hover:text-blue-600 transition-colors italic">
                                            {product.name}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono tracking-tighter">
                                                {product.price_pkr ? `Rs. ${product.price_pkr.toLocaleString()}` : 'Price TBD'}
                                            </div>
                                            <div className="text-[9px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest bg-gray-50 dark:bg-black px-2 py-1 border border-black/5 dark:border-white/5 italic">
                                                {product.manufacturer}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`w-14 h-14 flex items-center justify-center border-2 transition-all ${
                                        isAlreadyAdded && replaceIndex === null
                                        ? 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black' 
                                        : 'border-black dark:border-white/10 bg-white dark:bg-[#1a1a1a] group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white'
                                    }`}>
                                        {isAlreadyAdded && replaceIndex === null ? (
                                            <Check size={24} className="text-gray-300 dark:text-slate-800" />
                                        ) : (
                                            <Plus size={24} />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        )}
      </Modal>
    </div>
  );
}
