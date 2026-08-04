"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import SponsorModal from "./SponsorModal";

export default function SponsorshipSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const slideWidth = scrollContainerRef.current.children[0].offsetWidth + 24; // approx card width + gap
      const newActive = Math.round(scrollLeft / slideWidth);
      setActiveSlide(newActive);
    }
  };

  const scrollToSlide = (index) => {
    if (scrollContainerRef.current) {
      const slideWidth = scrollContainerRef.current.children[0].offsetWidth + 24;
      scrollContainerRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
      setActiveSlide(index);
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) {
      scrollToSlide(activeSlide - 1);
    }
  };

  const handleNext = () => {
    if (activeSlide < sponsorships.length - 1) {
      scrollToSlide(activeSlide + 1);
    }
  };
  const sponsorships = [
    {
      eyebrow: "MARQUEE TITLE",
      slots: "1 SLOT",
      title: "Presented By",
      price: "INR 20,00,000/- + GST",
      description: "Category-exclusive. No competing agri-title sponsor.",
      features: [
        "Official status as Presented By Sponsor of BRAND R.Comm.",
        "Official part of Event logo on top position",
        "Premium logo placement across all event branding and communication materials.",
        "Branding on digital and print marketing collaterals.",
        "Special acknowledgement during the Inaugural and Valedictory Sessions.",
        "Opportunity for a senior management representative to be on the dais during the inaugural and awards ceremony.",
        "Exclusive 15 Minutes Brand Presentation Session.",
        "8-page feature in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "Corporate video of duration 5 minutes, to be played during breaks.",
        "03 standees (6*3 ft) can be displayed at the venue",
        "Colour advertisement in the event souvenir.",
        "Speaking slot for senior management official in relevant/preferred session",
        "12 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "POWERED BY",
      slots: "2 SLOTS",
      title: "Powered By",
      price: "INR 15,00,000/- + GST",
      features: [
        "Official status as Powered By Sponsor.",
        "Official part of Event logo on bottom of Event Logo position",
        "Branding on all digital and print marketing collaterals.",
        "Special acknowledgement during the inaugural and closing ceremonies.",
        "Opportunity for a senior management representative to join the inaugural dais.",
        "Exclusive 15 Minutes Brand Presentation Session.",
        "6-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "Corporate video screening during event breaks.",
        "Premium venue standee branding.",
        "Colour advertisement in the event souvenir.",
        "Speaking opportunity during a preferred technical session.",
        "10 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "CATEGORY",
      slots: "MULTIPLE",
      title: "Award Sponsor",
      price: "INR 5,00,000/- + GST",
      features: [
        "Official Award Sponsor status.",
        "Branding across event marketing collaterals.",
        "Logo branding on award trophies and certificates under \"Curtesy by\" OR \"Award Sponsored By\".",
        "Special acknowledgement during the inaugural and awards ceremony.",
        "Opportunity for a senior representative to present awards on stage.",
        "Premium venue standee branding.",
        "4-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "Colour advertisement in the event souvenir.",
        "Speaking opportunity during a preferred technical session.",
        "06 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "EDITORIAL",
      slots: "1 SLOT",
      title: "Coffee Table Book Sponsor",
      price: "INR 5,00,000 + GST",
      features: [
        "Official Coffee Table Book Sponsor recognition.",
        "Cover Page design with the Senior Management Picture with 4-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Brand visibility across event communication.",
        "Logo placement in promotional creatives related to the publication.",
        "Recognition during the official launch ceremony.",
        "Complimentary 20 copies of the Coffee Table Book.",
        "Colour advertisement in the event souvenir.",
        "Speaking opportunity during a preferred technical session.",
        "05 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "BRANDING",
      slots: "1 SLOT",
      title: "Lanyard Sponsor",
      price: "INR 2,00,000/- + GST",
      features: [
        "Exclusive branding on delegate lanyards.",
        "Brand visibility throughout the event.",
        "Recognition across marketing collaterals.",
        "Venue branding opportunities.",
        "Acknowledgement during the event.",
        "Speaking opportunity during a preferred technical session.",
        "02 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "BRANDING",
      slots: "1 SLOT",
      title: "Kit Sponsor",
      price: "₹4,00,000 + GST",
      features: [
        "Exclusive branding on delegate kits.",
        "Branding at the registration area.",
        "Logo visibility across marketing collaterals.",
        "Standee branding at the registration desk.",
        "Colour advertisement in the event souvenir.",
        "Speaking opportunity during a preferred technical session.",
        "2-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "04 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "HOSPITALITY",
      slots: "MULTIPLE",
      title: "Lunch Sponsor",
      price: "₹3,50,000 + GST",
      features: [
        "Exclusive branding at the networking lunch area.",
        "Brand visibility on lunch signage and communication.",
        "Recognition across event marketing collaterals.",
        "Standee branding at the dining area.",
        "Colour advertisement in the event souvenir.",
        "Speaking opportunity during a preferred technical session.",
        "2-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "04 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "HOSPITALITY",
      slots: "1 SLOT",
      title: "Gala Dinner Sponsor",
      price: "₹6,00,000 + GST",
      features: [
        "Exclusive branding throughout the Gala Dinner.",
        "Recognition during the evening celebration.",
        "Premium branding at the dinner venue.",
        "Brand visibility across event communication.",
        "Standee branding at the gala venue.",
        "Colour advertisement in the event souvenir.",
        "Speaking opportunity during a preferred technical session.",
        "2-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "06 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "BRANDING",
      slots: "1 SLOT",
      title: "Agenda Sponsor",
      price: "₹2,00,000 + GST",
      features: [
        "Branding on the official event agenda.",
        "Logo placement in printed and digital schedules.",
        "Visibility throughout the conference programme.",
        "Recognition across event communication.",
        "Speaking opportunity during a preferred technical session.",
        "02 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "BRANDING",
      slots: "1 SLOT",
      title: "Badge Sponsor",
      price: "₹2,00,000 + GST",
      features: [
        "Exclusive branding on delegate badges.",
        "Brand exposure throughout the event.",
        "Recognition across marketing collaterals.",
        "Venue branding opportunities.",
        "Speaking opportunity during a preferred technical session.",
        "02 Complimentary Delegates Passes"
      ]
    },
    {
      eyebrow: "BRANDING",
      slots: "1 SLOT",
      title: "Memento Sponsor",
      price: "₹3,00,000 + GST",
      features: [
        "Logo branding on event (Speaker) mementoes.",
        "Recognition during speaker felicitation ceremonies.",
        "Visibility across event communication.",
        "Premium branding opportunities during presentations.",
        "Speaking opportunity during a preferred technical session.",
        "2-Pages Feature coverage in The SnailShow Coffee Table Book.",
        "Dedicated episode on The SnailShow Podcast (Before or After the Event).",
        "02 Complimentary Delegates Passes"
      ]
    }
  ];

  return (
    <section id="sponsors" className="relative w-full py-16 overflow-hidden bg-brand-surface">
      
      {/* Background Vertical Lines removed */}

      <div className="relative z-10 w-full max-w-[95%] 2xl:max-w-[1400px] mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center max-w-3xl mb-12 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Exclusive Sponsorship
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-brand-dark mb-6"
          >
            Own the moment.<br />
            <span className="text-brand-primary italic">One category. One brand.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark/60 text-sm md:text-base leading-relaxed font-sans max-w-2xl"
          >
            The most visible positions at BRAND R.COMM 2026 — reserved for a single brand each. Every tier below is capped, and once taken, closed.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full group">
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            disabled={activeSlide === 0}
            aria-label="Previous Sponsorship Tier"
            className={`absolute left-0 lg:left-4 top-[40%] md:top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-brand-primary/20 text-brand-primary flex items-center justify-center shadow-lg transition-all duration-300 ${activeSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-brand-primary hover:text-white hover:scale-110'}`}
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={handleNext}
            disabled={activeSlide === sponsorships.length - 1}
            aria-label="Next Sponsorship Tier"
            className={`absolute right-0 lg:right-4 top-[40%] md:top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-brand-primary/20 text-brand-primary flex items-center justify-center shadow-lg transition-all duration-300 ${activeSlide === sponsorships.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-brand-primary hover:text-white hover:scale-110'}`}
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 px-4 md:px-12 items-stretch hide-scrollbar"
          >
          {sponsorships.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="w-[95%] md:w-[90%] lg:w-[100%] max-w-[1300px] snap-center shrink-0 bg-brand-primary/10 rounded-3xl p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-10 justify-start lg:justify-between mx-auto"
            >
              <div className="w-full lg:max-w-md flex flex-col">
                <div className="flex items-center space-x-3 mb-6 text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase">
                  <span>{tier.eyebrow}</span>
                  <span>—</span>
                  <span>{tier.slots}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-serif text-brand-dark mb-2">{tier.title}</h3>
                <div className="text-xl md:text-2xl font-serif text-brand-primary mb-4">{tier.price}</div>
                {tier.description && (
                  <p className="text-brand-dark/60 text-sm leading-relaxed mb-6">
                    {tier.description}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-8">
                  <button 
                    onClick={() => { setSelectedCategory(tier.title); setIsModalOpen(true); }}
                    className="px-6 py-3 bg-brand-primary text-white text-[10px] font-bold tracking-widest uppercase hover:bg-brand-dark transition-colors text-center rounded"
                  >
                    GRAB NOW
                  </button>
                  <button className="px-6 py-3 border border-brand-primary/20 text-brand-dark text-[10px] font-bold tracking-widest uppercase hover:border-brand-primary transition-colors bg-white text-center rounded">
                    DOWNLOAD BROCHURE
                  </button>
                </div>
              </div>

              <div className="w-full lg:flex-1 flex flex-col">
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
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          {sponsorships.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeSlide === idx 
                  ? "w-8 h-2 bg-brand-primary" 
                  : "w-2 h-2 bg-brand-primary/30 hover:bg-brand-primary/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
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
