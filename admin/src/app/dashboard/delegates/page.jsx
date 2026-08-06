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
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [filterDelegateType, setFilterDelegateType] = useState('all');
  const [filterRegistrationSource, setFilterRegistrationSource] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [filterCoupon, setFilterCoupon] = useState('all');

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
  const [limit, setLimit] = useState(10);
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

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterPaymentStatus('all');
    setFilterDelegateType('all');
    setFilterRegistrationSource('all');
    setFilterCategory('all');
    setFilterPaymentMethod('all');
    setFilterCoupon('all');
    setPage(1);
  };

  useEffect(() => {
    fetchDelegates();
  }, [page, limit, searchTerm, filterDelegateType, filterRegistrationSource, filterCategory, filterPaymentStatus, filterPaymentMethod, filterCoupon]);

  const fetchDelegates = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('admin_token');
      const params = new URLSearchParams({
        page,
        limit,
        search: searchTerm,
        delegateType: filterDelegateType,
        registrationSource: filterRegistrationSource,
        attendeeCategory: filterCategory,
        paymentStatus: filterPaymentStatus,
        paymentMethod: filterPaymentMethod,
        hasCoupon: filterCoupon,
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
    if (!bulkUpdateTargetCategory) return alert('Please select a category');
    await handleQuickCategoryChange(bulkUpdateTargetCategory);
  };

  const handleQuickCategoryChange = async (targetCategory) => {
    if (selectedDelegates.length === 0) return;
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
          updates: { attendeeCategory: targetCategory }
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
          gstNumber: editingDelegate.gstNumber,
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

  const handleExportCSV = async () => {
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates?all=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success || !data.data) return alert('Failed to export CSV');

      const headers = ["S.No.", "Reg. ID", "Reg. Date & Time", "Delegate TYPE", "Company GST No.", "Attendee Category", "Name", "Designation", "Organization", "Mobile number", "Email", "City", "State/Country", "Pincode", "Address", "Reg. Type", "Amount", "Payment Status", "Payment Method", "Payment ID", "Coupon Registration"];
      
      const rows = data.data.map((d, index) => [
        `"${index + 1}"`,
        `"#${d._id.slice(-8).toUpperCase()}"`,
        `"${new Date(d.createdAt).toLocaleString('en-IN')}"`,
        `"${d.delegateType || ''}"`,
        `"${(d.gstNumber || '').replace(/"/g, '""')}"`,
        `"${d.attendeeCategory || 'DELEGATE'}"`,
        `"${(d.fullName || '').replace(/"/g, '""')}"`,
        `"${(d.designation || '').replace(/"/g, '""')}"`,
        `"${(d.organization || '').replace(/"/g, '""')}"`,
        `"${(d.mobileNumber || '').replace(/"/g, '""')}"`,
        `"${(d.email || '').replace(/"/g, '""')}"`,
        `"${(d.city || '').replace(/"/g, '""')}"`,
        `"${(d.stateCountry || '').replace(/"/g, '""')}"`,
        `"${(d.pinCode || '').replace(/"/g, '""')}"`,
        `"${(d.address || '').replace(/"/g, '""')}"`,
        `"${d.registrationType || 'Online'}"`,
        `"${d.amountPaid ? (d.delegateType === 'foreign' ? `USD ${d.amountPaid}` : `INR ${d.amountPaid}`) : (d.delegateType === 'foreign' ? 'USD 250 + Tax' : 'INR 7080')}"`,
        `"${d.paymentStatus || ''}"`,
        `"${d.paymentMethod || 'Online'}"`,
        `"${d.razorpayPaymentId || ''}"`,
        `"${d.couponCode || '-'}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `delegates_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Error exporting CSV');
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
        <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start md:self-auto">
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
        {/* Table Controls & Filter Bar */}
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Search Box */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search name, company, email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-900 bg-white shadow-sm"
              />
            </div>

            {/* 2. All payment status */}
            <select
              value={filterPaymentStatus}
              onChange={(e) => {
                setFilterPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">All payment status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed / Invitee</option>
            </select>

            {/* 3. All Delegate type */}
            <select
              value={filterDelegateType}
              onChange={(e) => {
                setFilterDelegateType(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">All Delegate type</option>
              <option value="indian">Indian</option>
              <option value="foreign">International</option>
            </select>

            {/* 4. All Registration type */}
            <select
              value={filterRegistrationSource}
              onChange={(e) => {
                setFilterRegistrationSource(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">All Registration type</option>
              <option value="online">Online Registration</option>
              <option value="manual">Manual Registration</option>
            </select>

            {/* 5. Attendee Category */}
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">Attendee Category</option>
              <option value="DELEGATE">DELEGATE</option>
              <option value="SPEAKER">SPEAKER</option>
              <option value="ORGANIZER">ORGANIZER</option>
              <option value="MEDIA">MEDIA</option>
              <option value="SPONSOR">SPONSOR</option>
              <option value="AWARDEE">AWARDEE</option>
              <option value="AWARD_NOMINEE">AWARD NOMINEE</option>
            </select>

            {/* 6. All payment type */}
            <select
              value={filterPaymentMethod}
              onChange={(e) => {
                setFilterPaymentMethod(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">All payment type</option>
              <option value="Online (Razorpay)">Online (Razorpay)</option>
              <option value="Offline">CASH / Offline</option>
              <option value="UPI">UPI</option>
              <option value="Free">Free</option>
            </select>

            {/* 7. All Coupon Registrations */}
            <select
              value={filterCoupon}
              onChange={(e) => {
                setFilterCoupon(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">All Coupon Registrations</option>
              <option value="yes">With Coupon (#IAP2026)</option>
              <option value="no">Without Coupon</option>
            </select>

            {/* 7. Reset Filters Button */}
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold border border-gray-300 hover:border-gray-400 rounded-xl bg-white hover:bg-gray-50 text-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>

            {/* Action buttons matching exact design wireframe */}
            <div className="flex flex-wrap items-center gap-2.5 ml-auto">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white bg-[#5e8e33] hover:bg-[#4c7727] rounded-xl transition-all shadow-sm shadow-[#5e8e33]/20 hover:shadow-md active:scale-95 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Plus size={11} className="stroke-[3]" />
                </div>
                <span>Add Delegate</span>
              </button>

              <button
                onClick={() => {
                  if (selectedDelegates.length === 0) {
                    alert('Please select one or more delegates using the checkboxes in the table first!');
                  } else {
                    setIsBulkUpdateModalOpen(true);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white bg-[#5e8e33] hover:bg-[#4c7727] rounded-xl transition-all shadow-sm shadow-[#5e8e33]/20 hover:shadow-md active:scale-95 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <UserPlus size={11} className="stroke-[3]" />
                </div>
                <span>Change Category {selectedDelegates.length > 0 && `(${selectedDelegates.length})`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[480px] relative border border-gray-100/50">
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
                <th className="px-4 py-3 min-w-[50px] max-w-[50px] sticky left-[48px] z-30 bg-gray-50/90 whitespace-nowrap">S.No.</th>
                <th className="px-4 py-3 min-w-[100px] max-w-[100px] sticky left-[98px] z-30 bg-gray-50/90">Reg. ID</th>
                <th className="px-4 py-3 min-w-[180px] max-w-[180px] sticky left-[198px] z-30 bg-gray-50/90 shadow-[1px_0_0_0_#e5e7eb] whitespace-nowrap">Name</th>
                <th className="px-4 py-3 min-w-[150px] whitespace-nowrap">Reg. Date & Time</th>
                <th className="px-4 py-3 whitespace-nowrap">Delegate TYPE</th>
                <th className="px-4 py-3 min-w-[140px] whitespace-nowrap">Company GST No.</th>
                <th className="px-4 py-3 whitespace-nowrap">Attendee Category</th>
                <th className="px-4 py-3 whitespace-nowrap">Designation</th>
                <th className="px-4 py-3 whitespace-nowrap">Organization</th>
                <th className="px-4 py-3 whitespace-nowrap">Mobile number</th>
                <th className="px-4 py-3 whitespace-nowrap">Email</th>
                <th className="px-4 py-3 whitespace-nowrap">City</th>
                <th className="px-4 py-3 whitespace-nowrap">State/Country</th>
                <th className="px-4 py-3 whitespace-nowrap">Pincode</th>
                <th className="px-4 py-3 min-w-[200px]">Address</th>
                <th className="px-4 py-3 whitespace-nowrap">Reg. Type</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Amount</th>
                <th className="px-4 py-3 whitespace-nowrap">Payment & Type</th>
                <th className="px-4 py-3 whitespace-nowrap">Coupon Registration</th>
                <th className="px-4 py-3 text-center sticky right-0 z-30 bg-gray-50/90 shadow-[-1px_0_0_0_#e5e7eb]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="21" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#6a9a38] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading delegate registrations...</span>
                    </div>
                  </td>
                </tr>
              ) : delegates.length === 0 ? (
                <tr>
                  <td colSpan="21" className="px-6 py-8 text-center text-gray-500">
                    No delegate registrations found.
                  </td>
                </tr>
              ) : (
                delegates.map((delegate, index) => (
                  <tr key={delegate._id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                    {/* Checkbox */}
                    <td className="px-4 py-2.5 min-w-[48px] max-w-[48px] sticky left-0 z-20 bg-white group-hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={selectedDelegates.includes(delegate._id)} 
                        onChange={() => handleSelect(delegate._id)} 
                        className="rounded border-gray-300 text-[#6a9a38] focus:ring-[#6a9a38] cursor-pointer" 
                      />
                    </td>

                    {/* S.No. */}
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs font-mono text-gray-500 min-w-[50px] max-w-[50px] sticky left-[48px] z-20 bg-white group-hover:bg-gray-50">
                      {(page - 1) * limit + index + 1}
                    </td>

                    {/* Reg. ID */}
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs font-mono text-gray-500 font-medium min-w-[100px] max-w-[100px] sticky left-[98px] z-20 bg-white group-hover:bg-gray-50">
                      #{delegate._id.slice(-8).toUpperCase()}
                    </td>

                    {/* Name (Sticky Fixed) */}
                    <td className="px-4 py-2.5 min-w-[200px] max-w-[220px] sticky left-[198px] z-20 bg-white group-hover:bg-gray-50 shadow-[1px_0_0_0_#e5e7eb]">
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 flex-wrap">
                        <span className="truncate max-w-[120px]" title={delegate.fullName}>{delegate.fullName}</span>
                        {delegate.sponsorshipId || delegate.sponsorshipCompany ? (
                          <span 
                            className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-extrabold uppercase tracking-wider rounded-md inline-flex items-center gap-0.5 shadow-xs" 
                            title={`Registered via Sponsorship Page (${delegate.sponsorshipCompany || delegate.organization})`}
                          >
                            FROM SPONSOR
                          </span>
                        ) : delegate.isManuallyCreated ? (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-wider rounded" title="Manually created by Admin">
                            Manual
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Reg. Date & Time */}
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-600">
                      {new Date(delegate.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>

                    {/* Delegate TYPE */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        delegate.delegateType === 'indian' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {delegate.delegateType}
                      </span>
                    </td>

                    {/* Company GST No. */}
                    <td className="px-4 py-2.5 whitespace-nowrap font-mono text-[11px] uppercase font-medium text-gray-700">
                      {delegate.gstNumber || '-'}
                    </td>

                    {/* Attendee Category */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        delegate.attendeeCategory === 'SPONSOR'
                          ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
                          : delegate.attendeeCategory === 'SPEAKER'
                          ? 'bg-orange-100 text-orange-800 border-orange-300'
                          : delegate.attendeeCategory === 'ORGANIZER'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : delegate.attendeeCategory === 'MEDIA'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : delegate.attendeeCategory === 'AWARDEE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : delegate.attendeeCategory === 'AWARD NOMINEE' || delegate.attendeeCategory === 'AWARD_NOMINEE'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {delegate.attendeeCategory?.replace('_', ' ') || 'DELEGATE'}
                      </span>
                    </td>

                    {/* Designation */}
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.designation}</td>

                    {/* Organization */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span>{delegate.organization}</span>
                      {delegate.sponsorshipCompany && (
                        <span className="ml-1 text-[9px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          Sponsor
                        </span>
                      )}
                    </td>

                    {/* Mobile number */}
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.mobileNumber}</td>

                    {/* Email */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <a href={`mailto:${delegate.email}`} className="text-blue-600 hover:underline">{delegate.email}</a>
                    </td>

                    {/* City */}
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.city}</td>

                    {/* State/Country */}
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.stateCountry}</td>

                    {/* Pincode */}
                    <td className="px-4 py-2.5 whitespace-nowrap">{delegate.pinCode}</td>

                    {/* Address */}
                    <td className="px-4 py-2.5 min-w-[200px] truncate max-w-[300px]" title={delegate.address}>{delegate.address}</td>

                    {/* Reg. Type */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {delegate.sponsorshipId || delegate.sponsorshipCompany ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                          Sponsorship Page
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/50">
                          {delegate.registrationType || 'Online'}
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-2.5 whitespace-nowrap text-right font-semibold text-gray-800">
                      {delegate.amountPaid 
                        ? (delegate.delegateType === 'foreign' ? `USD ${delegate.amountPaid}` : `₹${delegate.amountPaid.toLocaleString('en-IN')}`)
                        : (delegate.delegateType === 'foreign' ? 'USD 250 + Tax' : '₹7,080')
                      }
                    </td>

                    {/* Payment & Type */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            delegate.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                            delegate.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {delegate.paymentStatus}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            ({delegate.paymentMethod || 'Online'})
                          </span>
                        </div>
                        {delegate.razorpayPaymentId && (
                          <span className="text-[9px] text-gray-400 font-mono tracking-tight">
                            ID: {delegate.razorpayPaymentId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Coupon Registration */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {delegate.couponCode ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono rounded">
                          {delegate.couponCode}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2.5 text-center sticky right-0 z-20 bg-white group-hover:bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">
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
                <option value={10}>10</option>
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
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email"
                      value={editingDelegate.email || ''}
                      onChange={(e) => setEditingDelegate({...editingDelegate, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company GST No.</label>
                    <input 
                      type="text"
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      value={editingDelegate.gstNumber || ''}
                      onChange={(e) => setEditingDelegate({...editingDelegate, gstNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
                    />
                  </div>
                </div>
                
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
      {/* Bulk Category Change Modal */}
      {isBulkUpdateModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 font-sans border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5e8e33]/10 flex items-center justify-center text-[#5e8e33]">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Change Attendee Category</h2>
                  <p className="text-xs text-gray-500 font-medium">{selectedDelegates.length} delegate(s) selected</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsBulkUpdateModalOpen(false);
                  setBulkUpdateTargetCategory('');
                }}
                className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select New Attendee Category</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'DELEGATE', label: 'DELEGATE', desc: 'Standard Attendee' },
                  { value: 'SPEAKER', label: 'SPEAKER', desc: 'Keynote / Panel' },
                  { value: 'ORGANIZER', label: 'ORGANIZER', desc: 'Event Host' },
                  { value: 'MEDIA', label: 'MEDIA', desc: 'Press / Media' },
                  { value: 'SPONSOR', label: 'SPONSOR', desc: 'Sponsoring Member' },
                  { value: 'AWARDEE', label: 'AWARDEE', desc: 'Award Winner' },
                  { value: 'AWARD NOMINEE', label: 'AWARD NOMINEE', desc: 'Nominated Candidate' },
                ].map((cat) => {
                  const isSelected = bulkUpdateTargetCategory === cat.value;
                  return (
                    <div
                      key={cat.value}
                      onClick={() => setBulkUpdateTargetCategory(cat.value)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#5e8e33] bg-[#5e8e33]/5 ring-1 ring-[#5e8e33] shadow-xs' 
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-black text-gray-900">{cat.label}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{cat.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-[#5e8e33] bg-[#5e8e33]' : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setIsBulkUpdateModalOpen(false);
                  setBulkUpdateTargetCategory('');
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                disabled={bulkUpdateLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkUpdateCategory}
                disabled={bulkUpdateLoading || !bulkUpdateTargetCategory}
                className="px-5 py-2.5 bg-[#5e8e33] hover:bg-[#4c7727] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {bulkUpdateLoading ? 'Updating Category...' : `Update Category (${selectedDelegates.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Selection Bar */}
      {selectedDelegates.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-md text-white border border-gray-800 shadow-2xl rounded-2xl p-2.5 px-4 flex items-center gap-4 transition-all duration-300">
          <div className="text-xs font-extrabold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#5e8e33] text-white flex items-center justify-center font-mono text-[11px]">
              {selectedDelegates.length}
            </span>
            <span>Delegates Selected</span>
          </div>

          <div className="h-4 w-px bg-white/20"></div>

          <button
            onClick={() => setIsBulkUpdateModalOpen(true)}
            className="px-4 py-2 bg-[#5e8e33] hover:bg-[#4c7727] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus size={14} />
            <span>Change Category</span>
          </button>

          <button
            onClick={() => setSelectedDelegates([])}
            className="text-xs text-gray-400 hover:text-white font-medium underline transition-colors cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      )}

    </div>
  );
}
