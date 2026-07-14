"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SecurePaymentsSection() {
  const paymentMethods = ["Cards", "UPI", "Net Banking", "International"];

  return (
    <section id="secure-payments" className="relative w-full bg-white py-16 md:py-20 overflow-hidden text-brand-dark border-t border-brand-primary/10">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/2" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Main Card Container to match screenshot layout but in light theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-brand-surface border border-brand-primary/10 rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-sm relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-px w-8 bg-brand-primary/40" />
                <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                  Secure Payments
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.15] text-brand-dark mb-6">
                Powered by <span className="text-brand-primary">Razorpay.</span><br />
                Trusted by 8M businesses.
              </h2>
              
              <p className="text-brand-dark/70 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                Every registration is processed via Razorpay's PCI-DSS Level 1 payment stack. Your card and banking data never touches our servers.
              </p>

              {/* Payment Method Badges */}
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full border border-brand-primary/20 bg-white/50 text-[10px] font-bold tracking-widest uppercase text-brand-dark/80"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/60" />
                    <span>{method}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Secured Checkout Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white border border-brand-primary/10 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-6">
                <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                  Secured Checkout
                </span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-serif text-brand-dark mb-4">
                PCI-DSS Level 1 • 3DS 2.0
              </h3>
              
              <p className="text-brand-dark/70 text-sm leading-relaxed">
                Two-factor authentication, biometric UPI, encrypted card tokens and instant refund workflows. Enterprise-grade infrastructure — hidden behind an effortless checkout.
              </p>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
