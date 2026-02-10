import { useState } from 'react';
import { fetchComponents } from '../api/pcforge';
import type { Component } from '../types/pcforge';
import { X, Search, Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Modal from '../components/ui/Modal';

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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const productLimit = isMobile ? 3 : 5;

  const openSelectionModal = async () => {
    if (products.length >= productLimit) {
        alert(`Maximum ${productLimit} products allowed for comparison on this device.`);
        return;
    }
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
    if (products.length >= productLimit) {
      alert(`Maximum ${productLimit} products allowed for comparison on this device.`);
      return;
    }
    if (products.find(p => p.id === product.id)) return;
    setProducts([...products, product]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFromCompare = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const clearAll = () => setProducts([]);

  const allSpecKeys = Array.from(new Set(products.flatMap(p => Object.keys(p.specs || {}))));
  
  const topLevelRows = [
    { label: 'Lowest Price', key: 'price_pkr', format: (v: any) => v ? `Rs. ${v.toLocaleString()}` : 'N/A', color: 'text-blue-600' },
  ];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '80px repeat(3, 1fr)' : '150px repeat(5, 1fr)',
  };
  const placeholdersNeeded = productLimit - products.length;

  return (
    <div className="min-h-screen bg-white text-black font-sans p-3 md:p-8 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Header / Controls */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12 bg-gray-50 p-4 md:p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic whitespace-nowrap">SIDE-BY-SIDE</h1>
          
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 bg-white border border-black hover:bg-gray-100 text-black px-3 py-2 rounded-none font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-colors outline-none focus:ring-2 focus:ring-blue-600">
                {selectedCategory.label}
                <ChevronDown size={12} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1 w-56 z-[100] animate-in fade-in zoom-in-95 duration-100" sideOffset={5} align="start">
                {CATEGORIES.map((cat) => (
                  <DropdownMenu.Item 
                    key={cat.value}
                    className="flex items-center justify-between px-3 py-2 text-[10px] font-black text-gray-400 hover:text-white hover:bg-black rounded-none cursor-pointer outline-none uppercase tracking-widest"
                    onSelect={() => {
                        setSelectedCategory(cat);
                        setProducts([]);
                    }}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory.value === cat.value && <Check size={12} className="text-blue-600" />}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder={`FIND ${selectedCategory.label}...`} 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-white border border-black rounded-none py-2 pl-9 pr-4 text-black text-[9px] md:text-[10px] font-black placeholder:text-gray-300 focus:border-blue-600 outline-none transition-all uppercase tracking-[0.2em]"
                />
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
                    {searchResults.map(product => (
                        <button 
                            key={product.id}
                            onClick={() => addToCompare(product)}
                            className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-100 last:border-0"
                        >
                            <div className="w-8 h-8 bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-[7px] text-gray-400 font-black uppercase">IMG</span>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[9px] font-black text-black uppercase tracking-tight line-clamp-1">{product.name}</div>
                                <div className="text-[9px] text-blue-600 font-mono font-black">
                                    {product.price_pkr ? `Rs. ${product.price_pkr.toLocaleString()}` : 'Price TBD'}
                                </div>
                            </div>
                            <Plus size={14} className="ml-auto text-gray-300 hover:text-black flex-shrink-0" />
                        </button>
                    ))}
                </div>
            )}
        </div>

        {products.length > 0 && (
            <button 
                onClick={clearAll}
                className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-red-600 uppercase tracking-[0.2em] transition-colors"
            >
                <X size={14} /> Clear All
            </button>
        )}
      </header>

      {/* Comparison Grid */}
      <div className="overflow-x-auto pb-12 scrollbar-thin">
        <div className="w-full" style={gridStyle}>
            
            {/* 1. Product Headers */}
            {/* Label Placeholder */}
            <div className="pt-24 md:pt-32 hidden md:block border-r border-transparent">
                <div className="text-gray-300 text-[10px] font-black uppercase tracking-[0.3em] border-l-4 border-blue-600 pl-4 py-2 sticky left-0">
                    COMPARISON <br /> MATRIX
                </div>
            </div>
            {/* Mobile small spacer if needed */}
            <div className="md:hidden"></div>

            {products.map((product) => (
                <div key={product.id} className="flex flex-col h-full bg-white border-2 border-black p-3 md:p-5 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-1 transition-all mx-1">
                    <button 
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute top-1 right-1 w-6 h-6 md:w-8 md:h-8 bg-black text-white flex items-center justify-center rounded-none hover:bg-red-600 transition-colors z-30 border-2 border-black"
                    >
                        <Trash2 size={14} />
                    </button>

                    <div className="aspect-square bg-gray-50 rounded-none mb-4 md:mb-6 flex items-center justify-center p-2 md:p-4 border border-gray-100 font-black text-gray-200 text-[8px] md:text-xs uppercase text-center overflow-hidden">
                        {product.image_url ? (
                            <img src={product.image_url} alt="" className="w-full h-full object-contain" />
                        ) : (
                            "NO_IMG"
                        )}
                    </div>
                    
                    <h3 className="font-black text-[9px] md:text-xs text-black uppercase tracking-tight leading-tight mb-4 h-10 md:h-12 line-clamp-3">
                        {product.name}
                    </h3>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100">
                         <a 
                            href={product.url || product.prices?.[0]?.url || "#"} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2 bg-black hover:bg-blue-600 text-white rounded-none text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-colors whitespace-nowrap px-1"
                         >
                            <span className="hidden sm:inline">Link</span>
                         </a>
                    </div>
                </div>
            ))}
            
            {/* Clickable Placeholders */}
            {[...Array(placeholdersNeeded)].map((_, i) => (
                <button 
                    key={`placeholder-${i}`} 
                    onClick={openSelectionModal}
                    className="bg-gray-50 rounded-none border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[250px] md:min-h-[350px] hover:border-black hover:bg-white transition-all group mx-1"
                >
                                            <div className="text-center p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                                <Plus size={40} className="mx-auto text-black mb-2 md:mb-4" />
                                                <div className="text-[8px] md:text-[11px] font-black text-black uppercase tracking-[0.2em]">Insert</div>
                                            </div>
                    
                </button>
            ))}
        </div>

        {/* Rows sections */}
        <div className="mt-8 md:mt-12 space-y-8 md:space-y-12">
            {/* 2. Top Level Rows (Price, etc) */}
            {products.length > 0 && (
                <div className="border-2 border-black bg-white" style={gridStyle}>
                    {topLevelRows.map((row) => (
                        <>
                            <div key={row.label} className="p-3 md:p-5 bg-gray-50 font-black text-[9px] md:text-[11px] text-gray-400 uppercase tracking-[0.2em] flex items-center border-r border-black sticky left-0 z-20">
                                {row.label}
                            </div>
                            {products.map(product => (
                                <div key={product.id} className={`p-3 md:p-5 text-sm md:text-lg font-black border-r border-black last:border-0 ${row.color || 'text-black'} font-mono text-center md:text-left`}>
                                    {row.format(product[row.key as keyof Component])}
                                </div>
                            ))}
                            {/* Empty cells for placeholders to maintain grid */}
                            {[...Array(placeholdersNeeded)].map((_, i) => (
                                <div key={i} className="border-r border-black last:border-0 bg-gray-50/20"></div>
                            ))}
                        </>
                    ))}
                </div>
            )}

            {/* 3. Specs Rows */}
            {products.length > 0 && (
                <div className="border-2 border-black bg-white" style={gridStyle}>
                    {allSpecKeys.sort().map((key) => (
                        <>
                            <div key={key} className="p-3 md:p-5 bg-gray-50/50 font-black text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.2em] flex items-center border-r border-black sticky left-0 z-20">
                                {key.replace(/_/g, ' ')}
                            </div>
                            {products.map(product => (
                                <div key={product.id} className="col-span-1 p-3 md:p-5 text-[10px] md:text-xs font-black text-black border-r border-gray-100 last:border-0 uppercase tracking-tight leading-relaxed min-w-0 break-words text-center md:text-left">
                                    {String(product.specs?.[key] ?? '-')}
                                </div>
                            ))}
                            {[...Array(placeholdersNeeded)].map((_, i) => (
                                <div key={i} className="border-r border-gray-100 last:border-0 bg-gray-50/10"></div>
                            ))}
                        </>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Product Selection Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Select ${selectedCategory.label} to Compare`}
      >
        {isModalLoading ? (
            <div className="text-center py-20 animate-pulse text-gray-300 font-black uppercase tracking-[0.3em] text-xs">
                Accessing hardware archives...
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                {modalProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-300 font-black uppercase text-[10px] tracking-[0.3em] italic border-2 border-dashed border-gray-100">
                        Zero hardware profiles match current query.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {modalProducts.map((product) => {
                            const isAlreadyAdded = products.find(p => p.id === product.id);
                            return (
                                <button
                                    key={product.id}
                                    disabled={!!isAlreadyAdded}
                                    onClick={() => {
                                        addToCompare(product);
                                        setIsModalOpen(false);
                                    }}
                                    className={`flex items-center gap-6 p-4 border-2 transition-all text-left group w-full ${
                                        isAlreadyAdded 
                                        ? 'bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed' 
                                        : 'bg-white border-black hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]'
                                    }`}
                                >
                                    <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 font-black text-[8px] text-gray-300 uppercase italic">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                            "NO IMG"
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-black text-black uppercase tracking-tight mb-1 truncate italic group-hover:text-blue-600">
                                            {product.name}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px] font-black text-blue-600 font-mono italic bg-blue-50 px-2 py-0.5">
                                                {product.price_pkr ? `Rs. ${product.price_pkr.toLocaleString()}` : 'PRICE_TBD'}
                                            </div>
                                            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                                {product.manufacturer} • {product.vendor || product.prices?.[0]?.vendor || 'AUTH_DEALER'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`w-10 h-10 flex items-center justify-center border-2 ${
                                        isAlreadyAdded 
                                        ? 'border-gray-100 bg-gray-50' 
                                        : 'border-black bg-white group-hover:bg-black group-hover:text-white'
                                    }`}>
                                        {isAlreadyAdded ? (
                                            <Check size={16} className="text-gray-300" />
                                        ) : (
                                            <Plus size={16} />
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