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
  const contacts = [
    {
      name: "Amit BK Khare",
      role: "FOUNDER AND MANAGING PARTNER",
      image: "/team/Amit Khare New.png",
      phones: ["+91 8750807676", "+91 9354342588"],
      emails: ["amit.khare@snailintegral.com", "snailintegral@gmail.com"],
      qr: "/qr/Amit Khare QR Code.png"
    },
    {
      name: "Arpita Kaur Matharu",
      role: "LEAD, DIGITAL MARKETING",
      image: "/team/Arpita.png",
      phones: ["+91 8700178106", "+91 8750807676"],
      emails: ["info@snailintegral.com", "snailintegral@gmail.com"],
      qr: "/qr/Arpita QR Code.png"
    },
    {
      name: "Yashasvi Sharma",
      role: "LEAD, BUSINESS SUPPORT",
      image: "/team/Yashi sharma.png",
      phones: ["+91 8527552425", "+91 8750807676"],
      emails: ["marketing@snailintegral.com", "snailintegral2@gmail.com"],
      qr: "/qr/Yashi sharma QR.png"
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 text-brand-dark overflow-hidden bg-brand-surface">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-6"
          >
            <div className="h-px w-6 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Get in Touch
            </span>
            <div className="h-px w-6 bg-brand-primary" />
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
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {contacts.map((contact, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white rounded-[2rem] p-6 lg:p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 border border-transparent hover:border-brand-primary/10"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-brand-surface p-1.5 shadow-sm group-hover:shadow-md transition-shadow duration-500">
                  <img src={contact.image} alt={contact.name} className="w-full h-full object-cover object-top rounded-full" />
                </div>
                
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-1 group-hover:text-brand-primary transition-colors duration-300">
                  {contact.name}
                </h3>
                
                <p className="text-brand-primary text-[8px] font-bold uppercase tracking-[0.2em] mb-6">
                  {contact.role}
                </p>
                
                <div className="w-full flex flex-col gap-3 text-sm text-brand-dark/80 text-left mt-auto">
                  <div className="flex items-center gap-3 bg-brand-surface/40 p-3 rounded-xl transition-colors group-hover:bg-brand-surface/80">
                    <div className="w-8 h-8 shrink-0 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm">
                      <Phone size={14} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col font-medium text-xs">
                      {contact.phones.map((phone, pIdx) => (
                        <span key={pIdx}>{phone}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-brand-surface/40 p-3 rounded-xl transition-colors group-hover:bg-brand-surface/80">
                    <div className="w-8 h-8 shrink-0 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm">
                      <Mail size={14} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col font-medium text-[11px] md:text-xs w-full overflow-hidden">
                      {contact.emails.map((email, eIdx) => (
                        <a key={eIdx} href={`mailto:${email}`} className="hover:text-brand-primary transition-colors truncate block">
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col items-center justify-center mt-6 pt-5 border-t border-brand-primary/10">
                  <div className="w-16 h-16 mb-3 bg-white p-1.5 rounded-lg shadow-sm border border-brand-primary/10 group-hover:border-brand-primary/30 transition-colors">
                    <img src={contact.qr} alt={`${contact.name} QR`} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[8px] text-brand-dark/40 uppercase tracking-[0.2em] font-bold">
                    Scan for contact info
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
