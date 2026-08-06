"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Award, Briefcase, Mic, TrendingUp, Clock, FileText, 
  ChevronRight, Plus, Download, ShieldCheck, CheckCircle, 
  DollarSign, ArrowUpRight, Calendar, Sparkles, RefreshCw
} from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';

import AddDelegateModal from '../../components/AddDelegateModal';
import ManualSponsorshipModal from '../../components/ManualSponsorshipModal';
import ManualNominationModal from '../../components/ManualNominationModal';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live Stats
  const [stats, setStats] = useState({
    totalNominations: 0,
    underReviewNominations: 0,
    winnerNominations: 0,
    totalDelegates: 0,
    totalSponsorships: 0,
    totalSpeakers: 0,
    estimatedRevenue: 0,
  });

  // Recent Items Feed
  const [recentItems, setRecentItems] = useState([]);

  // Modals state
  const [isNominationModalOpen, setIsNominationModalOpen] = useState(false);
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get('admin_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

      // Fetch Nominations, Delegates, Sponsorships, Speakers in parallel
      const [nomRes, delRes, sponRes, spkRes] = await Promise.allSettled([
        fetch(`${apiUrl}/nominations`, { headers }),
        fetch(`${apiUrl}/delegates?limit=100`, { headers }),
        fetch(`${apiUrl}/sponsorships`, { headers }),
        fetch(`${apiUrl}/speakers`, { headers }),
      ]);

      let nominationsData = [];
      let delegatesData = [];
      let sponsorshipsData = [];
      let speakersData = [];

      if (nomRes.status === 'fulfilled') {
        const text = await nomRes.value.text();
        try {
          const json = JSON.parse(text);
          if (json.success) nominationsData = json.data || [];
        } catch (e) {}
      }

      if (delRes.status === 'fulfilled') {
        const text = await delRes.value.text();
        try {
          const json = JSON.parse(text);
          if (json.success) delegatesData = json.delegates || json.data || [];
        } catch (e) {}
      }

      if (sponRes.status === 'fulfilled') {
        const text = await sponRes.value.text();
        try {
          const json = JSON.parse(text);
          if (json.success) sponsorshipsData = json.data || [];
        } catch (e) {}
      }

      if (spkRes.status === 'fulfilled') {
        const text = await spkRes.value.text();
        try {
          const json = JSON.parse(text);
          if (json.success) speakersData = json.data || [];
        } catch (e) {}
      }

      // Compute counts & revenue
      const underReview = nominationsData.filter(n => (n.status || 'UNDER REVIEW') === 'UNDER REVIEW').length;
      const winners = nominationsData.filter(n => n.status === 'WINNER').length;

      // Revenue Calculation
      let totalRev = 0;
      nominationsData.forEach(n => {
        if (n.paymentStatus === 'Paid' || n.paymentStatus === 'APPROVED') {
          totalRev += (n.totalAmount || 9440);
        }
      });
      delegatesData.forEach(d => {
        if (d.paymentStatus === 'Paid' || d.amountPaid) {
          totalRev += (d.amountPaid || d.amount || 0);
        }
      });

      setStats({
        totalNominations: nominationsData.length,
        underReviewNominations: underReview,
        winnerNominations: winners,
        totalDelegates: delegatesData.length,
        totalSponsorships: sponsorshipsData.length,
        totalSpeakers: speakersData.length,
        estimatedRevenue: totalRev,
      });

      // Combine recent items feed
      const combined = [
        ...nominationsData.map(item => ({
          type: 'Nomination',
          id: item._id,
          title: item.fullName || item.organization || 'Nomination Entry',
          subtitle: `${item.awardCategory || 'Award Nomination'} • ${item.organization || ''}`,
          badge: item.status || 'UNDER REVIEW',
          badgeColor: item.status === 'WINNER' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
          date: new Date(item.createdAt),
          link: '/dashboard/nominations'
        })),
        ...delegatesData.map(item => ({
          type: 'Delegate',
          id: item._id,
          title: item.fullName || 'Delegate Entry',
          subtitle: `${item.designation || 'Delegate'} • ${item.organization || ''}`,
          badge: item.attendeeCategory || 'DELEGATE',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          date: new Date(item.createdAt),
          link: '/dashboard/delegates'
        })),
        ...sponsorshipsData.map(item => ({
          type: 'Sponsorship',
          id: item._id,
          title: item.companyName || 'Sponsorship Entry',
          subtitle: `${item.sponsorshipTier || item.sponsorshipCategory || 'Sponsor'}`,
          badge: item.sponsorshipCategory || 'SPONSOR',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          date: new Date(item.createdAt),
          link: '/dashboard/sponsorships'
        })),
        ...speakersData.map(item => ({
          type: 'Speaker Enquiry',
          id: item._id,
          title: item.fullName || 'Speaker Enquiry',
          subtitle: `${item.designation || 'Speaker'} • ${item.organization || ''}`,
          badge: 'SPEAKER',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
          date: new Date(item.createdAt),
          link: '/dashboard/speakers'
        }))
      ];

      // Sort by date descending & pick top 6
      combined.sort((a, b) => b.date - a.date);
      setRecentItems(combined.slice(0, 6));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load live dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const exportSystemSummaryCSV = () => {
    const summaryData = [
      ["Metric", "Value"],
      ["Total Award Nominations", stats.totalNominations],
      ["Nominations Under Review", stats.underReviewNominations],
      ["Winner Nominations", stats.winnerNominations],
      ["Total Delegates Registered", stats.totalDelegates],
      ["Total Sponsorships", stats.totalSponsorships],
      ["Speaker Interest Enquiries", stats.totalSpeakers],
      ["Estimated Collections (INR)", stats.estimatedRevenue],
      ["Report Generated At", new Date().toLocaleString()]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + summaryData.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_dashboard_summary_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#5e8e33] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">Live Executive Panel</span>
            <span className="text-xs text-gray-400 font-mono">• Updated Realtime</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
            Brand R.Comm Awards 2026 🏆
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-2xl font-medium">
            Executive control panel for nominations, delegates, sponsorships, and speaker enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
            title="Refresh Realtime Stats"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={exportSystemSummaryCSV}
            className="px-4 py-2.5 bg-[#5e8e33] hover:bg-[#4c7727] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>

        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#5e8e33]/20 to-transparent pointer-events-none"></div>
      </div>

      {/* 4 Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Nominations */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200/80 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#5e8e33]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="text-[#5e8e33]" size={20} />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
              {stats.underReviewNominations} Reviewing
            </span>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total Nominations</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
              {loading ? "..." : stats.totalNominations}
            </h3>
            <Link href="/dashboard/nominations" className="text-xs font-bold text-[#5e8e33] hover:underline flex items-center gap-0.5">
              Manage <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Card 2: Delegates */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200/80 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="text-blue-600" size={20} />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              Active Passes
            </span>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Delegates Registered</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
              {loading ? "..." : stats.totalDelegates}
            </h3>
            <Link href="/dashboard/delegates" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
              Manage <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Card 3: Sponsorships */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200/80 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="text-purple-600" size={20} />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
              Brand Partners
            </span>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Sponsorships</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
              {loading ? "..." : stats.totalSponsorships}
            </h3>
            <Link href="/dashboard/sponsorships" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-0.5">
              Manage <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Card 4: Speaker Enquiries */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200/80 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="text-rose-600" size={20} />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full">
              Speakers
            </span>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Speaker Enquiries</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
              {loading ? "..." : stats.totalSpeakers}
            </h3>
            <Link href="/dashboard/speakers" className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-0.5">
              Manage <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns on XL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Live Recent Activity Feed */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-gray-200/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Sparkles size={18} className="text-[#5e8e33]" />
                Recent System Activity
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Realtime stream of recent nominations, delegates, and sponsors</p>
            </div>
            <Link href="/dashboard/nominations" className="text-xs font-bold text-[#5e8e33] hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400">
              <div className="w-6 h-6 border-2 border-[#5e8e33] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-xs font-medium">Loading recent stream...</span>
            </div>
          ) : recentItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Clock size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs font-bold">No recent activities recorded</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentItems.map((item) => (
                <Link key={`${item.type}-${item.id}`} href={item.link}>
                  <div className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/40 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-black text-xs text-gray-700 group-hover:border-[#5e8e33] group-hover:text-[#5e8e33] transition-colors shadow-2xs">
                        {item.type === 'Nomination' ? '🏆' : item.type === 'Delegate' ? '👥' : item.type === 'Sponsorship' ? '💼' : '🎙️'}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900 group-hover:text-[#5e8e33] transition-colors flex items-center gap-2">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 font-semibold">
                        {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Quick Manual Action Suite & Breakdown */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-gray-200/80 space-y-4">
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Plus size={18} className="text-[#5e8e33]" />
              Quick Manual Entry Suite
            </h2>

            <div className="space-y-2.5">
              <button
                onClick={() => setIsNominationModalOpen(true)}
                className="w-full p-3.5 bg-[#5e8e33] hover:bg-[#4c7727] text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-between text-xs font-black uppercase tracking-wider cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Award size={16} />
                  <span>+ Add Nomination</span>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsDelegateModalOpen(true)}
                className="w-full p-3.5 bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-between text-xs font-black uppercase tracking-wider cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>+ Add Delegate</span>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsSponsorshipModalOpen(true)}
                className="w-full p-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-xl transition-all shadow-2xs active:scale-95 flex items-center justify-between text-xs font-black uppercase tracking-wider cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-[#5e8e33]" />
                  <span>+ Add Sponsor</span>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick System Status Breakdown */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-gray-200/80 space-y-4">
            <h2 className="text-xs font-black uppercase text-gray-400 tracking-wider">Nomination Review Status</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-amber-800">Under Review</span>
                  <span className="font-mono text-gray-900">{stats.underReviewNominations}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.totalNominations ? (stats.underReviewNominations / stats.totalNominations) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-800">Winners Selected</span>
                  <span className="font-mono text-gray-900">{stats.winnerNominations}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.totalNominations ? (stats.winnerNominations / stats.totalNominations) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Modals */}
      <ManualNominationModal
        isOpen={isNominationModalOpen}
        onClose={() => setIsNominationModalOpen(false)}
        onNominationAdded={fetchDashboardData}
      />

      <AddDelegateModal
        isOpen={isDelegateModalOpen}
        onClose={() => setIsDelegateModalOpen(false)}
        onDelegateAdded={fetchDashboardData}
      />

      <ManualSponsorshipModal
        isOpen={isSponsorshipModalOpen}
        onClose={() => setIsSponsorshipModalOpen(false)}
        onSponsorshipAdded={fetchDashboardData}
      />
    </div>
  );
}
