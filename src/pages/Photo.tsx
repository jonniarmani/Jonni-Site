import { motion, AnimatePresence } from "motion/react";
import SEOComp from "../components/SEO";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useContent } from "../lib/ContentContext";
import ResponsiveImage from "../components/ResponsiveImage";

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

  const next = () => setActiveIdx((prev) => (prev + 1) % allImages.length);
  const prev = () => setActiveIdx((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Context Info Only */}
      <div className="lg:col-span-4 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
            <span className="text-brand-gold uppercase tracking-[0.3em] text-[10px] font-black">{item.category}</span>
            <span className="text-gray-400 text-[9px] uppercase font-medium">
              {item.client} {item.year && `• ${item.year}`}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase group-hover:text-brand-gold transition-colors leading-[0.9]">
            {item.title}
          </h2>
        </div>

        <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs">
          {item.alt || "Capturing high-performance visual legacy with technical precision and cinematic intent."}
        </p>

        {item.url && item.url !== "#" && (
          <Link 
            to={item.url} 
            className="inline-flex items-center gap-2 text-brand-gold uppercase font-black text-[10px] tracking-widest bg-brand-gold/10 px-4 py-2 rounded-sm border border-brand-gold/20 hover:bg-brand-gold hover:text-white transition-all mt-4"
          >
            Visit Detailed Gallery <ArrowRight size={14} />
          </Link>
        )}

        {/* Controls moved here for better ergonomics */}
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

      {/* Right Column: Main Image & Thumbnail Navigation */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Main Display Area */}
        <div className="aspect-video sm:aspect-square md:aspect-video lg:aspect-[16/10] relative overflow-hidden bg-zinc-900 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {allImages[activeIdx] && (
                <ResponsiveImage 
                  src={allImages[activeIdx]} 
                  alt={`${item.title} - Active View`} 
                  className="w-full h-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  style={{ objectPosition: (item as any).objectPosition || 'center center' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6">
                 <p className="text-white/40 text-[9px] uppercase tracking-[0.5em] font-black">Frame {activeIdx + 1}</p>
                 <div className="w-12 h-[1px] bg-brand-gold mt-2" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Navigation Row - "The Scroll" */}
        <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide scroll-smooth">
          {allImages.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setActiveIdx(i)}
              className={`flex-shrink-0 w-24 sm:w-32 aspect-[4/5] bg-zinc-100 overflow-hidden relative cursor-pointer transition-all duration-300 border-2 ${activeIdx === i ? 'border-brand-gold ring-4 ring-brand-gold/10' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              {img && (
                <ResponsiveImage 
                  src={img} 
                  alt={`${item.title} Thumbnail ${i + 1}`} 
                  className={`w-full h-full object-cover transition-all duration-500 ${activeIdx === i ? 'scale-110' : ''}`}
                  sizes="150px"
                />
              )}
              {activeIdx === i && (
                <div className="absolute inset-0 bg-brand-gold/20" />
              )}
            </button>
          ))}
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
        title="Premium Professional & Event Photography | Jonni Armani Media" 
        description="High-end professional identity and event photography across the Florida Gulf Coast. Specializing in medical, sports, corporate headshots, family, and event media." 
      />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 lg:mb-32 gap-12">
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 block"
            >
              Bradenton & Sarasota Photography
            </motion.span>
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.8] uppercase">
              Professional <br /><span className="italic font-light text-gray-400">Brand & Event Media.</span>
            </h1>
          </div>
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
                  filter === cat ? "border-brand-gold text-brand-black" : "border-transparent text-gray-300 hover:text-brand-gold"
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
          <div className="flex flex-col items-center gap-8">
            <Link to="/contact?type=photo" className="bg-brand-black text-white px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-gold transition-colors inline-flex items-center group">
              Book Photography <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="max-w-lg">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold mb-4 block">Tactical Photography</span>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] mx-auto leading-relaxed">
                Premium Commercial Photography & Brand Identity services across Sarasota, Bradenton, and the Tampa Bay metropolis.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
