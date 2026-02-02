import { Layers, ShieldCheck, Zap } from 'lucide-react';

const STEPS = [
  {
    icon: <Layers className="text-brand-primary" size={24} />,
    title: "Select Components",
    desc: "Choose from our exhaustive database of CPUs, GPUs, and motherboards."
  },
  {
    icon: <ShieldCheck className="text-brand-secondary" size={24} />,
    title: "Real-time Validation",
    desc: "Our engine automatically checks physical clearance, wattage, and socket matches."
  },
  {
    icon: <Zap className="text-yellow-400" size={24} />,
    title: "Compare & Buy",
    desc: "Get the lowest prices from trusted local vendors like Zah Computers and TechMatched."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-16 border-l-4 border-black pl-6">
          <h2 className="text-4xl font-bold text-black uppercase tracking-tighter mb-2">PROCESS</h2>
          <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">From selection to power-on.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-white p-10 hover:bg-gray-50 transition-colors group">
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full border border-blue-600 flex items-center justify-center">0{i+1}</span>
                Step
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-tight mb-4">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
