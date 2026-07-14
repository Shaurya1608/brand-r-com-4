"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GeneralSponsorshipSection() {
  const sponsorships = [
    {
      title: "Platinum Sponsor",
      price: "₹ 10,00,000",
      visibility: "Highest tier under Powered By",
      deliverables: "Prime signage, opening reel, 8 delegate passes, panel slot, CTB feature",
      exposure: "Pre, during & post-event"
    },
    {
      title: "Gold Sponsor",
      price: "₹ 7,50,000",
      visibility: "Top-tier logo placement",
      deliverables: "Signage, 6 passes, half-page CTB feature, LinkedIn co-branded post",
      exposure: "Pre, during & post-event"
    },
    {
      title: "Silver Sponsor",
      price: "₹ 5,00,000",
      visibility: "Mid-tier placement",
      deliverables: "4 passes, quarter-page CTB feature, event signage",
      exposure: "Pre & during event"
    },
    {
      title: "Bronze Sponsor",
      price: "₹ 3,00,000",
      visibility: "Standard placement",
      deliverables: "3 passes, listing in CTB, social mention",
      exposure: "During event"
    },
    {
      title: "Delegate Kit Sponsor",
      price: "₹ 4,00,000",
      visibility: "Every delegate carries your brand",
      deliverables: "Branded delegate kit + 3 passes",
      exposure: "During event & beyond"
    },
    {
      title: "Lunch Sponsor",
      price: "₹ 3,50,000",
      visibility: "Branded lunch area",
      deliverables: "Signage + menu branding + 3 passes",
      exposure: "During event"
    },
    {
      title: "Gala Dinner Sponsor",
      price: "₹ 6,00,000",
      visibility: "Owning the gala moment",
      deliverables: "Dinner area branding, table branding, 5 passes",
      exposure: "During event peak hours"
    },
    {
      title: "Agenda Sponsor",
      price: "₹ 2,50,000",
      visibility: "Logo on printed & digital agenda",
      deliverables: "Logo lock-up + 2 passes",
      exposure: "Pre & during event"
    },
    {
      title: "Badge Sponsor",
      price: "₹ 2,00,000",
      visibility: "Every delegate wears your brand",
      deliverables: "Co-branded badges + 2 passes",
      exposure: "During event"
    },
    {
      title: "Lanyard Sponsor",
      price: "₹ 2,00,000",
      visibility: "Lanyard printed with your logo",
      deliverables: "Lanyard branding + 2 passes",
      exposure: "During event"
    },
    {
      title: "Panel Sponsor",
      price: "₹ 3,00,000",
      visibility: "One dedicated panel sponsored",
      deliverables: "Opening mention, backdrop, 3 passes",
      exposure: "During event"
    },
    {
      title: "Memento Sponsor",
      price: "₹ 2,50,000",
      visibility: "Every winner receives a memento",
      deliverables: "Co-branded memento + 2 passes",
      exposure: "During event & post-event"
    }
  ];

  const scrollRef = React.useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.scrollWidth / sponsorships.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollTo = (index) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.scrollWidth / sponsorships.length;
      scrollRef.current.scrollTo({
        left: itemWidth * index,
        behavior: "smooth"
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative w-full bg-white py-20 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center max-w-3xl mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              General Sponsorship
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-brand-dark mb-4"
          >
            Twelve additional ways to <span className="text-brand-primary italic">plant your brand.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark/60 text-sm md:text-base leading-relaxed font-sans max-w-2xl"
          >
            Whether you own the delegate lanyard, the coffee break or the after-party — every tier below comes with defined visibility, deliverables and post-event brand assets.
          </motion.p>
        </div>

        {/* Scrollable Container of Tiers */}
        <div className="w-full relative group">
          
          {/* Left Arrow (Floating) */}
          <button
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-20 p-3 rounded-full bg-white shadow-xl border border-brand-primary/10 transition-all duration-300 ${
              activeIndex === 0 
                ? "opacity-0 pointer-events-none" 
                : "opacity-100 text-brand-primary hover:bg-brand-primary hover:text-white hover:-translate-x-1"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-6 lg:gap-8 pb-8 snap-x snap-mandatory px-4 md:px-0 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              div::-webkit-scrollbar { display: none; }
            `}} />
            {sponsorships.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                className="flex flex-col bg-white rounded-3xl p-5 lg:p-6 border border-brand-primary/10 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-primary/30 transition-all duration-300 w-[85vw] sm:w-[320px] md:w-[350px] lg:w-[380px] flex-shrink-0 snap-center md:snap-start"
              >
                {/* Header: Title and Price */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-brand-primary/60 text-[8px] font-bold tracking-widest uppercase">SPONSOR TIER</span>
                  </div>
                  <h3 className="text-lg font-serif text-brand-dark mb-1 transition-colors">{tier.title}</h3>
                  <div className="text-xl lg:text-2xl font-serif text-brand-primary">{tier.price}</div>
                </div>
                
                {/* Features */}
                <div className="space-y-3 flex-grow mb-5">
                  <div>
                    <h4 className="flex items-center text-[8px] font-bold tracking-widest uppercase text-brand-dark/40 mb-1">
                      <svg className="w-3 h-3 mr-1.5 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Visibility
                    </h4>
                    <p className="text-xs text-brand-dark/80 leading-snug">{tier.visibility}</p>
                  </div>
                  <div>
                    <h4 className="flex items-center text-[8px] font-bold tracking-widest uppercase text-brand-dark/40 mb-1">
                      <svg className="w-3 h-3 mr-1.5 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      Deliverables
                    </h4>
                    <p className="text-xs text-brand-dark/80 leading-snug">{tier.deliverables}</p>
                  </div>
                  <div>
                    <h4 className="flex items-center text-[8px] font-bold tracking-widest uppercase text-brand-dark/40 mb-1">
                      <svg className="w-3 h-3 mr-1.5 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                      Brand Exposure
                    </h4>
                    <p className="text-xs text-brand-dark/80 leading-snug">{tier.exposure}</p>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="mt-auto pt-4 border-t border-gray-50">
                  <button className="w-full py-2.5 bg-white border border-brand-primary/20 text-brand-dark text-[9px] font-bold tracking-widest uppercase hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 text-center rounded shadow-sm hover:shadow-md">
                    ENQUIRE NOW
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow (Floating) */}
          <button
            onClick={() => scrollTo(Math.min(sponsorships.length - 1, activeIndex + 1))}
            disabled={activeIndex === sponsorships.length - 1}
            aria-label="Next slide"
            className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-20 p-3 rounded-full bg-white shadow-xl border border-brand-primary/10 transition-all duration-300 ${
              activeIndex === sponsorships.length - 1 
                ? "opacity-0 pointer-events-none" 
                : "opacity-100 text-brand-primary hover:bg-brand-primary hover:text-white hover:translate-x-1"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center items-center space-x-2 mt-2">
            {sponsorships.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx 
                    ? "w-8 bg-brand-primary" 
                    : "w-2 bg-brand-primary/20 hover:bg-brand-primary/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
