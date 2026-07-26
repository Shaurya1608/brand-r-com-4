"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 140,
    hours: 18,
    minutes: 2,
    seconds: 34,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Summit", href: "#summit" },
    { name: "Awards", href: "#awards" },
    { name: "Sponsors", href: "#sponsors" },
    { name: "Delegates", href: "#delegates" },
    { 
      name: "Past Editions", 
      href: "#past-editions",
      dropdown: [
        { name: "Brand R.Comm Season 1", href: "#season-1" },
        { name: "Brand R.Comm Season 2", href: "#season-2" },
        { name: "Brand R.Comm Season 3", href: "#season-3" },
      ]
    },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Top Strip */}
      <div className="bg-gradient-to-r from-brand-primary-hover via-brand-primary to-brand-primary-hover w-full py-1.5 md:py-1 px-2 md:px-8 flex flex-col xl:flex-row justify-between items-center text-[8.5px] sm:text-[10px] md:text-[11px] font-bold tracking-wide sm:tracking-widest md:tracking-[0.2em] text-white shadow-md z-50">
        <div className="hidden xl:block flex-1"></div>
        <div className="text-center xl:flex-shrink-0 mb-1.5 xl:mb-0 uppercase flex flex-wrap justify-center items-center gap-x-1 sm:gap-x-3 md:gap-x-4 lg:gap-x-5 gap-y-0.5 w-full xl:w-auto">
          <span className="whitespace-nowrap">EARLY BIRD LIVE</span>
          <span className="font-normal text-white/50 inline-block px-0.5 sm:px-0">•</span>
          <span className="whitespace-nowrap">AWARDS OPEN</span>
          <span className="font-normal text-white/50 inline-block px-0.5 sm:px-0 hidden min-[380px]:inline-block">•</span>
          <span className="whitespace-nowrap">SPONSORSHIP OPEN</span>
        </div>
        <div className="flex-1 flex justify-center xl:justify-end font-mono whitespace-nowrap text-[10px] sm:text-[11px] md:text-sm w-full xl:w-auto mt-0.5 xl:mt-0">
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <div className="bg-black/20 backdrop-blur-sm rounded px-1.5 py-0.5 min-w-[2ch] text-center">{timeLeft.days.toString().padStart(3, '0')}</div>
            <span className="text-white/70 animate-pulse">:</span>
            <div className="bg-black/20 backdrop-blur-sm rounded px-1.5 py-0.5 min-w-[2ch] text-center">{timeLeft.hours.toString().padStart(2, '0')}</div>
            <span className="text-white/70 animate-pulse">:</span>
            <div className="bg-black/20 backdrop-blur-sm rounded px-1.5 py-0.5 min-w-[2ch] text-center">{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <span className="text-white/70 animate-pulse">:</span>
            <div className="bg-black/20 backdrop-blur-sm rounded px-1.5 py-0.5 min-w-[2ch] text-center text-brand-surface">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full bg-brand-surface/90 backdrop-blur-xl border-b border-brand-primary/10 py-1.5 md:py-2 px-6 md:px-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 group cursor-pointer">
            <Link href="/" className="flex items-center">
              <img src="/logo/brand-r-comm-logo.png" alt="Brand R.Comm 2026 Logo" className="h-10 md:h-12 lg:h-14 -my-2 md:-my-3 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <>
                    <div className="text-sm font-medium text-brand-dark/80 hover:text-brand-primary transition-colors flex items-center gap-1 cursor-pointer py-2 relative group-hover:text-brand-primary">
                      {link.name}
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                    </div>
                    <div className="absolute top-full left-0 w-60 bg-brand-light/95 backdrop-blur-xl rounded-xl shadow-xl border border-brand-primary/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-3 z-50 transform translate-y-2 group-hover:translate-y-0">
                      {link.dropdown.map((dropLink) => (
                        <Link
                          key={dropLink.name}
                          href={dropLink.href}
                          className="px-5 py-2.5 text-sm font-medium text-brand-dark/70 hover:text-brand-primary hover:bg-brand-primary/5 hover:pl-7 transition-all duration-200"
                        >
                          {dropLink.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link 
                    href={link.href}
                    className="relative text-sm font-medium text-brand-dark/80 hover:text-brand-primary transition-colors py-2 group-hover:text-brand-primary"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors shadow-md shadow-brand-primary/30 transform hover:-translate-y-0.5 duration-200">
              Social Media Kit
            </button>
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
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-brand-surface/95 backdrop-blur-md border-b border-brand-dark/10 py-6 px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <div key={link.name} className="border-b border-brand-dark/5 pb-2">
              {link.dropdown ? (
                <div className="flex flex-col">
                  <button 
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="w-full flex items-center justify-between text-lg font-serif text-brand-dark/90 hover:text-brand-primary transition-colors"
                  >
                    <span>{link.name}</span>
                    <svg className={`w-4 h-4 transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileDropdownOpen && (
                    <div className="flex flex-col space-y-2 mt-3 ml-4 border-l-2 border-brand-primary/20 pl-4">
                      {link.dropdown.map((dropLink) => (
                        <Link
                          key={dropLink.name}
                          href={dropLink.href}
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-medium text-brand-dark/70 hover:text-brand-primary transition-colors"
                        >
                          {dropLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-serif text-brand-dark/90 hover:text-brand-primary transition-colors"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <div className="flex flex-col pt-6 mt-2 border-t border-brand-dark/10">
             <button className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full py-3.5 rounded-lg text-sm font-bold tracking-wide transition-colors shadow-md shadow-brand-primary/30">
               Social Media Kit
             </button>
          </div>
        </div>
      )}
    </nav>
  );
}
