"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

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

const FacebookIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const InstagramIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);

const XIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const LinkedinIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

const YoutubeIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const PodcastIcon = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 10v2a7 7 0 01-14 0v-2M12 18.5v3.5M12 14a4 4 0 004-4V6a4 4 0 10-8 0v4a4 4 0 004 4z"/></svg>
);

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  return (
    <footer className="w-full bg-[#F0F7EA] text-brand-dark pt-20 pb-10 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-12 lg:gap-8 mb-16">
        
        {/* Column 1: Brand */}
        <div className="flex flex-col lg:col-span-2">
          <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-brand-dark">BRAND R.COMM 2026</h3>
          <p className="text-sm text-brand-dark/70 font-medium leading-relaxed max-w-sm">
            India's Agriculture & Rural Communication Summit & Awards. Organised annually by Snail Integral in New Delhi.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="https://www.facebook.com/Snailintegral/" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-dark/15 flex items-center justify-center text-brand-dark hover:border-brand-dark/40 hover:bg-black/5 transition-all duration-300">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/snailintegral/?hl=en" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-dark/15 flex items-center justify-center text-brand-dark hover:border-brand-dark/40 hover:bg-black/5 transition-all duration-300">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://x.com/snailintegral" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-dark/15 flex items-center justify-center text-brand-dark hover:border-brand-dark/40 hover:bg-black/5 transition-all duration-300">
              <XIcon className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/snailintegral" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-dark/15 flex items-center justify-center text-brand-dark hover:border-brand-dark/40 hover:bg-black/5 transition-all duration-300">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com/@snailintegral" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-dark/15 flex items-center justify-center text-brand-dark hover:border-brand-dark/40 hover:bg-black/5 transition-all duration-300">
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com/@thesnailshowpodcast" aria-label="Podcast" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-dark/15 flex items-center justify-center text-brand-dark hover:border-brand-dark/40 hover:bg-black/5 transition-all duration-300">
              <PodcastIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div className="flex flex-col">
          <h4 className="font-bold mb-5 uppercase text-xs tracking-widest text-brand-dark">Explore</h4>
          <ul className="flex flex-col gap-3.5 text-sm font-medium text-brand-dark/70">
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">About</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Summit</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Awards</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Sponsors</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Delegates</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Past Editions</Link></li>
          </ul>
        </div>

        {/* Column 3: Act Now */}
        <div className="flex flex-col">
          <h4 className="font-bold mb-5 uppercase text-xs tracking-widest text-brand-dark">Act Now</h4>
          <ul className="flex flex-col gap-3.5 text-sm font-medium text-brand-dark/70">
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Register as Delegate</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Become a Sponsor</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Apply for Awards</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Admin Login</Link></li>
          </ul>
        </div>

        {/* Column 4: Policies */}
        <div className="flex flex-col">
          <h4 className="font-bold mb-5 uppercase text-xs tracking-widest text-brand-dark">Policies</h4>
          <ul className="flex flex-col gap-3.5 text-sm font-medium text-brand-dark/70">
            <li><button onClick={() => setIsModalOpen(true)} className="hover:text-[#8CC63F] transition-colors">Terms & Conditions</button></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Privacy</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Cookies</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Column 5: Contact */}
        <div className="flex flex-col lg:col-span-2">
          <h4 className="font-bold mb-5 uppercase text-xs tracking-widest text-brand-dark">Get In Touch</h4>
          <ul className="flex flex-col gap-4 text-sm font-medium text-brand-dark/70">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#8CC63F]" />
              <a href="tel:+918750807676" className="hover:text-[#8CC63F] transition-colors">+91 8750807676</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[#8CC63F]" />
              <a href="mailto:info@snailintegral.com" className="hover:text-[#8CC63F] transition-colors">info@snailintegral.com</a>
            </li>
            <li className="flex items-start gap-3 mt-1">
              <MapPin size={16} className="text-[#8CC63F] shrink-0 mt-1" />
              <div className="flex flex-col gap-1.5 leading-relaxed">
                <span className="text-brand-dark font-semibold">Snail Integral Private Limited</span>
                <span>Q-170141, 14th Avenue, Gaur City - 2,</span>
                <span>Noida Extension, Greater Noida,</span>
                <span>Uttar Pradesh, India</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-brand-dark/50">
        <p>&copy; {new Date().getFullYear()} Snail Integral. All rights reserved.</p>
        <p>Designed for India's Agriculture & Rural Communication Summit.</p>
      </div>
      
      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-brand-primary/10 bg-white">
                <div>
                  <h3 className="text-2xl font-serif text-brand-dark mb-1">Things to Keep in Mind</h3>
                  <p className="text-xs text-brand-primary font-bold tracking-widest uppercase">Terms & Conditions</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-brand-primary transition-colors p-2 -mr-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8 overflow-y-auto font-sans bg-gray-50/50">
                <p className="text-sm text-brand-dark/50 mb-8 uppercase tracking-wider font-semibold">BRAND R.Comm Awards 2026</p>
                <div className="space-y-8">
                  {termsContent.map((term, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-2 md:gap-6">
                      <div className="md:w-1/3 flex-shrink-0">
                        <h4 className="text-base font-bold text-brand-dark">{term.title}</h4>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-brand-dark/70 text-sm leading-relaxed">{term.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-brand-primary/10 bg-white flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 bg-[#8CC63F] text-white rounded hover:bg-[#8CC63F]/90 transition-colors text-xs font-bold tracking-widest uppercase"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
