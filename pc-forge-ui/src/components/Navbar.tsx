import { Link, useLocation } from 'react-router-dom';
import { Hammer, Monitor, Cpu, Image as ImageIcon, Menu, X, BookOpen, ChevronDown, Layout, Zap, HardDrive, Box, ShieldCheck, LogOut, Folder, Moon, Sun } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComponentsHovered, setIsComponentsHovered] = useState(false);
  const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Check for admin status
  const userStr = localStorage.getItem('pcforge_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.email?.endsWith('@pcforge.pk');

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSubMenuOpen(false);
  }, [pathname]);

  // Calculate nav offset for full-width dropdown
  useEffect(() => {
    const updateOffset = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        navRef.current.style.setProperty('--nav-offset', `${rect.left}px`);
      }
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: ShieldCheck }] : []),
    { name: 'Components', href: '/components', icon: Cpu, dropdown: true },
    { name: 'Builder', href: '/builder', icon: Hammer },
    { name: 'Compare', href: '/compare', icon: Monitor },
    { name: 'Guide', href: '/guide', icon: BookOpen },
    { name: 'Gallery', href: '/gallery', icon: ImageIcon },
    ...(user ? [{ name: 'My Builds', href: '/my-builds', icon: Folder }] : []),
  ];

  return (
    <nav className="sticky top-0 z-[200] w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-black dark:border-white/5 font-sans text-black dark:text-white transition-colors duration-300">
      <div ref={navRef} className="w-full mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-black dark:bg-blue-600 text-white p-1.5 rounded-none transition-transform group-hover:rotate-90">
            <Monitor size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-black dark:text-white transition-colors uppercase">
            PC <span className="bg-black dark:bg-blue-600 text-white px-1">Forge</span>
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
                      active ? 'text-blue-600 dark:text-blue-400 border-b-2 border-black dark:border-blue-400' : 'text-gray-500 dark:text-slate-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {link.name} <ChevronDown size={12} className={`transition-transform ${isComponentsHovered ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  active ? 'text-blue-600 dark:text-blue-400 border-b-2 border-black dark:border-blue-400' : 'text-gray-500 dark:text-slate-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 border border-black dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-black dark:text-white"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <button
              onClick={() => { localStorage.removeItem('pcforge_user'); localStorage.removeItem('admin_access'); window.location.reload(); }}
              className="text-[10px] font-black px-6 py-2.5 rounded-none transition-all hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 border border-black dark:border-red-600/50 uppercase tracking-widest italic flex items-center gap-2"
            >
              Sign Out <LogOut size={14} />
            </button>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-black px-6 py-2.5 rounded-none transition-all hover:bg-gray-100 dark:hover:bg-white/5 uppercase tracking-widest border border-black dark:border-white/10 italic"
            >
              Sign In
            </Link>
          )}
          <Link
            to="/builder"
            className="bg-black dark:bg-blue-600 text-white text-[10px] font-black px-6 py-2.5 rounded-none transition-all hover:bg-blue-600 dark:hover:bg-blue-500 uppercase tracking-widest border border-black dark:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)]"
          >
            Start Building
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="p-2 text-slate-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Horizontal Dropdown (Limited to Navbar Width) */}
        <div 
          onMouseEnter={() => setIsComponentsHovered(true)}
          onMouseLeave={() => setIsComponentsHovered(false)}
          className={`absolute top-[calc(100%)] left-0 w-full bg-white dark:bg-[#0a0a0a] border-b-4 border-black dark:border-blue-600 shadow-[0px_16px_20px_rgba(0,0,0,0.1)] p-8 transition-all duration-300 hidden md:block z-[-1] ${
            isComponentsHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="grid grid-cols-7 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.value}
                  to={`/components?category=${cat.value}`}
                  className="group/item flex flex-col items-center text-center p-4 border-2 border-transparent hover:border-black dark:hover:border-blue-600 transition-all bg-gray-50 dark:bg-[#121212] hover:bg-white dark:hover:bg-[#1a1a1a]"
                >
                  <div className="mb-4 text-gray-300 dark:text-slate-700 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest leading-tight italic">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black dark:border-blue-600 bg-white dark:bg-[#0a0a0a] px-4 py-6 space-y-2 shadow-2xl absolute w-full left-0 animate-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const hasDropdown = link.dropdown;
            
            return (
              <div key={link.name} className="space-y-1">
                {hasDropdown ? (
                  <button
                    onClick={() => setIsMobileSubMenuOpen(!isMobileSubMenuOpen)}
                    className="flex items-center justify-between w-full text-[11px] font-black text-gray-400 dark:text-slate-500 p-4 hover:bg-gray-50 dark:hover:bg-[#121212] border border-transparent hover:border-black dark:hover:border-blue-600 transition-all uppercase tracking-widest"
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
                    className="flex items-center justify-between text-[11px] font-black text-gray-400 dark:text-slate-500 p-4 hover:bg-gray-50 dark:hover:bg-[#121212] border border-transparent hover:border-black dark:hover:border-blue-600 transition-all uppercase tracking-widest"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={18} />
                      {link.name}
                    </div>
                  </Link>
                )}
                
                {hasDropdown && isMobileSubMenuOpen && (
                  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 dark:bg-[#121212] border-2 border-gray-200 dark:border-white/5 animate-in fade-in zoom-in-95 duration-200 mt-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.value}
                        to={`/components?category=${cat.value}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileSubMenuOpen(false);
                        }}
                        className="text-[9px] font-black text-black dark:text-white p-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 hover:border-black dark:hover:border-blue-600 uppercase tracking-tight leading-tight flex items-center justify-center text-center italic"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-6 border-t-2 border-black dark:border-white/5 flex flex-col gap-3">
             {user ? (
               <button 
                onClick={() => { localStorage.removeItem('pcforge_user'); localStorage.removeItem('admin_access'); window.location.reload(); }}
                className="flex items-center gap-2 justify-center w-full py-4 border-2 border-black dark:border-red-600/50 font-black text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 uppercase text-[10px] tracking-widest transition-all italic"
               >
                Sign Out <LogOut size={18} />
               </button>
             ) : (
               <Link 
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 justify-center w-full py-4 border-2 border-black dark:border-white/10 font-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 uppercase text-[10px] tracking-widest transition-all italic"
               >
                Sign In
               </Link>
             )}
             <Link 
                to="/builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 justify-center w-full py-4 bg-black dark:bg-blue-600 text-white font-black hover:bg-blue-600 dark:hover:bg-blue-500 uppercase text-[10px] tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
             >
                <Hammer size={18} /> Start Building
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
