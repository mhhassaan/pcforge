import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white py-20 border-t-2 border-black text-black font-sans">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 max-w-[1400px]">
            <div>
                <h4 className="font-black uppercase mb-6 tracking-[0.3em] text-[10px] text-gray-400">Products</h4>
                <ul className="space-y-3 font-bold uppercase text-[11px] tracking-tight">
                    <li><Link to="/builder" className="hover:text-blue-600 transition-colors">System Builder</Link></li>
                    <li><Link to="/components" className="hover:text-blue-600 transition-colors">Component DB</Link></li>
                    <li><Link to="/compare" className="hover:text-blue-600 transition-colors">Side-by-Side</Link></li>
                    <li><Link to="/gallery" className="hover:text-blue-600 transition-colors">Build Gallery</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-black uppercase mb-6 tracking-[0.3em] text-[10px] text-gray-400">Information</h4>
                <ul className="space-y-3 font-bold uppercase text-[11px] tracking-tight">
                    <li><Link to="/guide" className="hover:text-blue-600 transition-colors">Assembly Guide</Link></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Latest News</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-black uppercase mb-6 tracking-[0.3em] text-[10px] text-gray-400">Connect</h4>
                <ul className="space-y-3 font-bold uppercase text-[11px] tracking-tight">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Discord</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Twitter</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Instagram</a></li>
                </ul>
            </div>
             <div>
                <h4 className="font-black uppercase mb-6 tracking-[0.3em] text-[10px] text-gray-400">Legal</h4>
                <ul className="space-y-3 font-bold uppercase text-[11px] tracking-tight">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Service Terms</a></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1400px]">
            <div className="font-black uppercase text-[10px] tracking-[0.2em] text-gray-400">&copy; 2026 PCFORGE INSTRUMENTS. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-8">
                <div className="text-xs font-black uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">GITHUB</div>
                <div className="text-xs font-black uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">DOCS</div>
            </div>
        </div>
    </footer>
  );
}
