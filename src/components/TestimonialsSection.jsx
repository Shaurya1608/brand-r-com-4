"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote: "BRAND R.COMM is now on our corporate calendar the moment the year begins. Nowhere else in India do so many decision-makers of the agri industry gather in one room.",
      name: "Rakesh Vaidya",
      title: "Group CMO, AgriGrow Corporation"
    },
    {
      id: 2,
      quote: "Winning at BRAND R.COMM validated eighteen months of work behind our rural campaign. The PR that followed was worth more than the trophy itself.",
      name: "Simran Kaur",
      title: "Head of Communications, Prithvi Bio"
    },
    {
      id: 3,
      quote: "The quality of one-to-one meetings is unmatched. In a single day, we closed conversations that would normally take a quarter.",
      name: "Aditya Bansal",
      title: "Founder, KrishiCloud"
    }
  ];

  return (
    <section className="relative w-full py-12 md:py-16 bg-white text-brand-dark overflow-hidden border-t border-brand-primary/10">
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-4"
          >
            <div className="h-px w-6 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Voices From The Room
            </span>
            <div className="h-px w-6 bg-brand-primary" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-serif leading-tight text-brand-dark"
          >
            Don't take our word for it.<br/>
            <span className="text-brand-primary italic">Take theirs.</span>
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="bg-brand-surface border border-brand-primary/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <Quote size={20} className="text-brand-primary mb-4" />
                <p className="text-brand-dark/80 text-xs md:text-sm leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div>
                <h4 className="text-brand-dark font-bold text-sm">
                  {testimonial.name}
                </h4>
                <p className="text-brand-dark/60 text-[10px] md:text-xs">
                  {testimonial.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
