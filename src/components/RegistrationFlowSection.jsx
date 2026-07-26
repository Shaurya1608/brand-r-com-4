"use client";

import React from "react";
import { motion } from "framer-motion";

export default function RegistrationFlowSection() {
  const steps = [
    {
      id: "01",
      title: "Fill the Form",
      description: "Share your details and select your delegate type."
    },
    {
      id: "02",
      title: "Submit",
      description: "Review and submit your application in under 60 seconds."
    },
    {
      id: "03",
      title: "Receive Email",
      description: "You'll receive an acknowledgement instantly."
    },
    {
      id: "04",
      title: "Application Review",
      description: "Our team validates your profile within 24 hours."
    },
    {
      id: "05",
      title: "Payment Link",
      description: "Secure Razorpay payment link on approval."
    },
    {
      id: "06",
      title: "Confirmation",
      description: "Confirmed status once payment is captured."
    },
    {
      id: "07",
      title: "Invoice",
      description: "GST-compliant invoice emailed within 6 hours."
    },
    {
      id: "08",
      title: "Final Registration",
      description: "Your digital delegate badge is issued closer to the event."
    }
  ];

  return (
    <section id="registration-flow" className="relative w-full py-16 md:py-20 overflow-hidden text-brand-dark border-t border-brand-primary/10 bg-brand-surface">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 -translate-y-1/2" />

      <div className="relative z-10 w-11/12 max-w-6xl mx-auto flex flex-col items-center bg-white/60 backdrop-blur-md rounded-[2rem] p-6 md:p-10 shadow-sm border border-white">
        
        {/* Centered Header */}
        <div className="mb-16 text-center flex flex-col items-center max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-6"
          >
            <div className="h-px w-8 bg-brand-primary/40" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Registration Flow
            </span>
            <div className="h-px w-8 bg-brand-primary/40" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.15] text-brand-dark"
          >
            Eight steps. <span className="italic text-brand-primary">Zero friction.</span>
          </motion.h2>
        </div>

        {/* 8 Steps Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-y-10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="pt-6 border-t border-brand-primary/20 hover:border-brand-primary transition-all duration-500 group flex flex-col items-start"
            >
              <div className="text-3xl md:text-4xl font-serif text-brand-primary/50 group-hover:text-brand-primary mb-4 transition-colors duration-500">
                {step.id}
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
