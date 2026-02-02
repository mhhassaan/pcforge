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
    <section className="py-24 bg-gray-50 border-y border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1 space-y-12">
            <div>
              <h2 className="text-5xl font-black text-black uppercase tracking-tighter mb-6 leading-[0.9]">
                TECHNICAL <br /> SPECIFICATIONS
              </h2>
              <p className="text-lg text-gray-600 max-w-lg leading-snug font-medium">
                Our suite of tools is designed to prevent assembly errors before you spend a single Rupee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              {FEATURES.map((f, i) => (
                <div key={i} className="space-y-4 border-t border-black pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">{f.icon}</span>
                    <span className="font-black text-[10px] text-black uppercase tracking-[0.2em]">{f.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="bg-white border-2 border-black p-10 shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase text-gray-400">Component Validation</div>
                        <div className="h-px bg-black w-full opacity-10"></div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-black text-xs">01</div>
                        <div className="flex-1">
                            <div className="text-xs font-black uppercase mb-1">Socket Match</div>
                            <div className="h-2 bg-gray-100 w-full overflow-hidden">
                                <div className="w-[95%] h-full bg-blue-600"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-100 border border-black flex items-center justify-center text-black font-black text-xs">02</div>
                        <div className="flex-1">
                            <div className="text-xs font-black uppercase mb-1">Power Limit</div>
                            <div className="h-2 bg-gray-100 w-full overflow-hidden">
                                <div className="w-[70%] h-full bg-black"></div>
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
