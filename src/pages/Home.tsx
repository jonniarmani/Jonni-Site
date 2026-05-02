import { motion } from "motion/react";
import { SEO } from "../config";
import SEOComp from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import HeroMontage from "../components/HeroMontage";
import IndustriesGrid from "../components/IndustriesGrid";
import { useContent } from "../lib/ContentContext";
import ResponsiveImage from "../components/ResponsiveImage";

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
            <div className="mb-10">
              <h1 className="text-4xl sm:text-7xl md:text-9xl font-display font-bold text-white leading-[0.9] tracking-tighter uppercase italic">
                {content.seo?.h1Override ? (
                  <span dangerouslySetInnerHTML={{ __html: content.seo.h1Override }} />
                ) : (
                  <>
                    Cinematic Video <br /> 
                    <span className="text-brand-cyan not-italic">Commercial Photography</span>
                  </>
                )}
              </h1>
            </div>
            <p className="text-lg md:text-2xl font-light mb-12 max-w-2xl leading-relaxed text-gray-300">
              {brand.taglineExtended}
            </p>
            <div className="hidden md:flex flex-row gap-4 mt-8">
              <Link 
                to="/video" 
                className="bg-brand-cyan text-white px-10 py-5 font-bold uppercase tracking-widest text-sm border-2 border-brand-cyan/50 hover:border-brand-cyan hover:bg-brand-black transition-all inline-flex items-center group shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:shadow-[0_0_25px_rgba(0,242,255,0.4)]"
              >
                View Video Gallery
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/photo" 
                className="bg-white text-brand-black px-10 py-5 font-bold uppercase tracking-widest text-sm border-2 border-brand-cyan/50 hover:border-brand-cyan hover:bg-brand-cyan hover:text-white transition-all inline-flex items-center group shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:shadow-[0_0_25px_rgba(0,242,255,0.4)]"
              >
                View Photo Gallery
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-8 border-t border-white/10 pt-8"
            >
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <div className="flex flex-col">
                  <span className="text-brand-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-2">Service Hubs</span>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    Bradenton • Sarasota • Tampa • Palmetto
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className="text-brand-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-2">Core Disciplines</span>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-md">
                    Cinematography, Commercial Photography, Athletic Identity, & Luxury Brand Architecture.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-cyan to-transparent" />
        </motion.div>
      </section>

      {/* Intro / Value Prop */}
      <section className="py-16 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-brand-gray overflow-hidden">
          {content.home.lensImage && (
            <ResponsiveImage 
              src={content.home.lensImage} 
              alt={content.seo?.altTags?.['home-lens'] || `${brand.name} - Professional Video Production and Brand Storytelling Bradenton, Sarasota`} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              style={{ objectPosition: content.home.lensImagePosition || 'center center' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="eager"
              fetchPriority="high"
            />
          )}
              </div>
              <div className="absolute -bottom-10 -right-10 bg-brand-black p-12 hidden lg:block">
                <p className="text-brand-cyan text-5xl font-display font-bold">100+</p>
                <p className="text-white text-xs uppercase tracking-widest mt-2">Projects Completed</p>
              </div>
            </div>
            <div className="space-y-8 mt-8 lg:mt-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight">
                {content.home.lensTitle}
              </h2>
              <h3 className="text-brand-cyan text-lg font-bold uppercase tracking-widest">
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
                    <CheckCircle2 size={20} className="text-brand-cyan" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link to="/about" className="inline-flex items-center text-brand-black font-bold uppercase tracking-widest text-sm border-b-2 border-brand-cyan pb-1 hover:border-brand-black transition-colors">
                  The {brand.name} Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IndustriesGrid industries={industries} />

      {/* Philosophy & Process - New section to beef up content */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-[2px] bg-brand-cyan mb-6" />
                <h3 className="text-2xl font-display font-bold uppercase italic">Discovery <span className="text-gray-300 not-italic">& Insight.</span></h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every successful media project begins with a deep understanding of your brand's unique DNA. We sit down with you to identify core objectives, target demographics, and the emotional resonance you want to achieve. Whether it's a promotional video for a local Bradenton business or a high-stakes sports recruitment film, our discovery phase ensures every frame serves a purpose.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-[2px] bg-brand-cyan mb-6" />
                <h3 className="text-2xl font-display font-bold uppercase italic">Technical <span className="text-gray-300 not-italic">Execution.</span></h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We deploy industry-standard cinema cameras and lighting packages to capture your story with unrivaled clarity. Our technical expertise allows us to navigate complex environments—from sterile medical suites in Sarasota to the high-motion sidelines of Florida sporting events. We don't just record; we craft visuals that stand out in a saturated digital landscape.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-[2px] bg-brand-cyan mb-6" />
                <h3 className="text-2xl font-display font-bold uppercase italic">Post-Production <span className="text-gray-300 not-italic">Mastery.</span></h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The true magic happens in the edit. Our post-production pipeline includes professional color grading, precision sound design, and strategic narrative pacing. We refine the raw footage into a polished visual product that aligns with your brand's voice and professional standards. The result is a high-impact asset ready for broadcast, social media, or corporate distribution.
                </p>
              </div>
            </div>
            
            {/* Added more keywords/text for density */}
            <div className="mt-20 p-10 border border-gray-200 bg-white shadow-sm">
              <h4 className="text-brand-black font-bold uppercase tracking-widest text-xs mb-6">Strategic Visual Positioning</h4>
              <div className="columns-1 md:columns-2 gap-12 text-gray-500 text-sm font-light leading-loose">
                <p className="mb-6">
                  Jonni Armani Media is more than just a production house; we are a strategic partner for brands, athletes, and industry leaders across the Florida Gulf Coast. Our work is defined by a commitment to cinematic integrity and human connection. We believe that professional video and photography are the most powerful tools available for building trust and establishing market authority in today's visual-first economy.
                </p>
                <p>
                  Based in Bradenton and serving Sarasota, Tampa, and St. Petersburg, we specialize in high-stakes industries where precision matters. From capturing the legacy of athletes at LECOM Park to documenting complex surgical transformations for medical providers, we bring a level of focus and professional maturity that is rare in the creative space. Every project is handled with the same level of care, ensuring your message is delivered clearly and effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Reels & Frames - The missing middle section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-cyan font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Direct Visual Proof
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase italic">
              Featured <span className="text-gray-300 not-italic">Work.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.portfolio.filter(p => p.isFeatured).slice(0, 4).map((p, idx) => (
              <motion.div 
                key={p.title + idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative aspect-[4/5] bg-brand-gray overflow-hidden shadow-2xl"
              >
                <ResponsiveImage 
                   src={p.placeholder} 
                   alt={p.title} 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                   style={{ objectPosition: p.objectPosition || 'center center' }}
                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-brand-cyan text-[10px] font-black uppercase tracking-widest mb-2">{p.category}</p>
                  <h3 className="text-white text-xl font-display font-bold uppercase tracking-tight leading-none">{p.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Quick Access */}
      <section className="pt-16 pb-8 bg-brand-gray border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/video" className="bg-brand-black text-white px-10 py-6 font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-cyan transition-all w-full sm:w-72 text-center shadow-2xl group flex items-center justify-center">
              Video Portfolio <ArrowRight size={14} className="ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/photo" className="bg-white text-brand-black border-2 border-brand-black px-10 py-6 font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-cyan hover:text-white hover:border-brand-cyan transition-all w-full sm:w-72 text-center shadow-2xl group flex items-center justify-center">
              Photo Portfolio <ArrowRight size={14} className="ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pt-8 pb-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter italic mb-4">
                {content.home.faqTitle}
              </h2>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
                {content.home.faqSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {content.home.faqs?.map((faq: any, idx: number) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-brand-black flex items-start">
                    <span className="text-brand-cyan mr-3">Q.</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light text-sm pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Blended with Start Your Project Intent */}
      <section className="bg-brand-black pt-8 pb-24 md:pt-16 md:pb-40 text-white overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-20">
           {content.home.ctaBackground && (
             <ResponsiveImage 
                src={content.home.ctaBackground} 
                alt="Florida Gulf Coast Landscape - Serving Bradenton and Sarasota area"
                className="w-full h-full object-cover"
                style={{ objectPosition: content.home.ctaBackgroundPosition || 'center center' }}
                sizes="100vw"
                loading="lazy"
             />
           )}
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="text-brand-cyan uppercase tracking-[0.4em] text-xs font-bold mb-8 block">
            Limited Availability | Q3 & Q4 2026
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-10 tracking-tighter uppercase italic">
            Ready to tell <br />
            <span className="text-brand-cyan not-italic">Your Story?</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl mb-12 max-w-2xl mx-auto font-light">
             Serving {brand.location}. Let's build your visual legacy.
          </p>
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.5em] mb-4">
              Direct Transmission Available
            </p>
            <div className="h-[1px] w-12 bg-brand-cyan/30 mb-8" />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-xl mx-auto leading-loose px-4">
              Professional Production Services for Bradenton, Sarasota, & Tampa Bay. Specialized in Cinematic Visual Identities for the Gulf Coast Region.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
