"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function JurySection() {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const jury = [
    {
      name: "Dr. Suresh Ramanathan",
      role: "JURY CHAIRPERSON",
      company: "Former Secretary, Ministry of Agriculture",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1740&auto=format&fit=crop"
    },
    {
      name: "Prof. Neha Chatterjee",
      role: "JURY MEMBER",
      company: "Dean, National Institute of Agribusiness",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1887&auto=format&fit=crop"
    },
    {
      name: "Rajiv Malhotra",
      role: "JURY MEMBER",
      company: "Independent Policy Analyst",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop"
    },
    {
      name: "Ananya Roy",
      role: "JURY MEMBER",
      company: "CEO, Rural Insights Council",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop"
    },
    {
      name: "Dr. Kiran Patel",
      role: "JURY MEMBER",
      company: "Lead Editor, AgriEconomics Weekly",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop"
    }
  ];

  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      
      <div className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Header Layout */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-4xl flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary/50" />
              <span className="text-brand-primary tracking-[0.25em] text-[10px] font-bold uppercase">
                THE JURY PANEL
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
                An independent jury.<br />
                <span className="text-brand-primary italic">Zero conflicts.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mt-2 mb-8"
            >
              <p className="text-brand-dark/70 text-sm md:text-base leading-relaxed font-sans">
                Our jury is composed of academic chairs, former public-sector leaders and independent editors — none of whom hold active commercial ties to any nominee. Every submission is evaluated on merit alone.
              </p>
            </motion.div>

            {/* Slider Controls */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="hidden lg:flex space-x-6 justify-center"
            >
              <button 
                onClick={scrollLeft}
                className="w-14 h-14 rounded-full border border-brand-primary/30 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={scrollRight}
                className="w-14 h-14 rounded-full border border-brand-primary/30 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative -mx-6 md:-mx-12 px-6 md:px-12">
          <div 
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {jury.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex-none w-[200px] md:w-[240px] snap-start flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-4 border-white group-hover:border-brand-primary/20 transition-all duration-300">
                  {/* Circular Image */}
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Text content moved below the circle */}
                <div className="px-2">
                  <h3 className="text-lg md:text-xl font-serif text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">{member.name}</h3>
                  <p className="text-brand-primary text-[9px] md:text-[10px] font-bold tracking-widest uppercase mb-1">{member.role}</p>
                  <p className="text-brand-dark/60 text-xs font-sans">{member.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
