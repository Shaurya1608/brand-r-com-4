"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function SpeakersSection() {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const speakers = [
    {
      name: "Anaya Deshmukh",
      role: "CMO",
      company: "Bharat Krishi Group",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop"
    },
    {
      name: "Rohan Iyer",
      role: "MANAGING DIRECTOR",
      company: "GreenField Seeds",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop"
    },
    {
      name: "Ishaani Rao",
      role: "HEAD, RURAL COMMS",
      company: "Prithvi AgriTech",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop"
    },
    {
      name: "Vikram Nair",
      role: "CHIEF EXECUTIVE",
      company: "AgriFuture India",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
    },
    {
      name: "Priya Sharma",
      role: "FOUNDER",
      company: "Rural Innovators",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
    }
  ];

  return (
    <section className="relative w-full bg-brand-surface py-16 md:py-24 overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Header Layout */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-4xl flex flex-col items-center">
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-dark mb-4">
                The rare kind of stage where every seat on it has <span className="text-brand-primary italic">something to say.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mt-2 mb-8"
            >
              <p className="text-brand-dark/70 text-sm md:text-base leading-relaxed font-sans">
                Featured speakers from BRAND R.COMM 2026 — full 2026 line-up unveiled by 15 October. A curated preview of past editions is available in our archive.
              </p>
            </motion.div>

            {/* Slider Controls (Centered below text) */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="hidden lg:flex space-x-6 justify-center"
            >
              <button 
                onClick={scrollLeft}
                className="w-14 h-14 rounded-full border border-brand-primary/30 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={scrollRight}
                className="w-14 h-14 rounded-full border border-brand-primary/30 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative -mx-6 md:-mx-12 px-6 md:px-12">
          <div 
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {speakers.map((speaker, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex-none w-[200px] md:w-[240px] snap-start flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-4 border-white group-hover:border-brand-primary/20 transition-all duration-300">
                  {/* Circular Image */}
                  <img 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Text content moved below the circle */}
                <div className="px-2">
                  <h3 className="text-lg md:text-xl font-serif text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">{speaker.name}</h3>
                  <p className="text-brand-primary text-[9px] md:text-[10px] font-bold tracking-widest uppercase mb-1">{speaker.role}</p>
                  <p className="text-brand-dark/60 text-xs font-sans">{speaker.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
