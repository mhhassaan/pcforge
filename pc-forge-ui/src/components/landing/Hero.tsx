import { Link } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-white border-b-2 border-black">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Cpu size={14} /> Industrial Precision
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-black tracking-tighter leading-[0.9]">
              BUILD A <br /> 
              <span className="text-blue-600 underline decoration-4 underline-offset-8">COMPATIBLE</span> PC.
            </h1>
            
            <p className="text-xl text-gray-600 leading-tight font-medium max-w-lg">
              Compare prices from Pakistani vendors automatically. No guesswork. Just engineering.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-0 pt-4">
              <Link 
                to="/builder" 
                className="bg-black hover:bg-blue-600 text-white font-black py-5 px-10 flex items-center justify-center gap-3 transition-colors uppercase tracking-widest text-xs border-2 border-black"
              >
                Start Build <ArrowRight size={18} />
              </Link>
              <Link 
                to="/components" 
                className="bg-white border-2 border-black border-l-0 hover:bg-gray-50 text-black font-black py-5 px-10 flex items-center justify-center transition-colors uppercase tracking-widest text-xs"
              >
                Database
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative bg-white border-2 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden border border-gray-200 p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="h-1 bg-black w-full opacity-10"></div>
                        <div className="h-1 bg-black w-full opacity-10"></div>
                        <div className="h-1 bg-black w-full opacity-10"></div>
                        <div className="pt-4 space-y-2">
                            <div className="h-10 w-2/3 bg-black"></div>
                            <div className="h-4 w-1/2 bg-blue-600"></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-4xl font-black text-black">V.04</div>
                        <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center font-black text-xs italic">QC PASS</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
