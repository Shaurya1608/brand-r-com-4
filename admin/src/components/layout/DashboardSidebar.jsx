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
    { name: 'Speakers', href: '/dashboard/speakers', icon: Mic },
  ];

  return (
    <>
      <aside className="w-16 md:w-56 bg-[#6a9a38] text-white flex flex-col h-screen sticky top-0 shadow-lg relative overflow-hidden transition-all duration-300 z-40">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none hidden md:block"></div>

        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center md:justify-start px-0 md:px-5 relative z-10 border-b border-white/10">
          <div className="hidden md:flex items-center gap-3">
            <img 
              src="/logo/New%20nrc%20logo.png" 
              alt="Brand R.Comm Logo" 
              className="h-7 w-auto brightness-0 invert" 
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold leading-tight tracking-wide">Brand R.Comm</span>
              <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>
          {/* Mobile icon logo */}
          <div className="md:hidden flex items-center justify-center">
            <Award size={22} className="text-white" />
          </div>
        </div>

        <nav className="flex-1 pl-3 md:pl-6 pr-0 py-6 space-y-1.5 overflow-y-auto relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center justify-center md:justify-start gap-3.5 pl-0 md:pl-5 py-3 rounded-l-full text-[13px] font-medium transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gray-50 text-[#6a9a38] shadow-[-4px_4px_15px_rgba(0,0,0,0.05)]' 
                    : 'text-white/80 hover:bg-white/15 hover:text-white mr-3 md:mr-6 rounded-r-full'
                }`}
                title={item.name}
              >
                <div className="flex items-center justify-center md:justify-start w-full gap-3.5">
                  <Icon size={18} className={`${isActive ? 'text-[#6a9a38]' : 'text-white/70'} transition-transform duration-300 group-hover:scale-110`} />
                  <span className="hidden md:block tracking-wide">{item.name}</span>
                </div>
                {isActive && (
                  <>
                    {/* Top inner curve illusion */}
                    <div className="hidden md:block absolute -top-5 right-0 w-5 h-5 bg-transparent rounded-br-xl shadow-[5px_5px_0_0_#f9fafb]"></div>
                    {/* Bottom inner curve illusion */}
                    <div className="hidden md:block absolute -bottom-5 right-0 w-5 h-5 bg-transparent rounded-tr-xl shadow-[5px_-5px_0_0_#f9fafb]"></div>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Area */}
        <div className="p-2 md:p-4 border-t border-white/10 relative z-10">
          <button 
            onClick={() => setShowLogoutModal(true)}
            title="Sign Out"
            className="flex w-full items-center justify-center md:justify-start gap-3 px-0 md:px-4 py-2.5 rounded-full text-[12px] font-medium text-white/80 hover:bg-red-500 hover:text-white hover:shadow-sm transition-all duration-200 group"
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
