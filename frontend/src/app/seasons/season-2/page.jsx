"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, User, Calendar, MapPin, Star, Mic, Users, Award, Handshake, Phone, Mail, Globe, X, ChevronLeft, ChevronRight, Image as ImageIcon, FileText, Download } from "lucide-react";
import Navbar from "@/components/Navbar";

// ==========================================
// SEASON 2 DATA PLACEHOLDERS (EASILY EDITABLE)
// ==========================================

const speakers = [
  { name: "Dr. RB SIngh", role: "Former VC, VAU, Imphal", imgFile: "Dr. RB SIngh.jpg" },
  { name: "Dr. KC Ravi", role: "Chairman, CropLife India", imgFile: "Dr. KC Ravi.jpg" },
  { name: "Manish Sawla", role: "Sr. Manager, IT, United Airline", imgFile: "Manish Sawla.jpg" },
  { name: "Dr. Arvind Kumar", role: "Former VC, RLBCAU, Jhansi", imgFile: "Dr. Arvind Kumar.jpg" },
  { name: "Vijay Sardana", role: "Advocate, Supreme Court of India", imgFile: "Vijay Sardana.jpg" },
  { name: "Anand Chandra", role: "Co-Founder & Executive Director, Arya.ag", imgFile: "Anand Chandra.jpg" },
  { name: "Raj Kumar Gupta", role: "MD, Thakar Chemicals Ltd.", imgFile: "Raj Kumar Gupta.jpg" },
  { name: "Dr. VV Sadamate", role: "Agri Ext. Specialist & Former Advisor, GOI", imgFile: "Dr. VV Sadamate.jpg" },
  { name: "Dharmesh Gupta", role: "Managing Director Dhanesha Crop Sciences Pvt. Ltd", imgFile: "Dharmesh Gupta.jpg" },
  { name: "Anil Dhingra", role: "Managing Director, IFFCO - MC", imgFile: "Anil Dhingra.jpg" },
  { name: "Harish Mehta", role: "Sr. Advisor, Crop Care federation of India", imgFile: "Harish Mehta.jpg" },
  { name: "Jyotsna Dash Nanda", role: "AVP, Corporate Communication, DS Group", imgFile: "Jyotsna Dash Nanda.jpg" },
  { name: "Rajesh Aggarwal", role: "Managing Director, Insecticide India Ltd.", imgFile: "Rajesh Aggarwal.jpg" },
  { name: "Sumit Gupta", role: "Director (Project), Thakar Chemicals Ltd", imgFile: "Sumit Gupta.jpg" },
  { name: "Poorvi Gupta", role: "Independent Journalist, & TEDx Speaker", imgFile: "Poorvi Gupta.jpg" },
  { name: "Rajvir Rathi", role: "Director Public Affair, Bayer", imgFile: "Rajvir Rathi.jpg" },
  { name: "Sunil Sihag", role: "Managing Director, Synergy Technofin Pvt. Ltd.", imgFile: "Sunil Sihag.jpg" },
  { name: "Nalin Rawal", role: "Director Consulting & GIS Services, Agriwatch", imgFile: "Nalin Rawal.jpg" },
  { name: "Debabrata Sarkar", role: "CMD – MicroAlgae Solutions India & VP-APAC-AlgaEnergy", imgFile: "Debabrata Sarkar.jpg" },
  { name: "Rajat Mishra", role: "Assistant Editor, Republic World", imgFile: "Rajat Mishra.jpg" },
  { name: "Takuya Fukunaga", role: "Jt. CEO, IFFCO – MC Crop Science", imgFile: "Takuya Fukunaga.jpg" },
  { name: "Dr. Shailendra Singh", role: "COO, Zydex Industries Pvt. Ltd.", imgFile: "Dr. Shailendra Singh.jpg" },
  { name: "Raju Kapoor", role: "Director, FMC India", imgFile: "Raju Kapoor.jpg" },
  { name: "Tarun Bhargava", role: "COO, IFFCO – MC Crop Science", imgFile: "Tarun Bhargava.jpg" },
  { name: "Durgesh Chandra", role: "Secretary General, CropLife India", imgFile: "Durgesh Chandra.jpg" },
  { name: "Sanjay Nagi", role: "Founder & MD, Market Insight Consultant", imgFile: "Sanjay Nagi.jpg" },
  { name: "Dr. Ujjwal Narayan", role: "Business Editor, PTI Videos", imgFile: "Dr. Ujjwal Narayan.jpg" },
  { name: "Nirmala Pathrawal", role: "Executive Director, CCFI", imgFile: "Nirmala Pathrawal.jpg" },
  { name: "Siddharth Gautam", role: "Managing Director, Rural Access", imgFile: "Siddharth Gautam.jpg" },
  { name: "Vipin Saini", role: "CEO, BASAI", imgFile: "Vipin Saini.jpg" },
  { name: "Nitin Puri", role: "Founder, KisanSay", imgFile: "Nitin Puri.jpg" },
  { name: "Surendra Makhija", role: "Strategic Advisor & SVP, Jain Irrigation", imgFile: "Surendra Makhija.jpg" },
  { name: "Vivek Mittal", role: "Director, Thakar Chemicals Ltd.", imgFile: "Vivek Mittal.jpg" },
  { name: "Rahul Mathur", role: "Head – Marketing, IPL Biologicals", imgFile: "Rahul Mathur.jpg" },
  { name: "Suresh Reddy", role: "President, Krishi Rasayan Export Pvt. Ltd.", imgFile: "Suresh Reddy.jpg" },
  { name: "Rakesh Tiwari", role: "Poet, Storyteller, TEDx Speaker, Author & Award Winning Podcaster", imgFile: "Rakesh Tiwari.jpg" }
];

