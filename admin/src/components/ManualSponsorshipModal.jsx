"use client";

import React, { useState } from 'react';
import { X, Info, Upload, Check, Briefcase, Building2, User, Mail, Phone, MapPin, Globe, CreditCard, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';

const EXCLUSIVE_SPONSORSHIPS = [
  { tier: 'Presented By', basePrice: 2000000, label: 'INR 20,00,000/- + GST' },
  { tier: 'Powered By', basePrice: 1500000, label: 'INR 15,00,000/- + GST' },
  { tier: 'Award Sponsor', basePrice: 500000, label: 'INR 5,00,000/- + GST' },
  { tier: 'Coffee Table Book Sponsor', basePrice: 500000, label: 'INR 5,00,000 + GST' },
  { tier: 'Lanyard Sponsor', basePrice: 200000, label: 'INR 2,00,000/- + GST' },
  { tier: 'Kit Sponsor', basePrice: 400000, label: 'INR 4,00,000 + GST' },
  { tier: 'Lunch Sponsor', basePrice: 350000, label: 'INR 3,50,000 + GST' },
  { tier: 'Gala Dinner Sponsor', basePrice: 600000, label: 'INR 6,00,000 + GST' },
  { tier: 'Agenda Sponsor', basePrice: 200000, label: 'INR 2,00,000 + GST' },
  { tier: 'Badge Sponsor', basePrice: 200000, label: 'INR 2,00,000 + GST' },
  { tier: 'Memento Sponsor', basePrice: 300000, label: 'INR 3,00,000 + GST' },
];

const GENERAL_SPONSORSHIPS = [
  { tier: 'Platinum Sponsor', basePrice: 500000, label: '₹5,00,000 + GST' },
  { tier: 'Gold Sponsor', basePrice: 400000, label: '₹4,00,000 + GST' },
  { tier: 'Silver Sponsor', basePrice: 300000, label: '₹3,00,000 + GST' },
  { tier: 'Bronze Sponsor', basePrice: 200000, label: '₹2,00,000 + GST' },
  { tier: 'Panel Sponsor', basePrice: 200000, label: '₹2,00,000 + GST' },
];

export default function ManualSponsorshipModal({ isOpen, onClose, onSponsorshipAdded }) {
  const [formData, setFormData] = useState({
    companyName: '',
    gstNumber: '',
    contactPerson: '',
    email: '',
    mobileNumber: '',
    city: '',
    stateCountry: '',
    pinCode: '',
    address: '',
    selectedCategory: 'Exclusive Sponsorship',
    selectedTier: 'Presented By',
    logoUrl: '',
    registeredBy: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectTier = (category, item) => {
    setFormData(prev => ({
      ...prev,
      selectedCategory: category,
      selectedTier: item.tier,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Find currently selected tier item
  let currentTierObj = EXCLUSIVE_SPONSORSHIPS.find(i => i.tier === formData.selectedTier);
  let currentCategory = 'Exclusive Sponsorship';
  if (!currentTierObj) {
    currentTierObj = GENERAL_SPONSORSHIPS.find(i => i.tier === formData.selectedTier);
    currentCategory = 'General Sponsorship';
  }
  const baseAmount = currentTierObj ? currentTierObj.basePrice : 2000000;
  const gstAmount = baseAmount * 0.18;
  const totalPayable = baseAmount + gstAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        companyName: formData.companyName,
        gstNumber: formData.gstNumber,
        contactPerson: formData.contactPerson,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        stateCountry: formData.stateCountry,
        pinCode: formData.pinCode,
        address: formData.address,
        sponsorshipCategory: currentCategory,
        sponsorshipTier: formData.selectedTier,
        registrationType: 'Manual Registration',
        registeredBy: formData.registeredBy,
        basePrice: baseAmount,
        totalAmount: totalPayable,
        logoUrl: logoPreview || formData.logoUrl || '',
      };

      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsorships/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        onSponsorshipAdded();
        onClose();
        setFormData({
          companyName: '',
          gstNumber: '',
          contactPerson: '',
          email: '',
          mobileNumber: '',
          city: '',
          stateCountry: '',
          pinCode: '',
          address: '',
          selectedCategory: 'Exclusive Sponsorship',
          selectedTier: 'Presented By',
          logoUrl: '',
          registeredBy: '',
        });
        setLogoFile(null);
        setLogoPreview('');
      } else {
        setError(data.message || 'Failed to add sponsorship');
      }
    } catch (err) {
      console.error(err);
      setError('Network error creating sponsorship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-gray-950/70 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#5e8e33]/10 flex items-center justify-center text-[#5e8e33]">
              <Briefcase size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Manual Sponsorship Booking</h2>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
                  Admin Entry
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Enter organization details & select sponsorship package</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto px-5 sm:px-8 py-6 custom-scrollbar space-y-7 flex-1">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs font-semibold rounded-2xl border border-red-100 flex items-start gap-3 shadow-xs">
              <Info className="flex-shrink-0 text-red-500 mt-0.5" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form id="manualSponsorshipForm" onSubmit={handleSubmit} className="space-y-7">
            
            {/* Section 1: Company & Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <Building2 size={18} className="text-[#5e8e33]" />
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">1. Organization & Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      placeholder="Enter company name"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* GST Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">GST Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="Enter GST number"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      placeholder="Full name"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@company.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* State/Country */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    State/Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="stateCountry"
                      value={formData.stateCountry}
                      onChange={handleChange}
                      required
                      placeholder="State/Country"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Pin Code */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    required
                    placeholder="Pin Code"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Full registered address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Section 2: Select Sponsorship Category & Package Tier */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <ShieldCheck size={18} className="text-[#5e8e33]" />
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">2. Select Sponsorship Package</h3>
              </div>

              {/* EXCLUSIVE SPONSORSHIP */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#3b6b29] text-white text-[11px] font-extrabold uppercase rounded-full tracking-wider shadow-xs">
                  EXCLUSIVE SPONSORSHIP
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXCLUSIVE_SPONSORSHIPS.map((item) => {
                    const isSelected = formData.selectedTier === item.tier;
                    return (
                      <div 
                        key={item.tier}
                        onClick={() => handleSelectTier('Exclusive Sponsorship', item)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#5e8e33] bg-[#5e8e33]/5 shadow-sm ring-1 ring-[#5e8e33]' 
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-[#5e8e33] bg-[#5e8e33]' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check size={10} className="text-white stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">{item.tier}</span>
                        </div>
                        <span className="text-xs font-black text-gray-800 font-mono tracking-tight">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GENERAL SPONSORSHIP */}
              <div className="space-y-3 pt-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#3b6b29] text-white text-[11px] font-extrabold uppercase rounded-full tracking-wider shadow-xs">
                  GENERAL SPONSORSHIP
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GENERAL_SPONSORSHIPS.map((item) => {
                    const isSelected = formData.selectedTier === item.tier;
                    return (
                      <div 
                        key={item.tier}
                        onClick={() => handleSelectTier('General Sponsorship', item)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#5e8e33] bg-[#5e8e33]/5 shadow-sm ring-1 ring-[#5e8e33]' 
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-[#5e8e33] bg-[#5e8e33]' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check size={10} className="text-white stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">{item.tier}</span>
                        </div>
                        <span className="text-xs font-black text-gray-800 font-mono tracking-tight">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Logo & Admin Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              {/* Upload Company Logo */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">Upload Company Logo</label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 cursor-pointer transition-colors flex items-center gap-2 shadow-xs">
                    <Upload size={15} />
                    <span>Choose File</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                  <span className="text-xs text-gray-500 truncate max-w-[160px]">
                    {logoFile ? logoFile.name : 'No file chosen'}
                  </span>
                </div>
                {logoPreview && (
                  <div className="mt-2.5 inline-block relative group">
                    <img src={logoPreview} alt="Logo Preview" className="h-12 w-auto object-contain border border-gray-200 rounded-xl p-1.5 bg-white shadow-xs" />
                  </div>
                )}
              </div>

              {/* Application filled by */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">Application filled by</label>
                <input
                  type="text"
                  name="registeredBy"
                  value={formData.registeredBy}
                  onChange={handleChange}
                  placeholder="Name- for snail team"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/30 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Live Price Summary Card */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-gray-500 font-medium">Selected Package: </span>
                <span className="font-extrabold text-gray-900">{formData.selectedTier} ({currentCategory})</span>
              </div>
              <div>
                <span className="text-emerald-700 font-black text-sm sm:text-base font-mono tracking-tight">
                  {currentTierObj?.label || 'INR 20,00,000/- + GST'}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#5e8e33] hover:bg-[#4d7828] text-white text-sm font-black uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Sponsorship...</span>
                  </>
                ) : (
                  <span>SUBMIT ENQUIRY</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
