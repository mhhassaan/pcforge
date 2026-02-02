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
  const [isSearching, setIsSearching] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState<Component[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const openSelectionModal = async () => {
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

    setIsSearching(true);
    try {
      const data = await fetchComponents(selectedCategory.value, query);
      setSearchResults(data.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const addToCompare = (product: Component) => {
    if (products.length >= 5) {
      alert("You can compare up to 5 products.");
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

  return (
    <div className="min-h-screen bg-white text-black font-sans p-4 md:p-8 selection:bg-blue-600 selection:text-white">
      {/* Header / Controls */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-gray-50 p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic whitespace-nowrap">SIDE-BY-SIDE</h1>
          
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-3 bg-white border border-black hover:bg-gray-100 text-black px-4 py-2 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-colors outline-none focus:ring-2 focus:ring-blue-600">
                {selectedCategory.label}
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
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder={`FIND ${selectedCategory.label}...`} 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-white border border-black rounded-none py-2.5 pl-10 pr-4 text-black text-[10px] font-black placeholder:text-gray-300 focus:border-blue-600 outline-none transition-all uppercase tracking-[0.2em]"
                />
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
                    {searchResults.map(product => (
                        <button 
                            key={product.id}
                            onClick={() => addToCompare(product)}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 text-left transition-colors border-b border-gray-100 last:border-0"
                        >
                            <div className="w-10 h-10 bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-[8px] text-gray-400 font-black uppercase">IMG</span>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-black uppercase tracking-tight line-clamp-1">{product.name}</div>
                                <div className="text-[10px] text-blue-600 font-mono font-black">
                                    {product.price_pkr ? `Rs. ${product.price_pkr.toLocaleString()}` : 'Price TBD'}
                                </div>
                            </div>
                            <Plus size={16} className="ml-auto text-gray-300 hover:text-black" />
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
        <div className="min-w-[1200px]">
            
            {/* 1. Product Headers */}
            <div className="grid grid-cols-6 gap-6 mb-12">
                <div className="col-span-1 pt-32 hidden md:block">
                    <div className="text-gray-300 text-[10px] font-black uppercase tracking-[0.3em] border-l-4 border-blue-600 pl-4 py-2">
                        COMPARISON <br /> MATRIX
                    </div>
                </div>
                {products.map((product) => (
                    <div key={product.id} className="col-span-1 flex flex-col h-full bg-white border-2 border-black p-5 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-1 transition-all">
                        <button 
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white flex items-center justify-center rounded-none hover:bg-red-600 transition-colors z-10 border-2 border-black"
                        >
                            <Trash2 size={14} />
                        </button>

                        <div className="aspect-square bg-gray-50 rounded-none mb-6 flex items-center justify-center p-4 border border-gray-100 italic font-black text-gray-200 text-xs uppercase text-center">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                            ) : (
                                "No hardware visual"
                            )}
                        </div>
                        
                        <h3 className="font-black text-[11px] text-black uppercase tracking-tight leading-tight mb-4 h-12 line-clamp-3 italic">
                            {product.name}
                        </h3>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100">
                             <a 
                                href={product.url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2 bg-black hover:bg-blue-600 text-white rounded-none text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
                             >
                                Vendor Link
                             </a>
                        </div>
                    </div>
                ))}
                
                {/* Clickable Placeholders */}
                {[...Array(5 - products.length)].map((_, i) => (
                    <button 
                        key={`placeholder-${i}`} 
                        onClick={openSelectionModal}
                        className="col-span-1 bg-gray-50 rounded-none border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[350px] hover:border-black hover:bg-white transition-all group"
                    >
                        <div className="text-center p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Plus size={40} className="mx-auto text-black mb-4" />
                            <div className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Insert Device</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* 2. Top Level Rows (Price, etc) */}
            {products.length > 0 && (
                <div className="border-2 border-black mb-12 bg-white">
                    {topLevelRows.map((row) => (
                        <div key={row.label} className="grid grid-cols-6 border-b border-black last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="col-span-1 p-5 bg-gray-50 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] flex items-center border-r border-black italic">
                                {row.label}
                            </div>
                            {products.map(product => (
                                <div key={product.id} className={`col-span-1 p-5 text-base font-black border-r border-black last:border-0 ${row.color || 'text-black'} font-mono`}>
                                    {row.format((product as any)[row.key])}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* 3. Specs Rows */}
            {products.length > 0 && (
                <div className="border-2 border-black bg-white">
                    {allSpecKeys.sort().map((key) => (
                        <div key={key} className="grid grid-cols-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="col-span-1 p-5 bg-gray-50/50 font-black text-[9px] text-gray-400 uppercase tracking-[0.2em] flex items-center border-r border-black">
                                {key.replace(/_/g, ' ')}
                            </div>
                            {products.map(product => (
                                <div key={product.id} className="col-span-1 p-5 text-[10px] font-black text-black border-r border-gray-100 last:border-0 uppercase tracking-wide leading-relaxed">
                                    {String(product.specs?.[key] ?? '-')}
                                </div>
                            ))}
                        </div>
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
                    <div className="text-center py-10 text-gray-300 font-black uppercase text-[10px] tracking-widest italic">No hardware profiles found.</div>
                ) : (
                    modalProducts.map((product) => {
                        const isAlreadyAdded = products.find(p => p.id === product.id);
                        return (
                            <button
                                key={product.id}
                                disabled={!!isAlreadyAdded}
                                onClick={() => {
                                    addToCompare(product);
                                    setIsModalOpen(false);
                                }}
                                className={`flex items-center justify-between p-5 rounded-none border-2 transition-all text-left group ${
                                    isAlreadyAdded 
                                    ? 'bg-gray-50 border-gray-100 opacity-30 cursor-not-allowed' 
                                    : 'bg-white border-gray-100 hover:border-black hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex-1 pr-4">
                                    <div className="text-[11px] font-black text-black uppercase tracking-tight mb-2 italic group-hover:text-blue-600">{product.name}</div>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-[10px] font-black text-blue-600 font-mono">
                                            {product.price_pkr ? `Rs. ${product.price_pkr.toLocaleString()}` : 'Price TBD'}
                                        </div>
                                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5">{product.vendor || 'Unknown Source'}</div>
                                    </div>
                                </div>
                                {isAlreadyAdded ? (
                                    <Check size={18} className="text-gray-300" />
                                ) : (
                                    <Plus size={18} className="text-gray-200 group-hover:text-black" />
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        )}
      </Modal>
    </div>
  );
}