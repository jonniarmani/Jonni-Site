import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, X, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIImageGeneratorProps {
  onGenerated: (imageUrl: string, prompt: string) => void;
  onClose: () => void;
}

export default function AIImageGenerator({ onGenerated, onClose }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setPreviewUrl(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let foundImage = false;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const imageUrl = `data:image/png;base64,${base64Data}`;
            setPreviewUrl(imageUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("No image was returned from the AI model.");
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setError(err.message || "Failed to generate image. Please try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (previewUrl) {
      onGenerated(previewUrl, prompt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-brand-gold">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold uppercase tracking-tight">AI Vision Engine</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by Gemini Nano</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Generation Parameters</label>
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the cinematic visual you want to create... (e.g., 'A luxury lifestyle shot on Siesta Key beach at sunset, high-end commercial style, soft bokeh')"
                className="w-full h-32 p-4 bg-zinc-50 border border-gray-200 rounded-sm focus:ring-1 focus:ring-brand-gold outline-none text-sm leading-relaxed resize-none"
                disabled={isGenerating}
              />
              <div className="absolute bottom-4 right-4">
                <button 
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-brand-black text-brand-gold px-6 py-3 rounded-sm font-black uppercase tracking-widest text-[11px] flex items-center space-x-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={16} />
                      <span>Generate Asset</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-[300px] bg-zinc-50 border border-dashed border-gray-200 rounded-sm flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {previewUrl ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center"
                >
                  <img src={previewUrl} alt="AI Generated" className="w-full max-h-[400px] object-contain" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <button 
                      onClick={handleUseImage}
                      className="bg-brand-gold text-brand-black px-10 py-4 rounded-sm font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
                    >
                      <Check size={16} />
                      <span>Execute Incorporation</span>
                    </button>
                  </div>
                </motion.div>
              ) : isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center px-12"
                >
                  <div className="w-20 h-20 rounded-full border-2 border-brand-gold/10 border-t-brand-gold animate-spin mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 animate-pulse">Initializing neural pathways...</p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center px-12"
                >
                  <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Transmission Interrupted</p>
                  <p className="text-gray-400 text-[10px] font-medium leading-relaxed max-w-xs">{error}</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center px-12 opacity-20"
                >
                  <ImageIcon size={64} className="mb-6 text-gray-400" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Awaiting visual parameters</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 border-t border-gray-100">
          <p className="text-[8px] text-gray-400 font-bold uppercase text-center tracking-[0.2em]">
            This asset is generated using advanced AI. Licensing is restricted to this application's domain.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
