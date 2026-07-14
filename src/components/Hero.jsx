import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[url('/landing/generated_bg.png')] bg-cover bg-center">
      
      {/* Dark overlay so the white text is readable without hiding the background */}
      <div className="absolute inset-0 z-0 bg-black/80" />
      
      {/* Text Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 w-full flex flex-col items-center justify-center text-center opacity-0 animate-fade-in-up delay-100">
        
        {/* Subtitle / Edition */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="h-px w-12 bg-brand-primary" />
          <span className="text-white tracking-[0.2em] text-xs font-bold uppercase">
            4th Edition • New Delhi, India
          </span>
          <div className="h-px w-12 bg-brand-primary" />
        </div>
        
        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.15] text-white mb-6 max-w-3xl">
          Where India&apos;s <span className="text-brand-primary italic">agri-industry</span> writes its next chapter.
        </h1>
        
        {/* Description */}
        <p className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed mb-10 font-sans font-normal">
          The BRAND R.COMM 2026 Summit & Awards is India&apos;s most decisive gathering of chairmen, marketers, agencies and policymakers shaping the future of agriculture and rural communication.
        </p>
        
        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          <button className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-8 text-sm group">
            <span>REGISTER NOW</span>
            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <button className="btn-ghost w-full sm:w-auto py-3 px-8 text-sm border-white/30 text-white hover:bg-white/10 hover:border-white">
            BECOME A SPONSOR
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 animate-fade-in-up delay-400">
        <span className="text-[10px] font-sans tracking-[0.3em] text-white/70 uppercase mb-2 font-bold">Scroll</span>
        <div className="w-[2px] h-12 bg-gradient-to-b from-brand-primary to-transparent animate-pulse" />
      </div>
      
    </section>
  );
}
