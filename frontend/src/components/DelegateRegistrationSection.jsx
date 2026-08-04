"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import DelegateRegistrationModal from "./DelegateRegistrationModal";

export default function DelegateRegistrationSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("indian");

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const indianPricing = [
    { window: "Till 31 August 2026", fee: "₹ 6,000 + GST" },
    { window: "Till 30 September 2026", fee: "₹ 7,000 + GST" },
    { window: "Till 31 October 2026", fee: "₹ 8,000 + GST" },
    { window: "After 31 October", fee: "₹ 10,000 + GST" },
  ];

  const intlPricing = [
    { window: "Till 31 August 2026", fee: "USD 175 + Tax" },
    { window: "Till 30 September 2026", fee: "USD 200 + Tax" },
    { window: "Till 31 October 2026", fee: "USD 225 + Tax" },
    { window: "After 31 October", fee: "USD 250 + Tax" },
  ];

  const inclusions = [
    "Full-day access to all summit sessions",
    "Hosted lunch and curated table conversations",
    "Cocktail reception & red-carpet access",
    "Seat at the BRAND R.COMM 2026 Gala Dinner",
    "Digital delegate kit + printed Coffee Table Book",
    "90-day access to post-event session recordings",
  ];

  return (
    <section id="delegates" className="relative w-full py-16 md:py-20 text-brand-dark overflow-hidden border-t border-brand-primary/10 bg-brand-surface">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-4"
          >
            <div className="h-px w-8 bg-brand-primary/40" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Delegate Registration
            </span>
            <div className="h-px w-8 bg-brand-primary/40" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.15] text-brand-dark">
              One seat. <span className="italic text-brand-primary">A year's worth</span> of conversations.
            </h2>
          </motion.div>
        </div>

        {/* Compact Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          
          {/* Indian Delegate Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative bg-white border border-brand-primary/10 rounded-2xl p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-brand-primary/30 hover:-translate-y-1"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-primary font-mono text-[9px] tracking-widest uppercase font-semibold">Indian Delegate</span>
              <span className="text-brand-dark/50 font-mono text-[9px] tracking-widest uppercase bg-brand-surface px-2 py-1 rounded-md">Early Bird</span>
            </div>
            
            <div className="mb-6">
              <div className="text-3xl font-serif mb-1 text-brand-dark">
                ₹ 10,000 <span className="text-sm text-brand-dark/40 font-sans">+ GST</span>
              </div>
              <p className="text-brand-dark/60 text-xs font-sans">
                Standard price. Register early to save up to 40%.
              </p>
            </div>

            <div className="w-full mb-6 border border-brand-primary/10 rounded-xl overflow-hidden bg-brand-surface/30">
              <div className="flex flex-col">
                {indianPricing.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-4 py-2.5 border-b border-brand-primary/5 last:border-0 hover:bg-white transition-colors">
                    <span className="text-[11px] text-brand-dark/70">{item.window}</span>
                    <span className="text-[11px] text-brand-primary font-bold">{item.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => openModal("indian")}
              className="w-full py-3 bg-brand-primary text-white text-[10px] font-bold tracking-widest uppercase rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm"
            >
              Register as Indian Delegate
            </button>
          </motion.div>

          {/* International Delegate Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative bg-white border border-brand-primary/10 rounded-2xl p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-brand-primary/30 hover:-translate-y-1"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-primary font-mono text-[9px] tracking-widest uppercase font-semibold">International Delegate</span>
              <span className="text-brand-dark/50 font-mono text-[9px] tracking-widest uppercase bg-brand-surface px-2 py-1 rounded-md">USD Pricing</span>
            </div>
            
            <div className="mb-6">
              <div className="text-3xl font-serif mb-1 text-brand-dark">
                USD 250 <span className="text-sm text-brand-dark/40 font-sans">+ Tax</span>
              </div>
              <p className="text-brand-dark/60 text-xs font-sans">
                Includes visa-support letter and concierge.
              </p>
            </div>

            <div className="w-full mb-6 border border-brand-primary/10 rounded-xl overflow-hidden bg-brand-surface/30">
              <div className="flex flex-col">
                {intlPricing.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-4 py-2.5 border-b border-brand-primary/5 last:border-0 hover:bg-white transition-colors">
                    <span className="text-[11px] text-brand-dark/70">{item.window}</span>
                    <span className="text-[11px] text-brand-primary font-bold">{item.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => openModal("foreign")}
              className="w-full py-3 border border-brand-primary/30 bg-transparent text-brand-primary text-[10px] font-bold tracking-widest uppercase rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
            >
              Register as International Delegate
            </button>
          </motion.div>

        </div>

        {/* What's Included - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white border border-brand-primary/10 rounded-2xl p-6 lg:p-8 shadow-sm"
        >
          <div className="mb-4 text-center">
            <span className="text-brand-dark/40 font-mono text-[9px] tracking-widest uppercase">
              What's Included
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
            {inclusions.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-brand-dark/70 text-xs leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
      
      <DelegateRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultType={modalType} 
      />
    </section>
  );
}
