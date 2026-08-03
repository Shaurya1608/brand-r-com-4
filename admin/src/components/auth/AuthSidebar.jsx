import React from 'react';

export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden bg-[#5a862b] w-1/2">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#6a9a38] via-[#568128] to-[#3a571b]" />
      
      {/* Subtle Grid Pattern for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      {/* Decorative blurred blobs for depth */}
      <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-white rounded-full blur-[140px] opacity-10" />
      <div className="absolute top-[-10%] -left-32 w-[24rem] h-[24rem] bg-[#a8e063] rounded-full blur-[130px] opacity-20" />

      <div className="relative z-10 w-full max-w-md -translate-y-8 flex flex-col items-center">
        {/* Logo Container */}
        <div className="mb-12 bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
          <img 
            src="/logo/New%20nrc%20logo.png" 
            alt="Brand R.Comm Logo" 
            className="w-64 md:w-80 h-auto object-contain drop-shadow-xl"
          />
        </div>

        {/* Text Content */}
        <div className="text-center text-white/95 text-[15px] leading-relaxed px-6 space-y-5">
          <p className="font-medium tracking-wide">
            Welcome to the centralized dashboard for the Brand R.Comm Awards. 
            Review, approve, and manage all incoming nominations seamlessly.
          </p>
          <p className="text-white/80 text-[14px]">
            Assign entries to jury members, track evaluation progress in real-time, 
            generate comprehensive reports, and finalize the winners' list effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
