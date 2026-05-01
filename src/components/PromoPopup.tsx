import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift } from 'lucide-react';
import { useContent } from '../lib/ContentContext';

export default function PromoPopup() {
  const { content } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem('promo-seen');
    if (content?.promo?.enabled && !hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [content?.promo?.enabled]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('promo-seen', 'true');
  };

  if (!content?.promo?.enabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-zinc-900 text-white p-10 md:p-14 max-w-lg w-full shadow-2xl border border-white/10"
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2"
              aria-label="Close promotion"
            >
              <X size={24} />
            </button>

            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-brand-gold flex items-center justify-center rounded-sm">
                <Gift className="text-black" size={24} />
              </div>
              <div className="h-1 w-20 bg-brand-gold" />
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-6 italic leading-none">
              {content.promo.title}
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl font-light mb-10 leading-relaxed">
              {content.promo.message}
            </p>

            <div className="space-y-6">
              <div className="bg-brand-black/50 border border-white/10 p-6 flex flex-col items-center justify-center space-y-2">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500">Access Code</span>
                <span className="text-3xl font-display font-bold tracking-widest text-brand-gold select-all uppercase">
                  {content.promo.code}
                </span>
              </div>
              
              <button
                onClick={handleClose}
                className="w-full bg-brand-gold text-black py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all"
              >
                Claim This Offer
              </button>
            </div>

            <p className="text-center text-[9px] uppercase tracking-widest text-gray-600 mt-8 font-medium">
              Limited time signature production offering.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
