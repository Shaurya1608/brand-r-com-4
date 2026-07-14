import React from "react";
import Image from "next/image";

export default function AboutSection() {
  const cards = [
    {
      label: "OUR MISSION",
      title: "Move the needle for agri-communication.",
      description: "Set the industry benchmark for what excellent agri-marketing looks like — and celebrate the work that raises it every year.",
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
    <section id="about-us" className="relative w-full bg-white min-h-screen flex items-center py-20 md:py-24 overflow-hidden">
      
      {/* Background abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          
          {/* Left Column - Sticky Content */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-px w-8 bg-brand-primary" />
                <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
                  About Brand R.Comm
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.15] text-brand-dark mb-6">
                Not a conference. <br />
                <span className="text-brand-primary italic font-medium">A convening.</span>
              </h2>

              <p className="text-brand-dark/70 text-sm md:text-base leading-relaxed font-sans mb-8 max-w-lg">
                BRAND R.COMM exists because the story of Indian agriculture is being rewritten every quarter — and the people writing it deserved a room designed for them. A room where a Chairman shares a table with a young CMO, an agency creative sits beside a policy adviser, and a village-first startup pitches an idea to the head of a multinational. That is where BRAND R.COMM begins.
              </p>

              {/* Decorative Image */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group shadow-xl shadow-brand-dark/5">
                <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-700" />
                <Image 
                  src="/landing/IMG_5631.JPG" 
                  alt="BRAND R.COMM Conference" 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Unique Staggered Boxes */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 md:space-y-6 mt-12 lg:mt-0 lg:pl-8">
            {cards.map((card, idx) => (
              <div 
                key={idx}
                className={`group relative bg-brand-surface/30 backdrop-blur-sm border border-brand-primary/10 p-6 md:p-8 rounded-2xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 hover:border-brand-primary/30 ${idx === 1 ? 'lg:ml-8' : idx === 2 ? 'lg:ml-16' : ''}`}
                style={{ animationDelay: `${card.delay}ms` }}
              >
                {/* Accent line on hover */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-brand-primary transition-all duration-500 group-hover:h-1/2 rounded-r-full" />
                
                <h3 className="text-[9px] tracking-[0.25em] font-bold text-brand-primary uppercase mb-3">
                  {card.label}
                </h3>
                
                <h4 className="text-xl md:text-2xl font-serif text-brand-dark mb-3 group-hover:text-brand-primary transition-colors duration-300">
                  {card.title}
                </h4>
                
                <p className="text-brand-dark/60 text-xs md:text-sm leading-relaxed font-sans">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
