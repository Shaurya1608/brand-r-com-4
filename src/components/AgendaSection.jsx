"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AgendaSection() {
  const agendaData = [
    {
      part: "PART 01",
      time: "09:00 - 13:00",
      title: "Morning",
      items: [
        "Registration, welcome coffee & delegate networking",
        "Opening keynote by the Chief Guest",
        "CEO Forum: The Next Decade of Rural India",
        "Panel I — Marketing to Bharat: What actually converts",
        "Panel II — The Communication Playbook for AgriTech"
      ]
    },
    {
      part: "PART 02",
      time: "13:00 - 17:30",
      title: "Afternoon",
      items: [
        "Hosted lunch & curated table conversations",
        "Panel III — Media, Measurement & Rural ROI",
        "Panel IV — Sustainability as a Marketing Asset",
        "Brand Case Presentations — ten campaigns, ten minutes each",
        "Fireside chat with a global agri-CMO"
      ]
    },
    {
      part: "PART 03",
      time: "18:30 - 22:30",
      title: "Evening",
      items: [
        "Cocktail reception & red-carpet arrivals",
        "The BRAND R.COMM 2026 Awards Ceremony",
        "Gala dinner with live curated performance",
        "Late-night networking lounge"
      ]
    }
  ];

  return (
    <section id="agenda" className="relative w-full bg-white py-24 md:py-32 overflow-hidden">
      
      {/* Background Subtle Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white/40 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Layout */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center mb-16 md:mb-24">
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-brand-dark">
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
            <p className="text-brand-dark/70 text-base md:text-lg leading-relaxed font-sans">
              The agenda is deliberately structured — head-first in the morning, hands-first in the afternoon, heart-first in the evening.
            </p>
          </motion.div>
        </div>

        {/* Unique Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
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
              <div className="h-full group relative bg-white/60 backdrop-blur-md border border-brand-primary/10 rounded-[1.5rem] p-8 transition-all duration-500 hover:bg-white hover:border-brand-primary/30 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-primary/5">
                
                {/* Top decorative gradient that reveals on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary/0 via-brand-primary to-brand-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[1.5rem]" />

                {/* Card Header (Part & Time) */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-brand-primary/10 group-hover:border-brand-primary/20 transition-colors duration-500">
                  <span className="text-brand-primary text-xs font-mono tracking-widest uppercase">
                    {phase.part}
                  </span>
                  <span className="text-brand-dark/40 text-xs font-mono tracking-widest">
                    {phase.time}
                  </span>
                </div>

                {/* Big Title */}
                <h3 className="text-3xl font-serif text-brand-dark mb-10 group-hover:text-brand-primary transition-colors duration-300">
                  {phase.title}
                </h3>

                {/* Timeline Items */}
                <ul className="space-y-6 relative">
                  {/* Vertical line for the timeline */}
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-brand-primary/10 group-hover:bg-brand-primary/30 transition-colors duration-500" />
                  
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="relative pl-6">
                      {/* Timeline Dot */}
                      <span className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 border-brand-surface bg-brand-primary/20 group-hover:bg-brand-primary group-hover:border-brand-primary/20 group-hover:shadow-[0_0_8px_rgba(var(--brand-primary),0.6)] transition-all duration-500" />
                      <p className="text-brand-dark/70 text-sm leading-relaxed font-sans group-hover:text-brand-dark transition-colors duration-300">
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
