import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Video, Camera, Plus, X, ArrowUpRight, Star, Menu as MenuIcon } from "lucide-react";

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
            <div className="bg-white text-brand-black border border-gray-200 shadow-[0_15px_50px_rgba(0,0,0,0.15)] rounded-full p-1.5 flex items-center justify-between pointer-events-auto max-w-sm mx-auto">
              <Link 
                to="/" 
                className={`flex-1 flex flex-col items-center justify-center h-12 rounded-full transition-all ${location.pathname === '/' ? 'bg-black text-white' : 'text-gray-400'}`}
              >
                <div className="text-[9px] font-black uppercase tracking-tighter">Home</div>
              </Link>
              
              <Link 
                to="/video" 
                className={`flex-1 flex flex-col items-center justify-center h-12 rounded-full transition-all ${location.pathname === '/video' ? 'bg-black text-white' : 'text-gray-400'}`}
              >
                <Video size={14} className="mb-0.5" />
                <div className="text-[8px] font-black uppercase tracking-tighter">Video</div>
              </Link>

              <Link 
                to="/photo" 
                className={`flex-1 flex flex-col items-center justify-center h-12 rounded-full transition-all ${location.pathname === '/photo' ? 'bg-black text-white' : 'text-gray-400'}`}
              >
                <Camera size={14} className="mb-0.5" />
                <div className="text-[8px] font-black uppercase tracking-tighter">Photo</div>
              </Link>

              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-12 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-brand-cyan text-black' : 'bg-brand-black text-white'} active:scale-95`}
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </motion.div>

          {/* MOBILE: Expanded Menu Backdrop */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[64] md:hidden"
              />
            )}
          </AnimatePresence>

          {/* MOBILE: Expanded Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-24 left-4 right-4 z-[65] md:hidden"
              >
                <div className="bg-brand-black border border-white/10 rounded-3xl p-5 shadow-2xl max-w-sm mx-auto overflow-hidden">
                  <div className="mb-6 flex justify-between items-end">
                    <div>
                      <h3 className="text-white font-display text-xl font-bold tracking-tighter uppercase italic">
                        Jonni Armani <span className="text-brand-cyan">Hub</span>
                      </h3>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Select your destination</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Book", href: "/booking", icon: Plus, color: "text-brand-cyan", bg: "bg-brand-cyan/5" },
                      { label: "Services", href: "/services", icon: Video, color: "text-white", bg: "bg-white/5" },
                      { label: "About", href: "/about", icon: ArrowUpRight, color: "text-white", bg: "bg-white/5" },
                      { label: "Contact", href: "/contact", icon: Plus, color: "text-brand-cyan", bg: "bg-brand-cyan/5" },
                      { label: "Reviews", href: "/reviews", icon: Star, color: "text-white", bg: "bg-white/5" },
                      { label: "Portfolio", href: "/photo", icon: Camera, color: "text-white", bg: "bg-white/5" },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all border border-white/5 active:bg-white/10 ${item.bg} group`}
                      >
                        <item.icon size={20} className={`mb-2 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 text-center">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                    <a 
                      href="tel:2085499544" 
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center active:scale-95 transition-transform shadow-lg shadow-green-900/20"
                    >
                      Call Now
                    </a>
                    <Link 
                      to="/contact" 
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-brand-cyan text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center active:scale-95 transition-transform"
                    >
                      Inquire
                    </Link>
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
