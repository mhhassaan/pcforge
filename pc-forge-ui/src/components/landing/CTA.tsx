import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Cubes from '@/components/ui/Cubes';

export default function CTA() {
  return (
    <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-200 overflow-hidden relative">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Cubes 
          gridSize={12}
          maxAngle={75}
          radius={3}
          borderStyle="1px solid #000"
          faceColor="transparent"
          rippleColor="#2563EB"
          rippleSpeed={1.5}
          autoAnimate
          rippleOnClick
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="bg-black p-8 md:p-24 rounded-none text-left relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] md:shadow-[16px_16px_0px_0px_rgba(37,99,235,1)]">
            <div className="relative z-10 space-y-8 md:space-y-10">
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic border-l-8 border-blue-600 pl-6 md:pl-10">
                READY TO BUILD <br className="hidden md:block" /> YOUR BEAST?
            </h2>
            <p className="text-gray-400 text-base md:text-xl font-bold max-w-xl uppercase tracking-wide">
                Mission control is ready. Start your build now.
            </p>
            <div className="pt-4">
                <Link 
                to="/builder" 
                className="bg-blue-600 hover:bg-white hover:text-black text-white font-black py-4 px-8 md:py-6 md:px-16 inline-flex items-center gap-4 transition-all uppercase tracking-[0.2em] text-[10px] md:text-sm border-2 border-blue-600 w-full sm:w-auto"
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
