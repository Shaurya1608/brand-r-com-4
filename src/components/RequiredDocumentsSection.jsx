"use client";

import React from "react";
import { motion } from "framer-motion";

export default function RequiredDocumentsSection() {
  const documents = [
    "Signed nomination form with senior-management approval",
    "Campaign or programme deck (max 20 slides, PDF)",
    "Executive summary — 500 words on objective, execution and outcome",
    "Two case-study images (1920×1080, JPG or PNG)",
    "One optional case-study video (max 3 minutes, MP4)",
    "Third-party validation, media coverage or audit report (if available)",
    "Company profile & logo (SVG or PNG, transparent background)",
    "Payment receipt of nomination fee"
  ];

  return (
    <section className="relative w-full bg-brand-surface py-16 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Centered Header */}
        <div className="text-center flex flex-col items-center max-w-2xl mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-4"
          >
            <div className="h-px w-6 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              REQUIRED DOCUMENTS
            </span>
            <div className="h-px w-6 bg-brand-primary" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif leading-tight text-brand-dark mb-4"
          >
            Prepare once. Nominate <span className="text-brand-primary italic">as many</span> categories as you want.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark/70 text-sm md:text-base leading-relaxed font-sans mb-8"
          >
            Below is the master checklist. Once compiled, the same set of documents can be reused across categories with light edits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <button className="flex items-center space-x-2 px-6 py-3 border border-brand-primary text-brand-primary hover:bg-brand-primary/10 transition-colors rounded text-xs font-bold tracking-widest uppercase">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>DOWNLOAD FORMAT</span>
            </button>
          </motion.div>
        </div>

        {/* Centered Checklist in Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex items-center space-x-4 p-4 rounded-lg bg-white border border-brand-primary/10 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-brand-dark/80 text-sm font-sans">{doc}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
