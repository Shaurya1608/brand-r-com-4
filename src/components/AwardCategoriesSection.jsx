"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AwardCategoriesSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const categoryGroups = [
    {
      groupTitle: "Jury Choice Awards",
      groupDescription: "Recognizing exceptional leaders & organizations for their vision, innovation & impact.",
      categories: [
        { id: "01", title: "Lifetime Achievement Award", eligibility: "Honoring a stalwart for their unparalleled contribution." },
        { id: "02", title: "Voice of the Year Award", eligibility: "Recognizing influential thought leaders shaping narratives." },
        { id: "03", title: "Changemaker Award", eligibility: "AgChem Segment" },
        { id: "04", title: "Pioneer Award", eligibility: "Biological Segment" },
        { id: "05", title: "Growth Catalyst Award", eligibility: "Fertilizer Segment" },
        { id: "06", title: "NextGen Seed Award", eligibility: "Seed Industry Segment" },
        { id: "07", title: "Shakti Award", eligibility: "Female Leadership" },
        { id: "08", title: "Visionary Entrepreneur Award", eligibility: "Startup/Innovation" },
        { id: "09", title: "Policy Driver Award", eligibility: "Policy & Advocacy" },
        { id: "10", title: "Sustainability Champion Award", eligibility: "CSR & Sustainability" }
      ]
    },
    {
      groupTitle: "Nomination: Companies",
      groupDescription: "For Companies & their Initiatives.",
      categories: [
        { id: "11", title: "Company of the Year Award", eligibility: "For outstanding overall company performance." },
        { id: "12", title: "Emerging Company of the Year", eligibility: "For rapidly growing new companies." },
        { id: "13", title: "Best Outdoor Campaign Award", eligibility: "Excellence in OOH and outdoor marketing." },
        { id: "14", title: "Best Rural Engagement Award", eligibility: "Excellence in rural communication and engagement." },
        { id: "15", title: "Best PR Campaign Award", eligibility: "Outstanding public relations strategy and execution." },
        { id: "16", title: "Best Digital Marketing Award", eligibility: "Excellence in digital marketing and social media." },
        { id: "17", title: "Best Brand Campaign (TVC) Award", eligibility: "Best television or video commercial campaign." },
        { id: "18", title: "Best Integrated Communication Award", eligibility: "Excellence across multiple channels." }
      ]
    },
    {
      groupTitle: "Nomination: Individuals",
      groupDescription: "For Individuals & their Initiatives.",
      categories: [
        { id: "19", title: "Best Communicator Award (Male)", eligibility: "Outstanding individual communication skills." },
        { id: "20", title: "Best Communicator Award (Female)", eligibility: "Outstanding individual communication skills." },
        { id: "21", title: "AI Leadership Excellence Award", eligibility: "Excellence in leveraging AI for communication." }
      ]
    }
  ];

  return (
    <section className="relative w-full bg-brand-surface py-16 md:py-20 overflow-hidden">
      <div className="relative z-10 max-w-[65rem] mx-auto px-6 md:px-12">
        
        {/* Centered Header Layout */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-4xl flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="h-px w-8 bg-brand-primary/50" />
              <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                BRAND R.COMM AWARD CATEGORIES
              </span>
              <div className="h-px w-8 bg-brand-primary/50" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-dark mb-4">
                21 categories.<br />
                <span className="text-brand-primary italic">One benchmark.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mt-2"
            >
              <p className="text-brand-dark/70 text-sm leading-relaxed font-sans">
                Every category is defined with an unambiguous eligibility scope. If you're unsure, our secretariat is happy to help you pick the right one.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Tabs for Categories */}
        <div className="flex flex-col items-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categoryGroups.map((group, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab(idx);
                  setOpenIndex(null); // Reset accordion on tab switch
                }}
                className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                  activeTab === idx 
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                    : 'bg-transparent text-brand-dark/60 border-brand-primary/20 hover:border-brand-primary/50 hover:text-brand-primary'
                }`}
              >
                {group.groupTitle}
              </button>
            ))}
          </motion.div>

          {/* Active Tab Content */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col"
              >
                <div className="text-center mb-8">
                  <p className="text-brand-primary text-[10px] md:text-xs font-bold tracking-widest uppercase">{categoryGroups[activeTab].groupDescription}</p>
                </div>

                <div className="flex flex-col border-t border-brand-primary/10">
                  {categoryGroups[activeTab].categories.map((category) => {
                    const isOpen = openIndex === category.id;
                    
                    return (
                      <div 
                        key={category.id}
                        className="border-b border-brand-primary/10"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : category.id)}
                          className="w-full flex items-center justify-between py-4 md:py-5 text-left group"
                        >
                          <div className="flex items-center gap-4 md:gap-6 pr-4">
                            <span className={`text-[10px] md:text-xs font-bold tracking-wider transition-colors duration-300 ${isOpen ? 'text-brand-primary' : 'text-brand-dark/40 group-hover:text-brand-primary/60'}`}>
                              {category.id}
                            </span>
                            <h4 className={`text-base md:text-lg font-serif transition-colors duration-300 ${isOpen ? 'text-brand-primary' : 'text-brand-dark group-hover:text-brand-dark/80'}`}>
                              {category.title}
                            </h4>
                          </div>
                          
                          {/* Chevron icon */}
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex-shrink-0 ${isOpen ? 'text-brand-primary' : 'text-brand-dark/30 group-hover:text-brand-dark/50'}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </button>
                        
                        {/* Accordion Content */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pb-6 pl-10 md:pl-12 pr-4">
                                <h5 className="text-[10px] font-bold tracking-widest uppercase text-brand-primary mb-1">
                                  Eligibility / Focus
                               </h5>
                                <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed max-w-2xl">
                                  {category.eligibility}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </section>
  );
}
