"use client";

import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle2, Tag } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const GenerateCouponModal = ({ isOpen, onClose, sponsorship, nomination, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  // Form fields
  const [code, setCode] = useState('');
  const [customOrganization, setCustomOrganization] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(100);
  const [maxUses, setMaxUses] = useState(50);
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  // Determine mode: standalone vs entity-linked
  const isStandalone = !sponsorship && !nomination;
  const entityId = sponsorship?._id || nomination?._id;
  const entityName = isStandalone
    ? (customOrganization || 'Organization')
    : (sponsorship?.companyName || nomination?.organizationName || nomination?.fullName || 'Organization');
  const entityType = sponsorship ? 'sponsorships' : 'nominations';

  useEffect(() => {
    if (isOpen) {
      setSuccessData(null);
      setCustomOrganization('');
      setDiscountPercentage(100);
      
      const prefix = sponsorship ? 'SPO' : nomination ? 'NOM' : 'CPN';
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCode(`${prefix}-${randomPart}`);
      
      setMaxUses(50);
      const today = new Date();
      setStartsAt(today.toISOString().split('T')[0]);
      
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setExpiresAt(nextMonth.toISOString().split('T')[0]);
    }
  }, [isOpen, sponsorship, nomination]);

  if (!isOpen) return null;
  if (!isStandalone && !entityId) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (isStandalone && !customOrganization.trim()) {
      toast.error('Please enter an Organization or Sponsor name');
      return;
    }

    const discountNum = parseInt(discountPercentage, 10);
    if (isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      toast.error('Discount percentage must be between 1% and 100%');
      return;
    }

    setLoading(true);

    try {
      const token = Cookies.get('admin_token');
      const url = isStandalone
        ? `${process.env.NEXT_PUBLIC_API_URL}/coupons`
        : `${process.env.NEXT_PUBLIC_API_URL}/${entityType}/${entityId}/coupons`;

      const payload = isStandalone
        ? { code, sponsorName: customOrganization.trim(), discountPercentage: discountNum, maxUses, startsAt, expiresAt }
        : { code, discountPercentage: discountNum, maxUses, startsAt, expiresAt };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessData(data.coupon);
        if (onSuccess) onSuccess(data.coupon);
        toast.success('Coupon generated successfully!', {
          style: { background: '#10B981', color: '#fff', fontWeight: 'bold' }
        });
      } else {
        toast.error(data.message || 'Failed to generate coupon', {
          style: { background: '#EF4444', color: '#fff', fontWeight: 'bold' }
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.', {
        style: { background: '#EF4444', color: '#fff', fontWeight: 'bold' }
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const frontendBaseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://brandrcomm.com';
  const directLink = successData ? `${frontendBaseUrl}/?coupon=${successData.code}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[92vh] flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Compact */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6a9a38]/10 text-[#6a9a38] flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 tracking-tight leading-tight">Generate Coupon</h2>
              <p className="text-[11px] text-gray-400 font-medium leading-none">Create a pass or discount code</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {successData ? (
          <div className="p-6 text-center space-y-4 overflow-y-auto">
            <div className="w-12 h-12 bg-[#6a9a38]/10 text-[#6a9a38] rounded-full flex items-center justify-center mx-auto border border-[#6a9a38]/20 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Coupon Created!</h3>
              <p className="text-xs font-medium text-gray-500">
                The <strong className="text-[#6a9a38]">{successData.discountPercentage === 100 ? '100% Free' : `${successData.discountPercentage}% Discount`}</strong> coupon for <strong className="text-gray-800">{successData.sponsorName || entityName}</strong> is ready.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between shadow-2xs">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-left mb-0.5">Coupon Code</p>
                  <p className="font-mono text-lg font-bold text-gray-900">{successData.code}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(successData.code, 'Code')}
                  className="p-2 bg-white border border-gray-200 hover:border-[#6a9a38] hover:text-[#6a9a38] rounded-lg transition-all shadow-2xs text-gray-600 cursor-pointer"
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between shadow-2xs">
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-left mb-0.5">Direct Registration Link</p>
                  <p className="text-xs font-medium text-gray-600 truncate pr-3">
                    {directLink}
                  </p>
                </div>
                <button 
                  onClick={() => copyToClipboard(directLink, 'Link')}
                  className="p-2 bg-white border border-gray-200 hover:border-[#6a9a38] hover:text-[#6a9a38] rounded-lg transition-all shadow-2xs text-gray-600 shrink-0 cursor-pointer"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl transition-colors font-bold uppercase tracking-wider text-xs mt-2 cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <form id="generate-coupon-form" onSubmit={handleGenerate} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
              
              {/* Organization */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Organization / Sponsor Name <span className="text-red-500">*</span>
                </label>
                {isStandalone ? (
                  <input
                    type="text"
                    placeholder="e.g. Reliance Foundation, Govt of India, AgroTech"
                    value={customOrganization}
                    onChange={(e) => setCustomOrganization(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-2xs"
                    required
                  />
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 font-semibold shadow-inner">
                    {entityName}
                  </div>
                )}
              </div>

              {/* 2-Column: Coupon Code & Maximum Uses */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 font-mono font-bold text-sm focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-2xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Max Uses (Delegates) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 font-semibold text-sm focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-2xs"
                    required
                  />
                </div>
              </div>

              {/* Discount Amount - Compact Card */}
              <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Discount Amount</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${discountPercentage == 100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                    {discountPercentage == 100 ? '🎉 100% Free Pass' : `🏷️ ${discountPercentage}% OFF`}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-24 shrink-0">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={discountPercentage}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setDiscountPercentage('');
                        } else {
                          const num = parseInt(val, 10);
                          setDiscountPercentage(isNaN(num) ? 100 : Math.max(1, Math.min(100, num)));
                        }
                      }}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 font-bold text-sm focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-2xs text-center"
                      required
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">%</span>
                  </div>

                  {/* Quick Select Pills in a clean flex line */}
                  <div className="flex flex-wrap gap-1 items-center flex-1">
                    {[100, 5, 10, 15, 20, 25, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDiscountPercentage(pct)}
                        className={`px-2 py-1 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
                          discountPercentage == pct
                            ? 'bg-[#6a9a38] text-white border-[#6a9a38] shadow-2xs'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {pct === 100 ? 'Free' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2-Column: Starts At & Expires At */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Starts At <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 font-semibold text-xs focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-2xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Expires At <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 font-semibold text-xs focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-2xs"
                    required
                  />
                </div>
              </div>

            </div>

            {/* Footer - Fixed at Bottom */}
            <div className="flex gap-2.5 px-5 py-3 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all font-bold uppercase tracking-wider text-xs cursor-pointer shadow-2xs"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-2.5 px-3 bg-[#6a9a38] hover:bg-[#5c8730] text-white shadow-sm hover:shadow-md rounded-lg transition-all font-bold uppercase tracking-wider text-xs disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] cursor-pointer"
              >
                {loading ? 'GENERATING...' : 'GENERATE COUPON'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GenerateCouponModal;
