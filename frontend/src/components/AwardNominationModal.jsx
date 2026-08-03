"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AwardNominationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    organization: "",
    email: "",
    mobileNumber: "",
    website: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    address: "",
    applicantType: "Individual",
    awardCategory: "",
    paymentMethod: "Online (Razorpay)",
  });
  
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = [
    "Best Rural Marketing Campaign",
    "Best Use of Digital in Rural",
    "Best Agri-Tech Innovation",
    "Rural Brand of the Year",
    "Best CSR Initiative in Rural",
    "Best Rural Activation",
  ];

  const totalAmount = "₹17,700/-";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/svg+xml" || file.type === "image/png") {
        setDocumentFile(file);
        setError("");
      } else {
        setDocumentFile(null);
        setError("Only SVG or PNG files are allowed.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!documentFile) {
      setError("Please upload a supporting document (SVG or PNG).");
      return;
    }

    if (!formData.awardCategory) {
      setError("Please select an award category.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.append('document', documentFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-3xl bg-brand-surface rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans"
          >
            {success ? (
              <div className="relative p-8 md:p-16 flex flex-col items-center text-center bg-white h-full justify-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-primary bg-brand-surface hover:bg-brand-primary/10 p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-serif text-brand-dark font-bold mb-4 uppercase tracking-wider">
                  Details Saved Successfully
                </h2>

                <p className="text-brand-dark/70 text-[14px] leading-relaxed max-w-md mb-8">
                  Thank you for completing your nomination details. Your nomination information has been saved successfully. Please proceed to the payment page to complete your nomination submission.
                </p>

                <div className="flex flex-col w-full gap-3 max-w-sm">
                  <button
                    onClick={() => {
                      alert("Proceeding to Payment...");
                    }}
                    className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-mono font-bold text-[12px] uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Continue to Payment
                  </button>

                  <button
                    onClick={() => setSuccess(false)}
                    className="w-full py-3.5 border-2 border-brand-primary/20 hover:border-brand-primary text-brand-primary bg-transparent font-mono font-bold text-[12px] uppercase tracking-widest rounded-lg transition-all hover:bg-brand-primary/5"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden bg-[#fbfbf9]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-brand-primary/10 bg-white z-10 shrink-0">
                  <h3 className="text-xl md:text-2xl font-serif text-brand-dark font-bold">Award Nomination Form</h3>
                  <button
                    onClick={onClose}
                    className="text-brand-dark/40 hover:text-brand-primary bg-brand-surface hover:bg-brand-primary/10 p-2 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form Body */}
                <div className="overflow-y-auto custom-scrollbar flex-1 p-5 md:p-6">
                  <form id="nomination-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

                    {/* Section 1: Applicant Information */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">1</div>
                        <h4 className="text-lg md:text-xl font-bold text-brand-dark">Applicant Information</h4>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-brand-dark">Full Name <span className="text-red-500">*</span></label>
                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark">Designation <span className="text-red-500">*</span></label>
                          <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Marketing Head" className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark">Organization / Company Name <span className="text-red-500">*</span></label>
                          <input required type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Company name" className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark">Email Address <span className="text-red-500">*</span></label>
                          <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark">Mobile Number <span className="text-red-500">*</span></label>
                          <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+91 00000 00000" className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-brand-dark">Website <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                      </div>
                    </div>

                    {/* Section 2: Address Details */}
                    <div className="space-y-6 pt-4">
                      <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">2</div>
                        <h4 className="text-lg md:text-xl font-bold text-brand-dark">Address Details</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark">City <span className="text-red-500">*</span></label>
                          <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark">State <span className="text-red-500">*</span></label>
                          <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark">Country <span className="text-red-500">*</span></label>
                          <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark">Pin Code <span className="text-red-500">*</span></label>
                          <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-brand-dark">Complete Address <span className="text-red-500">*</span></label>
                        <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="House / Street / Landmark" rows="3" className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium resize-none" />
                      </div>
                    </div>

                    {/* Section 3: Award Details */}
                    <div className="space-y-6 pt-4">
                      <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">3</div>
                        <h4 className="text-lg md:text-xl font-bold text-brand-dark">Award Details</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold text-brand-dark block">Applicant Type <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-brand-dark">
                            <input 
                              type="radio" 
                              name="applicantType" 
                              value="Individual" 
                              checked={formData.applicantType === "Individual"}
                              onChange={handleChange}
                              className="w-4 h-4 text-[#3b82f6] focus:ring-[#3b82f6] border-gray-300"
                            />
                            Individual
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-brand-dark">
                            <input 
                              type="radio" 
                              name="applicantType" 
                              value="Organization" 
                              checked={formData.applicantType === "Organization"}
                              onChange={handleChange}
                              className="w-4 h-4 text-[#3b82f6] focus:ring-[#3b82f6] border-gray-300"
                            />
                            Organization
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark block">Select Award Category <span className="text-red-500">*</span></label>
                          <select 
                            required 
                            name="awardCategory" 
                            value={formData.awardCategory}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium appearance-none"
                          >
                            <option value="" disabled>Choose a category...</option>
                            {categories.map((cat, idx) => (
                              <option key={idx} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold text-brand-dark block">Payment Mode <span className="text-red-500">*</span></label>
                          <select 
                            required 
                            name="paymentMethod" 
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium appearance-none"
                          >
                            <option value="Online (Razorpay)">Online (Razorpay)</option>
                            <option value="Invoice">Invoice</option>
                            <option value="Offline">Offline</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-red-600 text-sm font-bold text-center">{error}</p>
                      </div>
                    )}
                  </form>
                </div>

                {/* Footer with Amount and Upload */}
                <div className="bg-white px-4 md:px-5 py-3 border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgb(0,0,0,0.05)] z-10 shrink-0">
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-[#f8f9fa] rounded-xl p-2.5 md:p-3 mb-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="font-bold text-[13px] text-brand-dark">Total Amount:</span>
                        <span className="font-bold text-xl md:text-2xl text-brand-primary leading-none">{totalAmount}</span>
                      </div>
                      
                      <div className="space-y-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="block text-[12px] font-bold text-brand-dark">Upload Supporting Documents</label>
                          <p className="text-[10px] font-bold text-brand-dark/70">Company profile & logo (SVG or PNG)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-2.5 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-semibold text-[11px] rounded border border-brand-primary/20 transition-colors whitespace-nowrap">
                            Choose File
                            <input 
                              type="file" 
                              accept=".svg,.png" 
                              onChange={handleFileChange} 
                              className="hidden" 
                            />
                          </label>
                          <span className="text-[10px] text-gray-500 truncate max-w-[120px]">
                            {documentFile ? documentFile.name : "No file chosen"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      form="nomination-form"
                      disabled={loading}
                      className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {loading ? 'SUBMITTING...' : 'SUBMIT DETAILS'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
