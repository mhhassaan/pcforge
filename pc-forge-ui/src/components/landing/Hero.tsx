import { Link } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';
export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-white border-b-2 border-black">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8"> 
      {/* <div className="w-full mx-auto px-4 md:px-8"> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Cpu size={14} /> Industrial Precision
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black tracking-tighter leading-[0.9]">
              BUILD A <br /> 
              <span className="text-blue-600 underline decoration-4 underline-offset-8">COMPATIBLE</span> PC.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-tight font-medium max-w-lg">
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
                className="bg-white border-2 border-black border-t-0 sm:border-t-2 sm:border-l-0 hover:bg-gray-50 text-black font-black py-5 px-10 flex items-center justify-center transition-colors uppercase tracking-widest text-xs"
              >
                Database
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="bg-white border-2 border-black p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg"> 
              <div className="aspect-[4/3] bg-gray-50 border border-gray-200 p-6 flex flex-col justify-between">

                {/* ================= PERFORMANCE METERS ================= */}
                <div className="space-y-4">

                  {[
                    { label: "CPU", value: 98 },
                    { label: "GPU", value: 95 },
                    { label: "RAM", value: 80 },
                    { label: "COOLING", value: 88 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[10px] font-black tracking-widest">
                        <span>{item.label}</span>
                        <span className="text-blue-600">{item.value}%</span>
                      </div>

                      <div className="h-2 bg-black/10">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}

                </div>

                {/* ================= ABSTRACT BUILD GRID ================= */}
                <div className="grid grid-cols-3 gap-6 pt-6 items-end">

                  {/* LEFT — SYSTEM CORE */}
                  <div className="border-2 border-black p-4 space-y-3">

                    <div className="h-3 bg-black w-2/3"></div>
                    <div className="h-3 bg-black w-1/2"></div>
                    <div className="h-3 bg-blue-600 w-3/4"></div>

                    <div className="pt-4 space-y-2">
                      <div className="h-2 bg-black/20"></div>
                      <div className="h-2 bg-black/20"></div>
                    </div>

                  </div>

                  {/* CENTER — STORAGE STACK */}
                  <div className="flex flex-col gap-3 items-center">

                    <div className="w-24 h-10 border-2 border-black flex items-center justify-center text-[9px] font-black">
                      SSD • 1TB
                    </div>

                    <div className="w-24 h-10 border-2 border-black flex items-center justify-center text-[9px] font-black">
                      HDD • 4TB
                    </div>

                    {/* Signal Lines */}
                    <div className="space-y-1 pt-1">
                      <div className="h-[2px] w-20 bg-black/30"></div>
                      <div className="h-[2px] w-14 bg-black/30"></div>
                    </div>

                  </div>

                  {/* RIGHT — BUILD STATUS */}
                  <div className="flex flex-col items-center gap-4">

                    {/* Compatibility */}
                    <div className="w-20 h-20 border-2 border-black rounded-full flex flex-col items-center justify-center font-black text-[9px]">
                      <span className="text-blue-600 text-lg">✓</span>
                      OK
                    </div>

                    {/* Price */}
                    <div className="border-2 border-black px-4 py-2 text-center">
                      <div className="text-[8px] font-black tracking-widest">
                        TOTAL
                      </div>
                      <div className="text-lg font-black text-blue-600">
                        Rs. 485K
                      </div>
                    </div>

                  </div>

                </div>

                {/* ================= FOOTER ================= */}
                <div className="pt-4 flex justify-between items-center">

                  {/* IO Blocks */}
                  <div className="flex gap-2">
                    <div className="w-5 h-3 bg-black"></div>
                    <div className="w-5 h-3 bg-black"></div>
                    <div className="w-5 h-3 bg-black"></div>
                  </div>

                  <div className="text-[9px] font-black tracking-widest text-gray-400">
                    PCFORGE • BUILD MATRIX
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}