const stats = [
  { value: "150+", label: "SENIOR DELEGATES", icon: Users },
  { value: "35+", label: "SPEAKERS ON STAGE", icon: Mic },
  { value: "31,223", label: "LINKEDIN IMPRESSIONS", icon: Globe },
  { value: "20+", label: "MEDIA INTERACTIONS", icon: Award }
];

const sessions = [
  {
    label: "01 — UNIQUE CONCEPT",
    title: "Case Studies & Success Stories",
    desc: "Case studies and success stories showcasing innovative approaches and impactful initiatives in rural communication.",
    img: "/IMG_5570.jpg"
  },
  {
    label: "02 — PANEL DISCUSSION",
    title: "Trends & Opportunities",
    desc: "Conversations on emerging trends, challenges and opportunities across agriculture and rural development.",
    img: "/IMG_5791.jpg"
  },
  {
    label: "03 — BRAND PRESENTATION",
    title: "Keynote Addresses",
    desc: "Keynote addresses by renowned experts in rural communication, agriculture and development.",
    img: "/IMG_5630.jpg"
  },
  {
    label: "04 — NETWORKING",
    title: "Industry Connect",
    desc: "Opportunities to connect with industry peers, stakeholders and potential collaborators through the day.",
    img: "/IMG_5750.jpg"
  }
];

const reachStats = [
  {
    category: "ON EVENT",
    value: "150+ delegates, 35+ speakers",
    desc: "Senior delegates from industry filled the room, with speakers across panel discussions and brand presentations.",
    icon: Users
  },
  {
    category: "LINKEDIN",
    value: "31,223 impressions",
    desc: "4,661 reach on LinkedIn alone, carrying the summit's key moments well beyond the room.",
    icon: Globe
  },
  {
    category: "PUBLIC RELATIONS",
    value: "50+ online and print mentions",
    desc: "Coverage across online and print media, including feature ads in Pestology and Krishak Jagat.",
    icon: FileText
  },
  {
    category: "MEDIA",
    value: "20+ interactions and interviews",
    desc: "Speakers and organisers featured across news channels and industry publications after the event.",
    icon: Award
  }
];

const season2JuryWinners = [
  {
    award: "LIFETIME ACHIEVEMENT AWARD 2024",
    name: "DR. RB SINGH",
    title: "Former Chancellor,",
    company: "CAU, Imphal",
    image: "/Awards/LIFETIME ACHIEVEMENT AWARD 2024-Dr. RB SINGH.jpeg"
  }
];

