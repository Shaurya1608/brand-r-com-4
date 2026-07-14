"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SponsorshipSection() {
  const sponsorships = [
    {
      eyebrow: "CO-PRESENTING",
      slots: "2 SLOTS",
      title: "Powered By",
      price: "₹ 15,00,000",
      features: [
        "'Powered By' lock-up on all key event creatives and signage",
        "Panel host slot with brand-integrated introduction",
        "12 complimentary delegate passes + 3 VIP gala invitations",
        "Full-page brand feature in the Coffee Table Book",
        "Featured mention in all pre and post-event communication",
        "Branded photo-wall opportunity at the red carpet"
      ]
    },
    {
      eyebrow: "CATEGORY OWNER",
      slots: "1 SLOT",
      title: "Award Sponsor",
      price: "₹ 5,00,000",
      features: [
        "Naming rights of one flagship award category",
        "Trophy hand-over on stage by your senior leader",
        "Branded winner announcement clip across our channels",
        "5 complimentary delegate passes + 2 gala invitations",
        "Half-page feature in the Coffee Table Book"
      ]
    },
    {
      eyebrow: "EDITORIAL",
      slots: "1 SLOT",
      title: "Coffee Table Book Sponsor",
      price: "₹ 5,00,000",
      features: [
        "Exclusive sponsor of the BRAND R.COMM 2026 Coffee Table Book",
        "Foreword page with your leader's signed message",
        "Distribution to 3,000+ industry leaders across India",
        "4 complimentary delegate passes + 2 gala invitations"
      ]
    },
    {
      eyebrow: "2 PAGES",
      slots: "Unlimited",
      title: "Feature Yourself",
      price: "₹ 1,50,000",
      features: [
        "Two-page editorial feature inside the Coffee Table Book",
        "Design and copy support from our editorial team",
        "Digital PDF version to share across your channels",
        "2 complimentary delegate passes"
      ]
    }
  ];

  return (
    <section className="relative w-full bg-brand-surface py-24 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center max-w-3xl mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Exclusive Sponsorship
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-brand-dark mb-6"
          >
            Own the moment.<br />
            <span className="text-brand-primary italic">One category. One brand.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-dark/60 text-sm md:text-base leading-relaxed font-sans max-w-2xl"
          >
            The most visible positions at BRAND R.COMM 2026 — reserved for a single brand each. Every tier below is capped, and once taken, closed.
          </motion.p>
        </div>

        {/* Marquee Tier (Presented By) - Minimal List View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full bg-brand-primary/10 rounded-3xl p-8 md:p-12 lg:p-16 mb-16 flex flex-col lg:flex-row gap-12 justify-between"
        >
          <div className="flex-1 lg:max-w-md">
            <div className="flex items-center space-x-3 mb-6 text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase">
              <span>Marquee Title</span>
              <span>—</span>
              <span>1 Slot</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-serif text-brand-dark mb-3">Presented By</h3>
            <div className="text-2xl md:text-3xl font-serif text-brand-primary mb-6">₹ 20,00,000</div>
            <p className="text-brand-dark/60 text-sm leading-relaxed mb-10">
              Category-exclusive. No competing agri-title sponsor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-brand-dark text-white text-[10px] font-bold tracking-widest uppercase hover:bg-brand-primary transition-colors text-center rounded">
                APPLY NOW
              </button>
              <button className="px-6 py-3 border border-brand-primary/20 text-brand-dark text-[10px] font-bold tracking-widest uppercase hover:border-brand-primary transition-colors bg-white text-center rounded">
                DOWNLOAD BROCHURE
              </button>
            </div>
          </div>

          <div className="flex-1 lg:max-w-xl">
            <ul className="space-y-4">
              {[
                "'Presented By' lock-up alongside BRAND R.COMM 2026 on all creatives",
                "Opening 5-minute address by your Chairman / MD on the main stage",
                "Category-exclusive title rights (no competing agri-title sponsor)",
                "Full-page inside-cover feature in the Coffee Table Book",
                "20 complimentary delegate passes + 5 VIP gala invitations",
                "Branded lounge and dedicated meeting suite at the venue",
                "Priority mention in all press releases, mailers and post-event coverage"
              ].map((feature, i) => (
                <li key={i} className="flex items-start space-x-4">
                  <span className="text-brand-primary font-serif italic text-lg leading-none mt-0.5">&rsaquo;</span>
                  <span className="text-brand-dark/80 text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Other Tiers - Minimal Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {sponsorships.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col bg-brand-primary/5 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6 text-brand-dark/40 text-[10px] font-mono tracking-widest uppercase">
                <span>{tier.eyebrow}</span>
                <span>—</span>
                <span>{tier.slots}</span>
              </div>
              
              <h3 className="text-3xl font-serif text-brand-dark mb-2">{tier.title}</h3>
              <div className="text-xl font-serif text-brand-primary mb-8">{tier.price}</div>
              
              <ul className="space-y-3 mb-12 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-4">
                    <span className="text-brand-primary font-serif italic text-lg leading-none mt-0.5">&rsaquo;</span>
                    <span className="text-brand-dark/70 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-4 mt-auto">
                <button className="flex-1 py-3 bg-brand-primary text-white text-[10px] font-bold tracking-widest uppercase hover:bg-brand-primary-hover transition-colors text-center rounded shadow-sm hover:shadow-md">
                  APPLY
                </button>
                <button className="flex-1 py-3 border border-brand-primary/10 bg-white text-brand-dark/70 text-[10px] font-bold tracking-widest uppercase hover:border-brand-primary hover:text-brand-primary transition-colors text-center rounded">
                  BROCHURE
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
