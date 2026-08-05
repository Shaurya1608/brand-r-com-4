"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AwardNominationModal from "./AwardNominationModal";

const termsContent = [
  {
    title: "How to Enter - Step 1: Select an Award Category",
    content: "Choose the most appropriate award category based on your campaign, organization, or individual achievement."
  },
  {
    title: "How to Enter - Step 2: Complete the Nomination Form",
    content: "Fill in all the required details accurately and provide complete information about your nomination."
  },
  {
    title: "How to Enter - Step 3: Upload Supporting Documents",
    content: "Attach relevant case studies, presentations, campaign reports, images, videos, or any supporting material that strengthens your nomination."
  },
  {
    title: "How to Enter - Step 4: Pay the Nomination Fee",
    content: "A non-refundable nomination fee of INR 12,000 + GST per category must be paid at the time of submission. The nomination fee is designed not only for the independent evaluation and jury process but also to facilitate meaningful participation in the BRAND R.Comm Summit & Awards, enabling organizations and professionals to network, learn, and engage with industry leaders irrespective of the award outcome."
  },
  {
    title: "How to Enter - Step 5: Submit Your Entry",
    content: "Review your nomination carefully before submission. Once submitted, entries cannot be edited, replaced, or withdrawn."
  },
  {
    title: "How to Enter - Step 6: Jury Evaluation",
    content: "Eligible nominations will be reviewed by the external team (Market Research Agency Or Knowledge Partner) or Equivalent before being evaluated by an independent Jury Panel."
  },
  {
    title: "How to Enter - Step 7: Award Winners' Complimentary Delegate Passes",
    content: "Corporate/ Individual Award Winners: Two (02) complimentary delegate passes shall be provided. One pass is intended for the official award recipient, and one additional pass is for another representative of the winning organization. These complimentary registrations are valid only for the designated event and are non-transferable."
  },
  {
    title: "How to Enter - Step 8: Complimentary Delegate Pass for Non-Winning Participants",
    content: "Companies or individuals whose nominations are evaluated but are not selected as Award Winners shall be entitled to one (01) complimentary delegate pass to attend the BRAND R.Comm Summit & Awards 2026, subject to prior registration and confirmation by the organizers."
  },
  {
    title: "Rules for Entry - 1",
    content: "The awards are open to organizations and individuals from the agriculture, rural communication, and allied sectors."
  },
  {
    title: "Rules for Entry - 2",
    content: "All entries must represent work, campaigns, or achievements carried out between January 2025 and December 2026 OR FY25-26."
  },
  {
    title: "Rules for Entry - 3",
    content: "Each award category requires a separate nomination form, supporting documents, and nomination fee."
  },
  {
    title: "Rules for Entry - 4",
    content: "The nomination fee is non-refundable under all circumstances."
  },
  {
    title: "Rules for Entry - 5",
    content: "Once submitted, nominations cannot be modified, replaced, or withdrawn."
  },
  {
    title: "Rules for Entry - 6",
    content: "All information submitted must be accurate, authentic, and verifiable."
  },
  {
    title: "Rules for Entry - 7",
    content: "Any false or misleading information may result in immediate disqualification."
  },
  {
    title: "Rules for Entry - 8",
    content: "Sponsors, Co-Sponsors, or sponsors in any category are not eligible to participate in the awards."
  },
  {
    title: "Rules for Entry - 9",
    content: "All nominations will undergo an eligibility review by external agency before being presented to the Jury."
  },
  {
    title: "Rules for Entry - 10",
    content: "The Jury's decision shall be final and binding."
  },
  {
    title: "Rules for Entry - 11",
    content: "BRAND R.Comm maintains complete transparency and does not entertain paid or influenced awards."
  },
  {
    title: "Rules for Entry - 12",
    content: "Winners must be present at the BRAND R.Comm Awards Ceremony to receive their award. Awards will not be couriered or reissued in case of absence."
  },
  {
    title: "Rules for Entry - 13",
    content: "The organizers reserve the right to amend, modify, postpone, or cancel any part of the awards process if required."
  },
  {
    title: "Rules for Entry - 14",
    content: "By submitting a nomination, participants grant BRAND R.Comm permission to use submitted names, logos, and content for promotional purposes related to the awards."
  },
  {
    title: "Rules for Entry - 15",
    content: "Any disputes arising from the awards process shall be subject to the exclusive jurisdiction of Uttar Pradesh, India."
  }
];

