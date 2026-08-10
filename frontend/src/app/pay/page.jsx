"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Lock, ShieldCheck, ArrowRight, RefreshCw, Mail, Phone, Calendar, MapPin } from "lucide-react";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delegateData, setDelegateData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [isNomination, setIsNomination] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing payment token. Please check your link or contact support.");
      setLoading(false);
      return;
    }

    // Try Delegate payment session first
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/resume-payment/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setDelegateData(data.data);
          setIsNomination(false);
          if (data.data.paymentStatus === "Paid") {
            setPaymentSuccess(true);
          }
          setLoading(false);
        } else {
          // Fallback to Nomination payment session
          return fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/resume-payment/${token}`)
            .then((nRes) => nRes.json())
            .then((nData) => {
              if (nData.success && nData.data) {
                setDelegateData(nData.data);
                setIsNomination(true);
                if (nData.data.paymentStatus === "Paid") {
                  setPaymentSuccess(true);
                }
              } else {
                setError(nData.message || data.message || "Invalid or expired payment link.");
              }
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching payment token session:", err);
        setError("Error connecting to payment server. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleProceedToPayment = async () => {
    if (!delegateData) return;
    setPaymentLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setPaymentLoading(false);
        return;
      }

      const endpointPrefix = isNomination ? 'nominations' : 'delegates';
      const orderPayload = isNomination 
        ? { nominationId: delegateData._id, amount: delegateData.totalAmount || 17700 }
        : { delegateId: delegateData._id, amount: delegateData.totalAmount, currency: delegateData.delegateType === "foreign" ? "USD" : "INR" };

      // Create order via backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpointPrefix}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        alert(orderData.message || "Failed to create payment order.");
        setPaymentLoading(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "BRAND R.Comm 2026",
        description: isNomination ? `Award Nomination Payment - #${delegateData.nominationId || delegateData.registrationId}` : `Delegate Payment - ${delegateData.registrationId}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyPayload = isNomination 
              ? { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, nominationId: delegateData._id }
              : { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, delegateId: delegateData._id };

            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpointPrefix}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(verifyPayload),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setPaymentSuccess(true);
              setDelegateData((prev) => ({ ...prev, paymentStatus: "Paid" }));
            } else {
              alert(verifyData.message || "Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Verification error. Please contact support.");
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: delegateData.rawFullName || delegateData.fullName,
          email: delegateData.email,
          contact: delegateData.mobileNumber,
        },
        theme: { color: "#5e8e33" },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setPaymentLoading(false);
    }
  };

  const formatINR = (val) => new Intl.NumberFormat("en-IN").format(val || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f2f8eb] to-[#e4f0d6] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#5e8e33]/20 text-center max-w-sm w-full space-y-4">
          <div className="w-12 h-12 border-4 border-[#5e8e33]/20 border-t-[#5e8e33] rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-700 font-bold text-sm">Loading your payment session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f2f8eb] to-[#e4f0d6] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-200 text-center max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-black text-gray-900 font-serif">Payment Link Issue</h2>
          <p className="text-gray-600 text-xs leading-relaxed">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 bg-[#5e8e33] hover:bg-[#4c7727] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
          >
            Go To Homepage
          </a>
        </div>
      </div>
    );
  }

  const baseAmount = Math.round(delegateData.totalAmount / 1.18);
  const gstAmount = delegateData.totalAmount - baseAmount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f9ef] via-[#edf5e3] to-[#e4f0d6] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#5e8e33]/20 overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-[#5e8e33] p-6 text-white text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 backdrop-blur-xs">
            <ShieldCheck size={12} />
            <span>Official Event Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">BRAND R.Comm 2026</h1>
          <p className="text-xs text-white/90 font-medium mt-1">Agriculture & Rural Communication Summit & Awards</p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {paymentSuccess ? (
            /* Post Payment Confirmed Screen */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                <CheckCircle2 size={36} />
              </div>

              <h2 className="text-2xl font-serif font-black text-gray-900 uppercase tracking-wide">REGISTRATION CONFIRMED!</h2>

              <p className="text-gray-800 font-bold text-xs leading-snug">
                Thank you for registering for BRAND R.Comm – Agriculture & Rural Communication Summit & Awards 2026.
              </p>

              <p className="text-gray-600 text-xs leading-relaxed">
                Your payment has been received successfully, and your delegate registration has been confirmed.
              </p>

              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-center space-y-1 shadow-2xs">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Registration ID</span>
                <span className="font-mono text-2xl font-black text-emerald-950 tracking-wider block">
                  #{delegateData.registrationId || (delegateData._id ? delegateData._id.slice(-8).toUpperCase() : '')}
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 text-left text-xs text-gray-700 space-y-2 leading-relaxed">
                <p>📩 A confirmation email has been sent to your registered email address.</p>
                <p>🎫 Your Event Entry Pass, QR Code, and complete guidelines will be shared 3 days prior to the event via email and mobile number.</p>
              </div>

              <p className="text-[#5e8e33] font-serif font-bold text-sm">We look forward to welcoming you to BRAND R.Comm 2026.</p>
            </div>
          ) : (
            /* Pre Payment Screen */
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-serif font-bold text-gray-900">Complete Payment</h2>
                  <p className="text-xs text-gray-500">Hi <strong className="text-gray-900">{delegateData.rawFullName || delegateData.fullName}</strong> 👋</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                  Payment Pending
                </span>
              </div>

              {/* Registration Breakdown Card */}
              <div className="bg-[#f9fbf7] border border-[#5e8e33]/20 rounded-2xl p-4 space-y-2.5 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Registration ID</span>
                  <span className="font-mono font-bold text-gray-900">#{delegateData.registrationId || (delegateData._id ? delegateData._id.slice(-8).toUpperCase() : '')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Name</span>
                  <span className="font-bold text-gray-900">{delegateData.rawFullName || delegateData.fullName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Registration Type</span>
                  <span className="font-bold text-[#5e8e33] uppercase">Delegate</span>
                </div>
                <div className="pt-2 border-t border-[#5e8e33]/15 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Registration Fee ({delegateData.tierName || 'Standard'})</span>
                    <span>₹{formatINR(baseAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{formatINR(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#5e8e33]/20 text-sm font-black text-gray-900">
                    <span>Total Payable</span>
                    <span className="text-xl font-serif text-[#5e8e33]">₹{formatINR(delegateData.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {delegateData.priceChanged && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 leading-snug">
                  ℹ️ <strong>Pricing Tier Updated:</strong> The registration fee reflects the active IST pricing tier for today's date.
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={paymentLoading}
                className="w-full py-4 bg-[#5e8e33] hover:bg-[#4c7727] text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {paymentLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Opening Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Proceed To Payment — ₹{formatINR(delegateData.totalAmount)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-2">
                <span className="flex items-center gap-1"><Lock size={10} /> 256-Bit SSL Encrypted</span>
                <span>•</span>
                <span>Razorpay Secured</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#f2f8eb] to-[#e4f0d6] flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-[#5e8e33]/20 border-t-[#5e8e33] rounded-full animate-spin"></div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
