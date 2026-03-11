import { NumberTicker } from "../ui/NumberTicker";
import { Highlighter } from "../ui/Highlighter";
import { Cpu, Monitor, Layout, Zap, HardDrive, Box, MemoryStick } from "lucide-react";

const STATS = [
  { label: "PROCESSORS", value: 66, icon: <Cpu size={20} /> },
  { label: "GRAPHICS_CORES", value: 179, icon: <Monitor size={20} /> },
  { label: "MOTHERBOARDS", value: 233, icon: <Layout size={20} /> },
  { label: "POWER_CELLS", value: 232, icon: <Zap size={20} /> },
  { label: "MEMORY_UNITS", value: 75, icon: <MemoryStick size={20} /> },
  { label: "CHASSIS_UNITS", value: 45, icon: <Box size={20} /> },
];

export default function ComponentRange() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a] border-b-2 border-black dark:border-white/10 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20">
            <div className="max-w-2xl">
                <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] mb-4 italic">Inventory Manifest</h2>
                <h3 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
                    <i>EXTENSIVE</i> <br /> 
                    <Highlighter action="highlight" color="#2563EB" iterations={2}>HARDWARE LIST</Highlighter>
                </h3>
            </div>
            <p className="text-gray-500 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs max-w-sm lg:text-right">
                Access listings of verified components synchronized with primary local vendors.
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-black dark:bg-white/10 border-2 border-black dark:border-white/10">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#121212] p-8 md:p-10 flex flex-col items-center justify-center text-center group hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all">
              <div className="mb-6 text-gray-300 dark:text-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter mb-2 italic">
                <NumberTicker value={stat.value} />
              </div>
              <div className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 border-t border-gray-100 dark:border-white/5 pt-12">
            <div className="flex items-center gap-4">
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400 italic">
                    <NumberTicker value={785} />+
                </div>
                <div className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest leading-none">
                    Total Verified <br /> Components
                </div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-4">
                <div className="text-3xl font-black text-black dark:text-white italic">
                    <NumberTicker value={5} />
                </div>
                <div className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest leading-none">
                    Active Vendor <br /> Data Streams
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
