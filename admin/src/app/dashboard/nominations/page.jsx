"use client";
import React, { useState, useEffect } from 'react';
import { Award, Search, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function NominationsPage() {
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNomination, setEditingNomination] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchNominations();
  }, []);

  const fetchNominations = async () => {
    try {
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

  const filteredNominations = nominations.filter(nom => 
    nom.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nom.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nom.awardCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateNomination = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      // In the future, you can implement an update endpoint for nominations
      // For now, this is a placeholder if you decide to add PUT /api/nominations/:id
      alert('Update functionality coming soon');
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error updating nomination');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="text-brand-primary" />
            Award Nominations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all award nominations and view supporting documents.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <Award size={16} className="text-brand-primary" />
            </div>
            <h3 className="font-medium text-gray-500 text-sm">Total Nominations</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nominations.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Award size={16} className="text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-sm">Organizations</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nominations.filter(n => n.applicantType === 'Organization').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Award size={16} className="text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-500 text-sm">Individuals</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nominations.filter(n => n.applicantType === 'Individual').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-sm">₹</span>
            </div>
            <h3 className="font-medium text-gray-500 text-sm">Pending Payments</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nominations.filter(n => n.paymentStatus === 'Pending').length}</p>
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
              placeholder="Search by name, org, or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-gray-50 focus:bg-white"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                <th scope="col" className="px-6 py-4 font-semibold">Applicant</th>
                <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                <th scope="col" className="px-6 py-4 font-semibold">Organization</th>
                <th scope="col" className="px-6 py-4 font-semibold">Document</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Payment</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredNominations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No nominations found.
                  </td>
                </tr>
              ) : (
                filteredNominations.map((nomination) => (
                  <tr key={nomination._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(nomination.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{nomination.fullName}</div>
                      <div className="text-xs text-gray-500">{nomination.designation}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700">
                        {nomination.awardCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{nomination.organization}</div>
                      <div className="text-xs text-gray-500">{nomination.applicantType}</div>
                    </td>
                    <td className="px-6 py-4">
                      {nomination.documentUrl && (
                        <button 
                          onClick={() => {
                            setSelectedImage(nomination.documentUrl);
                            setIsImageModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
                        >
                          <ImageIcon size={14} />
                          View Logo
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          nomination.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                          nomination.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {nomination.paymentStatus}
                        </span>
                        {nomination.paymentMethod && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            {nomination.paymentMethod}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setIsImageModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Uploaded Document</h3>
              <div className="flex gap-2">
                <a 
                  href={selectedImage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink size={18} />
                </a>
                <button 
                  onClick={() => setIsImageModalOpen(false)} 
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 flex items-center justify-center bg-gray-50 min-h-[300px]">
              {selectedImage ? (
                <div className="relative w-full h-[400px]">
                  <Image 
                    src={selectedImage} 
                    alt="Document Preview" 
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
