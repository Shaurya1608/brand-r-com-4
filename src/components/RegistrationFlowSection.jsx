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
    <section id="registration-flow" className="relative w-full bg-brand-surface py-16 md:py-20 overflow-hidden text-brand-dark border-t border-brand-primary/10">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Centered Header */}
        <div className="mb-16 text-center flex flex-col items-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="bg-white border border-brand-primary/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Subtle hover background accent */}
              <div className="absolute inset-0 bg-brand-surface/0 group-hover:bg-brand-surface transition-colors duration-300 pointer-events-none z-0" />
              
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl font-serif text-brand-primary mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  {step.id}
                </div>
                <h3 className="text-lg font-serif text-brand-dark mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">
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
