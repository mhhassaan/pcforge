import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TextAnimate } from '../ui/TextAnimate';
import { Highlighter } from '../ui/Highlighter';
import { ShinyButton } from '../ui/ShinyButton';

export default function CTA() {
  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-[#0a0a0a]/30 border-t border-gray-200 dark:border-white/5 overflow-hidden relative transition-colors duration-300">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="bg-black dark:bg-slate-900 p-8 md:p-24 rounded-none text-left relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] md:shadow-[16px_16px_0px_0px_rgba(37,99,235,1)] dark:shadow-[16px_16px_0px_0px_rgba(37,99,235,0.3)]">
            <div className="relative z-10 space-y-8 md:space-y-10 text-center items-center flex flex-col">

            <TextAnimate 
                animation="fadeIn" 
                by="line" 
                as="h2" 
                className="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic border-l-8 border-blue-600 pl-6 md:pl-10"
            >
                READY TO FORGE YOUR BUILD?
            </TextAnimate>

            <p className="text-gray-400 dark:text-slate-400 text-base md:text-xl font max-w-xl uppercase tracking-wide">
                Mission FORGE is ready! <Highlighter color="#2563EB" action="highlight" iterations={3}><span className="text-white"><b>Start your build now</b></span></Highlighter>
            </p>
            <div className="pt-4 flex justify-center">
                <Link to="/builder">
                    <ShinyButton className="px-12 py-6 text-sm">
                        INITIALIZE SYSTEM <ArrowRight size={20} className="md:size-6" />
                    </ShinyButton>
                </Link>
            </div>            </div>
        </div>
      </div>
    </section>
  );
}
