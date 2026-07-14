"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AwardProcessSection() {
  const steps = [
    {
      id: "01",
      title: "Nomination",
      description: "Submit your nomination form with campaign details before 30 October 2026."
    },
    {
      id: "02",
      title: "Screening",
      description: "Our secretariat validates eligibility, documents and campaign timelines."
    },
    {
      id: "03",
      title: "Shortlist",
      description: "Independent shortlist published on the website by 15 November."
    },
    {
      id: "04",
      title: "Jury Round",
      description: "A closed-door jury meeting evaluates each shortlisted case on merit."
    },
    {
      id: "05",
      title: "Winners Locked",
      description: "Results are sealed and stored securely until the night of the ceremony."
    },
    {
      id: "06",
      title: "The Ceremony",
      description: "Winners are announced live at the BRAND R.COMM 2026 Awards on 4 December."
    }
  ];

  return (
    <section className="relative w-full bg-brand-surface py-20 md:py-24 overflow-hidden border-t border-brand-primary/10">
      <div className="relative z-10 max-w-[85rem] mx-auto px-6 md:px-12">
        
        {/* Header Layout */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="max-w-4xl flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary/50" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                THE PROCESS
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-dark">
                Six clear steps.<br />
                <span className="text-brand-primary italic">Independent every step of the way.</span>
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/60 backdrop-blur-md border border-brand-primary/10 rounded-2xl p-8 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full relative overflow-hidden group"
            >
              {/* Large background number */}
              <div className="absolute -right-4 -bottom-8 text-8xl font-serif font-bold text-brand-primary/5 select-none group-hover:text-brand-primary/10 transition-colors duration-300">
                {step.id}
              </div>

              <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                  <span className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-1 block">
                    STEP {step.id}
                  </span>
                  <h3 className="text-2xl font-serif text-brand-dark">
                    {step.title}
                  </h3>
                </div>
                <div className="text-3xl font-serif text-brand-primary/80 select-none">
                  {step.id}
                </div>
              </div>
              
              <div className="relative z-10 mt-auto">
                <p className="text-brand-dark/70 text-sm leading-relaxed max-w-[90%]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
