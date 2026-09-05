"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, User, Calendar, MapPin, Star, Mic, Users, Award, Phone, Mail, Globe, X, ChevronLeft, ChevronRight, FileText, Download } from "lucide-react";
import Navbar from "@/components/Navbar";

// ==========================================
// SEASON 1 DATA (EDITABLE WIREFRAME TEMPLATE)
// ==========================================

const stats = [
  { value: "150+", label: "DELEGATES", icon: Users },
  { value: "35+", label: "SPEAKERS ON STAGE", icon: Mic },
  { value: "31,200+", label: "DIGITAL IMPRESSIONS", icon: Globe },
  { value: "50+", label: "MEDIA COVERAGES", icon: Award }
];

const sessions = [
  {
    label: "01 — INAUGURAL SESSION",
    title: "Formulating a Roadmap for Rural Communications",
    desc: "Addressing socio-economic conditions and cultural specifics of rural communities to align communication with sustainable development agendas.",
    img: "/IMG_5630.jpg"
  },
  {
    label: "02 — PANEL 01",
    title: "Science of Communication — 'Land to Lab' & 'Lab to Land'",
    desc: "Understanding and bridging communication gaps between rural farming environments and research laboratories to foster collaboration and innovation.",
    img: "/IMG_5791.jpg"
  },
  {
    label: "03 — PANEL 02",
    title: "AI, Digital Infrastructure & Financial Credit Communication",
    desc: "Leveraging Artificial Intelligence, technology for last-mile connectivity, and digital infrastructure to optimize agricultural credit outreach.",
    img: "/IMG_5570.jpg"
  },
  {
    label: "04 — PANEL 03",
    title: "Media Trends 2024 — Shaping the Way Brands Communicate",
    desc: "Harnessing User-Generated Content (UGC), AR/VR tech, and inclusive channels to build trust and community engagement in rural branding.",
    img: "/IMG_5750.jpg"
  },
  {
    label: "05 — PANEL 04",
    title: "Vocal for Local — Level Up Communication Strategy",
    desc: "Elevating communication strategies prioritizing authenticity, digital engagement, community outreach, and nationwide campaign scaling.",
    img: "/IMG_5630.jpg"
  },
  {
    label: "06 — KEYNOTES & FUTURE PROSPECTS",
    title: "Brand Keynotes & CEO Future Prospects Panel",
    desc: "Keynotes by KREPL (50 Years Saga), CCFI, Thakar Chemicals, and CEO Panel examining environmental impact and bridging the digital divide.",
    img: "/IMG_5791.jpg"
  }
];

const reachStats = [
  {
    category: "DELEGATES",
    value: "150+ Senior Leaders",
    desc: "Top executives, agribusiness heads, scientists, and policy experts gathered at Holiday Inn, Aerocity, New Delhi.",
    icon: Users
  },
  {
    category: "DIGITAL REACH",
    value: "31,223+ Impressions",
    desc: "Targeted digital campaigns generating 4,661+ direct reach and engagement across agricultural audiences.",
    icon: Globe
  },
  {
    category: "MEDIA & PR",
    value: "50+ Imprint Coverages",
    desc: "Prominent print & digital coverage in Pestology, Krishak Jagat, plus 20+ media interactions & interviews.",
    icon: FileText
  },
  {
    category: "EXCELLENCE HONOURS",
    value: "7+ Award Categories",
    desc: "Inaugural awards honoring Lifetime Achievement, TVC campaigns, Digital Marketing, PR, and Rural Engagement.",
    icon: Award
  }
];

