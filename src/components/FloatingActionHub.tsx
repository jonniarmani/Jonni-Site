import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Video, Camera, ChevronLeft } from "lucide-react";

export default function FloatingActionHub() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show after scrolling past hero
      setIsVisible(currentScrollY > 700);
      
      // Detect scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 700) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine X offset based on state
  // On Desktop/Idle: 0
  // On Mobile Scroll Down: Slide out but leave enough to read "Start"
  const xOffset = isHovered ? 0 : isScrollingDown ? 90 : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ 
            x: xOffset,
            opacity: 1 
          }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-end space-y-3 pointer-events-none"
        >
          {isScrollingDown && !isHovered && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute -left-10 top-1/2 -translate-y-1/2 text-brand-gold animate-pulse lg:hidden flex flex-col items-center"
             >
               <ChevronLeft size={24} />
               <span className="text-[6px] font-black uppercase vertical-text mt-1">Peek</span>
             </motion.div>
          )}

          <Link
            to="/contact?type=video"
            className="group pointer-events-auto flex items-center bg-brand-gold text-white pl-5 pr-10 py-5 rounded-l-full shadow-2xl transition-all hover:pr-14 active:scale-95 border-y border-l border-white/10"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-4 shrink-0 shadow-inner">
              <Video size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Start Video</span>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-60 leading-none mt-1">Cinematography</span>
            </div>
          </Link>

          <Link
            to="/contact?type=photo"
            className="group pointer-events-auto flex items-center bg-brand-black text-white pl-5 pr-10 py-5 rounded-l-full shadow-2xl transition-all hover:pr-14 active:scale-95 border-y border-l border-brand-gold/30"
          >
            <div className="w-9 h-9 rounded-full bg-brand-gold flex items-center justify-center mr-4 shrink-0 shadow-lg">
              <Camera size={18} className="text-brand-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Start Photo</span>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-brand-gold leading-none mt-1">Photography</span>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
