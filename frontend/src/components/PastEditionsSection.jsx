"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PastEditionsSection() {
  const images = [
    "/Glimpse/1.JPG",
    "/Glimpse/2.JPG",
    "/Glimpse/3.JPG",
    "/Glimpse/4.JPG",
    "/Glimpse/5.JPG",
  ];
  const galleryLink = "https://snail-integral.ptml.in/en/events/x7cv8/albums/sgcxk7yn";

  return (
    <section id="past-editions" className="relative w-full py-12 md:py-16 text-brand-dark overflow-hidden border-t border-brand-primary/10 bg-white">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

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
              Glimpse of The BRAND R.Comm Summit & Awards 2025
            </motion.h2>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group relative h-[180px] md:h-[200px] lg:h-[220px] rounded-2xl overflow-hidden cursor-pointer shadow-lg"
            >
              <Image 
                src={src}
                alt={`Glimpse ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                quality={75}
              />
            </motion.div>
          ))}
          
          {/* View Gallery Card */}
          <motion.a
            href={galleryLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="group relative h-[180px] md:h-[200px] lg:h-[220px] rounded-2xl overflow-hidden cursor-pointer shadow-lg flex items-center justify-center block"
          >
            <div className="absolute inset-0">
              <Image 
                src="/Glimpse/6.JPG"
                alt="View Gallery"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                quality={75}
              />
            </div>
            <div className="absolute inset-0 bg-white/40 group-hover:bg-white/20 transition-colors duration-500" />
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              <div className="bg-[#5b8a41] hover:bg-[#4d7836] text-white px-8 py-3 rounded font-bold text-sm tracking-wide transition-colors duration-300 shadow-md">
                VIEW GALLERY
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