const season1Speakers = [
  { name: "Dr. RB Singh", role: "Former VC, CAU Imphal", imgFile: "Dr. RB SIngh.jpg" },
  { name: "Dr. KC Ravi", role: "Chairman, CropLife India", imgFile: "Dr. KC Ravi.jpg" },
  { name: "Dr. Arvind Kumar", role: "Former VC, RLBCAU, Jhansi", imgFile: "Dr. Arvind Kumar.jpg" },
  { name: "Vijay Sardana", role: "Advocate, Supreme Court of India", imgFile: "Vijay Sardana.jpg" },
  { name: "Shri Suresh Reddy", role: "President, Krishi Rasayan Exports", imgFile: "Raj Kumar Gupta.jpg" },
  { name: "Harish Mehta", role: "Sr. Advisor, Crop Care Federation of India", imgFile: "Harish Mehta.jpg" },
  { name: "Sumit Gupta", role: "Director (Projects), Thakar Chemicals Ltd.", imgFile: "Raj Kumar Gupta.jpg" },
  { name: "Anil Dhingra", role: "Managing Director, IFFCO - MC", imgFile: "Anil Dhingra.jpg" },
  { name: "Rajesh Aggarwal", role: "MD, Insecticides India Ltd.", imgFile: "Rajesh Aggarwal.jpg" },
  { name: "Rajvir Rathi", role: "Director Public Affairs, Bayer", imgFile: "Rajvir Rathi.jpg" },
  { name: "Sunil Sihag", role: "MD, Synergy Technofin", imgFile: "Sunil Sihag.jpg" },
  { name: "Dr. Shailendra Singh", role: "COO, Zydex Industries", imgFile: "Dr. Shailendra Singh.jpg" },
  { name: "Raju Kapoor", role: "Director, FMC India", imgFile: "Raju Kapoor.jpg" }
];

const season1JuryWinners = [
  {
    award: "LIFETIME ACHIEVEMENT AWARD 2024",
    name: "DR. RB SINGH",
    title: "Renowned Agricultural Scientist & Former Chancellor,",
    company: "Central Agricultural University (CAU), Imphal",
    image: "/Awards/LIFETIME ACHIEVEMENT AWARD 2024-Dr. RB SINGH.jpeg"
  }
];

const season1NominationWinners = [
  {
    award: "RURAL ENGAGEMENT AWARD 2024",
    name: "CROP CARE FEDERATION OF INDIA (CCFI)",
    company: "Crop Care Federation of India",
    image: "/others/CropLife India.JPG.jpeg"
  },
  {
    award: "INTEGRATED COMMUNICATION AWARD 2024",
    name: "CROPLIFE INDIA",
    company: "CropLife India",
    image: "/others/CropLife India.JPG.jpeg"
  },
  {
    award: "BRAND CAMPAIGN (TVC) AWARD 2024",
    name: "KRISHI RASAYAN EXPORTS (KREPL)",
    company: "Krishi Rasayan Export Pvt. Ltd.",
    image: "/others/Krishi Rasayan.JPG.jpeg"
  },
  {
    award: "DIGITAL MARKETING AWARD 2024",
    name: "DHANESHA CROP SCIENCE",
    company: "Dhanesha Crop Science",
    image: "/others/Dhanesha Crop Science.JPG.jpeg"
  },
  {
    award: "PR CAMPAIGN AWARD 2024",
    name: "THAKAR CHEMICALS LIMITED",
    company: "Thakar Chemicals Limited",
    image: "/others/Syngenta.JPG.jpeg"
  },
  {
    award: "EMERGING PARTICIPANT FOR RURAL ENGAGEMENT",
    name: "SYNERGY TECHNOFIN & ZYDEX",
    company: "Synergy Technofin / Zydex Industries",
    image: "/others/Dhanesha Crop Science.JPG.jpeg"
  }
];

const galleryImages = [
  { src: "/IMG_5630.jpg", title: "Inaugural Summit Stage Keynote" },
  { src: "/IMG_5791.jpg", title: "Panel Discussion & Knowledge Exchange" },
  { src: "/IMG_5570.jpg", title: "Audience & Senior Industry Leaders" },
  { src: "/IMG_5750.jpg", title: "Awards Night & Presentation" },
  { src: "/IMG_5630.jpg", title: "Thought Leadership & Dialogue" },
  { src: "/IMG_5791.jpg", title: "Gala Networking & Collaboration" }
];

