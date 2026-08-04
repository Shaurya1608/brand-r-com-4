"use client";
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Download, QrCode, Plus } from 'lucide-react';
import Cookies from 'js-cookie';
import DelegateIdCardModal from '@/components/DelegateIdCardModal';
import AddDelegateModal from '@/components/AddDelegateModal';

export default function DelegatesPage() {
  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDelegateType, setFilterDelegateType] = useState('all');
  const [filterRegistrationType, setFilterRegistrationType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingDelegate, setEditingDelegate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const [selectedDelegateForQr, setSelectedDelegateForQr] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDelegates, setSelectedDelegates] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDelegates(filteredDelegates.map(d => d._id));
    } else {
      setSelectedDelegates([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedDelegates.includes(id)) {
      setSelectedDelegates(selectedDelegates.filter(d => d !== id));
    } else {
      setSelectedDelegates([...selectedDelegates, id]);
    }
  };

  useEffect(() => {
    fetchDelegates();
  }, []);

  const fetchDelegates = async () => {
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setDelegates(data.data);
      } else {
        setError(data.message || 'Failed to fetch delegates');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDelegates = delegates.filter(del => {
    const matchesSearch = del.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          del.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          del.mobileNumber.includes(searchTerm);
    const matchesDelegateType = filterDelegateType === 'all' || del.delegateType === filterDelegateType;
    const matchesRegistrationType = filterRegistrationType === 'all' || del.registrationType === filterRegistrationType;
    const matchesCategory = filterCategory === 'all' || del.attendeeCategory === filterCategory;
    
    return matchesSearch && matchesDelegateType && matchesRegistrationType && matchesCategory;
  });

  const handleUpdateDelegate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/${editingDelegate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editingDelegate.status,
          paymentStatus: editingDelegate.paymentStatus,
          registrationType: editingDelegate.registrationType,
          paymentMethod: editingDelegate.paymentMethod,
          attendeeCategory: editingDelegate.attendeeCategory,
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setDelegates(delegates.map(d => d._id === editingDelegate._id ? data.data : d));
        setIsEditModalOpen(false);
      } else {
        alert(data.message || 'Failed to update delegate');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating delegate');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="text-[#6a9a38]" size={20} />
            Delegate Registrations
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage all delegate registrations for Brand R.Comm 2026.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-[#6a9a38]/10 flex items-center justify-center">
              <UserPlus size={14} className="text-[#6a9a38]" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Total Registrations</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{delegates.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <UserPlus size={14} className="text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Indian Delegates</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{delegates.filter(d => d.delegateType === 'indian').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
              <UserPlus size={14} className="text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Intl Delegates</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{delegates.filter(d => d.delegateType === 'foreign').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-xs">₹</span>
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Pending Payments</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{delegates.filter(d => d.paymentStatus === 'Pending').length}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, org, or mobile..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            <select
              value={filterDelegateType}
              onChange={(e) => setFilterDelegateType(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] transition-all"
            >
              <option value="all">All Delegate Types</option>
              <option value="indian">Indian</option>
              <option value="foreign">Foreign</option>
            </select>
            <select
              value={filterRegistrationType}
              onChange={(e) => setFilterRegistrationType(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] transition-all"
            >
              <option value="all">All Registration Types</option>
              <option value="Online">Online</option>
              <option value="On-Spot">On-Spot</option>
              <option value="Group">Group</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] transition-all"
            >
              <option value="all">All Categories</option>
              <option value="DELEGATE">Delegate</option>
              <option value="SPEAKER">Speaker</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="SPONSOR">Sponsor</option>
              <option value="MEDIA">Media</option>
              <option value="AWARDEE">Awardee</option>
              <option value="AWARD_NOMINEE">Award Nominee</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6a9a38] border border-transparent rounded-lg hover:bg-[#52792b] transition-colors"
            >
              <Plus size={16} />
              Add Delegate
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={filteredDelegates.length > 0 && selectedDelegates.length === filteredDelegates.length} 
                    className="rounded border-gray-300 text-[#6a9a38] focus:ring-[#6a9a38] cursor-pointer" 
                  />
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">Reg ID</th>
                <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                <th scope="col" className="px-4 py-3 font-semibold">Name & Org</th>
                <th scope="col" className="px-4 py-3 font-semibold">Type</th>
                <th scope="col" className="px-4 py-3 font-semibold">Contact</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Payment</th>
                <th scope="col" className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6a9a38]"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredDelegates.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    No delegate registrations found.
                  </td>
                </tr>
              ) : (
                filteredDelegates.map((delegate) => (
                  <tr key={delegate._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-2.5">
                      <input 
                        type="checkbox" 
                        checked={selectedDelegates.includes(delegate._id)} 
                        onChange={() => handleSelect(delegate._id)} 
                        className="rounded border-gray-300 text-[#6a9a38] focus:ring-[#6a9a38] cursor-pointer" 
                      />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs font-mono text-gray-500 font-medium">
                      #{delegate._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {new Date(delegate.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {delegate.fullName}
                        {delegate.isManuallyCreated && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-wider rounded" title="Manually created by Admin">
                            Manual
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{delegate.designation} at {delegate.organization}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        delegate.delegateType === 'indian' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {delegate.delegateType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div>{delegate.mobileNumber}</div>
                      <div className="text-xs text-gray-400">{delegate.city}, {delegate.stateCountry}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        delegate.status === 'approved' ? 'bg-green-100 text-green-700' :
                        delegate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {delegate.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          delegate.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                          delegate.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {delegate.paymentStatus}
                        </span>
                        {delegate.paymentStatus === 'Paid' && delegate.amountPaid && (
                          <span className="text-[12px] font-bold text-gray-700">
                            ₹{delegate.amountPaid.toLocaleString('en-IN')}
                          </span>
                        )}
                        {delegate.razorpayPaymentId && (
                          <span className="text-[9px] text-gray-400 font-mono tracking-tight">
                            {delegate.razorpayPaymentId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedDelegateForQr(delegate);
                            setIsQrModalOpen(true);
                          }}
                          className="text-[#6a9a38] hover:text-[#52792b] transition-colors p-1"
                          title="Show QR Code"
                        >
                          <QrCode size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingDelegate(delegate);
                            setIsEditModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-gray-900 transition-colors text-xs underline"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit Delegate</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateDelegate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={editingDelegate.status}
                  onChange={(e) => setEditingDelegate({...editingDelegate, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select 
                    value={editingDelegate.paymentStatus}
                    onChange={(e) => setEditingDelegate({...editingDelegate, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select 
                    value={editingDelegate.paymentMethod || 'Online'}
                    onChange={(e) => setEditingDelegate({...editingDelegate, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
                  >
                    <option value="Online">Online</option>
                    <option value="Online (Razorpay)">Online (Razorpay)</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                  <select 
                    value={editingDelegate.registrationType || 'Online'}
                    onChange={(e) => setEditingDelegate({...editingDelegate, registrationType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] text-blue-600 bg-blue-50/30"
                  >
                    <option value="Online">Online</option>
                    <option value="On-Spot">On-Spot</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attendee Category</label>
                  <select 
                    value={editingDelegate.attendeeCategory || 'DELEGATE'}
                    onChange={(e) => setEditingDelegate({...editingDelegate, attendeeCategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
                  >
                    <option value="DELEGATE">Delegate</option>
                    <option value="SPEAKER">Speaker</option>
                    <option value="ORGANIZER">Organizer</option>
                    <option value="SPONSOR">Sponsor</option>
                    <option value="MEDIA">Media</option>
                    <option value="AWARDEE">Awardee</option>
                    <option value="AWARD_NOMINEE">Award Nominee</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-start gap-3 border-t border-gray-100 mt-6">
                <button 
                  type="submit" 
                  disabled={updateLoading}
                  className="px-5 py-2 bg-[#6a9a38] hover:bg-[#52792b] text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-lg transition-colors shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code / ID Card Modal */}
      <DelegateIdCardModal 
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        delegate={selectedDelegateForQr}
      />

      {/* Add Delegate Modal */}
      <AddDelegateModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDelegateAdded={() => {
          fetchDelegates();
        }}
      />
    </div>
  );
}
