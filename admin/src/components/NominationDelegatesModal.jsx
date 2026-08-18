"use client";

import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Phone, Building, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';

export default function NominationDelegatesModal({ isOpen, onClose, nomination }) {
  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (isOpen && nomination) {
      fetchLinkedDelegates();
    }
  }, [isOpen, nomination]);

  const fetchLinkedDelegates = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/${nomination._id}/delegates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDelegates(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch linked delegates');
      }
    } catch (err) {
      console.error(err);
      setError('Error loading delegates');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !nomination) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto flex flex-col max-h-[90vh] font-sans overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6a9a38]/10 flex items-center justify-center text-[#6a9a38]">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Registered Delegates — {nomination.fullName}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {nomination.awardCategory || 'Nominee'} ({nomination.organization || 'N/A'})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#6a9a38]/30 border-t-[#6a9a38] rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-semibold text-gray-500">Loading nominee delegates...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center">
              {error}
            </div>
          ) : delegates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="mx-auto mb-3 text-gray-300" size={44} />
              <p className="text-sm font-bold text-gray-800">No delegates added yet for this nomination</p>
              <p className="text-xs text-gray-500 mt-1">Click "Add Delegate" in the Nominations table to register free members under this nomination.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {delegates.map((d, index) => (
                <div key={d._id} className="p-4 bg-gray-50/80 border border-gray-200/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#6a9a38]/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-400">#{index + 1}</span>
                      <h4 className="text-sm font-extrabold text-gray-900">{d.fullName}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {d.attendeeCategory || 'SPONSOR'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                        {d.paymentMethod || 'Free'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Building size={12} className="text-gray-400" /> {d.designation} at {d.organization}</span>
                      <span className="flex items-center gap-1"><Mail size={12} className="text-gray-400" /> {d.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} className="text-gray-400" /> {d.mobileNumber}</span>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono font-semibold text-gray-500 flex md:flex-col justify-between items-end gap-1">
                    {d.paymentStatus === 'Pending' ? (
                      <>
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          🟠 Pending
                        </span>
                        <button
                          onClick={async () => {
                            try {
                              const token = Cookies.get('admin_token');
                              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/${d._id}/payment-link`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              const data = await res.json();
                              if (data.success && data.paymentUrl) {
                                navigator.clipboard.writeText(data.paymentUrl);
                                showToast('Shareable Payment Link copied to clipboard!');
                              } else {
                                alert(data.message || 'Failed to generate payment link');
                              }
                            } catch (err) {
                              alert('Error generating payment link');
                            }
                          }}
                          className="px-2 py-0.5 bg-[#5e8e33]/10 hover:bg-[#5e8e33]/20 text-[#5e8e33] border border-[#5e8e33]/20 text-[10px] font-extrabold rounded-full transition-all cursor-pointer"
                        >
                          Copy Payment Link
                        </button>
                      </>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck size={14} /> Confirmed (Paid)
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">
                      {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] bg-[#1a1a1a] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="w-7 h-7 rounded-full bg-[#5e8e33]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#5e8e33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
