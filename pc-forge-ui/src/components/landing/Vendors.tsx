import { ScrollVelocityContainer, ScrollVelocityRow } from '../ui/ScrollVelocity';

export default function Vendors() {
  const vendors = [
    "JunaidTech",
    "ZAHComputers",
    "TechMatched",
    "Techarc",
    "WALI's TECH",  
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10 max-w-full mx-auto">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-16">
            <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em]">Aggregated Pricing Data</h2>
        </div>
        
        <ScrollVelocityContainer className="space-y-4 md:space-y-8">
          <ScrollVelocityRow baseVelocity={5} direction={1} className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic">
            {vendors.map((v) => (
              <span key={v} className="mx-8 text-black dark:text-white opacity-20 hover:opacity-100 transition-opacity cursor-default">
                {v} <span className="text-blue-600 dark:text-blue-400 mx-4">•</span>
              </span>
            ))}
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={5} direction={-1} className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic">
            {vendors.map((v) => (
              <span key={v} className="mx-8 text-black dark:text-white opacity-20 hover:opacity-100 transition-opacity cursor-default">
                {v} <span className="text-blue-600 dark:text-blue-400 mx-4">•</span>
              </span>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16">
            <p className="text-[10px] text-gray-400 dark:text-slate-600 uppercase tracking-widest font-black max-w-lg">
            Synchronized daily with Pakistani retailers. Data parity verified.
            </p>
        </div>
      </div>
    </section>
  );
}
