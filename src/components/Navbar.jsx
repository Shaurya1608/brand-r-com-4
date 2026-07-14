"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Summit", href: "#summit" },
    { name: "Awards", href: "#awards" },
    { name: "Sponsors", href: "#sponsors" },
    { name: "Delegates", href: "#delegates" },
    { name: "Past Editions", href: "#past-editions" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 bg-brand-surface/80 backdrop-blur-lg border-b border-brand-primary/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-shrink-0 group cursor-pointer">
          <Link href="/" className="text-2xl md:text-3xl font-serif text-brand-dark tracking-wide transition-all duration-300 group-hover:text-brand-primary flex items-center">
            BRAND <span className="text-brand-primary italic ml-1 group-hover:text-brand-primary-hover transition-colors">R.</span>COMM <span className="text-[10px] font-sans align-top tracking-widest text-brand-dark/50 ml-2 pt-1 font-bold">2026</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-brand-dark/80 hover:text-brand-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="btn-ghost text-xs">SPONSOR</button>
          <button className="btn-primary text-xs">REGISTER</button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-brand-dark hover:text-brand-primary focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-brand-surface/95 backdrop-blur-md border-b border-brand-dark/10 py-6 px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-serif text-brand-dark/90 hover:text-brand-primary transition-colors border-b border-brand-dark/5 pb-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col space-y-3 pt-4">
             <button className="btn-ghost w-full">SPONSOR</button>
             <button className="btn-primary w-full">REGISTER</button>
          </div>
        </div>
      )}
    </nav>
  );
}
