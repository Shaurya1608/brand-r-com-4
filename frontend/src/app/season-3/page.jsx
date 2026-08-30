"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, User, Calendar, MapPin, Star, Mic, Users, Award, Handshake } from "lucide-react";
import Navbar from "@/components/Navbar";

const speakers = [
  { name: "Prof. RB Singh", role: "Former Chancellor, CAU Imphal", imgFile: "Sumit Gupta.jpg" }, // Just guessing some fallbacks or we rely on exact names
  { name: "Gijs Manneveld", role: "MD, EpiLogic GmbH", imgFile: "Mr. Gijs Manneveld.jpg" },
  { name: "Sushil Kumar Bahuguna", role: "Momentive Performance Materials", imgFile: "Mr. Sushil Kumar Bahuguna.jpg" },
  { name: "Sahil Malik", role: "Secretary General, NBIF" },
  { name: "Dr. Rajeev Dwivedi", role: "Business Manager, Novonesis", imgFile: "Dr. Rajeev Dwiwedi.jpg" },
  { name: "Dr. Shailendra Singh", role: "COO, Zydex Group", imgFile: "Dr. Shailendra Singh.jpg" },
  { name: "Muraari Agarwal", role: "Director, Atharva Agro Chemicals" },
  { name: "Mrinmoy Choudhury", role: "Director Marketing, Savannah Seeds" },
  { name: "Rajiv Choudhary", role: "Vice President, NBIF" },
  { name: "Debabrata Sarkar", role: "CMD, MicroAlgae Solutions", imgFile: "Mr. Debabrata Sarkar.jpg" },
  { name: "Dr. J.C. Majumdar", role: "Chief Scientific Advisor, CCFI" },
  { name: "Dr. Abhijit A. Pujari", role: "Director, SWAFE Bioworks", imgFile: "Dr. Abhijit A. Pujari.jpg" },
  { name: "Tanmaye Seth", role: "CEO, Aquagri Processing" },
  { name: "Amit Kumar Singh", role: "Sr. VP, Bharat Certis Agriscience" },
  { name: "Dinesh Singh", role: "Business Head Fertilisers, Reliance" },
  { name: "Manoj Varshney", role: "MD & CEO, IFFCO-MC Crop Science", imgFile: "Mr. Manoj Varshney.jpg" },
  { name: "Dushyant K. Tyagi", role: "CEO, Farmgate Technologies" },
  { name: "Navdeep Mehta", role: "Business Head, Gencrest" },
  { name: "Manas Tewari", role: "Biologicals Lead, Yara Fertilisers" },
  { name: "Dr. Bakul Joshi", role: "President & COO, T Stanes & Co." },
  { name: "Dr. Prafull Gadge", role: "CEO, Biome Technologies", imgFile: "Dr. Prafull Gadge.jpg" },
  { name: "Dr. A John Peter", role: "CMD, Varsha Bioscience", imgFile: "Dr. A John Peter.jpg" },
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
  { value: "5", label: "STAGE SESSIONS", icon: Mic },
  { value: "40+", label: "INDUSTRY SPEAKERS", icon: Users },
  { value: "20", label: "AWARDS CONFERRED", icon: Award },
  { value: "18+", label: "SPONSORS & PARTNERS", icon: Handshake }
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

const awards = [
  { category: "CORPORATE EXCELLENCE", title: "Company of the Year", winner: "Aries Agro Limited", desc: "Leadership in specialty plant nutrition with measurable, precision-driven farmer impact.", img: "Company of the year 2025 - Aries agro limited.JPG" },
  { category: "CORPORATE EXCELLENCE", title: "Emerging Company of the Year", winner: "Bharat Certis Agriscience Ltd.", desc: "Rapid build-out of a science-led organisation with strong R&D and export momentum.", img: "IMG_6902.JPG" },
  { category: "CAMPAIGN", title: "Best Outdoor Campaign", winner: "Varsha Bioscience & Technology", desc: "Made biological solutions visible and credible at the field level through local-language outreach.", img: "IMG_6906.JPG" },
  { category: "CAMPAIGN", title: "Best Rural Engagement", winner: "Gencrest Bio Products", desc: "'Khet Khilenge, Sapne Sajenge' blended mobility, retail activation and digital reach.", img: "IMG_6917.JPG" },
  { category: "CAMPAIGN", title: "Best PR Campaign", winner: "Insecticides India Limited", desc: "Turned a technical weed-management story into a nationwide conversation.", img: "IMG_6921.JPG" },
  { category: "CAMPAIGN", title: "Best Digital Marketing Award", winner: "JU Agri Sciences", desc: "Vernacular, data-led digital ecosystem setting new benchmarks for farmer connect.", img: "IMG_6926.JPG" },
  { category: "CAMPAIGN", title: "Best Brand Campaign (TVC)", winner: "UPL SAS Limited", desc: "Insight-led film that drove full farmer migration to a superior formulation.", img: "IMG_6936.JPG" },
  { category: "CAMPAIGN", title: "Best Integrated Communication", winner: "ICL India", desc: "'AgriReach 360' moved audiences from awareness to adoption across every channel.", img: "IMG_6940.JPG" },
  { category: "PEOPLE", title: "Best Communicator (Male)", winner: "R.K. Goyal — Verdesian USA", desc: "Simplified complex agri-science into clear, actionable insight across APAC.", img: "IMG_6948.JPG" }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" }
};

const SpeakerImage = ({ speaker }) => {
  const [error, setError] = useState(false);
  const src = speaker.imgFile ? `/speakers/${speaker.imgFile}` : `/speakers/${speaker.name}.jpg`;
  
  if (error) {
    return <User className="text-brand-primary/40 w-12 h-12" />;
  }
  
  return (
    <img 
      src={src} 
      alt={speaker.name} 
      className="w-full h-full object-cover" 
      onError={() => setError(true)} 
    />
  );
};

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          setCount(Math.floor((elapsedTime / duration) * numericValue));
          requestAnimationFrame(updateCounter);
        } else {
          setCount(numericValue);
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  }, [isInView, numericValue]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default function Season3Page() {
  return (
    <main className="min-h-screen bg-brand-surface text-brand-dark font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-brand-surface text-brand-dark overflow-hidden">
        {/* Abstract Background Gradient */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-3 text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              THIRD EDITION • POST EVENT RECAP
            </div>
            
            <div className="mb-6 flex justify-center">
              <img src="/logo/brand-r-comm-logo.png" alt="Brand R.Comm" className="h-16 md:h-20 object-contain" />
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.15] mb-6">
              Closing the knowledge gap, <br className="hidden md:block"/> <span className="text-brand-primary italic font-normal">from soil to market.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/80 max-w-2xl mx-auto leading-relaxed">
              BRAND R.Comm 2025 brought policymakers, scientists and India's top agri-input companies onto one stage to build a single idea — that farmer prosperity starts with communication that is clear, timely and trustworthy.
            </p>

            <div className="flex flex-col md:flex-row md:items-start justify-center gap-8 md:gap-12 mt-12 pt-8 border-t border-brand-primary/10 w-full">
              <div className="flex flex-col items-center text-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-brand-primary">
                  <Star size={18} />
                </div>
                <div>
                  <div className="text-brand-primary font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Event</div>
                  <div className="font-medium text-sm text-brand-dark leading-snug">BRAND R.Comm — Agriculture & Rural Communication Summit & Awards</div>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-16 bg-brand-primary/10 mt-2"></div>

              <div className="flex flex-col items-center text-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-brand-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-brand-primary font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Venue</div>
                  <div className="font-medium text-sm text-brand-dark leading-snug">Holiday Inn, Aerocity, New Delhi</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-16 bg-brand-primary/10 mt-2"></div>

              <div className="flex flex-col items-center text-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-brand-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-brand-primary font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Date</div>
                  <div className="font-medium text-sm text-brand-dark leading-snug">5 December 2025</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 bg-brand-primary py-10 border-y border-brand-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-0 divide-x divide-white/20"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="px-4 flex flex-col items-center text-center">
                  <Icon className="text-white/80 w-6 h-6 mb-4" />
                  <div className="text-4xl md:text-5xl font-sans font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Theme Section (Brand Surface Background to alternate) */}
      <section className="py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div {...fadeInUp} transition={{ duration: 0.6 }}>
              <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-4">The Theme</div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-6">
                Integrating Communication from Soil to Market
              </h2>
              <div className="text-base text-brand-dark/80 leading-relaxed space-y-5">
                <p>
                  The inaugural session set the tone for the day, opened with a ceremonial lamp lighting and Saraswati Vandana, and framed the summit's national and global outlook on agri-communication.
                </p>
                <p>
                  Policymakers, scientists and industry leaders agreed on one thing: India's agriculture doesn't lack innovation, it lacks last-mile communication. Across every session, the same thread returned — soil data, seed science and new chemistry only create impact once it reaches a farmer in language and timing they can trust.
                </p>
                <p>
                  The day moved through five focused conversations — soil and seed, crop protection, fertiliser innovation, biologicals, and a closing CEO outlook — before culminating in a Gala Awards Night recognising the people and companies driving that change.
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-brand-primary/10 relative">
              <div className="text-5xl text-brand-primary/20 font-serif absolute top-4 left-6">"</div>
              <p className="text-xl font-serif italic leading-relaxed text-brand-dark relative z-10 pt-2 mb-6">
                In this digital era, communication must reach the right person at the right time — the transfer of knowledge from lab to land is essential for our progress.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-surface flex items-center justify-center overflow-hidden border border-brand-primary/20">
                  <img src="/speakers/Mr. Amit BK Khare.jpg" alt="Amit BK Khare" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  <User className="text-brand-primary/50 hidden" size={24} />
                </div>
                <div>
                  <div className="font-bold text-sm uppercase tracking-wider text-brand-dark">Amit BK Khare</div>
                  <div className="text-xs text-brand-dark/60 font-mono mt-1">Founder & Managing Partner, Snail Integral</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agenda Section (White Background to alternate) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-12 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">On the day</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Six conversations, one throughline</h2>
            <p className="text-lg text-brand-dark/80">Each session built on the last — from the ground up, literally.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="bg-brand-surface p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-brand-primary/20"
              >
                <div className="text-brand-primary font-mono text-[10px] font-bold uppercase tracking-widest mb-3">{session.label}</div>
                <h3 className="text-lg font-bold font-serif leading-tight mb-3 text-brand-dark">{session.title}</h3>
                <p className="text-brand-dark/70 leading-relaxed text-sm">{session.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Section (Brand Surface Background to alternate) */}
      <section id="speakers" className="py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-16 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">Voices from the stage</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">32 leaders who shaped the conversation</h2>
            <p className="text-lg text-brand-dark/80">Scientists, CEOs and policy leaders who spoke across the day's five sessions.</p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
            {speakers.map((speaker, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                transition={{ delay: (i % 6) * 0.05 }}
                className="text-center group"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-white mb-3 overflow-hidden relative flex items-center justify-center border-[3px] border-transparent group-hover:border-brand-primary transition-colors duration-300">
                  <SpeakerImage speaker={speaker} />
                </div>
                <h3 className="font-bold text-sm md:text-base mb-1 text-brand-dark leading-snug">{speaker.name}</h3>
                <p className="text-xs text-brand-dark/70 leading-relaxed px-2">{speaker.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="py-24 bg-[#0B2114] text-brand-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">Gala Awards Night</div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">Recognising the builders of trust</h2>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              After a live performance by poet Dr. Varsha Singh, the evening honoured 20 companies and individuals across two categories — nomination-based and jury-based — for closing the gap between innovation and adoption.
            </p>
          </motion.div>

          {/* Lifetime Achievement */}
          <motion.div {...fadeInUp} className="bg-[#11311F] rounded-3xl overflow-hidden border border-brand-primary/20 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto">
                <img src="/Awards/IMG_6890.JPG" alt="Lifetime Achievement" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'; e.target.parentElement.classList.add('bg-brand-primary/10')}} />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-brand-primary font-mono text-xs font-bold uppercase tracking-widest mb-4">Highest Honour • Lifetime Achievement</div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Dr. R. G. Agarwal</h3>
                <div className="text-sm font-mono text-brand-primary/80 mb-6">Chairman Emeritus, Dhanuka Agritech Ltd.</div>
                <p className="text-white/70 leading-relaxed text-sm md:text-base">
                  Honoured for decades of contribution to India's agri-industry and an unwavering commitment to farmer empowerment. Unable to attend in person due to a family emergency, Dr. Agarwal shared his message and blessings through a video address that moved the room.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Nomination Awards Grid */}
          <div className="flex items-center justify-between border-b border-brand-primary/20 pb-4 mb-8">
            <h3 className="text-xl font-bold text-white">Nomination-Based Awards</h3>
            <span className="text-brand-primary font-mono text-xs uppercase tracking-widest">11 Winners</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp} 
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-[#11311F] rounded-2xl overflow-hidden border border-brand-primary/20 group hover:border-brand-primary transition-colors duration-300"
              >
                <div className="h-48 overflow-hidden bg-brand-primary/5">
                  <img src={`/Awards/${award.img}`} alt={award.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.style.display='none'} />
                </div>
                <div className="p-6">
                  <div className="text-brand-primary font-mono text-[10px] font-bold uppercase tracking-widest mb-2">{award.category}</div>
                  <h4 className="text-lg font-bold text-white mb-1 leading-snug">{award.title}</h4>
                  <div className="text-sm text-brand-primary/80 mb-4">{award.winner}</div>
                  <p className="text-white/60 text-xs leading-relaxed">{award.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12 border-t border-brand-primary/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="font-serif text-2xl font-bold mb-6 text-brand-surface">Snail Integral</div>
          <p className="text-white/50 text-sm">© {new Date().getFullYear()} Snail Integral. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
