import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS = [
    { 
        title: "Prepare Test Bench", 
        desc: "Place the motherboard on its box. Never build on carpet! This serves as a non-conductive surface to test parts before installing.", 
        imgs: [
            "https://intelcorp.scene7.com/is/image/intelcorp/s9-u05-05-product-shot-motherboard-original-rwd:1920-1080?wid=1920&hei=1080",
        ] 
    },
    { 
        title: "Install CPU", 
        desc: "Lift the retention arm. Align the golden triangle on the CPU with the triangle on the socket. Drop it in gently—zero force needed.", 
        imgs: [
          "https://intelcorp.scene7.com/is/image/intelcorp/s9-u05-12-install-cpu-original-rwd:1920-1080?wid=1920&hei=1080", 
          "https://intelcorp.scene7.com/is/image/intelcorp/s9-u05-13-install-cpu-original-rwd:1920-1080?wid=1920&hei=1080",
          "https://intelcorp.scene7.com/is/image/intelcorp/s9-u05-14-install-cpu-original-rwd:1920-1080?wid=1920&hei=1080"
        ] 
    },
    { 
        title: "Install RAM", 
        desc: "Open the clips on slots 2 and 4 (usually). Align the notch. Push down firmly until you hear a satisfying 'CLICK'.", 
        imgs: ["https://placehold.co/800x600/ffffff/black?text=RAM+Install"] 
    },
    { 
        title: "Install M.2 SSD", 
        desc: "Remove the heat sink screw. Insert the SSD at a 30-degree angle. Push down and secure with the screw or latch.", 
        imgs: ["https://placehold.co/800x600/ffffff/black?text=SSD+Install"] 
    },
    { 
        title: "Mount CPU Cooler", 
        desc: "CRITICAL: Remove the plastic peel from the cooler base! Apply a pea-sized dot of thermal paste if not pre-applied. Screw in a star pattern.", 
        imgs: ["https://placehold.co/800x600/ffffff/black?text=Cooler+Mount"] 
    },
    { 
        title: "Case Prep & Mobo Install", 
        desc: "Install the I/O shield (if separate). Screw in standoffs. Lower motherboard in and screw it down. Don't over-tighten.", 
        imgs: ["https://placehold.co/800x600/ffffff/black?text=Case+Install"] 
    },
    { 
        title: "Power Supply & Cables", 
        desc: "Install PSU. Route the 24-pin (Motherboard) and 8-pin (CPU) cables through the back. Connect them now—it's tight later.", 
        imgs: ["https://placehold.co/800x600/ffffff/black?text=PSU+Cables"] 
    },
    { 
        title: "Install Graphics Card", 
        desc: "Remove the back PCIe slot covers. Open the PCIe latch. Push GPU in until it clicks. Screw it into the bracket.", 
        imgs: ["https://placehold.co/800x600/ffffff/black?text=GPU+Install"] 
    },
    { 
        title: "Cable Management & Boot", 
        desc: "Plug in GPU power. Tidy up cables with zip ties. Connect monitor to GPU (not Mobo!). Power on and mash DELETE for BIOS.", 
        imgs: ["https://placehold.co/800x600/ffffff/black?text=Boot+Up"] 
    }
];

export default function AssemblyFlow() {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedStep(index);
    setCurrentImageIndex(0);
  };

  const closeLightbox = () => {
    setSelectedStep(null);
    setCurrentImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedStep === null) return;
    const totalImages = STEPS[selectedStep].imgs.length;
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedStep === null) return;
    const totalImages = STEPS[selectedStep].imgs.length;
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <>
      <div className="relative py-12 overflow-hidden">
        {/* Central Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 md:translate-x-0 ml-4 md:ml-0" />

        <div className="space-y-12 md:space-y-20">
          {STEPS.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Node */}
              <div className="absolute left-4 md:left-1/2 w-10 h-10 bg-white border-2 border-black rounded-none z-10 -translate-x-1/2 ml-4 md:ml-0 flex items-center justify-center font-black text-[10px]">
                  {i + 1}
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0">
                  <div className={`bg-white p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] transition-all ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-widest text-[9px] ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          <span>SEQUENCE_0{i + 1}</span>
                      </div>
                      <h3 className="text-xl font-black text-black uppercase tracking-tight mb-3">{step.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed font-medium uppercase tracking-tight">{step.desc}</p>
                  </div>
              </div>

              {/* Image Side */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0">
                  <div 
                    className="rounded-none overflow-hidden border-2 border-black p-1 bg-white cursor-pointer relative group"
                    onClick={() => openLightbox(i)}
                  >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-blue-600/10 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                              Expand Visual
                          </span>
                      </div>
                      <img 
                          src={step.imgs[0]} 
                          alt={step.title} 
                          className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                      />
                      {step.imgs.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-blue-600 px-2 py-1 text-[8px] font-black text-white uppercase tracking-widest">
                              +{step.imgs.length - 1} DATA_POINTS
                          </div>
                      )}
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedStep !== null && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4"
                onClick={closeLightbox}
            >
                <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
                    
                    {/* Close Button */}
                    <button 
                        onClick={closeLightbox}
                        className="absolute top-0 right-0 p-2 text-black hover:text-blue-600 transition-colors z-50"
                    >
                        <X size={32} />
                    </button>

                    {/* Main Image */}
                    <div className="bg-white border-2 border-black p-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <motion.img 
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={STEPS[selectedStep].imgs[currentImageIndex]}
                            alt={`Step ${selectedStep + 1} Image`}
                            className="max-h-[70vh] w-auto object-contain"
                        />
                    </div>

                    {/* Navigation Buttons */}
                    {STEPS[selectedStep].imgs.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-black text-white hover:bg-blue-600 transition-colors"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-black text-white hover:bg-blue-600 transition-colors"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Caption */}
                    <div className="absolute bottom-10 text-center space-y-2">
                        <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic">{STEPS[selectedStep].title}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            STEP {selectedStep + 1} OF {STEPS.length} // IMG {currentImageIndex + 1}
                        </p>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}