export default function AwardsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNominationModalOpen, setIsNominationModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen || isNominationModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen, isNominationModalOpen]);
  const benefits = [
    "Peer-reviewed evaluation by an independent jury",
    "PR amplification if shortlisted or awarded",
    "Editorial feature in the Coffee Table Book",
    "Winner reels, badges and certificates"
  ];

  const timeline = [
    { label: "Last Date for application", date: "10 Nov 2026" },
    { label: "Screening & Jury Round", date: "20 Nov 2026" },
    { label: "Winner Announcement", date: "25 Nov 2026" },
    { label: "Awards Distribution", date: "4 Dec 2026" }
  ];

  return (
    <section id="awards" className="relative w-full py-16 md:py-20 overflow-hidden text-brand-dark border-t border-brand-primary/10 bg-brand-surface">
      
      {/* Background Vertical Lines removed */}

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Left Column: Content & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase bg-brand-primary/10 px-3 py-1 rounded-full">
                Award Nomination
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-brand-dark mb-6"
            >
              One entry.<br />
              <span className="italic text-brand-primary">Ten quarters</span> of credibility.
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-brand-dark/70 text-base md:text-lg leading-relaxed max-w-xl mb-10"
            >
              The BRAND R.COMM Awards are a peer-reviewed honour — not a paid citation. Every entry must carry senior-management approval and go through a validated screening before it reaches the jury.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
            >
              <button onClick={() => setIsNominationModalOpen(true)} className="w-full sm:w-auto px-8 py-4 bg-[#f05a28] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:bg-[#d9481a] hover:-translate-y-0.5 transition-all duration-300">
                Nominate for Awards
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white border border-brand-primary/20 text-brand-dark text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-sm hover:border-brand-primary/50 hover:bg-brand-surface transition-all duration-300">
                Download Brochure
              </button>
            </motion.div>
            
            <motion.button 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-xs font-semibold text-brand-dark/40 hover:text-brand-primary transition-colors underline underline-offset-4"
            >
              Read Terms &amp; Conditions
            </motion.button>
          </div>

          {/* Right Column: Timeline Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-5 w-full relative"
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-brand-primary/5 relative overflow-hidden group">
              {/* Decorative Accent */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-dark mb-8 flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Important Dates
              </h3>
              
              <div className="relative border-l-[3px] border-brand-primary/10 ml-3 space-y-8 py-2">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-8 hover:-translate-y-1 transition-transform duration-300">
                    {/* Timeline Node */}
                    <span className="absolute -left-[11.5px] top-1 w-5 h-5 rounded-full bg-white border-4 border-brand-primary shadow-sm" />
                    
                    <p className="text-[10px] md:text-xs font-bold text-brand-primary uppercase tracking-widest mb-1.5">{item.date}</p>
                    <p className="text-sm md:text-base font-semibold text-brand-dark/90 leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-brand-primary/10 bg-brand-surface">
                <h3 className="text-xl md:text-2xl font-serif text-brand-dark font-bold">Terms & Conditions</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-brand-dark hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
                <div className="space-y-6">
                  {termsContent.map((item, idx) => (
                    <div key={idx} className="pb-6 border-b border-brand-primary/5 last:border-0 last:pb-0">
                      <h4 className="text-base font-bold text-brand-primary mb-2">{item.title}</h4>
                      <p className="text-brand-dark/80 text-sm leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-brand-primary/10 bg-brand-surface/50 flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-brand-dark text-white text-xs font-bold uppercase rounded hover:bg-brand-primary transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AwardNominationModal 
        isOpen={isNominationModalOpen} 
        onClose={() => setIsNominationModalOpen(false)} 
      />
    </section>
  );
}
