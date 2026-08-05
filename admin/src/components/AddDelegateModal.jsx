import React, { useState } from 'react';
import { X, User, Phone, Briefcase, Building2, MapPin, Globe, Map, Hash, Info, Mail } from 'lucide-react';

// Helper for Input fields with icons
const InputField = ({ icon: Icon, label, name, type = "text", placeholder, colSpan = 1, required = true, formData, onChange }) => (
  <div className={`col-span-1 md:col-span-${colSpan}`}>
    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">{label} {required && '*'}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#6a9a38] transition-colors">
        <Icon size={18} />
      </div>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] transition-all"
      />
    </div>
  </div>
);

export default function AddDelegateModal({ isOpen, onClose, onDelegateAdded }) {
  const [formData, setFormData] = useState({
    delegateType: 'indian',
    fullName: '',
    email: '',
    designation: '',
    mobileNumber: '',
    organization: '',
    city: '',
    stateCountry: '',
    pinCode: '',
    gstNumber: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delegates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isManuallyCreated: true })
      });
      
      const data = await res.json();
      
      if (data.success) {
        onDelegateAdded();
        onClose();
        setFormData({
          delegateType: 'indian',
          fullName: '',
          email: '',
          designation: '',
          mobileNumber: '',
          organization: '',
          city: '',
          stateCountry: '',
          pinCode: '',
          gstNumber: '',
          address: ''
        });
      } else {
        setError(data.message || 'Failed to add delegate');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto flex flex-col max-h-[90vh] md:max-h-[85vh] transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Delegate</h3>
            <p className="text-sm text-gray-500 mt-1">Manually register a delegate into the system.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={22} />
          </button>
        </div>
        
        {/* Body */}
        <div className="overflow-y-auto px-6 py-6 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start gap-3">
              <Info className="flex-shrink-0 text-red-500 mt-0.5" size={18} />
              <span>{error}</span>
            </div>
          )}
          
          <form id="addDelegateForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section: Basic Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User size={18} className="text-[#6a9a38]" />
                <h4 className="font-semibold text-gray-800">Personal Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField icon={User} label="Full Name" name="fullName" placeholder="John Doe" formData={formData} onChange={handleChange} />
                <InputField icon={Mail} label="Email Address" name="email" type="email" placeholder="john@example.com" formData={formData} onChange={handleChange} />
                <InputField icon={Phone} label="Mobile Number" name="mobileNumber" placeholder="+91 9876543210" formData={formData} onChange={handleChange} />
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Delegate Type *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#6a9a38] transition-colors">
                      <Globe size={18} />
                    </div>
                    <select
                      name="delegateType"
                      value={formData.delegateType}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/30 focus:border-[#6a9a38] transition-all appearance-none"
                    >
                      <option value="indian">Indian Delegate</option>
                      <option value="foreign">Foreign Delegate</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Professional Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Briefcase size={18} className="text-[#6a9a38]" />
                <h4 className="font-semibold text-gray-800">Professional Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField icon={Briefcase} label="Designation" name="designation" placeholder="e.g. Marketing Director" formData={formData} onChange={handleChange} />
                <InputField icon={Building2} label="Organization" name="organization" placeholder="e.g. Acme Corp" formData={formData} onChange={handleChange} />
              </div>
            </div>

            {/* Section: Location */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <MapPin size={18} className="text-[#6a9a38]" />
                <h4 className="font-semibold text-gray-800">Location</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField icon={MapPin} label="Full Address" name="address" placeholder="123 Business Park..." colSpan={2} formData={formData} onChange={handleChange} />
                <InputField icon={Map} label="City" name="city" placeholder="New Delhi" formData={formData} onChange={handleChange} />
                <InputField icon={Globe} label="State / Country" name="stateCountry" placeholder="Delhi, India" formData={formData} onChange={handleChange} />
                <InputField icon={Hash} label="Pin Code" name="pinCode" placeholder="110001" formData={formData} onChange={handleChange} />
                <InputField icon={Hash} label="Company GST No. (Optional)" name="gstNumber" placeholder="27AAAAA0000A1Z5" required={false} formData={formData} onChange={handleChange} />
              </div>
            </div>

            <div className="bg-[#b68936]/10 border border-[#b68936]/20 rounded-xl p-4 flex items-start gap-3 mt-4">
              <Info className="text-[#b68936] mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-[#8c6522] leading-relaxed">
                By default, this creates a delegate with a <strong>Pending</strong> payment status and <strong>Delegate</strong> role. Once added, you can click "Edit" on the table to manually adjust their payment method or assign special roles (like Awardee, Speaker, etc.).
              </p>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 bg-gray-50/80 rounded-b-2xl sticky bottom-0 z-10 backdrop-blur">
          <button 
            type="button" 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="addDelegateForm"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-2.5 bg-[#6a9a38] hover:bg-[#52792b] text-white text-sm font-bold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-[#6a9a38]/40 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating...' : 'Create Delegate'}
          </button>
        </div>
      </div>

      {/* Global styles for custom scrollbar scoped to this modal if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
      `}} />
    </div>
  );
}
