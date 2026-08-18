"use client";
import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Download, Edit, Trash2, Plus } from 'lucide-react';
import Cookies from 'js-cookie';

import AddDelegateModal from '@/components/AddDelegateModal';
import SponsorshipDelegatesModal from '@/components/SponsorshipDelegatesModal';
import ManualSponsorshipModal from '@/components/ManualSponsorshipModal';

export default function SponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSponsorship, setEditingSponsorship] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [viewingLogo, setViewingLogo] = useState(null);

  const [isAddDelegateModalOpen, setIsAddDelegateModalOpen] = useState(false);
  const [selectedSponsorshipForAddDelegate, setSelectedSponsorshipForAddDelegate] = useState(null);

  const [isViewDelegatesModalOpen, setIsViewDelegatesModalOpen] = useState(false);
  const [selectedSponsorshipForViewDelegates, setSelectedSponsorshipForViewDelegates] = useState(null);

  const [isManualSponsorshipModalOpen, setIsManualSponsorshipModalOpen] = useState(false);

  const [filterRegistrationType, setFilterRegistrationType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsorships`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSponsorships(data.data);
      } else {
        setError(data.message || 'Failed to fetch sponsorships');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterRegistrationType('all');
    setFilterCategory('all');
    setFilterTier('all');
    setSortBy('newest');
  };

  const handleExportCSV = () => {
    if (filteredSponsorships.length === 0) return alert('No data to export');

    const headers = ["S.No.", "Reg. ID", "Reg. Date & Time", "Reg. Type", "Company Name", "GST No.", "Sponsorship Category", "Sponsorship Tier", "Contact Person", "Designation", "Mobile number", "Email", "City", "State/Country", "Pincode", "Address", "Amount", "Status"];

    const rows = filteredSponsorships.map((s, index) => [
      `"${index + 1}"`,
      `"#${s._id.slice(-8).toUpperCase()}"`,
      `"${new Date(s.createdAt).toLocaleString('en-IN')}"`,
      `"${s.registrationType || 'Online Registration'}"`,
      `"${s.companyName || ''}"`,
      `"${s.gstNumber || 'N/A'}"`,
      `"${s.sponsorshipCategory || ''}"`,
      `"${s.sponsorshipTier || s.sponsorshipCategory || 'Standard'}"`,
      `"${s.contactPerson || ''}"`,
      `"${s.designation || 'N/A'}"`,
      `"${s.mobileNumber || ''}"`,
      `"${s.email || ''}"`,
      `"${s.city || ''}"`,
      `"${s.stateCountry || ''}"`,
      `"${s.pinCode || ''}"`,
      `"${s.address || ''}"`,
      `"${s.totalAmount || 0}"`,
      `"${s.status || ''}"`
    ]);

    const csvString = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sponsorships_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportXLS = () => {
    if (filteredSponsorships.length === 0) return alert('No data to export');

    let tableHtml = `<table border="1"><thead><tr>
      <th>S.No.</th><th>Reg. ID</th><th>Reg. Date & Time</th><th>Reg. Type</th>
      <th>Company Name</th><th>GST No.</th><th>Sponsorship Category</th><th>Sponsorship Tier</th>
      <th>Contact Person</th><th>Designation</th><th>Mobile number</th><th>Email</th>
      <th>City</th><th>State/Country</th><th>Pincode</th><th>Address</th><th>Amount</th><th>Status</th>
    </tr></thead><tbody>`;

    filteredSponsorships.forEach((s, idx) => {
      tableHtml += `<tr>
        <td>${idx + 1}</td>
        <td>#${s._id.slice(-8).toUpperCase()}</td>
        <td>${new Date(s.createdAt).toLocaleString('en-IN')}</td>
        <td>${s.registrationType || 'Online Registration'}</td>
        <td>${s.companyName || ''}</td>
        <td>${s.gstNumber || 'N/A'}</td>
        <td>${s.sponsorshipCategory || ''}</td>
        <td>${s.sponsorshipTier || s.sponsorshipCategory || 'Standard'}</td>
        <td>${s.contactPerson || ''}</td>
        <td>${s.designation || 'N/A'}</td>
        <td>${s.mobileNumber || ''}</td>
        <td>${s.email || ''}</td>
        <td>${s.city || ''}</td>
        <td>${s.stateCountry || ''}</td>
        <td>${s.pinCode || ''}</td>
        <td>${s.address || ''}</td>
        <td>₹${s.totalAmount || 0}</td>
        <td>${s.status || ''}</td>
      </tr>`;
    });

    tableHtml += `</tbody></table>`;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sponsorships_export_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateSponsorship = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsorships/${editingSponsorship._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: editingSponsorship.status })
      });
      const data = await res.json();
      if (data.success) {
        setSponsorships(sponsorships.map(s => s._id === editingSponsorship._id ? data.data : s));
        setIsEditModalOpen(false);
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteSponsorship = async (id) => {
    if (!confirm('Are you sure you want to delete this sponsorship?')) return;
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsorships/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSponsorships(sponsorships.filter(s => s._id !== id));
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const filteredSponsorships = sponsorships
    .filter(s => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = (
        (s.companyName || '').toLowerCase().includes(term) ||
        (s.contactPerson || '').toLowerCase().includes(term) ||
        (s.designation || '').toLowerCase().includes(term) ||
        (s.sponsorshipCategory || '').toLowerCase().includes(term) ||
        (s.sponsorshipTier || '').toLowerCase().includes(term) ||
        (s.email || '').toLowerCase().includes(term) ||
        (s.mobileNumber || '').toLowerCase().includes(term) ||
        (s.city || '').toLowerCase().includes(term) ||
        (s.gstNumber || '').toLowerCase().includes(term)
      );

      const matchesRegType = filterRegistrationType === 'all' || 
        (filterRegistrationType === 'Online Registration' && (s.registrationType === 'Online Registration' || !s.registrationType)) ||
        (filterRegistrationType === 'Manual Registration' && s.registrationType === 'Manual Registration');

      const matchesCategory = filterCategory === 'all' || 
        (s.sponsorshipCategory || '').toLowerCase().includes(filterCategory.toLowerCase());

      const matchesTier = filterTier === 'all' || 
        (s.sponsorshipTier || '').toLowerCase().includes(filterTier.toLowerCase()) ||
        (s.sponsorshipCategory || '').toLowerCase().includes(filterTier.toLowerCase());

      return matchesSearch && matchesRegType && matchesCategory && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="p-4 md:p-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-[#6a9a38]" size={20} />
            Sponsorship Bookings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage all sponsorship bookings for Brand R.Comm 2026.
          </p>
        </div>

        {/* Compact Top Action Button */}
        <div>
          <button
            onClick={() => {
              setEditingSponsorship(null);
              setIsManualSponsorshipModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-[#5e8e33] hover:bg-[#4c7727] text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-sm shadow-[#5e8e33]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Plus size={11} className="stroke-[3]" />
            </div>
            <span className="whitespace-nowrap">ADD SPONSORSHIP VIA MANUAL REGISTRATION</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-[#6a9a38]/10 flex items-center justify-center">
              <Briefcase size={14} className="text-[#6a9a38]" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Total Sponsorships</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{sponsorships.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase size={14} className="text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Pending</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{sponsorships.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-xs">₹</span>
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Total Revenue (₹)</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {sponsorships.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Controls & Filter Bar (Matching Design Wireframe) */}
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 w-full custom-scrollbar">
            {/* 1. Search Box */}
            <div className="relative min-w-[200px] max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input 
                type="text" 
                placeholder="Search name, company, email" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-900 bg-white shadow-sm"
              />
            </div>

            {/* 2. All Registration type */}
            <select
              value={filterRegistrationType}
              onChange={(e) => setFilterRegistrationType(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">All Registration type</option>
              <option value="Online Registration">Online Registration</option>
              <option value="Manual Registration">Manual Registration</option>
            </select>

            {/* 3. Sponsorship Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">Sponsorship Category</option>
              <option value="Exclusive">Exclusive</option>
              <option value="General">General</option>
            </select>

            {/* 4. Sponsorship Tier */}
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
            >
              <option value="all">Sponsorship Tier</option>
              <option value="Presented By">Presented By</option>
              <option value="Powered By">Powered By</option>
              <option value="Award Sponsor">Award Sponsor</option>
              <option value="Coffee Table Book Sponsor">Coffee Table Book Sponsor</option>
              <option value="Lanyard Sponsor">Lanyard Sponsor</option>
              <option value="Kit Sponsor">Kit Sponsor</option>
              <option value="Lunch Sponsor">Lunch Sponsor</option>
              <option value="Gala Dinner Sponsor">Gala Dinner Sponsor</option>
              <option value="Agenda Sponsor">Agenda Sponsor</option>
              <option value="Badge Sponsor">Badge Sponsor</option>
              <option value="Memento Sponsor">Memento Sponsor</option>
            </select>

            {/* 5. Reset Filters Button */}
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold border border-gray-300 hover:border-gray-400 rounded-xl bg-white hover:bg-gray-50 text-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>

            {/* Right Group: Export & Sort by */}
            <div className="flex items-center gap-2 ml-auto">
              {/* 6. Export Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Download size={14} />
                  <span>Export</span>
                  <svg className="w-3.5 h-3.5 text-gray-500 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 overflow-hidden">
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-[#6a9a38]/10 hover:text-[#6a9a38] transition-colors cursor-pointer"
                  >
                    CSV
                  </button>
                  <button
                    onClick={handleExportXLS}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-[#6a9a38]/10 hover:text-[#6a9a38] transition-colors border-t border-gray-100 cursor-pointer"
                  >
                    XLS
                  </button>
                </div>
              </div>

              {/* 7. Sort by Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] text-gray-800 bg-white shadow-sm cursor-pointer"
              >
                <option value="newest">Sort by: New to old</option>
                <option value="oldest">Sort by: Old to New</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[80vh] relative custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#6a9a38]/30 border-t-[#6a9a38] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading sponsorships...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
              <button 
                onClick={fetchSponsorships}
                className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredSponsorships.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-lg font-medium text-gray-900">No sponsorships found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-gray-600 relative border-collapse">
              <thead className="text-[11px] font-extrabold text-gray-800 uppercase bg-gray-50/90 border-b border-gray-200 sticky top-0 z-40 shadow-sm tracking-wider">
                <tr>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[50px] max-w-[50px] sticky left-0 top-0 z-50 bg-gray-50 whitespace-nowrap text-center">S.No.</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[100px] max-w-[100px] sticky left-[50px] top-0 z-50 bg-gray-50 whitespace-nowrap shadow-[1px_0_0_0_#e5e7eb]">Reg. ID</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Reg. Date & Time</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Reg. Type</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[180px] max-w-[220px] sticky top-0 bg-gray-50">Company Name</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">GST No.</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Sponsorship Category</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Sponsorship Tier</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-center sticky top-0 bg-gray-50">Company Logo</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Contact Person</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Designation</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Mobile number</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Email</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">City</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">State/Country</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap sticky top-0 bg-gray-50">Pincode</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[200px] max-w-[280px] sticky top-0 bg-gray-50">Address</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-center sticky right-0 top-0 z-50 bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-medium">
                {filteredSponsorships.map((sponsorship, index) => (
                  <tr key={sponsorship._id} className="bg-white hover:bg-gray-50 transition-colors group text-[12px]">
                    {/* 1. S.No. */}
                    <td className="px-3.5 py-3 min-w-[50px] max-w-[50px] sticky left-0 z-20 bg-white group-hover:bg-gray-50 font-bold text-gray-700 text-center">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    {/* 2. Reg. ID */}
                    <td className="px-3.5 py-3 min-w-[100px] max-w-[100px] sticky left-[50px] z-20 bg-white group-hover:bg-gray-50 font-mono font-bold text-brand-dark shadow-[1px_0_0_0_#e5e7eb]">
                      #{sponsorship._id.slice(-8).toUpperCase()}
                    </td>
                    {/* 3. Reg. Date & Time */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-gray-600 font-mono text-[11px]">
                      {new Date(sponsorship.createdAt).toLocaleString('en-IN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </td>
                    {/* 4. Reg. Type */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        sponsorship.registrationType === 'Manual Registration' 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {sponsorship.registrationType || 'Online Registration'}
                      </span>
                    </td>
                    {/* 5. Company Name */}
                    <td className="px-3.5 py-3 min-w-[180px] max-w-[220px] font-bold text-gray-900 truncate" title={sponsorship.companyName}>
                      {sponsorship.companyName}
                    </td>
                    {/* 6. GST No. */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-gray-600 font-mono text-[11px]">
                      {sponsorship.gstNumber || 'N/A'}
                    </td>
                    {/* 7. Sponsorship Category */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                        {sponsorship.sponsorshipCategory}
                      </span>
                    </td>
                    {/* 8. Sponsorship Tier */}
                    <td className="px-3.5 py-3 whitespace-nowrap font-semibold text-gray-800">
                      {sponsorship.sponsorshipTier || sponsorship.sponsorshipCategory || 'Standard'}
                    </td>
                    {/* 9. Company Logo */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-center">
                      {sponsorship.logoUrl ? (
                        <button 
                          onClick={() => setViewingLogo(sponsorship.logoUrl)}
                          className="focus:outline-none focus:ring-2 focus:ring-[#6a9a38] rounded p-0.5 inline-block hover:scale-105 transition-transform"
                          title="View Logo"
                        >
                          <img src={sponsorship.logoUrl} alt="Logo" className="h-7 w-12 object-contain rounded border border-gray-200 bg-white" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-mono">N/A</span>
                      )}
                    </td>
                    {/* 10. Contact Person */}
                    <td className="px-3.5 py-3 whitespace-nowrap font-semibold text-gray-900">
                      {sponsorship.contactPerson}
                    </td>
                    {/* 11. Designation */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-gray-700">
                      {sponsorship.designation || 'N/A'}
                    </td>
                    {/* 12. Mobile number */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-gray-800 font-mono">
                      {sponsorship.mobileNumber}
                    </td>
                    {/* 13. Email */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <a href={`mailto:${sponsorship.email}`} className="text-blue-600 hover:underline font-mono">
                        {sponsorship.email}
                      </a>
                    </td>
                    {/* 14. City */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-gray-700">
                      {sponsorship.city}
                    </td>
                    {/* 15. State/Country */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-gray-700">
                      {sponsorship.stateCountry}
                    </td>
                    {/* 16. Pincode */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-gray-700 font-mono">
                      {sponsorship.pinCode}
                    </td>
                    {/* 17. Address */}
                    <td className="px-3.5 py-3 min-w-[200px] max-w-[280px] text-gray-600 truncate" title={sponsorship.address}>
                      {sponsorship.address}
                    </td>
                    {/* 18. Action */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-center sticky right-0 z-20 bg-white group-hover:bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">
                      <div className="flex items-center justify-center gap-2">
                        {/* Pencil Edit Icon in Cream Pill */}
                        <button 
                          onClick={() => { setEditingSponsorship(sponsorship); setIsManualSponsorshipModalOpen(true); }}
                          className="p-1.5 text-gray-800 bg-[#fdf8ee] border border-amber-200/80 hover:bg-amber-100/60 rounded-full transition-colors shadow-sm cursor-pointer"
                          title="Edit Sponsorship"
                        >
                          <Edit size={14} className="text-gray-800" />
                        </button>

                        {/* Red Pill "Add Delegate" Button (Exact Match to User Screenshot) */}
                        <button
                          onClick={() => {
                            setSelectedSponsorshipForAddDelegate(sponsorship);
                            setIsAddDelegateModalOpen(true);
                          }}
                          className="px-3 py-1 text-[11px] font-extrabold text-white bg-[#c22026] hover:bg-[#a8191e] rounded-full transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                          Add Delegate
                        </button>

                        {/* View Linked Delegates Badge / Button */}
                        <button
                          onClick={() => {
                            setSelectedSponsorshipForViewDelegates(sponsorship);
                            setIsViewDelegatesModalOpen(true);
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap border ${
                            (sponsorship.delegatesCount || 0) > 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                          }`}
                          title="View linked delegates for this sponsor"
                        >
                          Delegates ({sponsorship.delegatesCount || 0})
                        </button>

                        <button 
                          onClick={() => handleDeleteSponsorship(sponsorship._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Delegate Modal for Sponsor */}
      <AddDelegateModal 
        isOpen={isAddDelegateModalOpen}
        onClose={() => {
          setIsAddDelegateModalOpen(false);
          setSelectedSponsorshipForAddDelegate(null);
        }}
        presetSponsorship={selectedSponsorshipForAddDelegate}
        onDelegateAdded={() => {
          fetchSponsorships();
        }}
      />

      {/* View Linked Delegates Modal */}
      <SponsorshipDelegatesModal
        isOpen={isViewDelegatesModalOpen}
        onClose={() => {
          setIsViewDelegatesModalOpen(false);
          setSelectedSponsorshipForViewDelegates(null);
        }}
        sponsorship={selectedSponsorshipForViewDelegates}
      />

      {/* Manual Sponsorship Booking / Edit Modal */}
      <ManualSponsorshipModal
        isOpen={isManualSponsorshipModalOpen}
        onClose={() => {
          setIsManualSponsorshipModalOpen(false);
          setEditingSponsorship(null);
        }}
        onSponsorshipAdded={() => {
          fetchSponsorships();
          setEditingSponsorship(null);
        }}
        editingSponsorship={editingSponsorship}
      />

      {/* Logo Viewer Modal */}
      {viewingLogo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setViewingLogo(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center p-4">
            <div className="absolute top-0 right-0 md:-right-4 flex flex-col gap-3">
              <button 
                onClick={() => setViewingLogo(null)} 
                className="p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-all shadow-lg"
                title="Close Viewer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <a 
                href={viewingLogo}
                download="sponsorship_logo.png"
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-all shadow-lg flex items-center justify-center"
                title="Download Logo"
              >
                <Download size={24} />
              </a>
            </div>
            <img 
              src={viewingLogo} 
              alt="Company Logo Full Size" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-default bg-white"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
