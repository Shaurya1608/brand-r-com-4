"use client";
import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Download, Edit, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';

export default function SponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSponsorship, setEditingSponsorship] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [viewingLogo, setViewingLogo] = useState(null);

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

  const filteredSponsorships = sponsorships.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
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
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by company, person, or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] transition-all bg-gray-50 focus:bg-white"
            />
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
                  <th scope="col" className="px-3.5 py-3.5 min-w-[50px] max-w-[50px] sticky left-0 z-40 bg-gray-50 whitespace-nowrap text-center">S.No.</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[100px] max-w-[100px] sticky left-[50px] z-40 bg-gray-50 whitespace-nowrap shadow-[1px_0_0_0_#e5e7eb]">Reg. ID</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Reg. Date & Time</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Reg. Type</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[180px] max-w-[220px]">Company Name</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">GST No.</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Sponsorship Category</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Sponsorship Tier</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-center">Company Logo</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Contact Person</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Designation</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Mobile number</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Email</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">City</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">State/Country</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap">Pincode</th>
                  <th scope="col" className="px-3.5 py-3.5 min-w-[200px] max-w-[280px]">Address</th>
                  <th scope="col" className="px-3.5 py-3.5 whitespace-nowrap text-center sticky right-0 z-40 bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">Action</th>
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => { setEditingSponsorship(sponsorship); setIsEditModalOpen(true); }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Status"
                        >
                          <Edit size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSponsorship(sponsorship._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
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

      {/* Edit Modal */}
      {isEditModalOpen && editingSponsorship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit Sponsorship</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateSponsorship} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={editingSponsorship.status}
                  onChange={(e) => setEditingSponsorship({...editingSponsorship, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updateLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6a9a38] rounded-lg hover:bg-[#52792b] disabled:opacity-50"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
