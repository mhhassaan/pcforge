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
  const currentValue = currentSort ? `${currentSort}:${currentOrder}` : ':asc';

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
      <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] italic">ORGANIZE:</label>
      
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] border border-black dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#252525] text-black dark:text-white px-4 py-1.5 rounded-none font-black text-[10px] uppercase tracking-widest transition-colors outline-none focus:ring-2 focus:ring-blue-600">
            {selectedOption.label}
            <ChevronDown size={14} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-blue-600 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)] p-1 w-56 z-[100] animate-in fade-in zoom-in-95 duration-100" sideOffset={5} align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenu.Item 
                key={option.value}
                className="flex items-center justify-between px-3 py-2 text-[10px] font-black text-gray-400 dark:text-slate-500 hover:text-white hover:bg-black dark:hover:bg-blue-600 rounded-none cursor-pointer outline-none uppercase tracking-widest"
                onSelect={() => handleSortChange(option.value)}
              >
                <span>{option.label}</span>
                {currentValue === option.value && <Check size={12} className="text-blue-600 dark:text-blue-400" />}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
