import { useState } from 'react';
import { 
  BookOpen, Cpu, Monitor, Briefcase, MousePointer, X, 
  TrendingUp, HelpCircle, AlertTriangle, Activity, 
  Layout, Zap, HardDrive, BatteryCharging, Target, 
  Scan, Hammer, Eye
} from 'lucide-react';
import AssemblyFlow from '../components/AssemblyFlow';

// --- Data Structures ---

type SpecMode = 'amd_nvidia' | 'amd_amd' | 'intel_nvidia' | 'intel_intel';

interface SpecConfig {
  cpu: string;
  gpu: string;
  motherboard: string;
  ram: string;
  storage: string;
  psu: string;
  notes?: string;
}

interface UseCaseData {
  title: string;
  icon: React.ReactNode;
  summary: string;
  purpose: string;
  focus: string;
  howTo: string;
  expectations: string;
  image: string;
  specs: {
    amd_nvidia: SpecConfig;
    amd_amd: SpecConfig;
    intel_nvidia: SpecConfig;
    intel_intel: SpecConfig;
  };
}

const USE_CASES: UseCaseData[] = [
  {
    title: "Gaming Build",
    icon: <MousePointer size={24} />,
    summary: "Optimized for high-refresh rendering and low-latency input. Priority: Visual Throughput.",
    purpose: "Engineered for high-frame rate competitive gaming (Valorant, CS2) and cinematic 4K ultra-fidelity experiences (Cyberpunk 2077, Black Myth: Wukong).",
    focus: "GPU Rasterization capacity, VRAM buffer size, and CPU L3 Cache (3D V-Cache) to stabilize frame-time consistency.",
    howTo: "Allocate 50% of total budget to the GPU. Pair with a high-cache processor and DDR5-6000 memory for low-latency synchronization.",
    expectations: "Fluid 144Hz+ gaming at 1440p, minimal 1% low stutters, and ultra-responsive input processing.",
    image: "https://placehold.co/800x400/ffffff/black?text=Gaming+Build+Setup",
    specs: {
      amd_nvidia: {
        cpu: "Ryzen 7 7800X3D (L3 V-Cache)",
        gpu: "GeForce RTX 4070 Ti Super 16GB",
        motherboard: "B650 Eagle AX (VRM Optimized)",
        ram: "32GB DDR5-6000 CL30 (EXPO)",
        storage: "2TB WD SN850X (Gen4 x4)",
        psu: "850W ATX 3.0 (PCIe 5.0 Ready)"
      },
      amd_amd: {
        cpu: "Ryzen 7 7800X3D",
        gpu: "Radeon RX 7900 XT 20GB",
        motherboard: "B650 Eagle AX",
        ram: "32GB DDR5-6000 CL30 (EXPO)",
        storage: "2TB Samsung 990 Pro",
        psu: "850W Gold Modular"
      },
      intel_nvidia: {
        cpu: "Core i7-14700K (20-Cores)",
        gpu: "GeForce RTX 4070 Ti Super 16GB",
        motherboard: "Z790 Tomahawk WiFi",
        ram: "32GB DDR5-6000 CL30 (XMP)",
        storage: "2TB WD SN850X NVMe",
        psu: "850W ATX 3.0 Gold"
      },
      intel_intel: {
        cpu: "Core i5-14600K",
        gpu: "Arc A770 16GB (Limited Edition)",
        motherboard: "Z790 Tomahawk WiFi",
        ram: "32GB DDR5-6000 CL30",
        storage: "2TB Crucial P5 Plus",
        psu: "750W Gold Modular",
        notes: "Resize BAR MUST be enabled for Arc GPU architectural efficiency."
      }
    }
  },
  {
    title: "Productivity Workstation",
    icon: <Cpu size={24} />,
    summary: "Massive parallelization for 3D rendering, video encoding, and data sets.",
    purpose: "A powerhouse designed for sustained multi-threaded workloads: 4K/8K video production, 3D modeling, software compilation, and local AI model fine-tuning.",
    focus: "CPU Core Density, Total RAM Capacity for project scrubbing, and high-speed NVMe scratch disks for cache storage.",
    howTo: "Select a high-core count processor (16+ cores). Use high-density 64GB+ memory kits and Gen4/Gen5 storage for rapid project loading.",
    expectations: "Significant reduction in render times, stable multitasking with dozens of active applications, and rapid file I/O performance.",
    image: "https://placehold.co/800x400/ffffff/black?text=Workstation+Setup",
    specs: {
      amd_nvidia: {
        cpu: "Ryzen 9 7950X (16C/32T)",
        gpu: "GeForce RTX 4060 Ti 16GB (VRAM Heavy)",
        motherboard: "X670E Pro RS (PCIe 5.0)",
        ram: "64GB DDR5-5600 (ECC Support)",
        storage: "4TB Samsung 990 Pro (Work Drive)",
        psu: "1000W Platinum (Tier A)"
      },
      amd_amd: {
        cpu: "Ryzen 9 7950X (16C/32T)",
        gpu: "Radeon RX 7900 XTX 24GB",
        motherboard: "X670E Pro RS",
        ram: "64GB DDR5-5600",
        storage: "4TB WD SN850X",
        psu: "1000W Platinum"
      },
      intel_nvidia: {
        cpu: "Core i9-14900K (24C/32T)",
        gpu: "GeForce RTX 4070 Ti Super 16GB",
        motherboard: "Z790 Creator (Thunderbolt 4)",
        ram: "64GB DDR5-5600",
        storage: "4TB Samsung 990 Pro",
        psu: "1000W Platinum"
      },
      intel_intel: {
        cpu: "Core i9-14900K (24C/32T)",
        gpu: "Arc A770 16GB (Dual AV1)",
        motherboard: "Z790 Creator",
        ram: "64GB DDR5-5600",
        storage: "4TB Crucial T700 (Gen5 x4)",
        psu: "1000W Platinum",
        notes: "Intel QuickSync provides superior hardware acceleration for H.264/H.265 timelines."
      }
    }
  },
  {
    title: "Streaming & Content Creation",
    icon: <Monitor size={24} />,
    summary: "Balanced architecture for concurrent gaming and high-bitrate AV1 encoding.",
    purpose: "Dual-vector system designed for high-refresh gaming while simultaneously broadcasting 4K video at high bitrates to platforms like Twitch and YouTube.",
    focus: "Dedicated Hardware Encoders (NVENC/AV1), CPU thread headroom for streaming software, and low-latency USB controllers for peripherals.",
    howTo: "Prioritize NVIDIA RTX GPUs for the NVENC encoder or Intel CPUs for QuickSync offloading. Use 32GB of RAM to handle OBS project overhead.",
    expectations: "Crystal clear 4K broadcast quality with zero frame-dropping and no performance penalty to the primary game engine.",
    image: "https://placehold.co/800x400/ffffff/black?text=Streaming+Setup",
    specs: {
      amd_nvidia: {
        cpu: "Ryzen 9 7900X",
        gpu: "GeForce RTX 4070 Super (8th Gen NVENC)",
        motherboard: "B650 LiveMixer (USB Latency Opt.)",
        ram: "32GB DDR5-6000",
        storage: "2TB Gen4 NVMe + 4TB HDD (Archive)",
        psu: "750W Gold ATX 3.0"
      },
      amd_amd: {
        cpu: "Ryzen 9 7900X",
        gpu: "Radeon RX 7800 XT (AV1 Enabled)",
        motherboard: "B650 LiveMixer",
        ram: "32GB DDR5-6000",
        storage: "2TB NVMe + 8TB HDD Archive",
        psu: "850W Gold"
      },
      intel_nvidia: {
        cpu: "Core i7-14700K",
        gpu: "GeForce RTX 4070 Super (NVENC)",
        motherboard: "Z790 Aero G (Vision Engine)",
        ram: "32GB DDR5-6000",
        storage: "2TB NVMe + 4TB HDD Archive",
        psu: "750W Gold ATX 3.0"
      },
      intel_intel: {
        cpu: "Core i7-14700K",
        gpu: "Arc A770 16GB (Deep Link)",
        motherboard: "Z790 Aero G",
        ram: "32GB DDR5-6000",
        storage: "2TB NVMe + 8TB HDD Archive",
        psu: "750W Gold",
        notes: "Deep Link allows CPU and GPU encoders to work in parallel for faster renders."
      }
    }
  },
  {
    title: "Office & Home Use",
    icon: <Briefcase size={24} />,
    summary: "Reliable, silent, and efficient. Focused on operational snappiness.",
    purpose: "Optimized for administrative tasks, heavy browser usage (40+ tabs), high-definition media consumption, and general home organization.",
    focus: "System Responsiveness (IOPS), Low Thermal Output for silent operation, and long-term hardware reliability.",
    howTo: "Use a modern CPU with strong integrated graphics (iGPU) to save cost and noise. Pair with a high-speed NVMe drive for 'instant-on' performance.",
    expectations: "Snappy OS interaction, silent background operation, and extremely low power consumption under daily workloads.",
    image: "https://placehold.co/800x400/ffffff/black?text=Office+Setup",
    specs: {
      amd_nvidia: {
        cpu: "Ryzen 5 8600G (Radeon 760M iGPU)",
        gpu: "Integrated Graphics (No Discrete)",
        motherboard: "A620M Micro-ATX",
        ram: "16GB DDR5-5200 (Dual Channel)",
        storage: "1TB NVMe (DRAM Cache)",
        psu: "450W Bronze (High Efficiency)"
      },
      amd_amd: {
        cpu: "Ryzen 5 8600G",
        gpu: "Integrated Radeon Graphics",
        motherboard: "A620M Micro-ATX",
        ram: "16GB DDR5-5200",
        storage: "1TB NVMe Gen4",
        psu: "500W Bronze"
      },
      intel_nvidia: {
        cpu: "Core i5-13400 (UHD 730 iGPU)",
        gpu: "Integrated Graphics",
        motherboard: "H610M Micro-ATX",
        ram: "16GB DDR4-3200",
        storage: "1TB NVMe Gen3",
        psu: "500W Bronze"
      },
      intel_intel: {
        cpu: "Core i5-13400",
        gpu: "Integrated UHD 730",
        motherboard: "H610M Micro-ATX",
        ram: "16GB DDR4-3200",
        storage: "1TB NVMe Gen3",
        psu: "500W Bronze",
        notes: "Intel iGPUs are highly reliable for multi-monitor office setups."
      }
    }
  }
];

