import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Video, Camera, Plus, X, ArrowUpRight, Menu as MenuIcon } from "lucide-react";

export default function FloatingActionHub() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always visible as requested
      setIsVisible(true);
      
      // Handle scrolling state
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);

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
                className="bg-brand-cyan text-white px-7 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center group active:scale-95 transition-all hover:bg-brand-black shadow-lg"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-brand-cyan transition-colors">
                  <Video size={16} />
                </div>
                <span>Start Video Project</span>
                <ArrowUpRight size={12} className="ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50" />
              </Link>
              
              <Link
                to="/contact?type=photo"
                className="bg-brand-black text-white px-7 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center group active:scale-95 transition-all hover:bg-brand-cyan shadow-lg"
              >
                <div className="w-9 h-9 rounded-full bg-brand-cyan/20 flex items-center justify-center mr-4 group-hover:bg-brand-black transition-colors">
                  <Camera size={16} className="text-brand-cyan" />
                </div>
                <span>Start Photo Project</span>
                <ArrowUpRight size={12} className="ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50" />
              </Link>
            </div>
          </motion.div>

          {/* MOBILE: Centered Bottom Nav Bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: isScrolling && !isOpen ? 120 : 0, 
              opacity: 1 
            }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-[70] md:hidden px-4 pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_15px_50px_rgba(0,0,0,0.15)] rounded-full px-2 py-2 flex items-center justify-between pointer-events-auto max-w-sm mx-auto">
              <Link 
                to="/" 
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${location.pathname === '/' ? 'text-brand-cyan bg-gray-50' : 'text-gray-400'}`}
              >
                <div className="text-[10px] font-black uppercase tracking-tighter">Home</div>
              </Link>
              
              <Link 
                to="/video" 
                className={`flex items-center gap-2 px-4 h-11 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  location.pathname === '/video' 
                    ? 'bg-brand-cyan text-black shadow-lg shadow-brand-cyan/20' 
                    : 'text-gray-700'
                }`}
              >
                <Video size={14} />
                <span>Video</span>
              </Link>

              <Link 
                to="/photo" 
                className={`flex items-center gap-2 px-4 h-11 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  location.pathname === '/photo' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-gray-700'
                }`}
              >
                <Camera size={14} />
                <span>Photo</span>
              </Link>

              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${isOpen ? 'bg-brand-cyan text-black' : 'bg-brand-black text-brand-cyan'} shadow-lg active:scale-95`}
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </motion.div>

          {/* MOBILE: Expanded Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-24 left-4 right-4 z-[65] md:hidden"
              >
                <div className="bg-brand-black/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm mx-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Book Now", href: "/booking", icon: Plus, color: "text-brand-cyan" },
                      { label: "Services", href: "/services", icon: Video, color: "text-white" },
                      { label: "About", href: "/about", icon: ArrowUpRight, color: "text-white" },
                      { label: "Contact", href: "/contact", icon: Plus, color: "text-white" },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-center justify-center aspect-square bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5 group"
                      >
                        <item.icon size={24} className={`mb-3 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
