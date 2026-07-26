"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const termsContent = [
  {
    title: "1. Eligibility",
    content: "The BRAND R.Comm Awards 2026 are open to organizations and individuals operating in the agriculture, rural communication, and allied sectors in India. All nominations must be based on activities, campaigns, or achievements executed between January 2025 and October 2026."
  },
  {
    title: "2. Authority to Receive Awards",
    content: "Awards under the Organization/Company Categories must be received by a member of the senior management, such as the Chairman, Managing Director, Director, or an equivalent representative. If none of the authorized representatives are present during the award presentation, the award will stand automatically cancelled and will not be reissued or couriered later."
  },
  {
    title: "3. Nomination Fee",
    content: "A non-refundable nomination fee of ₹8,000 + GST per category is applicable for each nomination. Payment must be be made along with the submission of the nomination form."
  },
  {
    title: "4. Multiple Nominations",
    content: "An individual or organization may submit nominations in more than one category, provided each nomination is submitted separately with its own nomination fee and supporting documents."
  },
  {
    title: "5. Withdrawal of Nomination",
    content: "Once submitted, a nomination cannot be withdrawn, modified, or replaced under any circumstances."
  },
  {
    title: "6. Non-Refundable Fee",
    content: "The nomination fee is strictly non-refundable, irrespective of withdrawal, disqualification, or non-selection for the final awards."
  },
  {
    title: "7. Sponsorship & Awards Eligibility",
    content: "Sponsors, Co-Sponsors, and Supporting Partners of the event are not eligible to receive awards in any category. BRAND R.Comm maintains complete transparency and integrity and does not entertain paid or influenced awards."
  },
  {
    title: "8. Nomination Review",
    content: "All nominations will be reviewed by the internal team for completeness and eligibility before being submitted to the Jury Panel for evaluation."
  },
  {
    title: "9. Decision of the Jury",
    content: "The decision of the Jury shall be final and binding. No correspondence, reconsideration, or appeal regarding the jury's evaluation or final results will be entertained."
  },
  {
    title: "10. Data & Documentation",
    content: "All information, data, and supporting materials submitted with the nomination must be accurate, authentic, and verifiable. Any false or misleading information may result in immediate disqualification without any refund."
  },
  {
    title: "11. Confidentiality",
    content: "All information shared in the nomination forms will be treated as confidential and used solely for the purpose of award evaluation."
  },
  {
    title: "12. Ownership of Material",
    content: "The organizer reserves the right to use the names, logos, and submitted content of nominees for promotional and communication purposes related to BRAND R.Comm, including pre-event and post-event publicity."
  },
  {
    title: "13. Event Participation",
    content: "Attendance at the BRAND R.Comm Summit & Awards 2026 is mandatory for winners to receive their award and recognition. The organizer will not be responsible for travel, accommodation, or any related arrangements."
  },
  {
    title: "14. Amendments",
    content: "The organizers reserve the right to modify, cancel, or reschedule any aspect of the awards process or ceremony without prior notice in the event of unforeseen circumstances."
  },
  {
    title: "15. Jurisdiction",
    content: "Any dispute arising out of or relating to the BRAND R.Comm Awards 2026 shall be subject to the exclusive jurisdiction of the courts of New Delhi, India."
  }
];

export default function RequiredDocumentsSection() {
  const documents = [
    "Signed nomination form with senior-management approval",
    "Campaign or programme deck (max 20 slides, PDF)",
    "Executive summary — 500 words on objective, execution and outcome",
    "Two case-study images (1920×1080, JPG or PNG)",
    "One optional case-study video (max 3 minutes, MP4)",
    "Third-party validation, media coverage or audit report (if available)",
    "Company profile & logo (SVG or PNG, transparent background)",
    "Payment receipt of nomination fee"
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  return (
    <section id="required-documents" className="relative w-full py-16 text-brand-dark border-t border-brand-primary/10 bg-brand-surface overflow-hidden">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Centered Header */}
        <div className="text-center flex flex-col items-center max-w-4xl mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-4"
          >
            <div className="h-px w-6 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              REQUIRED DOCUMENTS
            </span>
            <div className="h-px w-6 bg-brand-primary" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif leading-tight text-brand-dark mb-4"
          >
            Prepare once. Nominate <span className="text-brand-primary italic">as many</span> categories as you want.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark/70 text-sm md:text-base leading-relaxed font-sans mb-8"
          >
            Below is the master checklist. Once compiled, the same set of documents can be reused across categories with light edits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="flex items-center space-x-2 px-8 py-4 bg-brand-primary text-white hover:bg-brand-dark transition-colors rounded-full text-xs font-bold tracking-widest uppercase shadow-md hover:shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>DOWNLOAD FORMAT</span>
            </button>
          </motion.div>
        </div>

        {/* Centered Checklist in Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-8">
          {documents.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex items-start space-x-4 pt-6 border-t border-brand-primary/20 hover:border-brand-primary transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-300">
                <svg className="w-3.5 h-3.5 text-brand-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-brand-dark/90 text-sm font-sans leading-relaxed">{doc}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
