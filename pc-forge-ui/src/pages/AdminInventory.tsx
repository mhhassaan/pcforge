import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchIncompleteProducts, fetchCategorySchema, updateProductSpecs } from '../api/pcforge';
import { 
  Package, 
  AlertTriangle, 
  ChevronRight, 
  Save, 
  X,
  Search,
  CheckCircle2,
  Database,
  Lock,
  ArrowLeft
} from 'lucide-react';

const CATEGORIES = [
  { label: 'CPU', value: 'cpu' },
  { label: 'Motherboard', value: 'motherboard' },
  { label: 'RAM', value: 'ram' },
  { label: 'GPU', value: 'gpu' },
  { label: 'Power Supply', value: 'psu' },
  { label: 'Case', value: 'case' },
  { label: 'Storage', value: 'storage' },
];

export default function AdminInventory() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [category, setCategory] = useState('cpu');
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [schema, setSchema] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const access = localStorage.getItem('admin_access');
    if (access === 'true') {
        setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
        loadProducts();
    }
  }, [category, isAdmin]);

  const filteredProducts = products.filter(p => 
    p.product_name.toLowerCase().includes(search.toLowerCase()) ||
    p.product_id.toLowerCase().includes(search.toLowerCase()) ||
    p.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-[#121212] border-4 border-black dark:border-blue-600 p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(37,99,235,0.2)] text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 border-2 border-red-600 flex items-center justify-center mx-auto mb-6 text-red-600">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 italic dark:text-white">Restricted Access</h1>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-8">Authentication Required</p>
          <Link to="/admin" className="inline-block bg-black dark:bg-blue-600 text-white px-8 py-3 font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchIncompleteProducts(category);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = async (product: any) => {
    setEditingProduct(product);
    setSaveStatus('idle');
    try {
      const catSchema = await fetchCategorySchema(product.main_category);
      setSchema(catSchema);
      
      // Initialize form with existing specs
      const initialForm: any = {};
      catSchema.forEach(col => {
        initialForm[col.name] = product[col.name] ?? '';
      });
      setFormData(initialForm);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await updateProductSpecs({
        product_id: editingProduct.product_id,
        category: editingProduct.main_category,
        specs: formData
      });
      setSaveStatus('success');
      setTimeout(() => {
        setEditingProduct(null);
        loadProducts(); // Refresh list
      }, 1000);
    } catch (err) {
      setSaveStatus('error');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="bg-white dark:bg-[#121212] border-4 border-black dark:border-blue-600 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.2)] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black dark:bg-blue-600 text-white flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">Inventory_Manager</h1>
              <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Incomplete Specification Audit</p>
              <Link to="/admin" className="flex items-center gap-1 text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 hover:underline mt-2">
                <ArrowLeft size={10} /> Return to Console
              </Link>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black dark:border-white/10 transition-all ${
                  category === cat.value 
                  ? 'bg-black dark:bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]' 
                  : 'bg-white dark:bg-[#1a1a1a] text-black dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-[#252525]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List Section */}
          <div className="lg:col-span-12 bg-white dark:bg-[#121212] border-4 border-black dark:border-white/10 overflow-hidden">
            <div className="p-4 border-b-4 border-black dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-[#0a0a0a]/50">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-500" />
                    <span className="text-xs font-black uppercase tracking-widest dark:text-slate-300">Detected Anomalies ({filteredProducts.length})</span>
                </div>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" />
                    <input 
                        type="text" 
                        placeholder="Search queue..."
                        className="pl-10 pr-4 py-2 border-2 border-black dark:border-white/10 text-[10px] font-black uppercase outline-none focus:bg-white dark:bg-[#0a0a0a] dark:text-white dark:focus:bg-[#1a1a1a] w-48 md:w-64 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black dark:bg-[#0a0a0a] text-white">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r border-gray-800 dark:border-white/5">Product_Details</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r border-gray-800 dark:border-white/5">Category</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r border-gray-800 dark:border-white/5">Manufacturer</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black dark:divide-white/10">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center bg-white dark:bg-[#121212]">
                        <div className="animate-spin inline-block mb-4 dark:text-blue-400"><Database size={24} /></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-600 italic">Scanning Database...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center bg-white dark:bg-[#121212]">
                        <p className="text-lg font-black uppercase italic mb-2 dark:text-white">No Matches Found</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-600">Try adjusting your search query.</p>
                      </td>
                    </tr>
                  ) : filteredProducts.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors bg-white dark:bg-[#121212]">
                      <td className="p-4 border-r-2 border-black dark:border-white/10">
                        <p className="text-xs font-black uppercase leading-tight dark:text-white">{product.product_name}</p>
                        <p className="text-[9px] font-mono text-gray-400 dark:text-slate-600 mt-1">{product.product_id}</p>
                      </td>
                      <td className="p-4 border-r-2 border-black dark:border-white/10">
                        <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-tighter italic">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 border-r-2 border-black dark:border-white/10 text-xs font-black uppercase tracking-tight dark:text-slate-300">
                        {product.manufacturer}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => startEditing(product)}
                          className="px-4 py-2 bg-black dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center gap-2 mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                        >
                          Fill Specs <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#121212] border-8 border-black dark:border-blue-600 w-full max-w-2xl shadow-[16px_16px_0px_0px_rgba(37,99,235,1)] dark:shadow-[16px_16px_0px_0px_rgba(37,99,235,0.3)] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b-4 border-black dark:border-white/10 flex justify-between items-center bg-black dark:bg-[#0a0a0a] text-white">
              <div className="flex items-center gap-3">
                <Database size={20} className="text-blue-400" />
                <h2 className="text-xl font-black uppercase tracking-tighter italic">Spec_Override</h2>
              </div>
              <button onClick={() => setEditingProduct(null)} className="hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-8">
              <div className="bg-gray-50 dark:bg-[#0a0a0a] border-2 border-black dark:border-white/10 p-4 space-y-1">
                <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Target_Product</p>
                <p className="text-lg font-black uppercase italic leading-tight dark:text-white">{editingProduct.product_name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schema.map(col => (
                  <div key={col.name} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 flex justify-between">
                      {col.name.replace(/_/g, ' ')}
                      <span className="text-[8px] font-mono opacity-50">{col.type}</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full border-2 border-black dark:border-white/10 p-3 text-xs font-black uppercase outline-none bg-white dark:bg-[#0a0a0a] text-black dark:text-white focus:bg-blue-50 dark:focus:bg-[#1a1a1a] focus:border-blue-600 dark:focus:border-blue-500 transition-all"
                      value={formData[col.name] || ''}
                      onChange={e => setFormData({...formData, [col.name]: e.target.value})}
                      placeholder={`Enter ${col.name}...`}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button 
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className={`flex-1 py-4 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all ${
                    saveStatus === 'saving' ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed' :
                    saveStatus === 'success' ? 'bg-green-600 text-white' :
                    'bg-black dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
                  }`}
                >
                  {saveStatus === 'saving' ? 'Synchronizing...' : 
                   saveStatus === 'success' ? <><CheckCircle2 size={16} /> Update_Confirmed</> :
                   <><Save size={16} /> Commit_Changes</>}
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-8 py-4 border-4 border-black dark:border-white/10 font-black uppercase tracking-[0.3em] text-[10px] dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-all"
                >
                  Abort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
