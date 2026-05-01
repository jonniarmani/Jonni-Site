import { Link, useLocation } from "react-router-dom";
import { BRAND } from "../config";
import { Menu, X, Video, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Video", href: "/video" },
  { label: "Photo", href: "/photo" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Booking", href: "/booking" },
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
          ? "bg-white/90 backdrop-blur-lg px-6 py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 max-w-6xl" 
          : "max-w-7xl"
      } flex justify-between items-center`}>
        <div className="flex flex-col">
          <Link 
            to="/" 
            className="font-display text-lg sm:text-2xl font-bold tracking-tighter uppercase group flex items-center overflow-hidden"
            id="nav-logo"
          >
            <motion.span 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.1 }}
              className="group-hover:opacity-70 transition-opacity"
            >
              Jonni Armani <span className="text-brand-gold">Media</span>
            </motion.span>
          </Link>
          
          {/* SEO Text - Desktop Only */}
          <div className="hidden md:block">
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-brand-black/40">
              Professional Video & Photography | serving Sarasota, Bradenton, Tampa & Palmetto, FL
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-[10px] uppercase tracking-widest font-black hover:text-brand-gold transition-colors ${location.pathname === '/' ? 'text-brand-gold' : 'text-brand-black'}`}>Home</Link>
          <Link to="/services" className={`text-[10px] uppercase tracking-widest font-black hover:text-brand-gold transition-colors ${location.pathname === '/services' ? 'text-brand-gold' : 'text-brand-black'}`}>Services</Link>
          
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
            <Link 
              to="/video" 
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                location.pathname === '/video' ? 'bg-brand-gold text-white shadow-sm' : 'text-gray-500 hover:text-brand-black'
              }`}
            >
              <Video size={10} /> Video
            </Link>
            <Link 
              to="/photo" 
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                location.pathname === '/photo' ? 'bg-brand-black text-white shadow-sm' : 'text-gray-500 hover:text-brand-gold'
              }`}
            >
              <Camera size={10} /> Photo
            </Link>
          </div>

          <Link to="/about" className={`text-[10px] uppercase tracking-widest font-black hover:text-brand-gold transition-colors ${location.pathname === '/about' ? 'text-brand-gold' : 'text-brand-black'}`}>About</Link>
          <Link to="/contact" className="bg-brand-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold transition-all">Inquire</Link>
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
                  <Link
                    to={item.href}
                    className={`text-4xl font-display font-bold tracking-tighter uppercase hover:text-brand-gold transition-colors ${
                      location.pathname === item.href ? "text-brand-gold" : "text-brand-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
