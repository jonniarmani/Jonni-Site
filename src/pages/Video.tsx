import { motion } from "motion/react";
import SEOComp from "../components/SEO";
import { Link } from "react-router-dom";
import { Play, ArrowRight, Video as VideoIcon, X } from "lucide-react";
import { useState } from "react";
import { useContent } from "../lib/ContentContext";

export default function Video() {
  const { content } = useContent();
  const { portfolio } = content;
  const [filter, setFilter] = useState("All");
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  // Filter items by type
  const videoProjects = portfolio.filter(p => p.type === 'video');
  
  const categories = ["All", ...new Set(videoProjects.map(p => p.category))];

  const filteredProjects = filter === "All" 
    ? videoProjects 
    : videoProjects.filter(p => p.category === filter);

  const getVideoType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'direct';
  };

  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube') {
      const id = url.split('v=')[1] || url.split('/').pop()?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (type === 'vimeo') {
      const id = url.split('/').pop()?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-40">
      <SEOComp 
        title="Sports & Commercial Cinematography | Jonni Armani Media" 
        description="Cinematic brand stories and high-performance sports cinematography. Capturing elite performance from LECOM Park baseball to IMG Academy athletics." 
      />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 lg:mb-24 gap-12">
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 block"
            >
              Florida Commercial & Sports Video
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-8 uppercase"
            >
              Commercial <br /><span className="italic font-light text-gray-400">Cinematography.</span>
            </motion.h1>
            <p className="text-gray-500 text-lg sm:text-xl font-light leading-relaxed max-w-xl">
              Capturing the intensity of elite competition—from the diamonds of LECOM Park to the world-renowned fields of IMG Academy.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:gap-8 justify-start lg:justify-end w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs uppercase tracking-[0.2em] font-bold pb-2 border-b-2 transition-all ${
                  filter === cat ? "border-brand-gold text-brand-black" : "border-transparent text-gray-400 hover:text-brand-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredProjects.map((item, idx) => {
            const isPlaying = playingIdx === idx;
            const videoType = item.videoUrl ? getVideoType(item.videoUrl) : null;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div 
                  className={`group block ${!item.videoUrl ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
                  onClick={() => {
                    if (item.videoUrl) setPlayingIdx(isPlaying ? null : idx);
                  }}
                >
                  <div className="aspect-video bg-brand-gray overflow-hidden relative mb-8">
                    {isPlaying && item.videoUrl ? (
                      <div className="absolute inset-0 bg-black">
                        {videoType === 'direct' ? (
                          <video 
                            src={item.videoUrl} 
                            autoPlay 
                            controls 
                            playsInline
                            className="w-full h-full object-contain bg-black"
                            poster={item.placeholder}
                          />
                        ) : (
                          <iframe
                            src={getEmbedUrl(item.videoUrl, videoType!)}
                            className="w-full h-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingIdx(null);
                          }}
                          className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md z-10"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        {item.placeholder ? (
                          <img 
                            src={item.placeholder} 
                            alt={item.alt || item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 border border-zinc-800">
                            {item.videoUrl && videoType === 'direct' ? (
                              <video 
                                src={`${item.videoUrl}#t=0.1`} 
                                preload="metadata" 
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                              />
                            ) : (
                              <VideoIcon size={40} className="text-zinc-700" />
                            )}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-transparent transition-colors" />
                        {item.videoUrl && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-20 h-20 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform bg-white/10">
                              <Play size={28} className="text-white fill-white ml-1" />
                            </div>
                          </div>
                        )}
                        {!item.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">In Production</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-brand-gold uppercase tracking-[0.3em] text-[10px] font-black">{item.category}</span>
                        {(item.client || item.year) && (
                          <span className="text-gray-400 text-[9px] uppercase font-medium tracking-widest border-l border-gray-200 pl-3">
                            {item.client} {item.year && ` | ${item.year}`}
                          </span>
                        )}
                      </div>
                      <h3 className="text-3xl font-display font-bold tracking-tight uppercase group-hover:text-brand-gold transition-colors">{item.title}</h3>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-end text-brand-black group-hover:translate-x-2 transition-transform">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <section className="mt-24 sm:mt-40 border-t border-gray-100 pt-16 sm:pt-32 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 uppercase tracking-tighter italic">Ready to tell your <span className="not-italic text-brand-gold">Video Story?</span></h2>
          <div className="flex justify-center">
            <Link to="/contact?type=video" className="bg-brand-black text-white px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-gold transition-colors inline-flex items-center">
              Start Video Project <ArrowRight size={18} className="ml-3" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
