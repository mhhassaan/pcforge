import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CompatibilityShowcase() {
  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-black uppercase tracking-tighter mb-4">
            STOP THE GUESSWORK.
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Visual validation for mission-critical hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Error Example */}
          <div className="bg-gray-50 border-2 border-black p-8 rounded-none space-y-6 relative group">
            <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                FAIL
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                    <span className="text-[10px] font-black uppercase text-gray-400">INPUT_01</span>
                    <span className="text-xs font-black uppercase">RYZEN 7 7800X3D</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200">
                    <span className="text-[10px] font-black uppercase text-red-400">INPUT_02</span>
                    <span className="text-xs font-black uppercase text-red-600 underline">ASUS B450-F</span>
                </div>
            </div>

            <div className="pt-4 flex gap-4 border-t border-red-100">
                <AlertTriangle className="text-red-600" size={24} />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-black uppercase">SOCKET_MISMATCH</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase">Motherboard AM4 is incompatible with CPU AM5 Architecture.</p>
                </div>
            </div>
          </div>

          {/* Success Example */}
          <div className="bg-gray-50 border-2 border-black p-8 rounded-none space-y-6 relative group shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                PASS
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                    <span className="text-[10px] font-black uppercase text-gray-400">INPUT_01</span>
                    <span className="text-xs font-black uppercase">RYZEN 7 7800X3D</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
                    <span className="text-[10px] font-black uppercase text-gray-400">INPUT_02</span>
                    <span className="text-xs font-black uppercase">MSI B650 TOMAHAWK</span>
                </div>
            </div>

            <div className="pt-4 flex gap-4 border-t border-blue-100">
                <CheckCircle2 className="text-blue-600" size={24} />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-black uppercase">OPTIMAL_READY</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase">Hardware parity verified. Compatible platform detected.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
