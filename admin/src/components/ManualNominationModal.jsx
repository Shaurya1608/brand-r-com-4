"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Info, Upload, Check, Award, Building2, User, Mail, Phone, MapPin, Globe, CreditCard, ChevronDown } from 'lucide-react';
import Cookies from 'js-cookie';

const INDIVIDUAL_CATEGORIES = [
  "Best Communicator Award – Male",
  "Best Communicator Award – Female",
  "AI Leadership Excellence Award",
  "Marketing Leader of the Year",
  "HR Leader of the Year"
];

const INDUSTRY_EXCELLENCE_OPTIONS = [
  "Seed",
  "Crop Protection",
  "Soil Health & Biologicals",
  "Fertilizer & Plant Nutrition",
  "Farm Machinery & Agri-Tech",
  "Irrigation & Water Management",
  "Agri Startup"
];

const OTHER_ORGANIZATION_CATEGORIES = [
  "Emerging Company of the Year Award",
  "Best Outdoor Campaign Award",
  "Best Rural Engagement Award",
  "Best PR Campaign Award",
  "Best Digital Marketing Award",
  "Best Brand Campaign (TVC) Award",
  "Best Integrated Communication Award"
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'applicantType') {
      setFormData(prev => ({ ...prev, [name]: value, awardCategory: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

  const inputStyle = "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] transition-all bg-gray-50/70 focus:bg-white shadow-2xs";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#5e8e33]/10 border-b border-[#5e8e33]/20 text-gray-900 p-5 px-6 relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Award className="text-[#5e8e33]" size={22} />
              <h2 className="text-lg font-black tracking-tight text-gray-900">Manual Awards / Nominations Registration 🏆</h2>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">
              BRAND R.Comm Awards 2026 — OFFICIAL NOMINATION FORM
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-200/70 hover:bg-gray-300 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
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
              <div className="w-6 h-6 rounded-full bg-[#5e8e33] text-white flex items-center justify-center font-black text-xs">1</div>
              <h3 className="font-black text-gray-900 text-sm">Applicant Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Designation <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Marketing Head / CEO"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Organization / Company Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company name"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  required
                  className={inputStyle}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Website (Optional)</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Company details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <div className="w-6 h-6 rounded-full bg-[#5e8e33] text-white flex items-center justify-center font-black text-xs">2</div>
              <h3 className="font-black text-gray-900 text-sm">Company details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">State <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Country <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Pin Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="6-digit pin code"
                  required
                  className={inputStyle}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Complete Address <span className="text-red-500">*</span></label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="House / Street / Landmark"
                  required
                  className={inputStyle}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Company GST No.</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Award Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <div className="w-6 h-6 rounded-full bg-[#5e8e33] text-white flex items-center justify-center font-black text-xs">3</div>
              <h3 className="font-black text-gray-900 text-sm">Award Details</h3>
            </div>

            <div className="space-y-4">
              {/* Applicant Type */}
              <div>
                <label className="block font-bold text-gray-800 text-xs mb-2">Applicant Type <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 font-bold text-gray-800 cursor-pointer">
                    <input
                      type="radio"
                      name="applicantType"
                      value="Individual"
                      checked={formData.applicantType === 'Individual'}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#5e8e33] focus:ring-[#5e8e33] cursor-pointer"
                    />
                    <span>Individual</span>
                  </label>

                  <label className="flex items-center gap-2 font-bold text-gray-800 cursor-pointer">
                    <input
                      type="radio"
                      name="applicantType"
                      value="Organization"
                      checked={formData.applicantType === 'Organization'}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#5e8e33] focus:ring-[#5e8e33] cursor-pointer"
                    />
                    <span>Organization</span>
                  </label>
                </div>
              </div>

              {/* Award Category Select */}
              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Select Award Category <span className="text-red-500">*</span></label>
                
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`${inputStyle} cursor-pointer flex items-center justify-between`}
                  >
                    <span className={formData.awardCategory ? "text-gray-900 font-bold" : "text-gray-500 font-normal"}>
                      {formData.awardCategory || "Choose a category..."}
                    </span>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isCategoryOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar p-1 text-xs">
                      {formData.applicantType === 'Individual' ? (
                        <div className="space-y-0.5">
                          {INDIVIDUAL_CATEGORIES.map((cat, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, awardCategory: cat }));
                                setIsCategoryOpen(false);
                              }}
                              className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                formData.awardCategory === cat ? 'bg-[#5e8e33]/15 text-[#5e8e33] font-black' : 'text-gray-800 hover:bg-gray-100 font-semibold'
                              }`}
                            >
                              {cat}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Group: Industry Excellence Awards */}
                          <div className="rounded-lg overflow-hidden border border-gray-100">
                            <div className="px-3 py-1.5 bg-[#5e8e33]/10 text-[#5e8e33] font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                              <Award size={13} />
                              <span>Industry Excellence Awards</span>
                            </div>
                            <div className="p-1 bg-gray-50/50 space-y-0.5 pl-3 border-l-2 border-[#5e8e33]/30 ml-2 my-1">
                              {INDUSTRY_EXCELLENCE_OPTIONS.map((opt, optIdx) => {
                                const fullVal = `Industry Excellence Awards - ${opt}`;
                                return (
                                  <div
                                    key={optIdx}
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, awardCategory: fullVal }));
                                      setIsCategoryOpen(false);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-[11px] ${
                                      formData.awardCategory === fullVal ? 'bg-[#5e8e33]/20 text-[#5e8e33] font-black' : 'text-gray-700 hover:bg-gray-200/70 font-semibold'
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Other Organization Categories */}
                          <div className="space-y-0.5">
                            {OTHER_ORGANIZATION_CATEGORIES.map((cat, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, awardCategory: cat }));
                                  setIsCategoryOpen(false);
                                }}
                                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                  formData.awardCategory === cat ? 'bg-[#5e8e33]/15 text-[#5e8e33] font-black' : 'text-gray-800 hover:bg-gray-100 font-semibold'
                                }`}
                              >
                                {cat}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Brief Summary with OR Attach File Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-gray-800 text-xs">
                    Brief Summary of Organization / Initiatives / Individual
                  </label>
                  
                  <div className="flex items-center gap-2">
                    {summaryFile && (
                      <span className="text-[10px] font-bold text-[#5e8e33] truncate max-w-[140px] bg-[#5e8e33]/10 px-2 py-0.5 rounded-md">
                        ✓ {summaryFile.name}
                      </span>
                    )}
                    <label className="cursor-pointer bg-[#5e8e33] hover:bg-[#4c7727] text-white font-black text-[10px] uppercase tracking-wide px-3 py-1 rounded-full transition-all shadow-xs flex items-center gap-1 active:scale-95">
                      <Upload size={12} />
                      <span>OR Attach File</span>
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx,.doc,.docx"
                        onChange={(e) => setSummaryFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <textarea
                  name="briefSummary"
                  value={formData.briefSummary}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Summarize the nomination in a few sentences"
                  className={inputStyle}
                />
              </div>

              {/* Upload Profile */}
              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Upload Company/Individual Profile</label>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={(e) => setProfileFile(e.target.files[0])}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center gap-1">
                    <Upload size={20} className="text-[#5e8e33]" />
                    <p className="font-extrabold text-gray-900 text-xs">
                      {profileFile ? profileFile.name : 'Click to upload or drag file here'}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">PDF, PPT or DOC — max 15MB</p>
                  </label>
                </div>
              </div>

              {/* Upload Supporting Documents */}
              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">Upload Supporting Documents</label>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={(e) => setSummaryFile(e.target.files[0])}
                    className="hidden"
                    id="summary-upload"
                  />
                  <label htmlFor="summary-upload" className="cursor-pointer flex flex-col items-center gap-1">
                    <Upload size={20} className="text-[#5e8e33]" />
                    <p className="font-extrabold text-gray-900 text-xs">
                      {summaryFile ? summaryFile.name : 'Click to upload or drag file here'}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">PDF, PPT or DOC — max 15MB</p>
                  </label>
                </div>
              </div>

              {/* Payment Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-gray-800 text-xs mb-1.5">Payment Type</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="Online (Razorpay)">Online (Razorpay)</option>
                    <option value="CASH">CASH</option>
                    <option value="UPI">UPI</option>
                    <option value="Free">Free</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 text-xs mb-1.5">Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Invitee">Invitee</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-800 text-xs mb-1.5">Application filled by</label>
                  <input
                    type="text"
                    name="registeredBy"
                    value={formData.registeredBy}
                    onChange={handleChange}
                    placeholder="Name - for snail team"
                    className={inputStyle}
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
