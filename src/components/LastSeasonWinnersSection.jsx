"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LastSeasonWinnersSection() {
  const [showAll, setShowAll] = useState(false);

  const initialWinners = [
    { isHeading: true, text: "JURY-BASED AWARDS: HONOURING INDUSTRY LEADERSHIP AND LEGACY", gridClass: "col-span-1 md:col-span-2 lg:col-span-6" },
    {
      award: "LIFETIME ACHIEVEMENT AWARD",
      name: "DR. R. G. AGARWAL",
      title: "Chairman Emeritus",
      company: "Dhanuka Agritech LTD.",
      image: "/Awards/IMG_7090.JPG"
    },
    {
      award: "GROWTH CATALYST AWARD",
      name: "MR. DINESH SINGH",
      title: "",
      company: "Reliance Industries",
      image: "/Awards/IMG_7032.JPG"
    },
    {
      award: "SHAKTI AWARD",
      name: "MS. KOMAL SHAH BHUKHANWALA",
      title: "",
      company: "Sumil Industries",
      image: "/Awards/IMG_7037.JPG"
    }
  ];

  const moreWinners = [
    { award: "VISIONARY ENTREPRENEUR AWARD", name: "DR. MANOJ KUMAR RUPA", title: "", company: "Capsber Agriscience", image: "/Awards/IMG_7045.JPG" },
    { award: "PIONEER AWARD", name: "MR. DEBABRATA SARKAR", title: "", company: "MicroAlgae Solutions India", image: "/Awards/IMG_7053.JPG" },
    { award: "CHANGEMAKER AWARD", name: "MR. MANOJ VARSHNEY", title: "", company: "IFFCO-MC Crop Sciences", image: "/Awards/IMG_7061.JPG" },
    { award: "POLICY DRIVER AWARD", name: "MR. RAJVIR SINGH RATHI", title: "", company: "Bayer CropScience", image: "/Awards/IMG_7069.JPG" },
    { award: "VOICE OF THE YEAR", name: "MR. ANKUR AGGARWAL", title: "", company: "Crystal Crop Protection", image: "/Awards/IMG_7078.JPG" },
    { award: "NEXTGEN SEED AWARD", name: "SAVANNAH SEEDS PVT. LTD.", title: "", company: "", image: "/Awards/IMG_7084.JPG" },
    { award: "SUSTAINABILITY CHAMPION AWARD", name: "ZYDEX INDUSTRIES", title: "", company: "", image: "/Awards/IMG_7020.JPG", gridClass: "lg:col-start-3 lg:col-span-2" },
    { isHeading: true, text: "NOMINATION-BASED AWARDS: CELEBRATING CAMPAIGN AND CORPORATE EXCELLENCE", gridClass: "col-span-1 md:col-span-2 lg:col-span-6" },
    { award: "COMPANY OF THE YEAR", name: "ARIES AGRO LIMITED", title: "", company: "", image: "/Awards/IMG_7014.JPG" },
    { award: "EMERGING COMPANY OF THE YEAR", name: "BHARAT CERTIS AGRISCIENCE LTD.", title: "", company: "", image: "/Awards/IMG_6948.JPG" },
    { award: "BEST RURAL ENGAGEMENT", name: "GENCREST BIO PRODUCTS", title: "", company: "", image: "/Awards/image.png" },
    { award: "BEST PR CAMPAIGN", name: "INSECTICIDES INDIA LIMITED", title: "", company: "", image: "/Awards/IMG_6902.JPG" },
    { award: "BEST DIGITAL MARKETING AWARD", name: "JU AGRI SCIENCES", title: "", company: "", image: "/Awards/IMG_6906.JPG" },
    { award: "BEST BRAND CAMPAIGN (TVC)", name: "UPL SAS LIMITED", title: "", company: "", image: "/Awards/IMG_6917.JPG" },
    { award: "BEST INTEGRATED COMMUNICATION AWARD", name: "ICL INDIA", title: "", company: "", image: "/Awards/IMG_6921.JPG" },
    { award: "BEST OUTDOOR CAMPAIGN", name: "VARSHA BIOSCIENCE & TECHNOLOGY", title: "", company: "", image: "/Awards/IMG_6890.JPG" },
    { award: "BEST COMMUNICATOR (MALE)", name: "MR. R.K. GOYAL", title: "", company: "VERDESIAN USA", image: "/Awards/IMG_6926.JPG" },
    { award: "BEST COMMUNICATOR (FEMALE)", name: "MS. SARITA BAHL", title: "", company: "", image: "/Awards/IMG_6936.JPG", gridClass: "lg:col-start-2 lg:col-span-2" },
    { award: "AI LEADERSHIP EXCELLENCE", name: "COROMANDEL INTERNATIONAL LIMITED", title: "(CROP PROTECTION CHEMICALS)", company: "", image: "/Awards/IMG_6940.JPG", gridClass: "lg:col-span-2" }
  ];

  const displayedWinners = showAll ? [...initialWinners, ...moreWinners] : initialWinners;

  return (
    <section id="last-season-winners" className="relative w-full py-16 min-h-[90vh] flex flex-col justify-center bg-white overflow-hidden">
      
      {/* Background Vertical Lines removed */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        
        {/* Header */}
        <div className="relative max-w-7xl mx-auto mb-4 md:mb-6 flex flex-col md:flex-row items-center justify-end px-4 min-h-[80px]">
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
              className="text-4xl md:text-5xl font-serif leading-tight text-brand-dark mb-2 whitespace-normal md:whitespace-nowrap"
            >
              Honouring <span className="text-brand-primary italic">industry <br className="sm:hidden" /> legacy.</span>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-10 gap-y-14 max-w-7xl mx-auto"
        >
          <AnimatePresence>
            {displayedWinners.map((winner, idx) => {
              const defaultGridClass = "col-span-1 md:col-span-1 lg:col-span-2";
              const itemGridClass = winner.gridClass || defaultGridClass;

              if (winner.isHeading) {
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    key={`heading-${idx}`}
                    className={`${itemGridClass} flex items-center justify-center w-full mt-4 mb-6`}
                  >
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent to-brand-primary/20 hidden md:block"></div>
                    <div className="px-4 md:px-8 text-center">
                      <h3 className="text-xs md:text-sm font-bold tracking-widest uppercase flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                        {winner.text.includes(':') ? (
                          <>
                            <span className="text-brand-primary bg-brand-primary/10 px-4 py-1.5 rounded-full shadow-sm border border-brand-primary/10">
                              {winner.text.split(':')[0].trim()}
                            </span>
                            <span className="hidden md:inline text-brand-primary/40">✦</span>
                            <span className="text-brand-dark">
                              {winner.text.split(':')[1].trim()}
                            </span>
                          </>
                        ) : (
                          <span className="text-brand-dark">{winner.text}</span>
                        )}
                      </h3>
                    </div>
                    <div className="flex-grow h-px bg-gradient-to-l from-transparent to-brand-primary/20 hidden md:block"></div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={idx}
                  className={`flex flex-col items-center group w-full pt-6 border-t border-brand-primary/20 hover:border-brand-primary transition-all duration-500 ${itemGridClass}`}
                >
                  {/* Banner */}
                <div className="w-full text-brand-primary text-center font-bold text-[10px] md:text-xs tracking-[0.1em] uppercase mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  {winner.award}
                </div>

                {/* Image Wrapper */}
                <div className="w-full aspect-video relative overflow-hidden rounded-xl shadow-sm mb-4 transition-transform duration-500 group-hover:-translate-y-1 bg-brand-primary/5 flex items-center justify-center">
                  {winner.image ? (
                    <Image 
                      src={winner.image} 
                      alt={winner.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <span className="text-brand-primary/40 font-semibold text-xs tracking-widest uppercase">No Image</span>
                  )}
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
              );
            })}
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
