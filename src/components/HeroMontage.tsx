import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../lib/ContentContext";

export default function HeroMontage() {
  const { content } = useContent();
  const visuals = content.home.heroVisuals;
  const [index, setIndex] = useState(0);

  const [keywordIndex, setKeywordIndex] = useState(0);

  const keywords = [
    "Professional Sports",
    "Medical Marketing",
    "Luxury Healthcare",
    "Brand Storytelling",
    "Cosmetic Dentistry",
    "Real Estate Cinema",
    "Yachting Media",
    "IMG Athletics",
    "Plastic Surgery",
    "Hospitality Reels",
    "Corporate Tech",
    "Legal Videography",
    "Modeling Portfolios",
    "Interior & Home",
    "Fine Dining",
    "Dentistry & Oral Surgery"
  ];

  useEffect(() => {
    const keywordTimer = setInterval(() => {
      setKeywordIndex((prev) => (prev + 1) % keywords.length);
    }, 3000);
    return () => clearInterval(keywordTimer);
  }, []);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
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

      {/* Simplified Overlays */}
      <div className="absolute inset-0 bg-brand-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black/80" />
    </div>
  );
}
