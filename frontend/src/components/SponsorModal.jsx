"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SponsorModal({ isOpen, onClose, initialCategory = "" }) {
  const [formData, setFormData] = useState({
    companyName: "",
    gstNumber: "",
    contactPerson: "",
    email: "",
    mobileNumber: "",
    city: "",
    stateCountry: "",
    pinCode: "",
    address: "",
    sponsorshipCategory: "",
    basePrice: 0,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const categoryDropdownRef = useRef(null);

  const sponsorshipOptions = {
    "Exclusive Sponsorship": [
      { label: "Presented By", price: 2000000 },
      { label: "Powered By", price: 1500000 },
      { label: "Award Sponsor", price: 500000 },
      { label: "Coffee Table Book Sponsor", price: 500000 },
      { label: "Lanyard Sponsor", price: 200000 },
      { label: "Kit Sponsor", price: 400000 },
      { label: "Lunch Sponsor", price: 350000 },
      { label: "Gala Dinner Sponsor", price: 600000 },
      { label: "Agenda Sponsor", price: 200000 },
      { label: "Badge Sponsor", price: 200000 },
      { label: "Memento Sponsor", price: 300000 }
    ],
    "General Sponsorship": [
      { label: "Platinum Sponsor", price: 500000 },
      { label: "Gold Sponsor", price: 400000 },
      { label: "Silver Sponsor", price: 300000 },
      { label: "Bronze Sponsor", price: 200000 },
      { label: "Panel Sponsor", price: 200000 }
    ]
  };

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      let foundPrice = 0;
      if (initialCategory) {
        for (const cat in sponsorshipOptions) {
          const found = sponsorshipOptions[cat].find(opt => opt.label === initialCategory);
          if (found) {
            foundPrice = found.price;
            break;
          }
        }
      }
      setFormData(prev => ({
        ...prev,
        sponsorshipCategory: initialCategory,
        basePrice: foundPrice
      }));
    }
  }, [isOpen, initialCategory]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryDropdownOpen]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let logoUrl = "";
      if (logoFile) {
        logoUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(logoFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      const payload = {
        ...formData,
        totalAmount: formData.basePrice * 1.18, // Including GST
        logoUrl
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/sponsorships/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        alert(data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate Total Amount
  const gstAmount = formData.basePrice * 0.18;
  const totalAmountValue = formData.basePrice + gstAmount;
  const formattedTotalAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalAmountValue) + "/-";

  const formatPriceLabel = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price) + "/- + GST";
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
        className={`relative w-full ${success ? 'max-w-5xl' : 'max-w-2xl'} bg-brand-surface rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans transition-all duration-300`}
      >
        {success ? (
          <div className="relative p-6 md:p-10 flex flex-col items-center text-center bg-white h-full justify-center overflow-y-auto custom-scrollbar">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-brand-primary hover:bg-brand-primary-hover p-2 rounded-full transition-colors z-10"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl md:text-3xl font-black text-black mb-3 tracking-tight uppercase">
              THANK YOU!
            </h2>
            
            <div className="max-w-3xl space-y-3 text-black font-medium text-[13px] md:text-[14px] leading-relaxed mb-6">
              <p>
                Thank you for submitting your enquiry for the "<strong>{formData.sponsorshipCategory || "Sponsorship"}</strong>" Sponsorship.
              </p>
              <p>
                Our team has received your request and will review it shortly. One of our representatives will get in touch with you soon to discuss the next steps.
              </p>
              <p>
                In the meantime, if you need any additional information or have any questions, please feel free to connect with our team using the contact details below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              {/* Card 1 */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all">
                <h4 className="text-[#0d2a4a] font-bold text-[14px] mb-1">Amit BK Khare</h4>
                <p className="text-[#86af60] font-bold text-[8px] uppercase tracking-wider mb-4">Founder and Managing Partner</p>
                
                <div className="w-full space-y-2 mb-4 text-left">
                  <div className="flex items-start gap-2 text-[10px] text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#86af60] mt-[1px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <div>
                      <p>+91 8750807676</p>
                      <p>+91 9354342588</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[10px] text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#86af60] mt-[1px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <div>
                      <p>amit.khare@snailintegral.com</p>
                      <p>snailintegral@gmail.com</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=BEGIN%3AVCARD%0AVERSION%3A3.0%0AN%3AKhare%3BAmit%3BBK%3B%3B%0AFN%3AAmit+BK+Khare%0AORG%3ASnail+Integral%0ATITLE%3AFounder+and+Managing+Partner%0ATEL%3BTYPE%3DWORK%2CVOICE%3A%2B918750807676%0ATEL%3BTYPE%3DCELL%2CVOICE%3A%2B919354342588%0AEMAIL%3BTYPE%3DPREF%2CINTERNET%3Aamit.khare%40snailintegral.com%0AEND%3AVCARD" alt="QR Code" className="w-20 h-20 mb-2 border p-1 rounded-md" />
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Scan for contact info</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all">
                <h4 className="text-[#0d2a4a] font-bold text-[14px] mb-1">Arpita Kaur Matharu</h4>
                <p className="text-[#86af60] font-bold text-[8px] uppercase tracking-wider mb-4">Lead, Digital Marketing</p>
                
                <div className="w-full space-y-2 mb-4 text-left">
                  <div className="flex items-start gap-2 text-[10px] text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#86af60] mt-[1px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <div>
                      <p>+91 8700178106</p>
                      <p>+91 8750807676</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[10px] text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#86af60] mt-[1px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <div>
                      <p>info@snailintegral.com</p>
                      <p>snailintegral@gmail.com</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=BEGIN%3AVCARD%0AVERSION%3A3.0%0AN%3AMatharu%3BArpita%3BKaur%3B%3B%0AFN%3AArpita+Kaur+Matharu%0AORG%3ASnail+Integral%0ATITLE%3ALead%2C+Digital+Marketing%0ATEL%3BTYPE%3DWORK%2CVOICE%3A%2B918700178106%0ATEL%3BTYPE%3DCELL%2CVOICE%3A%2B918750807676%0AEMAIL%3BTYPE%3DPREF%2CINTERNET%3Ainfo%40snailintegral.com%0AEND%3AVCARD" alt="QR Code" className="w-20 h-20 mb-2 border p-1 rounded-md" />
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Scan for contact info</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all">
                <h4 className="text-[#0d2a4a] font-bold text-[14px] mb-1">Yashasvi Sharma</h4>
                <p className="text-[#86af60] font-bold text-[8px] uppercase tracking-wider mb-4">Lead, Business Support</p>
                
                <div className="w-full space-y-2 mb-4 text-left">
                  <div className="flex items-start gap-2 text-[10px] text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#86af60] mt-[1px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <div>
                      <p>+91 8527552425</p>
                      <p>+91 8750807676</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[10px] text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#86af60] mt-[1px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <div>
                      <p>marketing@snailintegral.com</p>
                      <p>snailintegral2@gmail.com</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=BEGIN%3AVCARD%0AVERSION%3A3.0%0AN%3ASharma%3BYashasvi%3B%3B%3B%0AFN%3AYashasvi+Sharma%0AORG%3ASnail+Integral%0ATITLE%3ALead%2C+Business+Support%0ATEL%3BTYPE%3DWORK%2CVOICE%3A%2B918527552425%0ATEL%3BTYPE%3DCELL%2CVOICE%3A%2B918750807676%0AEMAIL%3BTYPE%3DPREF%2CINTERNET%3Amarketing%40snailintegral.com%0AEND%3AVCARD" alt="QR Code" className="w-20 h-20 mb-2 border p-1 rounded-md" />
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Scan for contact info</span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden bg-[#fbfbf9]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-brand-primary/10 bg-white z-10 shrink-0">
              <h3 className="text-xl md:text-2xl font-serif text-brand-dark font-bold">Sponsorship Booking</h3>
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
            <div className="overflow-y-auto custom-scrollbar flex-1 p-5 md:p-6 bg-white">
              <form id="sponsor-form" onSubmit={handleSubmit} className="space-y-6 w-full mx-auto">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-brand-dark">Company Name <span className="text-red-500">*</span></label>
                    <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter company name" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-brand-dark">GST Number</label>
                    <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="Enter GST number" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium uppercase" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-brand-dark">Contact Person <span className="text-red-500">*</span></label>
                    <input required type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Full name" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-brand-dark">Email <span className="text-red-500">*</span></label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@company.com" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-brand-dark">Mobile Number <span className="text-red-500">*</span></label>
                    <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+91 98765 43210" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-brand-dark">City <span className="text-red-500">*</span></label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-brand-dark">State/Country <span className="text-red-500">*</span></label>
                    <input required type="text" name="stateCountry" value={formData.stateCountry} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-brand-dark">Pin Code <span className="text-red-500">*</span></label>
                    <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-brand-dark">Address <span className="text-red-500">*</span></label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="Full registered address" rows="3" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium resize-none" />
                </div>

                {/* Custom Category Dropdown */}
                <div className="space-y-2 pb-4">
                  <label className="text-[14px] font-bold text-brand-dark block mb-1">Select Sponsorship Category <span className="text-red-500">*</span></label>
                  <div className="relative" ref={categoryDropdownRef}>
                    <div 
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className={`w-full px-4 py-3 text-[14px] border rounded-lg focus:outline-none transition-all cursor-pointer flex justify-between items-center ${isCategoryDropdownOpen ? 'border-brand-primary ring-2 ring-brand-primary/30 bg-white' : 'border-gray-300 bg-white hover:border-brand-primary/50'}`}
                    >
                      <span className={formData.sponsorshipCategory ? "text-brand-dark font-bold" : "text-gray-500 font-medium"}>
                        {formData.sponsorshipCategory || "Select a category..."}
                      </span>
                      <svg className={`w-5 h-5 text-gray-500 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    <AnimatePresence>
                      {isCategoryDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-[calc(100%+8px)] z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto custom-scrollbar"
                        >
                          {Object.entries(sponsorshipOptions).map(([groupName, options], groupIdx) => (
                            <div key={groupIdx} className="py-2">
                              <div className="px-3 py-3">
                                <span className="inline-block bg-[#86af60] text-white text-[11px] md:text-[12px] uppercase font-bold tracking-wider px-3 py-1.5 rounded shadow-sm">
                                  {groupName}
                                </span>
                              </div>
                              {options.map((opt, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={() => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      sponsorshipCategory: opt.label,
                                      basePrice: opt.price
                                    }));
                                    setIsCategoryDropdownOpen(false);
                                  }}
                                  className={`px-4 py-3 text-[13px] cursor-pointer hover:bg-[#f3f7f0] transition-colors flex justify-between items-center ${formData.sponsorshipCategory === opt.label ? 'bg-[#f3f7f0] text-[#71954f] font-bold border-l-4 border-[#86af60]' : 'text-gray-700 font-medium border-l-4 border-transparent'}`}
                                >
                                  <span>{opt.label}</span>
                                  <span className="text-gray-500 text-[12px] font-bold">
                                    {formatPriceLabel(opt.price)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="bg-white px-5 md:px-6 py-4 border-t border-brand-primary/10 shadow-[0_-4px_15px_-3px_rgb(0,0,0,0.05)] z-10 shrink-0">
              <div className="w-full mx-auto space-y-3">
                {formData.basePrice > 0 && (
                  <div className="flex items-center justify-between bg-[#f4f7f4] border border-brand-primary/20 rounded-lg px-4 py-3">
                    <span className="text-[14px] font-bold text-brand-dark">Total Amount <span className="text-[11px] font-normal text-brand-dark/60 ml-1">(inc. 18% GST)</span></span>
                    <span className="text-xl md:text-2xl font-bold text-brand-primary tracking-tight">
                      {formattedTotalAmount}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <label className="cursor-pointer group flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f3f7f0] border border-[#d6e3cd] group-hover:bg-[#e4eedb] transition-colors">
                      <svg className="w-3.5 h-3.5 text-[#86af60]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </span>
                    <span className="text-[13px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
                      {logoFile ? logoFile.name.substring(0, 15) + (logoFile.name.length > 15 ? '...' : '') : 'Upload Company Logo'}
                    </span>
                    <input type="file" className="hidden" onChange={handleLogoFileChange} accept="image/*" />
                  </label>

                  <button 
                    type="submit"
                    form="sponsor-form"
                    disabled={loading || !formData.sponsorshipCategory}
                    className="px-8 py-3 bg-[#6a9a38] hover:bg-[#52792b] text-white font-bold text-[12px] uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? 'PROCESSING...' : 'SUBMIT DETAILS'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}
