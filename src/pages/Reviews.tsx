import { motion } from "motion/react";
import { useContent } from "../lib/ContentContext";
import SEOComp from "../components/SEO";
import { Star, Quote, ExternalLink, Calendar, User } from "lucide-react";

export default function Reviews() {
  const { content } = useContent();
  const { testimonials = [] } = content;

  // Calculate average rating if needed, but usually it's just 5 stars for curated ones
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1)
    : "5.0";

  return (
    <div className="pt-24 min-h-screen bg-white">
      <SEOComp 
        title={`Client Reviews | ${content.brand.name}`} 
        description={`Read verified testimonials and reviews from clients of ${content.brand.name} in Bradenton, Sarasota, and the Florida Gulf Coast.`} 
      />

      {/* Hero / Header */}
      <section className="bg-brand-black py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-cyan rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-cyan font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Verified Social Proof
            </span>
            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase italic mb-8">
              Client <span className="text-gray-400 not-italic">Reflections.</span>
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="flex text-brand-cyan mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={24} fill="currentColor" />
                  ))}
                </div>
                <p className="text-2xl font-bold font-display">{averageRating} / 5.0</p>
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-1">Average Rating</p>
              </div>
              
              <div className="w-[1px] h-16 bg-white/10 hidden sm:block" />
              
              <div className="flex flex-col items-center">
                {/* Google Logo Representation */}
                <div className="flex items-center space-x-2 mb-2">
                  <svg viewBox="0 0 24 24" width="24" height="24" className="mr-1">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-bold text-xl">Google</span>
                </div>
                <p className="text-xs uppercase font-black tracking-[0.2em]">Verified Reviews</p>
                <div className="mt-2 group">
                  <a 
                    href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-brand-cyan font-black uppercase tracking-widest hover:text-white transition-colors flex items-center"
                  >
                    Post a Review <ExternalLink size={10} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          {testimonials.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 font-display font-medium text-xl uppercase tracking-widest italic">
                Awaiting first cinematic endorsement...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-zinc-50 p-10 rounded-2xl border border-gray-100 flex flex-col h-full relative group hover:bg-zinc-100 transition-colors"
                >
                  <Quote size={40} className="text-brand-cyan/20 absolute top-8 right-8" />
                  
                  <div className="flex text-brand-cyan mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < (review.rating || 5) ? "currentColor" : "none"} 
                        className={i < (review.rating || 5) ? "opacity-100" : "opacity-20"}
                      />
                    ))}
                  </div>

                  <div className="flex-grow">
                    <p className="text-gray-700 font-light text-lg leading-relaxed italic mb-8">
                      "{review.content}"
                    </p>
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-brand-black flex items-center justify-center text-brand-cyan font-bold">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-brand-black font-bold uppercase tracking-tight text-sm">
                          {review.author}
                        </h3>
                        {review.role && (
                          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
                            {review.role}
                          </p>
                        )}
                        <div className="flex items-center text-[9px] text-gray-400 uppercase font-black tracking-widest mt-2">
                          <Calendar size={10} className="mr-1" /> {review.date || 'Cinematic Client'}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Leave a Review CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 bg-brand-black p-12 md:p-20 text-center rounded-[3rem] text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-cyan/5 pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase italic tracking-tighter mb-6">
              Experienced the <span className="text-brand-cyan not-italic">Standard?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg mb-12">
              If our cinematic work has helped elevate your brand or capture a significant moment, we'd value your feedback on our Google profile.
            </p>
            <a 
              href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-brand-black px-12 py-6 font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-cyan hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Post your Google review <ExternalLink size={14} className="ml-3" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
