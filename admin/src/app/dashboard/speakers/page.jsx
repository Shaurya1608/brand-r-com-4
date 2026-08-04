"use client";
import React, { useState, useEffect } from 'react';
import { Mic, Search, Download, Edit, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/speaker-interests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSpeakers(data.data);
      } else {
        setError(data.message || 'Failed to fetch speaker interests');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSpeaker = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/speaker-interests/${editingSpeaker._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: editingSpeaker.status })
      });
      const data = await res.json();
      if (data.success) {
        setSpeakers(speakers.map(s => s._id === editingSpeaker._id ? data.data : s));
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

  const handleDeleteSpeaker = async (id) => {
    if (!confirm('Are you sure you want to delete this speaker interest?')) return;
    try {
      const token = Cookies.get('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/speaker-interests/${id}`, {
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

  const filteredSpeakers = speakers.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mic className="text-[#6a9a38]" size={20} />
            Speaker Interests
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage all speaking enquiries for Brand R.Comm 2026.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-[#6a9a38]/10 flex items-center justify-center">
              <Mic size={14} className="text-[#6a9a38]" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Total Interests</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{speakers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <Mic size={14} className="text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Pending Review</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{speakers.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <Mic size={14} className="text-green-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-xs">Reviewed</h3>
          </div>
          <p className="text-xl font-bold text-gray-900">{speakers.filter(s => s.status === 'reviewed').length}</p>
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
              placeholder="Search by name, organization or designation..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38] transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading speaker interests...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-500 bg-red-50">{error}</div>
          ) : filteredSpeakers.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              {searchTerm ? 'No matches found.' : 'No speaker interests received yet.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name & Designation</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Details</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSpeakers.map((speaker) => (
                  <tr key={speaker._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(speaker.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-xs text-gray-500">{new Date(speaker.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{speaker.fullName}</div>
                      <div className="text-xs text-gray-500">{speaker.designation}</div>
                      <div className="text-xs text-[#6a9a38] font-medium">{speaker.organization}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{speaker.mobileNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{speaker.city}</div>
                      <div className="text-xs text-gray-500">{speaker.stateCountry} - {speaker.pinCode}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider
                        ${speaker.status === 'reviewed' ? 'bg-green-100 text-green-700' : 
                          speaker.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                          speaker.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'}`}
                      >
                        {speaker.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingSpeaker(speaker);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Status"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSpeaker(speaker._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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

      {/* Edit Modal */}
      {isEditModalOpen && editingSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Update Status</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateSpeaker}>
              <div className="p-4 md:p-5">
                <p className="text-sm text-gray-600 mb-4">
                  Updating status for <span className="font-semibold text-gray-900">{editingSpeaker.fullName}</span>
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Status</label>
                    <select 
                      value={editingSpeaker.status}
                      onChange={(e) => setEditingSpeaker({...editingSpeaker, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/20 focus:border-[#6a9a38]"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
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
    </div>
  );
}
