import { Link, useLocation } from 'react-router-dom';
import { Hammer, Monitor, Cpu, Image as ImageIcon, Menu, X, LogIn, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: 'Components', href: '/components', icon: Cpu },
    { name: 'Builder', href: '/builder', icon: Hammer },
    { name: 'Compare', href: '/compare', icon: Monitor },
    { name: 'Guide', href: '/guide', icon: BookOpen },
    { name: 'Gallery', href: '/gallery', icon: ImageIcon },
  ];

  return (
    <nav className="sticky top-0 z-[200] w-full bg-white/80 backdrop-blur-md border-b border-black font-sans text-black">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
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
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/builder"
            className="bg-black text-white text-[10px] font-black px-6 py-2.5 rounded-none transition-all hover:bg-blue-600 uppercase tracking-widest border border-black"
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
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-4 shadow-2xl absolute w-full left-0">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-xs font-black text-slate-400 p-3 hover:bg-slate-800 rounded-lg uppercase tracking-widest"
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
             <Link 
                to="/login"
                className="flex items-center gap-2 justify-center w-full py-3 border border-slate-700 rounded-lg font-black text-slate-300 hover:bg-slate-800 uppercase text-xs tracking-widest"
             >
                <LogIn size={18} /> Sign In
             </Link>
             <Link 
                to="/builder"
                className="flex items-center gap-2 justify-center w-full py-3 bg-blue-600 text-white rounded-lg font-black hover:bg-blue-700 uppercase text-xs tracking-widest"
             >
                <Hammer size={18} /> Start Building
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
