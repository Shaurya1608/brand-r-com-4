"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Smartphone, Building2, Globe } from "lucide-react";

export default function SecurePaymentsSection() {
  return (
    <section className="relative w-full py-12 bg-white text-brand-dark overflow-hidden border-t border-brand-primary/10">
      
      {/* Subtle Background glow */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-10 justify-between items-center">
          
          {/* Left Side */}
          <div className="flex-1 w-full">
            <div className="flex items-center space-x-3 mb-5">
              <div className="h-px w-6 bg-brand-primary" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                Secure Payments
              </span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-serif text-brand-dark mb-4 leading-tight">
              Powered by <span className="text-brand-primary">Razorpay</span>.<br className="hidden md:block"/> Trusted by 8M businesses.
            </h2>
            
            <p className="text-brand-dark/70 text-sm leading-relaxed mb-6 max-w-md">
              Every registration is processed via Razorpay's PCI-DSS Level 1 payment stack. Your card and banking data never touches our servers.
            </p>
            
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[11px] font-medium text-brand-dark/80">
                <CreditCard size={14} className="text-brand-primary" />
                <span>CARDS</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[11px] font-medium text-brand-dark/80">
                <Smartphone size={14} className="text-brand-primary" />
                <span>UPI</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[11px] font-medium text-brand-dark/80">
                <Building2 size={14} className="text-brand-primary" />
                <span>NET BANKING</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-[11px] font-medium text-brand-dark/80">
                <Globe size={14} className="text-brand-primary" />
                <span>INTERNATIONAL</span>
              </div>
            </div>
          </div>

          {/* Right Side - Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full md:max-w-sm relative z-10"
          >
            <div className="p-6 md:p-8 rounded-2xl border border-brand-primary/20 bg-white shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <ShieldCheck size={18} className="text-brand-primary" />
                  <span className="text-brand-primary tracking-widest text-[10px] font-bold uppercase">
                    Secured Checkout
                  </span>
                </div>
                
                <h3 className="text-lg md:text-xl text-brand-dark font-serif mb-3">
                  PCI-DSS Level 1 - 3DS 2.0
                </h3>
                
                <p className="text-brand-dark/60 text-xs md:text-sm leading-relaxed">
                  Two-factor authentication, biometric UPI, encrypted card tokens and instant refund workflows. Enterprise-grade infrastructure — hidden behind an effortless checkout.
                </p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
