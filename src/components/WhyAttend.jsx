import React from "react";

export default function WhyAttend() {
  const reasons = [
    {
      title: "Room of Decision Makers",
      description: "Sit across the table from Chairmen, MDs, CMOs and Communication Heads of India's most influential agri-brands. One handshake here can move a quarter.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Category-Defining Ideas",
      description: "Six hours of curated content no filler. CEOs, agencies and policymakers unpack the campaigns and playbooks that reshaped rural India in 2025.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "The Industry Benchmark",
      description: "BRAND R.COMM Awards are the most cited recognition in Indian agri-marketing. A shortlist here is a résumé for your brand.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Introductions That Compound",
      description: "Curated one-to-one meetings, hosted lunches and a black-tie gala engineered so every conversation ends with a follow-up date.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      title: "Signal, Not Noise",
      description: "Proprietary research, agency benchmarks and rural consumer data released first at BRAND R.COMM before the trade press picks it up.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      title: "Global × Local Lens",
      description: "International delegates from South-East Asia, Africa and the Gulf converge to compare notes on rural markets that look a lot like ours.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="why-attend" className="relative w-full bg-brand-surface flex items-center py-16 overflow-hidden border-t border-brand-dark/5">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center">
        
        {/* Header centered */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-px w-8 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Why Attend
            </span>
            <div className="h-px w-8 bg-brand-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.15] text-brand-dark">
            Six reasons why <br className="hidden md:block" />
            <span className="text-brand-primary italic">4 December 2026</span> is already on your calendar.
          </h2>
        </div>

        {/* Floating Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 text-left">
          {reasons.map((reason, index) => {
            // Stagger the middle column downwards on large screens
            const isMiddleColumn = index % 3 === 1;
            
            return (
              <div 
                key={index}
                className={`group flex flex-col items-start p-5 md:p-6 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-xl hover:shadow-brand-primary/10 hover:border-brand-primary/20 ${isMiddleColumn ? 'lg:translate-y-8' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Small compact icon */}
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white shadow-sm">
                  {React.cloneElement(reason.icon, { className: 'w-4 h-4' })}
                </div>
                
                <h3 className="text-lg font-serif text-brand-dark mb-2 transition-colors duration-300 group-hover:text-brand-primary">
                  {reason.title}
                </h3>
                
                <p className="text-brand-dark/60 text-xs md:text-sm leading-relaxed font-sans">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
