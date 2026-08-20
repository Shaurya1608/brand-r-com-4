"use client";

import React, { useState } from 'react';
import { X, Copy, Edit3, PauseCircle, PlayCircle, Users, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const CouponDetailsModal = ({ isOpen, onClose, coupon, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !coupon) return null;

  const status = (() => {
    if (!coupon.isActive) return 'Deactivated';
    if (coupon.usedCount >= coupon.maxUses) return 'Exhausted';
    if (new Date(coupon.expiresAt) < new Date()) return 'Expired';
    return 'Active';
  })();

  const usagePercent = Math.min(100, (coupon.usedCount / coupon.maxUses) * 100);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const handleDeactivate = async () => {
    if (!window.confirm(`Are you sure you want to deactivate ${coupon.code}?`)) return;
    setLoading(true);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${coupon._id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon deactivated successfully');
        onStatusChange && onStatusChange();
        onClose();
      } else {
        toast.error(data.message || 'Failed to deactivate');
      }
    } catch (err) {
      toast.error('Failed to deactivate coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[24px] w-full max-w-[420px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-gray-100">
        
        {/* Header - Brand Gradient */}
        <div className="relative px-5 py-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6a9a38] via-emerald-400 to-[#c22026]"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <Activity className="w-5 h-5 text-[#6a9a38]" strokeWidth={2.5} />
              </div>
              Coupon Details
            </h2>
            <button 
              onClick={onClose}
              className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full transition-all text-gray-500 hover:text-gray-800 hover:rotate-90 active:scale-90 shadow-sm"
            >
              <X className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-0.5">Sponsor</p>
              <p className="font-black text-xl text-gray-900 leading-tight">{coupon.sponsorName}</p>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-1">Status</p>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs border ${
                status === 'Active' ? 'bg-[#6a9a38]/10 text-[#5c8730] border-[#6a9a38]/20' :
                status === 'Exhausted' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                status === 'Expired' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  status === 'Active' ? 'bg-[#6a9a38] animate-pulse' :
                  status === 'Exhausted' ? 'bg-orange-500' :
                  status === 'Expired' ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                {status}
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 p-4 rounded-[20px] border border-gray-100">
            <div className="flex justify-between items-end mb-2.5">
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">Usage Progress</p>
              <div className="text-right">
                <p className="text-lg font-black text-gray-900 leading-none">
                  {coupon.usedCount} <span className="text-gray-400 text-sm">/ {coupon.maxUses}</span>
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2.5 overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-700 relative ${
                  status === 'Exhausted' ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-[#7cb342] to-[#6a9a38]'
                }`}
                style={{ width: `${usagePercent}%` }}
              >
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/20"></div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 font-semibold text-right">
              <span className="text-gray-900 font-bold">{coupon.maxUses - coupon.usedCount}</span> delegates remaining
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-[9px] uppercase tracking-widest font-extrabold text-gray-400 mb-0.5">Valid From</p>
              <p className="text-sm font-bold text-gray-800">
                {new Date(coupon.startsAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-white p-3 rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-[9px] uppercase tracking-widest font-extrabold text-gray-400 mb-0.5">Expires On</p>
              <p className="text-sm font-bold text-gray-800">
                {new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6a9a38] to-emerald-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <button 
                onClick={() => copyToClipboard(coupon.code, 'Coupon code')}
                className="relative w-full flex items-center justify-between p-3.5 bg-white border-2 border-dashed border-[#6a9a38]/40 hover:border-[#6a9a38] rounded-xl transition-all"
              >
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-widest font-extrabold text-[#6a9a38] mb-0.5">Coupon Code</p>
                  <p className="font-mono text-lg font-black text-gray-900 tracking-wider">{coupon.code}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#6a9a38]/10 flex items-center justify-center group-hover:bg-[#6a9a38] group-hover:text-white transition-colors text-[#6a9a38]">
                  <Copy className="w-4 h-4" />
                </div>
              </button>
            </div>

            <button 
              onClick={() => copyToClipboard(`https://brandrcomm.com/delegate-registration?coupon=${coupon.code}`, 'Registration link')}
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-xl transition-all group shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
            >
              <div className="text-left overflow-hidden pr-4">
                <p className="text-[9px] uppercase tracking-widest font-extrabold text-gray-500 mb-1">Direct Registration Link</p>
                <p className="text-[11px] font-semibold text-gray-600 truncate">https://brandrcomm.com/delegate-registration?coupon={coupon.code}</p>
              </div>
              <div className="shrink-0 text-gray-400 group-hover:text-gray-700 transition-colors">
                <Copy className="w-4 h-4" />
              </div>
            </button>
          </div>

        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 space-y-2.5">
          {status === 'Active' && (
            <button
              onClick={handleDeactivate}
              disabled={loading}
              className="w-full py-3 px-4 bg-white border-2 border-red-100 hover:bg-red-50 hover:border-red-500 text-red-600 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-sm group active:scale-[0.98]"
            >
              <PauseCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {loading ? 'Deactivating...' : 'Deactivate Coupon'}
            </button>
          )}
          <p className="text-center text-[10px] text-gray-400 font-semibold leading-relaxed px-4">
            For advanced actions (Increase Limit, Change Expiry, View Delegates), use the main <strong className="text-gray-500">Coupons</strong> tab.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CouponDetailsModal;
