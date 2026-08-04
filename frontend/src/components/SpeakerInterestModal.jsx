"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpeakerInterestModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    mobileNumber: "",
    organization: "",
    city: "",
    stateCountry: "",
    pinCode: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/speaker-interests/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        alert(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full ${success ? 'max-w-2xl' : 'max-w-2xl'} bg-brand-surface rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans`}
      >
        {success ? (
          <div className="relative p-6 md:p-10 flex flex-col items-center text-center bg-white h-full justify-center min-h-[400px]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-brand-primary hover:bg-brand-primary-hover p-2 rounded-full transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl md:text-3xl font-black text-black mb-3 tracking-tight uppercase">
              THANK YOU!
            </h2>
            <div className="max-w-md space-y-3 text-black font-medium text-[14px] leading-relaxed mb-6">
              <p>Your interest has been received.</p>
              <p>Our team will review your details and get back to you shortly.</p>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-[12px] font-bold tracking-[0.2em] uppercase rounded-full transition-colors"
            >
              CLOSE WINDOW
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-white relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-20">
              <div>
                <h2 className="text-xl md:text-2xl font-serif text-brand-dark mb-1">Speaker Interest</h2>
                <p className="text-xs text-brand-dark/60 font-medium tracking-wide">Fill out the form below to submit your enquiry.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-brand-dark/50 hover:text-brand-primary bg-gray-50 hover:bg-brand-primary/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Form */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-white">
              <form id="speaker-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-700">Full Name *</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-700">Designation *</label>
                    <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. CEO" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-700">Mobile No. *</label>
                    <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+91" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-700">Organization *</label>
                    <input required type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Company name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-700">City *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-700">State/Country *</label>
                    <input required type="text" name="stateCountry" value={formData.stateCountry} onChange={handleChange} placeholder="State / Country" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1 w-full sm:w-[calc(50%-10px)]">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-700">Pin Code *</label>
                    <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Zip code" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-700">Address *</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="Complete address" rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors resize-none" />
                </div>
              </form>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-5 border-t border-gray-100 bg-white flex justify-center sticky bottom-0 z-20">
              <button 
                type="submit"
                form="speaker-form"
                disabled={loading}
                className="w-full max-w-md px-8 py-3.5 bg-[#6a9a38] hover:bg-[#52792b] text-white text-[12px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all shadow-[0_8px_16px_rgba(106,154,56,0.2)] hover:shadow-[0_12px_20px_rgba(106,154,56,0.3)] disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    SUBMITTING...
                  </span>
                ) : 'SUBMIT ENQUIRY'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
