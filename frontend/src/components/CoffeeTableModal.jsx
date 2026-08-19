"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRY_CODES } from "../utils/countryCodes";
import CountryCodeSelect from "./CountryCodeSelect";

export default function CoffeeTableModal({ isOpen, onClose }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    countryCode: "+91",
    mobileNumber: "",
    email: "",
    organization: "",
    city: "",
    stateCountry: "",
    pinCode: "",
    address: "",
    featureType: "Individual",
    pagesRequested: "2"
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
        countryCode: "+91",
        mobileNumber: "",
        email: "",
        organization: "",
        city: "",
        stateCountry: "",
        pinCode: "",
        address: "",
        featureType: "Individual",
        pagesRequested: "2"
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

    // Email & Mobile format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(String(formData.email).trim().toLowerCase())) {
      alert('Please enter a valid email address (e.g. name@company.com)');
      return;
    }

    const mobileDigits = String(formData.mobileNumber || '').replace(/\D/g, '');
    if (!mobileDigits || mobileDigits.length < 10 || mobileDigits.length > 15) {
      alert('Please enter a valid 10-digit mobile number (e.g. 9876543210 or +91 9876543210)');
      return;
    }

    setLoading(true);
    const formattedMobile = formData.mobileNumber.startsWith('+') 
      ? formData.mobileNumber 
      : `${formData.countryCode || '+91'} ${formData.mobileNumber.trim()}`;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coffee-table/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          mobileNumber: formattedMobile
        })
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
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] border border-brand-primary/10"
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
              <div className="flex flex-col h-full max-h-[85vh]">
                <div className="px-6 md:px-8 pt-6 pb-4 overflow-y-auto custom-scrollbar flex-1">
                  
                  <div className="text-center mb-6 shrink-0 border-b border-brand-primary/10 pb-5 pt-2">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark leading-tight mb-2">
                      Coffee Table Book <span className="text-brand-primary italic">3rd Edition</span>
                    </h2>
                    <p className="text-xs md:text-sm text-brand-dark/60 font-semibold tracking-wider uppercase">
                      Feature Your Company or Personal Profile
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5 shrink-0 px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full px-4 py-2.5 text-[13px] md:text-sm rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark font-medium shadow-sm"
                        />
                      </div>
                      {/* Designation */}
                      <div>
                        <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">Designation</label>
                        <input 
                          type="text" 
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          placeholder="e.g. CEO"
                          required
                          className="w-full px-4 py-2.5 text-[13px] md:text-sm rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark font-medium shadow-sm"
                        />
                      </div>
                      {/* Mobile Number */}
                      <div>
                        <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">Mobile No.</label>
                        <div className="flex items-center gap-1.5">
                          <CountryCodeSelect
                            name="countryCode"
                            value={formData.countryCode || '+91'}
                            onChange={handleChange}
                            buttonStyle="flex items-center justify-between gap-1 px-3 py-2.5 rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 text-brand-dark font-semibold text-[13px] md:text-sm outline-none transition-all cursor-pointer min-w-[85px] shadow-sm"
                          />
                          <input 
                            type="tel" 
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            placeholder="98765 43210"
                            required
                            className="flex-1 min-w-0 px-3 py-1.5 text-[13px] rounded border border-brand-primary/20 bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark"
                          />
                        </div>
                      </div>
                      {/* Email Address */}
                      <div>
                        <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          required
                          className="w-full px-4 py-2.5 text-[13px] md:text-sm rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark font-medium shadow-sm"
                        />
                      </div>
                      {/* Organization */}
                      <div>
                        <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">Organization</label>
                        <input 
                          type="text" 
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder="Company name"
                          required
                          className="w-full px-4 py-2.5 text-[13px] md:text-sm rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-brand-dark/30 text-brand-dark font-medium shadow-sm"
                        />
                      </div>
                      {/* City */}
                      <div>
                        <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">City</label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          required
                          className="w-full px-4 py-2.5 text-[13px] md:text-sm rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-brand-dark font-medium shadow-sm"
                        />
                      </div>
                      {/* State/Country */}
                      <div>
                        <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">State/Country</label>
                        <input 
                          type="text" 
                          name="stateCountry"
                          value={formData.stateCountry}
                          onChange={handleChange}
                          placeholder="State / Country"
                          required
                          className="w-full px-4 py-2.5 text-[13px] md:text-sm rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-brand-dark font-medium shadow-sm"
                        />
                      </div>
                      {/* Pin Code */}
                      <div>
                        <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">Pin Code</label>
                        <input 
                          type="text" 
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleChange}
                          placeholder="Zip code"
                          required
                          className="w-full px-4 py-2.5 text-[13px] md:text-sm rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-brand-dark font-medium shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-1.5 ml-1">Address</label>
                      <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Complete address"
                        required
                        className="w-full px-4 py-2.5 text-[13px] md:text-sm rounded-xl border border-brand-primary/20 bg-brand-surface/10 hover:bg-brand-surface/30 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-brand-dark font-medium shadow-sm resize-none"
                      ></textarea>
                    </div>

                    {/* Feature Type */}
                    <div>
                      <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-2 ml-1">Select Feature Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Individual', 'Company'].map(type => (
                          <label key={type} className={`flex items-center justify-center py-2 px-3 rounded-xl border cursor-pointer transition-all ${formData.featureType === type ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm' : 'bg-brand-surface/10 border-brand-primary/20 hover:bg-brand-surface/30 text-brand-dark/70'}`}>
                            <input type="radio" name="featureType" value={type} checked={formData.featureType === type} onChange={handleChange} className="hidden" />
                            <span className="text-xs md:text-sm font-bold tracking-wide">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pages Requested */}
                    <div>
                      <label className="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider mb-2 ml-1">How many pages you want</label>
                      <div className="grid grid-cols-4 gap-2 md:gap-3">
                        {['2', '4', '6', '8'].map(num => (
                          <label key={num} className={`flex flex-col items-center justify-center py-2 rounded-xl border cursor-pointer transition-all ${formData.pagesRequested === num ? 'bg-brand-primary text-white border-brand-primary shadow-sm transform scale-[1.02]' : 'bg-brand-surface/10 border-brand-primary/20 hover:bg-brand-surface/30 text-brand-dark/70'}`}>
                            <input type="radio" name="pagesRequested" value={num} checked={formData.pagesRequested === num} onChange={handleChange} className="hidden" />
                            <span className="text-sm md:text-base font-bold">{num}</span>
                            <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider opacity-80 mt-0.5">Pages</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-2.5 flex items-center gap-3 shadow-sm mt-1">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0">Pricing Note</p>
                        <p className="text-[11px] font-medium text-amber-900/80">Per page cost is <span className="font-bold">₹75,000 + GST</span></p>
                      </div>
                    </div>

                    <div className="pt-1 pb-2">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-[13px] py-3 rounded-xl uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
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
                  Your Coffee Table Book Enquiry has been submitted successfully. Our team will carefully review your submission.
                </p>
                <p className="text-brand-dark/70 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                  We will get in touch with you regarding the next steps. Thank you for your interest in the BRAND R.Comm 2026 Coffee Table Book.
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
                        address: "",
                        featureType: "Individual",
                        pagesRequested: "2"
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
