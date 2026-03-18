import { Cpu, Activity, MemoryStick, ArrowRight } from "lucide-react";
import { Highlighter } from "../ui/Highlighter";
import { ShinyButton } from "../ui/ShinyButton";
import { useNavigate } from "react-router-dom";

const STARTER_BUILDS = [
  {
    title: "Budget 1080p Build",
    price: "120,000",
    description: "Solid entry-level gaming performance for popular titles like Valorant and CS2.",
    components: [
      { label: "CPU", name: "Ryzen 5 5600" },
      { label: "GPU", name: "Radeon RX 6600" },
      { label: "RAM", name: "16GB DDR4 3200" },
    ],
    color: "bg-blue-600",
    preset: "budget"
  },
  {
    title: "1440p Gaming Build",
    price: "220,000",
    description: "High-refresh gaming at 1440p resolution. Excellent for modern AAA titles.",
    components: [
      { label: "CPU", name: "Ryzen 5 7600" },
      { label: "GPU", name: "RTX 4060 Ti" },
      { label: "RAM", name: "32GB DDR5 6000" },
    ],
    color: "bg-black",
    highlight: true,
    preset: "gaming"
  },
  {
    title: "Workstation Build",
    price: "350,000",
    description: "Professional grade productivity build for video editing and 3D rendering.",
    components: [
      { label: "CPU", name: "Ryzen 9 7900X" },
      { label: "GPU", name: "RTX 4070 Super" },
      { label: "RAM", name: "64GB DDR5 6000" },
    ],
    color: "bg-blue-600",
    preset: "workstation"
  }
];

export default function StarterBuilds() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a]/30 border-y border-gray-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="mb-16">
            <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] mb-4 italic">Baseline Configurations</h2>
            <h3 className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter leading-none italic">
                STARTER <br /> <Highlighter action="highlight" color="#2563EB" iterations={2}>BUILDS</Highlighter>
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STARTER_BUILDS.map((build, i) => (
            <div key={i} className={`flex flex-col border-4 border-black dark:border-white/10 p-8 transition-all hover:-translate-y-2 bg-white dark:bg-slate-900 ${build.highlight ? 'ring-4 ring-blue-600 ring-offset-4 dark:ring-offset-[#0a0a0a]' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter italic">{build.title}</h4>
                <div className={`px-2 py-1 text-[8px] font-black text-white uppercase tracking-widest ${build.color}`}>PRESET_{i+1}</div>
              </div>
              
              <div className="mb-8">
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tighter">Rs. {build.price}</div>
                <div className="text-[8px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest mt-1 italic">ESTIMATED MARKET VALUE</div>
              </div>

              <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase leading-relaxed mb-8 flex-1">
                {build.description}
              </p>

              <div className="space-y-3 mb-10">
                {build.components.map((comp, ci) => (
                  <div key={ci} className="flex items-center gap-3 p-3 border-2 border-black/5 dark:border-white/5 bg-gray-50 dark:bg-slate-950">
                    <div className="text-blue-600 dark:text-blue-400">
                      {comp.label === 'CPU' && <Cpu size={14} />}
                      {comp.label === 'GPU' && <Activity size={14} />}
                      {comp.label === 'RAM' && <MemoryStick size={14} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{comp.label}</span>
                      <span className="text-[10px] font-black dark:text-white uppercase truncate">{comp.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <ShinyButton 
                onClick={() => navigate(`/builder?preset=${build.preset}`)}
                className="w-full justify-center py-4 bg-black dark:bg-blue-600"
              >
                LOAD IN BUILDER <ArrowRight size={14} className="ml-2" />
              </ShinyButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
