"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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
    <section className="relative w-full py-16 bg-white text-black overflow-hidden border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* TOP ROW: Contact Info & Form */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
          
          {/* Left Column: Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-brand-dark">
              Contact Us
            </h2>
            
            <p className="text-sm md:text-base text-brand-dark/70 max-w-sm mb-10 font-medium">
              Snail Integral conveniently located in Delhi NCR, India. You can contact us via e-mail, phone or simply walk-in.
            </p>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="text-base md:text-lg font-medium text-brand-dark">Snail Integral, Delhi NCR, India</span>
                <ArrowRight className="text-[#8CC63F] group-hover:translate-x-1 transition-transform" size={18} strokeWidth={3} />
              </div>
              <p className="text-[11px] font-bold text-brand-dark/50 -mt-3 mb-1">Monday - Friday | 10:00 am-5:30 pm</p>

              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="text-base md:text-lg font-medium text-brand-dark">+91 98100 00000</span>
                <ArrowRight className="text-[#8CC63F] group-hover:translate-x-1 transition-transform" size={18} strokeWidth={3} />
              </div>

              <div className="flex items-center gap-2 group cursor-pointer -mt-3">
                <span className="text-base md:text-lg font-medium text-brand-dark">+91 98200 00000</span>
                <ArrowRight className="text-[#8CC63F] group-hover:translate-x-1 transition-transform" size={18} strokeWidth={3} />
              </div>

              <div className="flex items-center gap-2 group cursor-pointer mt-1">
                <span className="text-base md:text-lg font-medium text-brand-dark">hello@rcomm-awards.com</span>
                <ArrowRight className="text-[#8CC63F] group-hover:translate-x-1 transition-transform" size={18} strokeWidth={3} />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <a href="#" className="w-8 h-8 bg-black/5 rounded-sm flex items-center justify-center hover:bg-black/10 transition-colors">
                <FacebookIcon size={16} className="text-brand-dark" />
              </a>
              <a href="#" className="w-8 h-8 bg-black/5 rounded-sm flex items-center justify-center hover:bg-black/10 transition-colors">
                <InstagramIcon size={16} className="text-brand-dark" />
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white border border-black/5 p-6 md:p-8 shadow-sm w-full max-w-lg mx-auto lg:ml-auto rounded-sm">
              <h3 className="text-sm font-bold mb-5 text-brand-dark">Chat with us or fill out this form:</h3>
              
              <form className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full border-b border-black/10 pb-2 text-sm placeholder:text-black/40 focus:outline-none focus:border-brand-dark transition-colors bg-transparent text-brand-dark"
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full border-b border-black/10 pb-2 text-sm placeholder:text-black/40 focus:outline-none focus:border-brand-dark transition-colors bg-transparent text-brand-dark"
                />
                <input 
                  type="text" 
                  placeholder="Describe your project" 
                  className="w-full border-b border-black/10 pb-2 text-sm placeholder:text-black/40 focus:outline-none focus:border-brand-dark transition-colors bg-transparent text-brand-dark"
                />
                
                <label className="flex items-start gap-2 mt-2 cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded-sm border-black/20 text-[#8CC63F] focus:ring-[#8CC63F]" />
                  <span className="text-[10px] text-black/60 group-hover:text-black transition-colors">
                    By submitting this form, you agree to our <a href="#" className="underline">Privacy Policy</a>.
                  </span>
                </label>

                <button type="button" className="bg-[#8CC63F] text-brand-dark font-bold text-xs py-3 px-8 mt-2 w-fit hover:bg-opacity-90 transition-opacity">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Map & Gallery */}
        <div className="flex flex-col w-full">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-brand-dark">
            How to Find Us
          </h2>
          
          {/* Main Map */}
          <div className="w-full h-[320px] bg-gray-200 mb-2 relative group overflow-hidden">
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448181.1637411366!2d76.81306232675662!3d28.647279935105315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0 opacity-90 transition-all duration-500 hover:opacity-100"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              ></iframe>
              
              <a href="https://maps.google.com/?q=Delhi" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 left-4 bg-[#8CC63F] text-brand-dark text-[10px] font-bold px-3 py-1.5 hover:bg-opacity-90 transition-opacity z-10">
                Open in google maps
              </a>
          </div>

          {/* 3 Images Grid */}
          <div className="grid grid-cols-3 gap-2 h-[160px] md:h-[200px] lg:h-[250px]">
            <div className="w-full h-full bg-gray-300 relative overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="Building 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full h-full bg-gray-300 relative overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" alt="Building 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full h-full bg-gray-300 relative overflow-hidden group cursor-pointer">
               <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop" alt="Building 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-colors group-hover:bg-black/30">
                  <ArrowUpRight className="text-white w-8 h-8 drop-shadow-md" strokeWidth={2} />
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
