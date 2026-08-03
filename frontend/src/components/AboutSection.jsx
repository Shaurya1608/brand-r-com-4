import React from "react";
import Image from "next/image";

export default function AboutSection() {
  const cards = [
    {
      label: "OUR MISSION",
      title: "Move the needle for agri-communication.",
      description: "Set the industry benchmark for what excellent agri-marketing looks like and celebrate the work that raises it every year.",
      delay: "0",
    },
    {
      label: "OUR VISION",
      title: "India's most credible agri platform.",
      description: "Be the single stage where every serious player in Indian agriculture wants to be seen, heard and honoured.",
      delay: "100",
    },
    {
      label: "THE VALUE PROPOSITION",
      title: "You do not attend BRAND R.COMM to network. You attend to decide.",
      description: "Every element of BRAND R.COMM is engineered for decision-making. The time you spend with us leaves the room with a decision.",
      delay: "200",
    },
  ];

  return (
    <section id="about-us" className="relative w-full bg-white flex flex-col justify-center py-12 md:py-16 overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-brand-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-brand-primary/10 blur-[100px]" />
      </div>

      {/* Vertical Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none flex justify-evenly opacity-100 z-0">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
        <div className="hidden lg:block w-px h-full bg-gradient-to-b from-transparent via-brand-primary/40 to-transparent" />
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 bg-white/80 backdrop-blur-md rounded-[2rem] p-6 md:p-10 lg:p-12 shadow-[0_0_60px_30px_rgba(255,255,255,0.9)]">
        
        {/* Top Intro Section */}
        <div className="max-w-3xl mx-auto mb-10 md:mb-12 text-center flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-px w-8 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              About Brand R.Comm
            </span>
            <div className="h-px w-8 bg-brand-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.1] text-brand-dark mb-5">
            Not a conference. <span className="text-brand-primary italic font-medium">A convening.</span>
          </h2>

          <p className="text-brand-dark/70 text-sm md:text-base leading-relaxed font-sans max-w-2xl text-center">
            BRAND R.COMM exists because the story of Indian agriculture is being rewritten every quarter and the people writing it deserved a room designed for them. A room where a Chairman shares a table with a young CMO, an agency creative sits beside a policy adviser, and a village-first startup pitches an idea to the head of a multinational. That is where BRAND R.COMM begins.
          </p>
        </div>

        {/* Middle Panoramic Image */}
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden mb-10 md:mb-12 shadow-xl shadow-brand-dark/5">
          <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply z-10" />
          <Image 
            src="/landing/IMG_5631.JPG" 
            alt="BRAND R.COMM Conference" 
            fill
            className="object-cover"
          />
        </div>

        {/* Bottom 3-Column Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="flex flex-col border-t border-brand-primary/30 pt-4"
            >
              <h3 className="text-[9px] tracking-[0.2em] font-bold text-brand-primary uppercase mb-3">
                {card.label}
              </h3>
              
              <h4 className="text-xl font-serif text-brand-dark mb-3">
                {card.title}
              </h4>
              
              <p className="text-brand-dark/70 text-xs md:text-sm leading-relaxed font-sans">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
