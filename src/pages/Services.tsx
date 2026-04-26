import { motion } from "motion/react";
import { SEO } from "../config";
import SEOComp from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight, Video, Zap, Stethoscope, User, Play, Heart, Camera, Briefcase } from "lucide-react";
import { useContent } from "../lib/ContentContext";

const ICON_MAP = {
  Video: Video,
  Zap: Zap,
  Stethoscope: Stethoscope,
  User: User,
  Heart: Heart,
  Camera: Camera,
  Briefcase: Briefcase,
};

export default function Services() {
  const { content } = useContent();
  const { services } = content;

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-40">
      <SEOComp title={SEO.services.title} description={SEO.services.description} />
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-16 sm:mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 block font-sans"
          >
            Core Offerings
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-12 uppercase italic"
          >
            Professional <br /> <span className="text-brand-gold not-italic">Solutions.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg sm:text-2xl font-light max-w-2xl leading-relaxed">
            High-end visual products engineered for high-stakes industries. We don't just deliver media; we deliver measurable brand elevation.
          </p>
        </div>

        <div className="space-y-24 sm:space-y-40">
          {services.map((service, idx) => {
            const Icon = ICON_MAP[service.icon as keyof typeof ICON_MAP] || Video;
            const isEven = idx % 2 === 0;

            return (
              <div key={service.id} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className={`lg:col-span-7 h-full ${!isEven ? 'lg:order-2' : ''}`}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="aspect-video bg-brand-gray relative group overflow-hidden"
                  >
                    {service.visualType === 'video' ? (
                      <video 
                        src={service.visualUrl} 
                        className="w-full h-full object-cover"
                        autoPlay muted loop playsInline
                      />
                    ) : (
                      <img 
                        src={service.visualUrl} 
                        alt={`${service.title} - Professional Video Production Bradenton ${service.short}`} 
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-brand-black/80 to-transparent">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                         <Play size={24} className="text-white fill-white ml-1" />
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className={`lg:col-span-5 space-y-10 ${!isEven ? 'lg:order-1' : ''}`}>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-brand-black flex items-center justify-center text-brand-gold mb-8">
                       <Icon size={32} />
                    </div>
                    <h2 className="text-4xl font-display font-bold tracking-tight uppercase">{service.title}</h2>
                    <p className="text-brand-gold uppercase tracking-[0.2em] text-xs font-bold">{service.short}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-600 text-lg leading-relaxed font-light">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-3">Ideal For</p>
                        <p className="text-sm font-bold text-gray-800">{service.whoItsFor}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-3">Core Outcome</p>
                        <p className="text-sm font-bold text-gray-800">{service.outcome}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-4">
                    <Link 
                      to="/contact" 
                      className="inline-flex items-center text-brand-black font-bold uppercase tracking-widest text-xs border-b-2 border-brand-gold pb-2 hover:border-brand-black transition-colors"
                    >
                      Inquire About This Service <ArrowRight size={16} className="ml-3" />
                    </Link>

                    {service.photoCategory && (
                      <Link 
                        to={`/photo?category=${service.photoCategory}`} 
                        className="inline-flex items-center text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-brand-gold transition-colors"
                      >
                        <Camera size={14} className="mr-2" /> View {service.photoCategory} Gallery
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Collaborative Section */}
        <section className="mt-24 sm:mt-60 bg-brand-black p-8 sm:p-16 md:p-24 text-white text-center">
          <div className="max-w-4xl mx-auto space-y-12">
             <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight italic">Every production is a <span className="text-brand-gold not-italic">partnership.</span></h2>
             <p className="text-gray-400 text-lg sm:text-xl font-light leading-relaxed">
               I don't just show up with a camera. We sit down, define the objective, audit your current brand presence, and build a visual roadmap that hits your targets.
             </p>
             <div className="pt-10 flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/contact?type=video" className="bg-brand-gold text-white px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-black hover:text-white transition-all">
                  Start Video Project
                </Link>
                <Link to="/contact?type=photo" className="bg-white/10 backdrop-blur-md border border-white/20 px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-brand-black transition-all">
                  Start Photo Project
                </Link>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

