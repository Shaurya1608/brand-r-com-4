import React from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
