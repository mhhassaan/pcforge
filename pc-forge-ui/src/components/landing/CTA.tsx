import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-32 bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="bg-black p-12 md:p-24 rounded-none text-center relative overflow-hidden group shadow-[16px_16px_0px_0px_rgba(37,99,235,1)]">
            <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic">
                READY TO BUILD <br className="hidden md:block" /> YOUR BEAST?
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-bold max-w-xl mx-auto uppercase tracking-wide">
                Mission control is ready. Start your build now.
            </p>
            <div className="pt-4">
                <Link 
                to="/builder" 
                className="bg-blue-600 hover:bg-white hover:text-black text-white font-black py-6 px-16 inline-flex items-center gap-4 transition-all uppercase tracking-[0.2em] text-sm border-2 border-blue-600"
                >
                INITIALIZE SYSTEM <ArrowRight size={24} />
                </Link>
            </div>
            </div>
        </div>
      </div>
    </section>
  );
}
