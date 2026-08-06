"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  FileText, 
  LogOut,
  AlertTriangle,
  Mic,
  Calendar,
  ChevronRight
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    Cookies.remove('admin_token');
    router.push('/');
  };

  if (!mounted) return <div className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 z-40"></div>;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Delegates', href: '/dashboard/delegates', icon: Users, badge: null },
    { name: 'Nominations', href: '/dashboard/nominations', icon: Award, badge: null },
    { name: 'Sponsorships', href: '/dashboard/sponsorships', icon: FileText, badge: null },
    { name: 'Speaker Interest', href: '/dashboard/speakers', icon: Mic, badge: null },
  ];

  return (
    <>
      <aside className="w-16 md:w-64 bg-white text-gray-800 flex flex-col h-screen sticky top-0 shadow-2xs z-40 font-sans transition-all duration-300 border-r border-gray-200/90">
        
        {/* Logo & Header Area */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-3 w-full">
            <div className="h-10 w-full flex items-center justify-start py-1">
              <img 
                src="/logo/brand-r-comm-logo.png" 
                alt="Brand R.Comm Logo" 
                className="h-9 w-auto object-contain" 
              />
            </div>
          </div>

          {/* Mobile Icon Logo */}
          <div className="md:hidden flex items-center justify-center h-10 w-10 mx-auto bg-[#5e8e33]/10 rounded-xl border border-[#5e8e33]/20">
            <img 
              src="/logo/brand-r-comm-logo.png" 
              alt="Brand R.Comm Logo" 
              className="h-6 w-auto object-contain" 
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 hidden md:block">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Navigation</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center justify-center md:justify-start gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group relative cursor-pointer ${
                  isActive 
                    ? 'bg-[#5e8e33]/10 text-[#5e8e33] font-black border border-[#5e8e33]/20 shadow-2xs' 
                    : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 font-bold'
                }`}
                title={item.name}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'text-[#5e8e33]' : 'text-gray-400 group-hover:text-gray-700'
                }`}>
                  <Icon size={18} className="transition-transform duration-150 group-hover:scale-110" />
                </div>
                
                <span className="hidden md:block tracking-tight flex-1">{item.name}</span>

                {isActive && (
                  <div className="hidden md:block w-1.5 h-4 bg-[#5e8e33] rounded-full"></div>
                )}
              </Link>
            );
          })}

          {/* Minimal Event Info Widget */}
          <div className="hidden md:block mt-6 p-3 bg-gray-50/80 rounded-xl border border-gray-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-[#5e8e33]">
              <Calendar size={13} />
              <span className="text-[10px] font-black uppercase tracking-wider">Summit 2026</span>
            </div>
            <p className="text-[11px] font-bold text-gray-900">
              Brand R.Comm Awards
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              Oct 24-25, 2026 • New Delhi
            </p>
          </div>
        </nav>

        {/* Bottom Minimal Profile Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/40">
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#5e8e33]/10 text-[#5e8e33] font-black text-xs flex items-center justify-center border border-[#5e8e33]/20">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white rounded-full"></span>
              </div>
              <div className="hidden md:flex flex-col min-w-0">
                <span className="text-[11px] font-black text-gray-900 truncate">Administrator</span>
                <span className="text-[9px] text-gray-500 font-medium truncate">Snail Integral</span>
              </div>
            </div>

            <button 
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 flex-shrink-0 cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-gray-100">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-600" />
              </div>
              <h3 className="text-base font-black text-gray-900 mb-1.5">Sign Out Confirmation</h3>
              <p className="text-xs text-gray-500 font-medium">
                Are you sure you want to sign out of the Admin Panel? You will need to log in again to access the dashboard.
              </p>
            </div>
            <div className="bg-gray-50/80 px-6 py-3.5 flex items-center justify-end gap-2.5 border-t border-gray-100">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-2xs cursor-pointer"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
