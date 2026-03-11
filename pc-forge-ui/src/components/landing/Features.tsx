import { 
  CheckCircle2, 
  Monitor, 
  Box, 
  Zap, 
  Scale, 
  DollarSign, 
  Cpu, 
  Maximize, 
  Activity, 
  ShieldCheck,
  Database,
  TrendingDown
} from 'lucide-react';
import { TextAnimate } from '../ui/TextAnimate';
import { Highlighter } from '../ui/Highlighter';
import CardSwap, { Card } from '../ui/CardSwap';

const FEATURES = [
  {
    title: "Compatibility Engine",
    desc: "No more BIOS update fears or socket mismatches. Every part is verified.",
    icon: <CheckCircle2 size={20} />
  },
  {
    title: "PSU Wattage Check",
    desc: "Real-time TDP calculation ensures your power supply can handle the load.",
    icon: <Zap size={20} />
  },
  {
    title: "Physical Clearance",
    desc: "Checks if your GPU length fits the case and cooler height matches width.",
    icon: <Box size={20} />
  },
  {
    title: "NVMe/SATA Mapping",
    desc: "Intelligent slot validation for M.2 and SATA ports based on motherboard specs.",
    icon: <Scale size={20} />
  },
  {
    title: "Price Comparison",
    desc: "Aggregated live listings from multiple local retailers for best value.",
    icon: <DollarSign size={20} />
  },
  {
    title: "Community Builds",
    desc: "Browse and fork completed builds from other enthusiasts in Pakistan.",
    icon: <Monitor size={20} />
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a]/30 border-y border-gray-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1 space-y-12">
            <div>
              <TextAnimate 
                animation="fadeIn" 
                by="line" 
                as="h2" 
                className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter mb-6 leading-[0.9] italic"
              >
                TECHNICAL{"\n"}SPECIFICATIONS
              </TextAnimate>
              <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-lg leading-snug font-medium uppercase italic">
                Our suite of tools is designed to prevent <Highlighter action="highlight" color="#2563EB" iterations={2}>assembly errors</Highlighter> before you spend a single Rupee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              {FEATURES.map((f, i) => (
                <div key={i} className="space-y-4 border-t border-black dark:border-white/20 pt-4 group">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">{f.icon}</span>
                    <span className="font-black text-[11px] md:text-xs text-black dark:text-white uppercase tracking-[0.2em] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{f.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center items-center h-[500px] md:h-[600px] relative mt-12 lg:mt-0">
            <CardSwap
                width="100%"
                height="450px"
                cardDistance={40}
                verticalDistance={60}
                delay={3000}
                pauseOnHover={false}
                skewAmount={1}
                easing='elastic'
            >
                {/* 1. KERNEL VALIDATION CARD */}
                <Card className="p-8 md:p-10 border-4 shadow-[12px_12px_0px_0px_rgba(37,99,235,1)] dark:shadow-[12px_12px_0px_0px_rgba(37,99,235,0.2)]">
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.3em] mb-1 italic">PLATFORM</div>
                                <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic">PLATFORM VALIDATION</h4>
                            </div>
                            <ShieldCheck className="text-blue-600" size={28} />
                        </div>
                        
                        <div className="space-y-6 flex-1">
                            <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 border-2 border-black dark:border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 bg-black dark:bg-blue-600 text-white flex items-center justify-center">
                                    <Cpu size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                        <span>SOCKET</span>
                                        <span className="text-green-500">MATCHED</span>
                                    </div>
                                    <div className="text-xs font-black dark:text-white uppercase font-mono">LGA 1700 / INTEL GEN 14</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 border-2 border-black dark:border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 bg-black dark:bg-blue-600 text-white flex items-center justify-center">
                                    <Zap size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                        <span>POWER STABILITY</span>
                                        <span className="text-green-500">OPTIMAL</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-black/10 dark:bg-white/10 rounded-none overflow-hidden">
                                            <div className="w-[42%] h-full bg-blue-600"></div>
                                        </div>
                                        <span className="text-[10px] font-black dark:text-white font-mono">320W / 750W</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Activity size={14} className="text-blue-600 animate-pulse" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">REAL TIME AUDIT: ON</span>
                            </div>
                            <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400">v.04.22</span>
                        </div>
                    </div>
                </Card>

                {/* 2. PHYSICAL GEOMETRY CARD */}
                <Card className="p-8 md:p-10 border-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)]">
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.3em] mb-1 italic">SPATIAL AWARENESS</div>
                                <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic">PHYSICAL CLEARANCE</h4>
                            </div>
                            <Maximize className="text-blue-600" size={28} />
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 border-2 border-black dark:border-white/5">
                                    <div className="text-[8px] font-black uppercase text-gray-400 mb-2">GPU LENGTH</div>
                                    <div className="text-lg font-black dark:text-white italic leading-none">330mm</div>
                                    <div className="mt-2 text-[8px] font-black text-green-500 uppercase">✓ CLEARANCE OK</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 border-2 border-black dark:border-white/5">
                                    <div className="text-[8px] font-black uppercase text-gray-400 mb-2">COOLER HEIGHT</div>
                                    <div className="text-lg font-black dark:text-white italic leading-none">165mm</div>
                                    <div className="mt-2 text-[8px] font-black text-green-500 uppercase">✓ CASE MATCH</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 border-2 border-black dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Box className="text-blue-600" size={18} />
                                    <span className="text-[10px] font-black uppercase dark:text-white">CASE FORM FACTOR</span>
                                </div>
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-600 px-2 py-0.5">ATX</span>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-1 justify-center">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className={`h-1 flex-1 bg-blue-600 ${i > 8 ? 'opacity-20' : 'opacity-100'}`}></div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* 3. PRICE AGGREGATOR CARD */}
                <Card className="p-8 md:p-10 border-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(37,99,235,0.1)]">
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.3em] mb-1 italic">MARKET PRICE</div>
                                <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic">PRICE AGGREGATOR</h4>
                            </div>
                            <DollarSign className="text-blue-600" size={28} />
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 border-2 border-black dark:border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 bg-black dark:bg-blue-600 text-white flex items-center justify-center">
                                    <Database size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                        <span>LOWEST UNIT COST</span>
                                        <span className="text-green-500">-12% DELTA</span>
                                    </div>
                                    <div className="text-xs font-black dark:text-white uppercase font-mono">RS. 142,500 / JUNAIDTECH</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 border-2 border-black dark:border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 bg-black dark:bg-blue-600 text-white flex items-center justify-center">
                                    <Scale size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                        <span>VENDOR CHECK</span>
                                        <span className="text-blue-600 dark:text-blue-400">SYNCED</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-blue-600"></div>
                                            <div className="w-2 h-2 bg-blue-600"></div>
                                            <div className="w-2 h-2 bg-blue-600"></div>
                                            <div className="w-2 h-2 bg-gray-200 dark:bg-slate-800"></div>
                                            <div className="w-2 h-2 bg-gray-200 dark:bg-slate-800"></div>
                                        </div>
                                        <span className="text-[10px] font-black dark:text-white uppercase">5 VENDOR PRICES</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <TrendingDown size={14} className="text-green-500" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">BEST_VALUE_DETECTED</span>
                            </div>
                            <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400">SYNC_OK</span>
                        </div>
                    </div>
                </Card>
            </CardSwap>
          </div>
          
        </div>
      </div>
    </section>
  );
}
