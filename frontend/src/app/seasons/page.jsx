"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, MapPin, Award, Layers } from "lucide-react";

const seasons = [
  {
    edition: "Season 1",
    year: "2023",
    theme: "The Inception of Agri-Communication",
    location: "New Delhi, India",
    desc: "The landmark inaugural edition bringing together agriculture pioneers, rural communicators, and policy leaders.",
    href: "/seasons/season-1.html",
    external: true,
    badge: "1st Edition Archive",
    bgImage: "/IMG_5630.jpg"
  },
  {
    edition: "Season 2",
    year: "2024",
    theme: "Building Rural Trust & Digital Connect",
    location: "New Delhi, India",
    desc: "Deep-diving into vernacular outreach, digital farmer ecosystems, and sustainable crop protection strategies.",
    href: "/seasons/season-2",
    external: false,
    badge: "2nd Edition Archive",
    bgImage: "/IMG_5791.jpg"
  },
  {
    edition: "Season 3",
    year: "2025",
    theme: "Closing the Knowledge Gap: Soil to Market",
    location: "Holiday Inn, Aerocity, New Delhi",
    desc: "32+ industry speakers, 20 award winners, and 40+ top agri companies on one stage building trust-driven communication.",
    href: "/seasons/season-3",
    external: false,
    badge: "Latest Edition Recap",
    bgImage: "/IMG_5570.jpg"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function SeasonsHubPage() {
  return (
    <main className="min-h-screen bg-brand-surface text-brand-dark font-sans selection:bg-brand-primary selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-brand-primary/10 via-brand-surface to-brand-surface border-b border-brand-primary/10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-mono text-xs font-bold uppercase tracking-widest mb-4">
              <Layers className="w-3.5 h-3.5" />
              ARCHIVES & RECAPS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-dark leading-tight mb-4">
              BRAND R.COMM <span className="text-brand-primary italic font-normal">Past Editions</span>
            </h1>
            <p className="text-base md:text-lg text-brand-dark/75 max-w-2xl mx-auto leading-relaxed">
              Explore the journey, themes, key sessions, award winners, and recap galleries from each landmark season.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Seasons Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {seasons.map((season, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              transition={{ delay: index * 0.15 }}
              className="bg-white rounded-3xl overflow-hidden border border-brand-primary/15 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Cover */}
                <div className="h-52 relative overflow-hidden bg-brand-primary/10">
                  <img 
                    src={season.bgImage} 
                    alt={season.edition} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-dark font-mono text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                      {season.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#a3d95b] mb-1">{season.year} Summit</div>
                    <h2 className="text-2xl font-serif font-bold">{season.edition}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-brand-dark leading-snug group-hover:text-brand-primary transition-colors">
                      {season.theme}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs font-sans text-brand-dark/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>Season {index + 1} ({season.year})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>{season.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-dark/65 leading-relaxed font-sans">
                    {season.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  href={season.href}
                  target={season.external ? "_blank" : "_self"}
                  rel={season.external ? "noopener noreferrer" : ""}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold py-3 px-5 rounded-2xl transition-all shadow-md group-hover:shadow-lg"
                >
                  <span>Explore {season.edition}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
