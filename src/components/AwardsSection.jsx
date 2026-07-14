"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AwardsSection() {
  return (
    <section className="relative w-full bg-brand-surface py-20 md:py-24 overflow-hidden border-t border-brand-primary/10">
      
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10 max-w-[85rem] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column - Content */}
          <div className="flex-1 lg:max-w-md flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                THE BRAND R.COMM AWARDS
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-dark mb-6">
                The most credible <span className="text-brand-primary italic">honour</span> in Indian agri-communication.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-brand-dark/70 text-sm md:text-base leading-relaxed font-sans mb-10">
                Forty-five categories. Peer-reviewed. Editorial-audited. Handed over on a stage that industry leaders, trade press and shortlisted teams show up in equal measure to be part of.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button className="px-6 py-3 bg-brand-primary text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-primary/90 transition-colors shadow-sm rounded-md">
                Apply for Awards
              </button>
              <button className="px-6 py-3 border border-brand-primary text-brand-primary text-xs font-bold tracking-wider uppercase hover:bg-brand-primary/10 transition-colors rounded-md">
                See the Process
              </button>
            </motion.div>
          </div>

          {/* Right Column - Bento Box Layout */}
          <div className="flex-1 flex flex-col gap-5">
            
            {/* Top Row: Big Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full h-[200px] md:h-[260px] rounded-2xl overflow-hidden relative group shadow-sm border border-brand-primary/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?q=80&w=1887&auto=format&fit=crop" 
                alt="Golden Award Trophy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Middle Row: Two Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/70 backdrop-blur-md border border-brand-primary/10 rounded-2xl p-6 hover:bg-white hover:border-brand-primary/30 transition-all duration-300 shadow-sm"
              >
                <h4 className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-3">Jury Choice Awards</h4>
                <h3 className="text-xl font-serif text-brand-dark mb-2">By invitation of the Jury.</h3>
                <p className="text-brand-dark/60 text-xs leading-relaxed">Lifetime & Emerging Marketer awards decided by the Jury Panel — no self-nominations.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/70 backdrop-blur-md border border-brand-primary/10 rounded-2xl p-6 hover:bg-white hover:border-brand-primary/30 transition-all duration-300 shadow-sm"
              >
                <h4 className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-3">Nomination Awards</h4>
                <h3 className="text-xl font-serif text-brand-dark mb-2">Open to industry.</h3>
                <p className="text-brand-dark/60 text-xs leading-relaxed">Twenty-plus categories open to nominations from brands, agencies, startups, and communication teams.</p>
              </motion.div>
            </div>

            {/* Bottom Row: Important Dates Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/70 backdrop-blur-md border border-brand-primary/10 rounded-2xl p-6 hover:bg-white transition-colors duration-300 shadow-sm"
            >
              <h4 className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-6">Important Dates</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase mb-1">Nominations</p>
                  <p className="text-brand-dark text-base md:text-lg font-serif">30 Oct 2026</p>
                </div>
                <div>
                  <p className="text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase mb-1">Shortlist</p>
                  <p className="text-brand-dark text-base md:text-lg font-serif">15 Nov 2026</p>
                </div>
                <div>
                  <p className="text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase mb-1">Jury Round</p>
                  <p className="text-brand-dark text-base md:text-lg font-serif">22 Nov 2026</p>
                </div>
                <div>
                  <p className="text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase mb-1">Ceremony</p>
                  <p className="text-brand-dark text-base md:text-lg font-serif">4 Dec 2026</p>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase">Nomination Fee</span>
                <span className="text-brand-dark text-xl font-serif">₹ 10,000 <span className="text-xs font-sans text-brand-dark/50">+ GST</span></span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
