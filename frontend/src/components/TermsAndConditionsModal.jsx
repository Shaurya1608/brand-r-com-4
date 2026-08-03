"use client";

import React, { useEffect } from "react";
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

export default function TermsAndConditionsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                onClick={onClose}
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
                onClick={onClose}
                className="px-6 py-2.5 bg-brand-dark text-white text-xs font-bold uppercase rounded hover:bg-brand-primary transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
