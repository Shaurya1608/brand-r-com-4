"use client";
import React, { useState, useEffect } from 'react';
import { Mic, Search, Download, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speakers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSpeakers(data.data);
      } else {
        setError(data.message || 'Failed to fetch speaker interest enquiries');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpeaker = async (id) => {
    if (!confirm('Are you sure you want to delete this speaker enquiry?')) return;
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speakers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSpeakers(speakers.filter(s => s._id !== id));
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const exportToCSV = () => {
    if (speakers.length === 0) return;
    const headers = ["Full Name", "Designation", "Organization", "Mobile Number", "City", "State/Country", "Pin Code", "Address", "Date"];
    const rows = filteredSpeakers.map(s => [
      `"${s.fullName || ''}"`,
      `"${s.designation || ''}"`,
      `"${s.organization || ''}"`,
      `"${s.mobileNumber || ''}"`,
      `"${s.city || ''}"`,
      `"${s.stateCountry || ''}"`,
      `"${s.pinCode || ''}"`,
      `"${(s.address || '').replace(/"/g, '""')}"`,
      `"${new Date(s.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `speaker_interest_enquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSpeakers = speakers.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mic className="text-[#6a9a38]" size={26} />
            Speaker Interest Enquiries
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Manage speaker enquiries submitted from the website landing page
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            disabled={filteredSpeakers.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main card container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search Bar Header */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, organization, designation, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] transition-all"
            />
          </div>
          <div className="text-xs font-semibold text-gray-500">
            Total Enquiries: <span className="text-gray-900 font-bold">{filteredSpeakers.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[80vh] relative custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#6a9a38]/30 border-t-[#6a9a38] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading speaker enquiries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
              <button 
                onClick={fetchSpeakers}
                className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredSpeakers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mic className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-lg font-medium text-gray-900">No speaker enquiries found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-500 relative">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold min-w-[200px] max-w-[200px] sticky left-0 z-40 bg-gray-50 shadow-[1px_0_0_0_#e5e7eb]">Full Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Designation</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Organization</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Mobile Number</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">City</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">State/Country</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Pin Code</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Full Address</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Date</th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap text-right sticky right-0 z-40 bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSpeakers.map((speaker) => (
                  <tr key={speaker._id} className="bg-white hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-2.5 min-w-[200px] max-w-[200px] sticky left-0 z-20 bg-white group-hover:bg-gray-50 shadow-[1px_0_0_0_#e5e7eb]">
                      <div className="font-semibold text-gray-900 truncate" title={speaker.fullName}>{speaker.fullName}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-700">{speaker.designation}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-900">{speaker.organization}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{speaker.mobileNumber}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{speaker.city}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{speaker.stateCountry}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{speaker.pinCode}</td>
                    <td className="px-4 py-2.5 min-w-[200px] max-w-[300px] truncate" title={speaker.address}>{speaker.address}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">
                      {new Date(speaker.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-right sticky right-0 z-20 bg-white group-hover:bg-gray-50 shadow-[-1px_0_0_0_#e5e7eb]">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDeleteSpeaker(speaker._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

    </div>
  );
}
