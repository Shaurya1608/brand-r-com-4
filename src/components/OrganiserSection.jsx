"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function OrganiserSection() {
  const stats = [
    { value: "12+", label: "YEARS IN AGRI" },
    { value: "80+", label: "RETAINED BRANDS" },
    { value: "5", label: "INDUSTRY PLATFORMS" }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 bg-white text-brand-dark overflow-hidden border-b border-brand-primary/10">
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="h-px w-6 bg-brand-primary" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] md:text-xs font-bold uppercase">
                The Organiser
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-brand-dark mb-4"
            >
              Snail Integral.
            </motion.h2>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl font-serif text-brand-primary italic mb-6"
            >
              Slow craft. Sharp results.
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-brand-dark/70 leading-relaxed mb-10 text-sm md:text-base max-w-lg"
            >
              Snail Integral is an integrated communication, media and consulting firm focused 
              exclusively on the agriculture, rural and food ecosystem. We work with the 
              industry's most demanding clients on brand strategy, communication, editorial and 
              consumer research — and BRAND R.COMM is our flagship annual gathering.
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-8 md:gap-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-start">
                  <span className="text-3xl md:text-4xl font-serif text-brand-primary mb-1">
                    {stat.value}
                  </span>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-bold text-brand-dark/60">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
            
          </div>
          
          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-dark/10 group">
              <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500" />
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
                alt="Snail Integral Office"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Decorative border */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/20 z-20 pointer-events-none" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
