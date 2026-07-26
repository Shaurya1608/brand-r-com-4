"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, FileSignature, Award, Megaphone } from "lucide-react";

export default function WinnerBenefitsSection() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  const benefits = [
    {
      title: "The BRAND R.COMM Trophy",
      desc: "A hand-crafted, individually numbered trophy engraved for your team.",
      icon: <Trophy className="w-6 h-6 text-brand-primary transition-colors duration-300" strokeWidth={1.5} />
    },
    {
      title: "Winner Certificate",
      desc: "Digitally signed certificate co-authenticated by the Jury Chairperson.",
      icon: <FileSignature className="w-6 h-6 text-brand-primary transition-colors duration-300" strokeWidth={1.5} />
    },
    {
      title: "Winner Badge",
      desc: "Official 'BRAND R.COMM 2026 Winner' badge for use across marketing collateral.",
      icon: <Award className="w-6 h-6 text-brand-primary transition-colors duration-300" strokeWidth={1.5} />
    },
    {
      title: "Digital Spotlight",
      desc: "Be featured through exclusive winner creatives and social media announcements across official channels.",
      icon: <Megaphone className="w-6 h-6 text-brand-primary transition-colors duration-300" strokeWidth={1.5} />
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden text-brand-dark border-t border-brand-primary/10 bg-white">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Centered Header */}
        <div className="text-center flex flex-col items-center max-w-2xl mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-4"
          >
            <div className="h-px w-6 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              WINNER BENEFITS
            </span>
            <div className="h-px w-6 bg-brand-primary" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif leading-tight text-brand-dark"
          >
            What winning actually gets you.
          </motion.h2>
        </div>

        {/* Mobile Navigation Arrows & Dots */}
        <div className="flex lg:hidden justify-between items-center w-full mt-6 mb-2 px-2">
          <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-brand-primary/20 text-brand-primary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors shadow-sm" aria-label="Scroll left">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="flex items-center gap-2">
            {benefits.map((_, idx) => (
              <div 
                key={idx}
                className={`transition-all duration-300 rounded-full ${activeIndex === idx ? "w-6 h-2 bg-brand-primary" : "w-2 h-2 bg-brand-primary/30"}`}
              />
            ))}
          </div>

          <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-brand-primary/20 text-brand-primary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors shadow-sm" aria-label="Scroll right">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Benefits Grid (Horizontal Scroll on Mobile) */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-6 lg:gap-8 w-full lg:mt-8 pb-6 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="min-w-[85vw] sm:min-w-[300px] lg:min-w-0 snap-center pt-8 border-t border-brand-primary/20 hover:border-brand-primary transition-all duration-500 group flex flex-col items-start cursor-default"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:-translate-y-1">
                {benefit.icon}
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors duration-300 leading-tight">
                {benefit.title}
              </h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed font-medium">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
