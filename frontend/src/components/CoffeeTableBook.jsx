"use client";

import { useState } from 'react';
import AnimatedText from './AnimatedText';
import Image from 'next/image';
import Link from 'next/link';
import CoffeeTableModal from './CoffeeTableModal';

export default function CoffeeTableBook() {
  const [activeVolume, setActiveVolume] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targetAudience = [
    "Agricultural industry professionals seeking a high-quality record of the sector's evolution.",
    "Corporates and institutions looking for a prestigious gifting or documentation resource.",
    "Communication and marketing professionals working in agriculture.",
    "Anyone with a serious interest in the past, present, and future of Indian farming."
  ];

  return (
    <section id="coffee-table-book" className="w-full bg-white py-12 md:py-16 px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mb-12">

          <AnimatedText delay={0.2}>
            <div className="flex justify-center mb-5">
              <Image
                src="/initiatives/Snail show CTB logo-01.png"
                alt="The Snail Show Coffee Table Book Logo"
                width={180}
                height={80}
                className="object-contain"
              />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-brand-dark mb-4">
              The Snail Show Coffee Table Book
            </h2>
          </AnimatedText>
          <AnimatedText delay={0.3}>
            <p className="text-brand-primary font-medium text-base md:text-lg tracking-wide mb-6">
              A visual record of the people and ideas transforming Indian agriculture.
            </p>
          </AnimatedText>
          <AnimatedText delay={0.35}>
            <div className="flex justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
              <button 
                onClick={() => setActiveVolume(1)}
                className={`px-3 py-1.5 rounded-lg shadow-sm transition-all duration-300 ${activeVolume === 1 ? 'bg-[#4a7c24] text-white' : 'bg-gray-100 text-brand-dark/70 hover:bg-gray-200'}`}
              >
                Volume 1 Published
              </button>
              <button 
                onClick={() => setActiveVolume(2)}
                className={`px-3 py-1.5 rounded-lg shadow-sm transition-all duration-300 ${activeVolume === 2 ? 'bg-[#4a7c24] text-white' : 'bg-gray-100 text-brand-dark/70 hover:bg-gray-200'}`}
              >
                Volume 2 Published
              </button>
              <button 
                onClick={() => setActiveVolume(3)}
                className={`border px-3 py-1.5 rounded-lg shadow-sm transition-all duration-300 ${activeVolume === 3 ? 'bg-amber-500 text-white border-amber-600' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
              >
                Volume 3 In Development
              </button>
            </div>
          </AnimatedText>
        </div>

        {/* Two Columns for Content and simulated Book Cover */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full mt-6">
          {/* Left Side: Mockup of the book */}
          <div className="flex lg:col-span-5 justify-center mb-10 lg:mb-0">
            <AnimatedText delay={0.2} direction="left" className="w-full max-w-[380px]">
              {/* Real Book Photo with spine effect */}
              <div className={`relative aspect-[3/4] w-full rounded-r-2xl overflow-hidden shadow-[20px_20px_60px_-10px_rgba(0,0,0,0.25)] border-l-[10px] group hover:-rotate-1 hover:translate-x-1 hover:shadow-[30px_30px_70px_-12px_rgba(0,0,0,0.3)] transition-all duration-500 ${activeVolume === 3 ? 'border-l-amber-600' : 'border-l-[#4a7c24]'}`}>
                {/* Spine shadow overlay */}
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-black/15 z-10 pointer-events-none" />
                {/* Right sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 z-10 pointer-events-none" />

                {/* Volume 1 Image */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${activeVolume === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <Image
                    src="/initiatives/coffee-table/Coffee Table Book 1.jpg"
                    alt="The Snail Show Coffee Table Book Volume 1"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-center"
                    priority
                  />
                </div>

                {/* Volume 2 Image */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${activeVolume === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <Image
                    src="/initiatives/coffee-table/Coffee Table Book - 2.jpg"
                    alt="The Snail Show Coffee Table Book Volume 2"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Volume 3 Image Placeholder */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${activeVolume === 3 ? 'opacity-100' : 'opacity-0'} bg-stone-100 flex flex-col items-center justify-center p-6 text-center`}>
                  <Image
                    src="/initiatives/Snail show CTB logo-01.png"
                    alt="The Snail Show Coffee Table Book Logo"
                    width={240}
                    height={100}
                    className="object-contain opacity-60 mb-6"
                  />
                  <div className="text-amber-700 font-serif text-2xl font-bold tracking-wide mb-2">3rd Edition</div>
                  <div className="text-brand-dark/50 font-serif text-xl tracking-widest uppercase">Coming Soon</div>
                </div>

                {/* Volume label badge at bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent px-5 py-4 flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Volume {activeVolume}</span>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${activeVolume === 3 ? 'bg-amber-600/80 text-white' : 'bg-[#4a7c24]/80 text-white'}`}>
                    {activeVolume === 3 ? 'In Development' : 'Published'}
                  </span>
                </div>
              </div>
            </AnimatedText>
          </div>

          {/* Right Side: Text & Content */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex flex-col gap-5 text-brand-dark/80 text-sm md:text-base leading-relaxed mb-8">
              <AnimatedText delay={0.2}>
                <p>
                  India's agriculture sector is changing faster than it is being documented. Every year, farmers adopt new practices, researchers validate new approaches, entrepreneurs build companies that change how food is grown and distributed, and communities adapt to the shifting realities of rural life in a modernizing economy. Most of this change happens without formal record, acknowledged in passing by trade publications and policy reports but rarely captured with the depth and visual quality that the scale of transformation deserves.
                </p>
              </AnimatedText>
              <AnimatedText delay={0.25}>
                <p>
                  The Snail Show Coffee Table Book was created to change that. It is a large-format, high-quality publication that documents the changemakers, the innovations, the companies, and the communities that are shaping the future of Indian agriculture. Each volume combines long-form editorial content with professional photography to create a publication that is both informative and visually compelling, one that belongs on the desk of anyone who cares about where Indian agriculture is going.
                </p>
              </AnimatedText>
              <AnimatedText delay={0.3}>
                <p>
                  Volume 1 was launched at the Brand R.Comm Summit and received strong recognition from the agriculture and communication community for the quality of its editorial perspective and its visual production. It featured profiles of pioneering agricultural entrepreneurs, documentation of significant innovations in agri-input technology, and an exploration of how communication is reshaping the relationship between the agriculture sector and the broader Indian public.
                </p>
              </AnimatedText>
              <AnimatedText delay={0.35}>
                <p>
                  Volume 2 built on the foundation established by the first edition, with an expanded editorial scope and an even broader representation of the voices and stories that define Indian agriculture today.
                </p>
              </AnimatedText>
              <AnimatedText delay={0.35}>
                <p>
                  Volume 3 is currently in development and will continue to spotlight the innovators, policies, and practices that are driving the sector forward into the future.
                </p>
              </AnimatedText>
            </div>
          </div>
        </div>

        {/* Centered Who it is for & CTA */}
        <div className="max-w-4xl mx-auto mt-10 flex flex-col items-center w-full px-4">
          <AnimatedText delay={0.4} className="w-full">
            <div className="bg-brand-surface/30 border border-brand-primary/20 rounded-2xl p-5 shadow-sm mb-8 w-full">
              <h4 className="font-serif text-sm font-semibold text-brand-dark mb-4 uppercase tracking-wider border-b border-brand-primary/10 pb-2">
                Who It Is For
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targetAudience.map((item, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs text-brand-dark/70 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedText>

          <AnimatedText delay={0.45} className="w-full text-center mt-4">
            <h3 className="text-lg md:text-xl font-bold text-brand-dark mb-1.5 uppercase tracking-wide">
              FEATURE YOUR COMPANY OR PERSONAL PROFILE IN THIRD EDITION
            </h3>
            <p className="text-brand-primary font-bold text-xs md:text-sm uppercase tracking-wider mb-6">
              LIMITED PAGES AVAILABLE
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center justify-center px-6 py-3 text-xs md:text-sm font-bold rounded-xl bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide cursor-pointer"
              >
                RESERVE YOUR SPACE TODAY!
                <svg className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </AnimatedText>

        </div>

      </div>

      <CoffeeTableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