const season2NominationWinners = [
  {
    award: "EMERGING PARTICIPANT FOR RURAL ENGAGEMENT AWARD 2024",
    name: "DHANESHA",
    company: "Dhanesha Crop Science",
    image: "/others/Dhanesha Crop Science.JPG.jpeg"
  },
  {
    award: "INTEGRATED COMMUNICATION AWARD 2024",
    name: "CROPLIFE INDIA",
    company: "CropLife India",
    image: "/others/CropLife India.JPG.jpeg"
  },
  {
    award: "INTEGRATED COMMUNICATION AWARD 2024",
    name: "SYNGENTA",
    company: "Syngenta India",
    image: "/others/Syngenta.JPG.jpeg"
  },
  {
    award: "BRAND CAMPAIGN (TVC) AWARD 2024",
    name: "KRISHAJ",
    company: "Krishi Rasayan Export",
    image: "/others/Krishi Rasayan.JPG.jpeg"
  },
  {
    award: "DIGITAL MARKETING AWARD 2024",
    name: "ARIES AGRO LIMITED",
    company: "Aries Agro Limited",
    image: "/others/Aries Agro.JPG.jpeg"
  },
  {
    award: "PR CAMPAIGN AWARD 2024",
    name: "IPL",
    company: "IPL Biologicals",
    image: "/others/IPL.jpeg"
  },
  {
    award: "RURAL ENGAGEMENT AWARD 2024",
    name: "CROP CARE FEDERATION OF INDIA",
    company: "CCFI",
    image: "/others/Crop Care Federation.JPG.jpeg"
  },
  {
    award: "RURAL ENGAGEMENT AWARD 2024",
    name: "PARLE BIO CARE",
    company: "Parle Bio Care",
    image: "/others/PARLE BIO CARE.jpeg"
  }
];

const galleryImages = [
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2001.jpg", title: "Summit Inauguration & Stage Keynotes" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2002.jpg", title: "Panel Discussion & Industry Exchange" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2003.jpg", title: "Audience & Senior Delegates" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2004.jpg", title: "Awards Night Presentation" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2005.jpg", title: "Thought Leadership & Dialogue" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2006.jpg", title: "Gala Networking & Collaboration" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2007.jpg", title: "Brand Presentations on Stage" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2008.jpg", title: "Rural Communication Awards" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2009.jpg", title: "Industry Leaders & Policy Voices" },
  { src: "/season-2/brand_rcomm_2024_floor_moments/Moment%20from%20BRAND%20R.Comm%20Second%20Edition%20awards%2010.jpg", title: "Closing Ceremony & Celebrations" }
];

