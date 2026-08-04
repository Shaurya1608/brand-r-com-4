"use client";
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Download, QrCode, Plus, AlertCircle } from 'lucide-react';
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
  
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [bulkUpdateTargetCategory, setBulkUpdateTargetCategory] = useState('');
  const [bulkUpdateLoading, setBulkUpdateLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [stats, setStats] = useState({ total: 0, indian: 0, intl: 0, pending: 0 });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDelegates(delegates.map(d => d._id));
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
  }, [page, limit, searchTerm, filterDelegateType, filterRegistrationType, filterCategory]);

  const fetchDelegates = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('admin_token');
      const params = new URLSearchParams({
        page,
        limit,
        search: searchTerm,
        delegateType: filterDelegateType,
        registrationType: filterRegistrationType,
        attendeeCategory: filterCategory,
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setDelegates(data.data || []);
        if (data.stats) setStats(data.stats);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalFiltered(data.total || 0);
        } else {
          setTotalFiltered(data.data ? data.data.length : 0);
        }
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

  const handleBulkUpdateCategory = async () => {
    setBulkUpdateLoading(true);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates/bulk-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          delegateIds: selectedDelegates,
          updates: { attendeeCategory: bulkUpdateTargetCategory }
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setSelectedDelegates([]);
        fetchDelegates();
        setIsBulkUpdateModalOpen(false);
        setBulkUpdateTargetCategory('');
      } else {
        alert(data.message || 'Failed to update categories');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating categories');
    } finally {
      setBulkUpdateLoading(false);
    }
  };

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
          email: editingDelegate.email,
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
        <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start md:self-auto">
          <Download size={16} />
          Export CSV
        </button>
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
          <p className="text-xl font-bold text-gray-900">{stats.total || delegates.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <UserPlus size={14} className="text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Indian Delegates</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.indian}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
              <UserPlus size={14} className="text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Intl Delegates</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.intl}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-xs">₹</span>
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Pending Payments</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, email, org, mobile..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
              />
            </div>

            <select
              value={filterDelegateType}
              onChange={(e) => {
                setFilterDelegateType(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] text-gray-700 bg-white"
            >
              <option value="all">All Delegate Types</option>
              <option value="indian">Indian Delegates</option>
              <option value="foreign">Intl Delegates</option>
            </select>

            <select
              value={filterRegistrationType}
              onChange={(e) => {
                setFilterRegistrationType(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] text-gray-700 bg-white"
            >
              <option value="all">All Registration Types</option>
              <option value="Online">Online</option>
              <option value="On-Spot">On-Spot</option>
              <option value="Group">Group</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] text-gray-700 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="DELEGATE">Delegate</option>
              <option value="SPEAKER">Speaker</option>
              <option value="SPONSOR">Sponsor</option>
              <option value="VIP">VIP</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {selectedDelegates.length > 0 && (
              <button
                onClick={() => setIsBulkUpdateModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#6a9a38] rounded-lg hover:bg-[#58822d] transition-colors shadow-sm"
              >
                <UserPlus size={14} />
                Assign Category ({selectedDelegates.length})
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#6a9a38] rounded-lg hover:bg-[#58822d] transition-colors shadow-sm"
            >
              <Plus size={14} />
              Add Delegate
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="text-[11px] font-semibold text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 min-w-[48px] max-w-[48px] sticky left-0 z-30 bg-gray-50/90">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={delegates.length > 0 && selectedDelegates.length === delegates.length} 
                    className="rounded border-gray-300 text-[#6a9a38] focus:ring-[#6a9a38] cursor-pointer" 
                  />
                </th>
                <th className="px-4 py-3 min-w-[100px] max-w-[100px] sticky left-[48px] z-30 bg-gray-50/90">Reg ID</th>
                <th className="px-4 py-3 min-w-[110px] max-w-[110px] sticky left-[148px] z-30 bg-gray-50/90">Date</th>
                <th className="px-4 py-3 min-w-[220px] max-w-[220px] sticky left-[258px] z-30 bg-gray-50/90 shadow-[1px_0_0_0_#e5e7eb]">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Mobile Number</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">State / Country</th>
                <th className="px-4 py-3">Pin Code</th>
                <th className="px-4 py-3 min-w-[200px]">Address</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Payment</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="16" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#6a9a38] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading delegate registrations...</span>
                    </div>
                  </td>
                </tr>
              ) : delegates.length === 0 ? (
                <tr>
                  <td colSpan="16" className="px-6 py-8 text-center text-gray-500">
                    No delegate registrations found.
                  </td>
                </tr>
              ) : (
                delegates.map((delegate) => (
                  <tr key={delegate._id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-2.5 min-w-[48px] max-w-[48px] sticky left-0 z-20 bg-white group-hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={selectedDelegates.includes(delegate._id)} 
                        onChange={() => handleSelect(delegate._id)} 
                        className="rounded border-gray-300 text-[#6a9a38] focus:ring-[#6a9a38] cursor-pointer" 
                      />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs font-mono text-gray-500 font-medium min-w-[100px] max-w-[100px] sticky left-[48px] z-20 bg-white group-hover:bg-gray-50">
                      #{delegate._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap min-w-[110px] max-w-[110px] sticky left-[148px] z-20 bg-white group-hover:bg-gray-50">
                      {new Date(delegate.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-2.5 min-w-[220px] max-w-[220px] sticky left-[258px] z-20 bg-white group-hover:bg-gray-50 shadow-[1px_0_0_0_#e5e7eb]">
                      <div className="font-semibold text-gray-900 flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                        {delegate.fullName}
                        {delegate.isManuallyCreated && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-wider rounded" title="Manually created by Admin">
                            Manual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <a href={`mailto:${delegate.email}`} className="text-blue-600 hover:underline">{delegate.email}</a>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.designation}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.organization}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.mobileNumber}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.city}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.stateCountry}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.pinCode}</td>
                    <td className="px-4 py-2.5 min-w-[200px] truncate max-w-[300px]" title={delegate.address}>{delegate.address}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                        delegate.delegateType === 'indian' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {delegate.delegateType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                        {delegate.attendeeCategory?.replace('_', ' ') || 'DELEGATE'}
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

        {/* Pagination Bar */}
        <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-gray-50/50">
          <div>
            Showing <span className="font-semibold text-gray-900">{totalFiltered === 0 ? 0 : (page - 1) * limit + 1}</span> to{' '}
            <span className="font-semibold text-gray-900">{Math.min(page * limit, totalFiltered)}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalFiltered}</span> registrations
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-700 bg-white focus:outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded-md bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-gray-700"
              >
                Previous
              </button>
              <span className="px-3 py-1 font-semibold text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-3 py-1 border border-gray-200 rounded-md bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-gray-700"
              >
                Next
              </button>
            </div>
          </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  value={editingDelegate.email || ''}
                  onChange={(e) => setEditingDelegate({...editingDelegate, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] mb-4"
                />
                
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
      {/* Bulk Update Confirmation Modal */}
      {isBulkUpdateModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-blue-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Confirm Bulk Update</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change the category of <span className="font-bold text-gray-900">{selectedDelegates.length} delegates</span> to <span className="font-bold text-[#6a9a38]">{bulkUpdateTargetCategory}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsBulkUpdateModalOpen(false);
                  setBulkUpdateTargetCategory('');
                }}
                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-lg transition-colors"
                disabled={bulkUpdateLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkUpdateCategory}
                disabled={bulkUpdateLoading}
                className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                {bulkUpdateLoading ? 'Updating...' : 'Yes, Update All'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
