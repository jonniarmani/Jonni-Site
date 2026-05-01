import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowRight, Video, Camera } from "lucide-react";

export default function FloatingActionHub() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px (past hero)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-0 right-0 z-40 px-6 flex justify-center pointer-events-none"
        >
          <div className="flex flex-col sm:flex-row gap-3 pointer-events-auto">
            <Link
              to="/contact?type=video"
              className="bg-brand-gold text-white px-6 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center group active:scale-95 transition-all hover:bg-brand-black"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 group-hover:bg-brand-gold transition-colors">
                <Video size={14} />
              </div>
              <span>Start Video Project</span>
              <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/contact?type=photo"
              className="bg-brand-black text-white px-6 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center group active:scale-95 transition-all hover:bg-brand-gold"
            >
              <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center mr-3 group-hover:bg-brand-black transition-colors">
                <Camera size={14} className="text-brand-gold" />
              </div>
              <span>Start Photo Project</span>
              <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
