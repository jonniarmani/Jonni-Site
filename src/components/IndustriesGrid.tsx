import React from 'react';
import { motion } from 'motion/react';
import { Globe, ArrowUpRight } from 'lucide-react';

interface Industry {
  id: string;
  name: string;
  description: string;
}

export default function IndustriesGrid({ industries }: { industries?: Industry[] }) {
  if (!industries || industries.length === 0) return null;

  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-cyan font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Strategic Vertical Authority
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight uppercase leading-none italic">
              Industries <span className="text-gray-500 not-italic">Served.</span>
            </h2>
            <p className="text-gray-300 mt-6 text-lg font-light leading-relaxed">
              Tailored cinematic solutions for high-stakes professions across the Florida Gulf Coast. From Sarasota waterfront estates to Tampa tech headquarters.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-brand-cyan opacity-50">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-right">
                Vertical <br /> Specialist
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-[#111] p-8 border border-white/5 hover:border-brand-cyan/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
                <ArrowUpRight size={20} className="text-brand-cyan" />
              </div>
              <span className="text-[8px] font-black text-brand-cyan mb-4 block tracking-[0.3em] opacity-50 group-hover:opacity-100 transition-opacity">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-3 group-hover:text-brand-cyan transition-colors">
                {industry.name}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-200 transition-colors">
                {industry.description}
              </p>
              
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-cyan group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
