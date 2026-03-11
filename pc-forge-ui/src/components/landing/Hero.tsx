import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, MapPin } from 'lucide-react';
import { MorphingText } from '../ui/MorphingText';
import { DottedMap } from '../ui/DottedMap';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-white dark:bg-[#0a0a0a] border-b-2 border-black dark:border-white/10 transition-colors duration-300">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] scale-150">
            <DottedMap 
                width={150}
                height={100}
                dotRadius={0.15}
                mapSamples={6000}
                markers={[
                    { lat: 24.8607, lng: 67.0011, size: 0.4 }, // Karachi
                    { lat: 31.5204, lng: 74.3587, size: 0.4 }, // Lahore
                    { lat: 33.6844, lng: 73.0479, size: 0.4 }, // Islamabad
                ]}
                className="text-gray-200 dark:text-blue-900/20"
                markerColor="#2563EB"
            />
          </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8"> 
      {/* <div className="w-full mx-auto px-4 md:px-8"> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Cpu size={14} /> Industrial Precision
            </div>
            
            <div className="flex flex-col gap-y-2 text-4xl sm:text-5xl md:text-7xl font-bold text-black dark:text-white tracking-tighter leading-[0.9] flex flex-col uppercase">
              <span>BUILD A</span>
              <div className="flex flex-wrap items-center gap-x-4">
                <MorphingText 
                  className="text-blue-600 dark:text-blue-400 h-[1em] w-fit min-w-[300px] md:min-w-[450px] inline-flex items-center"
                  texts={[
                    "COMPATIBLE",
                    "POWERFUL",
                    "OPTIMIZED",
                    "RELIABLE",
                    "PRECISE",
                    "BALANCED"
                  ]}
                />
                <span> COMPUTER</span>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 leading-tight font-medium max-w-lg uppercase">
              Compare prices from <i><b>Pakistani vendors</b></i> automatically. No guesswork. Just engineering.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-0 pt-4">
              <Link 
                to="/builder" 
                className="bg-black dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-black py-5 px-10 flex items-center justify-center gap-3 transition-colors uppercase tracking-widest text-xs border-2 border-black dark:border-blue-600"
              >
                Start Build <ArrowRight size={18} />
              </Link>
              <Link 
                to="/components" 
                className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white/10 border-t-0 sm:border-t-2 sm:border-l-0 hover:bg-gray-50 dark:hover:bg-slate-800 text-black dark:text-white font-black py-5 px-10 flex items-center justify-center transition-colors uppercase tracking-widest text-xs"
              >
                Database
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white/10 p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.2)] w-full max-w-lg"> 
              <div className="aspect-[4/3] bg-gray-50 dark:bg-[#020817] border border-gray-200 dark:border-white/5 p-6 flex flex-col justify-between">

                {/* ================= PERFORMANCE METERS ================= */}
                <div className="space-y-4">

                  {[
                    { label: "CPU", value: 98 },
                    { label: "GPU", value: 95 },
                    { label: "RAM", value: 80 },
                    { label: "COOLING", value: 88 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[10px] font-black tracking-widest dark:text-slate-300">
                        <span>{item.label}</span>
                        <span className="text-blue-600 dark:text-blue-400">{item.value}%</span>
                      </div>

                      <div className="h-2 bg-black/10 dark:bg-white/5">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-400"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}

                </div>

                {/* ================= ABSTRACT BUILD GRID ================= */}
                <div className="grid grid-cols-3 gap-6 pt-6 items-end">

                  {/* LEFT — SYSTEM CORE */}
                  <div className="border-2 border-black dark:border-white/10 p-4 space-y-3">

                    <div className="h-3 bg-black dark:bg-slate-700 w-2/3"></div>
                    <div className="h-3 bg-black dark:bg-slate-700 w-1/2"></div>
                    <div className="h-3 bg-blue-600 dark:bg-blue-400 w-3/4"></div>

                    <div className="pt-4 space-y-2">
                      <div className="h-2 bg-black/20 dark:bg-white/5"></div>
                      <div className="h-2 bg-black/20 dark:bg-white/5"></div>
                    </div>

                  </div>

                  {/* CENTER — STORAGE STACK */}
                  <div className="flex flex-col gap-3 items-center">

                    <div className="w-24 h-10 border-2 border-black dark:border-white/10 flex items-center justify-center text-[9px] font-black dark:text-slate-300">
                      SSD • 1TB
                    </div>

                    <div className="w-24 h-10 border-2 border-black dark:border-white/10 flex items-center justify-center text-[9px] font-black dark:text-slate-300">
                      HDD • 4TB
                    </div>

                    {/* Signal Lines */}
                    <div className="space-y-1 pt-1">
                      <div className="h-[2px] w-20 bg-black/30 dark:bg-white/10"></div>
                      <div className="h-[2px] w-14 bg-black/30 dark:bg-white/10"></div>
                    </div>

                  </div>

                  {/* RIGHT — BUILD STATUS */}
                  <div className="flex flex-col items-center gap-4">

                    {/* Compatibility */}
                    <div className="w-20 h-20 border-2 border-black dark:border-white/10 rounded-full flex flex-col items-center justify-center font-black text-[9px] dark:text-slate-300">
                      <span className="text-blue-600 dark:text-blue-400 text-lg">✓</span>
                      OK
                    </div>

                    {/* Price */}
                    <div className="border-2 border-black dark:border-white/10 px-4 py-2 text-center">
                      <div className="text-[8px] font-black tracking-widest text-gray-400 dark:text-slate-500">
                        TOTAL
                      </div>
                      <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                        Rs. 485K
                      </div>
                    </div>

                  </div>

                </div>

                {/* ================= FOOTER ================= */}
                <div className="pt-4 flex justify-between items-center">

                  {/* IO Blocks */}
                  <div className="flex gap-2">
                    <div className="w-5 h-3 bg-black dark:bg-slate-700"></div>
                    <div className="w-5 h-3 bg-black dark:bg-slate-700"></div>
                    <div className="w-5 h-3 bg-black dark:bg-slate-700"></div>
                  </div>

                  <div className="text-[9px] font-black tracking-widest text-gray-400 dark:text-slate-600">
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