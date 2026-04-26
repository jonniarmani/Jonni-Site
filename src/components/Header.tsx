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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
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
              const activeClass = isVideo 
                ? "bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                : "bg-green-600 text-white border-green-600 shadow-[0_0_15px_rgba(22,163,74,0.3)]";
              const hoverClass = isVideo 
                ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white" 
                : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white";
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-[10px] uppercase tracking-[0.2em] font-black px-6 py-2.5 rounded-full border-2 transition-all duration-300 flex items-center ${
                    location.pathname === item.href ? activeClass : hoverClass
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm uppercase tracking-widest font-medium hover:text-green-600 transition-colors ${
                  location.pathname === item.href ? "text-brand-gold" : "text-brand-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle Button - Floating at Bottom Right */}
        <motion.button 
          className="fixed bottom-6 right-6 z-[60] md:hidden w-16 h-16 rounded-full bg-brand-black text-white flex items-center justify-center shadow-2xl border border-white/10" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          id="floating-mobile-nav-toggle"
          whileTap={{ scale: 0.9 }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
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
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xl font-display font-bold tracking-tighter uppercase text-brand-black hover:text-green-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className={`text-4xl font-display font-bold tracking-tighter uppercase hover:text-green-600 transition-colors ${
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
