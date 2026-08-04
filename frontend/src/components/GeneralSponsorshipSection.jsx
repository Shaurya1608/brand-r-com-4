"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import SponsorModal from "./SponsorModal";

export default function GeneralSponsorshipSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const sponsorships = [
    {
      title: "Platinum Sponsor",
      price: "₹5,00,000 + GST",
      features: [
        "Official Platinum Sponsor recognition.",
        "Branding on event marketing collaterals.",
        "Premium logo visibility at the venue.",
        "Speaking or networking opportunities.",
        "Venue standee branding.",
        "Colour advertisement in the event souvenir.",
        "2-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "06 Complimentary Delegates Passes"
      ]
    },
    {
      title: "Gold Sponsor",
      price: "₹4,00,000 + GST",
      features: [
        "Official Gold Sponsor recognition.",
        "Branding across event communication.",
        "Venue standee branding.",
        "Logo visibility on marketing collaterals.",
        "Colour advertisement in the event souvenir.",
        "2-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "05 Complimentary Delegates Passes"
      ]
    },
    {
      title: "Silver Sponsor",
      price: "₹3,00,000 + GST",
      features: [
        "Official Silver Sponsor recognition.",
        "Branding on marketing collaterals.",
        "Venue standee branding.",
        "Special acknowledgement during the event.",
        "Colour advertisement in the event souvenir.",
        "2-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "04 Complimentary Delegates Passes"
      ]
    },
    {
      title: "Bronze Sponsor",
      price: "₹2,00,000 + GST",
      features: [
        "Official Bronze Sponsor recognition.",
        "Branding on marketing collaterals.",
        "Venue branding opportunity.",
        "Special acknowledgement during the event.",
        "02 Complimentary Delegates Passes"
      ]
    },
    {
      title: "Panel Sponsor",
      price: "₹2,00,000 + GST",
      features: [
        "Official sponsorship of a conference panel session.",
        "Logo branding on the panel backdrop and session screen.",
        "Brand recognition before and after the panel discussion.",
        "Opportunity for a company representative to introduce or moderate the session.",
        "Branding across session-specific communication.",
        "Venue standee branding.",
        "04 Complimentary Delegates Passes"
      ]
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
    <section className="relative w-full py-20 overflow-hidden bg-white">
      
      {/* Background Vertical Lines removed */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center max-w-4xl mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2"
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
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-dark mb-4"
          >
            Five additional ways to <span className="text-brand-primary italic">plant your brand.</span>
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
            className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 px-4 md:px-12 items-stretch hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              div::-webkit-scrollbar { display: none; }
            `}} />
            {sponsorships.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="w-[95%] md:w-[90%] lg:w-[100%] max-w-[1200px] snap-center shrink-0 bg-white rounded-3xl p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-10 justify-between mx-auto border border-brand-primary/10 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex-1 lg:max-w-md flex flex-col">
                  <div className="flex items-center space-x-3 mb-6 text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase">
                    <span>SPONSOR TIER</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-serif text-brand-dark mb-2">{tier.title}</h3>
                  <div className="text-xl md:text-2xl font-serif text-brand-primary mb-4">{tier.price}</div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-auto lg:mt-10">
                    <button 
                      onClick={() => { setSelectedCategory(tier.title); setIsModalOpen(true); }}
                      className="px-6 py-3 bg-brand-primary text-white text-[10px] font-bold tracking-widest uppercase hover:bg-brand-dark transition-colors text-center rounded"
                    >
                      GRAB NOW
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-6 lg:pl-12 lg:border-l lg:border-brand-primary/10">
                  <ul className="space-y-2 md:space-y-2.5">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <span className="text-brand-primary font-serif italic text-base leading-none mt-0.5">&rsaquo;</span>
                        <span className="text-brand-dark/80 text-[13px] leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
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
      <SponsorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialCategory={selectedCategory} 
      />
    </section>
  );
}
