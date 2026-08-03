"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setActiveIndex(newIndex);
    }
  };
  const testimonials = [
    {
      id: 1,
      quote: "Snail Integral has created unique platforms that celebrate leadership, innovation, and knowledge sharing in agriculture. Through The SnailShow Podcast, the Coffee Table Book, industry events, and BRAND R.Comm Awards, they have successfully built a vibrant ecosystem that recognizes excellence and promotes impactful dialogue across the industry.",
      name: "Mr. Manoj Varshney",
      title: "MD & CEO",
      company: "IFFCO-MC Crop Science Pvt. Ltd.",
      image: "/speakers/Mr. Manoj Varshney.jpg"
    },
    {
      id: 2,
      quote: "Snail Integral has been a reliable partner in celebrity management, TVC production, media planning, and social media management. Their quick execution and strategic approach have significantly strengthened our brand visibility. We look forward to continuing this successful partnership.",
      name: "Sumit Gupta",
      title: "Director Project",
      company: "Thakar Chemical Limited",
      image: "/speakers/Sumit Gupta.jpg"
    },
    {
      id: 3,
      quote: "Snail Integral has been a trusted extension of our team, delivering consistent results across brand communication and marketing. Their strategic thinking, timely execution, and deep understanding of rural markets have helped strengthen our brand presence. We highly value this partnership and confidently recommend Snail Integral.",
      name: "Rajendar Kumar",
      title: "Head-Agri Input Business",
      company: "Akshamaala Solutions Pvt. Ltd. (Unnati)",
      image: "/speakers/Rajendar Kumar.jpg"
    }
  ];

  return (
    <section className="relative w-full py-12 md:py-16 text-brand-dark overflow-hidden border-t border-brand-primary/10 bg-brand-surface">
      
      {/* Background Vertical Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
        <div className="w-px h-full bg-brand-primary/10"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden sm:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden md:block"></div>
        <div className="w-px h-full bg-brand-primary/10 hidden lg:block"></div>
        <div className="w-px h-full bg-brand-primary/10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 mb-4"
          >
            <div className="h-px w-6 bg-brand-primary" />
            <span className="text-brand-primary tracking-[0.2em] text-[10px] font-bold uppercase">
              Voices From The Room
            </span>
            <div className="h-px w-6 bg-brand-primary" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-serif leading-tight text-brand-dark"
          >
            Don't take our word for it.<br/>
            <span className="text-brand-primary italic">Take theirs.</span>
          </motion.h2>
        </div>

        {/* Mobile Navigation Arrows & Dots */}
        <div className="flex md:hidden justify-between items-center w-full mt-2 mb-4 px-2">
          <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-brand-primary/20 text-brand-primary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors shadow-sm" aria-label="Scroll left">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="flex items-center gap-2">
            {testimonials.map((_, idx) => (
              <div 
                key={idx}
                className={`transition-all duration-300 rounded-full ${activeIndex === idx ? "w-6 h-2 bg-brand-primary" : "w-2 h-2 bg-brand-primary/30"}`}
              />
            ))}
          </div>

          <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-brand-primary/20 text-brand-primary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors shadow-sm" aria-label="Scroll right">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Cards Grid (Horizontal Scroll on Mobile) */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-6 lg:gap-8 pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-center bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-2 transition-all duration-300"
            >
              <div>
                <Quote size={20} className="text-brand-primary mb-4" />
                <p className="text-brand-dark/80 text-sm leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-brand-surface border border-brand-primary/20">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-brand-dark font-bold text-sm leading-tight">
                    {testimonial.name}
                  </h4>
                  <p className="text-brand-primary font-semibold text-[10px] md:text-xs leading-tight mt-1">
                    {testimonial.title}
                  </p>
                  <p className="text-brand-dark/50 font-medium text-[10px] leading-tight mt-0.5">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
