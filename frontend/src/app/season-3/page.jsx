"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, User, Calendar, MapPin, Star, Mic, Users, Award, Handshake, Phone, Mail, Globe } from "lucide-react";
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
    label: "INAUGURAL",
    img: "inaugral-session.jpg"
  },
  {
    title: "Soil & Seed — Foundation of Growth",
    desc: "Soil data, seed law reform and affordable access named as the real bottlenecks.",
    label: "SESSION 01",
    img: "session1.jpg"
  },
  {
    title: "Agri-Input — Productivity with Responsibility",
    desc: "Chemicals and bio-solutions positioned as partners, not rivals, in crop protection.",
    label: "SESSION 02",
    img: "session2.jpg"
  },
  {
    title: "Fertiliser — Reimagining Nutrition",
    desc: "Nano-nutrients, net-zero targets and fortified produce for a healthier nation.",
    label: "SESSION 03",
    img: "session3.jpg"
  },
  {
    title: "Agri-Biologicals — Driving the Bio-Revolution",
    desc: "From inputs to intelligence, with regulation named as the biggest lever for scale.",
    label: "SESSION 04",
    img: "session4.jpg"
  },
  {
    title: "The Future of Agri & Rural Communication",
    desc: "A shared 2030 blueprint built on trust, IP protection and public-private synergy.",
    label: "CEO PANEL",
    img: "ceo-pannel.jpg"
  }
];

const awards = [
  { category: "CORPORATE EXCELLENCE", title: "Company of the Year", winner: "Aries Agro Limited", desc: "Leadership in specialty plant nutrition with measurable, precision-driven farmer impact.", img: "Company of the year 2025 - Aries agro limited.JPG" },
  { category: "CORPORATE EXCELLENCE", title: "Emerging Company of the Year", winner: "Bharat Certis Agriscience Ltd.", desc: "Rapid build-out of a science-led organisation with strong R&D and export momentum.", img: "IMG_6948.JPG" },
  { category: "CAMPAIGN", title: "Best Outdoor Campaign", winner: "Varsha Bioscience & Technology", desc: "Made biological solutions visible and credible at the field level through local-language outreach.", img: "IMG_6890.JPG" },
  { category: "CAMPAIGN", title: "Best Rural Engagement", winner: "Gencrest Bio Products", desc: "'Khet Khilenge, Sapne Sajenge' blended mobility, retail activation and digital reach.", img: "image.png" },
  { category: "CAMPAIGN", title: "Best PR Campaign", winner: "Insecticides India Limited", desc: "Turned a technical weed-management story into a nationwide conversation.", img: "IMG_6902.JPG" },
  { category: "CAMPAIGN", title: "Best Digital Marketing Award", winner: "JU Agri Sciences", desc: "Vernacular, data-led digital ecosystem setting new benchmarks for farmer connect.", img: "IMG_6906.JPG" },
  { category: "CAMPAIGN", title: "Best Brand Campaign (TVC)", winner: "UPL SAS Limited", desc: "Insight-led film that drove full farmer migration to a superior formulation.", img: "IMG_6917.JPG" },
  { category: "CAMPAIGN", title: "Best Integrated Communication", winner: "ICL India", desc: "'AgriReach 360' moved audiences from awareness to adoption across every channel.", img: "IMG_6921.JPG" },
  { category: "PEOPLE", title: "Best Communicator (Male)", winner: "R.K. Goyal — Verdesian USA", desc: "Simplified complex agri-science into clear, actionable insight across APAC.", img: "IMG_6926.JPG" },
  { category: "PEOPLE", title: "Best Communicator (Female)", winner: "Sarita Bahl", desc: "Connected business, policy and reputation with clarity across global organisations.", img: "IMG_6936.JPG" },
  { category: "INNOVATION", title: "AI Leadership Excellence", winner: "Coromandel International Limited", desc: "Pioneering immersive VR-based farmer education in crop protection.", img: "IMG_6940.JPG" }
];

