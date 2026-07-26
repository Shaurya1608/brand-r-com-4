"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AgendaSection() {
  const agendaData = [
    {
      part: "PART 01",
      time: "09:00 AM – 01:30 PM",
      title: "Morning",
      subtitle: "Knowledge • Leadership • Innovation",
      items: [
        "Delegate Registration, Welcome Tea & Networking",
        "Grand Inaugural Ceremony & Opening Session",
        "Visionary Keynote Addresses by Industry Leaders",
        "Knowledge Paper & Coffee Table Book Launch",
        "Technical Brand Presentation",
        "Technical Panel I",
        "Technical Brand Presentation",
        "Technical Panel II"
      ]
    },
    {
      part: "PART 02",
      time: "01:30 PM – 06:00 PM",
      title: "Afternoon",
      subtitle: "Insights • Collaboration • Strategy",
      items: [
        "Networking Lunch & Business Meetings",
        "Technical Brand Presentation",
        "Technical Panel III",
        "Technical Panel IV",
        "Networking Tea & Industry Interactions",
        "CEO Forum – The Future of Agri & Rural Communication"
      ]
    },
    {
      part: "PART 03",
      time: "06:00 PM – Onwards",
      title: "Evening",
      subtitle: "Recognition • Celebration • Connections",
      items: [
        "Cultural Performance",
        "BRAND R.Comm Awards – Nominee Recognition",
        "Special Live Performance",
        "BRAND R.Comm Awards – Jury Honours",
        "Networking Gala Dinner & Award Celebration"
      ]
    }
  ];

  return (
    <section id="agenda" className="relative w-full bg-white py-12 md:py-16 overflow-hidden">
      
      {/* Background Subtle Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white/40 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Vertical Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-evenly opacity-100 z-0">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden lg:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 bg-white/90 backdrop-blur-md rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-[0_0_40px_20px_rgba(255,255,255,0.8)]">
        
        {/* Header Layout */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center mb-12 md:mb-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="h-px w-10 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              AGENDA · 4 DECEMBER 2026
            </span>
            <div className="h-px w-10 bg-brand-primary" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.1] text-brand-dark">
              Morning ideas. Afternoon deals.<br className="hidden md:block" /> Evening honours.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, opacity: 0 }}
            whileInView={{ opacity: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-brand-dark/70 text-sm md:text-base leading-relaxed font-sans">
              The agenda is deliberately structured — head-first in the morning, hands-first in the afternoon, heart-first in the evening.
            </p>
          </motion.div>
        </div>

        {/* Unique Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          
          {/* Subtle horizontal connecting line behind the cards (Desktop) */}
          <div className="hidden md:block absolute top-[4.5rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent pointer-events-none" />

          {agendaData.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.2 + (index * 0.2), ease: "easeOut" }}
            >
              <div className="h-full group relative pt-6 border-t border-brand-primary/20 transition-all duration-500 hover:border-brand-primary">

                {/* Card Header (Part & Time) */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-primary/10 group-hover:border-brand-primary/20 transition-colors duration-500">
                  <span className="text-brand-primary text-[10px] md:text-xs font-mono tracking-widest uppercase">
                    {phase.part}
                  </span>
                  <span className="text-brand-dark/40 text-[10px] md:text-xs font-mono tracking-widest">
                    {phase.time}
                  </span>
                </div>

                {/* Big Title */}
                <h3 className="text-2xl font-serif text-brand-dark mb-2 group-hover:text-brand-primary transition-colors duration-300">
                  {phase.title}
                </h3>
                <p className="text-brand-primary/80 text-xs font-sans mb-6">
                  {phase.subtitle}
                </p>

                {/* Timeline Items */}
                <ul className="space-y-4 relative">
                  {/* Vertical line for the timeline */}
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-brand-primary/10 group-hover:bg-brand-primary/30 transition-colors duration-500" />
                  
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="relative pl-6">
                      {/* Timeline Dot */}
                      <span className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 border-brand-surface bg-brand-primary/20 group-hover:bg-brand-primary group-hover:border-brand-primary/20 group-hover:shadow-[0_0_8px_rgba(var(--brand-primary),0.6)] transition-all duration-500" />
                      <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed font-sans group-hover:text-brand-dark transition-colors duration-300">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
                
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
