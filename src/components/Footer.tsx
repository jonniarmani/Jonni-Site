import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Video, Mail, Phone, Calendar } from "lucide-react";
import { useContent } from "../lib/ContentContext";

import ShareButtons from "./ShareButtons";

export default function Footer() {
  const { content } = useContent();
  const { brand } = content;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white pt-20 pb-10 relative overflow-hidden">
      {/* Subtle Infused Branding - Animated and Lighter */}
      <div className="absolute bottom-[-10%] left-0 w-[200%] select-none pointer-events-none opacity-[0.1] z-0">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap"
        >
          <div className="flex whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-[45vw] font-display font-bold tracking-tighter uppercase leading-none mr-[10%]">
                {"JAM".split("").map((letter, j) => (
                  <motion.span
                    key={j}
                    animate={{ 
                      color: ["#ffffff", "var(--brand-cyan, #00f2ff)", "#ffffff"],
                      opacity: [0.2, 1, 1, 0.2],
                      textShadow: [
                        "0px 0px 0px rgba(255,255,255,0)",
                        "0px 0px 30px rgba(255,255,255,0.8)",
                        "0px 0px 30px rgba(0,242,255,0.8)",
                        "0px 0px 0px rgba(255,255,255,0)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: j * 0.5,
                      ease: "circOut",
                      times: [0, 0.3, 0.6, 1]
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
        <ShareButtons />
        <div className="h-[1px] w-full bg-white/5 mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <Link to="/" className="font-display text-3xl font-bold tracking-tighter uppercase inline-block">
              {brand.name.split(' ')[0]} <span className="text-brand-cyan">{brand.name.split(' ').slice(1).join(' ')}</span>
            </Link>
            <p className="text-gray-400 max-w-md text-lg font-light leading-relaxed">
              {brand.taglineExtended}
            </p>
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Connect With Us</h3>
              <div className="flex justify-center md:justify-start space-x-6">
                <a 
                  href={brand.socials.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:scale-110 transition-transform text-white/40 hover:text-brand-cyan"
                  aria-label="Visit our Instagram profile"
                >
                  <Instagram size={24} />
                  <span className="sr-only">Instagram</span>
                </a>
                <a 
                  href={brand.socials.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:scale-110 transition-transform text-white/40 hover:text-brand-cyan"
                  aria-label="Visit our Facebook page"
                >
                  <Facebook size={24} />
                  <span className="sr-only">Facebook</span>
                </a>
                <a 
                  href={brand.socials.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:scale-110 transition-transform text-white/40 hover:text-brand-cyan"
                  aria-label="Visit our YouTube channel"
                >
                  <Youtube size={24} />
                  <span className="sr-only">YouTube</span>
                </a>
                <a 
                  href={brand.socials.vimeo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:scale-110 transition-transform text-white/40 hover:text-brand-cyan"
                  aria-label="Visit our Vimeo portfolio"
                >
                  <Video size={24} />
                  <span className="sr-only">Vimeo</span>
                </a>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-loose">
              {brand.location}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">Navigation</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/video" className="hover:text-brand-cyan transition-colors text-gray-300">Video Production</Link></li>
              <li><Link to="/photo" className="hover:text-brand-cyan transition-colors text-gray-300">Photography</Link></li>
              <li><Link to="/services" className="hover:text-brand-cyan transition-colors text-gray-300">Services</Link></li>
              <li><Link to="/about" className="hover:text-brand-cyan transition-colors text-gray-300">About Story</Link></li>
              <li><Link to="/reviews" className="hover:text-brand-cyan transition-colors text-gray-300">Client Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-brand-cyan transition-colors text-gray-300">Contact & Booking</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">Service Areas</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium text-gray-400">
              <li className="hover:text-brand-cyan transition-colors">Bradenton</li>
              <li className="hover:text-brand-cyan transition-colors">Sarasota</li>
              <li className="hover:text-brand-cyan transition-colors">Tampa</li>
              <li className="hover:text-brand-cyan transition-colors">St. Pete</li>
              <li className="hover:text-brand-cyan transition-colors">Siesta Key</li>
              <li className="hover:text-brand-cyan transition-colors">Anna Maria Island</li>
              <li className="hover:text-brand-cyan transition-colors">Lakewood Ranch</li>
              <li className="hover:text-brand-cyan transition-colors">Venice</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-brand-cyan" />
                <a href={`mailto:${brand.contact.email}`} className="hover:text-brand-cyan transition-colors text-gray-300">{brand.contact.email}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-brand-cyan" />
                <a href={`tel:${brand.contact.phone.replace(/\./g, '')}`} className="hover:text-brand-cyan transition-colors text-gray-300">{brand.contact.phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Calendar size={16} className="text-brand-cyan" />
                <Link to="/booking" className="hover:text-brand-cyan transition-colors text-gray-300">Book a Session</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 uppercase tracking-widest font-medium">
          <p>© {currentYear} {brand.name}. All Visuals Protected.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-brand-cyan transition-colors font-bold">Admin Access</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
