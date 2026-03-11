import { Layers, ShieldCheck, Zap } from 'lucide-react';
import { TextAnimate } from '../ui/TextAnimate';
import { Highlighter } from '../ui/Highlighter';
import SpotlightCard from '../ui/SpotlightCard';

const STEPS = [
  {
    icon: <Layers size={24} />,
    title: "Select Components",
    desc: "Choose from our exhaustive database of CPUs, GPUs, and motherboards."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Real-time Validation",
    desc: "Our engine automatically checks physical clearance, wattage, and socket matches."
  },
  {
    icon: <Zap size={24} />,
    title: "Compare & Buy",
    desc: "Get the lowest prices from trusted local vendors like Zah Computers and TechMatched."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-16 border-l-4 border-blue-600 pl-6">
          <TextAnimate 
            animation="fadeIn" 
            by="character" 
            as="h2" 
            className="text-3xl md:text-4xl font-bold text-black dark:text-white uppercase tracking-tighter mb-2 italic"
          >
            PROCESS
          </TextAnimate>
          <p className="text-gray-500 dark:text-slate-500 font-medium uppercase tracking-widest text-[10px] md:text-xs">
            From selection to <Highlighter action="underline" color="#2563EB" iterations={2} strokeWidth={2}>power-on.</Highlighter>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black dark:border-white/10 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black dark:divide-white/10">
          {STEPS.map((step, i) => (
            <SpotlightCard 
              key={i} 
              className="bg-white dark:bg-[#121212] transition-all group"
              spotlightColor="rgba(37, 99, 235, 0.15)"
            >
              <div className="p-8 md:p-10">
                <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border border-blue-600 dark:border-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">0{i+1}</span>
                  Step
                </div>
                <div className="mb-6 text-gray-300 dark:text-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black text-black dark:text-white uppercase tracking-tight mb-4 italic group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{step.title}</h3>
                <p className="text-[13px] md:text-sm text-gray-600 dark:text-slate-400 leading-relaxed font-bold uppercase">{step.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
