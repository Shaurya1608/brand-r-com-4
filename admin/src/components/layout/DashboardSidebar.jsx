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
  Sparkles,
  ChevronRight,
  ShieldCheck
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

  if (!mounted) return <div className="w-16 md:w-64 bg-[#182713] flex flex-col h-screen sticky top-0 z-40"></div>;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Delegates', href: '/dashboard/delegates', icon: Users, badge: 'Live' },
    { name: 'Nominations', href: '/dashboard/nominations', icon: Award, badge: '2026' },
    { name: 'Sponsorships', href: '/dashboard/sponsorships', icon: FileText, badge: null },
    { name: 'Speaker Interest', href: '/dashboard/speakers', icon: Mic, badge: null },
  ];

  return (
    <>
      <aside className="w-16 md:w-64 bg-gradient-to-b from-[#1c2e14] via-[#162510] to-[#0f1b0a] text-white flex flex-col h-screen sticky top-0 shadow-2xl z-40 font-sans transition-all duration-300 relative overflow-hidden border-r border-white/10">
        
        {/* Subtle Ambient Background Glows */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-[#5e8e33]/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 -right-12 w-40 h-40 bg-[#5e8e33]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Logo & Header Area */}
        <div className="p-4 relative z-10 border-b border-white/10">
          <div className="hidden md:flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-md">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#5e8e33] to-[#3f6320] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#5e8e33]/30 border border-white/20">
              <img 
                src="/logo/New%20nrc%20logo.png" 
                alt="Brand R.Comm Logo" 
                className="h-5 w-auto object-contain brightness-0 invert" 
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-black text-white leading-tight tracking-tight truncate">
                Brand R.Comm
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[8px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-400/30">
                  EXECUTIVE PANEL
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Icon Logo */}
          <div className="md:hidden flex items-center justify-center h-10 w-10 mx-auto bg-gradient-to-br from-[#5e8e33] to-[#3f6320] rounded-xl shadow-md border border-white/20">
            <Award size={20} className="text-white" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10">
          <div className="px-3 pb-2 hidden md:flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Menu</span>
            <Sparkles size={12} className="text-[#5e8e33]" />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center justify-center md:justify-start gap-3 px-3.5 py-3 rounded-xl text-xs transition-all duration-200 group relative cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#5e8e33] to-[#4c7727] text-white font-black shadow-lg shadow-[#5e8e33]/30 scale-[1.02] border border-white/20' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white font-bold'
                }`}
                title={item.name}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}>
                  <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                </div>
                
                <span className="hidden md:block tracking-tight flex-1 font-bold">{item.name}</span>

                {item.badge && !isActive && (
                  <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-white/10 text-emerald-300 border border-white/15 rounded-md">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="hidden md:block w-1.5 h-4 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}

          {/* Event Quick Info Card in Sidebar */}
          <div className="hidden md:block mt-6 p-3.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300">
              <Calendar size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Summit 2026</span>
            </div>
            <p className="text-[11px] font-bold text-white leading-tight">
              Brand R.Comm Awards
            </p>
            <p className="text-[10px] text-gray-300 font-medium">
              Oct 24-25, 2026 • New Delhi
            </p>
          </div>
        </nav>

        {/* Bottom Profile & Sign Out Footer */}
        <div className="p-3 border-t border-white/10 relative z-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 p-2 bg-white/10 rounded-2xl border border-white/15 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5e8e33] to-[#3f6320] text-white font-black text-xs flex items-center justify-center border border-white/30 shadow-xs">
                  A
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#162510] rounded-full"></span>
              </div>
              <div className="hidden md:flex flex-col min-w-0">
                <span className="text-[11px] font-black text-white truncate">Administrator</span>
                <span className="text-[9px] text-gray-300 font-medium truncate">Snail Integral</span>
              </div>
            </div>

            <button 
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              className="p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-red-500/80 transition-all duration-200 flex-shrink-0 cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 bg-black/50 backdrop-blur-xs transition-opacity">
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
