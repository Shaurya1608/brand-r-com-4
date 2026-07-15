"use client";

import React from "react";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16 px-6 md:px-12 flex justify-center pb-24">
      <div className="w-full max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full rounded-3xl border border-brand-primary/10 bg-[#F0F7EA] p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-sm"
        >
          
          {/* Left Text */}
          <div className="flex flex-col max-w-xl">
            <div className="flex flex-col mb-4">
              <div className="h-px w-8 bg-brand-primary mb-2" />
              <span className="text-brand-primary font-bold text-[9px] md:text-[10px] tracking-widest uppercase">
                Newsletter
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-brand-dark leading-tight mb-1">
              Fortnightly briefings on the agri-industry.
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl font-serif text-brand-dark/50 italic">
              One click to subscribe.
            </p>
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center p-1.5 bg-white border border-brand-primary/10 rounded-2xl sm:rounded-full w-full sm:w-[380px] focus-within:border-brand-primary/30 shadow-inner transition-colors duration-300">
              <input 
                type="email" 
                placeholder="your@company.com"
                className="bg-transparent border-none text-brand-dark placeholder:text-brand-dark/30 px-5 py-3 w-full focus:outline-none focus:ring-0 text-xs md:text-sm"
              />
              <button className="w-full sm:w-auto bg-brand-primary text-white font-bold text-[10px] tracking-widest uppercase px-6 py-3 rounded-xl sm:rounded-full hover:bg-brand-dark transition-colors whitespace-nowrap mt-1 sm:mt-0">
                Subscribe
              </button>
            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
