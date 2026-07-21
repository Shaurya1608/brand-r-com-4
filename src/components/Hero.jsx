"use client";
import React, { useState } from "react";
import SponsorModal from "./SponsorModal";

export default function Hero() {
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[url('/landing/generated_bg.png')] bg-cover bg-center">
      
      {/* Dark overlay with pronounced light green tint */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-primary/40 via-black/70 to-black/90 mix-blend-multiply" />
      
      {/* Background Glowing Green Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Text Container with Glassmorphism and pronounced green glow */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10 pt-4 pb-6 md:pt-6 md:pb-8 w-[90%] md:w-full flex flex-col items-center justify-center text-center opacity-0 animate-fade-in-up delay-100 bg-black/5 md:bg-black/20 backdrop-blur-sm md:backdrop-blur-md rounded-[2.5rem] border border-brand-primary/20 shadow-[0_0_60px_rgba(var(--brand-primary),0.2)] shadow-brand-primary/10 mt-8 md:mt-12">
        
        {/* Event Logo */}
        <div className="mb-3 md:mb-4">
          <img src="/logo/brand-r-comm-logo-2.png" alt="Brand R.Comm" className="h-16 md:h-20 lg:h-24 w-auto object-contain mx-auto" />
        </div>

        {/* Subtitle / Edition */}
        <div className="flex items-center justify-center space-x-4 mb-3 md:mb-4">
          <div className="h-px w-12 bg-brand-primary" />
          <span className="text-white tracking-[0.2em] text-[10px] md:text-xs font-bold uppercase">
            4th Edition • New Delhi, India
          </span>
          <div className="h-px w-12 bg-brand-primary" />
        </div>
        
        {/* Main Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.15] text-white mb-6 md:mb-8 max-w-2xl">
          Where India&apos;s <span className="text-brand-primary italic">agri-industry</span> writes its next chapter.
        </h1>
        
        

        {/* Call to Actions - Quick Links */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full mt-4">
          {[
            "Become a Sponsor",
            "Benefits of Sponsors",
            "Nomination for Awards",
            "Register as Delegate",
            "Speaker Interest",
            "Event Brochure"
          ].map((text, i) => (
            <button 
              key={i} 
              onClick={() => {
                if (text === "Become a Sponsor") {
                  setIsSponsorModalOpen(true);
                }
              }}
              className="px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium text-white bg-white/5 backdrop-blur-sm border border-white/30 hover:bg-brand-primary hover:border-brand-primary transition-all duration-300 whitespace-nowrap rounded"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 animate-fade-in-up delay-400">
        <span className="text-[10px] font-sans tracking-[0.3em] text-white/70 uppercase mb-2 font-bold">Scroll</span>
        <div className="w-[2px] h-12 bg-gradient-to-b from-brand-primary to-transparent animate-pulse" />
      </div>

      {/* Bottom Left Context Paragraph */}
      <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 max-w-[280px] md:max-w-[340px] hidden md:block opacity-0 animate-fade-in-up delay-500 z-10">
        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-sans font-normal border-l-2 border-brand-primary pl-4">
          The BRAND R.COMM 2026 Summit & Awards is India&apos;s most decisive gathering of chairmen, marketers, agencies and policymakers shaping the future of agriculture and rural communication.
        </p>
      </div>
      
      <SponsorModal 
        isOpen={isSponsorModalOpen} 
        onClose={() => setIsSponsorModalOpen(false)} 
      />
    </section>
  );
}
