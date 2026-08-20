"use client";

import React, { useState, useEffect } from 'react';
import { Ticket, Search, Edit2, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import EditCouponModal from '../../../components/EditCouponModal';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null); // For viewing delegates
  
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${id}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Status updated');
        fetchCoupons();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate and remove this coupon?')) return;
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon removed successfully');
        fetchCoupons();
      }
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const getCouponStatus = (coupon) => {
    if (!coupon.isActive) return 'Deactivated';
    if (coupon.usedCount >= coupon.maxUses) return 'Exhausted';
    if (new Date(coupon.expiresAt) < new Date()) return 'Expired';
    return 'Active';
  };

  // Stats
  const total = coupons.length;
  const active = coupons.filter(c => getCouponStatus(c) === 'Active').length;
  const expired = coupons.filter(c => getCouponStatus(c) === 'Expired').length;
  const deactivated = coupons.filter(c => getCouponStatus(c) === 'Deactivated').length;
  const exhausted = coupons.filter(c => getCouponStatus(c) === 'Exhausted').length;

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sponsorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="text-[#6a9a38]" size={20} />
            Coupon Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage discount codes, usage limits, and sponsor linkages.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <p className="font-medium text-gray-500 text-xs">Total Coupons</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 border-t-4 border-t-[#6a9a38]">
          <p className="font-medium text-gray-500 text-xs">Active Coupons</p>
          <p className="text-xl font-bold text-[#6a9a38] mt-1">{active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 border-t-4 border-t-red-500">
          <p className="font-medium text-gray-500 text-xs">Expired</p>
          <p className="text-xl font-bold text-red-600 mt-1">{expired}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 border-t-4 border-t-gray-500">
          <p className="font-medium text-gray-500 text-xs">Deactivated</p>
          <p className="text-xl font-bold text-gray-600 mt-1">{deactivated}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-5 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input 
              type="text" 
              placeholder="Search code or sponsor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-[#6a9a38]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">Loading coupons...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs font-semibold text-gray-800 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Sponsor</th>
                  <th className="px-4 py-3 text-center">Usage</th>
                  <th className="px-4 py-3">Starts At</th>
                  <th className="px-4 py-3">Expires At</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoupons.map(coupon => {
                  const status = getCouponStatus(coupon);
                  
                  return (
                    <tr key={coupon._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-gray-900">{coupon.code}</td>
                      <td className="px-4 py-3 font-medium">{coupon.sponsorName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${status === 'Exhausted' ? 'text-orange-500' : 'text-gray-900'}`}>
                          {coupon.usedCount}
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-500">{coupon.maxUses}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">{new Date(coupon.startsAt).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-3 text-xs">{new Date(coupon.expiresAt).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-3 text-center">
                        {status === 'Expired' ? (
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">Expired</span>
                        ) : status === 'Exhausted' ? (
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800">Exhausted</span>
                        ) : status === 'Active' ? (
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-[#6a9a38]/20 text-[#5c8730]">Active</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">Deactivated</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(coupon)}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Edit Usage Limit"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(coupon._id)}
                            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                            title={coupon.isActive ? "Deactivate" : "Activate"}
                          >
                            {coupon.isActive ? <XCircle size={16} className="text-gray-500" /> : <CheckCircle size={16} className="text-green-600" />}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Soft Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredCoupons.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">No coupons found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <EditCouponModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        coupon={editingCoupon}
        onSuccess={fetchCoupons}
      />
    </div>
  );
}
