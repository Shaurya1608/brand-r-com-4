"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

const speakers = [
  { name: "Prof. RB Singh", role: "Former Chancellor, CAU Imphal" },
  { name: "Gijs Manneveld", role: "MD, EpiLogic GmbH" },
  { name: "Sushil Kumar Bahuguna", role: "Momentive Performance Materials" },
  { name: "Sahil Malik", role: "Secretary General, NBIF" },
  { name: "Dr. Rajeev Dwivedi", role: "Business Manager, Novonesis" },
  { name: "Dr. Shailendra Singh", role: "COO, Zydex Group" },
  { name: "Muraari Agarwal", role: "Director, Atharva Agro Chemicals" },
  { name: "Mrinmoy Choudhury", role: "Director Marketing, Savannah Seeds" },
  { name: "Rajiv Choudhary", role: "Vice President, NBIF" },
  { name: "Debabrata Sarkar", role: "CMD, MicroAlgae Solutions" },
  { name: "Dr. J.C. Majumdar", role: "Chief Scientific Advisor, CCFI" },
  { name: "Dr. Abhijit A. Pujari", role: "Director, SWAFE Bioworks" },
  { name: "Tanmaye Seth", role: "CEO, Aquagri Processing" },
  { name: "Amit Kumar Singh", role: "Sr. VP, Bharat Certis Agriscience" },
  { name: "Dinesh Singh", role: "Business Head Fertilisers, Reliance" },
  { name: "Manoj Varshney", role: "MD & CEO, IFFCO-MC Crop Science" },
  { name: "Dushyant K. Tyagi", role: "CEO, Farmgate Technologies" },
  { name: "Navdeep Mehta", role: "Business Head, Gencrest" },
  { name: "Manas Tewari", role: "Biologicals Lead, Yara Fertilisers" },
  { name: "Dr. Bakul Joshi", role: "President & COO, T Stanes & Co." },
  { name: "Dr. Prafull Gadge", role: "CEO, Biome Technologies" },
  { name: "Dr. A John Peter", role: "CMD, Varsha Bioscience" },
  { name: "Ravish Singh", role: "Head Marketing, SML Limited" },
  { name: "Shantwana Dixit", role: "Policy Advocacy, UPL Limited" },
  { name: "Rajvir Singh Rathi", role: "Director, Bayer CropScience" },
  { name: "Rajesh Aggarwal", role: "MD, Insecticides India Limited" },
  { name: "Dr. Rahul Mirchandani", role: "CMD, Aries Agro Limited" },
  { name: "Sudheer Godara", role: "CEO, Scimplify" },
  { name: "Ankur Aggarwal", role: "Executive Chairman, Crystal Crop" },
  { name: "Anant Kulkarni", role: "President & CEO, ICL India" },
  { name: "Toru Tamura", role: "MD, Bharat Certis Agriscience" },
  { name: "Virendra Goswami", role: "Country Head, Tessenderlo Kerley" }
];

const stats = [
  { value: "5", label: "STAGE SESSIONS" },
  { value: "40+", label: "INDUSTRY SPEAKERS" },
  { value: "20", label: "AWARDS CONFERRED" },
  { value: "18+", label: "SPONSORS & PARTNERS" }
];

