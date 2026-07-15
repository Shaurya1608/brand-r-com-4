"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: "When and where is BRAND R.COMM 2026?", a: "The 4th edition takes place on 4 December 2026 in New Delhi, India. The exact venue will be announced by 30 September 2026 to confirmed delegates." },
    { q: "Who typically attends BRAND R.COMM?", a: "Industry leaders, marketing professionals, brand strategists, and executives from the agriculture, rural, and food ecosystem." },
    { q: "How do I register as a delegate?", a: "You can register directly through our online portal by clicking the 'Register' button on the navigation bar." },
    { q: "What is included in the delegate pass?", a: "The pass includes access to all sessions, networking lunches, evening gala dinner, and the exclusive delegate kit." },
    { q: "Is there an early bird discount?", a: "Yes, early bird discounts are available until 15 October 2026. Check the registration page for details." },
    { q: "Can I nominate my brand for the awards?", a: "Absolutely. Brand nominations are open until 1 November 2026 via the awards portal." },
    { q: "How is the jury constituted?", a: "The jury consists of independent, highly respected industry veterans and thought leaders." },
    { q: "Can we sponsor a specific award category?", a: "Yes, category-specific sponsorships are available. Please download our sponsorship brochure for details." },
    { q: "Do you offer group discounts?", a: "Yes, we offer special rates for groups of 3 or more delegates from the same organisation." },
    { q: "Are international delegates welcome?", a: "Yes! We welcome delegates from across the globe." },
    { q: "Which payment methods are accepted?", a: "We accept all major credit cards, bank transfers, and standard UPI payments." },
    { q: "Is the fee refundable?", a: "Registrations are non-refundable, but they are transferable to a colleague until 15 November 2026." },
    { q: "Will sessions be recorded?", a: "Yes, all keynotes and panel discussions will be recorded and shared with delegates post-event." },
    { q: "Is there a dress code?", a: "The dress code is business formal or smart casual." },
    { q: "How can my agency get involved?", a: "Agencies can participate as delegates, enter the awards, or explore our agency partner packages." },
    { q: "Do you support press and media accreditation?", a: "Yes, accredited journalists can apply for media passes. Please contact our PR team." },
    { q: "Where can I download the sponsorship brochure?", a: "The sponsorship brochure can be downloaded directly from the Sponsorship section of this website." },
    { q: "Can I use a coupon code?", a: "If you have a valid coupon code from a partner or sponsor, you can apply it during checkout." },
    { q: "How do I contact the organising team?", a: "You can reach us at hello@brandrcomm.com or through the contact form." },
    { q: "Who organises BRAND R.COMM?", a: "BRAND R.COMM is organised by Snail Integral, a specialized consulting firm for the agriculture and food ecosystem." }
  ];

  return (
    <section className="relative w-full py-12 md:py-16 bg-brand-surface text-brand-dark overflow-hidden border-b border-brand-primary/10">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        <div className="w-full flex flex-col items-center text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-2 mb-6 bg-brand-primary/10 py-1 px-3 md:px-4 rounded-full"
          >
            <span className="text-brand-primary tracking-[0.2em] text-[9px] md:text-[10px] font-bold uppercase">
              Frequently Asked
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-dark mb-4 max-w-2xl"
          >
            Answers to the twenty questions you were about to ask.
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2 mt-1"
          >
            <p className="text-brand-dark/70 text-xs md:text-sm max-w-md">
              Still curious? Our concierge team responds to every enquiry within one working day.
            </p>
            <a href="mailto:hello@brandrcomm.com" className="inline-flex items-center text-brand-primary font-bold text-[10px] md:text-xs tracking-[0.1em] uppercase hover:text-brand-dark transition-colors group mt-1 pb-1 border-b border-brand-primary/30 hover:border-brand-dark">
              Contact Concierge <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>
        </div>
        {/* Accordion */}
        <div className="w-full max-w-4xl">
          <div className="flex flex-col">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="group border-b border-brand-primary/10 last:border-b-0"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full py-5 md:py-6 px-2 md:px-4 flex items-center justify-between text-left focus:outline-none transition-colors duration-300 hover:bg-brand-primary/5 rounded-t-lg"
                  >
                    <div className="flex items-start md:items-center gap-4 md:gap-6">
                      <span className={`font-mono text-xs md:text-sm font-bold tracking-widest transition-colors duration-300 ${isOpen ? 'text-brand-primary' : 'text-brand-dark/40 group-hover:text-brand-primary/60'}`}>
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className={`text-base md:text-lg font-serif transition-all duration-300 ${isOpen ? 'text-brand-primary font-medium translate-x-2' : 'text-brand-dark group-hover:translate-x-1'}`}>
                        {faq.q}
                      </span>
                    </div>
                    <div className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-brand-primary/10 text-brand-primary rotate-180' : 'bg-transparent text-brand-dark/40 group-hover:bg-brand-primary/10 group-hover:text-brand-primary'}`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 px-2 md:px-4 pl-12 md:pl-[4.5rem] text-brand-dark/60 text-sm md:text-base leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
