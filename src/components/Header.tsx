import { Link, useLocation } from "react-router-dom";
import { BRAND } from "../config";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Video", href: "/video" },
  { label: "Photo", href: "/photo" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Calendar", href: BRAND.contact.calendar, isExternal: true },
  { label: "Contact", href: "/contact" },
];

import { useContent } from "../lib/ContentContext";

export default function Header() {
  const { content } = useContent();
  const { brand } = content;
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "px-4 pt-4" : "bg-transparent py-8 px-6"
      }`}
    >
      <div className={`container mx-auto transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-lg px-6 py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 max-w-5xl" 
          : "max-w-7xl"
      } flex justify-between items-center`}>
        <Link 
          to="/" 
          className="font-display text-lg sm:text-2xl font-bold tracking-tighter uppercase group flex items-center"
          id="nav-logo"
        >
          <span className="group-hover:opacity-70 transition-opacity">Jonni Armani Media</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">
          {NAV_ITEMS.map((item) => {
            const isSpecial = item.label === "Video" || item.label === "Photo";
            
            if (item.isExternal) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-widest font-medium hover:text-green-600 transition-colors text-brand-black"
                >
                  {item.label}
                </a>
              );
            }

            if (isSpecial) {
              const isVideo = item.label === "Video";
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative overflow-hidden text-[10px] uppercase tracking-[0.2em] font-black px-6 py-2.5 rounded-full border-2 transition-all duration-300 flex items-center group ${
                    location.pathname === item.href 
                    ? "bg-brand-gold text-white border-brand-gold shadow-lg shadow-brand-gold/20" 
                    : "border-brand-gold text-brand-black hover:bg-brand-gold hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Video: Film Strip Animation */}
                  {isVideo && (
                    <motion.div 
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 flex items-center overflow-hidden"
                      initial={false}
                    >
                      <motion.div 
                        className="flex whitespace-nowrap"
                        animate={{ x: [0, -100] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      >
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex items-center mx-1">
                            <div className="w-6 h-8 border border-white flex flex-col justify-between py-1">
                              <div className="w-1 h-1 bg-white mx-auto rounded-full" />
                              <div className="w-1 h-1 bg-white mx-auto rounded-full" />
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Photo: Camera Shutter Click Animation */}
                  {!isVideo && (
                    <motion.div 
                      className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <motion.div 
                        className="w-full h-full bg-white"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ 
                          scale: [0, 1.2, 1],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  )}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm uppercase tracking-widest font-medium hover:text-brand-gold transition-colors ${
                  location.pathname === item.href ? "text-brand-gold" : "text-brand-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle Button - High Visibility Floating Button */}
        <motion.button 
          className={`md:hidden p-3 rounded-full transition-colors ${
            scrolled ? "text-brand-black" : "bg-brand-black text-white shadow-xl"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          id="mobile-nav-toggle"
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Floating Bottom Hub for Mobile - Always Following */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 z-50 px-6 md:hidden flex justify-center"
          >
            <div className="bg-brand-black/95 backdrop-blur-md text-white rounded-full px-6 py-4 shadow-2xl border border-white/10 flex items-center space-x-6">
              <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-brand-gold transition-colors">Home</Link>
              <div className="w-[1px] h-4 bg-white/10" />
              <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Inquire</Link>
              <div className="w-[1px] h-4 bg-white/10" />
              <button 
                onClick={() => setIsOpen(true)}
                className="text-[10px] font-black uppercase tracking-widest flex items-center space-x-2"
              >
                <span>Menu</span>
                <Menu size={14} className="text-brand-gold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-40 md:hidden flex flex-col justify-center items-center"
          >
            <motion.nav 
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
              className="flex flex-col items-center space-y-8"
            >
              {NAV_ITEMS.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: 20, opacity: 0 }
                  }}
                >
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xl font-display font-bold tracking-tighter uppercase text-brand-black hover:text-brand-gold transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className={`text-4xl font-display font-bold tracking-tighter uppercase hover:text-brand-gold transition-colors ${
                        location.pathname === item.href ? "text-brand-gold" : "text-brand-black"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
