"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Search, Download, Trash2, Mail, Phone, MapPin, Calendar, BookOpen, Eye, X, Edit2 } from 'lucide-react';
import Cookies from 'js-cookie';

export default function CoffeeTablePage() {
  const [coffeeTables, setCoffeeTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoffeeTable, setSelectedCoffeeTable] = useState(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [coffeeTableToDelete, setCoffeeTableToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit CoffeeTable State
  const [editingCoffeeTable, setEditingCoffeeTable] = useState(null);
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
    featureType: '', pagesRequested: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleEditClick = (coffeeTable) => {
    setEditingCoffeeTable(coffeeTable);
    setEditFormData({
      fullName: coffeeTable.fullName || '',
      designation: coffeeTable.designation || '',
      organization: coffeeTable.organization || '',
      mobileNumber: coffeeTable.mobileNumber || '',
      email: coffeeTable.email || '',
      city: coffeeTable.city || '',
      stateCountry: coffeeTable.stateCountry || '',
      pinCode: coffeeTable.pinCode || '',
      address: coffeeTable.address || '',
      featureType: coffeeTable.featureType || '',
      pagesRequested: coffeeTable.pagesRequested || ''
    });
    setUpdateError(null);
  };

  const handleUpdateCoffeeTable = async (e) => {
    e.preventDefault();
    if (!editingCoffeeTable) return;
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coffee-table/${editingCoffeeTable._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        setCoffeeTables(prev => prev.map(s => s._id === editingCoffeeTable._id ? data.data : s));
        setEditingCoffeeTable(null);
      } else {
        setUpdateError(data.message || 'Failed to update coffeeTable enquiry');
      }
    } catch (err) {
      console.error(err);
      setUpdateError('Network error updating coffeeTable enquiry');
    } finally {
      setUpdateLoading(false);
    }
  };

  const fetchCoffeeTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coffee-table`, {
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
        setCoffeeTables(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch coffeeTable enquiries');
      }
    } catch (err) {
      console.error('Error fetching coffeeTables:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoffeeTables();
  }, []);

  const confirmDelete = (coffeeTable) => {
    setCoffeeTableToDelete(coffeeTable);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!coffeeTableToDelete) return;
    setIsDeleting(true);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coffee-table/${coffeeTableToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setCoffeeTables(prev => prev.filter(s => s._id !== coffeeTableToDelete._id));
        setDeleteModalOpen(false);
        setCoffeeTableToDelete(null);
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (coffeeTables.length === 0) return;
    const headers = ["S.No.", "Enq. Date & Time", "Name", "Designation", "Organization", "Mobile number", "Email", "City", "State/Country", "Pincode", "Address", "Feature Type", "Pages Requested"];
    const rows = filteredCoffeeTables.map((s, idx) => [
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
      `"${s.featureType || ''}"`,
      `"${s.pagesRequested || ''}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `coffeeTable_enquiries_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredCoffeeTables = coffeeTables.filter(s => {
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
            CoffeeTable Interest Enquiries
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage coffeeTable interest enquiries submitted from the website landing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            disabled={filteredCoffeeTables.length === 0}
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
            Total Enquiries: <span className="text-gray-900 font-black">{filteredCoffeeTables.length}</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[580px] relative custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="w-6 h-6 border-2 border-[#5e8e33] border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-xs font-medium">Loading coffeeTable enquiries...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p className="text-xs font-bold mb-2">{error}</p>
              <button
                onClick={fetchCoffeeTables}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredCoffeeTables.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mic className="mx-auto mb-2 text-gray-300" size={36} />
              <p className="text-xs font-bold text-gray-900">No coffeeTable enquiries found</p>
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
                  <th scope="col" className="px-3 py-2.5 min-w-[150px] sticky top-0 bg-gray-100">Feature Type</th>
                  <th scope="col" className="px-3 py-2.5 min-w-[150px] sticky top-0 bg-gray-100">Pages Requested</th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap text-center sticky right-0 top-0 z-50 bg-gray-100 shadow-[-1px_0_0_0_#e5e7eb]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-medium text-[11px]">
                {filteredCoffeeTables.map((coffeeTable, index) => {
                  const enqDateFormatted = new Date(coffeeTable.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });

                  return (
                    <tr key={coffeeTable._id} className="bg-white hover:bg-gray-50 transition-colors group">
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
                        <div className="truncate" title={coffeeTable.fullName}>
                          {coffeeTable.fullName}
                        </div>
                      </td>

                      {/* 4. Designation */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700 font-semibold">
                        {coffeeTable.designation}
                      </td>

                      {/* 5. Organization */}
                      <td className="px-3 py-2 min-w-[140px] text-gray-900 font-extrabold">
                        {coffeeTable.organization}
                      </td>

                      {/* 6. Mobile number */}
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-800 font-bold">
                        {coffeeTable.mobileNumber}
                      </td>

                      {/* 7. Email */}
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-600">
                        {coffeeTable.email || '-'}
                      </td>

                      {/* 8. City */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700 font-medium">
                        {coffeeTable.city}
                      </td>

                      {/* 9. State/Country */}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                        {coffeeTable.stateCountry}
                      </td>

                      {/* 10. Pincode */}
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-600">
                        {coffeeTable.pinCode}
                      </td>

                      {/* 11. Address */}
                      <td className="px-3 py-2 min-w-[180px] max-w-[250px] text-gray-600 truncate" title={coffeeTable.address}>
                        {coffeeTable.address}
                      </td>

                      <td className="px-3 py-2 min-w-[150px] max-w-[200px] font-medium text-gray-800 align-top">
                        {coffeeTable.featureType ? (
                          <div className="bg-[#5e8e33]/10 text-[#5e8e33] px-2.5 py-1.5 rounded-md text-[10px] font-bold" title={coffeeTable.featureType}>
                            {coffeeTable.featureType}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[10px]">N/A</span>
                        )}
                      </td>
                      <td className="px-3 py-2 min-w-[150px] max-w-[200px] font-medium text-gray-800 align-top">
                        {coffeeTable.pagesRequested ? (
                          <div className="bg-amber-50 text-amber-700 px-2.5 py-1.5 rounded-md text-[10px] font-bold">
                            {coffeeTable.pagesRequested} Pages
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[10px]">N/A</span>
                        )}
                      </td>

                      {/* 13. Actions */}
                      <td className="px-3 py-2 whitespace-nowrap text-center sticky right-0 z-20 bg-white group-hover:bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedCoffeeTable(coffeeTable)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View full details"
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            onClick={() => handleEditClick(coffeeTable)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit enquiry details"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            onClick={() => confirmDelete(coffeeTable)}
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
      {selectedCoffeeTable && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5e8e33]/10 flex items-center justify-center">
                  <Mic className="text-[#5e8e33]" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">CoffeeTable Details</h3>
                  <p className="text-xs text-gray-500 font-medium">Submitted on {new Date(selectedCoffeeTable.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCoffeeTable(null)}
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
                    <p className="text-sm font-bold text-gray-900">{selectedCoffeeTable.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Email Address</label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Mail size={14} className="text-gray-400" />
                      <a href={`mailto:${selectedCoffeeTable.email}`} className="text-sm font-medium text-blue-600 hover:underline">{selectedCoffeeTable.email}</a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Mobile Number</label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Phone size={14} className="text-gray-400" />
                      <a href={`tel:${selectedCoffeeTable.mobileNumber}`} className="text-sm font-medium text-blue-600 hover:underline">{selectedCoffeeTable.mobileNumber}</a>
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
                    <p className="text-sm font-bold text-gray-900">{selectedCoffeeTable.designation || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Organization</label>
                    <p className="text-sm font-bold text-gray-900">{selectedCoffeeTable.organization || 'N/A'}</p>
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
                      <p className="text-sm font-medium text-gray-800">{selectedCoffeeTable.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">State/Country</label>
                      <p className="text-sm font-medium text-gray-800">{selectedCoffeeTable.stateCountry || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Pincode</label>
                      <p className="text-sm font-medium text-gray-800">{selectedCoffeeTable.pinCode || 'N/A'}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Full Address</label>
                      <p className="text-sm font-medium text-gray-800 mt-1">{selectedCoffeeTable.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Feature Details */}
                <div className="col-span-1 md:col-span-2 space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} /> Feature Details
                  </h4>
                  <div className="bg-[#5e8e33]/5 border border-[#5e8e33]/20 rounded-xl p-4">
                    <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                      Feature Type: {selectedCoffeeTable.featureType || 'N/A'}
                      <br/>
                      Pages Requested: {selectedCoffeeTable.pagesRequested || 'N/A'}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setSelectedCoffeeTable(null)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit CoffeeTable Interest Enquiry Modal */}
      {editingCoffeeTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative my-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setEditingCoffeeTable(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Mic className="text-[#5e8e33]" size={22} />
              <div>
                <h2 className="text-lg font-black text-gray-900">Edit CoffeeTable Interest Enquiry 🎙️</h2>
                <p className="text-xs text-gray-500 font-medium">Update coffeeTable details & proposed subject area</p>
              </div>
            </div>

            {updateError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                {updateError}
              </div>
            )}

            <form onSubmit={handleUpdateCoffeeTable} className="space-y-4 text-xs">
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
                  onClick={() => setEditingCoffeeTable(null)}
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Enquiry</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete the enquiry from <span className="font-bold text-gray-700">{coffeeTableToDelete?.fullName}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setCoffeeTableToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px] cursor-pointer shadow-md text-sm"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
