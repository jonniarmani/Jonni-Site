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
            className="text-brand-cyan uppercase tracking-[0.4em] text-xs font-bold mb-8 block"
          >
            {about.heroTitle}
          </motion.span>
          <div className="mb-12">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] uppercase">
              {about.heroSubtitle.split(' ')[0]} <span className="italic font-light">{about.heroSubtitle.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
          <div className="w-24 h-1 bg-brand-cyan mx-auto" />
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
                 <a href={brand.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-black hover:text-brand-cyan transition-colors flex items-center space-x-2 font-bold uppercase tracking-widest text-xs">
                    <Instagram size={18} />
                    <span>Follow Journey</span>
                 </a>
                 <a href={brand.socials.vimeo} target="_blank" rel="noopener noreferrer" className="text-brand-black hover:text-brand-cyan transition-colors flex items-center space-x-2 font-bold uppercase tracking-widest text-xs">
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
              Over the years, I have worked with many different clients. My main focus is always on making sure the work is top quality. Whether it is a small local project or a large business film, I bring the same level of care. I know that my clients want more than just photos and videos. They want a way to show their value to the world. That is why I take the time to learn about your goals before we ever start.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="bg-brand-gray p-8">
                <h3 className="text-brand-cyan text-lg mb-4 uppercase tracking-widest font-bold">Our Simple Process</h3>
                <p className="text-sm text-gray-500 leading-relaxed">We don't just "record." We build visual stories that help your brand grow. Every shot is planned to make you look like a leader in your field. We use the best gear and a sharp eye to make sure your message is clear and powerful.</p>
              </div>
              <div className="bg-brand-gray p-8">
                <h3 className="text-brand-cyan text-lg mb-4 uppercase tracking-widest font-bold">The Final Result</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Whether it is a short sports reel or a longer medical film, the goal is the same. We want to create a video that makes you stand out from the crowd. Our work helps you build trust with your audience and reach your business goals.</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-xl mb-12 font-light">
              {about.storyText2}
            </p>

            <blockquote className="border-l-4 border-brand-cyan pl-6 md:pl-10 py-4 my-10 md:my-16 italic text-2xl md:text-3xl font-display font-light text-brand-black">
              "{about.quote}"
            </blockquote>

            <p className="text-gray-600 leading-relaxed text-xl mb-20 font-light mt-16">
              {about.storyText3}
            </p>

            <div className="my-24 space-y-12">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-[1px] flex-grow bg-gray-200" />
                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-brand-cyan">Our Local Roots</h3>
                <div className="h-[1px] flex-grow bg-gray-200" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 leading-relaxed font-light">
                <div className="space-y-6">
                  <h4 className="text-xl font-display font-bold text-brand-black">Sarasota and Bradenton Service</h4>
                  <p className="text-sm">
                    Based in Bradenton and Sarasota, Florida, Jonni Armani Media is proud to be part of the local Gulf Coast area. We know the local landscape and the energy of our sports teams. We have spent years working with local businesses to understand what helps them succeed. Our local focus means we can be there when you need us, providing fast and reliable service.
                  </p>
                  <p className="text-sm">
                    We have spent over 14 years getting our process just right for the needs of Florida companies. Whether it is on the field or in the office, we bring the right tools to get the best results. We are dedicated to helping our neighbors and our local economy grow through the power of professional film and photography.
                  </p>
                </div>
                <div className="space-y-6">
                  <h4 className="text-xl font-display font-bold text-brand-black">Helping You Grow</h4>
                  <p className="text-sm">
                    We believe that "good enough" is not enough for our clients. In a world where everyone has a phone camera, we stand out by being professional and clear. Our clients are not just buying a video file; they are investing in a tool that helps them solve problems. We help you build trust, get more people to notice you, and create a strong brand that people remember.
                  </p>
                  <p className="text-sm">
                    Every year, we invest in better cameras and faster ways to edit. This ensures that you always get a product that feels new and exciting. Your success is our success, and we take that work very seriously. We are here to support your brand every step of the way.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Boost Section */}
            <div className="bg-white border border-gray-200 p-10 my-24 space-y-8">
                <h4 className="text-brand-black font-bold uppercase tracking-widest text-xs">The Power of Visual Content</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The way people see your business online matters more than ever. A single high-quality video can explain your value faster than pages of text. We help you cut through the noise and deliver your message with impact. Our team handles every part of the production, from the first script to the final export.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We specialize in industries that require a high level of trust, such as healthcare and high-end services. By showing the real faces and stories behind your brand, we help you build a human connection with your customers. This leads to more sales, higher client loyalty, and a stronger local reputation in the Florida market.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Throughout Southwest Florida, from the beaches of Siesta Key to the tech hubs in Tampa, businesses are realizing that they need better media. Jonni Armani Media is here to be your source for professional, reliable, and cinematic production. We work hard to make sure every project we do reflects the excellence of your business.
                </p>
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
                  <h3 className="text-xs uppercase tracking-widest font-black text-brand-cyan">Current Specializations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {["Cinematic Brand Stories", "Sports & Event Media", "Healthcare Production", "Corporate Identity"].map(service => (
                       <div key={service} className="flex items-center space-x-4">
                          <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
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

            <div className="mt-12 flex flex-col pt-12 border-t border-brand-black/5">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-cyan mb-3">Service Availability</span>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                Now Boarding Multi-Channel Production Projects in Sarasota and Bradenton for Q4.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

