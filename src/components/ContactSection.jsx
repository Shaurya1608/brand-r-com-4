"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Phone, Mail } from "lucide-react";

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactSection() {
  return (
    <section className="relative w-full py-16 text-black overflow-hidden border-b border-black/10 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-2 mb-4 bg-brand-primary/10 py-1 px-3 md:px-4 rounded-full"
          >
            <span className="text-brand-primary tracking-[0.2em] text-[9px] md:text-[10px] font-bold uppercase">
              Get in Touch
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-brand-dark"
          >
            Contact Us
          </motion.h2>
        </div>

        {/* Team Contacts */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-brand-primary/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 mb-6 bg-gray-50 shadow-sm flex items-center justify-center">
                <img src="/team/Amit Khare New.png" alt="Amit BK Khare" className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="text-xl font-bold text-[#0a2540] mb-1">Amit BK Khare</h3>
              <p className="text-[#8CC63F] text-xs font-bold uppercase tracking-wide mb-4">FOUNDER AND MANAGING PARTNER</p>
              <div className="w-full mt-auto flex flex-col gap-3 text-sm text-gray-600 text-left border-t border-gray-100 pt-6">
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#8CC63F] shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <span>+91 8750807676</span>
                    <span>+91 9354342588</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-[#8CC63F] shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <a href="mailto:amit.khare@snailintegral.com" className="hover:text-brand-primary transition-colors">amit.khare@snailintegral.com</a>
                    <a href="mailto:snailintegral@gmail.com" className="hover:text-brand-primary transition-colors">snailintegral@gmail.com</a>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center mt-6 pt-6 border-t border-gray-100">
                <div className="w-24 h-24 mb-3">
                  <img src="/qr/Amit Khare QR Code.png" alt="Amit BK Khare QR" className="w-full h-full object-contain" />
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Scan for contact info</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-brand-primary/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 mb-6 bg-gray-50 shadow-sm flex items-center justify-center">
                <img src="/team/Arpita.png" alt="Arpita Kaur Matharu" className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="text-xl font-bold text-[#0a2540] mb-1">Arpita Kaur Matharu</h3>
              <p className="text-[#8CC63F] text-xs font-bold uppercase tracking-wide mb-4">LEAD, DIGITAL MARKETING</p>
              <div className="w-full mt-auto flex flex-col gap-3 text-sm text-gray-600 text-left border-t border-gray-100 pt-6">
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#8CC63F] shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <span>+91 8700178106</span>
                    <span>+91 8750807676</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-[#8CC63F] shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <a href="mailto:info@snailintegral.com" className="hover:text-brand-primary transition-colors">info@snailintegral.com</a>
                    <a href="mailto:snailintegral@gmail.com" className="hover:text-brand-primary transition-colors">snailintegral@gmail.com</a>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center mt-6 pt-6 border-t border-gray-100">
                <div className="w-24 h-24 mb-3">
                  <img src="/qr/Arpita QR Code.png" alt="Arpita Kaur Matharu QR" className="w-full h-full object-contain" />
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Scan for contact info</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-brand-primary/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 mb-6 bg-gray-50 shadow-sm flex items-center justify-center">
                <img src="/team/Yashi sharma.png" alt="Yashasvi Sharma" className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="text-xl font-bold text-[#0a2540] mb-1">Yashasvi Sharma</h3>
              <p className="text-[#8CC63F] text-xs font-bold uppercase tracking-wide mb-4">LEAD, BUSINESS SUPPORT</p>
              <div className="w-full mt-auto flex flex-col gap-3 text-sm text-gray-600 text-left border-t border-gray-100 pt-6">
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#8CC63F] shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <span>+91 8527552425</span>
                    <span>+91 8750807676</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-[#8CC63F] shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <a href="mailto:marketing@snailintegral.com" className="hover:text-brand-primary transition-colors">marketing@snailintegral.com</a>
                    <a href="mailto:snailintegral2@gmail.com" className="hover:text-brand-primary transition-colors">snailintegral2@gmail.com</a>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center mt-6 pt-6 border-t border-gray-100">
                <div className="w-24 h-24 mb-3">
                  <img src="/qr/Yashi sharma QR.png" alt="Yashasvi Sharma QR" className="w-full h-full object-contain" />
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Scan for contact info</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
