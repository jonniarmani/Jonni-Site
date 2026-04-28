import { motion } from "motion/react";
import { SEO } from "../config";
import SEOComp from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import HeroMontage from "../components/HeroMontage";
import IndustriesGrid from "../components/IndustriesGrid";

import { useContent } from "../lib/ContentContext";

export default function Home() {
  const { content } = useContent();
  const { brand, industries } = content;

  return (
    <div className="pt-20 text-brand-black">
      <SEOComp title={content.seo?.title || SEO.home.title} description={content.seo?.description || SEO.home.description} />
      
      {/* Hero Section */}
      <section className="relative h-[95vh] w-full flex items-center overflow-hidden bg-brand-black">
        <HeroMontage />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 
              className="text-4xl sm:text-7xl md:text-9xl font-display font-bold text-white leading-[0.9] mb-10 tracking-tighter uppercase italic"
              dangerouslySetInnerHTML={{ 
                __html: content.seo?.h1Override || `Cinematic Video <br /> <span class="text-brand-gold not-italic">Commercial Photography</span>`
              }}
            />
            <p className="text-lg md:text-2xl font-light mb-12 max-w-2xl leading-relaxed text-gray-300">
              {brand.taglineExtended}
            </p>
              <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact?type=video" 
                className="bg-brand-gold text-white px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-black hover:text-white transition-all inline-flex items-center group"
              >
                Start Video Project
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/contact?type=photo" 
                className="bg-white text-brand-black px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-white transition-all inline-flex items-center group"
              >
                Start Photo Project
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-gold to-transparent" />
        </motion.div>
      </section>

      {/* Intro / Value Prop */}
      <section className="py-16 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-brand-gray overflow-hidden">
          {content.home.lensImage && (
            <img 
              src={content.home.lensImage} 
              alt={content.seo?.altTags?.['home-lens'] || `${brand.name} - Professional Video Production and Brand Storytelling Bradenton, Sarasota`} 
              width="1200"
              height="1500"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              style={{ objectPosition: content.home.lensImagePosition || 'center center' }}
            />
          )}
              </div>
              <div className="absolute -bottom-10 -right-10 bg-brand-black p-12 hidden lg:block">
                <p className="text-brand-gold text-5xl font-display font-bold">100+</p>
                <p className="text-white text-xs uppercase tracking-widest mt-2">Projects Completed</p>
              </div>
            </div>
            <div className="space-y-8 mt-8 lg:mt-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight">
                {content.home.lensTitle}
              </h2>
              <h3 className="text-brand-gold text-lg font-bold uppercase tracking-widest">
                High-Quality Visual Narrative for Local Brands
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {content.home.lensText}
              </p>
              <p className="text-gray-500 leading-relaxed font-light">
                Our approach combines professional technical skill with local insight. We understand the specific needs of Florida businesses, from the luxury real estate market on Siesta Key to the high-energy sports culture at IMG Academy. By focusing on your core goals, we deliver media that doesn't just look good but actually works for your brand.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Cinematic Clarity", "Strategic Brand Alignment", "End-to-End Production", "High-Energy Delivery"].map((item) => (
                  <li key={item} className="flex items-center space-x-3 text-brand-black font-medium">
                    <CheckCircle2 size={20} className="text-brand-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link to="/about" className="inline-flex items-center text-brand-black font-bold uppercase tracking-widest text-sm border-b-2 border-brand-gold pb-1 hover:border-brand-black transition-colors">
                  The {brand.name} Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IndustriesGrid industries={industries} />

      {/* Portfolio Quick Access */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/video" className="bg-brand-black text-white px-10 py-6 font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-gold transition-all w-full sm:w-72 text-center shadow-xl">
              Video Portfolio
            </Link>
            <Link to="/photo" className="bg-white text-brand-black border-2 border-brand-black px-10 py-6 font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all w-full sm:w-72 text-center shadow-xl">
              Photo Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Blended with Start Your Project Intent */}
      <section className="bg-brand-black py-24 md:py-40 text-white overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-20">
           {content.home.ctaBackground && (
             <img 
                src={content.home.ctaBackground} 
                alt="Florida Gulf Coast Landscape - Serving Bradenton and Sarasota area"
                width="2000"
                height="1333"
                className="w-full h-full object-cover"
                style={{ objectPosition: content.home.ctaBackgroundPosition || 'center center' }}
             />
           )}
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 block">
            Limited Availability | Q3 & Q4 2026
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-10 tracking-tighter uppercase italic">
            Ready to tell <br />
            <span className="text-brand-gold not-italic">Your Story?</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl mb-12 max-w-2xl mx-auto font-light">
             Serving {brand.location}. Let's build your visual legacy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact?type=video" className="bg-brand-gold text-white px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-black hover:scale-105 transition-all flex items-center justify-center">
              Start Video Project <ArrowRight size={16} className="ml-3" />
            </Link>
            <Link to="/contact?type=photo" className="bg-white/10 backdrop-blur-md border border-white/20 px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center">
              Start Photo Project <ArrowRight size={16} className="ml-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
