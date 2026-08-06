"use client";

import React, { useState } from 'react';
import { X, Info, Upload } from 'lucide-react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Determine selected tier details
      let selectedItem = EXCLUSIVE_SPONSORSHIPS.find(i => i.tier === formData.selectedTier);
      let catName = 'Exclusive Sponsorship';
      if (!selectedItem) {
        selectedItem = GENERAL_SPONSORSHIPS.find(i => i.tier === formData.selectedTier);
        catName = 'General Sponsorship';
      }

      const basePrice = selectedItem ? selectedItem.basePrice : 2000000;
      const gstAmount = basePrice * 0.18;
      const totalAmount = basePrice + gstAmount;

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
        sponsorshipCategory: catName,
        sponsorshipTier: formData.selectedTier,
        registrationType: 'Manual Registration',
        registeredBy: formData.registeredBy,
        basePrice,
        totalAmount,
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto flex flex-col max-h-[92vh] font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Manual Sponsorship Booking</h2>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto px-6 py-5 custom-scrollbar space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2.5">
              <Info className="flex-shrink-0 text-red-500 mt-0.5" size={16} />
              <span>{error}</span>
            </div>
          )}

          <form id="manualSponsorshipForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Top 2-Column Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@company.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State/Country</label>
                <input
                  type="text"
                  name="stateCountry"
                  value={formData.stateCountry}
                  onChange={handleChange}
                  required
                  placeholder="State/Country"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pin Code</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                  placeholder="Pin Code"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Full registered address"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] resize-none"
              />
            </div>

            {/* Sponsorship Categories & Tiers */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-extrabold text-gray-900 border-b pb-2">Select Sponsorship Category</h3>
              
              {/* Exclusive Sponsorship Section */}
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-[#3b6b29] text-white text-[11px] font-extrabold uppercase rounded-full tracking-wider">
                  EXCLUSIVE SPONSORSHIP
                </div>
                
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {EXCLUSIVE_SPONSORSHIPS.map((item) => {
                    const isSelected = formData.selectedTier === item.tier;
                    return (
                      <label 
                        key={item.tier}
                        onClick={() => handleSelectTier('Exclusive Sponsorship', item)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-[#3b6b29] bg-[#3b6b29]/5 ring-1 ring-[#3b6b29]' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="sponsorshipTier" 
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#3b6b29] focus:ring-[#3b6b29]"
                          />
                          <span className="text-sm font-bold text-gray-900">{item.tier}</span>
                        </div>
                        <span className="text-xs font-black text-gray-900 tracking-tight">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* General Sponsorship Section */}
              <div className="space-y-2 pt-3">
                <div className="inline-block px-3 py-1 bg-[#3b6b29] text-white text-[11px] font-extrabold uppercase rounded-full tracking-wider">
                  GENERAL SPONSORSHIP
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {GENERAL_SPONSORSHIPS.map((item) => {
                    const isSelected = formData.selectedTier === item.tier;
                    return (
                      <label 
                        key={item.tier}
                        onClick={() => handleSelectTier('General Sponsorship', item)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-[#3b6b29] bg-[#3b6b29]/5 ring-1 ring-[#3b6b29]' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="sponsorshipTier" 
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#3b6b29] focus:ring-[#3b6b29]"
                          />
                          <span className="text-sm font-bold text-gray-900">{item.tier}</span>
                        </div>
                        <span className="text-xs font-black text-gray-900 tracking-tight">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Row: Logo & Registered By */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              {/* Upload Logo */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Upload Company Logo</label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload size={14} />
                    <span>Choose File</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                  <span className="text-xs text-gray-500 truncate max-w-[150px]">
                    {logoFile ? logoFile.name : 'No file chosen'}
                  </span>
                </div>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo Preview" className="h-10 mt-2 object-contain border border-gray-200 rounded p-1" />
                )}
              </div>

              {/* Application filled by */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Application filled by</label>
                <input
                  type="text"
                  name="registeredBy"
                  value={formData.registeredBy}
                  onChange={handleChange}
                  placeholder="Name- for snail team"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#5e8e33] hover:bg-[#4d7828] text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Submitting Sponsorship...' : 'SUBMIT ENQUIRY'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
