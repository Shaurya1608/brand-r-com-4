"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function AwardCategoriesSection() {
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
  const categoryGroups = [
    {
      groupTitle: "Jury Choice Awards - Individuals",
      categories: [
        { title: "Lifetime Achievement Award" },
        { title: "Company of the Year Award" },
        { title: "Voice of the Year Award" },
        { title: "Changemaker Award" },
        { title: "Pioneer Award" },
        { title: "Growth Catalyst Award" },
        { title: "NextGen Award" },
        { title: "Shakti Award" },
        { title: "Visionary Entrepreneur Award" },
        { title: "Policy Driver Award" },
        { title: "Sustainability Champion Award" }
      ]
    },
    {
      groupTitle: "Nomination Based Awards – Companies",
      categories: [
        { 
          title: "Industry Excellence Awards",
          subCategories: [
            "Seed",
            "Crop Protection",
            "Soil Health & Biologicals",
            "Fertilizer & Plant Nutrition",
            "Farm Machinery & Agri-Tech",
            "Irrigation & Water Management",
            "Agri Startup",
            "Research & Development (R&D)"
          ]
        },
        { title: "Emerging Company of the Year Award" },
        { title: "Best Outdoor Campaign Award" },
        { title: "Best Rural Engagement Award" },
        { title: "Best PR Campaign Award" },
        { title: "Best Digital Marketing Award" },
        { title: "Best Brand Campaign (TVC) Award" },
        { title: "Best Integrated Communication Award" }
      ]
    },
    {
      groupTitle: "Nomination Based Awards – Individuals",
      categories: [
        { title: "Best Communicator Award – Male" },
        { title: "Best Communicator Award – Female" },
        { title: "AI Leadership Excellence Award" },
        { title: "Marketing Leader of the Year" },
        { title: "HR Leader of the Year" }
      ]
    }
  ];

  return (
    <section className="relative w-full bg-brand-surface py-16 md:py-24 overflow-hidden">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Centered Header Layout */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-4xl flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary/50" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                BRAND R.COMM AWARD CATEGORIES
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
                32 categories. <span className="text-brand-primary italic">One benchmark.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mt-2"
            >
              <p className="text-brand-dark/70 text-sm leading-relaxed font-sans">
                Every category is defined with an unambiguous eligibility scope. If you're unsure, our secretariat is happy to help you pick the right one.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation Arrows & Dots */}
        <div className="flex lg:hidden justify-between items-center w-full mt-6 mb-2 px-2">
          <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-brand-primary/20 text-brand-primary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors shadow-sm" aria-label="Scroll left">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="flex items-center gap-2">
            {categoryGroups.map((_, idx) => (
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

        {/* 3 Column Grid for Categories (Horizontal Scroll on Mobile) */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-6 w-full lg:mt-10 pb-6 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryGroups.map((group, groupIdx) => (
            <motion.div 
              key={groupIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIdx * 0.1 }}
              className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center bg-white rounded-2xl p-6 lg:p-8 border border-brand-primary/10 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all flex flex-col h-full group hover:-translate-y-1"
            >
              <h3 className="text-lg md:text-xl font-serif font-bold text-brand-primary mb-5 text-center border-b border-brand-primary/10 pb-4 group-hover:border-brand-primary/30 transition-colors">
                {group.groupTitle}
              </h3>
              <ul className="flex flex-col flex-grow">
                {group.categories.map((category, idx) => (
                  <li key={idx} className="flex flex-col py-2.5 border-b border-brand-primary/5 last:border-b-0 group/item hover:bg-brand-primary/[0.03] transition-colors px-3 -mx-3 rounded-lg cursor-default">
                    <div className="flex items-start gap-3">
                      <span className="text-brand-primary/40 text-[10px] font-bold tracking-wider mt-0.5 group-hover/item:text-brand-primary/60 transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className="text-xs md:text-sm font-medium text-brand-dark/80 leading-tight group-hover/item:text-brand-dark transition-colors">{category.title}</span>
                    </div>
                    {category.subCategories && (
                      <div className="flex flex-wrap gap-1.5 mt-2 ml-6">
                        {category.subCategories.map((sub, sIdx) => (
                          <span key={sIdx} className="text-[9px] md:text-[10px] bg-brand-surface border border-brand-primary/10 text-brand-dark/70 px-2 py-0.5 rounded-md">
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
