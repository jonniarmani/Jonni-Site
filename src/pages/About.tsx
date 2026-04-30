import { motion } from "motion/react";
import { SEO } from "../config";
import SEOComp from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Video } from "lucide-react";
import { useContent } from "../lib/ContentContext";

export default function About() {
  const { content } = useContent();
  const { brand, about } = content;

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-40">
      <SEOComp title={SEO.about.title} description={SEO.about.description} />
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto mb-16 sm:mb-32 text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 block"
          >
            {about.heroTitle}
          </motion.span>
          <div className="mb-12">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] uppercase">
              {about.heroSubtitle.split(' ')[0]} <span className="italic font-light">{about.heroSubtitle.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
          <div className="w-24 h-1 bg-brand-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-8 lg:space-y-12">
            <div className="aspect-[3/4] bg-brand-gray overflow-hidden shadow-2xl">
               {about.profileImage && (
                 <img 
                  src={about.profileImage} 
                  alt={`${brand.name} - Professional Cinematographer & Photographer Bradenton Florida`} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  style={{ objectPosition: about.profileImagePosition || 'center center' }}
                />
               )}
            </div>
            <div className="flex flex-col space-y-6">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Principal Creative</p>
                <p className="text-xl font-display font-bold">{brand.name}</p>
              </div>
              <div className="flex space-x-6">
                 <a href={brand.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-black hover:text-brand-gold transition-colors flex items-center space-x-2 font-bold uppercase tracking-widest text-xs">
                    <Instagram size={18} />
                    <span>Follow Journey</span>
                 </a>
                 <a href={brand.socials.vimeo} target="_blank" rel="noopener noreferrer" className="text-brand-black hover:text-brand-gold transition-colors flex items-center space-x-2 font-bold uppercase tracking-widest text-xs">
                    <Video size={18} />
                    <span>Watch Work</span>
                 </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 prose prose-xl prose-black max-w-none">
            <h2 className="text-4xl font-display font-bold mb-10 tracking-tight">{about.storyTitle}</h2>
            
            <p className="text-gray-600 leading-relaxed text-xl mb-12 font-light">
              {about.storyText1}
            </p>

            <p className="text-gray-500 text-sm leading-relaxed mb-12">
              Over the years, I've worked across many fields. My focus is always on quality. Whether it's a small local project or a large commercial production, I bring the same level of care and attention to detail. I understand that my clients are looking for more than just images; they are looking for a way to communicate their value to the world. That's why I take the time to learn about your goals before we ever start shooting.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="bg-brand-gray p-8">
                <h3 className="text-brand-gold text-lg mb-4 uppercase tracking-widest font-bold">The Approach</h3>
                <p className="text-sm text-gray-500 leading-relaxed">I don't just "film." I architect visual assets. Every shot is calculated to reinforce your brand's authority, utilizing broadcast-quality gear and an editorial eye that strips away the noise.</p>
              </div>
              <div className="bg-brand-gray p-8">
                <h3 className="text-brand-gold text-lg mb-4 uppercase tracking-widest font-bold">The Result</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Whether it's a 30-second sports highlight or a 10-minute medical documentary, the goal is the same: A visual experience that leaves your competition in the background.</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-xl mb-12 font-light">
              {about.storyText2}
            </p>

            <blockquote className="border-l-4 border-brand-gold pl-6 md:pl-10 py-4 my-10 md:my-16 italic text-2xl md:text-3xl font-display font-light text-brand-black">
              "{about.quote}"
            </blockquote>

            <p className="text-gray-600 leading-relaxed text-xl mb-20 font-light mt-16">
              {about.storyText3}
            </p>

            {/* Behind the Lens Content Expansion */}
            <div className="my-24 space-y-12">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-[1px] flex-grow bg-gray-200" />
                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-brand-gold">Behind the Lens</h3>
                <div className="h-[1px] flex-grow bg-gray-200" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 leading-relaxed font-light">
                <div className="space-y-6">
                  <h4 className="text-xl font-display font-bold text-brand-black">The Florida Connection</h4>
                  <p className="text-sm">
                    Operating primarily out of Bradenton and Sarasota, Florida, Jonni Armani Media is deeply rooted in the Gulf Coast community. We understand the unique coastal light, the energy of local athletic powerhouses like IMG Academy, and the high standards of the region's expanding medical and luxury real estate markets. Our local presence isn't just about geography—it's about a shared commitment to seeing our regional economy thrive through better visual storytelling.
                  </p>
                  <p className="text-sm">
                    We've spent over 14 years refining our technical toolkit to match the specific demands of Florida's high-stakes industries. Whether navigating a humid sideline during a midday match or the controlled environment of a surgical suite, we bring the right gear and the right mindset to every location.
                  </p>
                </div>
                <div className="space-y-6">
                  <h4 className="text-xl font-display font-bold text-brand-black">Commitment to Growth</h4>
                  <p className="text-sm">
                    We believe that "good enough" is the enemy of great. In an era where anyone with a smartphone can call themselves a creator, we differentiate through professional maturity and strategic intent. Our clients aren't just buying a video file; they are investing in a strategic asset designed to solve specific business problems—be it lack of trust, poor engagement, or a weak brand identity.
                  </p>
                  <p className="text-sm">
                    Every year, we reinvest in higher-quality cinema optics, faster editing workflows, and advanced color science to ensure our clients always receive a product that feels ahead of the curve. Your growth is our growth, and we take that partnership seriously.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100">
               <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-8">Selected Collaborations</h3>
               <div className="flex flex-wrap gap-x-12 gap-y-8 grayscale opacity-50 mb-20">
                  {["Brand Stories", "Healthcare", "Athletics", "Commercial", "Identity"].map(item => (
                    <span key={item} className="text-2xl font-display font-bold tracking-tighter">{item}</span>
                  ))}
               </div>

               {/* Integrated Services Area */}
               <div className="bg-brand-gray p-12 space-y-8">
                  <h3 className="text-xs uppercase tracking-widest font-black text-brand-gold">Current Specializations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {["Cinematic Brand Stories", "Sports & Event Media", "Healthcare Production", "Corporate Identity"].map(service => (
                       <div key={service} className="flex items-center space-x-4">
                          <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                          <span className="text-sm font-bold uppercase tracking-widest text-brand-black">{service}</span>
                       </div>
                     ))}
                  </div>
                  <div className="pt-4">
                     <Link to="/services" className="text-xs font-bold uppercase tracking-widest flex items-center group">
                        View Detailed Offerings <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>
               </div>
            </div>

            <div className="mt-24 flex flex-col sm:flex-row gap-6">
              <Link to="/contact?type=video" className="bg-brand-black text-white px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-gold transition-colors inline-flex items-center justify-center">
                Start Video Project <ArrowRight size={18} className="ml-3" />
              </Link>
              <Link to="/contact?type=photo" className="bg-white border-2 border-brand-black text-brand-black px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all inline-flex items-center justify-center">
                Start Photo Project <ArrowRight size={18} className="ml-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

