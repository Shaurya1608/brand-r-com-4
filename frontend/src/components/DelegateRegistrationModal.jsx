"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Returns the current date/time in IST (UTC+5:30).
 * Using Intl.DateTimeFormat ensures it works correctly regardless
 * of the user's local timezone.
 */
function getISTDate() {
  const now = new Date();
  // Format parts in IST
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const get = (type) => parseInt(parts.find(p => p.type === type).value, 10);
  // Return a plain object representing midnight IST of the current IST day
  return { year: get('year'), month: get('month'), day: get('day') };
}

/**
 * Pricing tiers (Indian delegates) — based on IST date:
 *  ≤ 31 Aug 2026  →  ₹6,000 + GST   (Early Bird)
 *   1–30 Sep 2026 →  ₹7,000 + GST   (Standard)
 *   1–31 Oct 2026 →  ₹8,000 + GST   (Late)
 *  ≥  1 Nov 2026  → ₹10,000 + GST   (On-Spot)
 */
function getIndianPricingTier() {
  const { year, month, day } = getISTDate();

  if (year < 2026 || (year === 2026 && month <= 8)) {
    return { label: 'Early Bird', amount: '₹ 6,000 + GST', amountRs: 6000, color: 'bg-emerald-100 text-emerald-700' };
  } else if (year === 2026 && month === 9) {
    return { label: 'Standard',   amount: '₹ 7,000 + GST', amountRs: 7000, color: 'bg-blue-100 text-blue-700' };
  } else if (year === 2026 && month === 10) {
    return { label: 'Late',       amount: '₹ 8,000 + GST', amountRs: 8000, color: 'bg-amber-100 text-amber-700' };
  } else {
    return { label: 'On-Spot',   amount: '₹ 10,000 + GST', amountRs: 10000, color: 'bg-red-100 text-red-700' };
  }
}

