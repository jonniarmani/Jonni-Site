import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Video, Mail, Phone, Calendar } from "lucide-react";
import { useContent } from "../lib/ContentContext";

export default function Footer() {
  const { content } = useContent();
  const { brand } = content;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white pt-20 pb-10 relative overflow-hidden">
      {/* Subtle Infused Branding - Animated and Lighter */}
      <div className="absolute bottom-[-10%] left-0 w-[200%] select-none pointer-events-none opacity-[0.12] z-0">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap"
        >
          <span className="text-[45vw] font-display font-bold tracking-tighter uppercase leading-none mr-[20%]">
            JAM JAM JAM
          </span>
          <span className="text-[45vw] font-display font-bold tracking-tighter uppercase leading-none">
            JAM JAM JAM
          </span>
        </motion.div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <Link to="/" className="font-display text-3xl font-bold tracking-tighter uppercase inline-block">
              {brand.name.split(' ')[0]} <span className="text-brand-gold">{brand.name.split(' ').slice(1).join(' ')}</span>
            </Link>
            <p className="text-gray-400 max-w-md text-lg font-light leading-relaxed">
              {brand.taglineExtended}
            </p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest leading-loose">
              {brand.location}
            </p>
            <div className="flex space-x-6">
              <a href={brand.socials.instagram} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform text-[#E4405F]">
                <Instagram size={24} />
              </a>
              <a href={brand.socials.facebook} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform text-[#1877F2]">
                <Facebook size={24} />
              </a>
              <a href={brand.socials.youtube} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform text-[#FF0000]">
                <Youtube size={24} />
              </a>
              <a href={brand.socials.vimeo} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform text-[#1AB7EA]">
                <Video size={24} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/video" className="hover:text-brand-gold transition-colors">Video Production</Link></li>
              <li><Link to="/photo" className="hover:text-brand-gold transition-colors">Photography</Link></li>
              <li><Link to="/services" className="hover:text-brand-gold transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-brand-gold transition-colors">About Story</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact & Booking</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Service Areas</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium text-gray-500">
              <li className="hover:text-brand-gold transition-colors">Bradenton</li>
              <li className="hover:text-brand-gold transition-colors">Sarasota</li>
              <li className="hover:text-brand-gold transition-colors">Tampa</li>
              <li className="hover:text-brand-gold transition-colors">St. Pete</li>
              <li className="hover:text-brand-gold transition-colors">Siesta Key</li>
              <li className="hover:text-brand-gold transition-colors">Anna Maria Island</li>
              <li className="hover:text-brand-gold transition-colors">Lakewood Ranch</li>
              <li className="hover:text-brand-gold transition-colors">Venice</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-brand-gold" />
                <a href={`mailto:${brand.contact.email}`} className="hover:text-brand-gold transition-colors">{brand.contact.email}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-brand-gold" />
                <a href={`tel:${brand.contact.phone.replace(/\./g, '')}`} className="hover:text-brand-gold transition-colors">{brand.contact.phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Calendar size={16} className="text-brand-gold" />
                <a href={brand.contact.calendar} target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">Studio Calendar</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest font-medium">
          <p>© {currentYear} {brand.name}. All Visuals Protected.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-brand-gold transition-colors font-bold">Admin Access</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
