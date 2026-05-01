import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Video, Camera, Plus, X, ArrowUpRight } from "lucide-react";

export default function FloatingActionHub() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show after scrolling past hero
      setIsVisible(currentScrollY > 700);
      
      // Handle scrolling state
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);

      // Auto-close menu on scroll
      if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
        setIsOpen(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Determine if it's scrolling "away" (mostly for desktop)
  const isScrollingDown = isScrolling && window.scrollY > lastScrollY.current;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* DESKTOP: Centered Bottom Bar (First Iteration Style) */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: isScrollingDown ? 150 : 0, 
              opacity: 1 
            }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 left-0 right-0 z-[70] hidden md:flex justify-center pointer-events-none"
          >
            <div className="flex gap-4 p-2 bg-white/80 backdrop-blur-md rounded-full border border-white/20 shadow-2xl pointer-events-auto">
              <Link
                to="/contact?type=video"
                className="bg-brand-gold text-white px-8 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center group active:scale-95 transition-all hover:bg-brand-black shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-brand-gold transition-colors">
                  <Video size={18} />
                </div>
                <span>Start Video Project</span>
                <ArrowUpRight size={14} className="ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50" />
              </Link>
              
              <Link
                to="/contact?type=photo"
                className="bg-brand-black text-white px-8 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center group active:scale-95 transition-all hover:bg-brand-gold shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mr-4 group-hover:bg-brand-black transition-colors">
                  <Camera size={18} className="text-brand-gold" />
                </div>
                <span>Start Photo Project</span>
                <ArrowUpRight size={14} className="ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50" />
              </Link>
            </div>
          </motion.div>

          {/* MOBILE: Right-Side Midpoint Hub (Appears when stopped) */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ 
              x: (!isScrolling || isOpen) ? 0 : 80, 
              opacity: 1,
              y: "-50%" 
            }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-1/2 right-0 z-[70] md:hidden flex flex-col items-end space-y-4 pr-3 pointer-events-none"
          >
            {/* Action Options */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  className="flex flex-col items-end space-y-3 mb-2 pointer-events-auto"
                >
                  {/* Video Option */}
                  <div className="flex items-center">
                    <span className="bg-white px-3 py-1.5 rounded-sm text-[8px] font-black uppercase tracking-widest text-brand-black shadow-xl mr-3 border border-gray-100">
                      Cinematography
                    </span>
                    <Link
                      to="/contact?type=video"
                      onClick={() => setIsOpen(false)}
                      className="w-14 h-14 bg-brand-gold text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                    >
                      <Video size={20} />
                    </Link>
                  </div>

                  {/* Photo Option */}
                  <div className="flex items-center">
                    <span className="bg-white px-3 py-1.5 rounded-sm text-[8px] font-black uppercase tracking-widest text-brand-black shadow-xl mr-3 border border-gray-100">
                      Photography
                    </span>
                    <Link
                      to="/contact?type=photo"
                      onClick={() => setIsOpen(false)}
                      className="w-14 h-14 bg-brand-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all border border-brand-gold/30"
                    >
                      <Camera size={20} className="text-brand-gold" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Trigger Hub */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                pointer-events-auto relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] 
                transition-all duration-500 group active:scale-90
                ${isOpen ? 'bg-brand-black rotate-90' : 'bg-brand-gold'}
              `}
            >
              {isOpen ? (
                <X size={20} className="text-brand-gold" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                  {!isScrolling && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -left-2 top-0 -translate-x-full bg-brand-black text-white px-3 py-2 text-[8px] font-black uppercase tracking-widest rounded-sm flex items-center shadow-2xl whitespace-nowrap"
                    >
                      Start Project
                    </motion.div>
                  )}
                </div>
              )}

              {/* Pulsing ring for visibility when stopped */}
              {!isOpen && !isScrolling && (
                <span className="absolute inset-0 rounded-full bg-brand-gold/40 animate-ping scale-110" />
              )}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
