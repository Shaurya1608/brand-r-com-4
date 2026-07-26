"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SpeakersSection() {
  const [showAll, setShowAll] = useState(false);

  const speakers = [
    { name: "Shri Parshottam Rupala", designation: "Hon'ble Former Union", company: "Cabinet Minister, GOI" },
    { name: "Dr. P.K. Singh", designation: "Agriculture Commissioner,", company: "Government of India" },
    { name: "Dr. Rajarshi Roy Burman", designation: "ADG (Agri. Extension),", company: "ICAR" },
    { name: "Dr. RB Singh", designation: "Former Chancellor,", company: "CAU, Imphal" },
    { name: "Dr. Arvind Kumar", designation: "Former VC, RLBCAU,", company: "Jhansi" },
    { name: "Deepak Shah", designation: "CMD,", company: "SML Group" },
    { name: "Mr. Ajeet Chahal", designation: "Founder and CEO", company: "CropNXT Solutions Pvt. Ltd." },
    { name: "Raj Kumar Gupta", designation: "MD,", company: "Thakar Chemicals Ltd." },
    { name: "Mr. Augusto Rodriguez-Villa", designation: "President", company: "Phoenix Biosolutions & Agrolink Brasil" },
    { name: "Rajesh Aggarwal", designation: "Managing Director,", company: "Insecticide India Ltd." },
    { name: "Rajvir Singh Rathi", designation: "Director - Agricultural Affairs & Policy, IM - IBSL", company: "Lead - Traits Licensing Business" },
    { name: "Vijay Sardana", designation: "Advocate,", company: "Supreme Court of India" },
    { name: "Dr. Ajay Ranka", designation: "Chairman & MD", company: "Zydex Group" },
    { name: "Dr. KC Ravi", designation: "Chief Sustainability Officer", company: "Syngenta India Limited" },
    { name: "Vipin Saini", designation: "CEO,", company: "BASAI" },
    { name: "Sumit Gupta", designation: "Director (Project),", company: "Thakar Chemicals Ltd" },
    { name: "Sunil Sihag", designation: "Managing Director,", company: "Synergy Technofin Pvt. Ltd." },
    { name: "Vivek Mittal", designation: "Director,", company: "Thakar Chemicals Ltd." },
    { name: "Dharmesh Gupta", designation: "Managing Director", company: "Dhanesha Crop Sciences Pvt. Ltd" },
    { name: "Takuya Fukunaga", designation: "Jt. CEO,", company: "IFFCO - MC Crop Science" },
    { name: "Ms. Komal Shah", designation: "Director - R&D and IP", company: "SML Limited" },
    { name: "Dr. Rajeev Dwivedi", designation: "Business Manager South Asia,", company: "Novonosis" },
    { name: "Mr. Mrinmoy Choudhury", designation: "Marketing Director", company: "Savannah Seeds Pvt. Ltd." },
    { name: "Dr. Kalyan Goswami", designation: "Director General", company: "Agro Chem Federation of India (ACFI)" },
    { name: "Dr. A John Peter", designation: "CMD", company: "Varsha Bioscience & Technology" },
    { name: "Dr. Abhijit A. Pujari", designation: "Director SWAFE Bioworks & Director,", company: "EpiLogic India" },
    { name: "Dr. Sanjay Nagi", designation: "Founder & MD,", company: "Market Insight Consultant" },
    { name: "Mr. Manoj Varshney", designation: "MD & CEO", company: "IFFCO - MC Crop Science Pvt. Ltd." },
    { name: "Mr. Carlos Rodriguez-Villa Förster", designation: "CEO Phoenix Biosolutions &", company: "President of the Board of EBIC" },
    { name: "Nitin Puri", designation: "Founder,", company: "KisanSay" },
    { name: "Mr. Anant Kulkarni", designation: "Country Lead", company: "ICL Group" },
    { name: "Harish Mehta", designation: "Sr. Advisor,", company: "Crop Care federation of India" },
    { name: "Debabrata Sarkar", designation: "CMD - MicroAlgae Solutions India &", company: "VP-APAC-AlgaEnergy" },
    { name: "Nalin Rawal", designation: "Director Consulting & GIS Services,", company: "Agriwatch" },
    { name: "Anand Chandra", designation: "Co-Founder & Executive Director,", company: "Arya.ag" },
    { name: "Dr. Shailendra Singh", designation: "COO,", company: "Zydex Industries Pvt. Ltd." },
    { name: "Dr. VV Sadamate", designation: "Agri Ext. Specialist", company: "& Former Advisor, GOI" },
    { name: "Tarun Bhargava", designation: "COO,", company: "IFFCO - MC Crop Science" },
    { name: "Mr. Suhas Joshi", designation: "Director on Board The Good Rice Alliance;", company: "India Carbon Initiative Lead Bayer" },
    { name: "Mr. Shishir Chandra", designation: "DGM - Marketing Communications", company: "Insecticides India Limited" },
    { name: "Mr. Chinmay S. Sardeshpande", designation: "Technical Services Manager - Agronomy", company: "Novonesis" },
    { name: "Mr. Srinivasakumar Karavadi", designation: "President", company: "INERA™" },
    { name: "Suresh Reddy", designation: "President Sales Marketing", company: "KRISHI RASAYAN EXPORT PVT. LTD." },
    { name: "Manish Sawla", designation: "Sr. Manager, IT,", company: "United Airline" },
    { name: "Jyotsna Dash Nanda", designation: "AVP, Corporate Communication,", company: "DS Group" },
    { name: "Durgesh Chandra", designation: "Secretary General,", company: "CropLife India" },
    { name: "Rahul Mathur", designation: "Head - Marketing,", company: "IPL Biologicals" },
    { name: "Ms. Poorna Pushkala", designation: "Group Head - Corporate Strategy", company: "Samunnati" }
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center bg-brand-surface py-12 md:py-16 overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      {/* Vertical Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-evenly opacity-100 z-0">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden lg:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Header Layout */}
        <div className="relative flex flex-col items-center text-center mb-12 md:mb-16 min-h-[140px]">
          
          {/* Centered Content */}
          <div className="max-w-4xl flex flex-col items-center text-center bg-brand-surface/80 backdrop-blur-md p-6 rounded-3xl relative z-10 shadow-[0_0_40px_20px_rgba(232,239,222,0.8)] w-full">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-3 mb-4"
            >
              <div className="h-px w-6 bg-brand-primary/50" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                FEATURED SPEAKERS
              </span>
              <div className="h-px w-6 bg-brand-primary/50" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-tight text-brand-dark mb-3">
                The rare kind of stage where every seat on it has <span className="text-brand-primary italic">something to say.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mt-2 mb-2"
            >
              <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed font-sans">
                Featured speakers from BRAND R.COMM 2026 — full 2026 line-up unveiled by 15 October. A curated preview of past editions is available in our archive.
              </p>
            </motion.div>
          </div>

          {/* See All Button (Top Right) */}
          <div className="mt-6 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2.5 bg-brand-primary text-white text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-brand-dark transition-colors text-center rounded shadow-sm"
            >
              {showAll ? "MINIMIZE" : "SEE ALL SPEAKERS"}
            </motion.button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="relative mt-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-12 pb-4">
            {(showAll ? speakers : speakers.slice(0, 6)).map((speaker, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (idx % 6) * 0.1 }}
                className="w-full flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Image Placeholder */}
                <div className="relative w-28 h-36 md:w-[130px] md:h-[170px] rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden mb-4 border border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 to-transparent transition-all duration-300 group-hover:border-brand-primary/50 group-hover:shadow-xl group-hover:shadow-brand-primary/10 group-hover:-translate-y-1 flex items-center justify-center">
                  <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <svg className="w-12 h-12 text-brand-primary/30 transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                {/* Text Data */}
                <div className="px-1 w-full flex flex-col items-center space-y-1 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <h4 className="text-[13px] md:text-[15px] font-bold text-brand-dark leading-tight">{speaker.name}</h4>
                  {speaker.designation && (
                    <p className="text-[11px] md:text-[12px] text-brand-dark/70 font-medium leading-[1.3]">{speaker.designation}</p>
                  )}
                  {speaker.company && (
                    <p className="text-[11px] md:text-[12px] text-brand-dark/80 font-semibold leading-[1.3]">{speaker.company}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
