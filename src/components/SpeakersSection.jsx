"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SpeakersSection() {
  const [showAll, setShowAll] = useState(false);

  const wireframes = Array.from({ length: 48 });

  return (
    <section className="relative w-full bg-brand-surface py-12 md:py-16 overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
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
          <div className="max-w-4xl flex flex-col items-center bg-brand-surface/80 backdrop-blur-md p-6 rounded-3xl relative z-10 shadow-[0_0_40px_20px_rgba(232,239,222,0.8)]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary/50" />
              <span className="text-brand-primary tracking-[0.25em] text-[10px] font-bold uppercase">
                FEATURED SPEAKERS
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
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-tight text-brand-dark mb-3">
                The rare kind of stage where every seat on it has <span className="text-brand-primary italic">something to say.</span>
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
                Featured speakers from BRAND R.COMM 2026 — full 2026 line-up unveiled by 15 October. A curated preview of past editions is available in our archive.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Grid Layout */}
        <div className="relative mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10 pb-4">
            {(showAll ? wireframes : wireframes.slice(0, 6)).map((_, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: (idx % 6) * 0.1 }}
                className="w-full flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Image Placeholder */}
                <div className="relative w-28 h-36 md:w-32 md:h-44 rounded-2xl md:rounded-3xl overflow-hidden mb-4 border-2 border-brand-primary/20 bg-brand-primary/5 transition-all duration-300 group-hover:border-brand-primary group-hover:shadow-lg group-hover:shadow-brand-primary/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-brand-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                {/* Text Placeholder */}
                <div className="px-1 w-full flex flex-col items-center space-y-2">
                  <div className="h-4 w-3/4 bg-brand-primary/20 rounded"></div>
                  <div className="h-3 w-1/2 bg-brand-dark/10 rounded"></div>
                  <div className="h-3 w-1/2 bg-brand-dark/10 rounded"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* See All / Minimize Toggle */}
        <div className="flex justify-end mt-6 pr-4 lg:pr-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-2 rounded-full bg-[#7a9d46] text-white font-serif italic text-lg shadow-md hover:bg-[#688a38] transition-colors"
          >
            {showAll ? "Minimize" : "See All"}
          </button>
        </div>

      </div>
    </section>
  );
}
