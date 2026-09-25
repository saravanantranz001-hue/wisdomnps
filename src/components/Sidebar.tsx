import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  Building2,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Award,
  CreditCard,
  ClipboardList,
  Bell,
  Library,
  Bus,
  BadgePercent,
  BarChart3,
  Settings,
  ChevronRight,
  X
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

export type NavTab =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'parents'
  | 'classes'
  | 'subjects'
  | 'timetable'
  | 'attendance'
  | 'exams'
  | 'fees'
  | 'homework'
  | 'notices'
  | 'library'
  | 'transport'
  | 'expenses'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  studentCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  studentCount = 248
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string; hasChevron?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Management', icon: Users, badge: `${studentCount}`, hasChevron: true },
    { id: 'teachers', label: 'Teacher & Staff', icon: GraduationCap, hasChevron: true },
    { id: 'parents', label: 'Parents', icon: UserCheck, hasChevron: true },
    { id: 'classes', label: 'Classes & Sections', icon: Building2, hasChevron: true },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, hasChevron: true },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare, hasChevron: true },
    { id: 'exams', label: 'Exams & Marks', icon: Award, hasChevron: true },
    { id: 'fees', label: 'Fees & Payments', icon: CreditCard, hasChevron: true },
    { id: 'homework', label: 'Homework & Assignments', icon: ClipboardList, hasChevron: true },
    { id: 'notices', label: 'Notices & Announcements', icon: Bell, hasChevron: true },
    { id: 'library', label: 'Library / Inventory', icon: Library, hasChevron: true },
    { id: 'transport', label: 'Transport', icon: Bus, hasChevron: true },
    { id: 'expenses', label: 'Expenses & Income', icon: BadgePercent, hasChevron: true },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, hasChevron: true },
    { id: 'settings', label: 'Settings', icon: Settings, hasChevron: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a1936] text-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-3.5 border-b border-blue-950/80 flex items-center justify-between bg-[#08152e]">
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 p-0.5 rounded-full bg-blue-950 ring-1 ring-blue-700/50">
              <SchoolLogo size={36} />
            </div>
            <div className="leading-tight">
              <div className="font-serif font-black text-sm text-white tracking-wide">WISDOM</div>
              <div className="text-[10px] text-blue-300 font-medium">Nursery & Primary School</div>
              <div className="text-[9px] text-blue-400 font-semibold">Essur</div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-blue-900/50"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#1864f7] text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#122852]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-900/60 text-blue-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.hasChevron && (
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'text-blue-100 rotate-90' : 'text-slate-500'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-blue-950/80 bg-[#071329] text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">GPay & Phone:</span>
            <span className="font-bold text-emerald-400">9176593129</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
            <span>PIN: 603310</span>
            <span className="text-blue-400 font-semibold">Active Session</span>
          </div>
        </div>
      </aside>
    </>
  );
};