/**
 * Dynamically loads the Razorpay checkout script.
 * Resolves true when ready, false on error.
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DelegateRegistrationModal({ isOpen, onClose, defaultType = "indian" }) {
  const [delegateType, setDelegateType] = useState(defaultType);

  // Recalculate pricing every 60 s so it updates at midnight IST without a reload
  const [pricingTier, setPricingTier] = useState(getIndianPricingTier);
  useEffect(() => {
    const interval = setInterval(() => setPricingTier(getIndianPricingTier()), 60_000);
    return () => clearInterval(interval);
  }, []);
  
  React.useEffect(() => {
    if (isOpen) {
      setDelegateType(defaultType);
    }
  }, [isOpen, defaultType]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  // Payment flow state
  const [registeredDelegateId, setRegisteredDelegateId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delegateType,
          ...formData,
          couponCode: couponApplied ? '#IAP2026' : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRegisteredDelegateId(data.data._id);
        setSuccess(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = delegateType === "indian" ? pricingTier.amount : "USD 250 + Tax";

  // ── Razorpay checkout handler ──────────────────────────────────────────────
  const handleProceedToPayment = async () => {
    if (!registeredDelegateId) return;
    setPaymentLoading(true);
    setError('');
    setPaymentCancelled(false);

    try {
      // 1. Create order on backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delegateId: registeredDelegateId,
          amountRs: delegateType === 'indian' ? pricingTier.amountRs : 250,
        }),
      });
      const order = await res.json();
      if (!order.success) throw new Error(order.message || 'Failed to create payment order');

      // 2. Load Razorpay JS SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) throw new Error('Razorpay SDK could not be loaded. Check your connection.');

      // 3. Open Razorpay checkout
      const options = {
        key: order.keyId,
        amount: order.amount,      // in paise
        currency: order.currency,
        name: 'Brand R.Comm 2026',
        description: 'Delegate Registration — Agriculture & Rural Communication Summit & Awards',
        // image: 'https://yourdomain.com/logo/logo.png', // ← add full HTTPS URL when deployed
        order_id: order.orderId,
        handler: async (response) => {
          // 4. Verify signature on backend (HMAC-SHA256)
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:  response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                delegateId: registeredDelegateId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setRazorpayPaymentId(response.razorpay_payment_id);
              setPaymentSuccess(true);
            } else {
              setError('Payment received but verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
            }
          } catch {
            setError('Verification error. Please contact support.');
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name:    formData.fullName,
          contact: formData.mobileNumber,
        },
        theme: { color: '#6a9a38' },
        modal: {
          ondismiss: () => {
            // User closed the checkout — registration stays Pending
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
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setPaymentLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col font-sans"
          >
            {success ? (
              <div className="relative p-8 md:p-10 flex flex-col items-center text-center bg-white">
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-primary bg-brand-surface hover:bg-brand-primary/10 p-1.5 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {paymentSuccess ? (
                  // ── Payment confirmed ──────────────────────────────────────
                  <>
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-5">
                      <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif text-brand-dark font-bold mb-3">Payment Successful!</h2>
                    <p className="text-brand-dark/70 text-[14px] leading-relaxed max-w-sm mb-4">
                      Your delegate registration for <strong className="font-bold text-brand-dark">BRAND R.Comm 2026</strong> is now confirmed.
                    </p>
                    <div className="w-full max-w-sm bg-brand-surface/50 border border-brand-primary/10 rounded-xl p-4 mb-6 text-left space-y-2">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-brand-dark/60 font-medium">Name</span>
                        <span className="font-semibold text-brand-dark">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-brand-dark/60 font-medium">Amount Paid</span>
                        <span className="font-bold text-brand-primary">{totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-brand-dark/60 font-medium">Payment ID</span>
                        <span className="font-mono text-[11px] text-brand-dark/70 break-all">{razorpayPaymentId}</span>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full max-w-sm py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md"
                    >
                      Close
                    </button>
                  </>
                ) : paymentCancelled ? (
                  // ── Payment cancelled — registration still pending ──────────
                  <>
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-5">
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif text-brand-dark font-bold mb-3">Payment Incomplete</h2>
                    <p className="text-brand-dark/70 text-[14px] leading-relaxed max-w-sm mb-6">
                      Your registration is saved but payment is <strong>pending</strong>. You can complete payment anytime. Please contact us if you need assistance.
                    </p>
                    <div className="flex flex-col w-full gap-3 max-w-sm">
                      <button
                        onClick={() => { setPaymentCancelled(false); handleProceedToPayment(); }}
                        disabled={paymentLoading}
                        className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-60"
                      >
                        {paymentLoading ? 'Opening Payment...' : 'Try Payment Again'}
                      </button>
                      <button onClick={onClose} className="w-full py-3 border-2 border-brand-primary/20 hover:border-brand-primary text-brand-primary font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all hover:bg-brand-primary/5">
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  // ── Registration submitted — awaiting payment ──────────────
                  <>
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif text-brand-dark font-bold mb-4">
                      Registration Submitted Successfully
                    </h2>
                    <p className="text-brand-dark/80 font-medium mb-3">
                      Thank you for submitting your delegate registration.
                    </p>
                    <p className="text-brand-dark/70 text-[14px] leading-relaxed max-w-sm mb-8">
                      Your registration details have been saved. Please complete the payment to confirm your participation at <strong className="font-bold text-brand-dark">BRAND R.Comm – Agriculture &amp; Rural Communication Summit &amp; Awards 2026.</strong>
                    </p>
                    {error && <p className="text-red-500 text-[12px] font-bold text-center mb-4">{error}</p>}
                    <div className="flex flex-col w-full gap-3 max-w-sm">
                      <button
                        onClick={handleProceedToPayment}
                        disabled={paymentLoading}
                        className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {paymentLoading ? 'Opening Payment...' : `Proceed To Payment — ${totalAmount}`}
                      </button>
                      <button
                        onClick={() => setSuccess(false)}
                        className="w-full py-3 border-2 border-brand-primary/20 hover:border-brand-primary text-brand-primary bg-transparent font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all hover:bg-brand-primary/5"
                      >
                        Edit Registration
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-brand-primary/10 bg-white z-10">
                  <h3 className="text-2xl font-serif text-brand-dark">Delegate Registration</h3>
                  <button 
                    onClick={onClose}
                    className="text-brand-dark/40 hover:text-brand-primary bg-brand-surface hover:bg-brand-primary/10 p-1.5 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form Body */}
                <div className="overflow-y-auto px-5 py-5 custom-scrollbar flex-1 bg-brand-surface/30">
                  <form id="delegate-form" onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Delegate Type (Segmented Control style) */}
                    <div className="flex p-1 bg-brand-surface rounded-lg border border-brand-primary/10">
                      <label className={`flex-1 flex justify-center items-center py-2 px-2 rounded-md cursor-pointer transition-all text-[10px] font-mono tracking-widest uppercase ${
                        delegateType === "indian" 
                          ? "bg-white text-brand-primary shadow-sm font-bold" 
                          : "text-brand-dark/70 hover:text-brand-dark font-bold"
                      }`}>
                        <input 
                          type="radio" 
                          name="delegateType" 
                          value="indian"
                          checked={delegateType === "indian"}
                          onChange={(e) => setDelegateType(e.target.value)}
                          className="hidden"
                        />
                        Indian (INR)
                      </label>
                      <label className={`flex-1 flex justify-center items-center py-2 px-2 rounded-md cursor-pointer transition-all text-[10px] font-mono tracking-widest uppercase ${
                        delegateType === "foreign" 
                          ? "bg-white text-brand-primary shadow-sm font-bold" 
                          : "text-brand-dark/70 hover:text-brand-dark font-bold"
                      }`}>
                        <input 
                          type="radio" 
                          name="delegateType" 
                          value="foreign"
                          checked={delegateType === "foreign"}
                          onChange={(e) => setDelegateType(e.target.value)}
                          className="hidden"
                        />
                        Intl (USD)
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 gap-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Full Name *</label>
                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Designation *</label>
                        <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="CEO" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Mobile Number *</label>
                        <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+91 98765 43210" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Organization *</label>
                        <input required type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Company Ltd." className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">City *</label>
                        <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">State / Country *</label>
                        <input required type="text" name="stateCountry" value={formData.stateCountry} onChange={handleChange} placeholder="Maharashtra, India" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Pin Code *</label>
                        <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="400001" className="w-full sm:w-[calc(50%-0.375rem)] px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Full Address *</label>
                        <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="Building, Street, Landmark..." rows="2" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium resize-none" />
                      </div>
                    </div>

                    {/* Coupon Code */}
                    <div className="pt-1 border-t border-brand-primary/10">
                      <label className="flex items-start gap-2.5 cursor-pointer group">
                        <div className="mt-0.5 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={couponApplied}
                            onChange={(e) => setCouponApplied(e.target.checked)}
                            className="w-4 h-4 rounded border-brand-primary/30 text-brand-primary accent-brand-primary cursor-pointer"
                          />
                        </div>
                        <span className="text-[13px] text-brand-dark font-medium leading-snug group-hover:text-brand-primary transition-colors">
                          Coupon Code: <span className="font-bold">#IAP2026</span>
                        </span>
                      </label>
                      <p className="mt-2 text-[11px] text-brand-dark/55 leading-relaxed">
                        Note: Industry Partners may apply the coupon code to avail the applicable registration discount. The organizing team may request valid proof of association or affiliation during the registration verification process.
                      </p>
                    </div>

                    {error && <p className="text-red-500 text-[10px] font-bold text-center mt-2">{error}</p>}
                  </form>
                </div>

                {/* Footer */}
                <div className="bg-white px-5 py-5 border-t border-brand-primary/10 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.02)] z-10 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <span className="font-bold text-[11px] tracking-widest uppercase text-brand-dark">Total Fee</span>
                    <span className="font-serif font-bold text-2xl text-brand-dark">{totalAmount}</span>
                  </div>
                  <button 
                    type="submit"
                    form="delegate-form"
                    disabled={loading}
                    className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
                  </button>
                </div>
              </div>
            )}
            
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 5px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #e5e7eb;
                border-radius: 10px;
              }
              .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                background-color: #d1d5db;
              }
            `}</style>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
