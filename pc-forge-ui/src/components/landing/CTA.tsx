import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TextAnimate } from '../ui/TextAnimate';

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

            <p className="text-gray-400 dark:text-slate-400 text-base md:text-xl font-bold max-w-xl uppercase tracking-wide">
                Mission FORGE is ready. Start your build now.
            </p>
            <div className="pt-4 flex justify-center">
                <Link 
                to="/builder" 
                className="bg-blue-600 hover:bg-white dark:hover:bg-blue-500 hover:text-black dark:hover:text-white text-white font-black py-4 px-8 md:py-6 md:px-16 inline-flex items-center gap-4 transition-all uppercase tracking-[0.2em] text-[10px] md:text-sm border-2 border-blue-600 w-full sm:w-auto"
                >
                INITIALIZE SYSTEM <ArrowRight size={20} className="md:size-6" />
                </Link>
            </div>
            </div>
        </div>
      </div>
    </section>
  );
}
