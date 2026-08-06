"use client";

import React, { useState } from 'react';
import { X, Info, Upload, Check, Award, Building2, User, Mail, Phone, MapPin, Globe, CreditCard, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';

const AWARD_CATEGORIES = [
  // Jury Choice Awards - Individuals
  "Lifetime Achievement Award",
  "Company of the Year Award",
  "Voice of the Year Award",
  "Changemaker Award",
  "Pioneer Award",
  "Growth Catalyst Award",
  "NextGen Award",
  "Shakti Award",
  "Visionary Entrepreneur Award",
  "Policy Driver Award",
  "Sustainability Champion Award",

  // Nomination Based Awards – Companies
  "Industry Excellence Awards - Seed",
  "Industry Excellence Awards - Crop Protection",
  "Industry Excellence Awards - Soil Health & Biologicals",
  "Industry Excellence Awards - Fertilizer & Plant Nutrition",
  "Industry Excellence Awards - Farm Machinery & Agri-Tech",
  "Industry Excellence Awards - Irrigation & Water Management",
  "Industry Excellence Awards - Agri Startup",
  "Industry Excellence Awards - Research & Development (R&D)",

  // Individual Leadership Awards
  "CEO of the Year (Agri / Allied)",
  "Business Leader of the Year",
  "HR Leader of the Year",
  "R&D / Science Leader of the Year",
  "Agri Woman Leader of the Year",

  // Campaign & Communication Awards
  "Best Integrated Brand Campaign",
  "Best Digital & Social Media Campaign",
  "Best Farmer Engagement Campaign",
  "Best Product Launch Campaign",
  "Best Rural Marketing Campaign",
  "Best CSR & Sustainability Campaign",
  "Best Educational / Awareness Campaign",
  "Best Corporate Communication Team",
  "Best Communicator Award – Male",
  "Best Communicator Award – Female",
];

export default function ManualNominationModal({ isOpen, onClose, onNominationAdded }) {
  const [formData, setFormData] = useState({
    applicantType: 'Individual',
    awardCategory: '',
    fullName: '',
    designation: '',
    organization: '',
    email: '',
    mobileNumber: '',
    website: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    address: '',
    gstNumber: '',
    briefSummary: '',
    paymentMethod: 'Online (Razorpay)',
    paymentStatus: 'Paid',
    registeredBy: '',
  });

  const [profileFile, setProfileFile] = useState(null);
  const [summaryFile, setSummaryFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.fullName || !formData.email || !formData.mobileNumber || !formData.organization || !formData.awardCategory) {
        setError('Please fill in all required fields marked with *');
        setLoading(false);
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.append('registrationType', 'Manual Registration');

      if (profileFile) {
        data.append('profileDocument', profileFile);
      }
      if (summaryFile) {
        data.append('summaryDocument', summaryFile);
      }

      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        // If status update is required
        if (formData.paymentStatus || formData.registeredBy) {
          const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/${result.data._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              paymentStatus: formData.paymentStatus,
              paymentMethod: formData.paymentMethod,
              registrationType: 'Manual Registration',
            })
          });
          await updateRes.json();
        }

        onNominationAdded && onNominationAdded();
        onClose();
      } else {
        setError(result.message || 'Failed to submit manual nomination');
      }
    } catch (err) {
      console.error('Error submitting manual nomination:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-5 px-6 relative flex items-center justify-between border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <Award className="text-[#5e8e33]" size={22} />
              <h2 className="text-lg font-black tracking-tight">Manual Awards / Nominations Registration 🏆</h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              BRAND R.Comm Awards 2026 — OFFICIAL NOMINATION FORM
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar flex-1 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
              <Info size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Applicant Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <div className="w-5 h-5 rounded-full bg-[#5e8e33] text-white flex items-center justify-center font-black text-[11px]">1</div>
              <h3 className="font-black text-gray-900 text-sm">Applicant Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Marketing Head / CEO"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Organization / Company Name *</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company name"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Website (Optional)</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Company details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <div className="w-5 h-5 rounded-full bg-[#5e8e33] text-white flex items-center justify-center font-black text-[11px]">2</div>
              <h3 className="font-black text-gray-900 text-sm">Company details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Pin Code *</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="6-digit pin code"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Complete Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="House / Street / Landmark"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Company GST No.</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Award Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <div className="w-5 h-5 rounded-full bg-[#5e8e33] text-white flex items-center justify-center font-black text-[11px]">3</div>
              <h3 className="font-black text-gray-900 text-sm">Award Details</h3>
            </div>

            <div className="space-y-4">
              {/* Applicant Type */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Applicant Type *</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 font-semibold text-gray-800 cursor-pointer">
                    <input
                      type="radio"
                      name="applicantType"
                      value="Individual"
                      checked={formData.applicantType === 'Individual'}
                      onChange={handleChange}
                      className="text-[#5e8e33] focus:ring-[#5e8e33]"
                    />
                    <span>Individual</span>
                  </label>

                  <label className="flex items-center gap-2 font-semibold text-gray-800 cursor-pointer">
                    <input
                      type="radio"
                      name="applicantType"
                      value="Organization"
                      checked={formData.applicantType === 'Organization'}
                      onChange={handleChange}
                      className="text-[#5e8e33] focus:ring-[#5e8e33]"
                    />
                    <span>Organization</span>
                  </label>
                </div>
              </div>

              {/* Award Category Select */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Award Category *</label>
                <select
                  name="awardCategory"
                  value={formData.awardCategory}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-white font-semibold cursor-pointer"
                >
                  <option value="">Choose a category...</option>
                  {AWARD_CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Brief Summary */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Brief Summary of Organization / Initiatives / Individual
                </label>
                <textarea
                  name="briefSummary"
                  value={formData.briefSummary}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Summarize the nomination in a few sentences"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* Upload Profile */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Upload Company/Individual Profile</label>
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors text-center">
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={(e) => setProfileFile(e.target.files[0])}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center gap-1">
                    <Upload size={20} className="text-[#5e8e33]" />
                    <p className="font-bold text-gray-900">
                      {profileFile ? profileFile.name : 'Click to upload or drag file here'}
                    </p>
                    <p className="text-[10px] text-gray-400">PDF, PPT or DOC — max 15MB</p>
                  </label>
                </div>
              </div>

              {/* Upload Supporting Documents */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Upload Supporting Documents</label>
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors text-center">
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={(e) => setSummaryFile(e.target.files[0])}
                    className="hidden"
                    id="summary-upload"
                  />
                  <label htmlFor="summary-upload" className="cursor-pointer flex flex-col items-center gap-1">
                    <Upload size={20} className="text-[#5e8e33]" />
                    <p className="font-bold text-gray-900">
                      {summaryFile ? summaryFile.name : 'Click to upload or drag file here'}
                    </p>
                    <p className="text-[10px] text-gray-400">PDF, PPT or DOC — max 15MB</p>
                  </label>
                </div>
              </div>

              {/* Payment Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Type</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-white font-semibold cursor-pointer"
                  >
                    <option value="Online (Razorpay)">Online (Razorpay)</option>
                    <option value="CASH">CASH</option>
                    <option value="UPI">UPI</option>
                    <option value="Free">Free</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-white font-semibold cursor-pointer"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Invitee">Invitee</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Application filled by</label>
                  <input
                    type="text"
                    name="registeredBy"
                    value={formData.registeredBy}
                    onChange={handleChange}
                    placeholder="Name - for snail team"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#5e8e33] hover:bg-[#4c7727] text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>SUBMIT DETAILS</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
