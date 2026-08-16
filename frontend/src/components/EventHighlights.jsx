"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventHighlights() {
  const [showAll, setShowAll] = useState(false);

  const highlights = [
    {
      moment: "MOMENT 01",
      title: "Inaugural Session",
      description: "Kickstart the summit with an inspiring inaugural session featuring industry leaders, policymakers, and distinguished guests who will set the stage for meaningful discussions on the future of agriculture and rural communication.",
      image: "/BRC Images/Inaugural Session.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 02",
      title: "Marquee Panel Discussions",
      description: "Engage in thoughtfully curated panel discussions covering key topics such as marketing, media, communication, sustainability, agritech, innovation, and policy, with insights from renowned industry experts.",
      image: "/BRC Images/Marquee Panel.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 03",
      title: "Brand Presentations",
      description: "Discover impactful brand stories, innovative campaigns, product launches, and successful communication strategies presented by leading organizations from the agriculture and allied sectors.",
      image: "/BRC Images/IMG_5845.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 04",
      title: "Networking Lunch",
      description: "Enjoy a relaxed networking lunch where delegates, speakers, partners, and industry professionals can connect, exchange ideas, and explore new business opportunities in an informal setting.",
      image: "/BRC Images/dinner.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 05",
      title: "CEO Forum",
      description: "Join an exclusive leadership forum where industry leaders, founders, CEOs, and managing directors share their perspectives on emerging opportunities, business challenges, and the future of rural India.",
      image: "/BRC Images/IMG_6637.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 06",
      title: "Networking Tea",
      description: "Take a refreshing networking break over tea and refreshments while continuing conversations, strengthening relationships, and meeting fellow participants from across the agriculture ecosystem.",
      image: "/BRC Images/Tea.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 07",
      title: "Awards Ceremony",
      description: "Celebrate excellence in agriculture and rural communication as outstanding brands, organizations, campaigns, and professionals are recognized for their remarkable contributions to the industry.",
      image: "/BRC Images/Top hero section img.JPG",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 08",
      title: "Cultural Night",
      description: "Experience an engaging cultural evening featuring captivating performances that celebrate India's rich heritage while creating a memorable atmosphere for networking and camaraderie.",
      image: "/BRC Images/Stories by Mehak Mirza Prabhu.jpeg",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    {
      moment: "MOMENT 09",
      title: "Celebration Dinner",
      description: "Conclude the day with an elegant networking dinner, providing the perfect opportunity to build meaningful relationships, exchange ideas, and connect with industry peers in a relaxed setting.",
      image: "/BRC Images/image.png",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      )
    },
    {
      moment: "MOMENT 10",
      title: "Concierge Networking",
      description: "Make valuable business connections through curated networking opportunities designed to facilitate meaningful conversations, strategic collaborations, and long-term partnerships.",
      image: "/BRC Images/image copy.png",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const visibleHighlights = showAll ? highlights : highlights.slice(0, 1);

  return (
    <section id="highlights" className={`relative w-full flex items-center py-12 md:py-16 overflow-hidden flex-col justify-center`}>
      
      {/* Light theme background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      {/* Vertical Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-evenly opacity-100 z-0">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden lg:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 w-full bg-brand-surface/90 backdrop-blur-md rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-[0_0_40px_20px_rgba(232,239,222,0.8)]">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center mb-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center space-x-4 mb-4"
          >
            <div className="h-px w-10 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Event Highlights
            </span>
            <div className="h-px w-10 bg-brand-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.1] text-brand-dark">
              Twelve hours engineered to compress <br className="hidden md:block" />
              <span className="italic text-brand-primary">a quarter.</span>
            </h2>
          </motion.div>
        </div>

        {/* Staggered Timeline Layout */}
        <div className="relative w-full pb-10">
          
          {/* Central Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-primary/20 -translate-x-1/2 z-0" />
          
          <div className="flex flex-col gap-8 md:gap-16 relative z-10">
            <AnimatePresence>
            {visibleHighlights.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`w-full flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-0 ${isEven ? '' : 'md:flex-row-reverse'}`}
                >
                  
                  {/* Glowing timeline dot (Desktop only) */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="hidden md:block absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_15px_rgba(var(--brand-primary),0.4)] -translate-x-1/2 -translate-y-1/2 z-10"
                  />

                  {/* Highlight Text */}
                  <div className="w-full md:w-[40%] lg:w-[36%]">
                    <div className="group relative transition-all duration-500 pt-6 border-t border-brand-primary/20 hover:border-brand-primary">
                      
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-brand-dark/50 font-mono text-[9px] tracking-[0.2em] uppercase">
                            {item.moment}
                          </span>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-serif text-brand-dark mb-2 group-hover:text-brand-primary transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unique Image Block */}
                  <div className="w-full md:w-[40%] lg:w-[36%] h-32 md:h-48 rounded-[1rem] overflow-hidden relative group transition-all duration-700 border border-brand-primary/10 hover:border-brand-primary/30">
                    <img 
                      src={item.image || "/landing/IMG_5631.JPG"} 
                      alt={item.title}
                      className="object-cover w-full h-full hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    {/* Subtle overlay on the image */}
                    <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                  
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-16 relative z-20">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-brand-primary text-white rounded-full font-bold shadow-lg hover:shadow-brand-primary/50 hover:-translate-y-1 transition-all duration-300"
            >
              {showAll ? "View Less" : "View All Highlights"}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
