import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // A more robust, high-quality deep house/lounge track (Instrumental)
  // This track has a very "Blue Six" / Naked Music style vibe: smooth, jazzy, and deep.
  const audioUrl = "https://cdn.pixabay.com/audio/2024/02/07/audio_0396443657.mp3"; 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25; // Perfect background level
      audioRef.current.loop = true;
      
      // Error handling for the audio element
      audioRef.current.onerror = (e) => {
        console.error("Audio failed to load:", e);
      };
    }
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
        setHasInteracted(true);
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error("Playback failed or was blocked:", err);
      // If it fails, we keep isPlaying false but maybe the icon shows it's waiting for user
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-10 left-10 z-[100] flex items-center gap-4">
      <audio ref={audioRef} src={audioUrl} />
      
      <motion.button
        onClick={togglePlay}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="group relative flex items-center gap-3 bg-brand-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-brand-gold/20 transition-all duration-500"
        title={isPlaying ? "Mute Atmosphere" : "Enable Atmosphere"}
      >
        <div className="relative">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-brand-gold animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-white/40" />
          )}
          
          {/* Visualizer bars when playing */}
          {isPlaying && (
            <div className="absolute -top-1 -right-1 flex gap-0.5 items-end h-2">
              <motion.div 
                animate={{ height: [2, 6, 3, 8, 4] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-0.5 bg-brand-gold/60"
              />
              <motion.div 
                animate={{ height: [4, 2, 7, 3, 6] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                className="w-0.5 bg-brand-gold/60"
              />
              <motion.div 
                animate={{ height: [3, 8, 2, 5, 3] }}
                transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                className="w-0.5 bg-brand-gold/60"
              />
            </div>
          )}
        </div>

        <AnimatePresence>
          {!hasInteracted && (
            <motion.span 
              initial={{ opacity: 0, w: 0 }}
              animate={{ opacity: 1, w: 'auto' }}
              exit={{ opacity: 0, w: 0 }}
              className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold whitespace-nowrap overflow-hidden pr-2"
            >
              Play Atmosphere
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating track label for premium feel */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:block"
        >
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/30 block mb-0.5">Currently Playing</span>
          <span className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-gold/80">Deep House • Jazz Lounge</span>
        </motion.div>
      )}
    </div>
  );
};

export default BackgroundMusic;
