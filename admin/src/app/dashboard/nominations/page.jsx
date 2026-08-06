"use client";
import React, { useState, useEffect } from 'react';
import { Award, Search, Download, ExternalLink, FileText, Edit2, UserPlus, X, Globe, Eye, ChevronDown } from 'lucide-react';
import Cookies from 'js-cookie';
import AddDelegateModal from '../../../components/AddDelegateModal';

export default function NominationsPage() {
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [regTypeFilter, setRegTypeFilter] = useState('ALL');
  const [applicantTypeFilter, setApplicantTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isAddDelegateOpen, setIsAddDelegateOpen] = useState(false);
  const [selectedNominationForDelegate, setSelectedNominationForDelegate] = useState(null);
  const [editingNomination, setEditingNomination] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddNominationOpen, setIsAddNominationOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({});

  useEffect(() => {
    fetchNominations();
  }, []);

  const fetchNominations = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setNominations(data.data);
      } else {
        setError(data.message || 'Failed to fetch nominations');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Status Change Handler
  const handleStatusChange = async (nominationId, newStatus) => {
    try {
      setStatusUpdateLoading(prev => ({ ...prev, [nominationId]: true }));
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/${nominationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setNominations(prev => prev.map(n => n._id === nominationId ? { ...n, status: newStatus } : n));
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status');
    } finally {
      setStatusUpdateLoading(prev => ({ ...prev, [nominationId]: false }));
    }
  };

  // Filtered Nominations
  const filteredNominations = nominations.filter(nom => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (nom.fullName && nom.fullName.toLowerCase().includes(term)) ||
      (nom.organization && nom.organization.toLowerCase().includes(term)) ||
      (nom.awardCategory && nom.awardCategory.toLowerCase().includes(term)) ||
      (nom.email && nom.email.toLowerCase().includes(term)) ||
      (nom.mobileNumber && nom.mobileNumber.toLowerCase().includes(term));

    const matchesPayment = paymentStatusFilter === 'ALL' || nom.paymentStatus === paymentStatusFilter;
    const matchesRegType = regTypeFilter === 'ALL' || (nom.registrationType || 'Online Registration') === regTypeFilter;
    const matchesApplicantType = applicantTypeFilter === 'ALL' || nom.applicantType === applicantTypeFilter;
    const matchesStatus = statusFilter === 'ALL' || nom.status === statusFilter;

    return matchesSearch && matchesPayment && matchesRegType && matchesApplicantType && matchesStatus;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setPaymentStatusFilter('ALL');
    setRegTypeFilter('ALL');
    setApplicantTypeFilter('ALL');
    setStatusFilter('ALL');
  };

  // CSV Export Handler
  const exportCSV = () => {
    if (filteredNominations.length === 0) {
      alert('No nominations available to export');
      return;
    }
    const headers = [
      'S.No.', 'Reg ID', 'Reg Date', 'Reg Type', 'Recipient Name', 'Designation', 
      'Organization', 'Website', 'Applicant Type', 'Award Category', 'Mobile', 'Email', 
      'City', 'State', 'Country', 'Pin Code', 'Address', 'Amount', 'Payment Status', 'Payment Method', 'Status'
    ];

    const rows = filteredNominations.map((n, index) => [
      index + 1,
      `#${n._id.slice(-8).toUpperCase()}`,
      new Date(n.createdAt).toLocaleString(),
      n.registrationType || 'Online Registration',
      `"${n.fullName || ''}"`,
      `"${n.designation || ''}"`,
      `"${n.organization || ''}"`,
      `"${n.website || ''}"`,
      n.applicantType || '',
      `"${n.awardCategory || ''}"`,
      `"${n.mobileNumber || ''}"`,
      `"${n.email || ''}"`,
      `"${n.city || ''}"`,
      `"${n.state || ''}"`,
      `"${n.country || ''}"`,
      `"${n.pinCode || ''}"`,
      `"${n.address || ''}"`,
      n.totalAmount || 9440,
      n.paymentStatus || 'Pending',
      n.paymentMethod || 'Online (Razorpay)',
      n.status || 'UNDER REVIEW'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nominations_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
            <Award className="text-[#5e8e33]" size={22} />
            Award Nominations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage all award nominations, view submitted attachments, update statuses and add delegates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#5e8e33]/10 flex items-center justify-center">
              <Award size={14} className="text-[#5e8e33]" />
            </div>
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Total</h3>
          </div>
          <p className="text-xl font-black text-gray-900">{nominations.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <Award size={14} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Organizations</h3>
          </div>
          <p className="text-xl font-black text-gray-900">{nominations.filter(n => n.applicantType === 'Organization').length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
              <Award size={14} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Individuals</h3>
          </div>
          <p className="text-xl font-black text-gray-900">{nominations.filter(n => n.applicantType === 'Individual').length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-black text-xs">₹</span>
            </div>
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Pending</h3>
          </div>
          <p className="text-xl font-black text-gray-900">{nominations.filter(n => n.paymentStatus === 'Pending').length}</p>
        </div>
      </div>

      {/* Control & Filters Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, org, or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Registration Type Filter */}
          <select
            value={regTypeFilter}
            onChange={(e) => setRegTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Registration type</option>
            <option value="Online Registration">Online Registration</option>
            <option value="Manual Registration">Manual Registration</option>
          </select>

          {/* Applicant Type Filter */}
          <select
            value={applicantTypeFilter}
            onChange={(e) => setApplicantTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Attendee Category</option>
            <option value="Individual">Individual</option>
            <option value="Organization">Organization</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All payment type</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Award Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Status (All)</option>
            <option value="UNDER REVIEW">UNDER REVIEW</option>
            <option value="WINNER">WINNER</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[580px] relative custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#5e8e33]/30 border-t-[#5e8e33] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 text-xs font-medium">Loading award nominations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-xs font-medium">
              <p>{error}</p>
              <button 
                onClick={fetchNominations}
                className="mt-3 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-bold cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredNominations.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Award className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-sm font-bold text-gray-900">No nominations found</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              {/* Sticky Fixed Header */}
              <thead className="sticky top-0 z-40 text-[11px] font-extrabold text-gray-800 uppercase bg-gray-100 border-b border-gray-200 shadow-sm tracking-wider">
                <tr>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[50px] max-w-[50px] sticky left-0 top-0 z-50 bg-gray-100 text-center whitespace-nowrap">S.No.</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[100px] max-w-[100px] sticky left-[50px] top-0 z-50 bg-gray-100 whitespace-nowrap shadow-[1px_0_0_0_#e5e7eb]">Reg. ID</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-100">Reg. Date & Time</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-100">Reg. Type</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[160px] whitespace-nowrap sticky top-0 bg-gray-100">Who will recieve</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-100">Designation</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[180px] sticky top-0 bg-gray-100">Company Name & Website</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-100">Applicant Type</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[180px] sticky top-0 bg-gray-100">Award Category</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-100">Contact No.</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-100">Email ID</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-center sticky top-0 bg-gray-100">Summary</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-center sticky top-0 bg-gray-100">All attachment</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[220px] sticky top-0 bg-gray-100">Contact Person & Details</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-right sticky top-0 bg-gray-100">Amount</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-100">Payment & Type</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-center sticky top-0 bg-gray-100">Status</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-center sticky right-0 top-0 z-50 bg-gray-100 shadow-[-1px_0_0_0_#e5e7eb]">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white font-medium">
                {filteredNominations.map((nomination, index) => {
                  const regId = `#${nomination._id.slice(-8).toUpperCase()}`;
                  const regDateFormatted = new Date(nomination.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });

                  return (
                    <tr key={nomination._id} className="bg-white hover:bg-gray-50/80 transition-colors group text-[12px]">
                      {/* 1. S.No. */}
                      <td className="px-3.5 py-3.5 min-w-[50px] max-w-[50px] sticky left-0 z-20 bg-white group-hover:bg-gray-50/80 font-bold text-gray-700 text-center">
                        {String(index + 1).padStart(2, '0')}
                      </td>

                      {/* 2. Reg. ID */}
                      <td className="px-3.5 py-3.5 min-w-[100px] max-w-[100px] sticky left-[50px] z-20 bg-white group-hover:bg-gray-50/80 font-mono font-extrabold text-[#5e8e33] shadow-[1px_0_0_0_#e5e7eb]">
                        {regId}
                      </td>

                      {/* 3. Reg. Date & Time */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-gray-600 font-medium">
                        {regDateFormatted}
                      </td>

                      {/* 4. Reg. Type */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                          {nomination.registrationType || 'ONLINE'}
                        </span>
                      </td>

                      {/* 5. Who will recieve (Nominee Name) */}
                      <td className="px-3.5 py-3.5 min-w-[160px]">
                        <div className="font-extrabold text-gray-900">{nomination.fullName}</div>
                      </td>

                      {/* 6. Designation */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-gray-700">
                        {nomination.designation || 'N/A'}
                      </td>

                      {/* 7. Company Name & Website */}
                      <td className="px-3.5 py-3.5 min-w-[180px]">
                        <div className="font-bold text-gray-900">{nomination.organization}</div>
                        {nomination.website && (
                          <a 
                            href={nomination.website.startsWith('http') ? nomination.website : `https://${nomination.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#5e8e33] hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Globe size={10} />
                            <span>{nomination.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                      </td>

                      {/* 8. Applicant Type */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          nomination.applicantType === 'Organization' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {nomination.applicantType}
                        </span>
                      </td>

                      {/* 9. Award Category */}
                      <td className="px-3.5 py-3.5 min-w-[180px]">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200/80 inline-block leading-tight">
                          {nomination.awardCategory}
                        </span>
                      </td>

                      {/* 10. Contact No. */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-gray-700 font-mono text-[11px]">
                        {nomination.mobileNumber}
                      </td>

                      {/* 11. Email ID */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-gray-700 text-[11px]">
                        {nomination.email}
                      </td>

                      {/* 12. Summary */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedSummary(nomination)}
                          className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          Read
                        </button>
                      </td>

                      {/* 13. All attachment */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedAttachment(nomination)}
                          className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <Eye size={11} />
                          <span>View & Download</span>
                        </button>
                      </td>

                      {/* 14. Contact Person & Details */}
                      <td className="px-3.5 py-3.5 min-w-[220px]">
                        <div className="text-[11px] space-y-0.5">
                          <p><span className="font-bold text-gray-500">Desig:</span> <span className="font-semibold text-gray-900">{nomination.designation}</span></p>
                          <p><span className="font-bold text-gray-500">Mobile:</span> <span className="font-semibold text-gray-900">{nomination.mobileNumber}</span></p>
                          <p><span className="font-bold text-gray-500">Email:</span> <span className="font-semibold text-gray-900">{nomination.email}</span></p>
                          <p><span className="font-bold text-gray-500">Location:</span> <span className="font-medium text-gray-800">{nomination.city}, {nomination.state}, {nomination.country} - {nomination.pinCode}</span></p>
                          <p><span className="font-bold text-gray-500">Address:</span> <span className="text-gray-600 line-clamp-1">{nomination.address}</span></p>
                        </div>
                      </td>

                      {/* 15. Amount */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-right font-black text-gray-900">
                        ₹{(nomination.totalAmount || 9440).toLocaleString('en-IN')}
                      </td>

                      {/* 16. Payment & Type */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                            nomination.paymentStatus === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : nomination.paymentStatus === 'Failed' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {nomination.paymentStatus || 'Pending'}
                          </span>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {nomination.paymentMethod || 'Online (Razorpay)'}
                          </p>
                        </div>
                      </td>

                      {/* 17. Status Dropdown */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-center">
                        <select
                          value={nomination.status || 'UNDER REVIEW'}
                          onChange={(e) => handleStatusChange(nomination._id, e.target.value)}
                          disabled={statusUpdateLoading[nomination._id]}
                          className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border rounded-xl cursor-pointer focus:outline-none transition-all ${
                            nomination.status === 'WINNER'
                              ? 'bg-green-600 text-white border-green-700'
                              : nomination.status === 'REJECTED'
                              ? 'bg-red-600 text-white border-red-700'
                              : nomination.status === 'STATUS'
                              ? 'bg-gray-100 text-gray-700 border-gray-300'
                              : 'bg-amber-500 text-white border-amber-600'
                          }`}
                        >
                          <option value="STATUS" className="bg-white text-gray-900">STATUS</option>
                          <option value="UNDER REVIEW" className="bg-white text-amber-800 font-bold">UNDER REVIEW</option>
                          <option value="WINNER" className="bg-white text-green-800 font-bold">WINNER</option>
                          <option value="REJECTED" className="bg-white text-red-800 font-bold">REJECTED</option>
                        </select>
                      </td>

                      {/* 18. Action */}
                      <td className="px-3.5 py-3.5 whitespace-nowrap text-center sticky right-0 z-20 bg-white group-hover:bg-gray-50/80 shadow-[-1px_0_0_0_#e5e7eb]">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingNomination(nomination);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                            title="Edit Nomination"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedNominationForDelegate(nomination);
                              setIsAddDelegateOpen(true);
                            }}
                            className="px-2.5 py-1 bg-[#800000] hover:bg-[#600000] text-white text-[10px] font-black rounded-full shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                          >
                            Add Delegate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary View Modal */}
      {selectedSummary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedSummary(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <FileText className="text-[#5e8e33]" size={20} />
              <h2 className="text-base font-black text-gray-900">Nomination Brief Summary</h2>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
              {selectedSummary.briefSummary || 'No text summary provided for this nomination.'}
            </div>

            {selectedSummary.summaryDocumentUrl && (
              <a
                href={selectedSummary.summaryDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Download Summary Document</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Attachments View Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedAttachment(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <h2 className="text-base font-black text-gray-900">Nomination Attachments</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedAttachment.fullName} ({selectedAttachment.organization})
              </p>
            </div>

            <div className="space-y-3">
              {selectedAttachment.profileDocumentUrl ? (
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Profile / Nomination Pitch</p>
                      <p className="text-[10px] text-gray-500">PDF / PPT / DOC</p>
                    </div>
                  </div>
                  <a
                    href={selectedAttachment.profileDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={12} />
                    <span>View</span>
                  </a>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No profile document attached.</p>
              )}

              {selectedAttachment.summaryDocumentUrl && (
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="text-[#5e8e33]" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Summary Attachment</p>
                      <p className="text-[10px] text-gray-500">Supporting Document</p>
                    </div>
                  </div>
                  <a
                    href={selectedAttachment.summaryDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={12} />
                    <span>View</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Delegate Modal */}
      <AddDelegateModal
        isOpen={isAddDelegateOpen}
        onClose={() => {
          setIsAddDelegateOpen(false);
          setSelectedNominationForDelegate(null);
        }}
        onDelegateAdded={() => {
          setIsAddDelegateOpen(false);
          setSelectedNominationForDelegate(null);
        }}
        presetNomination={selectedNominationForDelegate}
      />
    </div>
  );
}