const sessions = [
  {
    title: "Soil to Market — National & Global Outlook",
    desc: "Trust-driven communication framed as essential to unlocking India's agri-export potential.",
    label: "INAUGURAL"
  },
  {
    title: "Soil & Seed — Foundation of Growth",
    desc: "Soil data, seed law reform and affordable access named as the real bottlenecks.",
    label: "SESSION 01"
  },
  {
    title: "Agri-Input — Productivity with Responsibility",
    desc: "Chemicals and bio-solutions positioned as partners, not rivals, in crop protection.",
    label: "SESSION 02"
  },
  {
    title: "Fertiliser — Reimagining Nutrition",
    desc: "Nano-nutrients, net-zero targets and fortified produce for a healthier nation.",
    label: "SESSION 03"
  },
  {
    title: "Agri-Biologicals — Driving the Bio-Revolution",
    desc: "From inputs to intelligence, with regulation named as the biggest lever for scale.",
    label: "SESSION 04"
  },
  {
    title: "The Future of Agri & Rural Communication",
    desc: "A shared 2030 blueprint built on trust, IP protection and public-private synergy.",
    label: "CEO PANEL"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" }
};

export default function Season3Page() {
  return (
    <main className="min-h-screen bg-[#F5F2EB] text-[#0A0A0A] font-sans selection:bg-[#5e8e33] selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#5e8e33] flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">S</div>
            <span className="font-serif text-2xl font-bold text-[#F5F2EB]">Snail Integral</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-[#F5F2EB]/80 tracking-wide">
            <a href="#speakers" className="hover:text-[#5e8e33] transition-colors">Speakers</a>
            <a href="#awards" className="hover:text-[#5e8e33] transition-colors">Awards</a>
            <a href="#partners" className="hover:text-[#5e8e33] transition-colors">Partners</a>
          </div>
          <Link href="/" className="bg-[#5e8e33] hover:bg-[#4a7228] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2">
            Next Edition <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 bg-[#0A0A0A] text-[#F5F2EB] overflow-hidden">
        {/* Abstract Background Gradient */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#5e8e33]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 text-[#5e8e33] font-mono text-sm font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-[#5e8e33]" />
              THIRD EDITION • POST EVENT RECAP
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] mb-8">
              Closing the knowledge gap, <span className="text-[#5e8e33] italic font-normal">from soil to market.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed mb-16">
              BRAND R.Comm 2025 brought policymakers, scientists and India's top agri-input companies onto one stage to build a single idea — that farmer prosperity starts with communication that is clear, timely and trustworthy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-[#5e8e33] font-mono text-xs font-bold uppercase tracking-wider mb-2">Event</div>
                <div className="font-semibold text-lg">BRAND R.Comm — Agriculture & Rural Communication Summit & Awards</div>
              </div>
              <div>
                <div className="text-[#5e8e33] font-mono text-xs font-bold uppercase tracking-wider mb-2">Venue</div>
                <div className="font-semibold text-lg">Holiday Inn, Aerocity, New Delhi</div>
              </div>
              <div>
                <div className="text-[#5e8e33] font-mono text-xs font-bold uppercase tracking-wider mb-2">Date</div>
                <div className="font-semibold text-lg">5 December 2025</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-12 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl shadow-black/5 p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100"
        >
          {stats.map((stat, i) => (
            <div key={i} className="px-4 text-center">
              <div className="text-4xl md:text-6xl font-serif font-bold text-[#0A0A0A] mb-3">{stat.value}</div>
              <div className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Theme Section */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeInUp} transition={{ duration: 0.6 }}>
            <div className="text-[#5e8e33] font-mono text-sm font-bold uppercase tracking-widest mb-6">The Theme</div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-8">
              Integrating Communication from Soil to Market
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-6">
                The inaugural session set the tone for the day, opened with a ceremonial lamp lighting and Saraswati Vandana, and framed the summit's national and global outlook on agri-communication.
              </p>
              <p className="mb-6">
                Policymakers, scientists and industry leaders agreed on one thing: India's agriculture doesn't lack innovation, it lacks last-mile communication. Across every session, the same thread returned — soil data, seed science and new chemistry only create impact once it reaches a farmer in language and timing they can trust.
              </p>
              <p>
                The day moved through five focused conversations — soil and seed, crop protection, fertiliser innovation, biologicals, and a closing CEO outlook — before culminating in a Gala Awards Night recognising the people and companies driving that change.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white p-10 md:p-12 rounded-3xl shadow-lg shadow-black/5 border border-gray-100 relative">
            <div className="text-6xl text-[#5e8e33]/20 font-serif absolute top-6 left-8">"</div>
            <p className="text-2xl font-serif italic leading-relaxed text-[#0A0A0A] relative z-10 pt-4 mb-8">
              In this digital era, communication must reach the right person at the right time — the transfer of knowledge from lab to land is essential for our progress.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <User className="text-gray-400" size={24} />
              </div>
              <div>
                <div className="font-bold text-sm uppercase tracking-wider">Amit BK Khare</div>
                <div className="text-xs text-gray-500 font-mono mt-1">Founder & Managing Partner, Snail Integral</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-24 bg-[#EAE5D9]/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="text-[#5e8e33] font-mono text-sm font-bold uppercase tracking-widest mb-4">On the day</div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Six conversations, one throughline</h2>
            <p className="text-xl text-gray-700">Each session built on the last — from the ground up, literally.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                <div className="text-[#5e8e33] font-mono text-xs font-bold uppercase tracking-widest mb-4">{session.label}</div>
                <h3 className="text-xl font-bold font-serif leading-tight mb-4">{session.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{session.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section id="speakers" className="py-32 max-w-7xl mx-auto px-6">
        <motion.div {...fadeInUp} className="mb-20 text-center max-w-3xl mx-auto">
          <div className="text-[#5e8e33] font-mono text-sm font-bold uppercase tracking-widest mb-4">Voices from the stage</div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">32 leaders who shaped the conversation</h2>
          <p className="text-xl text-gray-700">Scientists, CEOs and policy leaders who spoke across the day's five sessions.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {speakers.map((speaker, i) => (
            <motion.div 
              key={i}
              {...fadeInUp}
              transition={{ delay: (i % 4) * 0.1 }}
              className="text-center group"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gray-200 mb-6 overflow-hidden relative flex items-center justify-center border-4 border-transparent group-hover:border-[#5e8e33] transition-colors duration-300">
                <User className="text-gray-400 w-16 h-16" />
                {/* 
                  When you have the actual images, replace the User icon with this:
                  <img src={`/seasons/images/speakers/speaker-${i+1}.jpg`} alt={speaker.name} className="w-full h-full object-cover" />
                */}
              </div>
              <h3 className="font-bold text-lg mb-2">{speaker.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">{speaker.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="font-serif text-2xl font-bold mb-6">Snail Integral</div>
          <p className="text-white/50 text-sm">© {new Date().getFullYear()} Snail Integral. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
