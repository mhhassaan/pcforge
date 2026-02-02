import { useState } from 'react';
import { BookOpen, Cpu, Monitor, Zap, Briefcase, MousePointer, X, TrendingUp, HelpCircle, AlertTriangle } from 'lucide-react';
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
  details: string;
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
    summary: "Maximize FPS and graphical fidelity. The GPU is your king.",
    image: "https://placehold.co/800x400/ffffff/black?text=Gaming+Build+Setup",
    details: `
      <h3 class="font-black text-black text-2xl mb-4 uppercase tracking-tighter italic underline decoration-4 decoration-blue-600 underline-offset-4">The Priority: GPU > CPU > RAM</h3>
      <p class="mb-4 text-gray-600 font-medium">For a purely gaming machine, your Graphics Card (GPU) is the most critical component. It handles rendering textures, lighting, and models. Allocate 40-50% of your budget here.</p>
      
      <h4 class="font-black text-blue-600 mb-3 uppercase tracking-widest text-[10px]">Key Specs to Watch:</h4>
      <ul class="list-disc pl-5 mb-6 space-y-2 text-gray-500 font-bold uppercase text-[9px] tracking-wider">
        <li><strong>VRAM:</strong> 8GB is the absolute minimum for 1080p today. Aim for 12GB+ for 1440p gaming.</li>
        <li><strong>Single Core Speed:</strong> Games prefer fast individual cores over many slow cores.</li>
        <li><strong>Refresh Rate:</strong> Ensure your monitor matches your GPU's capabilities.</li>
      </ul>
    `,
    specs: {
      amd_nvidia: {
        cpu: "Ryzen 7 7800X3D",
        gpu: "GeForce RTX 4070 Ti Super",
        motherboard: "B650 Eagle AX",
        ram: "32GB DDR5-6000 CL30",
        storage: "2TB WD SN850X NVMe",
        psu: "850W Gold Modular"
      },
      amd_amd: {
        cpu: "Ryzen 7 7800X3D",
        gpu: "Radeon RX 7900 XT",
        motherboard: "B650 Eagle AX",
        ram: "32GB DDR5-6000 CL30",
        storage: "2TB Samsung 990 Pro",
        psu: "850W Gold Modular"
      },
      intel_nvidia: {
        cpu: "Core i7-14700K",
        gpu: "GeForce RTX 4070 Ti Super",
        motherboard: "Z790 Tomahawk WiFi",
        ram: "32GB DDR5-6000 CL30",
        storage: "2TB WD SN850X NVMe",
        psu: "850W Gold Modular"
      },
      intel_intel: {
        cpu: "Core i7-14700K",
        gpu: "Arc A770 16GB",
        motherboard: "Z790 Tomahawk WiFi",
        ram: "32GB DDR5-6000 CL30",
        storage: "2TB Crucial P5 Plus",
        psu: "750W Gold Modular",
        notes: "Intel Arc GPUs are excellent value but drivers are still maturing."
      }
    }
  },
  {
    title: "Productivity Workstation",
    icon: <Cpu size={24} />,
    summary: "Video editing, 3D rendering, and compiling code. Core count is everything.",
    image: "https://placehold.co/800x400/ffffff/black?text=Workstation+Setup",
    details: `
      <h3 class="font-black text-black text-2xl mb-4 uppercase tracking-tighter italic underline decoration-4 decoration-blue-600 underline-offset-4">The Priority: CPU > RAM > Storage</h3>
      <p class="mb-4 text-gray-600 font-medium">For tasks like Premiere Pro, Blender, or code compilation, you need raw multi-threaded processing power.</p>
    `,
    specs: {
      amd_nvidia: {
        cpu: "Ryzen 9 7950X (16-Core)",
        gpu: "GeForce RTX 4060 Ti 16GB (CUDA)",
        motherboard: "X670E Pro RS",
        ram: "64GB DDR5-5600",
        storage: "4TB Samsung 990 Pro",
        psu: "1000W Platinum"
      },
      amd_amd: {
        cpu: "Ryzen 9 7950X (16-Core)",
        gpu: "Radeon RX 7600 XT 16GB",
        motherboard: "X670E Pro RS",
        ram: "64GB DDR5-5600",
        storage: "4TB WD SN850X",
        psu: "1000W Platinum"
      },
      intel_nvidia: {
        cpu: "Core i9-14900K (24-Core)",
        gpu: "GeForce RTX 4060 Ti 16GB",
        motherboard: "Z790 Creator",
        ram: "64GB DDR5-5600",
        storage: "4TB Samsung 990 Pro",
        psu: "1000W Platinum"
      },
      intel_intel: {
        cpu: "Core i9-14900K (24-Core)",
        gpu: "Arc A770 16GB (Deep Link)",
        motherboard: "Z790 Creator",
        ram: "64GB DDR5-5600",
        storage: "4TB Crucial T700 Gen5",
        psu: "1000W Platinum",
        notes: "Intel Deep Link technology can accelerate encoding."
      }
    }
  },
  {
    title: "Streaming & Content Creation",
    icon: <Monitor size={24} />,
    summary: "Gaming while broadcasting requires dedicated encoding hardware.",
    image: "https://placehold.co/800x400/ffffff/black?text=Streaming+Setup",
    details: `
      <h3 class="font-black text-black text-2xl mb-4 uppercase tracking-tighter italic underline decoration-4 decoration-blue-600 underline-offset-4">The Priority: Encoder Quality</h3>
      <p class="mb-4 text-gray-600 font-medium">NVIDIA GPUs are industry standard for streamers due to their <strong>NVENC</strong> encoder.</p>
    `,
    specs: {
      amd_nvidia: {
        cpu: "Ryzen 9 7900X",
        gpu: "GeForce RTX 4070 (NVENC)",
        motherboard: "B650 LiveMixer",
        ram: "32GB DDR5-6000",
        storage: "2TB NVMe + 4TB HDD Archive",
        psu: "750W Gold"
      },
      amd_amd: {
        cpu: "Ryzen 9 7900X",
        gpu: "Radeon RX 7800 XT (AV1)",
        motherboard: "B650 LiveMixer",
        ram: "32GB DDR5-6000",
        storage: "2TB NVMe + 4TB HDD Archive",
        psu: "850W Gold"
      },
      intel_nvidia: {
        cpu: "Core i7-13700K",
        gpu: "GeForce RTX 4070 (NVENC)",
        motherboard: "Z790 Aero G",
        ram: "32GB DDR5-6000",
        storage: "2TB NVMe + 4TB HDD Archive",
        psu: "750W Gold"
      },
      intel_intel: {
        cpu: "Core i7-13700K",
        gpu: "Arc A750",
        motherboard: "Z790 Aero G",
        ram: "32GB DDR5-6000",
        storage: "2TB NVMe + 4TB HDD Archive",
        psu: "750W Gold",
        notes: "Intel Arc is incredible for streaming AV1 encoding."
      }
    }
  },
  {
    title: "Office & Home Use",
    icon: <Briefcase size={24} />,
    summary: "Reliability, silence, and speed for browsing and documents.",
    image: "https://placehold.co/800x400/ffffff/black?text=Office+Setup",
    details: `
      <h3 class="font-black text-black text-2xl mb-4 uppercase tracking-tighter italic underline decoration-4 decoration-blue-600 underline-offset-4">The Priority: SSD > CPU > RAM</h3>
      <p class="mb-4 text-gray-600 font-medium">A quality NVMe SSD ensures Windows opens in seconds. Modern CPUs have powerful integrated graphics.</p>
    `,
    specs: {
      amd_nvidia: {
        cpu: "Ryzen 5 8600G (Strong iGPU)",
        gpu: "Integrated Radeon 760M",
        motherboard: "A620M Micro-ATX",
        ram: "16GB DDR5-5200",
        storage: "1TB NVMe Gen4",
        psu: "500W Bronze"
      },
      amd_amd: {
        cpu: "Ryzen 5 8600G",
        gpu: "Integrated Radeon 760M",
        motherboard: "A620M Micro-ATX",
        ram: "16GB DDR5-5200",
        storage: "1TB NVMe Gen4",
        psu: "500W Bronze"
      },
      intel_nvidia: {
        cpu: "Core i3-14100",
        gpu: "Integrated UHD 730",
        motherboard: "H610M Micro-ATX",
        ram: "16GB DDR4-3200",
        storage: "1TB NVMe Gen3",
        psu: "500W Bronze"
      },
      intel_intel: {
        cpu: "Core i3-14100",
        gpu: "Integrated UHD 730",
        motherboard: "H610M Micro-ATX",
        ram: "16GB DDR4-3200",
        storage: "1TB NVMe Gen3",
        psu: "500W Bronze",
        notes: "For office use, Intel iGPUs are extremely stable."
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
    <div className="min-h-screen bg-white text-black p-4 md:p-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-20">
            <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter italic">ASSEMBLY GUIDE</h1>
            <div className="h-2 w-32 bg-blue-600 mb-6"></div>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Technical Documentation for PC Hardware Integration.</p>
        </header>

        {/* 1. USE CASE ARTICLES */}
        <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
                <BookOpen className="text-blue-600" size={24} />
                <h2 className="text-2xl font-black uppercase tracking-tight italic">Integration Vectors</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {USE_CASES.map((useCase, idx) => (
                    <div 
                        key={idx}
                        onClick={() => openArticle(idx)}
                        className="bg-white border-2 border-black p-8 group cursor-pointer transition-all hover:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-14 h-14 bg-black text-white flex items-center justify-center transition-colors group-hover:bg-blue-600">
                                {useCase.icon}
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">{useCase.title}</h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-tight font-bold uppercase mb-8 tracking-wide">{useCase.summary}</p>
                        <div className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                            Access Module <span>&rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 2. ASSEMBLY ORDER */}
        <section className="mb-32">
            <h2 className="text-4xl font-black mb-16 uppercase tracking-tighter text-center italic">SYSTEM INTEGRATION FLOW</h2>
            <AssemblyFlow />
        </section>

        {/* 3. LINGO & TRENDS */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <section>
                <div className="flex items-center gap-4 mb-10">
                    <HelpCircle className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-black uppercase tracking-tight italic">Glossary</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    {GLOSSARY.map((item) => (
                        <div key={item.term} className="bg-gray-50 p-6 border-l-4 border-black">
                            <div className="font-black text-blue-600 uppercase tracking-widest mb-2 text-[10px]">{item.term}</div>
                            <div className="text-gray-600 text-[11px] leading-tight font-bold uppercase">{item.def}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-4 mb-10">
                    <TrendingUp className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-black uppercase tracking-tight italic">Market Intel</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { t: "Used GPU Dominance", d: "High import taxes favor pre-owned RTX 3000 / RX 6000 series." },
                        { t: "NVMe Standards", d: "Gen 4 prices have stabilized; Gen 3 is legacy for new builds." },
                        { t: "White Build Premium", d: "Expected 'White Tax' of 5-15% on aesthetic hardware." }
                    ].map((trend) => (
                        <div key={trend.t} className="bg-white p-6 border-2 border-black">
                            <h4 className="font-black text-black uppercase text-xs mb-2 tracking-widest">{trend.t}</h4>
                            <p className="text-[11px] text-gray-500 leading-tight font-bold uppercase">{trend.d}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* MODAL FOR ARTICLES */}
        {selectedArticle !== null && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-white/95 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white border-2 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative flex flex-col scrollbar-thin">
                    
                    <button 
                        onClick={() => setSelectedArticle(null)}
                        className="absolute top-6 right-6 p-2 bg-black text-white hover:bg-blue-600 transition-colors z-20"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="p-10">
                        <div className="mb-12">
                            <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: USE_CASES[selectedArticle].details }}
                            />
                        </div>

                        <div className="bg-gray-50 border-2 border-black overflow-hidden">
                            <div className="p-8 border-b-2 border-black text-center">
                                <h3 className="font-black text-black uppercase tracking-[0.3em] text-sm mb-8 italic">OPTIMAL CONFIGURATION</h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-black divide-x-2 divide-black">
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
                                                specMode === m.k ? 'bg-black text-white' : 'bg-white text-gray-400 hover:bg-gray-100'
                                            }`}
                                        >
                                            {m.l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">
                                {[
                                    { label: 'CPU PLATFORM', value: USE_CASES[selectedArticle].specs[specMode].cpu },
                                    { label: 'GRAPHICS CORE', value: USE_CASES[selectedArticle].specs[specMode].gpu },
                                    { label: 'MOTHERBOARD', value: USE_CASES[selectedArticle].specs[specMode].motherboard },
                                    { label: 'MEMORY UNIT', value: USE_CASES[selectedArticle].specs[specMode].ram },
                                    { label: 'STORAGE ARRAY', value: USE_CASES[selectedArticle].specs[specMode].storage },
                                    { label: 'POWER CELL', value: USE_CASES[selectedArticle].specs[specMode].psu },
                                ].map((spec, i) => (
                                    <div key={i} className="bg-white p-8 flex flex-col justify-center">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{spec.label}</span>
                                        <span className="text-xs font-black text-black uppercase tracking-tight">{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            {USE_CASES[selectedArticle].specs[specMode].notes && (
                                <div className="bg-blue-50 border-t-2 border-black p-6 flex items-start gap-4">
                                    <AlertTriangle className="text-blue-600 flex-shrink-0" size={20} />
                                    <p className="text-[10px] text-blue-900 leading-relaxed font-bold uppercase italic">
                                        NOTE: {USE_CASES[selectedArticle].specs[specMode].notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-8 bg-white border-t-2 border-black mt-auto flex justify-end">
                        <button 
                            onClick={() => setSelectedArticle(null)}
                            className="px-10 py-4 bg-black hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] transition-colors"
                        >
                            Close Archive
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}