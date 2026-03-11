import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Activity, ShieldCheck, Zap, Maximize, Database, Layout } from 'lucide-react';
import { MorphingText } from '../ui/MorphingText';
import { DottedMap } from '../ui/DottedMap';
import { Highlighter } from '../ui/Highlighter';
import { Safari } from '../ui/Safari';

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
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-12 items-center">
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
                    "Calibrated",
                    "RELIABLE",
                    "PRECISE",
                    "BALANCED"
                  ]}
                />
                <span> COMPUTER</span>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 leading-tight font-medium max-w-lg uppercase">
              Compare prices from <Highlighter color="#2563EB" action="underline" iterations={2} strokeWidth={2}>Pakistani vendors</Highlighter> automatically. No guesswork. Just engineering.
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

          {/* Right Visual: Component Specs in Safari Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-3xl shadow-[32px_32px_0px_0px_rgba(37,99,235,1)] dark:shadow-[32px_32px_0px_0px_rgba(37,99,235,0.2)] border-2 border-black dark:border-white/10 transition-all">
                <Safari url="pcforge.pk/build-manifest/0x4F2A" className="w-full">
                    <div className="size-full bg-gray-50 dark:bg-[#0a0a0a] p-6 flex flex-col justify-between overflow-hidden">

                        {/* ================= ASSEMBLY MANIFEST ================= */}
                        <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] italic">Assembly_Manifest</span>
                            <span className="text-[8px] font-mono text-gray-400">SYNC_ID: 0x4F2A</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { icon: <Cpu size={14} />, label: "PROCESSOR", name: "AMD Ryzen 7 7800X3D", spec: "8C/16T • 5.0GHz" },
                                { icon: <Activity size={14} />, label: "GRAPHICS", name: "NVIDIA RTX 4080 Super", spec: "16GB GDDR6X" },
                                { icon: <Zap size={14} />, label: "MEMORY", name: "G.Skill Trident Z5 Neo", spec: "32GB DDR5-6000" },
                                { icon: <Layout size={14} />, label: "MOTHERBOARD", name: "MSI MAG B650 Tomahawk", spec: "AM5 • WiFi 6E" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white dark:bg-[#121212] border border-black/5 dark:border-white/5 p-3 group hover:border-blue-600/50 transition-colors">
                                    <div className="text-blue-600 dark:text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 flex justify-between items-center">
                                        <div>
                                            <div className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{item.label}</div>
                                            <div className="text-[10px] font-black dark:text-white uppercase truncate">{item.name}</div>
                                        </div>
                                        <div className="text-[9px] font-black text-blue-600 dark:text-blue-400 font-mono italic">
                                            {item.spec}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>

                        {/* ================= COMPATIBILITY GRID ================= */}
                        <div className="grid grid-cols-3 gap-4 pt-6 items-stretch">

                        {/* LEFT — CPU SOCKET */}
                        <div className="border-2 border-black dark:border-white/10 p-3 flex flex-col justify-between bg-white dark:bg-[#121212]/50">
                            <div className="space-y-1">
                                <div className="text-[8px] font-black uppercase text-gray-400 italic">Socket Type</div>
                                <div className="text-[10px] font-black dark:text-white leading-tight uppercase italic">AM5 <br />Ryzen 7000</div>
                            </div>
                            <div className="pt-2 flex items-center justify-between">
                                <ShieldCheck size={12} className="text-green-500" />
                                <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase">Verified</span>
                            </div>
                        </div>

                        {/* CENTER — GPU CLEARANCE */}
                        <div className="border-2 border-black dark:border-white/10 p-3 flex flex-col justify-between bg-white dark:bg-[#121212]/50">
                            <div className="space-y-1">
                                <div className="text-[8px] font-black uppercase text-gray-400 italic">GPU Length</div>
                                <div className="text-[10px] font-black dark:text-white leading-tight uppercase italic">L - 310mm <br /> H - 140mm <br /> W - 61mm</div>
                            </div>
                            <div className="pt-2 flex items-center justify-between">
                                <Maximize size={12} className="text-blue-600" />
                                <span className="text-[8px] font-black text-green-500">PASS</span>
                            </div>
                        </div>

                        {/* RIGHT — BUILD VALIDATION */}
                        <div className="flex flex-col gap-2">
                            <div className="flex-1 border-2 border-black dark:border-blue-600 p-2 flex flex-col items-center justify-center text-center bg-black dark:bg-blue-600 text-white">
                                <Activity size={14} className="mb-1 animate-pulse" />
                                <div className="text-[8px] font-black uppercase italic">VALIDATED</div>
                            </div>
                            <div className="border-2 border-black dark:border-white/10 p-2 bg-white dark:bg-[#121212]/50">
                                <div className="text-[7px] font-black uppercase text-gray-400 italic">Total Cost</div>
                                <div className="text-[15px] font-black text-blue-600 dark:text-blue-400 font-mono tracking-tighter">Rs. 485,250</div>
                            </div>
                        </div>

                        </div>

                        {/* ================= SYSTEM STATUS ================= */}
                        <div className="pt-4 flex justify-between items-end border-t border-black/5 dark:border-white/5">
                            <div className="flex gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-2 h-2 bg-blue-600/20 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right">
                                <div className="text-[8px] font-black tracking-widest text-gray-400 dark:text-slate-600 uppercase">PCFORGE // ENGINE_v4</div>
                                <div className="text-[7px] font-mono text-gray-300 dark:text-slate-800 uppercase italic">All parameters synchronized</div>
                            </div>
                        </div>

                    </div>
                </Safari>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
