import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Users,
  Calendar,
  Share2,
  AlertTriangle
} from 'lucide-react';
import { Student, ClassName } from '../types';
import { SCHOOL_INFO } from '../data/initialData';

interface AttendanceModuleProps {
  students: Student[];
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({ students }) => {
  const [selectedClass, setSelectedClass] = useState<ClassName>('Class 3');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Class student list
  const classStudents = students.filter(
    (s) => s.className === selectedClass && s.section === selectedSection
  );

  // Local attendance status map: studentId -> status
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Present' | 'Absent' | 'Leave'>>({
    'std-002': 'Present',
    'std-009': 'Absent',
  });

  const getStatus = (studentId: string): 'Present' | 'Absent' | 'Leave' => {
    return attendanceMap[studentId] || 'Present';
  };

  const setStatus = (studentId: string, status: 'Present' | 'Absent' | 'Leave') => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const updated = { ...attendanceMap };
    classStudents.forEach((s) => {
      updated[s.id] = 'Present';
    });
    setAttendanceMap(updated);
  };

  const presentCount = classStudents.filter((s) => getStatus(s.id) === 'Present').length;
  const absentCount = classStudents.filter((s) => getStatus(s.id) === 'Absent').length;
  const leaveCount = classStudents.filter((s) => getStatus(s.id) === 'Leave').length;
  const percentage = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 100;

  const notifyAbsentParents = () => {
    const absentees = classStudents.filter((s) => getStatus(s.id) === 'Absent');
    if (absentees.length === 0) {
      alert('No students marked absent for this class today.');
      return;
    }
    const sample = absentees[0];
    const msg = encodeURIComponent(
      `Dear Parent of ${sample.name} (${sample.className}-${sample.section}), your ward was marked absent today (${selectedDate}) at Wisdom Nursery and Primary School, Essur. Please contact 9176593129 if this is a mistake.`
    );
    window.open(`https://wa.me/91${sample.parentPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Daily Attendance Register</span>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full">
              Overall 92% Average
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Real-time parent notification system
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllPresent}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Mark All Present
          </button>

          <button
            onClick={notifyAbsentParents}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Alert Absent Parents</span>
          </button>
        </div>
      </div>

      {/* Class and Date Selectors + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Selector Filters */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassName)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="Nursery">Nursery</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        {/* Current Class Attendance Rate Card */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-teal-100">Today's Class Rate</div>
            <div className="text-2xl font-black mt-1">{percentage}%</div>
            <div className="text-[10px] text-teal-200 mt-0.5">
              {presentCount} Present • {absentCount} Absent
            </div>
          </div>
          <CalendarCheck className="w-10 h-10 text-teal-200/80" />
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {selectedClass} - Section {selectedSection} Attendance Register
          </h3>
          <span className="text-xs text-slate-400 font-medium">Date: {selectedDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Roll No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Parent Contact</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No students enrolled in {selectedClass} - Section {selectedSection} yet. Add students in Student Management.
                  </td>
                </tr>
              ) : (
                classStudents.map((std) => {
                  const status = getStatus(std.id);
                  return (
                    <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        #{std.rollNo}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{std.name}</div>
                        <div className="text-[10px] text-slate-400">{std.admissionNo}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-800 font-medium">{std.parentName}</div>
                        <div className="text-[11px] text-slate-500">{std.parentPhone}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setStatus(std.id, 'Present')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              status === 'Present'
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            onClick={() => setStatus(std.id, 'Absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              status === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          <button
                            onClick={() => setStatus(std.id, 'Leave')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              status === 'Leave'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Leave</span>
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        {status === 'Absent' && (
                          <a
                            href={`https://wa.me/91${std.parentPhone}?text=Dear%20Parent,%20${encodeURIComponent(std.name)}%20was%20marked%20absent%20today%20at%20Wisdom%20School%20Essur.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Notify</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
