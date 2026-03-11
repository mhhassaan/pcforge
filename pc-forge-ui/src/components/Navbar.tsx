import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Monitor, Cpu, Menu, X, 
  ChevronDown, Layout, Zap, HardDrive, MemoryStick, 
  Box, LogOut, Moon, Sun
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { label: 'Processors', value: 'cpu', icon: Cpu },
  { label: 'Graphics Cards', value: 'gpu', icon: Monitor },
  { label: 'Motherboards', value: 'motherboard', icon: Layout },
  { label: 'Memory', value: 'ram', icon: MemoryStick },
  { label: 'Storage', value: 'storage', icon: HardDrive },
  { label: 'Power Supplies', value: 'psu', icon: Zap },
  { label: 'Chassis', value: 'case', icon: Box },
];

interface NavLink {
    name: string;
    href: string;
    icon?: any;
    dropdown?: boolean;
}

interface AnimatedLinkProps {
    to?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    children: React.ReactNode;
    className?: string;
    active?: boolean;
    hasDropdown?: boolean;
    highlightColor?: string;
    icon?: React.ReactNode;
}

const AnimatedNavLink = ({ 
    to, 
    onClick, 
    onMouseEnter, 
    onMouseLeave, 
    children, 
    className, 
    active, 
    hasDropdown, 
    highlightColor = "bg-blue-600/10 dark:bg-blue-600/20", 
    icon 
}: AnimatedLinkProps) => {
    const circleRef = useRef<HTMLSpanElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const hoverLabelRef = useRef<HTMLSpanElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (circleRef.current && labelRef.current && hoverLabelRef.current) {
            tl.current = gsap.timeline({ paused: true });
            tl.current.to(circleRef.current, { scaleY: 1, duration: 0.3, ease: 'power2.out' }, 0)
              .to(labelRef.current, { y: -20, opacity: 0, duration: 0.25, ease: 'power2.inOut' }, 0)
              .to(hoverLabelRef.current, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.inOut' }, 0);
        }
        return () => { tl.current?.kill(); };
    }, []);

    const handleEnter = () => {
        tl.current?.play();
        onMouseEnter?.();
    };
    
    const handleLeave = () => {
        tl.current?.reverse();
        onMouseLeave?.();
    };

    const Content = (
        <>
            <span ref={circleRef} className={cn("absolute inset-0 scale-y-0 origin-bottom pointer-events-none transition-colors", highlightColor)} />
            <span className="relative flex flex-col items-center">
                <span ref={labelRef} className="flex items-center gap-1.5 transition-all">
                    {icon} {children} {hasDropdown && <ChevronDown size={10} strokeWidth={3} className="opacity-50" />}
                </span>
                <span ref={hoverLabelRef} className="absolute top-0 flex items-center gap-1.5 opacity-0 translate-y-5 text-blue-600 dark:text-blue-400">
                    {icon} {children} {hasDropdown && <ChevronDown size={10} strokeWidth={3} />}
                </span>
            </span>
            {active && <span className="absolute bottom-1 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />}
        </>
    );

    const classes = cn("relative flex items-center justify-center overflow-hidden transition-all", className);

    if (to) {
        return (
            <Link to={to} className={classes} onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={onClick}>
                {Content}
            </Link>
        );
    }

    return (
        <button className={classes} onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={onClick}>
            {Content}
        </button>
    );
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComponentsHovered, setIsComponentsHovered] = useState(false);
  const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);

  // Check for admin status
  const userStr = localStorage.getItem('pcforge_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.email?.endsWith('@pcforge.pk');

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSubMenuOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('pcforge_user');
    localStorage.removeItem('admin_access');
    navigate('/login');
    window.location.reload();
  };

  const navLinks: NavLink[] = [
    { name: 'Components', href: '/components', dropdown: true },
    { name: 'Builder', href: '/builder' },
    { name: 'Compare', href: '/compare' },
    { name: 'Guide', href: '/guide' },
    { name: 'Gallery', href: '/gallery' },
    ...(user ? [{ name: 'Archives', href: '/my-builds' }] : []),
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-[200] w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-black dark:border-white/5 font-sans text-black dark:text-white transition-colors duration-300">
      <div className="w-full mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
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
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <AnimatedNavLink
              key={link.name}
              to={link.href}
              active={pathname === link.href}
              hasDropdown={link.dropdown}
              className={cn(
                "h-10 px-5 text-[10px] font-mono font-black uppercase tracking-[0.2em]",
                pathname === link.href ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-slate-400"
              )}
              onMouseEnter={() => { if(link.dropdown) setIsComponentsHovered(true) }}
              onMouseLeave={() => { if(link.dropdown) setIsComponentsHovered(false) }}
            >
              {link.name}
            </AnimatedNavLink>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 border border-black dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-black dark:text-white"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <AnimatedNavLink
              onClick={handleSignOut}
              className="text-[10px] font-mono font-black px-6 h-10 transition-all text-red-600 border border-black dark:border-red-600/50 uppercase tracking-widest italic"
              highlightColor="bg-red-600/10"
              icon={<LogOut size={14} />}
            >
              Sign Out
            </AnimatedNavLink>
          ) : (
            <AnimatedNavLink
              to="/login"
              className="text-[10px] font-mono font-black px-6 h-10 transition-all text-black dark:text-white border border-black dark:border-white/10 uppercase tracking-widest italic"
              highlightColor="bg-black/5 dark:bg-white/5"
            >
              Sign In
            </AnimatedNavLink>
          )}
          
          <AnimatedNavLink
            to="/builder"
            className="bg-black dark:bg-blue-600 text-white text-[10px] font-mono font-black px-8 h-10 transition-all border border-black dark:border-blue-600 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            highlightColor="bg-blue-500/20"
          >
            Build
          </AnimatedNavLink>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-400"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Components Dropdown */}
        <div 
          onMouseEnter={() => setIsComponentsHovered(true)}
          onMouseLeave={() => setIsComponentsHovered(false)}
          className={`absolute top-full left-0 w-full bg-white dark:bg-[#0a0a0a] border-b-4 border-black dark:border-blue-600 shadow-2xl p-8 transition-all duration-300 hidden md:block z-[-1] ${
            isComponentsHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="grid grid-cols-7 gap-2 max-w-[1400px] mx-auto">
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
                  <span className="text-[10px] font-mono font-black text-black dark:text-white uppercase tracking-widest leading-tight italic">
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
          {navLinks.map((link) => (
            <div key={link.name} className="space-y-1">
                {link.dropdown ? (
                  <button
                    onClick={() => setIsMobileSubMenuOpen(!isMobileSubMenuOpen)}
                    className="flex items-center justify-between w-full text-[11px] font-mono font-black text-gray-400 dark:text-slate-500 p-4 hover:bg-gray-50 dark:hover:bg-[#121212] border border-transparent hover:border-black dark:hover:border-blue-600 transition-all uppercase tracking-widest italic"
                  >
                    <div className="flex items-center gap-4">
                      {link.icon && <link.icon size={18} />}
                      {link.name}
                    </div>
                    <ChevronDown size={14} className={`transition-transform ${isMobileSubMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between text-[11px] font-mono font-black text-gray-400 dark:text-slate-500 p-4 hover:bg-gray-50 dark:hover:bg-[#121212] border border-transparent hover:border-black dark:hover:border-blue-600 transition-all uppercase tracking-widest italic"
                  >
                    <div className="flex items-center gap-4">
                      {link.icon && <link.icon size={18} />}
                      {link.name}
                    </div>
                  </Link>
                )}
                
                {link.dropdown && isMobileSubMenuOpen && (
                  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 dark:bg-[#121212] border-2 border-gray-200 dark:border-white/5 animate-in fade-in zoom-in-95 duration-200 mt-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.value}
                        to={`/components?category=${cat.value}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileSubMenuOpen(false);
                        }}
                        className="text-[9px] font-mono font-black text-black dark:text-white p-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 hover:border-black dark:hover:border-blue-600 uppercase tracking-tight leading-tight flex items-center justify-center text-center italic"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
