import React, { useEffect, useState } from 'react';
import { Menu, Bell, Search, Shield, ChevronDown, CheckCircle, ExternalLink, QrCode } from 'lucide-react';
import { SCHOOL_INFO } from '../data/initialData';
import { readStored } from '../utils/storage';

interface TopNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  onOpenGPay: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  onOpenGPay
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [academicYear, setAcademicYear] = useState(SCHOOL_INFO.academicYear);

  useEffect(() => {
    const refreshProfile = () => {
      const profile = readStored<{ academicYear?: string }>('wisdom_general_settings', {});
      setAcademicYear(profile.academicYear || SCHOOL_INFO.academicYear);
    };
    refreshProfile();
    window.addEventListener('wisdom-profile-updated', refreshProfile);
    return () => window.removeEventListener('wisdom-profile-updated', refreshProfile);
  }, []);

  return (
    <nav className="bg-[#0f244a] text-white border-b border-blue-900/60 sticky top-0 z-30 shadow-md">
      <div className="px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Sidebar toggle + App Portal Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/60 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2 truncate">
              <span>{SCHOOL_INFO.fullName}</span>
            </h1>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick GPay button */}
          <button
            onClick={onOpenGPay}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>GPay: 9176593129</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/60 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-[#0f244a]">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">School Alerts</h4>
                  <span className="text-[11px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Fee Received: ₹5,000 via GPay
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Rohan Kumar (Class 3 A) - Receipt #0429</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Today, 09:45 AM</div>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      New Admission: Aarthi S
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Enrolled in Nursery Section A</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Today, 10:24 AM</div>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Parent-Teacher Meeting
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Scheduled for tomorrow, 10:00 AM</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Tomorrow, 30 Apr</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-lg hover:bg-blue-800/60 transition-colors text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-blue-300 shadow-sm text-white">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white leading-tight">Admin</div>
                <div className="text-[10px] text-blue-200">School Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-300 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">Wisdom Admin Office</div>
                  <div className="text-[11px] text-slate-500">Essur Campus Portal</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">● Online (Master Access)</div>
                </div>
                <div className="py-1">
                  <div className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
                    Academic Year: <span className="font-bold text-slate-900">{academicYear}</span>
                  </div>
                  <div className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
                    Primary Contact: <span className="font-bold text-slate-900">9176593129</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
