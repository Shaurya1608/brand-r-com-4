"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lightbulb, Code2, PenTool, Megaphone } from "lucide-react";

export default function OrganiserSection() {
  const stats = [
    { value: "12+", label: "YEARS IN AGRI" },
    { value: "80+", label: "RETAINED BRANDS" },
    { value: "5", label: "INDUSTRY PLATFORMS" }
  ];

  const services = [
    {
      title: "Strategy & Consulting",
      description: "Market research, brand positioning, go-to-market strategy, and business development consulting for agriculture and allied sectors.",
      icon: <Lightbulb className="w-6 h-6 text-brand-primary" />
    },
    {
      title: "Digital & Technology",
      description: "Website development, digital marketing, social media management, SEO/SEM, and technology solutions for events and brands.",
      icon: <Code2 className="w-6 h-6 text-brand-primary" />
    },
    {
      title: "Content & Creative",
      description: "Content creation, graphic design, video production, branding, and creative communication for B2B and B2C audiences.",
      icon: <PenTool className="w-6 h-6 text-brand-primary" />
    },
    {
      title: "Communication & Activations",
      description: "PR, media relations, influencer engagement, on-ground activations, and experiential marketing.",
      icon: <Megaphone className="w-6 h-6 text-brand-primary" />
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 text-brand-dark overflow-hidden border-b border-brand-primary/10 bg-brand-surface">
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <div className="h-px w-6 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] md:text-xs font-bold uppercase">
              The Organiser
            </span>
            <div className="h-px w-6 bg-brand-primary" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-brand-dark mb-4"
          >
            Snail Integral.
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-serif text-brand-primary italic mb-6"
          >
            Slow craft. Sharp results.
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-brand-dark/70 leading-relaxed mb-12 text-sm md:text-base lg:text-lg"
          >
            Snail Integral Pvt. Ltd. is a leading agricultural communication and marketing solutions provider, dedicated to enhancing the visibility and impact of businesses in the agriculture and rural sectors. Guided by our tagline, "Visibility Matters," we offer a comprehensive range of services, including Brand Building, Strategic Marketing, Celebrity Management & TVC Film Production, Corporate Communication, Public Relation, Event Management, Content Creation, and Digital Outreach. Our expertise lies in bridging the gap between innovation and stakeholders, empowering clients to achieve sustainable growth while fostering collaboration among industry leaders, policymakers, and farmers. At Snail Integral, we believe in driving transformation through creative solutions and impactful storytelling, ensuring our partners stand out in an evolving agricultural landscape.
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 w-full"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl font-serif text-brand-primary mb-2">
                  {stat.value}
                </span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-bold text-brand-dark/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
          
        </div>

        {/* Services Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-16 md:mt-24"
        >
          {services.map((service, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start h-full bg-white p-6 md:p-8 rounded-2xl border border-brand-primary/10 hover:shadow-xl hover:shadow-brand-primary/5 hover:border-brand-primary/30 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-5 sm:mb-0 sm:mr-6 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                {React.cloneElement(service.icon, { className: "w-6 h-6 transition-colors duration-300 text-brand-primary group-hover:text-white" })}
              </div>
              <div className="flex flex-col flex-grow">
                <h4 className="text-lg font-bold text-brand-dark mb-2 leading-tight group-hover:text-brand-primary transition-colors duration-300">{service.title}</h4>
                <p className="text-sm text-brand-dark/70 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