const backdropSponsors = {
  sponsors: [
    { name: "Zydex", src: "/season-2/brand_rcomm_2024_sponsor_logos/Zydex.png" },
    { name: "AGMA", src: "/season-2/brand_rcomm_2024_sponsor_logos/agma.png" }
  ],
  associations: [
    { name: "CCFI", src: "/season-2/brand_rcomm_2024_sponsor_logos/CCFI.png" },
    { name: "ACFI", src: "/season-2/brand_rcomm_2024_sponsor_logos/ACFI.png" },
    { name: "CropLife India", src: "/season-2/brand_rcomm_2024_sponsor_logos/Crop Life India.png" }
  ],
  associateSponsors: [
    { name: "Yara", src: "/season-2/brand_rcomm_2024_sponsor_logos/yara copy.png" },
    { name: "INERA", src: "/season-2/brand_rcomm_2024_sponsor_logos/inera.png" },
    { name: "Syngenta", src: "/season-2/brand_rcomm_2024_sponsor_logos/sygenta.png" },
    { name: "Bayer", src: "/season-2/brand_rcomm_2024_sponsor_logos/Bayer.png" }
  ],
  mediaPartners: [
    { name: "Krishi Jagran", src: "/season-2/brand_rcomm_2024_sponsor_logos/kj.png" },
    { name: "Krishak Jagat", src: "/season-2/brand_rcomm_2024_sponsor_logos/krishak.jpeg" }
  ],
  researchPartners: [
    { name: "Market Insight Consultants", src: "/season-2/brand_rcomm_2024_sponsor_logos/Market Insight Consultants.png" }
  ],
  knowledgePartners: [
    { name: "Synergy Technofin", src: "/season-2/brand_rcomm_2024_sponsor_logos/Synergy Technofin.png" }
  ]
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" }
};

