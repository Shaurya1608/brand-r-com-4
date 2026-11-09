"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, Edit3, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const EditCouponModal = ({ isOpen, onClose, coupon, onSuccess }) => {
  const [maxUses, setMaxUses] = useState(1);
  const [discountPercentage, setDiscountPercentage] = useState(100);
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon && isOpen) {
      setMaxUses(coupon.maxUses || 1);
      setDiscountPercentage(typeof coupon.discountPercentage === 'number' ? coupon.discountPercentage : 100);
      if (coupon.expiresAt) {
        // Format date for date input (YYYY-MM-DD)
        const date = new Date(coupon.expiresAt);
        setExpiresAt(date.toISOString().split('T')[0]);
      }
    }
  }, [coupon, isOpen]);

  if (!isOpen || !coupon) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const limitInt = parseInt(maxUses, 10);
    if (isNaN(limitInt) || limitInt < coupon.usedCount) {
      toast.error(`Limit must be at least ${coupon.usedCount} (current usage)`);
      return;
    }

    const discountNum = parseInt(discountPercentage, 10);
    if (isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      toast.error('Discount percentage must be between 1% and 100%');
      return;
    }

    if (!expiresAt) {
      toast.error("Please provide an expiry date");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get('admin_token');
      
      // Update Limit
      const limitRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${coupon._id}/limit`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ maxUses: limitInt })
      });
      const limitData = await limitRes.json();
      
      // Update Expiry
      const expiryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${coupon._id}/expiry`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiresAt })
      });
      const expiryData = await expiryRes.json();

      // Update Discount
      const discountRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${coupon._id}/discount`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ discountPercentage: discountNum })
      });
      const discountData = await discountRes.json();

      if (limitData.success && expiryData.success && discountData.success) {
        toast.success('Coupon updated successfully');
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(limitData.message || expiryData.message || discountData.message || 'Failed to update coupon');
      }
    } catch (error) {
      toast.error('Server error updating coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md shadow-2xl relative my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#6a9a38]" />
              Edit Coupon
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">{coupon.code} ({coupon.sponsorName})</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">

            {/* Discount Percentage */}
            <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-700">
                  <Tag className="w-3.5 h-3.5 text-[#6a9a38]" />
                  Discount
                </label>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${discountPercentage == 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {discountPercentage == 100 ? '100% Free Pass' : `${discountPercentage}% OFF`}
                </span>
              </div>
              
              <div className="relative">
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
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-900 font-bold text-base focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-sm"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[100, 5, 10, 15, 20, 25, 30, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercentage(pct)}
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      discountPercentage == pct
                        ? 'bg-[#6a9a38] text-white border-[#6a9a38]'
                        : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {pct === 100 ? '100% Free' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Max Uses */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                <Users className="w-4 h-4" />
                Maximum Usage Limit
              </label>
              <input
                type="number"
                min={coupon.usedCount}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-bold focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-sm"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Current usage is {coupon.usedCount}. You cannot set a limit lower than this.
              </p>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                Valid Until (Expires At)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-sm text-sm"
                required
              />
            </div>

          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 px-4 bg-[#6a9a38] hover:bg-[#5c8730] text-white shadow-md hover:shadow-lg rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditCouponModal;
