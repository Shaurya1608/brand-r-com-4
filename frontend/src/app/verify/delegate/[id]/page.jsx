"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle, User, Briefcase, Award } from 'lucide-react';

export default function DelegateVerificationPage() {
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const verifyUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.brandrcomm.com/api'}/delegates/verify/${id}`);
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Verification failed');
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to server. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    verifyUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b68936]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-red-500" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Pass</h1>
          <p className="text-gray-500 mb-6">{error || 'This delegate pass could not be verified in our system.'}</p>
        </div>
      </div>
    );
  }

  // Helper for Payment Status styling
  const isPaid = data.paymentStatus === 'Paid';
  const isPending = data.paymentStatus === 'Pending';
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden relative">
        
        {/* Header - Success Banner */}
        <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] px-6 py-10 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 blur-xl"></div>
          
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)] border-4 border-white/20">
            <CheckCircle className="text-white" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Pass Verified</h1>
          <p className="text-gray-300 text-sm">Brand R.Comm Global Summit 2026</p>
        </div>

        {/* Content */}
        <div className="p-8 pb-10">
          
          {/* User Details */}
          <div className="space-y-6">
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400 mt-0.5">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Delegate Name</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">{data.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400 mt-0.5">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Organization</p>
                <p className="text-base font-semibold text-gray-800 leading-tight">{data.organization}</p>
                <p className="text-sm text-gray-500 mt-1">{data.designation}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400 mt-0.5">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Access Level</p>
                <span className="inline-block mt-1 px-3 py-1 bg-[#b68936]/10 text-[#b68936] font-bold text-xs rounded-full uppercase tracking-wider">
                  {data.attendeeCategory || 'DELEGATE'}
                </span>
              </div>
            </div>

          </div>

          <div className="w-full h-px bg-gray-100 my-8"></div>

          {/* Payment Status Block */}
          <div className={`rounded-xl p-5 border ${isPaid ? 'bg-green-50 border-green-100' : isPending ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'}`}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Status</p>
            <div className="flex items-center gap-2">
              {isPaid ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : isPending ? (
                <AlertCircle size={20} className="text-yellow-600" />
              ) : (
                <XCircle size={20} className="text-red-600" />
              )}
              <span className={`font-bold text-lg ${isPaid ? 'text-green-700' : isPending ? 'text-yellow-700' : 'text-red-700'}`}>
                {data.paymentStatus.toUpperCase()}
              </span>
            </div>
            
            {!isPaid && (
              <p className={`text-sm mt-2 font-medium ${isPending ? 'text-yellow-800' : 'text-red-800'}`}>
                Please direct the attendee to the registration desk to complete payment.
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