const juryAwards = [
  { category: "INNOVATION", title: "NextGen Seed Award", winner: "Savannah Seeds Pvt. Ltd.", desc: "High-yielding, climate-resilient rice breeding shaping the sector's next decade.", img: "IMG_7084.JPG" },
  { category: "SUSTAINABILITY", title: "Sustainability Champion Award", winner: "Zydex Industries", desc: "Regenerative technologies restoring soil health and cutting chemical dependency.", img: "IMG_7020.JPG" },
  { category: "LEADERSHIP", title: "Growth Catalyst Award", winner: "Dinesh Singh — Reliance Industries", desc: "Scaling organic and circular-economy models across the fertiliser value chain.", img: "IMG_7032.JPG" },
  { category: "LEADERSHIP", title: "Visionary Entrepreneur Award", winner: "Dr. Manoj Kumar Rupa — Capsber Agriscience", desc: "Microbial and recombinant innovation aimed squarely at soil degradation.", img: "IMG_7045.JPG" },
  { category: "LEADERSHIP", title: "Shakti Award", winner: "Komal Shah Bhukhanwala — Sumil Industries", desc: "Scientific leadership advancing sustainable, low-residue agrochemical solutions.", img: "IMG_7037.JPG" },
  { category: "INNOVATION", title: "Pioneer Award", winner: "Debabrata Sarkar — MicroAlgae Solutions India", desc: "Positioned microalgae-based biologicals at the centre of climate-smart agriculture.", img: "IMG_7053.JPG" },
  { category: "LEADERSHIP", title: "Changemaker Award", winner: "Manoj Varshney — IFFCO-MC Crop Sciences", desc: "Steered a strategic shift toward integrated, farmer-centric crop solutions.", img: "IMG_7061.JPG" },
  { category: "POLICY", title: "Policy Driver Award", winner: "Rajvir Singh Rathi — Bayer CropScience", desc: "Sustained contribution to regulatory alignment and public-private collaboration.", img: "IMG_7069.JPG" },
  { category: "LEADERSHIP", title: "Voice of the Year", winner: "Ankur Aggarwal — Crystal Crop Protection", desc: "An influential industry voice shaping national conversations on responsible crop care.", img: "IMG_7078.JPG" }
];

const glimpseImages = ["1.JPG", "2.JPG", "3.JPG", "4.JPG"];

const clientLogos = Array.from({ length: 12 }, (_, i) => `/Client-Logo/c-logo-${i + 1}.jpg`);

