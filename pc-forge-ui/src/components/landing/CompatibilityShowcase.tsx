import { CheckCircle2, AlertTriangle, Maximize } from 'lucide-react';
import { Highlighter } from '../ui/Highlighter';

export default function CompatibilityShowcase() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-16 border-l-4 border-blue-600 pl-6">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white uppercase tracking-tighter mb-4 italic">
            <Highlighter action="box" color="#2563EB" iterations={2}>STOP THE GUESSWORK</Highlighter>
          </h2>
          <p className="text-gray-500 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            Visual validation for critical hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
          {/* Error Example 1 */}
          <div className="bg-gray-50 dark:bg-[#121212] border-2 border-black dark:border-white/10 p-8 rounded-none space-y-6 relative group transition-colors">
            <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest font-mono">
                FAIL STATE
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-600 italic">PROCESSOR</span>
                    <span className="text-xs font-black uppercase dark:text-white">AMD RYZEN 7 7800X3D <span className="text-blue-600 dark:text-blue-400 text-[9px] ml-2">(AM5)</span></span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                    <span className="text-[10px] font-black uppercase text-red-400 italic">MOTHERBOARD</span>
                    <span className="text-xs font-black uppercase text-red-600 dark:text-red-400 underline decoration-2 underline-offset-4">ASUS ROG B450-F <span className="text-[9px] ml-2">(AM4)</span></span>
                </div>
            </div>

            <div className="pt-4 flex gap-4 border-t border-red-100 dark:border-red-900/20">
                <AlertTriangle className="text-red-600 dark:text-red-500 flex-shrink-0" size={24} />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-black dark:text-white uppercase italic">SOCKET MISMATCH</h4>
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                        AM5 CPU architecture is incompatible with AM4 socket interface.
                    </p>
                </div>
            </div>
          </div>

          {/* Error Example 2: GPU Clearance */}
          <div className="bg-gray-50 dark:bg-[#121212] border-2 border-black dark:border-white/10 p-8 rounded-none space-y-6 relative group transition-colors">
            <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest font-mono">
                FAIL STATE
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-600 italic">GRAPHICS CARD</span>
                    <span className="text-xs font-black uppercase dark:text-white">RTX 4090 STRIX <span className="text-blue-600 dark:text-blue-400 text-[9px] ml-2">(358MM)</span></span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                    <span className="text-[10px] font-black uppercase text-red-400 italic">CHASSIS</span>
                    <span className="text-xs font-black uppercase text-red-600 dark:text-red-400 underline decoration-2 underline-offset-4">NZXT H5 FLOW <span className="text-[9px] ml-2">(360MM MAX)</span></span>
                </div>
            </div>

            <div className="pt-4 flex gap-4 border-t border-red-100 dark:border-red-900/20">
                <Maximize className="text-red-600 dark:text-red-500 flex-shrink-0" size={24} />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-black dark:text-white uppercase italic">SPATIAL CONFLICT</h4>
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                        GPU length exceeds chassis clearance when front radiators are mounted.
                    </p>
                </div>
            </div>
          </div>

          {/* Success Example */}
          <div className="bg-gray-50 dark:bg-[#121212] border-2 border-black dark:border-blue-600 p-8 rounded-none space-y-6 relative group shadow-[12px_12px_0px_0px_rgba(37,99,235,1)] dark:shadow-[12px_12px_0px_0px_rgba(37,99,235,0.2)] transition-colors">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest font-mono">
                PASS STATE
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-600 italic">PROCESSOR</span>
                    <span className="text-xs font-black uppercase dark:text-white">AMD RYZEN 7 7800X3D <span className="text-blue-600 dark:text-blue-400 text-[9px] ml-2">(AM5)</span></span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
                    <span className="text-[10px] font-black uppercase text-green-600 dark:text-green-400 italic">MOTHERBOARD</span>
                    <span className="text-xs font-black uppercase text-green-600 dark:text-green-400">MSI MAG B650 TOMAHAWK <span className="text-[9px] ml-2">(AM5)</span></span>
                </div>
            </div>

            <div className="pt-4 flex gap-4 border-t border-blue-100 dark:border-blue-900/20">
                <CheckCircle2 className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-black dark:text-white uppercase italic">SYSTEM SYNCED</h4>
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                        Architecture parameters are fully aligned and compatible.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
