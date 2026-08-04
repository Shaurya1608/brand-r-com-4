import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Download, Printer, X } from 'lucide-react';

export default function DelegateIdCardModal({ isOpen, onClose, delegate }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !delegate) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `ID_${delegate.fullName.replace(/\s+/g, '_')}_BrandRComm.png`;
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate QR data (Verification URL)
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://brand-r-com-4.vercel.app';
  const qrData = `${baseUrl}/verify/delegate/${delegate._id}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0 print:backdrop-blur-none">
      
      {/* Action Buttons - Hidden during print */}
      <div className="absolute top-4 right-4 flex gap-2 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg shadow hover:bg-gray-50 transition font-medium"
        >
          <Printer size={18} />
          Print
        </button>
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-[#b68936] text-white rounded-lg shadow hover:bg-[#a3792b] transition font-medium disabled:opacity-50"
        >
          <Download size={18} />
          {downloading ? 'Downloading...' : 'Download Image'}
        </button>
        <button 
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 bg-white text-red-500 rounded-lg shadow hover:bg-red-50 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* ID Card Wrapper */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        style={{ width: '380px', height: '600px' }} // Standard portrait badge ratio approx
      >
        {/* The Card Element we will capture for download */}
        <div ref={cardRef} className="w-full h-full flex flex-col bg-white">
          
          {/* Header / Brand */}
          <div className="bg-[#111827] text-white p-6 pb-8 text-center relative overflow-hidden flex-shrink-0">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '16px 16px'
            }}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Logo placeholder - replace src with actual logo if available */}
              <div className="w-16 h-16 bg-white rounded-xl mb-3 flex items-center justify-center">
                <span className="text-[#b68936] font-black text-2xl">BR</span>
              </div>
              <h1 className="text-xl font-bold tracking-widest text-[#b68936] uppercase mb-1">Brand R.Comm</h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Global Summit 2026</p>
            </div>
            
            {/* Curved bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-white" style={{ borderTopLeftRadius: '100%', borderTopRightRadius: '100%' }}></div>
          </div>

          {/* Attendee Info */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center -mt-2">
            <h2 className="text-2xl font-black text-gray-900 mb-1 max-w-[280px] break-words">
              {delegate.fullName}
            </h2>
            <p className="text-[15px] font-bold text-gray-500 mb-1">
              {delegate.designation}
            </p>
            <p className="text-sm font-semibold text-[#b68936]">
              {delegate.organization}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center pb-6">
            <div className="bg-white p-3 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] mb-4">
              <QRCode 
                value={qrData}
                size={140}
                level="H" // High error correction so logos can be placed or if damaged
                bgColor="#ffffff"
                fgColor="#111827"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-mono">
              ID: {delegate._id.toString().slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Role/Category Footer */}
          <div className="h-16 flex items-center justify-center bg-[#b68936]">
            <span className="text-xl font-black text-white uppercase tracking-[0.2em]">
              {delegate.attendeeCategory || 'DELEGATE'}
            </span>
          </div>
          
        </div>
      </div>

      {/* Print Styles injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed.inset-0.z-\\[60\\] {
            position: absolute;
            left: 0;
            top: 0;
            visibility: visible;
          }
          .fixed.inset-0.z-\\[60\\] * {
            visibility: visible;
          }
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}} />
    </div>
  );
}
