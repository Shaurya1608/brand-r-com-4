"use client";
import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Download } from 'lucide-react';
import Cookies from 'js-cookie';

export default function SponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredSponsorships = sponsorships.filter(s => 
    s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sponsorshipCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="overflow-x-auto">
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
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-4 py-3 font-semibold text-gray-600 text-sm whitespace-nowrap">Company</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-sm whitespace-nowrap">Category</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-sm whitespace-nowrap">Contact</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-sm whitespace-nowrap">Total Amount</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-sm whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-sm whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSponsorships.map((sponsorship) => (
                  <tr key={sponsorship._id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-gray-900">{sponsorship.companyName}</div>
                      <div className="text-xs text-gray-500 mt-1">GST: {sponsorship.gstNumber || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {sponsorship.sponsorshipCategory}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-sm text-gray-900">{sponsorship.contactPerson}</div>
                      <div className="text-xs text-gray-500">{sponsorship.mobileNumber}</div>
                      <div className="text-xs text-gray-500">{sponsorship.email}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{sponsorship.totalAmount?.toLocaleString('en-IN') || 0}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        sponsorship.status === 'completed' 
                          ? 'bg-green-50 text-green-700 border border-green-100' 
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                      }`}>
                        {sponsorship.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">
                      {new Date(sponsorship.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
