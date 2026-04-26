import { motion, AnimatePresence } from "motion/react";
import SEOComp from "../components/SEO";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useContent } from "../lib/ContentContext";

interface PhotoItem {
  category: string;
  title: string;
  placeholder: string;
  url: string;
  images?: string[];
  alt?: string;
  client?: string;
  year?: string;
}

function PhotoProject({ item }: { item: PhotoItem }) {
  const allImages = [item.placeholder, ...(item.images || []).slice(0, 4)];
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const displayIdx = hoverIdx !== null ? hoverIdx : activeIdx;

  const next = () => setActiveIdx((prev) => (prev + 1) % allImages.length);
  const prev = () => setActiveIdx((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Grid Thumbnails */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-1 mb-8">
          <div className="flex justify-between items-baseline">
            <span className="text-brand-gold uppercase tracking-[0.3em] text-[10px] font-black">{item.category}</span>
            <span className="text-gray-400 text-[9px] uppercase font-medium">
              {item.client} {item.year && `• ${item.year}`}
            </span>
          </div>
          <h3 className="text-3xl font-display font-bold tracking-tight uppercase group-hover:text-brand-gold transition-colors">{item.title}</h3>
        </div>

        {/* Main Thumbnail (Large) */}
        <div 
          className="aspect-[4/3] bg-zinc-100 overflow-hidden relative cursor-pointer group/main"
          onMouseEnter={() => setHoverIdx(0)}
          onMouseLeave={() => setHoverIdx(null)}
          onClick={() => setActiveIdx(0)}
        >
          <img 
            src={allImages[0]} 
            alt={item.title} 
            className={`w-full h-full object-cover transition-all duration-700 ${activeIdx === 0 ? 'grayscale-0' : 'grayscale group-hover/main:grayscale-0'}`}
          />
          {activeIdx === 0 && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-brand-gold/90">
              <p className="text-black text-[10px] uppercase tracking-widest font-black">Main Portfolio Shot</p>
            </div>
          )}
        </div>

        {/* 4 Thumbnails Underneath */}
        <div className="grid grid-cols-4 gap-3">
          {allImages.slice(1).map((img, i) => (
            <div 
              key={i} 
              className={`aspect-square bg-zinc-100 overflow-hidden relative cursor-pointer transition-all duration-300 border-2 ${activeIdx === i + 1 ? 'border-brand-gold' : 'border-transparent'}`}
              onMouseEnter={() => setHoverIdx(i + 1)}
              onMouseLeave={() => setHoverIdx(null)}
              onClick={() => setActiveIdx(i + 1)}
            >
              <img 
                src={img} 
                alt={`${item.title} ${i + 1}`} 
                className={`w-full h-full object-cover grayscale hover:grayscale-0 transition-all ${activeIdx === i + 1 ? 'grayscale-0' : ''}`}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 pt-4">
          <button onClick={prev} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-black hover:text-white transition-all">
            <ChevronLeft size={20} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {activeIdx + 1} <span className="mx-2">/</span> {allImages.length}
          </span>
          <button onClick={next} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-black hover:text-white transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Right Column: Pop-over Preview Area */}
      <div className="lg:col-span-7 h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] relative overflow-hidden bg-zinc-900 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <img 
              src={allImages[displayIdx]} 
              alt="Active View" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
            
            {hoverIdx !== null && (
              <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20">
                <p className="text-white text-[8px] uppercase tracking-[0.3em] font-black">Hovering Detail View</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Decorative elements */}
        <div className="absolute bottom-8 left-8">
           <div className="w-24 h-[1px] bg-brand-gold/50 mb-4" />
           <p className="text-white/40 text-[9px] uppercase tracking-[0.5em] font-black">Interactive Identity Grid</p>
        </div>
      </div>
    </div>
  );
}

export default function Photo() {
  const { content } = useContent();
  const { portfolio } = content;
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("category") || "All";

  const setFilter = (cat: string) => {
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  // Filter items by type
  const photoProjects = portfolio.filter(p => p.type === 'photo');
  
  const categories = ["All", ...Array.from(new Set(photoProjects.map(p => p.category))) as string[]];

  const filteredProjects = filter === "All" 
    ? photoProjects 
    : photoProjects.filter(p => p.category === filter);

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-40">
      <SEOComp 
        title="Sports & Professional Photography | Jonni Armani Media" 
        description="Premium brand identity and high-performance sports photography. Capturing the spirit of LECOM Park baseball and IMG Academy athletic excellence." 
      />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 lg:mb-32 gap-12">
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 block"
            >
              High-End Visual Identity
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-9xl font-display font-bold tracking-tighter leading-[0.8] mb-8 uppercase"
            >
              Elite <br /><span className="italic font-light text-gray-400">Sports & Identity.</span>
            </motion.h1>
            <p className="text-gray-500 text-lg sm:text-xl font-light leading-relaxed max-w-xl">
              From the historic baseline at LECOM Park to the high-stakes performance at IMG Academy—every frame is a legacy in the making.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:gap-8 justify-start lg:justify-end w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] uppercase tracking-[0.3em] font-black pb-3 border-b-2 transition-all ${
                  filter === cat ? "border-green-600 text-brand-black" : "border-transparent text-gray-300 hover:text-green-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-40">
          {filteredProjects.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
               <PhotoProject item={item as any} />
            </motion.div>
          ))}
        </div>

        <section className="mt-24 sm:mt-60 border-t border-gray-100 pt-16 sm:pt-32 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 uppercase tracking-tighter italic">Secure Your <span className="not-italic text-brand-gold">Visual Legacy?</span></h2>
          <div className="flex justify-center">
            <Link to="/contact?type=photo" className="bg-brand-black text-white px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-green-600 transition-colors inline-flex items-center">
              Book Photography <ArrowRight size={18} className="ml-3" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
