"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function JurySection() {
  const members = Array.from({ length: 5 });

  return (
    <section className="relative w-full bg-white py-12 md:py-16 overflow-hidden">
      
      {/* Vertical Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-evenly opacity-100 z-0">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden lg:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Header Layout */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="max-w-4xl flex flex-col items-center bg-white/80 backdrop-blur-md p-6 rounded-3xl relative z-10 shadow-[0_0_40px_20px_rgba(255,255,255,0.8)]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary/50" />
              <span className="text-brand-primary tracking-[0.25em] text-[10px] font-bold uppercase">
                THE JURY PANEL
              </span>
              <div className="h-px w-8 bg-brand-primary/50" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl"
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-brand-dark mb-4 leading-[1.1]">
                An independent jury. <span className="text-brand-primary italic block sm:inline mt-2 sm:mt-0">Zero conflicts.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mt-2 mb-6"
            >
              <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed font-sans">
                Our jury is composed of academic chairs, former public-sector leaders and independent editors — none of whom hold active commercial ties to any nominee. Every submission is evaluated on merit alone.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Chairman & Co-Chair Wireframes */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-16 mt-16 mb-16">
          {/* Chairman */}
          <div className="w-[200px] md:w-[240px] flex flex-col items-center text-center">
            <h3 className="text-xl md:text-2xl font-bold font-sans text-brand-dark mb-4">Chairman</h3>
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-[3px] border-[#7a9d46] bg-brand-primary/5 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#7a9d46]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-full flex flex-col items-center space-y-2">
              <div className="h-5 w-3/4 bg-brand-primary/20 rounded"></div>
              <div className="h-4 w-5/6 bg-brand-dark/10 rounded"></div>
              <div className="h-4 w-2/3 bg-brand-dark/10 rounded"></div>
            </div>
          </div>

          {/* Co-Chair */}
          <div className="w-[200px] md:w-[240px] flex flex-col items-center text-center">
            <h3 className="text-xl md:text-2xl font-bold font-sans text-brand-dark mb-4">Co-Chair</h3>
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-[3px] border-[#7a9d46] bg-brand-primary/5 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#7a9d46]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-full flex flex-col items-center space-y-2">
              <div className="h-5 w-3/4 bg-brand-primary/20 rounded"></div>
              <div className="h-4 w-5/6 bg-brand-dark/10 rounded"></div>
              <div className="h-4 w-2/3 bg-brand-dark/10 rounded"></div>
            </div>
          </div>
        </div>

        {/* Members Wireframes */}
        <div className="flex flex-col items-center mt-12 pb-8">
          <h3 className="text-xl md:text-2xl font-bold font-sans text-brand-dark mb-8">Members</h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {members.map((_, idx) => (
              <div key={idx} className="w-[140px] md:w-[160px] flex flex-col items-center text-center">
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 border-[2px] border-[#7a9d46] bg-brand-primary/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#7a9d46]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="w-full flex flex-col items-center space-y-2">
                  <div className="h-4 w-3/4 bg-brand-primary/20 rounded"></div>
                  <div className="h-3 w-full bg-brand-dark/10 rounded"></div>
                  <div className="h-3 w-5/6 bg-brand-dark/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
