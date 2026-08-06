"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpeakerModal({ isOpen, onClose }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    mobileNumber: "",
    email: "",
    organization: "",
    city: "",
    stateCountry: "",
    pinCode: "",
    address: "",
    subjectArea: ""
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset state when opened
      setIsSubmitted(false);
      setLoading(false);
      setFormData({
        fullName: "",
        designation: "",
        mobileNumber: "",
        email: "",
        organization: "",
        city: "",
        stateCountry: "",
        pinCode: "",
        address: "",
        subjectArea: ""
      });
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/speakers/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        alert(data.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] border border-brand-primary/10"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-brand-dark/50 hover:bg-brand-primary/10 hover:text-brand-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!isSubmitted ? (
              <div className="flex flex-col h-full">
                <div className="px-6 md:px-8 pt-6 pb-4">
                  
                  <div className="text-center mb-4">
                    <h2 className="text-lg md:text-xl font-serif font-bold text-brand-dark">
                      Speaker Interest
                    </h2>
                    <p className="text-[10px] md:text-xs text-brand-dark/50 mt-1">
                      Fill out the form below to submit your enquiry.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">Full Name</label>
                        <input 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark"
                        />
                      </div>
                      {/* Designation */}
                      <div>
                        <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">Designation</label>
                        <input 
                          type="text" 
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          placeholder="e.g. CEO"
                          required
                          className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark"
                        />
                      </div>
                      {/* Mobile Number */}
                      <div>
                        <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">Mobile No.</label>
                        <input 
                          type="tel" 
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="+91"
                          required
                          className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark"
                        />
                      </div>
                      {/* Email Address */}
                      <div>
                        <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          required
                          className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark"
                        />
                      </div>
                      {/* Organization */}
                      <div>
                        <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">Organization</label>
                        <input 
                          type="text" 
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder="Company name"
                          required
                          className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark"
                        />
                      </div>
                      {/* City */}
                      <div>
                        <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">City</label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          required
                          className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all text-brand-dark"
                        />
                      </div>
                      {/* State/Country */}
                      <div>
                        <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">State/Country</label>
                        <input 
                          type="text" 
                          name="stateCountry"
                          value={formData.stateCountry}
                          onChange={handleChange}
                          placeholder="State / Country"
                          required
                          className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all text-brand-dark"
                        />
                      </div>
                      {/* Pin Code */}
                      <div>
                        <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">Pin Code</label>
                        <input 
                          type="text" 
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleChange}
                          placeholder="Zip code"
                          required
                          className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all text-brand-dark"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">Address</label>
                      <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Complete address"
                        required
                        className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all text-brand-dark resize-none"
                      ></textarea>
                    </div>

                    {/* Subject Area */}
                    <div>
                      <label className="block text-[10px] font-bold text-brand-dark/70 uppercase tracking-wider mb-1">*Subject Area which you'll be talk.</label>
                      <input 
                        type="text" 
                        name="subjectArea"
                        value={formData.subjectArea}
                        onChange={handleChange}
                        placeholder="Enter proposed topic / subject area"
                        className="w-full px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-[#7ab036] text-white font-bold text-[11px] py-2.5 rounded-lg uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {loading ? "SUBMITTING..." : "SUBMIT ENQUIRY"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 md:p-10 text-center h-full bg-white">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-dark mb-3">
                  Thank You for Your Interest!
                </h3>
                <p className="text-brand-dark/70 text-sm mb-4 max-w-sm mx-auto leading-relaxed">
                  Your Speaker Interest Enquiry has been submitted successfully. Our team will carefully review your profile and submission.
                </p>
                <p className="text-brand-dark/70 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                  If your expertise aligns with the conference agenda, we will get in touch with you regarding the next steps. Thank you for your interest in speaking at BRAND R.Comm 2026.
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button 
                    onClick={handleClose}
                    className="w-full py-2.5 bg-brand-dark text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-md hover:bg-black transition-colors"
                  >
                    Back to Home
                  </button>
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: "",
                        designation: "",
                        mobileNumber: "",
                        organization: "",
                        city: "",
                        stateCountry: "",
                        pinCode: "",
                        address: ""
                      });
                    }}
                    className="w-full py-2.5 bg-white border border-brand-dark/20 text-brand-dark font-bold text-[10px] uppercase tracking-[0.2em] rounded-md hover:bg-brand-surface hover:border-brand-primary/50 transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
