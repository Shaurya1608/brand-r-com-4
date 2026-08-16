"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PastEditionsSection() {
  const previewImages = [
    "/Glimpse/1.JPG",
    "/Glimpse/2.JPG",
    "/Glimpse/3.JPG",
    "/Glimpse/4.JPG",
    "/Glimpse/5.JPG",
  ];
  
  const allImages = [
    "1.JPG", "2.JPG", "3.JPG", "4.JPG", "5.JPG", "6.JPG", "7.JPG", "8.JPG", "IMG_3991.JPG", "IMG_4078.JPG", "IMG_4083.JPG", "IMG_4105.JPG", "IMG_4188.JPG", "IMG_4202.JPG", "IMG_5510.JPG", "IMG_5521.JPG", "IMG_5525.JPG", "IMG_5536.JPG", "IMG_5557.JPG", "IMG_5559.JPG", "IMG_5560.JPG", "IMG_5562.JPG", "IMG_5563.JPG", "IMG_5569.JPG", "IMG_5684.JPG", "IMG_5723.JPG", "IMG_5738.JPG", "IMG_5745.JPG", "IMG_5775.JPG", "IMG_5809.JPG", "IMG_6181.JPG", "IMG_6261.JPG", "IMG_6274.JPG", "IMG_6595.JPG", "IMG_6598.JPG", "IMG_6623.JPG", "IMG_6625.JPG", "IMG_7163.JPG", "IMG_7166.JPG", "IMG_7177.JPG", "IMG_7188.JPG", "IMG_7191.JPG", "IMG_7193.JPG", "IMG_7198.JPG"
  ].map(name => `/Glimpse/${name}`);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stop body scroll when modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

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
          {previewImages.map((src, index) => (
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
          <motion.div
            onClick={() => setIsModalOpen(true)}
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
          </motion.div>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-white">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white"
            />
            
            {/* Modal Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0">
              <div>
                <h3 className="font-serif text-2xl text-brand-dark">Event Gallery</h3>
                <p className="text-xs text-brand-dark/60 font-medium mt-1 uppercase tracking-widest">{allImages.length} Photos</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Optimized Grid with Next.js Image */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-[1400px] mx-auto pb-10">
                {allImages.map((src, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "50px" }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group bg-gray-200"
                  >
                    <Image 
                      src={src} 
                      alt={`Gallery Image ${index + 1}`} 
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      quality={60}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </div>
            
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f8fafc;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 10px;
                border: 2px solid #f8fafc;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
            `}</style>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
