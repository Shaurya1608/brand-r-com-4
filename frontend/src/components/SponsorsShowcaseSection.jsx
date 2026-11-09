"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SponsorsShowcaseSection() {
  const topSponsors = [
    {
      category: "Award Sponsor",
      name: "Indofil Industries Limited",
      logo: "/sponsors_2026/indofil.png",
      alt: "Indofil Industries Limited - Award Sponsor",
    },
    {
      category: "Kit Sponsor",
      name: "Crop Care Federation of India (CCFI)",
      logo: "/sponsors_2026/ccfi.png",
      alt: "CCFI - Kit Sponsor",
    },
    {
      category: "Memento Sponsor",
      name: "Bharat Certis AgriScience Ltd.",
      logo: "/sponsors_2026/bca.png",
      alt: "BCA Bharat Certis AgriScience Ltd. - Memento Sponsor",
    },
  ];

  const midSponsors = [
    {
      category: "Lanyard Sponsor",
      name: "Reliance New Energy Bio Energy",
      logo: "/sponsors_2026/reliance.png",
      alt: "Reliance New Energy Bio Energy - Lanyard Sponsor",
    },
    {
      category: "Research Partner",
      name: "Market Insight Consultants",
      logo: "/sponsors_2026/market_insight.png",
      alt: "Market Insight Consultants - Research Partner",
    },
  ];

  const mediaPartners = [
    {
      name: "Krishi Jagran",
      logo: "/sponsors_2026/krishi_jagran.png",
      alt: "Krishi Jagran - Media Partner",
    },
    {
      name: "Pestology",
      logo: "/sponsors_2026/pestology.png",
      alt: "Pestology - Voice of the Agrochemical Industry",
    },
    {
      name: "Krishak Jagat",
      logo: "/sponsors_2026/krishak_jagat.png",
      alt: "Krishak Jagat - Media Partner",
    },
    {
      name: "Fasal Kranti",
      logo: "/sponsors_2026/fasal_kranti.png",
      alt: "Fasal Kranti - Media Partner",
    },
  ];

  const associationPartnersTop = [
    {
      name: "BASAI",
      logo: "/sponsors_2026/basai.png",
      alt: "BASAI - Industry Association Partner",
    },
    {
      name: "ACFI (Agro Chem Federation of India)",
      logo: "/sponsors_2026/acfi.png",
      alt: "ACFI - Agro Chem Federation of India",
    },
    {
      name: "BIPA (BioAgri Input Producers Association)",
      logo: "/sponsors_2026/bipa.png",
      alt: "BIPA - BioAgri Input Producers Association",
    },
  ];

  const associationPartnersBottom = [
    {
      name: "CropLife India",
      logo: "/sponsors_2026/croplife.png",
      alt: "CropLife India - Industry Association Partner",
    },
    {
      name: "AIM (Agro Input Manufacturers Association of India)",
      logo: "/sponsors_2026/aim.png",
      alt: "AIM - Agro Input Manufacturers Association of India",
    },
  ];

  const specialPartners = [
    {
      category: "Agri EdTech Partner",
      name: "SnailsConnect",
      logo: "/sponsors_2026/snailsconnect.png",
      alt: "SnailsConnect - Agri EdTech Partner",
    },
    {
      category: "Podcast Partner",
      name: "The Snail Show",
      logo: "/sponsors_2026/the_snail_show.png",
      alt: "The Snail Show - Podcast Partner",
    },
  ];

  return (
    <section 
      id="sponsors-partners"
      className="relative w-full py-12 md:py-16 bg-[#fbfbf9] border-b border-brand-primary/10 overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-2"
          >
            <div className="h-px w-6 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] md:text-xs font-bold uppercase">
              Brand R.Comm 2026
            </span>
            <div className="h-px w-6 bg-brand-primary" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-brand-dark tracking-tight"
          >
            Sponsors &amp; Partners
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm text-brand-dark/60 mt-2 max-w-xl font-medium"
          >
            Powered by leading industry pioneers collaborating to celebrate agricultural communication, marketing &amp; innovation excellence.
          </motion.p>
        </div>

        {/* ── Tier 1: Award Sponsor, Kit Sponsor, Memento Sponsor (3 columns) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10"
        >
          {topSponsors.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-brand-dark tracking-tight mb-2.5 text-center">
                {item.category}
              </h3>
              <div className="w-full h-24 sm:h-28 md:h-32 bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-brand-primary/50 transition-all duration-300 p-4 flex items-center justify-center group hover:-translate-y-0.5">
                <img
                  src={item.logo}
                  alt={item.alt}
                  className="max-h-12 sm:max-h-14 md:max-h-16 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Tier 2: Lanyard Sponsor & Research Partner (2 columns, centered) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto mb-8 md:mb-10"
        >
          {midSponsors.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-brand-dark tracking-tight mb-2.5 text-center">
                {item.category}
              </h3>
              <div className="w-full h-24 sm:h-28 md:h-32 bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-brand-primary/50 transition-all duration-300 p-4 flex items-center justify-center group hover:-translate-y-0.5">
                <img
                  src={item.logo}
                  alt={item.alt}
                  className="max-h-12 sm:max-h-14 md:max-h-16 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Tier 3: Media Partner (4 columns) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center mb-8 md:mb-10"
        >
          <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-brand-dark tracking-tight mb-2.5 text-center">
            Media Partner
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
            {mediaPartners.map((item, idx) => (
              <div 
                key={idx}
                className="h-20 sm:h-24 md:h-26 bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-brand-primary/50 transition-all duration-300 p-3 sm:p-4 flex items-center justify-center group hover:-translate-y-0.5"
              >
                <img
                  src={item.logo}
                  alt={item.alt}
                  className="max-h-10 sm:max-h-12 md:max-h-14 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Tier 4: Industry Association Partner (Row 1: 3 cards, Row 2: 2 cards centered) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center mb-8 md:mb-10"
        >
          <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-brand-dark tracking-tight mb-2.5 text-center">
            Industry Association Partner
          </h3>
          
          {/* Row 1 (3 items) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full mb-3 sm:mb-4 md:mb-6">
            {associationPartnersTop.map((item, idx) => (
              <div 
                key={idx}
                className="h-20 sm:h-24 md:h-26 bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-brand-primary/50 transition-all duration-300 p-3 sm:p-4 flex items-center justify-center group hover:-translate-y-0.5"
              >
                <img
                  src={item.logo}
                  alt={item.alt}
                  className="max-h-10 sm:max-h-12 md:max-h-14 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Row 2 (2 items, centered) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full max-w-2xl mx-auto">
            {associationPartnersBottom.map((item, idx) => (
              <div 
                key={idx}
                className="h-20 sm:h-24 md:h-26 bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-brand-primary/50 transition-all duration-300 p-3 sm:p-4 flex items-center justify-center group hover:-translate-y-0.5"
              >
                <img
                  src={item.logo}
                  alt={item.alt}
                  className="max-h-10 sm:max-h-12 md:max-h-14 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Tier 5: Agri EdTech Partner & Podcast Partner (2 columns centered) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto"
        >
          {specialPartners.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-brand-dark tracking-tight mb-2.5 text-center">
                {item.category}
              </h3>
              <div className="w-full h-24 sm:h-28 md:h-30 bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-brand-primary/50 transition-all duration-300 p-4 flex items-center justify-center group hover:-translate-y-0.5">
                <img
                  src={item.logo}
                  alt={item.alt}
                  className="max-h-12 sm:max-h-14 md:max-h-16 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
