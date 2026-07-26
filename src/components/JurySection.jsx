"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function JurySection() {
  const members = [
    {
      name: "Dr. KC Ravi",
      lines: [
        "Chief Sustainability Officer",
        "Syngenta India Limited"
      ],
      image: "/jury/Dr. KC Ravi.png"
    },
    {
      name: "Rajvir Singh Rathi",
      lines: [
        "Director - Agricultural Affairs",
        "& Policy, IM - IBSL",
        "Lead - Traits Licensing Business"
      ],
      image: "/jury/Rajvir.png"
    },
    {
      name: "Dr. Sanjay Nagi",
      lines: [
        "Founder & MD,",
        "Market Insight Consultant"
      ],
      image: "/jury/sanjay.png"
    },
    {
      name: "Mr. Dinesh Singh",
      lines: [
        "Business Head-Fertilizer",
        "Reliance Industries Limited"
      ],
      image: "/jury/dinesh.png"
    },
    {
      name: "Dr. VV Sadamate",
      lines: [
        "Agri Ext. Specialist",
        "& Former Advisor, GOI"
      ],
      image: "/jury/sadamate.png"
    }
  ];

  return (
    <section className="relative w-full bg-white py-12 md:py-16 overflow-hidden">
      
      {/* Vertical Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-evenly opacity-100 z-0">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden lg:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Header Layout */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="max-w-4xl flex flex-col items-center bg-white/80 backdrop-blur-md p-6 rounded-3xl relative z-10 shadow-[0_0_40px_20px_rgba(255,255,255,0.8)]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary/50" />
              <span className="text-brand-primary tracking-[0.25em] text-[10px] font-bold uppercase">
                THE JURY PANEL
              </span>
              <div className="h-px w-8 bg-brand-primary/50" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl"
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-brand-dark mb-4 leading-[1.1]">
                An independent jury. <span className="text-brand-primary italic block sm:inline mt-2 sm:mt-0">Zero conflicts.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mt-2 mb-6"
            >
              <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed font-sans">
                Our jury is composed of academic chairs, former public-sector leaders and independent editors — none of whom hold active commercial ties to any nominee. Every submission is evaluated on merit alone.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Chairman & Co-Chair Enhanced */}
        <div className="flex flex-row justify-center items-start gap-4 sm:gap-12 md:gap-20 mt-12 md:mt-16 mb-16 md:mb-20 relative px-1">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Chairman */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-[140px] sm:w-[160px] md:w-[190px] flex flex-col items-center text-center group cursor-pointer relative z-10"
          >
            <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-5">
              <div className="h-px w-3 md:w-5 bg-brand-primary/40" />
              <h3 className="text-[10px] md:text-sm font-bold font-sans text-brand-primary tracking-[0.2em] uppercase">Chairman</h3>
              <div className="h-px w-3 md:w-5 bg-brand-primary/40" />
            </div>
            <div className="relative w-full aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-5 ring-2 ring-brand-primary/20 shadow-lg shadow-brand-dark/5 transition-all duration-500 group-hover:ring-brand-primary/50 group-hover:shadow-2xl group-hover:shadow-brand-primary/20 group-hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img src="/jury/chairman.png" alt="Dr. RB Singh" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="w-full flex flex-col items-center text-center transition-transform duration-500 group-hover:-translate-y-1">
              <h4 className="text-[16px] sm:text-[20px] md:text-[24px] font-serif font-bold text-brand-dark mb-1.5">Dr. RB Singh</h4>
              <p className="text-[11px] sm:text-[13px] md:text-[14px] text-brand-dark/70 font-medium leading-[1.2] md:leading-relaxed">Former Chancellor,</p>
              <p className="text-[11px] sm:text-[13px] md:text-[14px] text-brand-dark/70 font-medium leading-[1.2] md:leading-relaxed">CAU, Imphal</p>
            </div>
          </motion.div>

          {/* Co-Chair */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-[140px] sm:w-[160px] md:w-[190px] flex flex-col items-center text-center group cursor-pointer relative z-10"
          >
            <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-5">
              <div className="h-px w-3 md:w-5 bg-brand-primary/40" />
              <h3 className="text-[10px] md:text-sm font-bold font-sans text-brand-primary tracking-[0.2em] uppercase">Co-Chair</h3>
              <div className="h-px w-3 md:w-5 bg-brand-primary/40" />
            </div>
            <div className="relative w-full aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-5 ring-2 ring-brand-primary/20 shadow-lg shadow-brand-dark/5 transition-all duration-500 group-hover:ring-brand-primary/50 group-hover:shadow-2xl group-hover:shadow-brand-primary/20 group-hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img src="/jury/image.png" alt="Dr. Arvind Kumar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="w-full flex flex-col items-center text-center transition-transform duration-500 group-hover:-translate-y-1">
              <h4 className="text-[16px] sm:text-[20px] md:text-[24px] font-serif font-bold text-brand-dark mb-1.5">Dr. Arvind Kumar</h4>
              <p className="text-[11px] sm:text-[13px] md:text-[14px] text-brand-dark/70 font-medium leading-[1.2] md:leading-relaxed">Former VC, RLBCAU,</p>
              <p className="text-[11px] sm:text-[13px] md:text-[14px] text-brand-dark/70 font-medium leading-[1.2] md:leading-relaxed">Jhansi</p>
            </div>
          </motion.div>
        </div>

        {/* Members Enhanced */}
        <div className="flex flex-col items-center mt-12 pb-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center w-full mb-10"
          >
            <div className="h-px w-full max-w-[150px] bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent mb-5" />
            <h3 className="text-lg md:text-xl font-serif text-brand-dark/80 italic">Esteemed Members</h3>
          </motion.div>

          <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12">
            {members.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="w-[115px] md:w-[135px] flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 ring-1 ring-brand-primary/20 shadow-md shadow-brand-dark/5 transition-all duration-300 group-hover:ring-brand-primary/40 group-hover:shadow-xl group-hover:shadow-brand-primary/10 group-hover:-translate-y-1.5">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="w-full flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
                  <h4 className="text-[14px] md:text-[16px] font-bold text-brand-dark mb-1.5 font-serif">{member.name}</h4>
                  {member.lines.map((line, i) => (
                    <p key={i} className="text-[11px] md:text-[12px] text-brand-dark/60 font-medium leading-[1.3]">{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
