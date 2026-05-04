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
        scrolled ? "px-4 pt-4" : "bg-transparent py-6 px-6"
      }`}
    >
      <div className={`container mx-auto transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-lg px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 max-w-6xl" 
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
              Jonni Armani <span className="text-brand-cyan">Media</span>
            </motion.span>
          </Link>
          
          {/* SEO Text - Desktop Only */}
          <div className="hidden lg:block">
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-brand-black/40">
              Professional Video & Photography | serving Sarasota, Bradenton, Tampa & Palmetto, FL
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`text-[10px] uppercase tracking-widest font-black hover:text-brand-cyan transition-colors ${location.pathname === "/" ? "text-brand-cyan" : "text-brand-black"}`}>Home</Link>
          <Link to="/services" className={`text-[10px] uppercase tracking-widest font-black hover:text-brand-cyan transition-colors ${location.pathname === "/services" ? "text-brand-cyan" : "text-brand-black"}`}>Services</Link>
          
          <div className="flex items-center space-x-2 mx-1">
            <Link 
              to="/video" 
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
                location.pathname === "/video" 
                  ? "bg-brand-cyan text-black shadow-[0_0_15px_rgba(0,242,255,0.4)] border-brand-cyan" 
                  : "bg-white text-gray-700 hover:bg-brand-cyan hover:text-black hover:shadow-[0_0_10px_rgba(0,242,255,0.2)] border-gray-200"
              }`}
            >
              <Video size={10} /> Video
            </Link>
            <Link 
              to="/photo" 
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
                location.pathname === "/photo" 
                  ? "bg-black text-white shadow-lg border-black" 
                  : "bg-white text-gray-700 hover:bg-black hover:text-white hover:shadow-lg border-gray-200"
              }`}
            >
              <Camera size={10} /> Photo
            </Link>
          </div>

          <Link to="/about" className={`text-[10px] uppercase tracking-widest font-black hover:text-brand-cyan transition-colors ${location.pathname === "/about" ? "text-brand-cyan" : "text-brand-black"}`}>About</Link>
          <Link to="/reviews" className={`text-[10px] uppercase tracking-widest font-black hover:text-brand-cyan transition-colors ${location.pathname === "/reviews" ? "text-brand-cyan" : "text-brand-black"}`}>Reviews</Link>
          <Link to="/contact" className="bg-brand-black text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-cyan transition-all shadow-md">Inquire</Link>
        </nav>

        {/* Mobile Toggle Button - Hidden as we use the Floating Hub for thumb-friendly mobile nav */}
        <div className="md:hidden" />
      </div>
    </header>
  );
}
