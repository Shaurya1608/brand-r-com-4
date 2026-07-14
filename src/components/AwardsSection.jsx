"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AwardsSection() {
  const benefits = [
    "Peer-reviewed evaluation by an independent jury",
    "PR amplification if shortlisted or awarded",
    "Editorial feature in the Coffee Table Book",
    "Winner reels, badges and certificates"
  ];

  const timeline = [
    { label: "Nominations close", date: "30 Oct 2026" },
    { label: "Shortlist announced", date: "15 Nov 2026" },
    { label: "Jury round", date: "22 Nov 2026" },
    { label: "Awards ceremony", date: "4 Dec 2026" }
  ];

  return (
    <section id="awards" className="relative w-full bg-white py-16 md:py-20 overflow-hidden text-brand-dark border-t border-brand-primary/10">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Centered Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-6"
          >
            <div className="h-px w-8 bg-brand-primary/40" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Award Nomination
            </span>
            <div className="h-px w-8 bg-brand-primary/40" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.15] text-brand-dark mb-5"
          >
            One entry.<br />
            <span className="italic text-brand-primary">Ten quarters</span> of credibility.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
          >
            The BRAND R.COMM Awards are a peer-reviewed honour — not a paid citation. Every entry must carry senior-management approval and go through a validated screening before it reaches the jury.
          </motion.p>
        </div>

        {/* Vertical Stack Layout */}
        <div className="flex flex-col gap-6 lg:gap-8 max-w-4xl mx-auto">
          
          {/* Top Card - Nomination Details (Long Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white border border-brand-primary/10 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 w-full"
          >
            <span className="text-brand-dark/60 font-mono text-[9px] tracking-[0.2em] uppercase block mb-6 font-semibold">
              Entry Requirements
            </span>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
              
              <div className="flex-1">
                <span className="text-brand-dark/50 font-mono text-[9px] tracking-widest uppercase block mb-2 font-semibold">
                  Nomination Fee
                </span>
                <div className="text-xl md:text-3xl font-serif text-brand-dark">
                  ₹ 10,000 <span className="text-xs md:text-sm font-sans text-brand-dark/50">+ GST</span>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-12 bg-brand-primary/10" />
              <div className="md:hidden w-full h-px bg-brand-primary/10" />
              
              <div className="flex-1">
                <span className="text-brand-dark/50 font-mono text-[9px] tracking-widest uppercase block mb-2 font-semibold">
                  Approval Required
                </span>
                <div className="text-brand-dark/80 text-sm md:text-base font-medium">
                  Senior Management sign-off
                </div>
              </div>

              <div className="w-full md:w-auto mt-4 md:mt-0">
                <button
                  className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-brand-primary-hover transition-colors shadow-sm rounded-lg whitespace-nowrap"
                >
                  Nominate Your Work
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Card - Benefits & Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white border border-brand-primary/10 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              
              <div>
                <span className="text-brand-dark/60 font-mono text-[9px] tracking-[0.2em] uppercase block mb-6 font-semibold">
                  Benefits
                </span>
                <ul className="space-y-4">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <svg className="w-3.5 h-3.5 text-brand-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-brand-dark/80 text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-brand-dark/60 font-mono text-[9px] tracking-[0.2em] uppercase block mb-6 font-semibold">
                  Timeline
                </span>
                <div className="space-y-3">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group/item hover:bg-brand-surface p-2 -mx-2 rounded-lg transition-colors">
                      <span className="text-brand-dark/60 text-xs md:text-sm">{item.label}</span>
                      <span className="text-brand-dark/90 text-xs md:text-sm font-mono tracking-wider font-semibold">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