const partnerGroups = [
  {
    category: "POWERED BY & SUPPORTED BY",
    partners: ["EpiLogic", "Novonesis"]
  },
  {
    category: "SPONSORS",
    partners: ["Momentive Performance Materials", "Thakar Chemicals Ltd.", "AquAgri Processing Pvt. Ltd."]
  },
  {
    category: "KIT • MEMENTO • LANYARD",
    partners: ["CCFI", "ACFI", "CropLife India"]
  },
  {
    category: "INDUSTRY ASSOCIATION PARTNERS",
    partners: ["BASAI", "BIPA", "NBIF"]
  },
  {
    category: "RESEARCH • MEDIA • STRATEGIC • GLOBAL",
    partners: [
      "Market Insight Consultants",
      "Fasal Kranti",
      "Pestology",
      "Ray Consulting",
      "Agri Network Consultancy",
      "BioAgTech World Congress & Expo",
      "Global BioAg Alliance"
    ]
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" }
};

const SpeakerImage = ({ speaker }) => {
  const [errorCount, setErrorCount] = useState(0);

  const getSrc = () => {
    if (errorCount === 0) {
      return `/brand_rcomm_32_speaker_images_named/${speaker.name}.jpg`;
    }
    if (errorCount === 1) {
      return speaker.imgFile ? `/speakers/${speaker.imgFile}` : `/speakers/${speaker.name}.jpg`;
    }
    return null;
  };

  const src = getSrc();

  if (!src || errorCount >= 2) {
    return <User className="text-brand-primary/40 w-10 h-10" />;
  }

  return (
    <img 
      src={src} 
      alt={speaker.name} 
      className="w-full h-full object-cover" 
      onError={() => setErrorCount((prev) => prev + 1)} 
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
      <section 
        className="relative pt-24 pb-16 md:pt-28 md:pb-20 text-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/bg-image/IMG_5468.JPG')` }}
      >
        {/* Rich Dark Overlay to darken background image */}
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 text-[#a3d95b] font-mono text-xs font-bold uppercase tracking-widest mb-6 shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#a3d95b] animate-pulse" />
              THIRD EDITION • POST EVENT RECAP
            </div>
            
            <div className="mb-6 flex justify-center">
              <img src="/logo/s3/Brand R.Comm 3 final logo-02.png" alt="Brand R.Comm" className="h-16 md:h-22 object-contain drop-shadow-xl" />
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-[1.2] mb-5 text-white drop-shadow-lg">
              Closing the knowledge gap, <br className="hidden md:block"/> <span className="text-[#a3d95b] italic font-normal">from soil to market.</span>
            </h1>
            <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow">
              BRAND R.Comm 2025 brought policymakers, scientists and India's top agri-input companies onto one stage to build a single idea — that farmer prosperity starts with communication that is clear, timely and trustworthy.
            </p>

            {/* Event Metadata Cards Grid (Transparent Glassmorphism) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              {/* Card 1: Event */}
              <div className="bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg hover:bg-black/40 hover:border-[#a3d95b]/50 transition-all flex items-center gap-4 text-left">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <Star size={18} />
                </div>
                <div>
                  <div className="text-[#a3d95b] font-mono text-[10px] font-bold uppercase tracking-widest mb-0.5">Event</div>
                  <div className="font-semibold text-xs text-white leading-snug">BRAND R.Comm Summit & Awards</div>
                </div>
              </div>
              
              {/* Card 2: Venue */}
              <div className="bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg hover:bg-black/40 hover:border-[#a3d95b]/50 transition-all flex items-center gap-4 text-left">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[#a3d95b] font-mono text-[10px] font-bold uppercase tracking-widest mb-0.5">Venue</div>
                  <div className="font-semibold text-xs text-white leading-snug">Holiday Inn, Aerocity, New Delhi</div>
                </div>
              </div>

              {/* Card 3: Date */}
              <div className="bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg hover:bg-black/40 hover:border-[#a3d95b]/50 transition-all flex items-center gap-4 text-left">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-[#a3d95b] font-mono text-[10px] font-bold uppercase tracking-widest mb-0.5">Date</div>
                  <div className="font-semibold text-xs text-white leading-snug">5 December 2025</div>
                </div>
              </div>
            </div>
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

            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-6">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-brand-primary/10 relative">
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
              </div>

              {/* Photo below quote card */}
              <div className="overflow-hidden rounded-2xl shadow-sm border border-brand-primary/10 group">
                <img 
                  src="/IMG_5750.jpg" 
                  alt="BRAND R.Comm Stage" 
                  className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 bg-brand-primary py-6 border-y border-brand-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x divide-white/20"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="px-4 flex flex-col items-center text-center">
                  <Icon className="text-white/80 w-5 h-5 mb-2" />
                  <div className="text-3xl md:text-4xl font-sans font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-[10px] md:text-[11px] font-mono font-bold text-white uppercase tracking-widest">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
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
                className="bg-brand-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-brand-primary/10 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 md:h-48 overflow-hidden bg-brand-primary/5 relative">
                    <img 
                      src={`/on-the-end/${session.img}`} 
                      alt={session.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-brand-primary font-mono text-[10px] font-bold uppercase tracking-widest mb-2">{session.label}</div>
                    <h3 className="text-lg font-bold font-serif leading-tight mb-2 text-brand-dark">{session.title}</h3>
                    <p className="text-brand-dark/70 leading-relaxed text-sm">{session.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section id="speakers" className="py-20 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-14 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-xs font-bold uppercase tracking-widest mb-2.5">
              Voices from the stage
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-brand-dark">
              32 leaders who shaped the conversation
            </h2>
            <p className="text-base text-brand-dark/75 leading-relaxed">
              Scientists, CEOs and policy leaders who spoke across the day's five sessions.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
            {speakers.map((speaker, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                transition={{ delay: (i % 6) * 0.03 }}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 relative border-2 border-brand-primary/10 group-hover:border-brand-primary transition-colors duration-300 shadow-sm bg-white flex items-center justify-center">
                  <SpeakerImage speaker={speaker} />
                </div>
                <h3 className="font-semibold text-sm md:text-base text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug mb-0.5">
                  {speaker.name}
                </h3>
                <p className="text-[11px] md:text-xs text-brand-dark/65 leading-relaxed font-sans font-medium px-1">
                  {speaker.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="py-24 bg-white text-brand-dark">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-16">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">Gala Awards Night</div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-brand-dark">Recognising the builders of trust</h2>
            <p className="text-lg text-brand-dark/70 max-w-2xl leading-relaxed">
              After a live performance by poet Dr. Varsha Singh, the evening honoured 20 companies and individuals across two categories — nomination-based and jury-based — for closing the gap between innovation and adoption.
            </p>
          </motion.div>

          {/* Lifetime Achievement */}
          <motion.div {...fadeInUp} className="bg-brand-surface rounded-3xl overflow-hidden border border-brand-primary/10 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto">
                <img src="/Awards/IMG_6890.JPG" alt="Lifetime Achievement" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'; e.target.parentElement.classList.add('bg-brand-primary/10')}} />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-brand-primary font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">Highest Honour • Lifetime Achievement</div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-2">Dr. R. G. Agarwal</h3>
                <div className="text-xs md:text-sm font-sans font-medium text-brand-primary/80 mb-6">Chairman Emeritus, Dhanuka Agritech Ltd.</div>
                <p className="text-brand-dark/70 leading-relaxed text-xs md:text-sm">
                  Honoured for decades of contribution to India's agri-industry and an unwavering commitment to farmer empowerment. Unable to attend in person due to a family emergency, Dr. Agarwal shared his message and blessings through a video address that moved the room.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Nomination Awards Grid */}
          <div className="flex items-center justify-between border-b border-brand-primary/10 pb-4 mb-8">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-dark">Nomination-Based Awards</h3>
            <span className="text-brand-primary font-mono text-[10px] md:text-xs uppercase tracking-widest">11 Winners</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp} 
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-brand-surface rounded-2xl overflow-hidden border border-brand-primary/10 group hover:border-brand-primary/50 transition-colors duration-300"
              >
                <div className="h-48 overflow-hidden bg-white">
                  <img src={`/brand_rcomm_award_images_named/${award.title}.jpg`} alt={award.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = `/Awards/${award.img}`; }} />
                </div>
                <div className="p-5 md:p-6">
                  <div className="text-brand-primary font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1.5">{award.category}</div>
                  <h4 className="text-lg font-serif font-bold text-brand-dark mb-1 leading-snug">{award.title}</h4>
                  <div className="text-xs font-sans font-medium text-brand-primary/80 mb-3">{award.winner}</div>
                  <p className="text-brand-dark/60 text-[11px] leading-relaxed">{award.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Jury-Based Awards Grid */}
          <div className="flex items-center justify-between border-b border-brand-primary/10 pb-4 mb-8 mt-20">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-dark">Jury-Based Awards</h3>
            <span className="text-brand-primary font-mono text-[10px] md:text-xs uppercase tracking-widest">9 Winners</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {juryAwards.map((award, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp} 
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-brand-surface rounded-2xl overflow-hidden border border-brand-primary/10 group hover:border-brand-primary/50 transition-colors duration-300"
              >
                <div className="h-48 overflow-hidden bg-white">
                  <img src={`/brand_rcomm_award_images_named/${award.title}.jpg`} alt={award.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = `/Awards/${award.img}`; }} />
                </div>
                <div className="p-5 md:p-6">
                  <div className="text-brand-primary font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1.5">{award.category}</div>
                  <h4 className="text-lg font-serif font-bold text-brand-dark mb-1 leading-snug">{award.title}</h4>
                  <div className="text-xs font-sans font-medium text-brand-primary/80 mb-3">{award.winner}</div>
                  <p className="text-brand-dark/60 text-[11px] leading-relaxed">{award.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Glimpses Section */}
      <section id="glimpses" className="py-24 bg-brand-surface text-brand-dark">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-12">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">GLIMPSES</div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-brand-dark">From the floor</h2>
            <p className="text-lg text-brand-dark/70 max-w-2xl leading-relaxed">
              The CEO panel, the audience, and the rooms where these conversations happened.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {glimpseImages.map((img, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp} 
                transition={{ delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl shadow-sm border border-brand-primary/10 hover:shadow-md transition-shadow duration-300"
              >
                <img src={`/Glimpse/${img}`} alt={`Glimpse ${i+1}`} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gratitude & Partners Section */}
      <section id="partners" className="py-24 bg-white text-brand-dark border-t border-brand-primary/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-16 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">GRATITUDE</div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-brand-dark">
              Backed by the industry, <span className="text-brand-primary italic font-normal">for the industry</span>
            </h2>
            <p className="text-lg text-brand-dark/70 leading-relaxed">
              BRAND R.Comm 2025 was made possible by 18+ sponsors and partners across research, media and policy.
            </p>
          </motion.div>

          {/* Client Logos Grid */}
          <div className="mb-16">
            <h3 className="text-xs font-mono font-bold text-brand-primary/70 uppercase tracking-widest mb-6 text-center">Featured Ecosystem Partners</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {clientLogos.map((logo, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-brand-surface p-4 rounded-xl border border-brand-primary/10 flex items-center justify-center h-24 shadow-xs hover:shadow-md hover:border-brand-primary/30 transition-all group"
                >
                  <img 
                    src={logo} 
                    alt={`Partner Logo ${index + 1}`} 
                    className="max-h-16 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100" 
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Categorized Partners List with Premium Cards */}
          <div className="space-y-6 max-w-5xl mx-auto">
            {partnerGroups.map((group, gIdx) => (
              <motion.div key={gIdx} {...fadeInUp} className="bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-primary/10 hover:border-brand-primary/20 transition-all">
                <div className="text-brand-primary font-mono text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-primary" />
                  {group.category}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {group.partners.map((partner, pIdx) => (
                    <span 
                      key={pIdx}
                      className="px-4 py-2 bg-white rounded-lg text-xs md:text-sm font-medium text-brand-dark border border-brand-primary/10 shadow-2xs hover:border-brand-primary hover:text-brand-primary transition-all duration-200 cursor-default"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-surface text-brand-dark pt-10 pb-8 border-t border-brand-primary/15">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top CTA Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-brand-primary/10">
            <div>
              <div className="text-brand-primary font-mono text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                LOOKING AHEAD
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark max-w-xl leading-snug">
                See you at the fourth edition of <span className="text-brand-primary italic font-normal">BRAND R.Comm.</span>
              </h2>
            </div>

            <div className="shrink-0">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-sans font-bold text-xs rounded-full shadow-sm hover:shadow transition-all duration-300 hover:scale-105 group"
              >
                <span>Partner With Us</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Middle Info Columns (Compact & Minimal) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-brand-primary/10">
            {/* Column 1: Snail Integral Address */}
            <div className="space-y-2">
              <div className="text-brand-primary font-mono text-[9px] font-bold uppercase tracking-widest">Organizer</div>
              <h3 className="font-serif font-bold text-base text-brand-dark">Snail Integral</h3>
              <p className="leading-relaxed text-brand-dark/70 text-xs font-sans">
                Q-170141, 14th Avenue, Gaur City-2<br />
                Noida Extension, Uttar Pradesh, India
              </p>
            </div>

            {/* Column 2: Contact Info */}
            <div className="space-y-2">
              <div className="text-brand-primary font-mono text-[9px] font-bold uppercase tracking-widest">Contact & Inquiries</div>
              <div className="space-y-1.5 text-xs font-sans text-brand-dark/80 font-medium">
                <p>
                  <a href="tel:+919354342588" className="hover:text-brand-primary transition-colors inline-flex items-center gap-1.5">
                    <Phone size={13} className="text-brand-primary" />
                    <span>+91 93543 42588</span>
                  </a>
                </p>
                <p>
                  <a href="tel:+918750807676" className="hover:text-brand-primary transition-colors inline-flex items-center gap-1.5">
                    <Phone size={13} className="text-brand-primary" />
                    <span>+91 87508 07676</span>
                  </a>
                </p>
                <p>
                  <a href="mailto:info@snailintegral.com" className="hover:text-brand-primary transition-colors inline-flex items-center gap-1.5">
                    <Mail size={13} className="text-brand-primary" />
                    <span>info@snailintegral.com</span>
                  </a>
                </p>
              </div>
            </div>

            {/* Column 3: Web */}
            <div className="space-y-2">
              <div className="text-brand-primary font-mono text-[9px] font-bold uppercase tracking-widest">Official Website</div>
              <p className="text-xs text-brand-dark/70">
                Explore our initiatives, recap videos, and summit updates.
              </p>
              <div>
                <a 
                  href="https://www.snailintegral.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primary-hover transition-colors border-b border-brand-primary/30 pb-0.5"
                >
                  <Globe size={13} />
                  <span>www.snailintegral.com</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[9px] md:text-[10px] font-mono tracking-wider text-brand-dark/50 uppercase">
            <div>© 2025 SNAIL INTEGRAL PVT. LTD. — ALL RIGHTS RESERVED</div>
            <div>BRAND R.COMM AGRICULTURE & RURAL COMMUNICATION SUMMIT & AWARDS</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
