"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SpeakersSection() {
  const [showAll, setShowAll] = useState(false);

  const speakers = [
    { name: "Shri Parshottam Rupala", designation: "Hon'ble Former Union", company: "Cabinet Minister, GOI", image: "/Speaker photos/Shri Parshottam Rupala.png", imageClass: "object-top scale-125 translate-y-2 group-hover:scale-[1.35]" },
    { name: "Dr. P.K. Singh", designation: "Agriculture Commissioner,", company: "Government of India", image: "/Speaker photos/speaker photo-4.png", imageClass: "object-top scale-125 translate-y-2 group-hover:scale-[1.35]" },
    { name: "Dr. Rajarshi Roy Burman", designation: "ADG (Agri. Extension),", company: "ICAR", image: "/Speaker photos/Rajarshi Roy Burman.png", imageClass: "object-top scale-125 translate-y-2 group-hover:scale-[1.35]" },
    { name: "Dr. RB Singh", designation: "Former Chancellor,", company: "CAU, Imphal", image: "/Speaker photos/RB Singh.png", imageClass: "object-top scale-[1.8] translate-y-10 group-hover:scale-[1.9]" },
    { name: "Dr. Arvind Kumar", designation: "Former VC, RLBCAU,", company: "Jhansi", image: "/Speaker photos/Dr. Arvind Kumar.png", imageClass: "object-top scale-[1.8] translate-y-10 translate-x-5 group-hover:scale-[1.9]" },
    { name: "Deepak Shah", designation: "CMD,", company: "SML Group", image: "/Speaker photos/Deepak Shah.png" },
    { name: "Mr. Ajeet Chahal", designation: "Founder and CEO", company: "CropNXT Solutions Pvt. Ltd.", image: "/Speaker photos/Mr. Ajeet Chahal.png" },
    { name: "Raj Kumar Gupta", designation: "MD,", company: "Thakar Chemicals Ltd.", image: "/Speaker photos/Raj Kumar Gupta.png" },
    { name: "Mr. Augusto Rodriguez-Villa", designation: "President", company: "Phoenix Biosolutions & Agrolink Brasil", image: "/Speaker photos/Mr Augusto.png" },
    { name: "Rajesh Aggarwal", designation: "Managing Director,", company: "Insecticide India Ltd.", image: "/Speaker photos/Rajesh Aggarwal.png" },
    { name: "Rajvir Singh Rathi", designation: "Director - Agricultural Affairs & Policy, IM - IBSL", company: "Lead - Traits Licensing Business", image: "/Speaker photos/Rajvir Singh Rathi.png", imageClass: "object-top scale-125 translate-y-2 group-hover:scale-[1.35]" },
    { name: "Vijay Sardana", designation: "Advocate,", company: "Supreme Court of India", image: "/Speaker photos/Vijay Sardana.png" },
    { name: "Dr. Ajay Ranka", designation: "Chairman & MD", company: "Zydex Group", image: "/Speaker photos/Dr. Ajay Ranka.png" },
    { name: "Dr. KC Ravi", designation: "Chief Sustainability Officer", company: "Syngenta India Limited", image: "/Speaker photos/Dr. KC Ravi.png" },
    { name: "Vipin Saini", designation: "CEO,", company: "BASAI", image: "/Speaker photos/Vipin Saini.png" },
    { name: "Sumit Gupta", designation: "Director (Project),", company: "Thakar Chemicals Ltd", image: "/Speaker photos/Sumit Gupta.png" },
    { name: "Sunil Sihag", designation: "Managing Director,", company: "Synergy Technofin Pvt. Ltd.", image: "/Speaker photos/Sunil Sihag.png" },
    { name: "Vivek Mittal", designation: "Director,", company: "Thakar Chemicals Ltd.", image: "/Speaker photos/Vivek Mittal.png" },
    { name: "Dharmesh Gupta", designation: "Managing Director", company: "Dhanesha Crop Sciences Pvt. Ltd", image: "/Speaker photos/Dharmesh Gupta.png" },
    { name: "Takuya Fukunaga", designation: "Jt. CEO,", company: "IFFCO - MC Crop Science", image: "/Speaker photos/Takuya Fukunaga.png" },
    { name: "Ms. Komal Shah", designation: "Director - R&D and IP", company: "SML Limited", image: "/Speaker photos/Ms. Komal Shah.png" },
    { name: "Dr. Rajeev Dwivedi", designation: "Business Manager South Asia,", company: "Novonosis", image: "/Speaker photos/Dr. Rajeev Dwivedi.png" },
    { name: "Mr. Mrinmoy Choudhury", designation: "Marketing Director", company: "Savannah Seeds Pvt. Ltd.", image: "/Speaker photos/Mr. Mrinmoy.png" },
    { name: "Dr. Kalyan Goswami", designation: "Director General", company: "Agro Chem Federation of India (ACFI)", image: "/Speaker photos/Dr kalyan.png" },
    { name: "Dr. A John Peter", designation: "CMD", company: "Varsha Bioscience & Technology", image: "/Speaker photos/Dr. A John Peter.png", imageClass: "object-top scale-[1.5] translate-y-8 translate-x-8 group-hover:scale-[1.6]" },
    { name: "Dr. Abhijit A. Pujari", designation: "Director SWAFE Bioworks & Director,", company: "EpiLogic India", image: "/Speaker photos/Dr. Abhijit A. Pujari.png" },
    { name: "Dr. Sanjay Nagi", designation: "Founder & MD,", company: "Market Insight Consultant", image: "/Speaker photos/Dr. Sanjay Nagi.png" },
    { name: "Mr. Manoj Varshney", designation: "MD & CEO", company: "IFFCO - MC Crop Science Pvt. Ltd.", image: "/Speaker photos/speaker photo-30.png" },
    { name: "Mr. Carlos Rodriguez-Villa Förster", designation: "CEO Phoenix Biosolutions &", company: "President of the Board of EBIC", image: "/Speaker photos/Rodriguez Villa Förster.png" },
    { name: "Nitin Puri", designation: "Founder,", company: "KisanSay", image: "/Speaker photos/Nitin Puri.png" },
    { name: "Mr. Anant Kulkarni", designation: "Country Lead", company: "ICL Group", image: "/Speaker photos/Mr Anant.png" },
    { name: "Harish Mehta", designation: "Sr. Advisor,", company: "Crop Care federation of India", image: "/Speaker photos/Harish Mehta.png" },
    { name: "Debabrata Sarkar", designation: "CMD - MicroAlgae Solutions India &", company: "VP-APAC-AlgaEnergy", image: "/Speaker photos/Debabrata Sarkar.png" },
    { name: "Nalin Rawal", designation: "Director Consulting & GIS Services,", company: "Agriwatch", image: "/Speaker photos/Nalin Rawal.png" },
    { name: "Anand Chandra", designation: "Co-Founder & Executive Director,", company: "Arya.ag", image: "/Speaker photos/Anand Chandra.png" },
    { name: "Dr. Shailendra Singh", designation: "COO,", company: "Zydex Industries Pvt. Ltd.", image: "/Speaker photos/Shailendra Singh.png" },
    { name: "Dr. VV Sadamate", designation: "Agri Ext. Specialist", company: "& Former Advisor, GOI", image: "/Speaker photos/VV Sadamate.png" },
    { name: "Tarun Bhargava", designation: "COO,", company: "IFFCO - MC Crop Science", image: "/Speaker photos/Tarun Bhargava.png" },
    { name: "Mr. Suhas Joshi", designation: "Director on Board The Good Rice Alliance;", company: "India Carbon Initiative Lead Bayer", image: "/Speaker photos/Suhas Joshi.png" },
    { name: "Mr. Shishir Chandra", designation: "DGM - Marketing Communications", company: "Insecticides India Limited", image: "/Speaker photos/Shishir Chandra.png" },
    { name: "Mr. Chinmay S. Sardeshpande", designation: "Technical Services Manager - Agronomy", company: "Novonesis", image: "/Speaker photos/Chinmay Sardeshpande.png" },
    { name: "Mr. Srinivasakumar Karavadi", designation: "President", company: "INERA™", image: "/Speaker photos/Srinivasakumar.png" },
    { name: "Suresh Reddy", designation: "President Sales Marketing", company: "KRISHI RASAYAN EXPORT PVT. LTD.", image: "/Speaker photos/Suresh Reddy.png" },
    { name: "Manish Sawla", designation: "Sr. Manager, IT,", company: "United Airline", image: "/Speaker photos/Manish Sawla.png" },
    { name: "Jyotsna Dash Nanda", designation: "AVP, Corporate Communication,", company: "DS Group", image: "/Speaker photos/Jyotsna Dash Nanda.png" },
    { name: "Durgesh Chandra", designation: "Secretary General,", company: "CropLife India", image: "/Speaker photos/Durgesh Chandra.png" },
    { name: "Rahul Mathur", designation: "Head - Marketing,", company: "IPL Biologicals", image: "/Speaker photos/Rahul Mathur.png" },
    { name: "Ms. Poorna Pushkala", designation: "Group Head - Corporate Strategy", company: "Samunnati", image: "/Speaker photos/Poorna.png" }
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center bg-brand-surface py-12 md:py-16 overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      

      <div className="relative z-10 max-w-[90rem] mx-auto px-4 md:px-12">
        
        {/* Header Layout */}
        <div className="relative flex flex-col items-center text-center mb-16 min-h-[140px]">
          
          {/* Centered Content - Removed heavy backdrop and shadow for minimalism */}
          <div className="max-w-4xl flex flex-col items-center text-center relative z-10 w-full pt-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary/30" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                FEATURED SPEAKERS
              </span>
              <div className="h-px w-8 bg-brand-primary/30" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-dark mb-4">
                The rare kind of stage where every seat on it has <span className="text-brand-primary italic">something to say.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mt-4 mb-8"
            >
              <p className="text-brand-dark/60 text-sm md:text-base leading-relaxed font-sans font-light">
                Featured speakers from BRAND R.COMM 2026 — full 2026 line-up unveiled by 15 October. A curated preview of past editions is available in our archive.
              </p>
            </motion.div>

            {/* See All Button - only shown when minimized */}
            {!showAll && (
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAll(true)}
                className="group flex items-center space-x-2 px-6 py-2.5 bg-brand-primary text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-brand-dark transition-all duration-300 rounded-full shadow-md"
              >
                <span>Explore All Speakers</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="relative mt-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-14 pb-8">
            {(showAll ? speakers : speakers.slice(0, 6)).map((speaker, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (idx % 6) * 0.1 }}
                className="w-full flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Minimal Image Container */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-5 border-[3px] border-transparent group-hover:border-brand-primary/20 bg-brand-primary/5 transition-all duration-500 flex items-center justify-center">
                  {speaker.image ? (
                    <Image src={speaker.image} alt={speaker.name} fill className={`object-cover transition-transform duration-700 ${speaker.imageClass || 'group-hover:scale-110'}`} />
                  ) : (
                    <svg className="w-10 h-10 text-brand-primary/20 transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                {/* Refined Text Data */}
                <div className="px-2 w-full flex flex-col items-center space-y-1.5 transition-transform duration-300">
                  <h4 className="text-[13px] md:text-[14px] font-semibold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors">{speaker.name}</h4>
                  <div className="flex flex-col items-center space-y-0.5">
                    {speaker.designation && (
                      <p className="text-[11px] md:text-[11.5px] text-brand-dark/60 font-medium leading-tight">{speaker.designation}</p>
                    )}
                    {speaker.company && (
                      <p className="text-[11px] md:text-[11.5px] text-brand-dark/80 font-medium leading-tight">{speaker.company}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Minimize Button at bottom — shown only when all speakers are visible */}
        {showAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAll(false)}
              className="group flex items-center space-x-2 px-6 py-2.5 bg-brand-primary text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-brand-dark transition-all duration-300 rounded-full shadow-md"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>Minimize</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
