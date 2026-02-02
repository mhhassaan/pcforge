import { Link } from 'react-router-dom';
import { Camera, Plus, Monitor } from 'lucide-react';

const MOCK_BUILDS = [
    { id: '1', title: "The Obsidian Frame", username: "BuildMaster_99", price: 450000, img: null },
    { id: '2', title: "Whiteout productivity", username: "ZenBuilder", price: 280000, img: null },
    { id: '3', title: "Budget workstation v2", username: "StudentRig", price: 120000, img: null },
    { id: '4', title: "Streaming Beast 2026", username: "ViralTech", price: 890000, img: null },
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex-1">
                <h1 className="text-6xl font-black text-black uppercase tracking-tighter mb-4 italic leading-none">COMMUNITY GALLERY</h1>
                <div className="h-2 w-32 bg-blue-600 mb-6"></div>
                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Verified Architectural Assemblies by Local Enthusiasts.</p>
            </div>
            <Link 
                to="/builder"
                className="flex items-center gap-3 bg-black hover:bg-blue-600 text-white font-black py-5 px-10 rounded-none transition-all uppercase tracking-widest text-[10px] shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]"
            >
                Submit Your Build <Plus size={16} />
            </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_BUILDS.map((build) => (
                <div key={build.id} className="group border-2 border-black bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
                    <div className="aspect-[4/3] bg-gray-50 border-b-2 border-black relative flex items-center justify-center overflow-hidden">
                        <Camera size={48} className="text-gray-200 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">
                            Ref: {build.id}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1.5 text-xs font-black font-mono shadow-lg">
                            Rs. {build.price.toLocaleString()}
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                        <div>
                            <h3 className="text-sm font-black text-black uppercase tracking-tight group-hover:text-blue-600 transition-colors italic mb-1">
                                {build.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                <Monitor size={10} /> {build.username}
                            </div>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">STATUS: COMPLETED</span>
                            <button className="text-[9px] font-black text-black hover:text-blue-600 uppercase tracking-widest underline decoration-2 underline-offset-4 transition-colors">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State / Coming Soon */}
        <div className="mt-20 p-20 border-2 border-black border-dashed bg-gray-50 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mb-6">
                <Camera size={32} className="text-black" />
             </div>
             <h2 className="text-xl font-black text-black uppercase tracking-[0.3em] mb-4">Awaiting Submissions</h2>
             <p className="text-gray-400 text-xs font-bold uppercase max-w-sm leading-relaxed">
                The database is expanding. Be the first to catalog your hardware configuration in our global repository.
             </p>
        </div>
      </div>
    </div>
  );
}
