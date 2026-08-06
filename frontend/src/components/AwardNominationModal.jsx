"use client";

import React, { useState, useRef, useEffect } from "react";
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
    briefSummary: "",
  });
  
  const [summaryDocumentFile, setSummaryDocumentFile] = useState(null);
  const [profileDocumentFile, setProfileDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Payment states
  const [submittedNominationId, setSubmittedNominationId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState("");
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(false);
  const [existingData, setExistingData] = useState(null);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Auto-resume payment session if secure token is present in URL
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('nominationToken') || urlParams.get('token');
        if (token) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/resume-payment/${token}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.data) {
                setSubmittedNominationId(data.data._id);
                setExistingData(data.data);
                setIsExistingRecord(true);
                setSuccess(true);
                if (data.alreadyPaid) setPaymentSuccess(true);
              }
            })
            .catch(err => console.error('Error resuming nomination session:', err));
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const individualCategories = [
    "Best Communicator Award – Male",
    "Best Communicator Award – Female",
    "AI Leadership Excellence Award",
    "Marketing Leader of the Year",
    "HR Leader of the Year"
  ];

  const organizationCategories = [
    {
      group: "Industry Excellence Awards",
      options: [
        "Seed",
        "Crop Protection",
        "Soil Health & Biologicals",
        "Fertilizer & Plant Nutrition",
        "Farm Machinery & Agri-Tech",
        "Irrigation & Water Management",
        "Agri Startup"
      ]
    },
    "Emerging Company of the Year Award",
    "Best Outdoor Campaign Award",
    "Best Rural Engagement Award",
    "Best PR Campaign Award",
    "Best Digital Marketing Award",
    "Best Brand Campaign (TVC) Award",
    "Best Integrated Communication Award"
  ];

  const totalAmount = "₹17,700/-";

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "applicantType") {
      setFormData((prev) => ({ ...prev, [name]: value, awardCategory: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSummaryFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSummaryDocumentFile(file);
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileDocumentFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }
    setError("");

    if (!formData.briefSummary && !summaryDocumentFile) {
      setError("Please provide a brief summary or attach a file.");
      return;
    }

    if (!profileDocumentFile) {
      setError("Please upload a profile document.");
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
      if (summaryDocumentFile) data.append('summaryDocument', summaryDocumentFile);
      if (profileDocumentFile) data.append('profileDocument', profileDocumentFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setSubmittedNominationId(result.data._id);
        if (result.isExisting) {
          setIsExistingRecord(true);
          setExistingData(result.data);
          if (result.alreadyPaid) setPaymentSuccess(true);
        }
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedToPayment = async () => {
    if (!submittedNominationId) return;
    setPaymentLoading(true);
    setError("");
    setPaymentCancelled(false);

    try {
      // 1. Create order on backend (₹8,000 + 18% GST = ₹9,440)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nominationId: submittedNominationId,
          amountRs: 9440,
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Server is deploying updates or endpoint unavailable (${res.status}). Please try again in 1 minute.`);
      }

      const order = await res.json();
      if (!order.success) throw new Error(order.message || 'Failed to create payment order');

      // 2. Load Razorpay JS SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) throw new Error('Razorpay SDK could not be loaded. Check your connection.');

      // 3. Open Razorpay checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'BRAND R.Comm 2026',
        description: `Award Nomination Fee — ${formData.awardCategory || 'Category Entry'}`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                nominationId: submittedNominationId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setRazorpayPaymentId(response.razorpay_payment_id);
              setPaymentSuccess(true);
            } else {
              setError('Payment received but verification failed. Payment ID: ' + response.razorpay_payment_id);
            }
          } catch {
            setError('Verification error. Please contact support.');
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobileNumber,
        },
        theme: { color: '#6a9a38' },
        modal: {
          ondismiss: () => {
            setPaymentCancelled(true);
            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Payment initiation failed. Please try again.');
      setPaymentLoading(false);
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
            className="relative w-full max-w-xl bg-brand-surface rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans"
          >
            {paymentSuccess ? (
              <div className="relative p-8 md:p-12 flex flex-col items-center text-center bg-white h-full justify-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-primary bg-brand-surface hover:bg-brand-primary/10 p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-serif text-brand-dark font-bold mb-2 uppercase tracking-wider">
                  Payment Successful!
                </h2>
                <p className="text-xs text-brand-primary font-bold uppercase tracking-widest mb-4">
                  Confirmation Sent to {formData.email}
                </p>

                <p className="text-brand-dark/70 text-[14px] leading-relaxed max-w-md mb-6">
                  Thank you! Your nomination fee of <strong>₹9,440</strong> (incl. 18% GST) has been received. Your nomination for <strong>{formData.awardCategory}</strong> is now confirmed and undergoing jury evaluation.
                </p>

                <div className="bg-brand-surface p-4 rounded-xl border border-brand-primary/20 w-full max-w-md mb-6 text-left space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500 font-semibold">Payment ID:</span><span className="font-mono font-bold text-gray-900">{razorpayPaymentId}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-semibold">Nomination ID:</span><span className="font-mono font-bold text-gray-900">{submittedNominationId}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-semibold">Category:</span><span className="font-bold text-brand-primary">{formData.awardCategory}</span></div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full max-w-sm py-3.5 bg-brand-dark hover:bg-black text-white font-mono font-bold text-[12px] uppercase tracking-widest rounded-lg transition-all shadow-md"
                >
                  Close & Back to Home
                </button>
              </div>
            ) : success ? (
              <div className="relative p-8 md:p-12 flex flex-col items-center text-center bg-white h-full justify-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-primary bg-brand-surface hover:bg-brand-primary/10 p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {isExistingRecord ? (
                  <>
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif text-brand-dark font-bold mb-1 uppercase tracking-wider">
                      Existing Nomination Found!
                    </h2>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full mb-3">
                      Is this you? Entry Fee Pending
                    </span>
                    <p className="text-brand-dark/70 text-[13px] leading-relaxed max-w-sm mb-4">
                      It looks like you've already submitted a nomination. You can complete your pending payment below without re-submitting.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <h2 className="text-xl md:text-2xl font-serif text-brand-dark font-bold mb-2 uppercase tracking-wider">
                      Details Saved Successfully
                    </h2>

                    <p className="text-brand-dark/70 text-[13px] leading-relaxed max-w-md mb-4">
                      Thank you for completing your nomination details. Please proceed to the payment page to complete your nomination submission.
                    </p>
                  </>
                )}

                {/* Amount display card */}
                <div className="bg-brand-surface border border-brand-primary/20 rounded-xl p-4 w-full max-w-sm mb-6 text-center">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Nomination Entry Fee</div>
                  <div className="text-2xl font-serif font-bold text-brand-dark">₹ 9,440</div>
                  <div className="text-[10px] text-brand-primary font-medium mt-0.5">₹8,000 + 18% GST</div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs w-full max-w-sm">
                    {error}
                  </div>
                )}

                {paymentCancelled && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs w-full max-w-sm">
                    Payment was cancelled. You can click below to try again anytime.
                  </div>
                )}

                <div className="flex flex-col w-full gap-3 max-w-sm">
                  <button
                    onClick={handleProceedToPayment}
                    disabled={paymentLoading}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white font-mono font-bold text-[12px] uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Opening Payment...</span>
                      </>
                    ) : (
                      "Continue to Payment (₹9,440)"
                    )}
                  </button>

                  <button
                    onClick={() => setSuccess(false)}
                    disabled={paymentLoading}
                    className="w-full py-3 border-2 border-brand-primary/20 hover:border-brand-primary text-brand-primary bg-transparent font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all hover:bg-brand-primary/5 disabled:opacity-50"
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
                <div className="overflow-y-auto custom-scrollbar flex-1 p-5 md:p-8">
                  <form id="nomination-form" onSubmit={handleSubmit} className="space-y-6 w-full mx-auto">

                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-4 relative px-4">
                      <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 z-0"></div>
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-brand-primary transition-all duration-500 ease-in-out z-0" style={{ width: `calc(${((currentStep - 1) / 2) * 100}% - 2rem)` }}></div>
                      
                      {[1, 2, 3].map(step => (
                        <div key={step} className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${currentStep > step ? 'bg-brand-primary text-white scale-95' : currentStep === step ? 'bg-brand-primary text-white ring-[4px] ring-brand-primary/20 shadow-md scale-110' : 'bg-white text-gray-400 border-[2px] border-gray-200'}`}>
                          {currentStep > step ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            step
                          )}
                        </div>
                      ))}
                    </div>

                    {currentStep === 1 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Section 1: Applicant Information */}
                      <div className="space-y-5">
                        <div className="flex items-center gap-2.5 border-b border-gray-200 pb-2.5">
                          <h4 className="text-base md:text-lg font-bold text-brand-dark">Applicant Information</h4>
                        </div>
                      
                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-brand-dark">Full Name <span className="text-red-500">*</span></label>
                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Designation <span className="text-red-500">*</span></label>
                          <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Marketing Head" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Organization / Company Name <span className="text-red-500">*</span></label>
                          <input required type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Company name" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Email Address <span className="text-red-500">*</span></label>
                          <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Mobile Number <span className="text-red-500">*</span></label>
                          <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+91 00000 00000" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-brand-dark">Website <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                      </div>
                      </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Section 2: Address Details */}
                      <div className="space-y-5 pt-2">
                        <div className="flex items-center gap-2.5 border-b border-gray-200 pb-2.5">
                          <h4 className="text-base md:text-lg font-bold text-brand-dark">Company Details</h4>
                        </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[12px] font-bold text-brand-dark">Company Name <span className="text-red-500">*</span></label>
                          <input required type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Enter company name" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">City <span className="text-red-500">*</span></label>
                          <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">State <span className="text-red-500">*</span></label>
                          <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Country <span className="text-red-500">*</span></label>
                          <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Pin Code <span className="text-red-500">*</span></label>
                          <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-brand-dark">Complete Address <span className="text-red-500">*</span></label>
                        <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="House / Street / Landmark" rows="2" className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium resize-none" />
                      </div>
                      </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Section 3: Award Details */}
                      <div className="space-y-5 pt-2">
                        <div className="flex items-center gap-2.5 border-b border-gray-200 pb-2.5">
                          <h4 className="text-base md:text-lg font-bold text-brand-dark">Award Details & Uploads</h4>
                        </div>
                      
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-brand-dark block">Applicant Type <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-brand-dark">
                            <input 
                              type="radio" 
                              name="applicantType" 
                              value="Individual" 
                              checked={formData.applicantType === "Individual"}
                              onChange={handleChange}
                              className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300"
                            />
                            Individual
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-brand-dark">
                            <input 
                              type="radio" 
                              name="applicantType" 
                              value="Organization" 
                              checked={formData.applicantType === "Organization"}
                              onChange={handleChange}
                              className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300"
                            />
                            Organization
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[12px] font-bold text-brand-dark block mb-1">Select Award Category <span className="text-red-500">*</span></label>
                          <div className="relative" ref={categoryDropdownRef}>
                            <div 
                              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                              className={`w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-all cursor-pointer flex justify-between items-center ${isCategoryDropdownOpen ? 'border-brand-primary ring-2 ring-brand-primary/30 bg-white' : 'border-gray-300 bg-white hover:border-brand-primary/50'}`}
                            >
                              <span className={formData.awardCategory ? "text-brand-dark font-medium" : "text-gray-500 font-medium"}>
                                {formData.awardCategory || "Choose a category..."}
                              </span>
                              <svg className={`w-4 h-4 text-gray-500 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>

                            <AnimatePresence>
                              {isCategoryDropdownOpen && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar"
                                >
                                  {formData.applicantType === "Individual" ? (
                                    <div className="py-1.5">
                                      {individualCategories.map((cat, idx) => (
                                        <div 
                                          key={idx} 
                                          onClick={() => {
                                            setFormData(prev => ({ ...prev, awardCategory: cat }));
                                            setIsCategoryDropdownOpen(false);
                                          }}
                                          className={`px-3 py-2.5 text-[13px] cursor-pointer hover:bg-brand-primary/10 transition-colors ${formData.awardCategory === cat ? 'bg-brand-primary/5 text-brand-primary font-bold' : 'text-brand-dark font-medium'}`}
                                        >
                                          {cat}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="py-1.5">
                                      {organizationCategories.map((cat, idx) => {
                                        if (typeof cat === 'string') {
                                          return (
                                            <div 
                                              key={idx} 
                                              onClick={() => {
                                                setFormData(prev => ({ ...prev, awardCategory: cat }));
                                                setIsCategoryDropdownOpen(false);
                                              }}
                                              className={`px-3 py-2.5 text-[13px] cursor-pointer hover:bg-brand-primary/10 transition-colors ${formData.awardCategory === cat ? 'bg-brand-primary/5 text-brand-primary font-bold' : 'text-brand-dark font-medium'}`}
                                            >
                                              {cat}
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div key={idx} className="mb-2 last:mb-0">
                                              <div className="px-3 py-2 text-[12px] font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 flex items-center sticky top-0 z-10">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8" /></svg>
                                                {cat.group}
                                              </div>
                                              <div className="flex flex-col relative pt-1 pb-1 bg-brand-primary/5">
                                                <div className="absolute left-[19px] top-0 bottom-4 w-px bg-brand-primary/20"></div>
                                                {cat.options.map((opt, optIdx) => {
                                                  const value = `${cat.group} - ${opt}`;
                                                  return (
                                                    <div 
                                                      key={optIdx} 
                                                      onClick={() => {
                                                        setFormData(prev => ({ ...prev, awardCategory: value }));
                                                        setIsCategoryDropdownOpen(false);
                                                      }}
                                                      className={`px-3 py-2.5 pl-10 text-[13px] cursor-pointer hover:bg-brand-primary/10 transition-colors relative flex items-center ${formData.awardCategory === value ? 'text-brand-primary font-bold' : 'text-brand-dark font-medium'}`}
                                                    >
                                                      <span className="w-3 h-px absolute left-[19px] bg-brand-primary/20"></span>
                                                      <span className={`w-1.5 h-1.5 rounded-full absolute left-[29px] z-10 ring-[3px] ring-brand-primary/5 ${formData.awardCategory === value ? 'bg-brand-primary' : 'bg-brand-primary/30'}`}></span>
                                                      {opt}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        }
                                      })}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Summary Input Block */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Company Name</label>
                          <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Applicant Name</label>
                          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Contact No.</label>
                          <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-brand-dark">Email</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium" />
                        </div>
                      </div>

                      {/* Upload Section */}
                      <div className="space-y-5 pt-3">
                        <div>
                          <h4 className="text-[14px] font-bold text-brand-dark mb-3">Upload Supporting Documents</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[12px] font-bold text-brand-dark">Brief Summary <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <label className="cursor-pointer bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-full transition-colors whitespace-nowrap inline-block shadow-sm">
                                  OR Attach File
                                  <input type="file" onChange={handleSummaryFileChange} className="hidden" />
                                </label>
                                {summaryDocumentFile && <span className="absolute top-1/2 -translate-y-1/2 right-[calc(100%+10px)] text-[10px] text-gray-500 truncate max-w-[100px]">{summaryDocumentFile.name}</span>}
                              </div>
                            </div>
                            <textarea 
                              name="briefSummary" 
                              value={formData.briefSummary} 
                              onChange={handleChange} 
                              placeholder="Summarize the nomination in a few sentences" 
                              rows="2" 
                              className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all text-brand-dark font-medium resize-none" 
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-brand-dark block">Upload Profile</label>
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-brand-primary/30 hover:border-brand-primary rounded-lg cursor-pointer bg-brand-primary/5 hover:bg-brand-primary/10 transition-all">
                            <div className="flex flex-col items-center justify-center pt-4 pb-4">
                              <svg className="w-5 h-5 text-brand-primary mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                              <p className="text-[13px] font-bold text-brand-dark">Click to upload or drag file here</p>
                              <p className="text-[11px] text-brand-dark/60 font-medium">PDF, PPT or DOC — max 15MB</p>
                            </div>
                            <input type="file" className="hidden" onChange={handleProfileFileChange} />
                          </label>
                          {profileDocumentFile && <p className="text-[11px] text-brand-primary font-bold text-center">Selected: {profileDocumentFile.name}</p>}
                        </div>
                        </div>
                      </div>
                      </div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-red-600 text-sm font-bold text-center">{error}</p>
                      </div>
                    )}
                  </form>
                </div>

                {/* Footer */}
                <div className="bg-white px-4 py-4 md:px-6 md:py-5 border-t border-brand-primary/10 shadow-[0_-4px_15px_-3px_rgb(0,0,0,0.05)] z-10 shrink-0">
                  <div className="w-full mx-auto space-y-2.5">
                    {currentStep === 3 && (
                      <div className="flex items-center justify-between bg-brand-primary/5 border border-brand-primary/20 rounded-lg px-3 py-2">
                        <span className="text-[13px] font-bold text-brand-dark">Total Amount:</span>
                        <span className="text-lg md:text-xl font-bold text-brand-primary tracking-tight">{totalAmount}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {currentStep > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            setError("");
                            setCurrentStep(prev => prev - 1);
                          }}
                          className="px-5 py-2.5 border border-gray-300 text-gray-600 font-bold text-[12px] uppercase tracking-wider rounded-lg transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                          Back
                        </button>
                      )}
                      
                      <button 
                        type="submit"
                        form="nomination-form"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-[12px] uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {currentStep < 3 ? 'NEXT STEP' : (loading ? 'SUBMITTING...' : 'SUBMIT DETAILS')}
                      </button>
                    </div>
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