const SpeakerImage = ({ speaker }) => {
  const [errorCount, setErrorCount] = useState(0);

  if (errorCount >= 1 || !speaker.imgFile) {
    return <User className="text-brand-primary/40 w-10 h-10" />;
  }

  return (
    <img 
      src={`/season-2/brand_rcomm_2024_speaker_images/${encodeURIComponent(speaker.imgFile)}`} 
      alt={speaker.name} 
      loading="lazy"
      decoding="async"
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

export default function Season1Page() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImageIndex]);

  return (
    <main className="min-h-screen bg-brand-surface text-brand-dark font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <Navbar logo="/season-1/logo/Brand R.Comm final logo (1).png" logoClassName="h-10 md:h-12 lg:h-14 -my-2 md:-my-3 w-auto object-contain" />

      {/* Hero Section */}
      <section 
        className="relative min-h-screen pt-36 pb-16 sm:pt-40 sm:pb-20 md:py-24 lg:py-0 flex items-center justify-center text-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/IMG_5630.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/25 text-[#a3d95b] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-2.5 shadow-lg backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3d95b] animate-pulse" />
              FIRST EDITION • INAUGURAL EVENT RECAP
            </div>
            
            <div className="mb-3 sm:mb-4 flex justify-center">
              <img 
                src="/season-1/logo/Brand R.comm 1st edition logo-04.png" 
                alt="Brand R.Comm Season 1 Official Logo" 
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-14 sm:h-20 md:h-26 lg:h-32 object-contain filter drop-shadow-[0_4px_20px_rgba(255,255,255,0.35)] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
              />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-[1.25] mb-2.5 sm:mb-3 text-white drop-shadow-lg max-w-3xl">
              Formulating a Roadmap for <br className="hidden sm:block"/> <span className="text-[#a3d95b] italic font-normal">Rural Communications in India.</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto leading-relaxed mb-5 sm:mb-6 drop-shadow px-2">
              BRAND R.Comm 2024 Season 1 brought together agriculture pioneers, rural communicators, policy leaders, and top agribusinesses under the vision: <em>A for Agriculture, B for Branding & C for Communication</em>.
            </p>

            {/* Event Metadata Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full max-w-5xl mt-1 sm:mt-2 items-stretch">
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg flex items-center gap-2 sm:gap-2.5 text-left h-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[#a3d95b] font-mono text-[8.5px] sm:text-[9px] font-bold uppercase tracking-widest mb-0.5">Event</div>
                  <div className="font-semibold text-[10px] sm:text-xs text-white leading-tight">BRAND R.Comm 1st Edition Summit</div>
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg flex items-center gap-2 sm:gap-2.5 text-left h-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[#a3d95b] font-mono text-[8.5px] sm:text-[9px] font-bold uppercase tracking-widest mb-0.5">Venue</div>
                  <div className="font-semibold text-[10px] sm:text-xs text-white leading-tight">Hotel Holiday Inn, Aerocity, New Delhi</div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg flex items-center gap-2 sm:gap-2.5 text-left h-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[#a3d95b] font-mono text-[8.5px] sm:text-[9px] font-bold uppercase tracking-widest mb-0.5">Date & Edition</div>
                  <div className="font-semibold text-[10px] sm:text-xs text-white leading-tight">21st March 2024 • 1st Edition</div>
                </div>
              </div>

              <a 
                href="/season-1/BRC 1 Reports.pptx"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#a3d95b]/25 via-black/40 to-black/50 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-[#a3d95b]/60 flex items-center justify-between gap-1.5 sm:gap-2 text-left group cursor-pointer h-full"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#a3d95b] text-brand-dark flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#a3d95b] font-mono text-[8.5px] sm:text-[9px] font-bold uppercase tracking-widest mb-0.5">Report PPTX</div>
                    <div className="font-bold text-[10px] sm:text-xs text-white leading-tight">Download Report</div>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-[#a3d95b] shrink-0" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="py-16 md:py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-10 max-w-3xl">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">The Inaugural Theme</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4 text-brand-dark">
              Building the foundational bridge for rural communications
            </h2>
            <p className="text-base md:text-lg text-brand-dark/80 font-sans leading-relaxed">
              The inaugural season brought together forward-looking voices to address communication barriers, vernacular media penetration, and structured brand trust in rural markets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            <motion.div {...fadeInUp} className="text-base text-brand-dark/80 leading-relaxed space-y-5">
              <p>
                BRAND R.Comm was conceived to serve as a national summit dedicated to rural brand building, agricultural PR, and stakeholder engagement across India's vibrant farming regions.
              </p>
              <p>
                Season 1 established the blueprint for technical panel exchanges, leadership keynotes, brand presentations, and the annual awards ceremony celebrating impactful rural communication campaigns.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex flex-col gap-6">
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-brand-primary/10 relative">
                <div className="text-5xl text-brand-primary/20 font-serif absolute top-4 left-6">"</div>
                <p className="text-xl font-serif italic leading-relaxed text-brand-dark relative z-10 pt-2 mb-6">
                  Establishing transparent dialogue between agricultural science, industry leadership, and the rural audience.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 text-brand-primary">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-brand-dark">Summit Theme</div>
                    <div className="text-[11px] text-brand-dark/60 font-mono mt-0.5">First Edition 2023</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 bg-brand-primary py-6 border-y border-brand-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 divide-x divide-white/20">
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
          </div>
        </div>
      </section>

      {/* Section 4 — What The Day Held */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-12 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">Inaugural Pillars</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-brand-dark">Four core pillars of the 1st Edition</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessions.map((session, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className="bg-brand-surface rounded-2xl overflow-hidden border border-brand-primary/10 p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="text-brand-primary font-mono text-[11px] font-bold uppercase tracking-widest mb-2">{session.label}</div>
                  <h3 className="text-lg font-bold font-serif leading-tight mb-2.5 text-brand-dark">{session.title}</h3>
                  <p className="text-brand-dark/70 leading-relaxed text-xs sm:text-sm font-sans">{session.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Speakers */}
      <section id="speakers" className="py-16 sm:py-20 bg-brand-surface border-t border-brand-primary/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="mb-10 sm:mb-12 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-xs font-bold uppercase tracking-widest mb-2.5">
              Inaugural Stage
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-brand-dark">
              Founding speakers who <span className="text-brand-primary italic font-normal">led the conversation</span>
            </h2>
            <p className="text-base md:text-lg text-brand-dark/80 font-sans max-w-2xl mx-auto leading-relaxed">
              Distinguished scientists, corporate leaders, legal experts, and media voices from across rural India.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-6">
            {season1Speakers.map((speaker, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center text-center group px-1 transform-gpu"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-full overflow-hidden mb-2.5 border-2 border-brand-primary/20 bg-white flex items-center justify-center shadow-sm group-hover:border-brand-primary group-hover:shadow-md group-hover:scale-105 transition-all duration-300 transform-gpu will-change-transform">
                  <SpeakerImage speaker={speaker} />
                </div>
                <h3 className="font-serif font-bold text-xs sm:text-sm text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-200">{speaker.name}</h3>
                <p className="text-[11px] sm:text-xs text-brand-dark/70 font-sans mt-0.5 leading-relaxed">{speaker.role}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 6 — Reach / Numbers */}
      <section id="reach" className="py-16 md:py-20 bg-white border-t border-brand-primary/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-14 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-xs font-bold uppercase tracking-widest mb-2.5">
              The Numbers
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-brand-dark">
              Inaugural reach <span className="text-brand-primary italic font-normal">and industry impact</span>
            </h2>
            <p className="text-base md:text-lg text-brand-dark/80 font-sans max-w-2xl mx-auto leading-relaxed">
              Early metrics reflecting delegate attendance, media coverage, and digital engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reachStats.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={i} 
                  {...fadeInUp} 
                  transition={{ delay: i * 0.1 }} 
                  className="bg-brand-surface rounded-2xl border border-brand-primary/15 p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-brand-primary font-mono text-[11px] font-bold uppercase tracking-widest">
                        {item.category}
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-serif leading-snug mb-3 text-brand-dark group-hover:text-brand-primary transition-colors duration-200">
                      {item.value}
                    </h3>
                    <p className="text-brand-dark/75 leading-relaxed text-xs sm:text-sm font-sans">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="relative w-full py-16 sm:py-24 bg-brand-surface overflow-hidden border-t border-brand-primary/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-brand-primary/20 text-brand-primary font-mono text-[11px] font-bold uppercase tracking-widest mb-3 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-brand-primary text-brand-primary" />
              SEASON 1 • 2023 AWARDS
            </motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight text-brand-dark mb-3">
              Honouring <span className="text-brand-primary italic font-normal">inaugural excellence.</span>
            </motion.h2>
            <motion.p {...fadeInUp} className="text-brand-dark/75 font-sans text-sm sm:text-base leading-relaxed">
              Recognising lifetime achievements and pioneering communications from the first edition.
            </motion.p>
          </div>

          {/* Jury-Based Award Spotlight */}
          <div className="mb-16 sm:mb-20">
            <div className="flex items-center justify-center w-full mb-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent to-brand-primary/25 hidden md:block"></div>
              <div className="px-4 text-center">
                <h3 className="text-xs font-bold tracking-widest uppercase flex flex-col md:flex-row items-center justify-center gap-2 font-mono">
                  <span className="text-brand-primary bg-white px-4 py-1.5 rounded-full shadow-sm border border-brand-primary/20">
                    JURY-BASED AWARDS
                  </span>
                  <span className="hidden md:inline text-brand-primary/40">✦</span>
                  <span className="text-brand-dark font-sans">
                    HONOURING INDUSTRY LEADERSHIP
                  </span>
                </h3>
              </div>
              <div className="flex-grow h-px bg-gradient-to-l from-transparent to-brand-primary/25 hidden md:block"></div>
            </div>

            {season1JuryWinners.map((winner, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                className="max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-md border border-brand-primary/15 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center group hover:shadow-lg transition-shadow duration-300"
              >
                <div className="md:col-span-6 relative aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden shadow-sm border border-brand-primary/10 bg-brand-surface">
                  <img 
                    src={winner.image} 
                    alt={winner.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform transform-gpu"
                  />
                </div>

                <div className="md:col-span-6 flex flex-col justify-center text-left">
                  <div className="inline-block self-start text-[#4a6b28] bg-[#f1f5ec] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#4a6b28]/20 mb-3">
                    {winner.award}
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark leading-snug mb-1.5 group-hover:text-brand-primary transition-colors duration-200">
                    {winner.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm font-semibold text-brand-primary font-sans mb-3">
                    {winner.title} {winner.company}
                  </p>

                  <p className="text-xs sm:text-sm text-brand-dark/75 font-sans leading-relaxed mb-5 border-l-2 border-brand-primary/30 pl-3 italic">
                    Presented at BRAND R.Comm 2023 in honour of distinguished service and foundational contributions to agricultural communication.
                  </p>

                  <div className="pt-3 border-t border-brand-primary/10 flex items-center justify-between text-[11px] font-mono text-brand-dark/60">
                    <span>1st Edition • Hotel The Park, New Delhi</span>
                    <span className="text-brand-primary font-bold">Award Winner</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nomination-Based Awards Grid */}
          <div>
            <div className="flex items-center justify-center w-full mb-10">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent to-brand-primary/25 hidden md:block"></div>
              <div className="px-4 text-center">
                <h3 className="text-xs font-bold tracking-widest uppercase flex flex-col md:flex-row items-center justify-center gap-2 font-mono">
                  <span className="text-brand-primary bg-white px-4 py-1.5 rounded-full shadow-sm border border-brand-primary/20">
                    NOMINATION-BASED AWARDS
                  </span>
                  <span className="hidden md:inline text-brand-primary/40">✦</span>
                  <span className="text-brand-dark font-sans">
                    CELEBRATING INAUGURAL CAMPAIGN EXCELLENCE
                  </span>
                </h3>
              </div>
              <div className="flex-grow h-px bg-gradient-to-l from-transparent to-brand-primary/25 hidden md:block"></div>
            </div>

            <motion.div {...fadeInUp} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
              {season1NominationWinners.map((winner, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-brand-primary/10 hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between group transform-gpu"
                >
                  <div>
                    <div className="w-full text-[#4a6b28] text-[10px] font-mono font-bold tracking-wider uppercase mb-2 min-h-[28px] flex items-center leading-tight bg-[#f1f5ec] px-2.5 py-1 rounded-md border border-[#4a6b28]/15">
                      {winner.award}
                    </div>

                    <div className="w-full aspect-[16/10] relative overflow-hidden rounded-xl shadow-xs mb-3 border border-brand-primary/10 bg-brand-surface transform-gpu">
                      <img 
                        src={winner.image} 
                        alt={winner.name} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform transform-gpu"
                      />
                    </div>
                  </div>

                  <div className="text-center w-full pt-1 border-t border-brand-primary/10">
                    <h3 className="text-xs sm:text-sm font-bold text-brand-dark uppercase mb-0.5 group-hover:text-brand-primary transition-colors duration-200 font-serif">
                      {winner.name}
                    </h3>
                    {winner.company && (
                      <p className="text-[11px] font-medium text-brand-dark/70 font-sans">
                        {winner.company}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* Section 8 — Gala / Event Moments */}
      <section id="glimpses" className="py-10 sm:py-16 bg-white border-t border-brand-primary/10">
        <div className="max-w-4xl sm:max-w-5xl mx-auto px-3 sm:px-6">
          <motion.div {...fadeInUp} className="mb-6 sm:mb-10 text-center max-w-2xl mx-auto">
            <div className="text-brand-primary font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1.5">
              FROM THE FLOOR
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-2 text-brand-dark">
              Moments from the <span className="text-brand-primary italic font-normal">inaugural edition</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-brand-dark/80 font-sans max-w-xl mx-auto leading-relaxed">
              Glimpses of keynote addresses, delegate networking, and the awards ceremony.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 max-w-4xl sm:max-w-5xl mx-auto">
            {galleryImages.map((img, i) => {
              const isLastCard = i === 5;
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedImageIndex(i)}
                  className="group relative aspect-[4/3] sm:aspect-[16/10] h-32 sm:h-44 md:h-48 rounded-xl overflow-hidden border border-brand-primary/15 bg-brand-surface shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform-gpu"
                >
                  <img 
                    src={img.src} 
                    alt={img.title} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform transform-gpu" 
                  />
                  
                  {!isLastCard ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5 sm:p-4">
                      <p className="text-white font-serif font-medium text-[10px] sm:text-xs md:text-sm leading-tight group-hover:text-[#a3d95b] transition-colors duration-200 drop-shadow-xs">
                        {img.title}
                      </p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center group-hover:bg-black/55 transition-all duration-300">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(5);
                        }}
                        className="px-3 py-1.5 sm:px-5 sm:py-2 bg-[#5b8432] text-white font-sans font-bold text-[9px] sm:text-xs uppercase tracking-wider rounded-lg shadow-md group-hover:scale-105 group-hover:bg-[#4a6b28] transition-all duration-300"
                      >
                        VIEW GALLERY
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Section 9 — Partners */}
      <section id="partners" className="py-10 sm:py-12 bg-brand-surface border-t border-brand-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div {...fadeInUp} className="mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
            <div className="text-[#5b8432] font-mono text-[11px] font-bold uppercase tracking-[0.18em] mb-1">
              GRATITUDE
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-1.5 text-brand-dark leading-tight">
              Founding sponsors, partners and brands <span className="text-[#5b8432] italic font-normal whitespace-nowrap">that trust us</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/70 font-sans max-w-lg mx-auto leading-relaxed">
              The pioneering organizations who supported the first edition of BRAND R.Comm.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="bg-white rounded-3xl p-4 sm:p-6 border border-brand-primary/15 shadow-sm space-y-5 sm:space-y-6">
            {/* SPONSORS */}
            <div className="flex flex-col items-center">
              <h3 className="text-center font-mono text-[11px] sm:text-xs font-bold text-brand-dark/80 tracking-[0.18em] uppercase mb-2">
                SPONSORS
              </h3>
              <div className="w-full bg-brand-surface/60 rounded-2xl px-6 sm:px-10 py-3.5 sm:py-4 border border-brand-primary/10 shadow-xs flex flex-wrap items-center justify-evenly sm:justify-center gap-6 sm:gap-10 md:gap-14 min-h-[90px] sm:min-h-[105px]">
                {backdropSponsors.sponsors.map((logo, idx) => (
                  <img
                    key={idx}
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-12 sm:max-h-16 md:max-h-18 max-w-[160px] sm:max-w-[220px] object-contain hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            </div>

            {/* INDUSTRY ASSOCIATION PARTNERS & ASSOCIATE SPONSORS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <h3 className="text-center font-mono text-[11px] sm:text-xs font-bold text-brand-dark/80 tracking-[0.18em] uppercase mb-2">
                  INDUSTRY ASSOCIATION PARTNERS
                </h3>
                <div className="w-full bg-brand-surface/60 rounded-2xl px-5 sm:px-8 py-3.5 sm:py-4 border border-brand-primary/10 shadow-xs flex flex-wrap items-center justify-evenly sm:justify-center gap-5 sm:gap-8 h-full min-h-[90px] sm:min-h-[105px]">
                  {backdropSponsors.associations.map((logo, idx) => (
                    <img
                      key={idx}
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-11 sm:max-h-14 md:max-h-16 max-w-[150px] sm:max-w-[200px] object-contain hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h3 className="text-center font-mono text-[11px] sm:text-xs font-bold text-brand-dark/80 tracking-[0.18em] uppercase mb-2">
                  ASSOCIATE SPONSORS
                </h3>
                <div className="w-full bg-brand-surface/60 rounded-2xl px-5 sm:px-8 py-3.5 sm:py-4 border border-brand-primary/10 shadow-xs flex flex-wrap items-center justify-evenly sm:justify-center gap-5 sm:gap-8 h-full min-h-[90px] sm:min-h-[105px]">
                  {backdropSponsors.associateSponsors.map((logo, idx) => (
                    <img
                      key={idx}
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-11 sm:max-h-14 md:max-h-16 max-w-[150px] sm:max-w-[200px] object-contain hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* MEDIA PARTNERS, RESEARCH PARTNER & KNOWLEDGE PARTNER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <h3 className="text-center font-mono text-[11px] sm:text-xs font-bold text-brand-dark/80 tracking-[0.18em] uppercase mb-2">
                  MEDIA PARTNERS
                </h3>
                <div className="w-full bg-brand-surface/60 rounded-2xl px-4 sm:px-6 py-3 border border-brand-primary/10 shadow-xs flex flex-wrap items-center justify-evenly sm:justify-center gap-4 sm:gap-6 h-full min-h-[80px] sm:min-h-[95px]">
                  {backdropSponsors.mediaPartners.map((logo, idx) => (
                    <img
                      key={idx}
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-10 sm:max-h-13 md:max-h-14 max-w-[130px] sm:max-w-[170px] object-contain hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h3 className="text-center font-mono text-[11px] sm:text-xs font-bold text-brand-dark/80 tracking-[0.18em] uppercase mb-2">
                  RESEARCH PARTNER
                </h3>
                <div className="w-full bg-brand-surface/60 rounded-2xl px-4 sm:px-6 py-3 border border-brand-primary/10 shadow-xs flex flex-wrap items-center justify-evenly sm:justify-center gap-4 sm:gap-6 h-full min-h-[80px] sm:min-h-[95px]">
                  {backdropSponsors.researchPartners.map((logo, idx) => (
                    <img
                      key={idx}
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-10 sm:max-h-13 md:max-h-14 max-w-[140px] sm:max-w-[180px] object-contain hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h3 className="text-center font-mono text-[11px] sm:text-xs font-bold text-brand-dark/80 tracking-[0.18em] uppercase mb-2">
                  KNOWLEDGE PARTNER
                </h3>
                <div className="w-full bg-brand-surface/60 rounded-2xl px-4 sm:px-6 py-3 border border-brand-primary/10 shadow-xs flex flex-wrap items-center justify-evenly sm:justify-center gap-4 sm:gap-6 h-full min-h-[80px] sm:min-h-[95px]">
                  {backdropSponsors.knowledgePartners.map((logo, idx) => (
                    <img
                      key={idx}
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-10 sm:max-h-13 md:max-h-14 max-w-[140px] sm:max-w-[180px] object-contain hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Image Preview Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
              }}
              className="absolute left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors hidden sm:block"
            >
              <ChevronLeft size={28} />
            </button>

            <div 
              className="max-w-5xl max-h-[85vh] relative rounded-2xl overflow-hidden flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[selectedImageIndex].src}
                alt={galleryImages[selectedImageIndex].title}
                decoding="async"
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
              />
              <p className="text-white font-serif font-bold text-lg mt-4 text-center">
                {galleryImages[selectedImageIndex].title}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors hidden sm:block"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white text-brand-dark pt-12 sm:pt-16 pb-10 border-t border-brand-primary/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top Banner / Next Edition Callout */}
          <div className="bg-brand-surface border border-brand-primary/15 rounded-2xl p-6 sm:p-8 md:p-10 mb-10 sm:mb-14 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4 sm:gap-6 backdrop-blur-sm shadow-sm">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-semibold tracking-widest text-brand-primary uppercase">
                Looking Ahead
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-dark">
                See you at the next edition of <span className="text-brand-primary italic font-normal">BRAND R.Comm</span>.
              </h2>
            </div>
            <a
              href="mailto:info@snailintegral.com"
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-sans font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group shrink-0"
            >
              <span>Partner With Us →</span>
            </a>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pb-10 sm:pb-12 border-b border-brand-primary/10 text-center">
            {/* Column 1: Snail Integral Address */}
            <div className="space-y-3 flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-brand-primary font-bold font-serif text-xl tracking-tight">
                <span>Snail Integral</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5 text-brand-dark/70 text-sm leading-relaxed font-sans">
                <div className="flex items-center justify-center gap-1.5 text-brand-primary font-medium">
                  <MapPin size={16} />
                  <span>Headquarters</span>
                </div>
                <p className="font-medium text-brand-dark">Q-170141, 14th Avenue, Gaur City-2</p>
                <p>Noida Extension, Greater Noida West</p>
                <p>Uttar Pradesh, 201309</p>
              </div>
            </div>

            {/* Column 2: Contact */}
            <div className="space-y-3 flex flex-col items-center">
              <h3 className="text-xs font-mono font-bold tracking-widest text-brand-primary uppercase">
                Contact
              </h3>
              <div className="space-y-2 text-sm font-sans text-brand-dark/80 flex flex-col items-center">
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center justify-center gap-1.5 text-brand-primary font-medium">
                    <Phone size={15} />
                    <span>Phone</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <a href="tel:+919354342588" className="hover:text-brand-primary transition-colors font-medium">
                      +91 93543 42588
                    </a>
                    <span className="hidden sm:inline text-brand-dark/30">•</span>
                    <a href="tel:+918750807676" className="hover:text-brand-primary transition-colors font-medium">
                      +91 87508 07676
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Mail size={15} className="text-brand-primary shrink-0" />
                  <a href="mailto:info@snailintegral.com" className="hover:text-brand-primary transition-colors font-medium underline underline-offset-4 decoration-brand-primary/30 hover:decoration-brand-primary">
                    info@snailintegral.com
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Web & Links */}
            <div className="space-y-3 flex flex-col items-center">
              <h3 className="text-xs font-mono font-bold tracking-widest text-brand-primary uppercase">
                Web & Links
              </h3>
              <div className="space-y-2.5 text-sm font-sans flex flex-col items-center">
                <div className="flex items-center justify-center gap-2">
                  <Globe size={15} className="text-brand-primary shrink-0" />
                  <a
                    href="https://www.snailintegral.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-primary transition-colors font-medium text-brand-dark/90 underline underline-offset-4 decoration-brand-primary/30 hover:decoration-brand-primary"
                  >
                    www.snailintegral.com
                  </a>
                </div>
                <div className="pt-1">
                  <Link
                    href="/seasons"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/15 text-brand-primary font-medium text-xs transition-colors"
                  >
                    <span>Back to Seasons Hub</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center gap-3 sm:gap-4 text-[11px] font-mono tracking-wider text-brand-dark/50 uppercase">
            <div>
              © 2026 SNAIL INTEGRAL PVT. LTD. — ALL RIGHTS RESERVED
            </div>
            <div className="text-brand-dark/40">
              BRAND R.Comm Season 1 Recap
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
