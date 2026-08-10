"use client";
import React, { useState, useEffect } from 'react';
import { Award, Search, Download, ExternalLink, FileText, Edit2, UserPlus, X, Globe, Eye, MapPin, Phone, Mail, User, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';
import AddDelegateModal from '../../../components/AddDelegateModal';
import ManualNominationModal from '../../../components/ManualNominationModal';

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
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddDelegateOpen, setIsAddDelegateOpen] = useState(false);
  const [selectedNominationForDelegate, setSelectedNominationForDelegate] = useState(null);
  const [isAddNominationOpen, setIsAddNominationOpen] = useState(false);
  const [editingNomination, setEditingNomination] = useState(null);
  const [deletingNomination, setDeletingNomination] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const confirmDeleteNomination = async () => {
    if (!deletingNomination) return;
    setIsDeleting(true);
    try {
      const token = Cookies.get('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/${deletingNomination.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setNominations(prev => prev.filter(item => item._id !== deletingNomination.id));
        setDeletingNomination(null);
      } else {
        alert(data.message || 'Failed to delete nomination');
      }
    } catch (err) {
      console.error('Error deleting nomination:', err);
      alert('Error deleting nomination');
    } finally {
      setIsDeleting(false);
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
    <div className="p-4 md:p-6 space-y-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
            <Award className="text-[#5e8e33]" size={22} />
            Award Nominations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage all award nominations, view submitted attachments, update statuses and add delegates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingNomination(null);
              setIsAddNominationOpen(true);
            }}
            className="px-4 py-2 bg-[#5e8e33] hover:bg-[#4c7727] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Award size={14} />
            <span>NOMINATIONS MANUAL REGISTRATION</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 rounded-full bg-[#5e8e33]/10 flex items-center justify-center">
              <Award size={13} className="text-[#5e8e33]" />
            </div>
            <h3 className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">Total</h3>
          </div>
          <p className="text-lg font-black text-gray-900">{nominations.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Award size={13} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">Organizations</h3>
          </div>
          <p className="text-lg font-black text-gray-900">{nominations.filter(n => n.applicantType === 'Organization').length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
              <Award size={13} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">Individuals</h3>
          </div>
          <p className="text-lg font-black text-gray-900">{nominations.filter(n => n.applicantType === 'Individual').length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-black text-xs">₹</span>
            </div>
            <h3 className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">Pending</h3>
          </div>
          <p className="text-lg font-black text-gray-900">{nominations.filter(n => n.paymentStatus === 'Pending').length}</p>
        </div>
      </div>

      {/* Control & Filters Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input 
              type="text" 
              placeholder="Search by name, org, or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Registration Type Filter */}
          <select
            value={regTypeFilter}
            onChange={(e) => setRegTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Registration type</option>
            <option value="Online Registration">Online Registration</option>
            <option value="Manual Registration">Manual Registration</option>
          </select>

          {/* Applicant Type Filter */}
          <select
            value={applicantTypeFilter}
            onChange={(e) => setApplicantTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Attendee Category</option>
            <option value="Individual">Individual</option>
            <option value="Organization">Organization</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
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
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Status (All)</option>
            <option value="UNDER REVIEW">UNDER REVIEW</option>
            <option value="WINNER">WINNER</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[620px] relative custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#5e8e33]/30 border-t-[#5e8e33] rounded-full animate-spin mb-3"></div>
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
              <thead className="sticky top-0 z-40 text-[10px] font-extrabold text-gray-700 uppercase bg-gray-100 border-b border-gray-200 shadow-xs tracking-wider">
                <tr>
                  <th scope="col" className="px-3 py-2.5 min-w-[48px] max-w-[48px] sticky left-0 top-0 z-50 bg-gray-100 text-center whitespace-nowrap">S.No.</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[95px] max-w-[95px] sticky left-[48px] top-0 z-50 bg-gray-100 whitespace-nowrap shadow-[1px_0_0_0_#e5e7eb]">Reg. ID</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Reg. Date & Time</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Reg. Type</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[140px] whitespace-nowrap sticky top-0 bg-gray-100">Who will recieve</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Designation</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[160px] sticky top-0 bg-gray-100">Company Name & Website</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Applicant Type</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[160px] sticky top-0 bg-gray-100">Award Category</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Contact No.</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Email ID</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap text-center sticky top-0 bg-gray-100">Summary</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap text-center sticky top-0 bg-gray-100">All attachment</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[180px] sticky top-0 bg-gray-100">Contact Person & Details</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap text-right sticky top-0 bg-gray-100">Amount</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Payment & Type</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap text-center sticky top-0 bg-gray-100">Status</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap text-center sticky right-0 top-0 z-50 bg-gray-100 shadow-[-1px_0_0_0_#e5e7eb]">Action</th>
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
                    <tr key={nomination._id} className="bg-white hover:bg-gray-50 transition-colors group text-[11px]">
                      {/* 1. S.No. */}
                      <td className="px-3 py-2 min-w-[48px] max-w-[48px] sticky left-0 z-20 bg-white group-hover:bg-gray-50 font-bold text-gray-700 text-center">
                        {String(index + 1).padStart(2, '0')}
                      </td>

                      {/* 2. Reg. ID */}
                      <td className="px-3 py-2 min-w-[95px] max-w-[95px] sticky left-[48px] z-20 bg-white group-hover:bg-gray-50 font-mono font-extrabold text-[#5e8e33] shadow-[1px_0_0_0_#e5e7eb]">
                        {regId}
                      </td>

                      {/* 3. Reg. Date & Time */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600 font-medium">
                        {regDateFormatted}
                      </td>

                      {/* 4. Reg. Type */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                          {nomination.registrationType || 'ONLINE'}
                        </span>
                      </td>

                      {/* 5. Who will recieve (Nominee Name) */}
                      <td className="px-3 py-2 min-w-[140px]">
                        <div className="font-extrabold text-gray-900">{nomination.fullName}</div>
                      </td>

                      {/* 6. Designation */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                        {nomination.designation || 'N/A'}
                      </td>

                      {/* 7. Company Name & Website */}
                      <td className="px-3 py-2 min-w-[160px]">
                        <div className="font-bold text-gray-900 truncate max-w-[180px]">{nomination.organization}</div>
                        {nomination.website && (
                          <a 
                            href={nomination.website.startsWith('http') ? nomination.website : `https://${nomination.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-[#5e8e33] hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <Globe size={9} />
                            <span className="truncate max-w-[140px]">{nomination.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                      </td>

                      {/* 8. Applicant Type */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                          nomination.applicantType === 'Organization' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {nomination.applicantType}
                        </span>
                      </td>

                      {/* 9. Award Category */}
                      <td className="px-3 py-2 min-w-[160px]">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200/80 inline-block leading-tight">
                          {nomination.awardCategory}
                        </span>
                      </td>

                      {/* 10. Contact No. */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700 font-mono text-[11px]">
                        {nomination.mobileNumber}
                      </td>

                      {/* 11. Email ID */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700 text-[11px]">
                        {nomination.email}
                      </td>

                      {/* 12. Summary */}
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedSummary(nomination)}
                          className="px-2.5 py-0.5 bg-gray-900 hover:bg-black text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-2xs transition-transform active:scale-95 cursor-pointer"
                        >
                          Read
                        </button>
                      </td>

                      {/* 13. All attachment */}
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedAttachment(nomination)}
                          className="px-2.5 py-0.5 bg-gray-900 hover:bg-black text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-2xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <Eye size={10} />
                          <span>View & Download</span>
                        </button>
                      </td>

                      {/* 14. Contact Person & Details (Sleek Compact 2-Line Snippet + Button) */}
                      <td className="px-3 py-2 min-w-[180px]">
                        <button
                          onClick={() => setSelectedContact(nomination)}
                          className="text-left group/btn w-full p-1.5 rounded-lg hover:bg-gray-100/80 transition-colors cursor-pointer"
                          title="Click to view full contact details"
                        >
                          <p className="font-bold text-gray-900 text-[11px] truncate max-w-[160px] group-hover/btn:text-[#5e8e33]">
                            {nomination.designation || nomination.fullName}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                            <span>{nomination.city || 'N/A'}</span>
                            <span>•</span>
                            <span className="text-[#5e8e33] underline font-sans font-bold">Details</span>
                          </p>
                        </button>
                      </td>

                      {/* 15. Amount */}
                      <td className="px-3 py-2 whitespace-nowrap text-right font-black text-gray-900 text-[11px]">
                        ₹{(nomination.totalAmount || 9440).toLocaleString('en-IN')}
                      </td>

                      {/* 16. Payment & Type */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="space-y-1 flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                              nomination.paymentStatus === 'Paid' 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : nomination.paymentStatus === 'Failed' 
                                ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {nomination.paymentStatus || 'Pending'}
                            </span>
                            <span className="text-[9px] text-gray-400 font-medium">
                              ({nomination.paymentMethod || 'Online (Razorpay)'})
                            </span>
                          </div>
                          {nomination.paymentStatus !== 'Paid' && (
                            <button
                              onClick={async () => {
                                try {
                                  const token = Cookies.get('admin_token');
                                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nominations/${nomination._id}/payment-link`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  });
                                  const data = await res.json();
                                  if (data.success && data.paymentUrl) {
                                    navigator.clipboard.writeText(data.paymentUrl);
                                    alert('Shareable Payment Link copied to clipboard!');
                                  } else {
                                    alert(data.message || 'Failed to generate payment link');
                                  }
                                } catch (err) {
                                  alert('Error generating payment link');
                                }
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#5e8e33] hover:text-[#4c7727] bg-[#5e8e33]/10 hover:bg-[#5e8e33]/20 px-2 py-0.5 rounded-full transition-all border border-[#5e8e33]/20 cursor-pointer w-fit"
                            >
                              Copy Payment Link
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 17. Status Dropdown (Sleek Compact Pill) */}
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <select
                          value={nomination.status || 'UNDER REVIEW'}
                          onChange={(e) => handleStatusChange(nomination._id, e.target.value)}
                          disabled={statusUpdateLoading[nomination._id]}
                          className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border rounded-lg cursor-pointer focus:outline-none transition-all ${
                            nomination.status === 'WINNER'
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs'
                              : nomination.status === 'REJECTED'
                              ? 'bg-rose-500 text-white border-rose-600 shadow-2xs'
                              : nomination.status === 'STATUS'
                              ? 'bg-gray-100 text-gray-700 border-gray-300'
                              : 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                          }`}
                        >
                          <option value="STATUS" className="bg-white text-gray-900">STATUS</option>
                          <option value="UNDER REVIEW" className="bg-white text-amber-800 font-bold">UNDER REVIEW</option>
                          <option value="WINNER" className="bg-white text-emerald-800 font-bold">WINNER</option>
                          <option value="REJECTED" className="bg-white text-rose-800 font-bold">REJECTED</option>
                        </select>
                      </td>

                      {/* 18. Action */}
                      <td className="px-3 py-2 whitespace-nowrap text-center sticky right-0 z-20 bg-white group-hover:bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingNomination(nomination);
                              setIsAddNominationOpen(true);
                            }}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[9px] font-black rounded-full border border-gray-300 shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1"
                            title="Edit Nomination Details"
                          >
                            <Edit2 size={10} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNominationForDelegate(nomination);
                              setIsAddDelegateOpen(true);
                            }}
                            className="px-2.5 py-1 bg-[#800000] hover:bg-[#600000] text-white text-[9px] font-black rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                          >
                            Add Delegate
                          </button>
                          <button
                            onClick={() => setDeletingNomination({ id: nomination._id, name: nomination.fullName || nomination.organization })}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-[9px] font-black rounded-full border border-red-200 shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1"
                            title="Delete Nomination"
                          >
                            <Trash2 size={10} />
                            <span>Delete</span>
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
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
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
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
                    className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={12} />
                    <span>View</span>
                  </a>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No profile document attached.</p>
              )}

              {selectedAttachment.summaryDocumentUrl && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
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
                    className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={12} />
                    <span>View</span>
                  </a>
                </div>
              )}

              {selectedAttachment.supportingDocumentUrl && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-500" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Supporting Document</p>
                      <p className="text-[10px] text-gray-500">Extra Supporting File</p>
                    </div>
                  </div>
                  <a
                    href={selectedAttachment.supportingDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
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

      {/* Full Contact Person & Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <User className="text-[#5e8e33]" size={20} />
              <div>
                <h2 className="text-base font-black text-gray-900">{selectedContact.fullName}</h2>
                <p className="text-xs font-bold text-gray-500">{selectedContact.organization}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <User size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Designation</p>
                  <p className="font-bold text-gray-900">{selectedContact.designation || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Mobile Number</p>
                  <p className="font-bold text-gray-900 font-mono">{selectedContact.mobileNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                  <p className="font-bold text-gray-900">{selectedContact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Full Location & Address</p>
                  <p className="font-semibold text-gray-800">{selectedContact.city}, {selectedContact.state}, {selectedContact.country} - {selectedContact.pinCode}</p>
                  <p className="text-gray-600 mt-0.5">{selectedContact.address}</p>
                </div>
              </div>

              {selectedContact.applicationFilledBy === 'Office Barrier' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-[10px] text-[#5e8e33] font-bold uppercase mb-2">Filled By: Office Barrier</p>
                  <div className="space-y-1.5">
                    <p className="text-xs"><span className="text-gray-500 font-bold">Name:</span> <span className="text-gray-900 font-bold">{selectedContact.fillerName}</span></p>
                    <p className="text-xs"><span className="text-gray-500 font-bold">Designation:</span> <span className="text-gray-900 font-bold">{selectedContact.fillerDesignation}</span></p>
                    <p className="text-xs"><span className="text-gray-500 font-bold">Contact:</span> <span className="text-gray-900 font-bold">{selectedContact.fillerContactNo}</span></p>
                    <p className="text-xs"><span className="text-gray-500 font-bold">Email:</span> <span className="text-gray-900 font-bold">{selectedContact.fillerEmail}</span></p>
                  </div>
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

      {/* Manual Nomination Modal */}
      <ManualNominationModal
        isOpen={isAddNominationOpen}
        onClose={() => {
          setIsAddNominationOpen(false);
          setEditingNomination(null);
        }}
        onNominationAdded={() => {
          fetchNominations();
          setEditingNomination(null);
        }}
        editingNomination={editingNomination}
      />

      {/* Custom Delete Confirmation Modal */}
      {deletingNomination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative text-center animate-in fade-in zoom-in-95 border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Delete Nomination?</h3>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                Are you sure you want to delete the nomination for <span className="font-bold text-gray-900">"{deletingNomination.name}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingNomination(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNomination}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-red-200"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
