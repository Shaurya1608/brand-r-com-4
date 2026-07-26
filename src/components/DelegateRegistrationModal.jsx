"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DelegateRegistrationModal({ isOpen, onClose }) {
  const [delegateType, setDelegateType] = useState("indian");
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Delegate Registration submitted:", { delegateType, ...formData });
    // Handle form submission logic here
    onClose();
  };

  const totalAmount = delegateType === "indian" ? "₹ 5,900/-" : "$ 150/-";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-primary/10">
              <h3 className="text-lg font-bold text-brand-dark">Delegate Registration</h3>
              <button 
                onClick={onClose}
                className="text-brand-dark/50 hover:text-brand-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Body */}
            <div className="overflow-y-auto px-5 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <form id="delegate-form" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Delegate Type */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-brand-surface p-3 rounded-lg border border-brand-primary/10">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="delegateType" 
                      value="indian"
                      checked={delegateType === "indian"}
                      onChange={(e) => setDelegateType(e.target.value)}
                      className="w-3.5 h-3.5 text-brand-primary focus:ring-brand-primary border-gray-300"
                    />
                    <span className="text-[13px] font-medium text-brand-dark">Indian Delegate (INR)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="delegateType" 
                      value="foreign"
                      checked={delegateType === "foreign"}
                      onChange={(e) => setDelegateType(e.target.value)}
                      className="w-3.5 h-3.5 text-brand-primary focus:ring-brand-primary border-gray-300"
                    />
                    <span className="text-[13px] font-medium text-brand-dark">Foreign Delegate (USD)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-brand-dark/70">Full Name</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary/50 bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-brand-dark/70">Designation</label>
                    <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Job title" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary/50 bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-brand-dark/70">Mobile Number</label>
                    <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+91 98765 43210" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary/50 bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-brand-dark/70">Organization</label>
                    <input required type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Company name" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary/50 bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-brand-dark/70">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary/50 bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-brand-dark/70">State/Country</label>
                    <input required type="text" name="stateCountry" value={formData.stateCountry} onChange={handleChange} placeholder="State/Country" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary/50 bg-white" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-brand-dark/70">Pin Code</label>
                    <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Pin code" className="w-full sm:w-[calc(50%-0.375rem)] px-3 py-2 text-[13px] border border-brand-primary/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary/50 bg-white" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-brand-dark/70">Address</label>
                    <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="Full address" rows="2" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary/50 bg-white resize-none" />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-brand-surface px-5 py-4 border-t border-brand-primary/10 space-y-3">
              <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded border border-brand-primary/10 shadow-sm">
                <span className="font-bold text-brand-dark text-[13px] md:text-sm">Total Amount:</span>
                <span className="font-bold text-brand-primary text-base md:text-lg">{totalAmount}</span>
              </div>
              <button 
                type="submit"
                form="delegate-form"
                className="w-full py-2.5 bg-brand-primary hover:bg-brand-dark text-white font-bold text-[11px] uppercase tracking-[0.15em] rounded transition-colors shadow-sm"
              >
                SUBMIT DETAILS
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
