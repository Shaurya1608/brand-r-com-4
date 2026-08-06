"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Search, Download, Trash2, Mail, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';
import Cookies from 'js-cookie';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speakers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSpeakers(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch speaker enquiries');
      }
    } catch (err) {
      console.error('Error fetching speakers:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const handleDeleteSpeaker = async (id) => {
    if (!confirm('Are you sure you want to delete this speaker enquiry?')) return;
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speakers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSpeakers(prev => prev.filter(s => s._id !== id));
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const exportToCSV = () => {
    if (speakers.length === 0) return;
    const headers = ["S.No.", "Enq. Date & Time", "Name", "Designation", "Organization", "Mobile number", "Email", "City", "State/Country", "Pincode", "Address", "*Subject Area which you'll be talk."];
    const rows = filteredSpeakers.map((s, idx) => [
      idx + 1,
      `"${new Date(s.createdAt).toLocaleString()}"`,
      `"${s.fullName || ''}"`,
      `"${s.designation || ''}"`,
      `"${s.organization || ''}"`,
      `"${s.mobileNumber || ''}"`,
      `"${s.email || ''}"`,
      `"${s.city || ''}"`,
      `"${s.stateCountry || ''}"`,
      `"${s.pinCode || ''}"`,
      `"${(s.address || '').replace(/"/g, '""')}"`,
      `"${(s.subjectArea || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `speaker_enquiries_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSpeakers = speakers.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
      (s.fullName && s.fullName.toLowerCase().includes(term)) ||
      (s.organization && s.organization.toLowerCase().includes(term)) ||
      (s.designation && s.designation.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.city && s.city.toLowerCase().includes(term)) ||
      (s.mobileNumber && s.mobileNumber.toLowerCase().includes(term)) ||
      (s.subjectArea && s.subjectArea.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
            <Mic className="text-[#5e8e33]" size={22} />
            Speaker Interest Enquiries
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage speaker interest enquiries submitted from the website landing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            disabled={filteredSpeakers.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Search Bar Header */}
        <div className="p-3 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, topic, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] transition-all"
            />
          </div>
          <div className="text-xs font-semibold text-gray-500">
            Total Enquiries: <span className="text-gray-900 font-black">{filteredSpeakers.length}</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[580px] relative custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="w-6 h-6 border-2 border-[#5e8e33] border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-xs font-medium">Loading speaker enquiries...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p className="text-xs font-bold mb-2">{error}</p>
              <button
                onClick={fetchSpeakers}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredSpeakers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mic className="mx-auto mb-2 text-gray-300" size={36} />
              <p className="text-xs font-bold text-gray-900">No speaker enquiries found</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Try adjusting your search criteria</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead className="sticky top-0 z-40 text-[10px] font-extrabold text-gray-700 uppercase bg-gray-100 border-b border-gray-200 shadow-xs tracking-wider">
                <tr>
                  <th scope="col" className="px-3 py-2.5 min-w-[48px] max-w-[48px] sticky left-0 top-0 z-50 bg-gray-100 text-center whitespace-nowrap">S.No.</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Enq. Date & Time</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[150px] max-w-[180px] sticky left-[48px] top-0 z-50 bg-gray-100 whitespace-nowrap shadow-[1px_0_0_0_#e5e7eb]">Name</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Designation</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[140px] whitespace-nowrap sticky top-0 bg-gray-100">Organization</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Mobile number</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Email</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">City</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">State/Country</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap sticky top-0 bg-gray-100">Pincode</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[180px] sticky top-0 bg-gray-100">Address</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[220px] sticky top-0 bg-gray-100">*Subject Area which you'll be talk.</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap text-center sticky right-0 top-0 z-50 bg-gray-100 shadow-[-1px_0_0_0_#e5e7eb]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-medium text-[11px]">
                {filteredSpeakers.map((speaker, index) => {
                  const enqDateFormatted = new Date(speaker.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });

                  return (
                    <tr key={speaker._id} className="bg-white hover:bg-gray-50 transition-colors group">
                      {/* 1. S.No. */}
                      <td className="px-3 py-2 min-w-[48px] max-w-[48px] sticky left-0 z-20 bg-white group-hover:bg-gray-50 font-bold text-gray-700 text-center">
                        {String(index + 1).padStart(2, '0')}
                      </td>

                      {/* 2. Enq. Date & Time */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-[10px]">
                        {enqDateFormatted}
                      </td>

                      {/* 3. Name */}
                      <td className="px-3 py-2 min-w-[150px] max-w-[180px] sticky left-[48px] z-20 bg-white group-hover:bg-gray-50 font-bold text-gray-900 shadow-[1px_0_0_0_#e5e7eb]">
                        <div className="truncate" title={speaker.fullName}>
                          {speaker.fullName}
                        </div>
                      </td>

                      {/* 4. Designation */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700 font-semibold">
                        {speaker.designation}
                      </td>

                      {/* 5. Organization */}
                      <td className="px-3 py-2 min-w-[140px] text-gray-900 font-extrabold">
                        {speaker.organization}
                      </td>

                      {/* 6. Mobile number */}
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-800 font-bold">
                        {speaker.mobileNumber}
                      </td>

                      {/* 7. Email */}
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-600">
                        {speaker.email || '-'}
                      </td>

                      {/* 8. City */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700 font-medium">
                        {speaker.city}
                      </td>

                      {/* 9. State/Country */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                        {speaker.stateCountry}
                      </td>

                      {/* 10. Pincode */}
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-600">
                        {speaker.pinCode}
                      </td>

                      {/* 11. Address */}
                      <td className="px-3 py-2 min-w-[180px] max-w-[250px] text-gray-600 truncate" title={speaker.address}>
                        {speaker.address}
                      </td>

                      {/* 12. Subject Area */}
                      <td className="px-3 py-2 min-w-[220px] max-w-[320px] font-medium text-gray-800">
                        {speaker.subjectArea ? (
                          <div className="bg-[#5e8e33]/10 text-[#5e8e33] px-2 py-1 rounded-md text-[10px] font-bold line-clamp-2" title={speaker.subjectArea}>
                            {speaker.subjectArea}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[10px]">No topic specified</span>
                        )}
                      </td>

                      {/* 13. Actions */}
                      <td className="px-3 py-2 whitespace-nowrap text-center sticky right-0 z-20 bg-white group-hover:bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">
                        <button 
                          onClick={() => handleDeleteSpeaker(speaker._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete enquiry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
