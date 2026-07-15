"use client";

import React from "react";
import Link from "next/link";

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[#F0F7EA] text-brand-dark pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-8 mb-16">
        
        {/* Column 1: Brand */}
        <div className="flex flex-col max-w-xs">
          <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-brand-dark">BRAND R.COMM 2026</h3>
          <p className="text-sm text-brand-dark/70 font-medium leading-relaxed">
            India's Agriculture & Rural Communication Summit & Awards. Organised annually by Snail Integral in New Delhi.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
              <FacebookIcon size={14} className="text-brand-dark" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
              <TwitterIcon size={14} className="text-brand-dark" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
              <InstagramIcon size={14} className="text-brand-dark" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
              <LinkedinIcon size={14} className="text-brand-dark" />
            </a>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div className="flex flex-col">
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">Explore</h4>
          <ul className="flex flex-col gap-3 text-sm font-medium text-brand-dark/70">
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
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">Act Now</h4>
          <ul className="flex flex-col gap-3 text-sm font-medium text-brand-dark/70">
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Register as Delegate</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Become a Sponsor</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Apply for Awards</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Admin Login</Link></li>
          </ul>
        </div>

        {/* Column 4: Policies */}
        <div className="flex flex-col">
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">Policies</h4>
          <ul className="flex flex-col gap-3 text-sm font-medium text-brand-dark/70">
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Terms</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Privacy</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Cookies</Link></li>
            <li><Link href="#" className="hover:text-[#8CC63F] transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Column 5: Contact */}
        <div className="flex flex-col max-w-xs">
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-brand-dark">Contact</h4>
          <ul className="flex flex-col gap-3 text-sm font-medium text-brand-dark/70">
            <li>Snail Integral, Delhi NCR, India</li>
            <li><a href="mailto:hello@rcomm-awards.com" className="hover:text-[#8CC63F] transition-colors">hello@rcomm-awards.com</a></li>
            <li><a href="tel:+919810000000" className="hover:text-[#8CC63F] transition-colors">+91 98100 00000</a></li>
            <li><a href="tel:+919820000000" className="hover:text-[#8CC63F] transition-colors">+91 98200 00000</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-black/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-brand-dark/50">
        <p>&copy; {new Date().getFullYear()} Snail Integral. All rights reserved.</p>
        <p>Designed for India's Agriculture & Rural Communication Summit.</p>
      </div>
    </footer>
  );
}
