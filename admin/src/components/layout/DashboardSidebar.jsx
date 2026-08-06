"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  FileText, 
  Settings, 
  LogOut,
  AlertTriangle,
  UserPlus,
  Mic
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

  if (!mounted) return <div className="w-16 md:w-56 bg-[#6a9a38] flex flex-col h-screen sticky top-0 shadow-lg z-40"></div>;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Delegates', href: '/dashboard/delegates', icon: Users },
    { name: 'Nominations', href: '/dashboard/nominations', icon: Award },
    { name: 'Sponsorships', href: '/dashboard/sponsorships', icon: FileText },
    { name: 'Speaker Interest', href: '/dashboard/speakers', icon: Mic },
  ];

  return (
    <>
      <aside className="w-16 md:w-60 bg-gradient-to-b from-[#5e8e33] via-[#527d29] to-[#456b21] text-white flex flex-col h-screen sticky top-0 shadow-2xl relative overflow-hidden transition-all duration-300 z-40 font-sans border-r border-white/10">
        {/* Subtle decorative background gradient glows */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/4 -right-16 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none hidden md:block"></div>
        <div className="absolute bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none hidden md:block"></div>

        {/* Logo & Header Area */}
        <div className="p-3 md:p-4 relative z-10">
          <div className="hidden md:flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-xs">
              <img 
                src="/logo/New%20nrc%20logo.png" 
                alt="Brand R.Comm Logo" 
                className="h-full w-auto object-contain" 
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-black text-white leading-tight tracking-tight truncate">Brand R.Comm</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[9px] text-amber-300 font-extrabold uppercase tracking-widest">ADMIN PANEL</span>
              </div>
            </div>
          </div>

          {/* Mobile icon logo */}
          <div className="md:hidden flex items-center justify-center h-12 w-12 mx-auto bg-white/10 rounded-2xl border border-white/20 shadow-xs">
            <Award size={22} className="text-white" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 md:px-4 py-3 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center justify-center md:justify-start gap-3.5 px-3 md:px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-white text-[#5e8e33] shadow-lg shadow-black/10 scale-[1.02]' 
                    : 'text-white/80 hover:bg-white/15 hover:text-white'
                }`}
                title={item.name}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-[#5e8e33]/10 text-[#5e8e33]' : 'text-white/70 group-hover:text-white'
                }`}>
                  <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                </div>
                
                <span className="hidden md:block tracking-wide flex-1">{item.name}</span>

                {isActive && (
                  <div className="hidden md:block w-1.5 h-5 bg-[#5e8e33] rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Sign Out Area */}
        <div className="p-3 md:p-4 border-t border-white/15 relative z-10 bg-black/10 backdrop-blur-xs">
          <div className="hidden md:flex items-center gap-3 p-2.5 mb-2 bg-white/10 rounded-2xl border border-white/15">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white text-[#5e8e33] font-black text-xs flex items-center justify-center shadow-xs">
                N
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#5e8e33] rounded-full"></span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12px] font-extrabold text-white truncate">Administrator</span>
              <span className="text-[10px] text-white/70 font-medium truncate">Snail Integral</span>
            </div>
          </div>

          <button 
            onClick={() => setShowLogoutModal(true)}
            title="Sign Out"
            className="flex w-full items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-2.5 rounded-2xl text-[12px] font-bold text-white/90 hover:bg-red-500 hover:text-white hover:shadow-md transition-all duration-200 group cursor-pointer"
          >
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            <span className="hidden md:block">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to sign out of the Admin Panel? You will need to log in again to access the dashboard.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-[13px] font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
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
