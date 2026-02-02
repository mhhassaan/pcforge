import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { 
     q: "How long does it take to build a PC?", 
     a: "For a first-time builder, expect 2-4 hours. Experienced builders can complete a build in 30-60 minutes. Take your time and follow guides carefully." 
  },
  { 
     q: "Do I need special tools to build a PC?", 
     a: "Minimal tools are needed. A Phillips head screwdriver is essential. An anti-static wrist strap is recommended but not required if you're careful." 
  },
  { 
     q: "What's the warranty on PC components?", 
     a: "Most components come with 1-3 year warranties. GPUs typically have 2-3 years, CPUs have 3 years, and SSDs have 5 years. Check with manufacturers for specifics." 
  },
  { 
     q: "Can I upgrade my PC later?", 
     a: "Most components are upgradeable. GPUs, RAM, and storage are the easiest to upgrade. CPU upgrades depend on your motherboard socket compatibility." 
  },
  { 
     q: "What's the difference between DDR4 and DDR5 RAM?", 
     a: "DDR5 is faster and more power-efficient than DDR4, but also more expensive. For gaming, DDR4 is still excellent. DDR5 shines in workstation tasks and future-proofing." 
  },
  { 
     q: "How do I know if my PC is running optimally?", 
     a: "Monitor temperatures, CPU/GPU usage, and frame rates. Use tools like HWiNFO or GPU-Z. Temperatures should stay below 80°C under load for optimal performance." 
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {FAQS.map((faq, i) => (
        <div 
          key={i} 
          className={`bg-slate-800 rounded-xl border transition-all duration-300 overflow-hidden ${
            openIndex === i ? 'border-blue-500 shadow-lg shadow-blue-900/20' : 'border-slate-700 hover:border-slate-600'
          }`}
        >
          <button 
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full p-6 text-left flex justify-between items-center group"
          >
            <span className={`font-bold text-lg transition-colors uppercase tracking-tight ${
              openIndex === i ? 'text-blue-400' : 'text-white group-hover:text-blue-400'
            }`}>
              {faq.q}
            </span>
            <ChevronDown 
              size={24} 
              className={`text-slate-500 transition-transform duration-300 ${
                openIndex === i ? 'rotate-180 text-blue-400' : 'rotate-0'
              }`} 
            />
          </button>
          
          <div 
            className={`transition-all duration-300 ease-in-out ${
              openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-6 pt-0 text-slate-400 leading-relaxed text-sm border-t border-slate-700/50 mt-2 mx-6 py-4">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
