"use client";
import React from 'react';
import { Users, Award, TrendingUp, Clock, FileText, Settings, ChevronRight } from 'lucide-react';

export default function DashboardHome() {
  const stats = [
    { name: 'Total Nominations', value: '1,248', icon: Award, change: '+12%', changeType: 'positive' },
    { name: 'Jury Members', value: '32', icon: Users, change: '+2', changeType: 'positive' },
    { name: 'Under Review', value: '450', icon: Clock, change: '-5%', changeType: 'negative' },
    { name: 'Engagement Rate', value: '86%', icon: TrendingUp, change: '+4.3%', changeType: 'positive' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 text-[13px]">Welcome back! Here's what's happening with the Brand R.Comm Awards today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl p-3 md:p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="bg-[#6a9a38]/10 p-2 md:p-2.5 rounded-lg">
                  <Icon className="text-[#6a9a38]" size={16} />
                </div>
                <span className={`text-[10px] md:text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-50 text-green-700 border border-green-100' 
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-[11px] md:text-[12px] font-medium text-gray-500 mb-0.5 md:mb-1">{stat.name}</p>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 xl:col-span-2">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <h2 className="text-sm md:text-base font-bold text-gray-900">Recent Nominations</h2>
            <button className="text-[12px] md:text-[13px] font-medium text-[#6a9a38] hover:text-[#5a862b] flex items-center group">
              View All <ChevronRight size={14} className="ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          
          <div className="space-y-2 md:space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-50 group cursor-pointer">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-[11px] md:text-[12px] group-hover:bg-[#6a9a38]/10 group-hover:text-[#6a9a38] transition-colors">
                    {`C${i}`}
                  </div>
                  <div>
                    <h4 className="text-[12px] md:text-[13px] font-semibold text-gray-900 group-hover:text-[#6a9a38] transition-colors">AgriTech Innovation Campaign</h4>
                    <p className="text-[10px] md:text-[11px] text-gray-500">Submitted by: John Doe • 2 hours ago</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] md:text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100 self-start sm:self-auto">
                  Pending Review
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 h-fit sticky top-6">
          <h2 className="text-sm md:text-base font-bold text-gray-900 mb-4 md:mb-5">Quick Actions</h2>
          <div className="space-y-2 md:space-y-3">
            <button className="w-full flex items-center justify-between p-3 md:p-3.5 bg-[#6a9a38] hover:bg-[#5a862b] text-white rounded-lg transition-all hover:shadow-md text-[12px] md:text-[13px] font-medium group">
              <span>Assign Jury Members</span>
              <Users size={14} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-3 md:p-3.5 bg-white border border-gray-200 hover:border-[#6a9a38]/30 hover:bg-[#6a9a38]/5 text-gray-700 hover:text-[#6a9a38] rounded-lg transition-all text-[12px] md:text-[13px] font-medium group">
              <span>Generate Report</span>
              <FileText size={14} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-3 md:p-3.5 bg-white border border-gray-200 hover:border-[#6a9a38]/30 hover:bg-[#6a9a38]/5 text-gray-700 hover:text-[#6a9a38] rounded-lg transition-all text-[12px] md:text-[13px] font-medium group">
              <span>Dashboard Settings</span>
              <Settings size={14} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
