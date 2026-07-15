"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PastEditionsSection() {
  const editions = [
    {
      id: "1st",
      title: "1ST EDITION",
      year: "2023",
      location: "New Delhi",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "2nd",
      title: "2ND EDITION",
      year: "2024",
      location: "New Delhi",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "3rd",
      title: "3RD EDITION",
      year: "2025",
      location: "New Delhi",
      image: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <section id="past-editions" className="relative w-full py-12 md:py-16 bg-brand-surface text-brand-dark overflow-hidden border-t border-brand-primary/10">
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="max-w-lg">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="h-px w-6 bg-brand-primary" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                Past Editions
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-serif leading-tight text-brand-dark"
            >
              Three editions.<br/>
              <span className="text-brand-dark/70">A permanent seat on the industry calendar.</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xs"
          >
            <p className="text-brand-dark/60 text-xs md:text-sm leading-relaxed">
              A curated look at what happened when Indian agri-industry's most influential leaders gathered under one roof.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {editions.map((edition, index) => (
            <motion.div
              key={edition.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group relative h-[220px] md:h-[260px] lg:h-[300px] rounded-2xl overflow-hidden cursor-pointer shadow-lg"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image 
                  src={edition.image}
                  alt={edition.year}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
              </div>

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/10 via-transparent to-brand-dark/95" />
              <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <span className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-1.5">
                  {edition.title}
                </span>
                <h3 className="text-xl md:text-2xl font-serif text-white mb-1">
                  {edition.year}
                </h3>
                <p className="text-white/80 text-[11px] font-medium">
                  {edition.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
