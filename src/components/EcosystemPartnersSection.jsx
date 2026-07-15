"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Megaphone, Handshake, Users } from "lucide-react";

export default function EcosystemPartnersSection() {
  const partnerCategories = [
    {
      title: "KNOWLEDGE PARTNERS",
      icon: <BookOpen size={18} className="text-brand-primary mb-4" />,
      partners: ["ICRISAT", "IIM Ahmedabad", "ICAR", "TERI"]
    },
    {
      title: "MEDIA PARTNERS",
      icon: <Megaphone size={18} className="text-brand-primary mb-4" />,
      partners: ["Krishi Jagran", "AgriBusiness Today", "Rural Marketing", "AgriTimes"]
    },
    {
      title: "SUPPORTING PARTNERS",
      icon: <Handshake size={18} className="text-brand-primary mb-4" />,
      partners: ["FICCI", "PHDCCI", "CII Agri Council", "ASSOCHAM"]
    },
    {
      title: "ASSOCIATION PARTNERS",
      icon: <Users size={18} className="text-brand-primary mb-4" />,
      partners: ["Federation of Seed Industry", "Fertilizer Association of India", "CropLife India", "AITMA"]
    }
  ];

  return (
    <section className="relative w-full py-10 md:py-14 bg-brand-surface text-brand-dark overflow-hidden border-b border-brand-primary/10">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

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
            <span className="text-brand-primary tracking-[0.2em] text-[10px] md:text-xs font-bold uppercase">
              Our Partners
            </span>
            <div className="h-px w-6 bg-brand-primary" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-serif leading-tight text-brand-dark max-w-2xl"
          >
            Built with the ecosystem,<br/>
            <span className="text-brand-dark/60">for the ecosystem.</span>
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {partnerCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.1 }}
              className="group bg-white border border-brand-primary/10 rounded-2xl p-5 md:p-6 shadow-lg shadow-brand-dark/5 hover:shadow-xl hover:shadow-brand-dark/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex flex-col items-start mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-brand-surface rounded-xl group-hover:bg-brand-primary/10 transition-all duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-brand-primary text-[10px] md:text-xs font-bold tracking-[0.1em] uppercase">
                    {category.title}
                  </h3>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-2.5">
                {category.partners.map((partner, pIndex) => (
                  <span 
                    key={pIndex}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-brand-primary/15 bg-brand-surface/50 text-[10px] md:text-xs font-medium text-brand-dark/80 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-colors duration-300 cursor-default"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
