import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CompatibilityShowcase() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 ">
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-16 border-l-4 border-blue-600 pl-6">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white uppercase tracking-tighter mb-4">
            STOP THE GUESSWORK.
          </h2>
          <p className="text-gray-500 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            Visual validation for mission-critical hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Error Example */}
          <div className="bg-gray-50 dark:bg-slate-900/50 border-2 border-black dark:border-white/10 p-8 rounded-none space-y-6 relative group">
            <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                FAIL
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-600">PROCESSOR</span>
                    <span className="text-xs font-black uppercase dark:text-white">RYZEN 7 7800X3D</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
                    <span className="text-[10px] font-black uppercase text-red-400">MOTHERBOARD</span>
                    <span className="text-xs font-black uppercase text-red-600 dark:text-red-400 underline">ASUS B450-F</span>
                </div>
            </div>

            <div className="pt-4 flex gap-4 border-t border-red-100 dark:border-red-900/20">
                <AlertTriangle className="text-red-600 dark:text-red-500" size={24} />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-black dark:text-white uppercase">SOCKET MISMATCH</h4>
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase">Motherboard AM4 is incompatible with CPU AM5 Architecture.</p>
                </div>
            </div>
          </div>

          {/* Success Example */}
          <div className="bg-gray-50 dark:bg-slate-900/50 border-2 border-black dark:border-blue-600 p-8 rounded-none space-y-6 relative group shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)]">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                PASS
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-600">PROCESSOR</span>
                    <span className="text-xs font-black uppercase dark:text-white">RYZEN 7 7800X3D</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20  border border-green-200 dark:border-green-900/30">
                    <span className="text-[10px] font-black uppercase text-green-600 dark:text-green-400">MOTHERBOARD</span>
                    <span className="text-xs font-black uppercase text-green-600 dark:text-green-400 underline">MSI B650 TOMAHAWK</span>
                </div>
            </div>

            <div className="pt-4 flex gap-4 border-t border-blue-100 dark:border-blue-900/20">
                <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={24} />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-black dark:text-white uppercase">OPTIMAL READY</h4>
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase">Hardware parity verified. Compatible platform detected.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
