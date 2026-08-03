"use client";
import React, { useState } from "react";

export default function SponsorModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    companyName: "",
    mobileNumber: "",
    email: "",
    sponsorshipCategory: "",
  });

  const sponsorshipOptions = [
    { label: "Presented By", price: "20,00,000/- + GST" },
    { label: "Powered By", price: "10,00,000/- + GST" },
    { label: "Award Sponsor", price: "5,00,000/- + GST" },
    { label: "Coffee Table Book Sponsor", price: "Price on Request" },
    { label: "Feature Yourself", price: "Price on Request" },
    { label: "Platinum Sponsor", price: "Price on Request" },
    { label: "Gold Sponsor", price: "Price on Request" },
    { label: "Silver Sponsor", price: "Price on Request" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate email sending
    console.log("Submitting form data (would send email here):", formData);
    alert("Thank you! Your sponsorship request has been submitted.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-brand-dark/95 border border-brand-primary/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-brand-primary/10 border-b border-brand-primary/20 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-serif text-white">Become a Sponsor</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wide">Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" placeholder="Your Name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wide">Designation</label>
              <input required type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" placeholder="Your Designation" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/80 uppercase tracking-wide">Company Name</label>
            <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" placeholder="Your Company Name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wide">Mobile Number</label>
              <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" placeholder="Your Mobile Number" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wide">Email ID</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" placeholder="Your Email Address" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/80 uppercase tracking-wide">Sponsorship Category</label>
            <div className="relative">
              <select required name="sponsorshipCategory" value={formData.sponsorshipCategory} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors appearance-none cursor-pointer">
                <option value="" disabled className="bg-brand-dark text-white/50">Select Tier of Interest</option>
                {sponsorshipOptions.map((option, idx) => (
                  <option key={idx} value={option.label} className="bg-brand-dark text-white">
                    {option.label} {option.price && option.price !== "Price on Request" ? `- ${option.price}` : ""}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold tracking-wider uppercase py-3 rounded-lg shadow-lg shadow-brand-primary/20 transition-all duration-300 transform hover:-translate-y-0.5">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
