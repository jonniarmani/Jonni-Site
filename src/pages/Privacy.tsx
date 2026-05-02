import { motion } from "motion/react";
import SEOComp from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "../config";

export default function Privacy() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <SEOComp title={`Privacy Policy | ${BRAND.name}`} description="Privacy policy and data protection information." />
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-black mb-12 transition-colors">
          <ArrowLeft size={14} className="mr-2" /> Back Home
        </Link>
        <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tighter uppercase mb-12">Privacy <span className="text-brand-cyan italic">Policy</span></h1>
        
        <div className="prose prose-zinc max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-brand-black mb-4">Introduction</h2>
            <p>At {BRAND.name}, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-brand-black mb-4">Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Identity Data</strong> includes first name, last name.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-brand-black mb-4">How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>To contact you regarding a project inquiry.</li>
              <li>To improve our website performance and user experience.</li>
              <li>To comply with a legal or regulatory obligation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-brand-black mb-4">Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href={`mailto:${BRAND.contact.email}`} className="text-brand-cyan font-bold">{BRAND.contact.email}</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
