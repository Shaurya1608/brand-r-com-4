"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Megaphone, Handshake, Users } from "lucide-react";

export default function EcosystemPartnersSection() {
  const partnerCategories = [
    {
      title: "Knowledge Partners",
      icon: <BookOpen size={20} className="text-brand-primary" />,
      partners: ["ICRISAT", "IIM Ahmedabad", "ICAR", "TERI"]
    },
    {
      title: "Media Partners",
      icon: <Megaphone size={20} className="text-brand-primary" />,
      partners: ["Krishi Jagran", "AgriBusiness Today", "Rural Marketing", "AgriTimes"]
    },
    {
      title: "Supporting Partners",
      icon: <Handshake size={20} className="text-brand-primary" />,
      partners: ["FICCI", "PHDCCI", "CII Agri Council", "ASSOCHAM"]
    },
    {
      title: "Association Partners",
      icon: <Users size={20} className="text-brand-primary" />,
      partners: ["Federation of Seed Industry", "Fertilizer Association of India", "CropLife India", "AITMA"]
    }
  ];

  return (
    <section className="relative w-full py-10 md:py-14 text-brand-dark overflow-hidden border-b border-brand-primary/10 bg-white">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 md:px-16">
        
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-12 md:gap-y-16 mt-16 max-w-7xl mx-auto">
          {partnerCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.1 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-brand-primary/10 pb-3">
                <div className="text-brand-primary">
                  {category.icon}
                </div>
                <h3 className="text-brand-dark font-sans font-medium text-sm md:text-base tracking-[0.1em] uppercase">
                  {category.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {category.partners.map((partner, pIndex) => (
                  <span 
                    key={pIndex}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded bg-[#ebf4ec] text-xs md:text-sm font-normal text-brand-dark/80 hover:bg-brand-primary hover:text-white transition-colors duration-300 cursor-default"
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
