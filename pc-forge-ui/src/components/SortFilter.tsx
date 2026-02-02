import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const SORT_OPTIONS = [
  { label: 'RECOMMENDED', value: ':asc' },
  { label: 'PRICE: LOW TO HIGH', value: 'price_pkr:asc' },
  { label: 'PRICE: HIGH TO LOW', value: 'price_pkr:desc' },
  { label: 'NAME: A TO Z', value: 'product_name:asc' },
  { label: 'NAME: Z TO A', value: 'product_name:desc' },
];

export default function SortFilter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const currentSort = searchParams.get('sort_by') || '';
  const currentOrder = searchParams.get('order') || 'asc';
  const currentValue = `${currentSort}:${currentOrder}`;

  const selectedOption = SORT_OPTIONS.find(opt => opt.value === currentValue) || SORT_OPTIONS[0];

  const handleSortChange = (value: string) => {
    const [sort, order] = value.split(':');
    const params = new URLSearchParams(searchParams.toString());
    
    if (sort) {
      params.set('sort_by', sort);
      params.set('order', order);
    } else {
      params.delete('sort_by');
      params.delete('order');
    }
    
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SORT BY:</label>
      
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wide transition-colors outline-none focus:ring-2 focus:ring-blue-500/50">
            {selectedOption.label}
            <ChevronDown size={14} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1 w-56 z-[100] animate-in fade-in zoom-in-95 duration-100" sideOffset={5} align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenu.Item 
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer outline-none uppercase tracking-wide"
                onSelect={() => handleSortChange(option.value)}
              >
                {currentValue === option.value && <Check size={14} className="text-blue-500" />}
                <span className={currentValue === option.value ? 'text-white' : ''}>{option.label}</span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
