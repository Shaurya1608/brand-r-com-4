"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Search, Download, Trash2, Mail, Phone, MapPin, Calendar, BookOpen, Eye, X, Edit2 } from 'lucide-react';
import Cookies from 'js-cookie';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  // Edit Speaker State
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    designation: '',
    organization: '',
    mobileNumber: '',
    email: '',
    city: '',
    stateCountry: '',
    pinCode: '',
    address: '',
    subjectArea: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleEditClick = (speaker) => {
    setEditingSpeaker(speaker);
    setEditFormData({
      fullName: speaker.fullName || '',
      designation: speaker.designation || '',
      organization: speaker.organization || '',
      mobileNumber: speaker.mobileNumber || '',
      email: speaker.email || '',
      city: speaker.city || '',
      stateCountry: speaker.stateCountry || '',
      pinCode: speaker.pinCode || '',
      address: speaker.address || '',
      subjectArea: speaker.subjectArea || ''
    });
    setUpdateError(null);
  };

  const handleUpdateSpeaker = async (e) => {
    e.preventDefault();
    if (!editingSpeaker) return;
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speakers/${editingSpeaker._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        setSpeakers(prev => prev.map(s => s._id === editingSpeaker._id ? data.data : s));
        setEditingSpeaker(null);
      } else {
        setUpdateError(data.message || 'Failed to update speaker enquiry');
      }
    } catch (err) {
      console.error(err);
      setUpdateError('Network error updating speaker enquiry');
    } finally {
      setUpdateLoading(false);
    }
  };

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
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Non-JSON response from server:', text);
        data = { success: false, message: 'Invalid server response' };
      }

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

    const csvString = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `speaker_enquiries_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

                      <td className="px-3 py-2 min-w-[220px] max-w-[320px] font-medium text-gray-800 align-top">
                        {speaker.subjectArea ? (
                          <div className="bg-[#5e8e33]/10 text-[#5e8e33] px-2.5 py-1.5 rounded-md text-[10px] font-bold" title={speaker.subjectArea}>
                            <div className="line-clamp-2 leading-snug">
                              {speaker.subjectArea}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[10px]">No topic specified</span>
                        )}
                      </td>

                      {/* 13. Actions */}
                      <td className="px-3 py-2 whitespace-nowrap text-center sticky right-0 z-20 bg-white group-hover:bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedSpeaker(speaker)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View full details"
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            onClick={() => handleEditClick(speaker)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit enquiry details"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSpeaker(speaker._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete enquiry"
                          >
                            <Trash2 size={15} />
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

      {/* View Details Modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5e8e33]/10 flex items-center justify-center">
                  <Mic className="text-[#5e8e33]" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Speaker Details</h3>
                  <p className="text-xs text-gray-500 font-medium">Submitted on {new Date(selectedSpeaker.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSpeaker(null)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} /> Contact Information
                  </h4>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Full Name</label>
                    <p className="text-sm font-bold text-gray-900">{selectedSpeaker.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Email Address</label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Mail size={14} className="text-gray-400" />
                      <a href={`mailto:${selectedSpeaker.email}`} className="text-sm font-medium text-blue-600 hover:underline">{selectedSpeaker.email}</a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Mobile Number</label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Phone size={14} className="text-gray-400" />
                      <a href={`tel:${selectedSpeaker.mobileNumber}`} className="text-sm font-medium text-blue-600 hover:underline">{selectedSpeaker.mobileNumber}</a>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} /> Professional Details
                  </h4>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Designation</label>
                    <p className="text-sm font-bold text-gray-900">{selectedSpeaker.designation || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Organization</label>
                    <p className="text-sm font-bold text-gray-900">{selectedSpeaker.organization || 'N/A'}</p>
                  </div>
                </div>

                {/* Location Info */}
                <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={12} /> Location Details
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">City</label>
                      <p className="text-sm font-medium text-gray-800">{selectedSpeaker.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">State/Country</label>
                      <p className="text-sm font-medium text-gray-800">{selectedSpeaker.stateCountry || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Pincode</label>
                      <p className="text-sm font-medium text-gray-800">{selectedSpeaker.pinCode || 'N/A'}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Full Address</label>
                      <p className="text-sm font-medium text-gray-800 mt-1">{selectedSpeaker.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Subject Area */}
                <div className="col-span-1 md:col-span-2 space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Mic size={12} /> Proposed Topic
                  </h4>
                  <div className="bg-[#5e8e33]/5 border border-[#5e8e33]/20 rounded-xl p-4">
                    <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedSpeaker.subjectArea || 'No topic specified.'}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setSelectedSpeaker(null)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Speaker Interest Enquiry Modal */}
      {editingSpeaker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative my-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setEditingSpeaker(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Mic className="text-[#5e8e33]" size={22} />
              <div>
                <h2 className="text-lg font-black text-gray-900">Edit Speaker Interest Enquiry 🎙️</h2>
                <p className="text-xs text-gray-500 font-medium">Update speaker details & proposed subject area</p>
              </div>
            </div>

            {updateError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                {updateError}
              </div>
            )}

            <form onSubmit={handleUpdateSpeaker} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.designation}
                    onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.organization}
                    onChange={(e) => setEditFormData({ ...editFormData, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.mobileNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">State / Country *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.stateCountry}
                    onChange={(e) => setEditFormData({ ...editFormData, stateCountry: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.pinCode}
                    onChange={(e) => setEditFormData({ ...editFormData, pinCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Full Address *</label>
                <textarea
                  required
                  rows={2}
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Subject Area / Proposed Topic</label>
                <textarea
                  rows={2}
                  value={editFormData.subjectArea}
                  onChange={(e) => setEditFormData({ ...editFormData, subjectArea: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e8e33]/20 focus:border-[#5e8e33] bg-gray-50/70"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSpeaker(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer text-xs"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-6 py-2.5 bg-[#5e8e33] hover:bg-[#4c7727] text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 text-xs flex items-center gap-2"
                >
                  {updateLoading ? 'Saving...' : 'UPDATE SPEAKER ENQUIRY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
