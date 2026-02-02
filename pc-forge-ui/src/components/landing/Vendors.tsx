export default function Vendors() {
  const vendors = [
    "JunaidTech",
    "ZAH Computers",
    "TechMatched",
    "Techarc"
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">
        <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-16">Aggregated Pricing Data</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {vendors.map((v) => (
            <div key={v} className="text-3xl font-black text-black font-sans tracking-tighter uppercase whitespace-nowrap">
              {v}
            </div>
          ))}
        </div>

        <p className="mt-20 text-[10px] text-gray-400 uppercase tracking-widest font-black max-w-lg mx-auto">
          Synchronized daily with Pakistani retailers.
        </p>
      </div>
    </section>
  );
}