const GLOSSARY = [
  { term: "Pin Pack", def: "Brand new item, sealed in original box." },
  { term: "Bottleneck", def: "When a weak component limits a powerful one." },
  { term: "Kit (RAM)", def: "Buying RAM in a matched pair for Dual Channel." },
  { term: "Local Warranty", def: "Official distributor warranty claimed in Pakistan." },
  { term: "Mining Card", def: "Used GPUs that were run 24/7 for crypto." },
  { term: "Repasted", def: "Used hardware where thermal paste has been replaced." },
  { term: "XMP / EXPO", def: "BIOS setting required to reach rated RAM speeds." },
  { term: "Modular PSU", def: "Power supply with detachable cables." }
];

export default function Guide() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [specMode, setSpecMode] = useState<SpecMode>('amd_nvidia');

  const openArticle = (idx: number) => {
    setSelectedArticle(idx);
    setSpecMode('amd_nvidia');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white p-4 md:p-8 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-20">
            <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter italic">PC BUILD GUIDE</h1>
            <div className="h-2 w-32 bg-blue-600 dark:bg-blue-400 mb-6"></div>
            <p className="text-gray-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Expert advice for choosing and assembling your hardware.</p>
        </header>

        {/* 1. USE CASE ARTICLES */}
        <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
                <h2 className="text-2xl font-black uppercase tracking-tight italic">Recommended Build Paths</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {USE_CASES.map((useCase, idx) => (
                    <div 
                        key={idx}
                        onClick={() => openArticle(idx)}
                        className="bg-white dark:bg-[#121212] border-2 border-black dark:border-white/10 p-8 group cursor-pointer transition-all hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)] hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-14 h-14 bg-black dark:bg-[#0a0a0a] text-white flex items-center justify-center transition-colors group-hover:bg-blue-600 dark:group-hover:bg-blue-500 border-2 border-transparent group-hover:border-blue-600">
                                {useCase.icon}
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">{useCase.title}</h3>
                        </div>
                        <p className="text-gray-500 dark:text-slate-500 text-sm leading-tight font-bold uppercase mb-8 tracking-wide italic">{useCase.summary}</p>
                        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                            View Build Details <span>&rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 2. ASSEMBLY ORDER */}
        <section className="mb-32">
            <h2 className="text-4xl font-black mb-16 uppercase tracking-tighter text-center italic dark:text-white">Assembly Step-by-Step</h2>
            <AssemblyFlow />
        </section>

        {/* 3. LINGO & TRENDS */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <section>
                <div className="flex items-center gap-4 mb-10">
                    <HelpCircle className="text-blue-600 dark:text-blue-400" size={24} />
                    <h2 className="text-2xl font-black uppercase tracking-tight italic">PC Building Glossary</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    {GLOSSARY.map((item) => (
                        <div key={item.term} className="bg-gray-50 dark:bg-[#121212] p-6 border-l-4 border-black dark:border-blue-600">
                            <div className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 text-[10px] italic">{item.term}</div>
                            <div className="text-gray-600 dark:text-slate-400 text-[11px] leading-tight font-bold uppercase">{item.def}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-4 mb-10">
                    <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
                    <h2 className="text-2xl font-black uppercase tracking-tight italic">Market Trends</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { t: "Used GPU Dominance", d: "High import taxes favor pre-owned RTX 3000 / RX 6000 series." },
                        { t: "NVMe Standards", d: "Gen 4 prices have stabilized; Gen 3 is legacy for new builds." },
                        { t: "White Build Premium", d: "Expected 'White Tax' of 5-15% on aesthetic hardware." }
                    ].map((trend) => (
                        <div key={trend.t} className="bg-white dark:bg-[#121212] p-6 border-2 border-black dark:border-white/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <h4 className="font-black text-black dark:text-white uppercase text-xs mb-2 tracking-widest italic">{trend.t}</h4>
                            <p className="text-[11px] text-gray-500 dark:text-slate-500 leading-tight font-bold uppercase">{trend.d}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* MODAL FOR ARTICLES */}
        {selectedArticle !== null && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#121212] border-4 border-black dark:border-blue-600 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(37,99,235,0.2)] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative flex flex-col scrollbar-thin dark:scrollbar-thumb-blue-600">
                    
                    <button 
                        onClick={() => setSelectedArticle(null)}
                        className="absolute top-6 right-6 p-2 bg-black dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors z-20"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="p-8 md:p-12">
                        {/* Build Briefing */}
                        <div className="mb-16 space-y-10">
                            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between border-b-4 border-black dark:border-white/10 pb-6">
                                <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter italic leading-none">
                                    {USE_CASES[selectedArticle].title} // Overview
                                </h2>
                                <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] italic">
                                    Build ID: 0x0{selectedArticle + 1}
                                </div>
                            </div>

                            <div className="space-y-12 max-w-4xl">
                                {[
                                    { label: 'Main Purpose', value: USE_CASES[selectedArticle].purpose, icon: <Target size={24} />, active: true },
                                    { label: 'What to Focus On', value: USE_CASES[selectedArticle].focus, icon: <Scan size={24} /> },
                                    { label: 'How to Achieve', value: USE_CASES[selectedArticle].howTo, icon: <Hammer size={24} /> },
                                    { label: 'Performance Expectations', value: USE_CASES[selectedArticle].expectations, icon: <Eye size={24} />, active: true },
                                ].map((point, i) => (
                                    <div key={i} className="flex gap-8 items-start group">
                                        <div className={`p-3 border-2 border-black shrink-0 transition-colors ${point.active ? 'bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white dark:bg-black text-gray-400 dark:text-slate-600 dark:border-white/10 group-hover:border-blue-600 group-hover:text-blue-600'}`}>
                                            {point.icon}
                                        </div>
                                        <div className="space-y-2">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.4em] italic ${point.active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-600'}`}>
                                                {point.label}
                                            </span>
                                            <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white uppercase italic tracking-tight leading-snug max-w-2xl">
                                                {point.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Optimal Config Table */}
                        <div className="bg-white dark:bg-[#0a0a0a]/50 border-2 border-black dark:border-white/10 overflow-hidden">
                            <div className="p-8 border-b-2 border-black dark:border-white/10 text-center">
                                <h3 className="font-black text-black dark:text-white uppercase tracking-[0.3em] text-sm mb-8 italic">RECOMMENDED BUILD CONFIGURATIONS</h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-black dark:border-white/10 divide-x-2 divide-black dark:divide-white/10">
                                    {[
                                        { k: 'amd_nvidia', l: 'AMD+NV' },
                                        { k: 'amd_amd', l: 'AMD+AMD' },
                                        { k: 'intel_nvidia', l: 'INTEL+NV' },
                                        { k: 'intel_intel', l: 'INTEL+ARC' },
                                    ].map(m => (
                                        <button 
                                            key={m.k}
                                            onClick={() => setSpecMode(m.k as SpecMode)}
                                            className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                                                specMode === m.k ? 'bg-black dark:bg-blue-600 text-white' : 'bg-white dark:bg-[#1a1a1a] text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-[#252525]'
                                            }`}
                                        >
                                            {m.l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black dark:bg-white/10">
                                {[
                                    { label: 'CPU PLATFORM', value: USE_CASES[selectedArticle].specs[specMode].cpu, icon: <Cpu size={20} /> },
                                    { label: 'GRAPHICS CORE', value: USE_CASES[selectedArticle].specs[specMode].gpu, icon: <Activity size={20} /> },
                                    { label: 'MOTHERBOARD', value: USE_CASES[selectedArticle].specs[specMode].motherboard, icon: <Layout size={20} /> },
                                    { label: 'MEMORY UNIT', value: USE_CASES[selectedArticle].specs[specMode].ram, icon: <Zap size={20} /> },
                                    { label: 'STORAGE ARRAY', value: USE_CASES[selectedArticle].specs[specMode].storage, icon: <HardDrive size={20} /> },
                                    { label: 'POWER CELL', value: USE_CASES[selectedArticle].specs[specMode].psu, icon: <BatteryCharging size={20} /> },
                                ].map((spec, i) => (
                                    <div key={i} className="bg-white dark:bg-[#121212] p-8 flex flex-col gap-4 group hover:bg-gray-50 dark:hover:bg-black/40 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest italic">{spec.label}</span>
                                            <div className="text-blue-600 dark:text-blue-400 opacity-30 group-hover:opacity-100 transition-opacity">
                                                {spec.icon}
                                            </div>
                                        </div>
                                        <span className="text-base font-black text-black dark:text-white uppercase tracking-tight italic leading-tight">{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            {USE_CASES[selectedArticle].specs[specMode].notes && (
                                <div className="bg-amber-50 dark:bg-amber-900/10 border-t-2 border-black dark:border-white/10 p-6 flex items-start gap-4">
                                    <AlertTriangle className="text-amber-600 dark:text-amber-500 flex-shrink-0" size={20} />
                                    <p className="text-[10px] text-amber-900 dark:text-amber-200 leading-relaxed font-bold uppercase italic">
                                        NOTE: {USE_CASES[selectedArticle].specs[specMode].notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-8 bg-white dark:bg-[#121212] border-t-2 border-black dark:border-white/10 mt-auto flex justify-end">
                        <button 
                            onClick={() => setSelectedArticle(null)}
                            className="px-12 py-5 bg-black dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs transition-all italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
