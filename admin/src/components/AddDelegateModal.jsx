import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

export default function AddDelegateModal({ isOpen, onClose, onDelegateAdded, presetSponsorship = null, presetNomination = null }) {
  const [formData, setFormData] = useState({
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
    paymentStatus: 'Paid',
    attendeeCategory: 'DELEGATE',
    applyCoupon: false,
    sponsorshipId: null,
    sponsorshipCompany: '',
  });
  
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSuccessData(null);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && presetSponsorship) {
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
      setFormData(prev => ({
        ...prev,
        fullName: presetNomination.fullName || prev.fullName,
        email: presetNomination.email || prev.email,
        designation: presetNomination.designation || prev.designation,
        mobileNumber: presetNomination.mobileNumber || prev.mobileNumber,
        organization: presetNomination.organization || prev.organization,
        city: presetNomination.city || prev.city,
        stateCountry: presetNomination.state ? `${presetNomination.state}, ${presetNomination.country || 'India'}` : (presetNomination.country || prev.stateCountry),
        pinCode: presetNomination.pinCode || prev.pinCode,
        address: presetNomination.address || prev.address,
        attendeeCategory: 'AWARD NOMINEE',
        paymentMethod: presetNomination.paymentMethod || 'Online (Razorpay)',
        paymentStatus: presetNomination.paymentStatus || 'Paid',
      }));
    }
  }, [isOpen, presetSponsorship, presetNomination]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCloseAndReset = () => {
    setSuccessData(null);
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
      paymentStatus: 'Paid',
      attendeeCategory: 'DELEGATE',
      applyCoupon: false,
      sponsorshipId: null,
      sponsorshipCompany: '',
    });
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
      const payload = {
        ...formData,
        couponCode: formData.applyCoupon ? '#IAP2026' : null,
        isManuallyCreated: true
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccessData({
          isExisting: data.isExisting,
          delegateName: data.data?.fullName || formData.fullName,
          delegateId: data.data?._id ? `DEL-${data.data._id.slice(-5).toUpperCase()}` : 'DEL-CONFIRMED',
          category: formData.attendeeCategory || 'DELEGATE',
          sponsorshipCompany: formData.sponsorshipCompany || null
        });
        onDelegateAdded();
      } else {
        setError(data.message || 'Failed to add delegate');
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
            {successData ? 'Registration Confirmed' : 'Manual Delegate Registration'}
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
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shadow-xs">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-serif font-black text-gray-900 tracking-wide uppercase">
                {successData.isExisting ? 'Delegate Linked Successfully!' : 'Delegate Added Successfully!'}
              </h3>

              <p className="text-gray-600 text-xs md:text-sm max-w-md font-medium leading-relaxed">
                {successData.isExisting 
                  ? `An existing registration record for ${successData.delegateName} was found and successfully linked.`
                  : `Delegate ${successData.delegateName} has been registered and confirmed.`
                }
              </p>

              <div className="w-full max-w-md bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 text-left space-y-2 font-sans shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-800 font-bold uppercase tracking-wider">Registration ID</span>
                  <span className="font-mono font-black text-emerald-950 text-sm">{successData.delegateId}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium">Attendee Name</span>
                  <span className="font-bold text-gray-900">{successData.delegateName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium">Category</span>
                  <span className="font-bold text-[#5e8e33] uppercase">{successData.category}</span>
                </div>
                {successData.sponsorshipCompany && (
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-emerald-200/60">
                    <span className="text-gray-600 font-medium">Linked Sponsor</span>
                    <span className="font-bold text-gray-900">{successData.sponsorshipCompany}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCloseAndReset}
                className="w-full max-w-md py-3.5 bg-[#5e8e33] hover:bg-[#4c7727] text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-2"
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
                  <option value="Paid">Paid</option>
                  <option value="Invitee">Invitee</option>
                  <option value="Pending">Pending</option>
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
              {loading ? 'Submitting...' : 'Add Delegate'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
