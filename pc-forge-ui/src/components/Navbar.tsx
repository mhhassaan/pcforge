import { Link, useLocation } from 'react-router-dom';
import { Hammer, Monitor, Cpu, Image as ImageIcon, Menu, X, BookOpen, ChevronDown, Layout, Zap, HardDrive, Box } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { label: 'Processors', value: 'cpu', icon: Cpu },
  { label: 'Graphics Cards', value: 'gpu', icon: Monitor },
  { label: 'Motherboards', value: 'motherboard', icon: Layout },
  { label: 'Memory', value: 'ram', icon: Zap },
  { label: 'Storage', value: 'storage', icon: HardDrive },
  { label: 'Power Supplies', value: 'psu', icon: Zap },
  { label: 'Chassis', value: 'case', icon: Box },
];

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComponentsHovered, setIsComponentsHovered] = useState(false);
  const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: 'Components', href: '/components', icon: Cpu, dropdown: true },
    { name: 'Builder', href: '/builder', icon: Hammer },
    { name: 'Compare', href: '/compare', icon: Monitor },
    { name: 'Guide', href: '/guide', icon: BookOpen },
    { name: 'Gallery', href: '/gallery', icon: ImageIcon },
  ];

  return (
    <nav className="sticky top-0 z-[200] w-full bg-white/80 backdrop-blur-md border-b border-black font-sans text-black">
      <div className="w-full mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-black text-white p-1.5 rounded-none transition-transform group-hover:rotate-90">
            <Monitor size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-black transition-colors uppercase">
            PC <span className="bg-black text-white px-1">Forge</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            
            if (link.dropdown) {
              return (
                <div 
                  key={link.name} 
                  className="h-16 flex items-center"
                  onMouseEnter={() => setIsComponentsHovered(true)}
                  onMouseLeave={() => setIsComponentsHovered(false)}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all py-2 ${
                      active ? 'text-blue-600 border-b-2 border-black' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {link.name} <ChevronDown size={12} className={`transition-transform ${isComponentsHovered ? 'rotate-180' : ''}`} />
                  </Link>

                  {/* Horizontal Full-Width Dropdown */}
                  {isComponentsHovered && (
                    <div className="absolute top-full left-0 w-full bg-white border-b-4 border-black shadow-[0px_16px_20px_rgba(0,0,0,0.1)] p-8 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="max-w-[1400px] mx-auto grid grid-cols-7 gap-4">
                        {CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <Link
                              key={cat.value}
                              to={`/components?category=${cat.value}`}
                              className="group/item flex flex-col items-center text-center p-4 border-2 border-transparent hover:border-black transition-all bg-gray-50 hover:bg-white"
                            >
                              <div className="mb-4 text-gray-300 group-hover/item:text-blue-600 transition-colors">
                                <Icon size={32} strokeWidth={1.5} />
                              </div>
                              <span className="text-[10px] font-black text-black uppercase tracking-widest leading-tight italic">
                                {cat.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  active ? 'text-blue-600 border-b-2 border-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-[10px] font-black px-6 py-2.5 rounded-none transition-all hover:bg-gray-100 uppercase tracking-widest border border-black italic"
          >
            Sign In
          </Link>
          <Link
            to="/builder"
            className="bg-black text-white text-[10px] font-black px-6 py-2.5 rounded-none transition-all hover:bg-blue-600 uppercase tracking-widest border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
          >
            Start Building
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-400"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 py-6 space-y-2 shadow-2xl absolute w-full left-0 animate-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const hasDropdown = link.dropdown;
            
            return (
              <div key={link.name} className="space-y-1">
                {hasDropdown ? (
                  <button
                    onClick={() => setIsMobileSubMenuOpen(!isMobileSubMenuOpen)}
                    className="flex items-center justify-between w-full text-[11px] font-black text-gray-400 p-4 hover:bg-gray-50 border border-transparent hover:border-black transition-all uppercase tracking-widest"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={18} />
                      {link.name}
                    </div>
                    <ChevronDown size={14} className={`transition-transform ${isMobileSubMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between text-[11px] font-black text-gray-400 p-4 hover:bg-gray-50 border border-transparent hover:border-black transition-all uppercase tracking-widest"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={18} />
                      {link.name}
                    </div>
                  </Link>
                )}
                
                {hasDropdown && isMobileSubMenuOpen && (
                  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 border-x border-b border-black animate-in fade-in zoom-in-95 duration-200">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.value}
                        to={`/components?category=${cat.value}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileSubMenuOpen(false);
                        }}
                        className="text-[9px] font-black text-black p-2.5 bg-white border border-gray-200 hover:border-black uppercase tracking-tight leading-tight flex items-center justify-center text-center italic"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-6 border-t-2 border-black flex flex-col gap-3">
             <Link 
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 justify-center w-full py-4 border-2 border-black font-black hover:bg-gray-50 uppercase text-[10px] tracking-widest transition-all italic"
             >
                Sign In
             </Link>
             <Link 
                to="/builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 justify-center w-full py-4 bg-black text-white font-black hover:bg-blue-600 uppercase text-[10px] tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
             >
                <Hammer size={18} /> Start Building
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
