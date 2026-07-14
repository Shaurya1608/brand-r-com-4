"use client";

import React from "react";
import { motion } from "framer-motion";

export default function EventHighlights() {
  const highlights = [
    {
      moment: "MOMENT 01",
      title: "CEO Forum",
      description: "Chairmen and MDs debate the next decade of rural India — on record, off script.",
      image: "/landing/IMG_5631.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 02",
      title: "Marquee Panels",
      description: "Six curated panels on marketing, media, communication, sustainability, agritech and policy.",
      image: "/landing/IMG_5631.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 03",
      title: "Brand Presentations",
      description: "Ten-minute case studies from the year's most talked-about agri campaigns.",
      image: "/landing/IMG_5631.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 04",
      title: "The Awards Ceremony",
      description: "Forty-five categories. Peer-reviewed jury. India's most credible agri-marketing honour.",
      image: "/landing/IMG_5631.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 05",
      title: "Gala Dinner",
      description: "A curated, black-tie networking dinner at a landmark Delhi venue.",
      image: "/landing/IMG_5631.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 06",
      title: "Concierge Networking",
      description: "Pre-scheduled 1:1 meetings via our matchmaking engine — no cold approaches.",
      image: "/landing/IMG_5631.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="highlights" className="relative w-full py-24 md:py-32 overflow-hidden">
      
      {/* Light theme background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center space-x-4 mb-4"
          >
            <div className="h-px w-10 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Event Highlights
            </span>
            <div className="h-px w-10 bg-brand-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-brand-dark">
              Twelve hours engineered to compress <span className="italic text-brand-primary">a quarter.</span>
            </h2>
          </motion.div>
        </div>

        {/* Staggered Timeline Layout */}
        <div className="relative w-full pb-16">
          
          {/* Subtle connecting line down the middle for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-primary/20 -translate-x-1/2" />

          <div className="flex flex-col gap-12 md:gap-20">
            {highlights.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`w-full flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-0 ${isEven ? '' : 'md:flex-row-reverse'}`}
                >
                  
                  {/* Glowing timeline dot (Desktop only) */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="hidden md:block absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_15px_rgba(var(--brand-primary),0.4)] -translate-x-1/2 -translate-y-1/2 z-10"
                  />

                  {/* Highlight Card */}
                  <div className="w-full md:w-[45%] lg:w-[42%]">
                    <div className="group relative p-6 lg:p-8 bg-white/60 backdrop-blur-md border border-brand-primary/10 rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:bg-white hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5">
                      
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(var(--brand-primary), 0.05) 0%, transparent 70%)' }} />

                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            {item.icon}
                          </div>
                          <span className="text-brand-dark/50 font-mono text-[10px] tracking-[0.2em] uppercase">
                            {item.moment}
                          </span>
                        </div>
                        
                        <h3 className="text-xl lg:text-2xl font-serif text-brand-dark mb-3 group-hover:text-brand-primary transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="text-brand-dark/70 text-sm leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unique Image Block */}
                  <div className="w-full md:w-[45%] lg:w-[42%] h-48 md:h-64 rounded-tl-[5rem] rounded-br-[5rem] rounded-tr-xl rounded-bl-xl overflow-hidden relative shadow-xl group transition-all duration-700 hover:shadow-brand-primary/20">
                    <img 
                      src={item.image || "/landing/IMG_5631.JPG"} 
                      alt={item.title}
                      className="object-cover w-full h-full hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    {/* Subtle overlay on the image */}
                    <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                  
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
