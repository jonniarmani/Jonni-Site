import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../lib/ContentContext";
import ResponsiveImage from "./ResponsiveImage";

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

  const getVideoType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'direct';
  };

  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube') {
      let id = "";
      if (url.includes('v=')) {
        id = url.split('v=').pop()?.split('&')[0] || "";
      } else if (url.includes('youtu.be/')) {
        id = url.split('youtu.be/').pop()?.split('?')[0] || "";
      } else {
        id = url.split('/').pop()?.split('?')[0] || "";
      }
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0&controls=0&loop=1&playlist=${id}`;
    }
    if (type === 'vimeo') {
      const id = url.split('/').pop()?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&background=1`;
    }
    return url;
  };

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
              <div className="w-full h-full">
                {getVideoType(visuals[index].url) === 'direct' ? (
                  <video
                    src={visuals[index].url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    {...(index === 0 ? { fetchPriority: "high" } : {})}
                    className="w-full h-full object-cover"
                    style={{ 
                      objectPosition: visuals[index].objectPosition || 'center center',
                      filter: `brightness(${visuals[index].brightness ?? 100}%)`
                    }}
                  />
                ) : (
                  <iframe
                    src={getEmbedUrl(visuals[index].url, getVideoType(visuals[index].url))}
                    className="w-full h-full border-0 pointer-events-none scale-110"
                    allow="autoplay; fullscreen"
                    title="Hero Video"
                  />
                )}
              </div>
            )
          ) : (
            visuals[index].url && (
              <ResponsiveImage
                src={visuals[index].url}
                alt={visuals[index].category}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: visuals[index].objectPosition || 'center center',
                  filter: `brightness(${visuals[index].brightness ?? 100}%)`
                }}
              />
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Simplified Overlays - Lightened slightly for visibility */}
      <div className="absolute inset-0 bg-brand-black/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black/70" />
    </div>
  );
}
