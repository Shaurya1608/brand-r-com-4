"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRY_CODES } from "../utils/countryCodes";
import CountryCodeSelect from "./CountryCodeSelect";

/**
 * Returns the current date/time in IST (UTC+5:30).
 * Using Intl.DateTimeFormat ensures it works correctly regardless
 * of the user's local timezone.
 */
function getISTDate() {
  let now = new Date();
  const testDate = process.env.NEXT_PUBLIC_PRICING_TEST_DATE || process.env.PRICING_TEST_DATE;
  if (process.env.NODE_ENV !== 'production' && testDate) {
    now = new Date(testDate);
  }
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
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Recalculate pricing every 60 s so it updates at midnight IST without a reload
  const [pricingTier, setPricingTier] = useState(getIndianPricingTier);
  useEffect(() => {
    const interval = setInterval(() => setPricingTier(getIndianPricingTier()), 60_000);
    return () => clearInterval(interval);
  }, []);
  
  React.useEffect(() => {
    if (isOpen) {
      setDelegateType(defaultType);
      
      // Fetch dynamic active pricing tier from backend server (uses PRICING_TEST_DATE if set in backend/.env)
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/pricing-tier`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.pricingTier) {
            setPricingTier(data.pricingTier);
          }
        })
        .catch(err => console.error('Error fetching pricing tier from backend:', err));

      // Auto-resume payment session if secure token is present in URL
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/resume-payment/${token}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.data) {
                setRegisteredDelegateId(data.data._id);
                setExistingData(data.data);
                setIsExistingRecord(true);
                setIsAlreadyPaid(data.data.paymentStatus === 'Paid');
                if (data.data.delegateType) setDelegateType(data.data.delegateType);
                setSuccess(true);
              }
            })
            .catch(err => console.error('Error loading payment token:', err));
        }
      }
    }
  }, [isOpen, defaultType]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  // Existing record & Lookup states
  const [isExistingRecord, setIsExistingRecord] = useState(false);
  const [isAlreadyPaid, setIsAlreadyPaid] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [isLookupMode, setIsLookupMode] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Payment flow state
  const [registeredDelegateId, setRegisteredDelegateId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    designation: "",
    countryCode: "+91",
    mobileNumber: "",
    organization: "",
    city: "",
    stateCountry: "",
    pinCode: "",
    gstNumber: "",
    address: ""
  });

  const handleChange = (e) => {
    if (error) setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Email & Mobile format validation
    const cleanEmail = String(formData.email || '').trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@company.com)');
      return;
    }

    const emailTypos = [
      { bad: '@gmail.co', correct: '@gmail.com' },
      { bad: '@gmail.con', correct: '@gmail.com' },
      { bad: '@gamil.com', correct: '@gmail.com' },
      { bad: '@gmai.com', correct: '@gmail.com' },
      { bad: '@yahoo.co', correct: '@yahoo.com' },
      { bad: '@yahoo.con', correct: '@yahoo.com' },
      { bad: '@hotmail.co', correct: '@hotmail.com' },
      { bad: '@outlook.co', correct: '@outlook.com' }
    ];

    for (const typo of emailTypos) {
      if (cleanEmail.endsWith(typo.bad)) {
        setError(`Did you mean ${cleanEmail.replace(typo.bad, typo.correct)}? Please check your email address.`);
        return;
      }
    }

    const mobileDigits = String(formData.mobileNumber || '').replace(/\D/g, '');
    if (!mobileDigits || mobileDigits.length < 10 || mobileDigits.length > 15) {
      setError('Please enter a valid 10-digit mobile number (e.g. 9876543210 or +91 9876543210)');
      return;
    }

    setLoading(true);

    const formattedMobile = formData.mobileNumber.startsWith('+') 
      ? formData.mobileNumber 
      : `${formData.countryCode || '+91'} ${formData.mobileNumber.trim()}`;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delegateType,
          ...formData,
          mobileNumber: formattedMobile,
          couponCode: couponApplied ? '#IAP2026' : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRegisteredDelegateId(data.data._id);
        if (data.isExisting) {
          setIsExistingRecord(true);
          setIsAlreadyPaid(data.alreadyPaid);
          setExistingData(data.data);
        } else {
          setIsExistingRecord(false);
          setIsAlreadyPaid(false);
          setExistingData(null);
        }
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

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLookupLoading(true);
    setLookupError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/lookup?query=${encodeURIComponent(lookupQuery.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setRegisteredDelegateId(data.data._id);
        setExistingData(data.data);
        setIsExistingRecord(true);
        setIsAlreadyPaid(data.data.paymentStatus === 'Paid');
        setFormData({
          fullName: data.data.fullName || '',
          email: data.data.email || '',
          designation: data.data.designation || '',
          mobileNumber: data.data.mobileNumber || '',
          organization: data.data.organization || '',
          city: data.data.city || '',
          stateCountry: data.data.stateCountry || '',
          pinCode: data.data.pinCode || '',
          gstNumber: data.data.gstNumber || '',
          address: data.data.address || '',
        });
        if (data.data.delegateType) setDelegateType(data.data.delegateType);
        if (data.data.couponCode) setCouponApplied(true);
        setSuccess(true);
      } else {
        setLookupError(data.message || 'No existing registration found with those details.');
      }
    } catch (err) {
      console.error(err);
      setLookupError('Error connecting to server. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Amount calculations
  const baseRs = 1; // pricingTier.amountRs;
  const taxableRs = 1; // couponApplied ? baseRs * 0.8 : baseRs;
  const gstRs = 0; // Math.round(taxableRs * 0.18);
  const finalRs = 1; // taxableRs + gstRs;

  const baseUsd = 250;
  const taxableUsd = couponApplied ? 200 : 250;

  const finalAmountForApi = delegateType === 'indian' ? finalRs : taxableUsd;
  
  const formatINR = (val) => new Intl.NumberFormat('en-IN').format(val);
  
  const finalAmountString = delegateType === 'indian' 
    ? `₹ ${formatINR(finalRs)}` 
    : `USD ${taxableUsd} + Tax`;

  const totalAmountDisplay = delegateType === 'indian' ? (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1.5 text-[12px] font-sans font-medium text-brand-dark/75 mb-0.5 tracking-wide">
        {couponApplied && <span className="line-through text-brand-dark/40">{`₹ ${formatINR(baseRs)}`}</span>}
        <span>{`₹ ${formatINR(taxableRs)}`}</span>
        <span className="text-brand-dark/40">+</span>
        <span className="text-brand-primary font-bold">{`₹ ${formatINR(gstRs)} (18% GST)`}</span>
      </div>
      <span className="font-serif font-bold text-3xl text-brand-dark">{`₹ ${formatINR(finalRs)}`}</span>
    </div>
  ) : (
    <div className="flex flex-col items-end">
      {couponApplied && (
        <div className="text-[12px] font-sans font-medium text-brand-dark/40 line-through mb-0.5 tracking-wide">
          USD 250 + Tax
        </div>
      )}
      <span className="font-serif font-bold text-3xl text-brand-dark">
        USD {taxableUsd} <span className="text-lg font-sans font-medium text-brand-dark/60">+ Tax</span>
      </span>
    </div>
  );

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
          amountRs: finalAmountForApi,
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
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
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
              if (checkData.data.paymentStatus === 'Paid') { setPaymentSuccess(true); } else { setError('Payment failed. Please try again.'); }
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
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            // User closed the checkout — registration stays Pending
            setPaymentCancelled(true);
            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setError(`Payment failed: ${response.error.description}`);
        setPaymentLoading(false);
      });
      rzp.open();

      // Fallback Polling Loop: In case Razorpay frontend fails/hangs (e.g. UPI QR issue)
      const MAX_POLLING_TIME_MS = 10 * 60 * 1000; // 10 minutes
      const POLLING_INTERVAL_MS = 4000;
      const startTime = Date.now();

      pollIntervalRef.current = setInterval(async () => {
        if (Date.now() - startTime > MAX_POLLING_TIME_MS) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          return;
        }

        try {
          const checkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/verify/${registeredDelegateId}`);
          const checkData = await checkRes.json();
          if (checkData.success && (checkData.data.paymentStatus === 'Paid' || checkData.data.paymentStatus === 'Failed')) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
            
            try { rzp.close(); } catch (e) { console.warn('Could not close rzp modal', e); }
            
            // Forcefully remove Razorpay iframe/container if it's stuck
            const rzpElements = document.querySelectorAll('.razorpay-container');
            rzpElements.forEach(el => el.remove());
            
            setPaymentSuccess(true);
            setPaymentLoading(false);
          }
        } catch (err) {
          // Silent catch for polling
        }
      }, POLLING_INTERVAL_MS);
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

                {paymentSuccess || isAlreadyPaid ? (
                  // ── Payment confirmed / Already Registered ─────────────────
                  <>
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-serif font-black text-brand-dark mb-2 tracking-wide uppercase">
                      REGISTRATION CONFIRMED!
                    </h2>
                    
                    <p className="text-brand-dark/90 font-bold text-[13px] leading-snug max-w-sm mb-2">
                      Thank you for registering for BRAND R.Comm – Agriculture &amp; Rural Communication Summit &amp; Awards 2026.
                    </p>

                    <p className="text-brand-dark/75 text-[12px] leading-relaxed max-w-sm mb-4">
                      Your payment has been received successfully, and your delegate registration has been confirmed.
                    </p>

                    <div className="w-full max-w-sm bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 mb-4 text-center space-y-1 shadow-2xs">
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">Registration ID</span>
                      <span className="font-mono text-xl font-black text-emerald-900 tracking-wider block">
                        DEL-{registeredDelegateId?.slice(-5).toUpperCase() || 'A1B2C'}
                      </span>
                    </div>

                    <div className="w-full max-w-sm bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 mb-4 text-left text-[11px] text-gray-700 space-y-2 leading-relaxed">
                      <p>📩 A confirmation email will be sent to your registered email address shortly.</p>
                      <p>🎫 Your Event Entry Pass, QR Code, and complete event guidelines will be shared with you 3 days prior to the event via your registered email and mobile number.</p>
                    </div>

                    <p className="text-[#5e8e33] font-serif font-bold text-[13px] mb-5">
                      We look forward to welcoming you to BRAND R.Comm 2026.
                    </p>

                    <button
                      onClick={onClose}
                      className="w-full max-w-sm py-3 bg-[#5e8e33] hover:bg-[#4c7727] text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md"
                    >
                      Close
                    </button>
                  </>
                ) : isExistingRecord ? (
                  // ── Existing Registration Found (Payment Pending) ───────────
                  <>
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-5">
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif text-brand-dark font-bold mb-2">Existing Registration Found!</h2>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full mb-3">
                      Is this you? Payment Due
                    </span>
                    <p className="text-brand-dark/70 text-[13px] leading-relaxed max-w-sm mb-3">
                      It looks like you've already registered. You can complete your pending payment below without re-registering.
                    </p>

                    {existingData?.priceChanged && (
                      <div className="w-full max-w-sm bg-blue-50 border border-blue-200/80 rounded-xl p-3 mb-3 text-left text-[12px] text-blue-950 leading-snug">
                        ℹ️ <strong>Pricing Tier Updated:</strong> Your registration was created during a previous pricing tier. Since that cutoff has passed, today's applicable fee applies.
                      </div>
                    )}

                    <div className="w-full max-w-sm bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 mb-5 text-left space-y-2 font-sans">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-brand-dark/60 font-medium">Attendee Name</span>
                        <span className="font-semibold text-brand-dark">{existingData?.fullName || formData.fullName}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-brand-dark/60 font-medium">Email / Mobile</span>
                        <span className="font-medium text-brand-dark/80 text-[12px]">{existingData?.email || formData.email}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-brand-dark/60 font-medium">Registration #</span>
                        <span className="font-mono font-bold text-brand-dark">DEL-{registeredDelegateId?.slice(-5).toUpperCase() || 'A1B2C'}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-brand-dark/60 font-medium">Payment Status</span>
                        <span className="font-bold text-amber-700 uppercase tracking-wider text-[11px]">Pending Due</span>
                      </div>
                      <div className="flex justify-between text-[13px] pt-1 border-t border-amber-200/50">
                        <span className="text-brand-dark/70 font-bold">Total Amount Due</span>
                        <span className="font-bold text-brand-primary text-[15px]">{finalAmountString}</span>
                      </div>
                    </div>

                    {error && <p className="text-red-500 text-[12px] font-bold text-center mb-4">{error}</p>}

                    <div className="flex flex-col w-full gap-3 max-w-sm">
                      <button
                        onClick={handleProceedToPayment}
                        disabled={paymentLoading}
                        className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                      >
                        {paymentLoading ? 'Opening Payment Gateway...' : `Proceed To Payment (${finalAmountString})`}
                      </button>
                      <button
                        onClick={() => { setSuccess(false); setIsExistingRecord(false); }}
                        className="w-full py-2.5 border border-gray-300 text-gray-600 font-mono font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Submit New Details
                      </button>
                    </div>
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
                    <div className="w-16 h-16 bg-[#5e8e33]/10 rounded-full flex items-center justify-center mb-5">
                      <svg className="w-8 h-8 text-[#5e8e33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <h2 className="text-xl md:text-2xl font-serif font-black text-brand-dark mb-3 tracking-wide uppercase">
                      DETAILS SUBMITTED SUCCESSFULLY
                    </h2>

                    <p className="text-brand-dark/90 font-bold text-[13px] leading-snug mb-2">
                      Thank you for submitting your delegate registration.
                    </p>

                    <p className="text-brand-dark/75 text-[12px] leading-relaxed max-w-sm mb-6">
                      Your registration details have been saved successfully. Please complete the payment to confirm your participation at <strong className="font-bold text-brand-dark">BRAND R.Comm – Agriculture &amp; Rural Communication Summit &amp; Awards 2026.</strong>
                    </p>

                    {error && <p className="text-red-500 text-[12px] font-bold text-center mb-4">{error}</p>}

                    <div className="flex flex-col w-full gap-3 max-w-sm">
                      <button
                        onClick={handleProceedToPayment}
                        disabled={paymentLoading}
                        className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {paymentLoading ? 'Opening Payment...' : `Proceed To Payment — ${finalAmountString}`}
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
                        <div className="flex items-center gap-1.5">
                          <CountryCodeSelect
                            name="countryCode"
                            value={formData.countryCode || '+91'}
                            onChange={handleChange}
                            buttonStyle="flex items-center justify-between gap-1 px-2 py-2 border border-brand-primary/20 rounded-lg bg-gray-50 hover:bg-gray-100 text-brand-dark font-semibold text-[13px] transition-all cursor-pointer min-w-[80px]"
                          />
                          <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="98765 43210" className="flex-1 min-w-0 px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                        </div>
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
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Pin Code *</label>
                        <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="400001" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Email Address *</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Company GST No. <span className="text-brand-dark/40 font-normal lowercase">(optional for tax invoice)</span></label>
                        <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="27AAAAA0000A1Z5" className="w-full px-3 py-2 text-[13px] uppercase border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 placeholder:normal-case shadow-sm text-brand-dark font-medium" />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-dark">Full Address *</label>
                        <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="Building, Street, Landmark..." rows="2" className="w-full px-3 py-2 text-[13px] border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 bg-white transition-all placeholder:text-brand-dark/30 shadow-sm text-brand-dark font-medium resize-none" />
                      </div>
                    </div>

                    {/* Coupon Code - Interactive Offer Card */}
                    <div className="pt-4 mt-2 border-t border-brand-primary/10">
                      <div 
                        onClick={() => setCouponApplied(!couponApplied)}
                        className={`relative overflow-hidden cursor-pointer transition-all duration-300 rounded-xl border p-4 ${
                          couponApplied 
                            ? 'bg-brand-primary/5 border-brand-primary/50 shadow-[0_0_15px_rgba(106,154,56,0.1)]' 
                            : 'bg-white border-brand-primary/15 hover:border-brand-primary/40 hover:bg-brand-primary/[0.02] hover:shadow-sm'
                        }`}
                      >
                        {/* Decorative bg element */}
                        {couponApplied && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-bl-[100px] -z-10 translate-x-4 -translate-y-4" />
                        )}

                        <div className="flex items-start gap-3.5 relative z-10">
                          {/* Custom Checkbox */}
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                              couponApplied 
                                ? 'bg-brand-primary border-brand-primary text-white scale-110 shadow-sm' 
                                : 'border-brand-primary/30 bg-white text-transparent group-hover:border-brand-primary/50'
                            }`}>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Card Content */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className={`text-[13px] font-bold transition-colors ${couponApplied ? 'text-brand-primary' : 'text-brand-dark'}`}>
                                Apply Industry Partner Discount
                              </h4>
                              <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border transition-colors ${
                                couponApplied 
                                  ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' 
                                  : 'bg-brand-surface text-brand-dark/60 border-brand-primary/10'
                              }`}>
                                #IAP2026
                              </span>
                            </div>
                            <p className="text-[12px] text-brand-dark/75 leading-relaxed mb-2">
                              Check this box to apply your exclusive association partner code and instantly receive an <strong className="text-brand-dark font-extrabold bg-brand-primary/10 px-1 rounded">extra 20% OFF</strong> your registration fee.
                            </p>
                            <div className="flex items-start gap-1.5 pt-2 border-t border-brand-primary/10">
                              <svg className="w-3 h-3 text-brand-primary/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-[10px] text-brand-dark/50 leading-snug">
                                Note: The organizing team may request valid proof of association or affiliation during the registration verification process.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Footer */}
                <div className="bg-white px-5 py-4 border-t border-brand-primary/10 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.02)] z-10 relative">
                  {error && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-bold shadow-xs">
                      <svg className="w-4.5 h-4.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <span className="font-bold text-[11px] tracking-widest uppercase text-brand-dark">Total Fee</span>
                    <div className="flex items-center justify-end">{totalAmountDisplay}</div>
                  </div>
                  <button 
                    type="submit"
                    form="delegate-form"
                    disabled={loading}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
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
