"use client";
import React, { useState } from "react";
import SponsorModal from "./SponsorModal";
import DelegateRegistrationModal from "./DelegateRegistrationModal";
import TermsAndConditionsModal from "./TermsAndConditionsModal";
import SpeakerModal from "./SpeakerModal";

export default function Hero() {
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);

  return (
    <section 
      className="relative w-full min-h-[100dvh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('/landing/topp.png')` }}
    >
      
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-black/75" />

      {/* Text Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-10 pt-4 pb-6 md:pt-6 md:pb-8 w-full flex flex-col items-center justify-center text-center opacity-0 animate-fade-in-up delay-100 mt-4 md:-mt-24">
        
        {/* Event Logo */}
        <div className="mb-4 md:mb-2 -mt-2 md:-mt-4">
          <img src="/logo/New nrc logo.png" alt="NRC Logo" className="h-14 sm:h-20 md:h-32 lg:h-40 w-auto object-contain mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
        </div>

        {/* Subtitle / Edition */}
        <div className="inline-flex items-center justify-center bg-black/40 border-t border-b border-brand-primary/80 px-4 py-2 md:px-5 md:py-1 mb-4 md:mb-3 backdrop-blur-sm w-[90%] sm:w-auto max-w-[320px] md:max-w-none">
          <div className="hidden md:block h-px w-6 bg-brand-primary mr-3" />
          <span className="text-white tracking-[0.15em] md:tracking-[0.2em] text-[8.5px] sm:text-[9px] md:text-[11px] font-bold uppercase text-center w-full md:w-auto">
            4th Edition • New Delhi, India
          </span>
          <div className="hidden md:block h-px w-6 bg-brand-primary ml-3" />
        </div>
        
        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.2] text-white mb-4 md:mb-4 w-full max-w-5xl drop-shadow-2xl">
          Where India&apos;s <span className="text-brand-primary italic font-bold">agri-industry</span><br className="sm:hidden" /> writes its next chapter.
        </h1>
        
        {/* Call to Actions - Quick Links */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row flex-wrap justify-center gap-2 md:gap-4 w-full max-w-[340px] sm:max-w-2xl mt-4 md:mt-6">
          {[
            "Become a Sponsor",
            "Benefits of Sponsors",
            "Nomination for Awards",
            "Register as Delegate",
            "Speaker Interest",
            "Event Brochure",
            "Feature in Coffee Table Book"
          ].map((text, i) => (
            <button 
              key={i} 
              onClick={() => {
                if (text === "Become a Sponsor") {
                  setIsSponsorModalOpen(true);
                } else if (text === "Benefits of Sponsors") {
                  const el = document.getElementById("sponsors");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else if (text === "Register as Delegate") {
                  const el = document.getElementById("delegates");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else if (text === "Speaker Interest") {
                  setIsSpeakerModalOpen(true);
                } else if (text === "Feature in Coffee Table Book") {
                  const el = document.getElementById("coffee-table-book");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else if (text === "Nomination for Awards") {
                  const el = document.getElementById("awards");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else if (text === "Event Brochure") {
                  window.open('/brouchers/Updated BRC 4 2026 Brochure.pdf', '_blank');
                }
              }}
              className={`w-full sm:w-auto px-2 py-2.5 md:px-5 md:py-2 text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider md:tracking-[0.1em] leading-tight flex items-center justify-center ${text === 'Become a Sponsor' ? 'col-span-2 bg-brand-primary border-brand-primary shadow-brand-primary/40' : 'bg-white/10 border-white/30'} border backdrop-blur-md rounded-full hover:bg-brand-primary hover:border-brand-primary transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5`}
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
      <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 max-w-[240px] md:max-w-[280px] hidden md:block opacity-0 animate-fade-in-up delay-500 z-10">
        <p className="text-[10px] md:text-xs text-white/60 leading-relaxed font-sans font-normal border-l-2 border-brand-primary pl-3 md:pl-4">
          The BRAND R.COMM 2026 Summit & Awards is India&apos;s most decisive gathering of chairmen, marketers, agencies and policymakers shaping the future of agriculture and rural communication.
        </p>
      </div>

      {/* Bottom Right Terms & Conditions */}
      <div className="absolute bottom-8 right-6 md:bottom-12 md:right-12 hidden md:block opacity-0 animate-fade-in-up delay-500 z-20">
        <button 
          onClick={() => setIsTermsModalOpen(true)} 
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-full text-[10px] md:text-xs text-white/90 hover:text-white font-medium tracking-wide transition-all duration-300"
        >
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Terms and Conditions
        </button>
      </div>
      
      <SponsorModal 
        isOpen={isSponsorModalOpen} 
        onClose={() => setIsSponsorModalOpen(false)} 
      />
      <DelegateRegistrationModal
        isOpen={isDelegateModalOpen}
        onClose={() => setIsDelegateModalOpen(false)}
      />
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      <SpeakerModal
        isOpen={isSpeakerModalOpen}
        onClose={() => setIsSpeakerModalOpen(false)}
      />
    </section>
  );
}
