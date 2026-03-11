import { CheckCircle2, Monitor, Box, Zap, Scale, DollarSign } from 'lucide-react';

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
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1 space-y-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter mb-6 leading-[0.9]">
                TECHNICAL <br /> SPECIFICATIONS
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-lg leading-snug font-medium">
                Our suite of tools is designed to prevent assembly errors before you spend a single Rupee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              {FEATURES.map((f, i) => (
                <div key={i} className="space-y-4 border-t border-black dark:border-white/20 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">{f.icon}</span>
                    <span className="font-black text-[11px] md:text-xs text-black dark:text-white uppercase tracking-[0.2em]">{f.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl space-y-8">
            {/* Card 01: Core Logic */}
            <div className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white/10 p-10 shadow-[12px_12px_0px_0px_rgba(37,99,235,1)] dark:shadow-[12px_12px_0px_0px_rgba(37,99,235,0.2)]">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-600">System Core Logic</div>
                        <div className="h-px bg-black dark:bg-white w-full opacity-10"></div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-black dark:bg-blue-600 flex items-center justify-center text-white font-black text-xs">01</div>
                        <div className="flex-1">
                            <div className="text-xs font-black uppercase mb-1 dark:text-white">Socket Match</div>
                            <div className="h-2 bg-gray-100 dark:bg-slate-950 w-full overflow-hidden">
                                <div className="w-[95%] h-full bg-blue-600 dark:bg-blue-400"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 border border-black dark:border-white/20 flex items-center justify-center text-black dark:text-white font-black text-xs">02</div>
                        <div className="flex-1">
                            <div className="text-xs font-black uppercase mb-1 dark:text-white">TDP Threshold</div>
                            <div className="h-2 bg-gray-100 dark:bg-slate-950 w-full overflow-hidden">
                                <div className="w-[70%] h-full bg-black dark:bg-blue-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 02: Physical Constraints */}
            <div className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white/10 p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)]">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-600">Chassis Clearance</div>
                        <div className="h-px bg-black dark:bg-white w-full opacity-10"></div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white font-black text-xs">03</div>
                        <div className="flex-1">
                            <div className="text-xs font-black uppercase mb-1 dark:text-white">GPU Length Check</div>
                            <div className="h-2 bg-gray-100 dark:bg-slate-950 w-full overflow-hidden">
                                <div className="w-[85%] h-full bg-blue-600 dark:bg-blue-400"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 border border-black dark:border-white/20 flex items-center justify-center text-black dark:text-white font-black text-xs">04</div>
                        <div className="flex-1">
                            <div className="text-xs font-black uppercase mb-1 dark:text-white">PSU FORM FACTOR</div>
                            <div className="h-2 bg-gray-100 dark:bg-slate-950 w-full overflow-hidden">
                                <div className="w-[60%] h-full bg-black dark:bg-blue-600"></div>
                            </div>
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
