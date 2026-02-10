import Cubes from '@/components/ui/Cubes';

export default function Vendors() {
  const vendors = [
    "JunaidTech",
    "ZAHComputers",
    "TechMatched",
    "Techarc",
    "WALI's TECH"
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
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
        <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-16">Aggregated Pricing Data</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700 overflow-hidden mx-auto">
          {vendors.map((v) => (
            <div key={v} className="text-xl md:text-3xl font-black text-black font-sans tracking-tighter uppercase break-words">
              {v}
            </div>
          ))}
        </div>

        <p className="mt-20 text-[10px] text-gray-400 uppercase tracking-widest font-black max-w-lg">
          Synchronized daily with Pakistani retailers.
        </p>
      </div>
    </section>
  );
}
