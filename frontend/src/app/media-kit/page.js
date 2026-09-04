"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { motion } from "framer-motion";

export default function MediaKit() {
  const brandLogos = [
    {
      name: "Brand R.Comm Official Logo",
      src: "/logo/New nrc logo.png",
      info: "PNG Vector • High Res",
      downloadName: "Brand_R_Comm_2026_Official_Logo.png"
    },
    {
      name: "Brand R.Comm Logo - Dark Horizontal",
      src: "/logo/brand-r-comm-logo.png",
      info: "PNG Vector • High Res",
      downloadName: "Brand_R_Comm_Horizontal_Dark.png"
    },
    {
      name: "Brand R.Comm Logo - Light Horizontal",
      src: "/logo/brand-r-comm-logo-2.png",
      info: "PNG Vector • High Res",
      downloadName: "Brand_R_Comm_Horizontal_Light.png"
    },
    {
      name: "Brand R.Comm Season 3 Logo",
      src: "/logo/Brand R.Comm 3 final logo-02.png",
      info: "PNG Vector • High Res",
      downloadName: "Brand_R_Comm_Season_3_Logo.png"
    }
  ];

  const snailLogos = [
    {
      name: "Snail Integral Official Logo",
      src: "/logo/Snail-New-logo-01-scaled.png",
      info: "PNG Vector • High Res",
      downloadName: "Snail_Integral_Official_Logo.png"
    },
    {
      name: "Snail Connect Logo",
      src: "/logo/Snail Connect final logo-01.png",
      info: "PNG Vector • High Res",
      downloadName: "Snail_Connect_Logo.png"
    },
    {
      name: "Snail Integral Logo - Option A",
      src: "/logo/Snail Integral New Logo-03.png",
      info: "PNG Vector • High Res",
      downloadName: "Snail_Integral_Logo_Alt1.png"
    },
    {
      name: "Snail Integral Logo - Option B",
      src: "/logo/Snail Integral New Logo-06.png",
      info: "PNG Vector • High Res",
      downloadName: "Snail_Integral_Logo_Alt2.png"
    },
    {
      name: "Snail Integral Logo - Option C",
      src: "/logo/Snail Integral New Logo-09.png",
      info: "PNG Vector • High Res",
      downloadName: "Snail_Integral_Logo_Alt3.png"
    }
  ];

  const brochures = [
    {
      title: "Brand R.Comm 2026 Official Brochure",
      pdf: "/brouchers/Updated BRC 4 2026 Brochure.pdf",
      description: "Detailed event brochure containing the summit overview, speaker details, schedule sessions, and participation guidelines.",
      downloadName: "Brand_R_Comm_2026_Brochure.pdf"
    },
    {
      title: "Brand R.Comm 2026 Awards Brochure",
      pdf: "/brouchers/Updated BRC 4 Award Brochure.pdf",
      description: "Guidelines and criteria covering award categories, eligibility rules, jury profiles, and submission instructions.",
      downloadName: "Brand_R_Comm_2026_Awards_Brochure.pdf"
    },
    {
      title: "Brand R.Comm 2026 Sponsorship Deliverables",
      pdf: "/brouchers/Updated Sponsorship Package BRC 2026.pdf",
      description: "Explore sponsorship options, premium branding categories, booth allocation maps, and partner benefits.",
      downloadName: "Brand_R_Comm_2026_Sponsorship_Package.pdf"
    },
    {
      title: "Snail Integral Corporate Profile 2026",
      pdf: "/brouchers/Snail Brochure 2026.pdf",
      description: "Snail Integral's capability deck covering our PR services, corporate communication solutions, and rural outreach strategy.",
      downloadName: "Snail_Integral_Corporate_Brochure.pdf"
    }
  ];

  // Motion Animation Presets
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true, margin: "-100px" }
  };

  return (
    <main className="min-h-screen bg-brand-surface text-brand-dark font-sans selection:bg-brand-primary selection:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen pt-28 pb-16 flex items-center justify-center bg-gradient-to-br from-brand-primary via-brand-primary-hover to-[#2b4215] overflow-hidden text-center">
        {/* Subtle grid texture */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }} 
        />
        {/* Decorative glowing background mesh */}
        <div className="absolute -top-[20%] -left-[10%] w-[55%] h-[55%] bg-white/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[55%] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight mb-4 drop-shadow-md">
              BRAND R.COMM 2026 <br />
              <span className="text-[#ebd382] italic font-medium drop-shadow-sm pr-1">Media Kit</span>
            </h1>
          </motion.div>

          {/* Gold Diamond Separator */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center my-6 gap-3 mx-auto"
          >
            <div className="h-px bg-white/20 flex-grow" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#ebd382]" />
            <div className="h-px bg-white/20 flex-grow" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-sans leading-relaxed mb-10"
          >
            Official graphics, banners & logos for sponsors, partners, exhibitors, delegates and speakers.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md text-[11px] sm:text-xs text-white/95 font-bold tracking-wider uppercase shadow-lg shadow-black/10"
          >
            <svg className="w-4 h-4 text-[#ebd382] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Click any image or button to download files
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[9px] font-sans tracking-[0.35em] text-white/60 uppercase mb-2 font-bold select-none">Explore</span>
          <div className="w-[1.5px] h-10 bg-gradient-to-b from-[#ebd382] to-transparent animate-pulse" />
        </div>
      </section>

      {/* Section 01: Logos */}
      <section id="logos" className="py-24 md:py-32 bg-[#FAF9F6] border-b border-brand-primary/10 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <motion.div 
            {...fadeInUp}
            className="border-l-4 border-brand-primary pl-4 mb-16"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary/95 block mb-1">Section 01</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark font-bold leading-tight">Logos</h2>
            <p className="text-sm text-brand-dark/60 mt-1 font-medium">For Sponsors, Partners, Exhibitors, Delegates and Speakers use.</p>
          </motion.div>

          {/* Brand R.Comm Sub-grid */}
          <div className="mb-20">
            <motion.h3 
              {...fadeInUp}
              className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-8 border-b border-brand-primary/10 pb-2.5"
            >
              BRAND R.COMM Logos
            </motion.h3>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {brandLogos.map((logo, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl p-5 border border-brand-primary/5 shadow-sm hover:shadow-xl hover:border-brand-primary/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center group relative overflow-hidden"
                >
                  {/* Checkerboard transparency grid background */}
                  <a 
                    href={logo.src} 
                    download={logo.downloadName} 
                    className="h-32 w-full flex items-center justify-center bg-[radial-gradient(#e2ecdb_1.2px,transparent_1.2px)] [background-size:12px_12px] bg-brand-surface/20 rounded-xl p-4 mb-4 relative overflow-hidden cursor-pointer hover:bg-brand-surface/40 transition-colors"
                    title={`Download ${logo.name}`}
                  >
                    <img 
                      src={logo.src} 
                      alt={logo.name} 
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 select-none" 
                    />
                    <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white" />
                  </a>
                  <div className="text-center w-full flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-brand-dark tracking-wide uppercase mb-1 leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">{logo.name}</h4>
                      <p className="text-[10px] text-brand-dark/50 mb-4">{logo.info}</p>
                    </div>
                    <a 
                      href={logo.src} 
                      download={logo.downloadName} 
                      className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-[11px] font-bold py-2.5 px-4 rounded-xl w-full transition-all duration-300 shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      DOWNLOAD PNG
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Snail Integral Sub-grid */}
          <div>
            <motion.h3 
              {...fadeInUp}
              className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-8 border-b border-brand-primary/10 pb-2.5"
            >
              Snail Integral Logos
            </motion.h3>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
            >
              {snailLogos.map((logo, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl p-5 border border-brand-primary/5 shadow-sm hover:shadow-xl hover:border-brand-primary/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center group relative overflow-hidden"
                >
                  <a 
                    href={logo.src} 
                    download={logo.downloadName} 
                    className="h-32 w-full flex items-center justify-center bg-[radial-gradient(#e2ecdb_1.2px,transparent_1.2px)] [background-size:12px_12px] bg-brand-surface/20 rounded-xl p-4 mb-4 relative overflow-hidden cursor-pointer hover:bg-brand-surface/40 transition-colors"
                    title={`Download ${logo.name}`}
                  >
                    <img 
                      src={logo.src} 
                      alt={logo.name} 
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 select-none" 
                    />
                  </a>
                  <div className="text-center w-full flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-brand-dark tracking-wide uppercase mb-1 leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">{logo.name}</h4>
                      <p className="text-[10px] text-brand-dark/50 mb-4">{logo.info}</p>
                    </div>
                    <a 
                      href={logo.src} 
                      download={logo.downloadName} 
                      className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-[11px] font-bold py-2.5 px-4 rounded-xl w-full transition-all duration-300 shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      DOWNLOAD PNG
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* Section 02: Social Media Graphic Templates (LinkedIn Feed Mockup) */}
      <section id="social-templates" className="py-24 md:py-32 bg-white border-b border-brand-primary/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <motion.div 
            {...fadeInUp}
            className="border-l-4 border-brand-primary pl-4 mb-16"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary/95 block mb-1">Section 02</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark font-bold leading-tight">Social Media <span className="text-brand-primary italic">Graphic Templates</span></h2>
            <p className="text-sm text-brand-dark/60 mt-1 font-medium">Ready-to-post templates for LinkedIn, Instagram, Facebook & more.</p>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            className="max-w-md mx-auto bg-white rounded-3xl p-5 border border-brand-primary/10 shadow-sm hover:shadow-xl hover:border-brand-primary/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center group relative overflow-hidden"
          >
            {/* Clickable Image Preview with Dot Grid Background */}
            <a 
              href="/NewDelegate Templates.png" 
              download="Brand_R_Comm_2026_Social_Template.png" 
              className="h-64 sm:h-72 w-full flex items-center justify-center bg-[radial-gradient(#e2ecdb_1.2px,transparent_1.2px)] [background-size:12px_12px] bg-brand-surface/20 rounded-2xl p-3 mb-4 relative overflow-hidden cursor-pointer hover:bg-brand-surface/40 transition-colors"
              title="Download Social Template"
            >
              <img 
                src="/NewDelegate Templates.png" 
                alt="Brand R.Comm Social Template" 
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 select-none rounded-lg shadow-sm" 
              />
              {/* Premium hover download overlay */}
              <div className="absolute inset-0 bg-[#0d2d18]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <svg className="w-8 h-8 text-[#ebd382] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </a>

            <div className="text-center w-full flex flex-col flex-grow justify-between">
              <div>
                <h4 className="text-xs font-bold text-brand-dark tracking-wide uppercase mb-1 leading-tight group-hover:text-brand-primary transition-colors">
                  BRAND R.COMM 2026 SOCIAL TEMPLATE
                </h4>
                <p className="text-[10px] text-brand-dark/50 mb-4">1080 × 1080 px • High-Res PNG</p>
              </div>
              <a 
                href="/NewDelegate Templates.png" 
                download="Brand_R_Comm_2026_Social_Template.png" 
                className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-[11px] font-bold py-2.5 px-4 rounded-xl w-full transition-all duration-300 shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20 uppercase"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                DOWNLOAD TEMPLATE
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Section 03: Brochures */}
      <section id="brochures" className="py-24 md:py-32 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <motion.div 
            {...fadeInUp}
            className="border-l-4 border-brand-primary pl-4 mb-16"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary/95 block mb-1">Section 03</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark font-bold leading-tight">Official <span className="text-brand-primary italic">Brochures</span></h2>
            <p className="text-sm text-brand-dark/60 mt-1 font-medium">Official event brochures, award guides, and corporate packs used across Snail and Brand R.Comm websites.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {brochures.map((brochure, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-3xl p-6 md:p-8 border border-brand-primary/10 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8 group hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300 relative overflow-hidden"
              >
                {/* Booklet styled icon container */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-brand-surface/30 border border-brand-primary/10 flex items-center justify-center text-brand-primary/80 shrink-0 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <svg className="w-10 md:w-12 h-10 md:h-12 drop-shadow-[0_1px_4px_rgba(106,154,56,0.15)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    <path stroke="url(#green-grad)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 8h3M7 11h3M7 14h3M14 8h3M14 11h3M14 14h3" />
                    <defs>
                      <linearGradient id="green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6a9a38" />
                        <stop offset="100%" stopColor="#557d2a" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Brochure Metadata */}
                <div className="flex-grow text-center md:text-left flex flex-col justify-between h-full relative z-10">
                  <div>
                    <span className="text-[9px] font-bold text-brand-primary tracking-widest uppercase block mb-1">PDF • Official Document</span>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-brand-dark leading-snug mb-2 group-hover:text-brand-primary transition-colors">{brochure.title}</h3>
                    <p className="text-xs text-brand-dark/65 leading-relaxed font-sans font-normal mb-6">{brochure.description}</p>
                  </div>
                  <a 
                    href={brochure.pdf} 
                    download={brochure.downloadName} 
                    className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold py-3 px-5 rounded-full w-full md:w-fit transition-all duration-300 shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    DOWNLOAD PDF
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
    </main>
  );
}