const backdropSponsors = {
  sponsors: [
    { name: "Zydex", src: "/season-2/brand_rcomm_2024_sponsor_logos/Zydex.png" },
    { name: "AGMA Energy", src: "/season-2/brand_rcomm_2024_sponsor_logos/agma.png" },
    { name: "Novonesis", src: "/all_brands_logos/All Brands logo-21.png" },
    { name: "AlgaEnergy", src: "/season-2/brand_rcomm_2024_sponsor_logos/AlgaEnergy.png" },
    { name: "IFFCO-MC Crop Science", src: "/season-2/brand_rcomm_2024_sponsor_logos/IFFCO-MC Crop Science.png" },
    { name: "Thakar Chemicals Limited", src: "/season-2/brand_rcomm_2024_sponsor_logos/Thakar Chemicals Limited.png" }
  ],
  associations: [
    { name: "BASAI", src: "/all_brands_logos/basai.png" },
    { name: "CCFI", src: "/all_brands_logos/cccfi.png" },
    { name: "ACFI", src: "/all_brands_logos/acfi.png" },
    { name: "CropLife India", src: "/all_brands_logos/crop-life.png" }
  ],
  associateSponsors: [
    { name: "Yara", src: "/season-2/brand_rcomm_2024_sponsor_logos/yara copy.png" },
    { name: "INERA", src: "/season-2/brand_rcomm_2024_sponsor_logos/inera.png" },
    { name: "Syngenta", src: "/season-2/brand_rcomm_2024_sponsor_logos/sygenta.png" },
    { name: "Bayer", src: "/season-2/brand_rcomm_2024_sponsor_logos/Bayer.png" },
    { name: "IPL Biologicals", src: "/season-2/brand_rcomm_2024_sponsor_logos/ipl.png" }
  ],
  mediaPartners: [
    { name: "Krishi Jagran", src: "/season-2/brand_rcomm_2024_sponsor_logos/kj.png" },
    { name: "Krishak Jagat", src: "/season-2/brand_rcomm_2024_sponsor_logos/krishak.jpeg" },
    { name: "Fasal Kranti", src: "/all_brands_logos/fasalkranti.png" },
    { name: "Pestology", src: "/all_brands_logos/pestology.png" }
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

export default function Season2Page() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    if (isGalleryOpen || selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isGalleryOpen, selectedImageIndex]);

  return (
    <main className="min-h-screen bg-brand-surface text-brand-dark font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <Navbar logo="/season-2/logo/Brand R.comm 2nd edition logo.png" logoClassName="h-7 sm:h-8 md:h-9 my-0" />

      {/* Hero Section */}
      <section 
        className="relative min-h-screen py-24 sm:py-28 md:py-20 lg:py-0 flex items-center justify-center text-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/IMG_5791.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/25 text-[#a3d95b] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-2.5 shadow-lg backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3d95b] animate-pulse" />
              SECOND EDITION • EVENT RECAP
            </div>
            
            <div className="mb-2 sm:mb-2.5 flex justify-center">
              <img src="/season-2/logo/Brand R.comm 2nd edition logo for white bg-02.png" alt="Brand R.Comm Season 2" className="h-16 sm:h-22 md:h-28 lg:h-34 object-contain drop-shadow-2xl" />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-[1.25] mb-2.5 sm:mb-3 text-white drop-shadow-lg max-w-3xl">
              A for Agriculture, B for Branding, <br className="hidden sm:block"/> <span className="text-[#a3d95b] italic font-normal">and C for Communication.</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto leading-relaxed mb-5 sm:mb-6 drop-shadow px-2">
              BRAND R.Comm 2024 brought together policymakers, agri-input leaders and communication professionals for a day built around one theme: aligning communication with development, empowerment and sustainability for the nation.
            </p>

            {/* Event Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-5xl mt-1 sm:mt-2 items-stretch">
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg flex items-center gap-2.5 text-left h-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[#a3d95b] font-mono text-[9px] font-bold uppercase tracking-widest mb-0.5">Event</div>
                  <div className="font-semibold text-[10px] sm:text-xs text-white leading-tight">BRAND R.Comm, Summit & Awards 2024</div>
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg flex items-center gap-2.5 text-left h-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[#a3d95b] font-mono text-[9px] font-bold uppercase tracking-widest mb-0.5">Venue</div>
                  <div className="font-semibold text-[10px] sm:text-xs text-white leading-tight">Hotel The Park, Janpath, New Delhi</div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-lg flex items-center gap-2.5 text-left h-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#a3d95b]">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[#a3d95b] font-mono text-[9px] font-bold uppercase tracking-widest mb-0.5">Date & Edition</div>
                  <div className="font-semibold text-[10px] sm:text-xs text-white leading-tight">6 Dec 2024 • 2nd Edition</div>
                </div>
              </div>

              <a 
                href="/brouchers/Updated BRC 4 2026 Brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#a3d95b]/25 via-black/40 to-black/50 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-[#a3d95b]/60 flex items-center justify-between gap-2 text-left group cursor-pointer h-full"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#a3d95b] text-brand-dark flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#a3d95b] font-mono text-[9px] font-bold uppercase tracking-widest mb-0.5">Archive</div>
                    <div className="font-bold text-[10px] sm:text-xs text-white">Download Summary</div>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-[#a3d95b]" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-10 max-w-3xl">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">The Theme</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4 text-brand-dark">
              Communication for development, empowerment and sustainability
            </h2>
            <p className="text-base md:text-lg text-brand-dark/80 font-sans leading-relaxed">
              Building on the debut edition, BRAND R.Comm's second year brought a wider mix of voices to the stage, from central government officials to agri-input CEOs to independent journalists.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side */}
            <motion.div {...fadeInUp} className="text-base text-brand-dark/80 leading-relaxed space-y-5">
              <p>
                BRAND R.Comm is a platform built to foster dialogue, collaboration and innovation in rural communication. It brings thought leaders, industry experts, policymakers and stakeholders together to explore the trends, practices and solutions shaping rural India.
              </p>
              <p>
                The second edition carried this forward with a full day of keynotes, panel discussions, brand presentations and networking, closing with an awards night that recognised the people and companies driving change on the ground.
              </p>
            </motion.div>

            {/* Right side quote box */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex flex-col gap-6">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-brand-primary/10 relative">
                <div className="text-5xl text-brand-primary/20 font-serif absolute top-4 left-6">"</div>
                <p className="text-xl font-serif italic leading-relaxed text-brand-dark relative z-10 pt-2 mb-6">
                  Role of communication in aligning with development, empowerment and sustainability for the nation.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 text-brand-primary">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-brand-dark">Summit Theme</div>
                    <div className="text-[11px] text-brand-dark/60 font-mono mt-0.5">Second Edition 2024</div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x divide-white/20">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-12 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-sm font-bold uppercase tracking-widest mb-3">What The Day Held</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-brand-dark">Four ideas the summit was built around</h2>
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
              On The Stage
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-brand-dark">
              36 speakers who <span className="text-brand-primary italic font-normal">joined the conversation</span>
            </h2>
            <p className="text-base md:text-lg text-brand-dark/80 font-sans max-w-2xl mx-auto leading-relaxed">
              Scientists, CEOs, journalists and policy voices from across agriculture and rural development.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-6">
            {speakers.map((speaker, i) => (
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
      <section id="reach" className="py-20 bg-white border-t border-brand-primary/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-14 text-center max-w-3xl mx-auto">
            <div className="text-brand-primary font-mono text-xs font-bold uppercase tracking-widest mb-2.5">
              The Numbers
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-brand-dark">
              Reach across <span className="text-brand-primary italic font-normal">the ground and the feed</span>
            </h2>
            <p className="text-base md:text-lg text-brand-dark/80 font-sans max-w-2xl mx-auto leading-relaxed">
              Pre-event digital and print activity, the day itself, and the public relations push that followed.
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
              SEASON 2 • 2024 AWARDS
            </motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight text-brand-dark mb-3">
              Honouring <span className="text-brand-primary italic font-normal">industry legacy.</span>
            </motion.h2>
            <motion.p {...fadeInUp} className="text-brand-dark/75 font-sans text-sm sm:text-base leading-relaxed">
              Recognising pioneering contributions, strategic communication, and ground-level impact across rural India.
            </motion.p>
          </div>

          {/* Jury-Based Award Featured Spotlight Card */}
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
                    HONOURING INDUSTRY LEADERSHIP AND LEGACY
                  </span>
                </h3>
              </div>
              <div className="flex-grow h-px bg-gradient-to-l from-transparent to-brand-primary/25 hidden md:block"></div>
            </div>

            {season2JuryWinners.map((winner, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                className="max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-md border border-brand-primary/15 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center group hover:shadow-lg transition-shadow duration-300"
              >
                {/* Photo Side */}
                <div className="md:col-span-6 relative aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden shadow-sm border border-brand-primary/10 bg-brand-surface">
                  <img 
                    src={winner.image} 
                    alt={winner.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details Side */}
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
                    Presented at BRAND R.Comm 2024 in honour of distinguished service, visionary leadership, and lifetime contributions to agriculture and rural empowerment.
                  </p>

                  <div className="pt-3 border-t border-brand-primary/10 flex items-center justify-between text-[11px] font-mono text-brand-dark/60">
                    <span>2nd Edition • Hotel The Park, New Delhi</span>
                    <span className="text-brand-primary font-bold">Award Winner</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nomination-Based Awards Section */}
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
                    CELEBRATING CAMPAIGN AND CORPORATE EXCELLENCE
                  </span>
                </h3>
              </div>
              <div className="flex-grow h-px bg-gradient-to-l from-transparent to-brand-primary/25 hidden md:block"></div>
            </div>

            <motion.div {...fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
              {season2NominationWinners.map((winner, idx) => (
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
      <section id="glimpses" className="py-14 sm:py-16 bg-white border-t border-brand-primary/10">
        <div className="max-w-4xl sm:max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
            <div className="text-brand-primary font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2">
              FROM THE FLOOR
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2.5 text-brand-dark">
              Moments from the summit <span className="text-brand-primary italic font-normal">and awards night</span>
            </h2>
            <p className="text-sm sm:text-base text-brand-dark/80 font-sans max-w-xl mx-auto leading-relaxed">
              Panel discussions, award presentations and the room that made both happen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl sm:max-w-5xl mx-auto">
            {galleryImages.slice(0, 6).map((img, i) => {
              const isLastCard = i === 5;
              return (
                <motion.div 
                  key={i} 
                  {...fadeInUp}
                  onClick={() => setSelectedImageIndex(i)}
                  className="group relative aspect-[16/10] h-40 sm:h-44 md:h-48 rounded-xl overflow-hidden border border-brand-primary/15 bg-brand-surface shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <img 
                    src={img.src} 
                    alt={img.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {!isLastCard ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5 sm:p-4">
                      <p className="text-white font-serif font-medium text-xs sm:text-sm leading-snug group-hover:text-[#a3d95b] transition-colors duration-200 drop-shadow-xs">
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
                        className="px-5 py-2 bg-[#5b8432] text-white font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-lg shadow-md group-hover:scale-105 group-hover:bg-[#4a6b28] transition-all duration-300"
                      >
                        VIEW GALLERY
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
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
              Sponsors, partners and brands <span className="text-[#5b8432] italic font-normal whitespace-nowrap">that trust us</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/70 font-sans max-w-lg mx-auto leading-relaxed">
              The companies and associations who made the second edition possible.
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
      <footer className="bg-white text-brand-dark pt-16 pb-10 border-t border-brand-primary/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Banner / Next Edition Callout */}
          <div className="bg-brand-surface border border-brand-primary/15 rounded-2xl p-8 md:p-10 mb-14 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm shadow-sm">
            <div className="space-y-2 text-center md:text-left">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-brand-primary/10">
            {/* Column 1: Snail Integral Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary font-bold font-serif text-xl tracking-tight">
                <span>Snail Integral</span>
              </div>
              <div className="flex items-start gap-3 text-brand-dark/70 text-sm leading-relaxed font-sans">
                <MapPin size={18} className="text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-brand-dark">Q-170141, 14th Avenue, Gaur City-2</p>
                  <p>Noida Extension, Greater Noida West</p>
                  <p>Uttar Pradesh, 201309</p>
                </div>
              </div>
            </div>

            {/* Column 2: Contact */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-brand-primary uppercase">
                Contact
              </h3>
              <div className="space-y-2.5 text-sm font-sans text-brand-dark/80">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-brand-primary shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <a href="tel:+919354342588" className="hover:text-brand-primary transition-colors font-medium">
                      +91 93543 42588
                    </a>
                    <a href="tel:+918750807676" className="hover:text-brand-primary transition-colors font-medium">
                      +91 87508 07676
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Mail size={16} className="text-brand-primary shrink-0" />
                  <a href="mailto:info@snailintegral.com" className="hover:text-brand-primary transition-colors font-medium underline underline-offset-4 decoration-brand-primary/30 hover:decoration-brand-primary">
                    info@snailintegral.com
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Web & Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-brand-primary uppercase">
                Web & Links
              </h3>
              <div className="space-y-3 text-sm font-sans">
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-brand-primary shrink-0" />
                  <a
                    href="https://www.snailintegral.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-primary transition-colors font-medium text-brand-dark/90 underline underline-offset-4 decoration-brand-primary/30 hover:decoration-brand-primary"
                  >
                    www.snailintegral.com
                  </a>
                </div>
                <div className="pt-2">
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
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-wider text-brand-dark/50 uppercase">
            <div>
              © 2026 SNAIL INTEGRAL PVT. LTD. — ALL RIGHTS RESERVED
            </div>
            <div className="text-brand-dark/40">
              BRAND R.Comm Season 2 Recap
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
