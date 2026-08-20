"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const EditCouponModal = ({ isOpen, onClose, coupon, onSuccess }) => {
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon && isOpen) {
      setMaxUses(coupon.maxUses || 1);
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
        body: JSON.stringify({ expiresAt: new Date(expiresAt).toISOString() })
      });
      const expiryData = await expiryRes.json();

      if (limitData.success && expiryData.success) {
        toast.success('Coupon updated successfully');
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(limitData.message || expiryData.message || 'Failed to update coupon');
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
              <Edit3Icon className="w-5 h-5 text-[#6a9a38]" />
              Edit Coupon
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">{coupon.code}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            
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
                Expiry Date
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-bold focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-sm"
                required
              />
            </div>

          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 px-4 bg-[#6a9a38] hover:bg-[#5c8730] text-white shadow-md hover:shadow-lg rounded-xl transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

// Internal icon for Edit3 since I didn't import it in standard lucide sometimes
const Edit3Icon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

export default EditCouponModal;
