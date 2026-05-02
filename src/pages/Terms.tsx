import { motion } from "motion/react";
import SEOComp from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "../config";

export default function Terms() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <SEOComp title={`Terms of Service | ${BRAND.name}`} description="Terms of service and usage conditions." />
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-black mb-12 transition-colors">
          <ArrowLeft size={14} className="mr-2" /> Back Home
        </Link>
        <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tighter uppercase mb-12">Terms of <span className="text-brand-cyan italic">Service</span></h1>
        
        <div className="prose prose-zinc max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-brand-black mb-4">Agreement to Terms</h2>
            <p>By accessing our website at {BRAND.name}, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-brand-black mb-4">Intellectual Property</h2>
            <p>All visuals, videos, and photography displayed on this website are the intellectual property of {BRAND.name} and are protected by applicable copyright and trademark law. Any unauthorized use of these materials is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-brand-black mb-4">Service Availability</h2>
            <p>Our creative services are subject to availability. Booking a project through the website does not guarantee service delivery until a formal agreement is signed and a deposit is received.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-brand-black mb-4">Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of the State of Florida and you irrevocably submit to the exclusive jurisdiction of the courts in that State.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
