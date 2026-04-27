import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../lib/ContentContext";

export default function HeroMontage() {
  const { content } = useContent();
  const visuals = content.home.heroVisuals;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (visuals.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % visuals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [visuals.length]);

  if (!visuals || visuals.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {visuals[index].type === 'video' ? (
            visuals[index].url && (
              <video
                src={visuals[index].url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{ objectPosition: visuals[index].objectPosition || 'center center' }}
              />
            )
          ) : (
            visuals[index].url && (
              <img
                src={visuals[index].url}
                alt={visuals[index].category}
                className="w-full h-full object-cover"
                style={{ objectPosition: visuals[index].objectPosition || 'center center' }}
              />
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cyan/Blue Coastal Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/20 to-brand-gold/10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-black/80" />
      
      {/* Category Flash */}
      <div className="absolute bottom-10 right-10 z-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={visuals[index].category + index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-brand-gold text-[10px] uppercase tracking-[0.5em] font-black"
          >
            {visuals[index].category}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
