"use client";
import React, { useRef, useState } from "react";

export default function ByTheNumbers() {
  const scrollRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.children[0].offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveDot(newIndex);
    }
  };

  const stats = [
    { 
      number: "1,200+", 
      label: "Delegates Convened",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      number: "380+", 
      label: "Companies Represented",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      number: "65+", 
      label: "Marquee Speakers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    { 
      number: "45", 
      label: "Awards Presented",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    { 
      number: "30+", 
      label: "Category Sponsors",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      number: "18", 
      label: "Curated Sessions",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      number: "12", 
      label: "Networking Hours",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      number: "250+", 
      label: "Media Coverage",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
  ];

  return (
    <section id="about" className="relative w-full bg-brand-surface min-h-screen flex items-center py-20 border-t border-brand-dark/5 overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/60 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        
        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12 mb-16 md:mb-20">
          
          <div className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-px w-10 bg-brand-primary/70" />
              <span className="text-brand-primary tracking-[0.2em] text-[11px] font-bold uppercase">
                By The Numbers
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif leading-[1.2] text-brand-dark">
              Three editions. <br />
              One <span className="text-brand-primary italic font-medium">benchmark</span> for the industry.
            </h2>
          </div>

          <div className="max-w-md lg:pb-2">
            <p className="text-brand-dark/70 leading-relaxed font-sans text-base">
              Since 2023, BRAND R.COMM has grown from a curated dinner of 200 CMOs into India&apos;s most reported agriculture & rural communication summit — and it is only accelerating.
            </p>
          </div>
        </div>

        {/* Stats Carousel (Mobile) / Grid (Desktop) */}
        <div className="relative w-full -mx-6 md:mx-0 w-[calc(100%+3rem)] md:w-full">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto px-6 scroll-pl-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-6 sm:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="w-[280px] sm:w-auto flex-shrink-0 snap-start group flex flex-col items-start justify-between p-6 bg-white/40 backdrop-blur-md border border-brand-dark/5 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/80 hover:shadow-lg hover:shadow-brand-primary/10 hover:border-brand-primary/20"
              >
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-serif text-brand-dark mb-2 transition-colors duration-300 group-hover:text-brand-primary">
                    {stat.number}
                  </h3>
                  <p className="text-brand-dark/60 text-[10px] tracking-widest font-bold uppercase group-hover:text-brand-dark transition-colors duration-300">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Dots */}
          <div className="flex sm:hidden justify-center space-x-2 mt-4">
            {stats.map((_, index) => (
              <div 
                key={index} 
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeDot === index ? 'bg-brand-primary' : 'bg-brand-dark/20'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

