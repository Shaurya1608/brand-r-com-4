"use client";

import React from "react";

export default function CompanyMarquee() {
  const companies = [
    "BHARAT KRISHI",
    "GREENFIELD SEEDS",
    "PRITHVI AGRITECH",
    "AGRIFUTURE INDIA",
    "NOURISH INDIA",
    "FARMLINK BHARAT",
    "VARDHAN FERT."
  ];

  // Duplicate the array to create a seamless loop
  const marqueeItems = [...companies, ...companies];

  return (
    <div className="w-full bg-brand-primary py-4 md:py-6 overflow-hidden flex items-center relative shadow-inner">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Left and Right fade gradients for smooth entering/exiting */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-brand-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-brand-primary to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee">
        {marqueeItems.map((company, index) => (
          <div 
            key={index} 
            className="flex items-center mx-8 md:mx-16"
          >
            <span className="text-brand-surface/80 font-serif font-bold text-sm md:text-base lg:text-xl tracking-[0.2em] whitespace-nowrap hover:text-white transition-colors cursor-default drop-shadow-sm">
              {company}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
