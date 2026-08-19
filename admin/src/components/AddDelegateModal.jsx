import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import Cookies from 'js-cookie';
import { COUNTRY_CODES } from '../utils/countryCodes';
import CountryCodeSelect from './CountryCodeSelect';

export default function AddDelegateModal({ isOpen, onClose, onDelegateAdded, presetSponsorship = null, presetNomination = null, editingDelegate = null }) {
  const [formData, setFormData] = useState({
    delegateType: 'indian',
    fullName: '',
    email: '',
    countryCode: '+91',
    designation: '',
    mobileNumber: '',
    organization: '',
    city: '',
    stateCountry: '',
    pinCode: '',
    gstNumber: '',
    address: '',
    registeredBy: '',
    paymentMethod: 'Online (Razorpay)',
    paymentStatus: 'Invitee',
    attendeeCategory: 'DELEGATE',
    applyCoupon: false,
    sponsorshipId: null,
    sponsorshipCompany: '',
    awardNominationId: null,
    awardNominationName: '',
  });
  
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSuccessData(null);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && editingDelegate) {
      let rawPhone = String(editingDelegate.mobileNumber || '').trim();
      let code = '+91';

      if (rawPhone.startsWith('+')) {
        const spaceIdx = rawPhone.indexOf(' ');
        if (spaceIdx !== -1) {
          code = rawPhone.substring(0, spaceIdx);
          rawPhone = rawPhone.substring(spaceIdx + 1).trim();
        } else {
          const match = rawPhone.match(/^(\+\d{1,4})(\d{10})$/);
          if (match) {
            code = match[1];
            rawPhone = match[2];
          }
        }
      } else if (/^91\d{10}$/.test(rawPhone)) {
        code = '+91';
        rawPhone = rawPhone.substring(2);
      } else if (/^91\d{11,}$/.test(rawPhone)) {
        rawPhone = rawPhone.replace(/^91/, '');
      }

      setFormData({
        countryCode: code,
        delegateType: editingDelegate.delegateType || 'indian',
        fullName: editingDelegate.fullName || '',
        email: editingDelegate.email || '',
        designation: editingDelegate.designation || '',
        mobileNumber: rawPhone,
        organization: editingDelegate.organization || '',
        city: editingDelegate.city || '',
        stateCountry: editingDelegate.stateCountry || '',
        pinCode: editingDelegate.pinCode || '',
        gstNumber: editingDelegate.gstNumber || '',
        address: editingDelegate.address || '',
        registeredBy: editingDelegate.registeredBy || '',
        paymentMethod: editingDelegate.paymentMethod || 'Online (Razorpay)',
        paymentStatus: editingDelegate.paymentStatus || 'Paid',
        attendeeCategory: editingDelegate.attendeeCategory || 'DELEGATE',
        applyCoupon: !!editingDelegate.couponCode,
        sponsorshipId: editingDelegate.sponsorshipId || null,
        sponsorshipCompany: editingDelegate.sponsorshipCompany || '',
      });
    } else if (isOpen && presetSponsorship) {
      setFormData(prev => ({
        ...prev,
        fullName: presetSponsorship.contactPerson || prev.fullName,
        email: presetSponsorship.email || prev.email,
        mobileNumber: presetSponsorship.mobileNumber || prev.mobileNumber,
        designation: presetSponsorship.designation || prev.designation,
        organization: presetSponsorship.companyName || prev.organization,
        gstNumber: presetSponsorship.gstNumber || prev.gstNumber,
        city: presetSponsorship.city || prev.city,
        stateCountry: presetSponsorship.stateCountry || prev.stateCountry,
        pinCode: presetSponsorship.pinCode || prev.pinCode,
        address: presetSponsorship.address || prev.address,
        attendeeCategory: 'SPONSOR',
        paymentMethod: 'Free',
        paymentStatus: 'Paid',
        registeredBy: '',
        sponsorshipId: presetSponsorship._id,
        sponsorshipCompany: presetSponsorship.companyName,
      }));
    } else if (isOpen && presetNomination) {
      let rawPhone = String(presetNomination.mobileNumber || '').trim();
      let code = '+91';

      if (rawPhone.startsWith('+')) {
        const spaceIdx = rawPhone.indexOf(' ');
        if (spaceIdx !== -1) {
          code = rawPhone.substring(0, spaceIdx);
          rawPhone = rawPhone.substring(spaceIdx + 1).trim();
        } else {
          const match = rawPhone.match(/^(\+\d{1,4})(\d{10})$/);
          if (match) {
            code = match[1];
            rawPhone = match[2];
          }
        }
      } else if (/^91\d{10}$/.test(rawPhone)) {
        code = '+91';
        rawPhone = rawPhone.substring(2);
      } else if (/^91\d{11,}$/.test(rawPhone)) {
        rawPhone = rawPhone.replace(/^91/, '');
      }

      setFormData(prev => ({
        ...prev,
        countryCode: code,
        fullName: presetNomination.fullName || prev.fullName,
        email: presetNomination.email || prev.email,
        designation: presetNomination.designation || prev.designation,
        mobileNumber: rawPhone || prev.mobileNumber,
        organization: presetNomination.organization || prev.organization,
        city: presetNomination.city || prev.city,
        stateCountry: presetNomination.state ? `${presetNomination.state}, ${presetNomination.country || 'India'}` : (presetNomination.country || prev.stateCountry),
        pinCode: presetNomination.pinCode || prev.pinCode,
        address: presetNomination.address || prev.address,
        attendeeCategory: 'AWARD_NOMINEE',
        paymentMethod: presetNomination.paymentMethod || 'Online (Razorpay)',
        paymentStatus: presetNomination.paymentStatus || 'Paid',
        sponsorshipId: null,
        sponsorshipCompany: '',
        awardNominationId: presetNomination._id,
        awardNominationName: presetNomination.fullName,
      }));
    }
  }, [isOpen, presetSponsorship, presetNomination, editingDelegate]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      return next;
    });
  };

  const handleCloseAndReset = () => {
    setSuccessData(null);
    setCopiedLink(false);
    onClose();
    setFormData({
      delegateType: 'indian',
      fullName: '',
      email: '',
      designation: '',
      mobileNumber: '',
      organization: '',
      city: '',
      stateCountry: '',
      pinCode: '',
      gstNumber: '',
      address: '',
      registeredBy: '',
      paymentMethod: 'Online (Razorpay)',
      paymentStatus: 'Invitee',
      attendeeCategory: 'DELEGATE',
      applyCoupon: false,
      sponsorshipId: null,
      sponsorshipCompany: '',
      awardNominationId: null,
      awardNominationName: '',
    });
  };

  const handleCopyPaymentLink = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Email & Mobile format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(String(formData.email).trim().toLowerCase())) {
      setError('Please enter a valid email address (e.g. name@company.com)');
      return;
    }

    const mobileDigits = String(formData.mobileNumber || '').replace(/\D/g, '');
    if (!mobileDigits || mobileDigits.length < 10 || mobileDigits.length > 15) {
      setError('Please enter a valid 10-digit mobile number (e.g. 9876543210 or +91 9876543210)');
      return;
    }

    setLoading(true);

    try {
      const formattedMobile = formData.mobileNumber.startsWith('+') 
        ? formData.mobileNumber 
        : `${formData.countryCode || '+91'} ${formData.mobileNumber.trim()}`;

      const payload = {
        ...formData,
        mobileNumber: formattedMobile,
        couponCode: formData.applyCoupon ? '#IAP2026' : null,
        isManuallyCreated: true
      };

      const token = Cookies.get('admin_token');
      const isEditing = !!editingDelegate;
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/delegates/${editingDelegate._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/delegates`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        onDelegateAdded();
        handleCloseAndReset();
      } else {
        setError(data.message || 'Failed to save delegate');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto flex flex-col max-h-[92vh] transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20 rounded-t-2xl">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {editingDelegate ? 'Edit Delegate Registration' : (successData ? 'Delegate Saved' : 'Manual Delegate Registration')}
          </h2>
          <button 
            onClick={handleCloseAndReset} 
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="overflow-y-auto px-6 py-6 custom-scrollbar">
          {successData ? (
            /* In-Modal Success Screen */
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className={`w-16 h-16 ${successData.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} rounded-full flex items-center justify-center shadow-xs`}>
                {successData.paymentStatus === 'Pending' ? (
                  <Info size={32} />
                ) : (
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-serif font-black text-gray-900 tracking-wide uppercase">
                {successData.paymentStatus === 'Pending' ? 'Delegate Saved — Payment Pending' : (successData.isEditing ? 'Delegate Updated Successfully!' : (successData.isExisting ? 'Delegate Linked Successfully!' : 'Delegate Added Successfully!'))}
              </h3>

              <p className="text-gray-600 text-xs md:text-sm max-w-md font-medium leading-relaxed">
                {successData.paymentStatus === 'Pending'
                  ? `Delegate details saved! Share the online payment link below with ${successData.delegateName} to complete Razorpay payment.`
                  : (successData.isEditing
                    ? `Registration details for ${successData.delegateName} have been updated successfully.`
                    : (successData.isExisting 
                      ? `An existing registration record for ${successData.delegateName} was found and marked paid.`
                      : `Delegate ${successData.delegateName} has been registered and marked paid.`
                    )
                  )
                }
              </p>

              <div className="w-full max-w-md bg-gray-50 border border-gray-200/80 rounded-xl p-4 text-left space-y-2 font-sans shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">Registration ID</span>
                  <span className="font-mono font-black text-gray-900 text-sm">{successData.delegateId}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Attendee Name</span>
                  <span className="font-bold text-gray-900">{successData.delegateName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Category</span>
                  <span className="font-bold text-[#5e8e33] uppercase">{successData.category}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-200">
                  <span className="text-gray-500 font-medium">Payment Status</span>
                  <span className={`font-extrabold uppercase px-2 py-0.5 rounded-full text-[10px] ${
                    successData.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {successData.paymentStatus === 'Pending' ? '🟠 Pending' : '🟢 Paid'}
                  </span>
                </div>
              </div>

              {/* Shareable Online Payment Link Box (Only when Payment is Pending) */}
              {successData.paymentStatus === 'Pending' && successData.paymentUrl && (
                <div className="w-full max-w-md bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2 text-left">
                  <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider block">Shareable Payment Link</span>
                  <p className="text-[11px] text-amber-800 leading-tight">Send this link to the customer via WhatsApp, Email, or SMS to pay online:</p>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      readOnly
                      value={successData.paymentUrl}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono text-gray-800 focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyPaymentLink(successData.paymentUrl)}
                      className="px-4 py-2 bg-[#5e8e33] hover:bg-[#4c7727] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
                    >
                      {copiedLink ? '✓ Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleCloseAndReset}
                className="w-full max-w-md py-3 bg-gray-900 hover:bg-gray-800 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-2"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2.5">
                  <Info className="flex-shrink-0 text-red-500 mt-0.5" size={16} />
                  <span>{error}</span>
                </div>
              )}
              
              <form id="addDelegateForm" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Delegate Type Radio Selection */}
            <div className="flex items-center gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                <input
                  type="radio"
                  name="delegateType"
                  value="indian"
                  checked={formData.delegateType === 'indian'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#6a9a38] focus:ring-[#6a9a38]"
                />
                <span>Indian Delegate (INR)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800">
                <input
                  type="radio"
                  name="delegateType"
                  value="foreign"
                  checked={formData.delegateType === 'foreign'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#6a9a38] focus:ring-[#6a9a38]"
                />
                <span>Foreign Delegate (USD)</span>
              </label>
            </div>

            {/* Upper Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  placeholder="Job title"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              {/* Row 2 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                <div className="flex items-center gap-1.5">
                  <CountryCodeSelect
                    name="countryCode"
                    value={formData.countryCode || '+91'}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    placeholder="98765 43210"
                    className="flex-1 min-w-0 px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  placeholder="Company name"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              {/* Row 3 */}
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

              {/* Row 4 */}
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              {/* Row 5 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Full Address"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company GST No.</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Company GST No."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>
            </div>

            {/* Bottom Admin Control Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
              {/* Registered by */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Registered by</label>
                <input
                  type="text"
                  name="registeredBy"
                  value={formData.registeredBy}
                  onChange={handleChange}
                  placeholder="Type Name (For snail team)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                />
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">payment type</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                >
                  <option value="Online (Razorpay)">Online (Razorpay)</option>
                  <option value="CASH">CASH</option>
                  <option value="UPI">UPI</option>
                  <option value="Free">Free</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">payment status</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                >
                  <option value="Invitee">Invitee</option>
                </select>
              </div>

              {/* Attendee Category */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Attendee Category</label>
                <select
                  name="attendeeCategory"
                  value={formData.attendeeCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38]"
                >
                  <option value="DELEGATE">DELEGATE</option>
                  <option value="SPEAKER">SPEAKER</option>
                  <option value="ORGANIZER">ORGANIZER</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="SPONSOR">SPONSOR</option>
                  <option value="AWARDEE">AWARDEE</option>
                  <option value="AWARD_NOMINEE">AWARD NOMINEE</option>
                </select>
              </div>
            </div>

            {/* Coupon Code Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-900">
                <input
                  type="checkbox"
                  name="applyCoupon"
                  checked={formData.applyCoupon}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#6a9a38] focus:ring-[#6a9a38]"
                />
                <span>Coupon Code: #IAP2026</span>
              </label>
              <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                Note: Industry Partners may apply the coupon code to avail the applicable registration discount. The organizing team may request valid proof of association or affiliation during the registration verification process.
              </p>
            </div>

          </form>
            </>
          )}
        </div>

        {/* Footer */}
        {!successData && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-2xl sticky bottom-0 z-10">
            <button 
              type="button" 
              onClick={handleCloseAndReset}
              className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="addDelegateForm"
              disabled={loading}
              className="px-6 py-2 bg-[#5e8e33] hover:bg-[#4c7727] text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingDelegate ? 'Update Delegate' : 'Add Delegate')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
