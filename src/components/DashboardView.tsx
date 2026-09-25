import React from 'react';
import {
  Calendar,
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  IndianRupee,
  UserPlus,
  CalendarCheck,
  CreditCard,
  FileCheck,
  Send,
  MapPin,
  Phone,
  QrCode,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Sparkles,
  School
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { SCHOOL_INFO, CLASS_SUMMARY } from '../data/initialData';
import { Student, Teacher, Staff, FeePayment, SchoolEvent, Activity } from '../types';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  payments: FeePayment[];
  events: SchoolEvent[];
  activities: Activity[];
  onNavigate: (tab: any) => void;
  onOpenAddStudent: () => void;
  onOpenAddTeacher: () => void;
  onOpenCollectFee: () => void;
  onOpenGPay: () => void;
  onOpenSendNotice: () => void;
  onOpenAddExpense?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  teachers,
  staff,
  payments,
  events,
  activities,
  onNavigate,
  onOpenAddStudent,
  onOpenAddTeacher,
  onOpenCollectFee,
  onOpenGPay,
  onOpenSendNotice,
  onOpenAddExpense,
}) => {
  // Key stats
  const totalStudents = 248; // Baseline from screenshot or dynamic: Math.max(248, students.length);
  const totalTeachers = 18;
  const totalStaff = 7;
  const totalParents = 198;
  const totalFeeCollected = "₹ 2,45,800";

  // Attendance numbers matching the screenshot
  const presentCount = 227;
  const absentCount = 13;
  const leaveCount = 8;
  const attendanceRate = 92;

  return (
    <div className="space-y-5">
      {/* 1. Welcome Card Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="shrink-0 p-1 rounded-full bg-blue-50 border border-blue-200 shadow-xs">
            <SchoolLogo size={52} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Welcome, Admin!
            </h2>
            <p className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wide">
              {SCHOOL_INFO.fullName}
            </p>
            <p className="text-xs italic text-slate-500 mt-0.5">
              {SCHOOL_INFO.slogan}
            </p>
          </div>
        </div>

        <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 w-full md:w-auto">
          <div className="flex items-center md:justify-end gap-1.5 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Tuesday, 29 April 2025</span>
          </div>
          <p className="text-xs italic text-slate-600 max-w-sm mt-1 leading-relaxed">
            {SCHOOL_INFO.quote}
          </p>
        </div>
      </div>

      {/* 2. Top 5 Vibrant KPI Cards matching screenshot colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Students - Blue */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-gradient-to-br from-[#1e88e5] to-[#1565c0] rounded-2xl p-4 text-white shadow-md shadow-blue-500/10 cursor-pointer transform hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-blue-100">Total Students</div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">{totalStudents}</div>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-blue-100 mt-3 flex items-center gap-1">
            <span>+12 this month</span>
          </div>
        </div>

        {/* Total Teachers - Green */}
        <div
          onClick={() => onNavigate('teachers')}
          className="bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] rounded-2xl p-4 text-white shadow-md shadow-green-500/10 cursor-pointer transform hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-emerald-100">Total Teachers</div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">{totalTeachers}</div>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-emerald-100 mt-3 flex items-center gap-1">
            <span>+2 this month</span>
          </div>
        </div>

        {/* Total Staff - Purple */}
        <div
          onClick={() => onNavigate('teachers')}
          className="bg-gradient-to-br from-[#7e57c2] to-[#5e35b1] rounded-2xl p-4 text-white shadow-md shadow-purple-500/10 cursor-pointer transform hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-purple-100">Total Staff</div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">{totalStaff}</div>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-purple-100 mt-3 flex items-center gap-1">
            <span>+1 this month</span>
          </div>
        </div>

        {/* Total Parents - Orange */}
        <div
          onClick={() => onNavigate('parents')}
          className="bg-gradient-to-br from-[#f57c00] to-[#e65100] rounded-2xl p-4 text-white shadow-md shadow-orange-500/10 cursor-pointer transform hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-orange-100">Total Parents</div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">{totalParents}</div>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-orange-100 mt-3 flex items-center gap-1">
            <span>+10 this month</span>
          </div>
        </div>

        {/* Fees Collected - Crimson Red */}
        <div
          onClick={() => onNavigate('fees')}
          className="bg-gradient-to-br from-[#e53935] to-[#c62828] rounded-2xl p-4 text-white shadow-md shadow-rose-500/10 cursor-pointer transform hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 font-bold text-xl">
              ₹
            </div>
            <div>
              <div className="text-xs font-medium text-rose-100">Fees Collected</div>
              <div className="text-xl sm:text-2xl font-black tracking-tight">{totalFeeCollected}</div>
            </div>
          </div>
          <div className="text-[11px] font-semibold text-rose-100 mt-3 flex items-center gap-1">
            <span>+18% this month</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Fee Chart, Attendance Donut, Activities, Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Fees Collection Bar Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Fees Collection <span className="text-xs font-normal text-slate-500">(This Month)</span>
              </h3>
            </div>

            {/* Simulated Clean Bar Chart with Y-axis */}
            <div className="mt-4 flex items-end justify-between h-44 pb-2 border-b border-slate-100 relative">
              {/* Y Axis Guide Lines */}
              <div className="absolute inset-x-0 top-0 border-t border-slate-100">
                <span className="text-[9px] text-slate-400 absolute -top-2 left-0">2.5L</span>
              </div>
              <div className="absolute inset-x-0 top-1/4 border-t border-slate-100">
                <span className="text-[9px] text-slate-400 absolute -top-2 left-0">2L</span>
              </div>
              <div className="absolute inset-x-0 top-2/4 border-t border-slate-100">
                <span className="text-[9px] text-slate-400 absolute -top-2 left-0">1.5L</span>
              </div>
              <div className="absolute inset-x-0 top-3/4 border-t border-slate-100">
                <span className="text-[9px] text-slate-400 absolute -top-2 left-0">50K</span>
              </div>

              {/* Chart Bars */}
              <div className="flex-1 flex items-end justify-around pl-6 h-full z-10">
                {/* W1 */}
                <div className="flex items-end gap-1 group">
                  <div className="w-3.5 bg-blue-600 rounded-t-sm h-[65%] group-hover:bg-blue-700 transition-all" title="Paid: ₹1.6L" />
                  <div className="w-3.5 bg-amber-500 rounded-t-sm h-[20%] group-hover:bg-amber-600 transition-all" title="Pending: ₹45K" />
                </div>
                {/* W2 */}
                <div className="flex items-end gap-1 group">
                  <div className="w-3.5 bg-blue-600 rounded-t-sm h-[75%] group-hover:bg-blue-700 transition-all" title="Paid: ₹1.9L" />
                  <div className="w-3.5 bg-amber-500 rounded-t-sm h-[25%] group-hover:bg-amber-600 transition-all" title="Pending: ₹55K" />
                </div>
                {/* W3 */}
                <div className="flex items-end gap-1 group">
                  <div className="w-3.5 bg-blue-600 rounded-t-sm h-[85%] group-hover:bg-blue-700 transition-all" title="Paid: ₹2.1L" />
                  <div className="w-3.5 bg-amber-500 rounded-t-sm h-[18%] group-hover:bg-amber-600 transition-all" title="Pending: ₹38K" />
                </div>
                {/* W4 */}
                <div className="flex items-end gap-1 group">
                  <div className="w-3.5 bg-blue-600 rounded-t-sm h-[50%] group-hover:bg-blue-700 transition-all" title="Paid: ₹1.2L" />
                  <div className="w-3.5 bg-amber-500 rounded-t-sm h-[32%] group-hover:bg-amber-600 transition-all" title="Pending: ₹70K" />
                </div>
                {/* W5 */}
                <div className="flex items-end gap-1 group">
                  <div className="w-3.5 bg-blue-600 rounded-t-sm h-[92%] group-hover:bg-blue-700 transition-all" title="Paid: ₹2.3L" />
                  <div className="w-3.5 bg-amber-500 rounded-t-sm h-[40%] group-hover:bg-amber-600 transition-all" title="Pending: ₹90K" />
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-blue-600" />
              <span className="font-semibold text-slate-700">Paid</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-amber-500" />
              <span className="font-semibold text-slate-700">Pending</span>
            </div>
          </div>
        </div>

        {/* Attendance Overview Donut Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800">Attendance Overview</h3>
          
          <div className="flex items-center justify-around my-2">
            {/* Donut Chart SVG */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background track */}
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Leave segment (Amber) */}
                <path
                  className="text-amber-500"
                  strokeDasharray="100, 100"
                  strokeDashoffset="0"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Absent segment (Red) */}
                <path
                  className="text-rose-500"
                  strokeDasharray="96, 100"
                  strokeDashoffset="0"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Present segment (Green) - 92% */}
                <path
                  className="text-teal-600"
                  strokeDasharray="92, 100"
                  strokeDashoffset="0"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-800">{attendanceRate}%</span>
                <span className="text-[10px] text-slate-400 font-semibold leading-tight">Overall<br/>Attendance</span>
              </div>
            </div>

            {/* Attendance Legend & Values matching screenshot */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <span className="text-slate-600 font-medium">Present</span>
                </div>
                <span className="font-extrabold text-slate-900">{presentCount}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Absent</span>
                </div>
                <span className="font-extrabold text-slate-900">{absentCount}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Leave</span>
                </div>
                <span className="font-extrabold text-slate-900">{leaveCount}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('attendance')}
            className="w-full mt-2 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
          >
            Open Attendance Register →
          </button>
        </div>

        {/* Recent Activities List matching screenshot */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800">Recent Activities</h3>
          
          <div className="space-y-3 mt-3 overflow-hidden">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  {act.type === 'admission' && <UserPlus className="w-3.5 h-3.5 text-blue-600" />}
                  {act.type === 'fee' && <CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
                  {act.type === 'exam' && <FileCheck className="w-3.5 h-3.5 text-purple-600" />}
                  {act.type === 'notice' && <Send className="w-3.5 h-3.5 text-rose-600" />}
                  {act.type === 'homework' && <ClipboardListIcon className="w-3.5 h-3.5 text-teal-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800 truncate">{act.title}</div>
                  <div className="text-[10px] text-slate-400">{act.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2" />
        </div>

        {/* Quick Actions Panel matching screenshot with Add Expense and Excel Import */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-slate-800">Quick Actions</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shortcuts</span>
          </div>

          <div className="grid grid-cols-4 gap-2 flex-1">
            {/* Add Student */}
            <button
              onClick={onOpenAddStudent}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-102 cursor-pointer shadow-xs"
            >
              <Users className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Add Student</span>
            </button>

            {/* Add Teacher */}
            <button
              onClick={onOpenAddTeacher}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#00897b] hover:bg-[#00796b] text-white transition-all transform hover:scale-102 cursor-pointer shadow-xs"
            >
              <GraduationCap className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Add Teacher</span>
            </button>

            {/* Take Attendance */}
            <button
              onClick={() => onNavigate('attendance')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#f57c00] hover:bg-[#ef6c00] text-white transition-all transform hover:scale-102 cursor-pointer shadow-xs"
            >
              <CalendarCheck className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Attendance</span>
            </button>

            {/* Add Fee */}
            <button
              onClick={onOpenCollectFee}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#7e57c2] hover:bg-[#673ab7] text-white transition-all transform hover:scale-102 cursor-pointer shadow-xs"
            >
              <CreditCard className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Add Fee</span>
            </button>

            {/* Add Expense */}
            <button
              onClick={() => {
                if (onOpenAddExpense) {
                  onOpenAddExpense();
                } else {
                  onNavigate('expenses');
                }
              }}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all transform hover:scale-102 cursor-pointer shadow-xs"
              title="Add School Operational Expense"
            >
              <TrendingDown className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Add Expense</span>
            </button>

            {/* Add Exam */}
            <button
              onClick={() => onNavigate('exams')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#e53935] hover:bg-[#d32f2f] text-white transition-all transform hover:scale-102 cursor-pointer shadow-xs"
            >
              <FileCheck className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Add Exam</span>
            </button>

            {/* Send Notice */}
            <button
              onClick={onOpenSendNotice}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#00acc1] hover:bg-[#0097a7] text-white transition-all transform hover:scale-102 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Send Notice</span>
            </button>

            {/* Import / Export Excel */}
            <button
              onClick={() => onNavigate('students')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all transform hover:scale-102 cursor-pointer shadow-xs"
              title="Open Student Register to Import or Export Excel"
            >
              <FileSpreadsheet className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">Excel Sheet</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Bottom Grid: Upcoming Events, Class-wise Students, Recent Fee Payments, School Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Upcoming Events</h3>
            </div>
            <button
              onClick={() => onNavigate('notices')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 mt-3">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center shrink-0 text-center">
                  <span className="text-xs font-black text-rose-700 leading-tight">
                    {ev.date.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-bold text-rose-500 uppercase leading-none">
                    {ev.date.split(' ')[1]}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{ev.title}</h4>
                  <p className="text-[10px] text-slate-500">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class-wise Students Table matching screenshot */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">Class-wise Students</h3>
            </div>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="mt-2 divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between py-1 text-[11px] font-bold text-slate-400 uppercase">
              <span>Class</span>
              <span>Students</span>
            </div>

            {CLASS_SUMMARY.map((c) => (
              <div key={c.className} className="flex items-center justify-between py-1.5">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.className}
                </span>
                <span className="font-bold text-slate-800">{c.count}</span>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2 font-black text-slate-900">
              <span>Total</span>
              <span className="text-sm text-blue-700">248</span>
            </div>
          </div>
        </div>

        {/* Recent Fee Payments Table matching screenshot */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-800">Recent Fee Payments</h3>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="mt-2 divide-y divide-slate-100 text-xs">
            <div className="grid grid-cols-4 py-1 text-[10px] font-bold text-slate-400 uppercase">
              <span className="col-span-1.5 truncate">Student</span>
              <span className="text-center">Class</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Date</span>
            </div>

            {payments.slice(0, 5).map((pay) => (
              <div key={pay.id} className="grid grid-cols-4 items-center py-2 hover:bg-slate-50 rounded">
                <span className="col-span-1.5 font-bold text-slate-800 truncate" title={pay.studentName}>
                  {pay.studentName}
                </span>
                <span className="text-center text-[11px] font-medium text-slate-600">
                  {pay.className} {pay.section}
                </span>
                <span className="text-right font-black text-emerald-700">
                  ₹ {pay.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-right text-[11px] text-slate-400">
                  {pay.date}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenCollectFee}
            className="w-full mt-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            + Record New Payment
          </button>
        </div>

        {/* School Details Card matching screenshot */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <School className="w-4 h-4 text-blue-800" />
              <h3 className="text-sm font-bold text-slate-800">School Details</h3>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-blue-50 border border-blue-200">
                  <SchoolLogo size={42} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-blue-950 uppercase leading-tight">
                    WISDOM NURSERY AND PRIMARY SCHOOL
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">Essur Campus</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Essur - 603310</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <a href="tel:9176593129" className="font-bold text-slate-900 hover:text-blue-600">
                    9176593129
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 font-black text-xs text-emerald-600 flex items-center justify-center">
                    G
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600">GPay</span>
                    <button
                      onClick={onOpenGPay}
                      className="font-black text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>9176593129</span>
                      <QrCode className="w-3 h-3 text-emerald-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Green Pill Tag matching screenshot */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full py-2 bg-emerald-50 border border-emerald-200/80 rounded-xl text-center">
              <span className="text-xs font-extrabold text-emerald-800 tracking-wide">
                {SCHOOL_INFO.motto}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Line matching screenshot */}
      <footer className="mt-6 pt-4 pb-2 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3">
        <span className="font-semibold text-slate-700">Wisdom Nursery and Primary School - Essur</span>
        <span>|</span>
        <span>Phone: <strong className="text-slate-800">9176593129</strong></span>
        <span>|</span>
        <span>GPay: <strong className="text-emerald-700">9176593129</strong></span>
        <span>|</span>
        <span>Essur - 603310</span>
        <span>|</span>
        <span className="text-slate-400">Powered by <strong>Wisdom eSchooly</strong></span>
      </footer>
    </div>
  );
};

function ClipboardListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
