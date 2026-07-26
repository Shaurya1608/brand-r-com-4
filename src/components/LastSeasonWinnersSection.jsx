"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LastSeasonWinnersSection() {
  const [showAll, setShowAll] = useState(false);

  const initialWinners = [
    {
      award: "LIFETIME ACHIEVEMENT AWARD",
      name: "DR. R. G. AGARWAL",
      title: "Chairman Emeritus",
      company: "Dhanuka Agritech LTD.",
      image: "/Awards/IMG_6890.JPG"
    },
    {
      award: "GROWTH CATALYST AWARD",
      name: "MR. DINESH SINGH",
      title: "",
      company: "Reliance Industries",
      image: "/Awards/IMG_6902.JPG"
    },
    {
      award: "SHAKTI AWARD",
      name: "MS. KOMAL SHAH BHUKHANWALA",
      title: "",
      company: "Sumil Industries",
      image: "/Awards/IMG_6906.JPG"
    }
  ];

  const moreWinners = [
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6917.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6921.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6926.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6936.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6940.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6948.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6961.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6965.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6969.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6978.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6981.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6989.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6994.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_6998.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7004.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7014.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7020.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7032.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7037.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7045.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7053.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7061.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7069.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7078.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7084.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7090.JPG" },
    { award: "CATEGORY PENDING", name: "WINNER NAME", title: "TITLE PENDING", company: "Company Pending", image: "/Awards/IMG_7109.JPG" }
  ];

  const displayedWinners = showAll ? [...initialWinners, ...moreWinners] : initialWinners;

  return (
    <section id="last-season-winners" className="relative w-full py-16 min-h-[90vh] flex flex-col justify-center bg-white overflow-hidden">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        
        {/* Header */}
        <div className="relative max-w-7xl mx-auto mb-10 md:mb-12 flex flex-col md:flex-row items-center justify-end px-4 min-h-[80px]">
          <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2 mb-6 md:mb-0 w-full md:w-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center mb-4"
            >
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                Last Season's Winners
              </span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif leading-tight text-brand-dark mb-2 whitespace-nowrap"
            >
              Honouring <span className="text-brand-primary italic">industry legacy.</span>
            </motion.h2>
          </div>
          
          {/* See All Button */}
          <div className="w-full flex justify-center md:justify-end md:w-auto z-10">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-brand-primary text-white text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-brand-dark transition-colors text-center rounded-lg shadow-sm"
            >
              {showAll ? "SEE LESS" : "SEE ALL WINNERS"}
            </motion.button>
          </div>
        </div>

        {/* Winners Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 max-w-7xl mx-auto"
        >
          <AnimatePresence>
            {displayedWinners.map((winner, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={idx}
                className="flex flex-col items-center group w-full pt-6 border-t border-brand-primary/20 hover:border-brand-primary transition-all duration-500"
              >
                {/* Banner */}
                <div className="w-full text-brand-primary text-center font-bold text-[10px] md:text-xs tracking-[0.1em] uppercase mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  {winner.award}
                </div>

                {/* Image Wrapper */}
                <div className="w-full aspect-video relative overflow-hidden rounded-xl shadow-sm mb-4 transition-transform duration-500 group-hover:-translate-y-1">
                  <Image 
                    src={winner.image} 
                    alt={winner.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Name & Details */}
                <div className="text-center w-full mt-2">
                  <h3 className="text-sm md:text-base font-bold text-brand-dark uppercase mb-1 group-hover:text-brand-primary transition-colors duration-300">
                    {winner.name}
                  </h3>
                  {winner.title && (
                    <p className="text-[11px] md:text-xs font-medium text-brand-dark/70 mb-0.5">
                      {winner.title}
                    </p>
                  )}
                  <p className="text-xs font-bold text-brand-dark/80">
                    {winner.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Minimize Button at Bottom */}
        <AnimatePresence>
          {showAll && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-center mt-12"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowAll(false);
                  document.getElementById('last-season-winners')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-brand-primary text-white text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-brand-dark transition-colors text-center rounded-lg shadow-sm flex items-center space-x-2"
              >
                <span>MINIMIZE</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
