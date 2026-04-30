import { motion } from "motion/react";
import { useContent } from "../lib/ContentContext";
import SEOComp from "../components/SEO";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Phone, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const { content } = useContent();
  const [searchParams] = useSearchParams();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [honeypot, setHoneypot] = useState("");
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "video") setSelectedService("Video Production (General)");
    if (type === "photo") setSelectedService("Photography (General)");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Anti-Spam Measures
    const timeToFill = Date.now() - startTime;
    if (honeypot || timeToFill < 3000) {
      console.warn("Spam detected or suspicious activity. Rejection protocol active.");
      setFormState("success"); // Mock success to fool bots
      return;
    }

    setFormState("submitting");
    
    try {
      // 1. Capture the lead
      await addDoc(collection(db, 'leads'), {
        ...formData,
        service: selectedService || "General Strategy",
        createdAt: serverTimestamp(),
        status: 'new'
      });

      setFormState("success");
    } catch (err) {
      console.error("Submission Error:", err);
      handleFirestoreError(err, OperationType.WRITE, 'leads');
      setFormState("idle");
    }
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-40">
      <SEOComp title={content.seo?.title || "Contact"} description={content.seo?.description || "Get in touch"} />
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-16 sm:mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 block"
          >
            {content.contact.subtitle}
          </motion.span>
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] uppercase">
              {content.contact.title.split('.').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}{i < arr.length - 1 && '.'}
                  {i === 0 && <br className="hidden sm:block" />}
                </React.Fragment>
              ))}
            </h1>
          </div>
          <p className="text-gray-500 text-lg sm:text-xl font-light max-w-xl">
            {content.contact.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-20">
            <div className="space-y-12">
               <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-brand-gray flex items-center justify-center text-brand-gold shrink-0">
                     <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">Direct Channel</p>
                    <a href={`mailto:${content.contact.email}`} className="text-2xl font-display font-bold hover:text-brand-gold transition-colors">{content.contact.email}</a>
                  </div>
               </div>
               <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-brand-gray flex items-center justify-center text-brand-gold shrink-0">
                     <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">Voice & Message</p>
                    <a href={`tel:${content.contact.phone.replace(/\./g, '')}`} className="text-2xl font-display font-bold hover:text-brand-gold transition-colors">{content.contact.phone}</a>
                  </div>
               </div>
               <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-brand-gray flex items-center justify-center text-brand-gold shrink-0">
                     <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">Live Availability</p>
                    <Link to="/booking" className="text-2xl font-display font-bold hover:text-brand-gold transition-colors inline-flex items-center group">
                      Book a Session <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
               </div>
            </div>

            <div className="bg-brand-black text-white p-12 space-y-8">
               <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500">Location Focus</h2>
               <p className="text-lg font-light leading-relaxed">
                  Headquartered in <span className="text-brand-gold font-bold">{content.contact.address}</span>. {content.contact.availability}
               </p>
               <div className="text-[10px] uppercase tracking-widest font-medium text-gray-500 border-t border-white/10 pt-8">
                  Commercial • Sports • Healthcare • Brand Stories
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            {formState === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-gray p-16 text-center space-y-8"
              >
                <div className="w-20 h-20 bg-brand-black text-brand-gold flex items-center justify-center mx-auto rounded-full">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Transmission Received</h2>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Thank you for starting the conversation. I will review your project details and respond within 24–48 hours.
                </p>
                <button 
                  onClick={() => setFormState("idle")}
                  className="text-brand-black font-bold uppercase tracking-widest text-xs border-b-2 border-brand-gold pb-1"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Honeypot Security Layer */}
                <div className="hidden" aria-hidden="true">
                  <input 
                    type="text" 
                    name="website_verification" 
                    tabIndex={-1} 
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold uppercase tracking-tight">{content.contact.formTitle}</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-1">{content.contact.formSubtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-widest font-black text-gray-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-brand-gray px-6 py-4 outline-none border-b-2 border-transparent focus:border-brand-gold transition-all font-medium text-base" 
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-black text-gray-400">Email Address</label>
                    <input 
                      required
                      type="email" 
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-brand-gray px-6 py-4 outline-none border-b-2 border-transparent focus:border-brand-gold transition-all font-medium text-base" 
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-[10px] uppercase tracking-widest font-black text-gray-400">Select Production Interest</label>
                  <select 
                    id="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                    className="w-full bg-brand-gray px-6 py-4 outline-none border-b-2 border-transparent focus:border-brand-gold transition-all font-medium appearance-none text-base"
                  >
                    <option value="">Select Service Type...</option>
                    <optgroup label="Cinematography / Video">
                      <option>Video Production (General)</option>
                      <option>Commercial Brand Stories</option>
                      <option>Sports Cinematography</option>
                      <option>Medical & Healthcare Production</option>
                      <option>Social Content / High-Energy Reels</option>
                    </optgroup>
                    <optgroup label="Photography">
                      <option>Photography (General)</option>
                      <option>Brand Identity / Branding</option>
                      <option>Executive Identity / Lifestyle</option>
                      <option>Commercial Photography</option>
                      <option>Sports & Event Photography</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option>Consulting / Strategy</option>
                      <option>Creative Direction</option>
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-widest font-black text-gray-400">Project Overview</label>
                  <textarea 
                    required
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-brand-gray px-6 py-4 outline-none border-b-2 border-transparent focus:border-brand-gold transition-all font-medium resize-none text-base" 
                    placeholder="Briefly describe your objectives, timeline, and vision..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full bg-brand-black text-white py-6 font-bold uppercase tracking-[0.4em] text-xs hover:bg-brand-gold transition-all disabled:opacity-50"
                >
                  {formState === "submitting" ? "Processing..." : "Initiate Connection"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Integrated About Story Section */}
        <div className="mt-24 sm:mt-40 pt-24 sm:pt-40 border-t border-gray-100">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                 <h2 className="text-3xl sm:text-4xl font-display font-medium mb-10 tracking-tight leading-tight uppercase italic">{content.about.storyTitle.split(' ').slice(0, -1).join(' ')} <br/><span className="text-brand-gold not-italic font-bold">{content.about.storyTitle.split(' ').slice(-1)}</span></h2>
                 <p className="text-gray-500 text-lg font-light leading-relaxed mb-8">
                    {content.about.storyText1}
                 </p>
                 <p className="text-gray-600 font-medium mb-12">
                    "{content.about.quote}"
                 </p>
                 <Link to="/about" className="inline-flex items-center text-brand-black font-bold uppercase tracking-widest text-xs border-b-2 border-brand-gold pb-1 hover:border-brand-black transition-colors">
                    Read the full story <ArrowRight size={14} className="ml-2" />
                 </Link>
              </div>
              <div className="order-1 lg:order-2 aspect-[4/3] bg-brand-gray overflow-hidden">
                 <img 
                    src={content.contact.image} 
                    alt="Creative Direction & Strategic Production" 
                    className="w-full h-full object-cover grayscale opacity-80"
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
