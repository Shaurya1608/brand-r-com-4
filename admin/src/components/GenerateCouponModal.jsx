"use client";

import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const GenerateCouponModal = ({ isOpen, onClose, sponsorship, nomination }) => {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  // Form fields
  const [code, setCode] = useState('');
  const [maxUses, setMaxUses] = useState(50);
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  // Source entity details
  const entityId = sponsorship?._id || nomination?._id;
  const entityName = sponsorship?.companyName || nomination?.organizationName || nomination?.fullName || 'Organization';
  const entityType = sponsorship ? 'sponsorships' : 'nominations';

  useEffect(() => {
    if (isOpen) {
      setSuccessData(null);
      setCode('');
      setMaxUses(50);
      setStartsAt(new Date().toISOString().slice(0, 16));
      
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setExpiresAt(nextMonth.toISOString().slice(0, 16));
    }
  }, [isOpen]);

  if (!isOpen || !entityId) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get('admin_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${entityType}/${entityId}/coupons`,
        { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ code, maxUses, startsAt, expiresAt })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessData(data.coupon);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-lg shadow-2xl relative my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Generate Coupon</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successData ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#6a9a38]/10 text-[#6a9a38] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6a9a38]/20 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Coupon Created!</h3>
              <p className="text-sm font-medium text-gray-500">The 100% Free coupon for <strong className="text-gray-800">{entityName}</strong> is ready.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-inner">
                <div>
                  <p className="text-[11px] uppercase tracking-widest font-bold text-gray-500 text-left mb-1">Coupon Code</p>
                  <p className="font-mono text-xl font-bold text-gray-900">{successData.code}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(successData.code, 'Code')}
                  className="p-2.5 bg-white border border-gray-200 hover:border-[#6a9a38] hover:text-[#6a9a38] rounded-lg transition-all shadow-sm text-gray-600"
                  title="Copy Code"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-inner">
                <div className="overflow-hidden">
                  <p className="text-[11px] uppercase tracking-widest font-bold text-gray-500 text-left mb-1">Direct Registration Link</p>
                  <p className="text-[13px] font-medium text-gray-600 truncate pr-4">
                    https://brandrcomm.com/delegate-registration?coupon={successData.code}
                  </p>
                </div>
                <button 
                  onClick={() => copyToClipboard(`https://brandrcomm.com/delegate-registration?coupon=${successData.code}`, 'Link')}
                  className="p-2.5 bg-white border border-gray-200 hover:border-[#6a9a38] hover:text-[#6a9a38] rounded-lg transition-all shadow-sm text-gray-600 shrink-0"
                  title="Copy Link"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl transition-colors font-bold uppercase tracking-wider text-xs mt-6"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Organization</label>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold shadow-inner">
                  {entityName}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Coupon Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-mono font-bold text-lg focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-sm"
                  required
                />
                <p className="text-xs text-gray-400 mt-2 font-medium">You can edit the auto-generated code if you prefer a custom one.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Maximum Uses (Delegates)</label>
                <input
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Starts At</label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Expires At</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-semibold focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] focus:outline-none transition-colors shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

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
                className="flex-[2] py-3 px-4 bg-[#6a9a38] hover:bg-[#5c8730] text-white shadow-md hover:shadow-lg rounded-xl transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
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
