import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  Printer,
  Sparkles
} from 'lucide-react';
import { ClassName } from '../types';
import { readStored, writeStored } from '../utils/storage';

export interface TimetablePeriod {
  id: string;
  time: string;
  periodNumber: number;
  monday: { subject: string; teacher: string };
  tuesday: { subject: string; teacher: string };
  wednesday: { subject: string; teacher: string };
  thursday: { subject: string; teacher: string };
  friday: { subject: string; teacher: string };
  isBreak?: boolean;
}

const DEFAULT_PERIODS: TimetablePeriod[] = [
  {
    id: 'p-1',
    periodNumber: 1,
    time: '9:00 - 9:45 AM',
    monday: { subject: 'Tamil', teacher: 'Mrs. Subhashini R' },
    tuesday: { subject: 'English', teacher: 'Mrs. Jayanthi S' },
    wednesday: { subject: 'Tamil', teacher: 'Mrs. Subhashini R' },
    thursday: { subject: 'English', teacher: 'Mrs. Jayanthi S' },
    friday: { subject: 'Tamil', teacher: 'Mrs. Subhashini R' },
  },
  {
    id: 'p-2',
    periodNumber: 2,
    time: '9:45 - 10:30 AM',
    monday: { subject: 'English', teacher: 'Mrs. Jayanthi S' },
    tuesday: { subject: 'Mathematics', teacher: 'Mr. Balaji M' },
    wednesday: { subject: 'Mathematics', teacher: 'Mr. Balaji M' },
    thursday: { subject: 'Tamil', teacher: 'Mrs. Subhashini R' },
    friday: { subject: 'Mathematics', teacher: 'Mr. Balaji M' },
  },
  {
    id: 'p-3',
    periodNumber: 0,
    time: '10:30 - 10:45 AM',
    isBreak: true,
    monday: { subject: 'Morning Healthy Snack Break', teacher: 'Dining Hall' },
    tuesday: { subject: 'Morning Healthy Snack Break', teacher: 'Dining Hall' },
    wednesday: { subject: 'Morning Healthy Snack Break', teacher: 'Dining Hall' },
    thursday: { subject: 'Morning Healthy Snack Break', teacher: 'Dining Hall' },
    friday: { subject: 'Morning Healthy Snack Break', teacher: 'Dining Hall' },
  },
  {
    id: 'p-4',
    periodNumber: 3,
    time: '10:45 - 11:30 AM',
    monday: { subject: 'Mathematics', teacher: 'Mr. Balaji M' },
    tuesday: { subject: 'EVS / Science', teacher: 'Mr. Saravanan V' },
    wednesday: { subject: 'English', teacher: 'Mrs. Jayanthi S' },
    thursday: { subject: 'Mathematics', teacher: 'Mr. Balaji M' },
    friday: { subject: 'EVS / Science', teacher: 'Mr. Saravanan V' },
  },
  {
    id: 'p-5',
    periodNumber: 4,
    time: '11:30 - 12:15 PM',
    monday: { subject: 'EVS / Science', teacher: 'Mr. Saravanan V' },
    tuesday: { subject: 'Social / GK', teacher: 'Mrs. Kalaiselvi N' },
    wednesday: { subject: 'EVS / Science', teacher: 'Mr. Saravanan V' },
    thursday: { subject: 'Basic Computers', teacher: 'Mr. Saravanan V' },
    friday: { subject: 'Storytelling & Rhymes', teacher: 'Mrs. Anandhi K' },
  },
  {
    id: 'p-6',
    periodNumber: 0,
    time: '12:15 - 1:00 PM',
    isBreak: true,
    monday: { subject: 'Wholesome Lunch Break & Handwash', teacher: 'Campus Dining' },
    tuesday: { subject: 'Wholesome Lunch Break & Handwash', teacher: 'Campus Dining' },
    wednesday: { subject: 'Wholesome Lunch Break & Handwash', teacher: 'Campus Dining' },
    thursday: { subject: 'Wholesome Lunch Break & Handwash', teacher: 'Campus Dining' },
    friday: { subject: 'Wholesome Lunch Break & Handwash', teacher: 'Campus Dining' },
  },
  {
    id: 'p-7',
    periodNumber: 5,
    time: '1:00 - 1:45 PM',
    monday: { subject: 'Rhymes & Phonics', teacher: 'Mrs. Anandhi K' },
    tuesday: { subject: 'Drawing & Craft', teacher: 'Art Room' },
    wednesday: { subject: 'Handwriting Practice', teacher: 'Mrs. Subhashini R' },
    thursday: { subject: 'Social Studies', teacher: 'Mrs. Kalaiselvi N' },
    friday: { subject: 'Art & Clay Craft', teacher: 'Mrs. Anandhi K' },
  },
  {
    id: 'p-8',
    periodNumber: 6,
    time: '1:45 - 2:30 PM',
    monday: { subject: 'Drawing & Painting', teacher: 'Mrs. Anandhi K' },
    tuesday: { subject: 'Tamil Recitation', teacher: 'Mrs. Subhashini R' },
    wednesday: { subject: 'Mental Math & Abacus', teacher: 'Mr. Balaji M' },
    thursday: { subject: 'Library & Reading', teacher: 'Mrs. Jayanthi S' },
    friday: { subject: 'Quiz & General Knowledge', teacher: 'Mrs. Kalaiselvi N' },
  },
  {
    id: 'p-9',
    periodNumber: 7,
    time: '2:30 - 3:15 PM',
    monday: { subject: 'Physical Education & Games', teacher: 'Mr. Kumaran T' },
    tuesday: { subject: 'Yoga & Coordination Drills', teacher: 'Mr. Kumaran T' },
    wednesday: { subject: 'Karate & Self Defense', teacher: 'Special Coach' },
    thursday: { subject: 'Outdoor Sports & Play', teacher: 'Mr. Kumaran T' },
    friday: { subject: 'Weekend Assembly & National Anthem', teacher: 'All Teachers' },
  },
];

export const TimetableModule: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassName>('Class 1');
  const [scheduleData, setScheduleData] = useState<Record<string, TimetablePeriod[]>>(() => {
    return readStored('wisdom_timetable_schedules', { 'Class 1': DEFAULT_PERIODS });
  });

  const periods = scheduleData[selectedClass] || DEFAULT_PERIODS;

  useEffect(() => {
    writeStored('wisdom_timetable_schedules', scheduleData);
  }, [scheduleData]);

  const days: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'> = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ];

  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
  };

  // Modals State
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<TimetablePeriod | null>(null);
  const [form, setForm] = useState<Omit<TimetablePeriod, 'id'>>({
    time: '3:15 - 4:00 PM',
    periodNumber: 8,
    isBreak: false,
    monday: { subject: 'Remedial Class', teacher: 'Subject Teacher' },
    tuesday: { subject: 'Remedial Class', teacher: 'Subject Teacher' },
    wednesday: { subject: 'Remedial Class', teacher: 'Subject Teacher' },
    thursday: { subject: 'Remedial Class', teacher: 'Subject Teacher' },
    friday: { subject: 'Remedial Class', teacher: 'Subject Teacher' },
  });

  const handleOpenAdd = () => {
    setEditingPeriod(null);
    setForm({
      time: '3:15 - 4:00 PM',
      periodNumber: periods.length + 1,
      isBreak: false,
      monday: { subject: 'Special Practice / Spoken English', teacher: 'Mrs. Jayanthi S' },
      tuesday: { subject: 'Special Practice / Spoken English', teacher: 'Mrs. Jayanthi S' },
      wednesday: { subject: 'Special Practice / Spoken English', teacher: 'Mrs. Jayanthi S' },
      thursday: { subject: 'Special Practice / Spoken English', teacher: 'Mrs. Jayanthi S' },
      friday: { subject: 'Special Practice / Spoken English', teacher: 'Mrs. Jayanthi S' },
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: TimetablePeriod) => {
    setEditingPeriod(p);
    setForm({
      time: p.time,
      periodNumber: p.periodNumber,
      isBreak: p.isBreak || false,
      monday: { ...p.monday },
      tuesday: { ...p.tuesday },
      wednesday: { ...p.wednesday },
      thursday: { ...p.thursday },
      friday: { ...p.friday },
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, time: string) => {
    if (window.confirm(`Delete period slot "${time}" from ${selectedClass}?`)) {
      const updatedList = periods.filter((p) => p.id !== id);
      setScheduleData({
        ...scheduleData,
        [selectedClass]: updatedList,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList: TimetablePeriod[];
    if (editingPeriod) {
      updatedList = periods.map((p) =>
        p.id === editingPeriod.id ? { ...editingPeriod, ...form } : p
      );
    } else {
      const newP: TimetablePeriod = {
        id: `p-${Date.now()}`,
        ...form,
      };
      updatedList = [...periods, newP];
    }

    setScheduleData({
      ...scheduleData,
      [selectedClass]: updatedList,
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-900" />
            <span>Class Timetable & Master Schedules</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Mon - Fri (9:00 AM - 3:15 PM)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Daily period distribution, subject teachers & lunch intervals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Select Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassName)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
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

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Period Slot</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Print Timetable"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
            Weekly Schedule for {selectedClass} • Academic Year 2026-2027
          </span>
          <span className="text-[11px] text-slate-500 font-semibold">
            {periods.length} Daily Slots
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-blue-900 text-white font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 w-36">Period & Time</th>
                {days.map((d) => (
                  <th key={d} className="p-3">{dayLabels[d]}</th>
                ))}
                <th className="p-3 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periods.map((p) => {
                const isBreak = p.isBreak || p.monday.subject.includes('Break');
                return (
                  <tr key={p.id} className={isBreak ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'}>
                    <td className="p-3 font-mono font-bold text-slate-700 bg-slate-50/80 whitespace-nowrap">
                      <div className="text-slate-900 font-bold">{p.time}</div>
                      {!isBreak && (
                        <span className="text-[10px] text-blue-700 font-bold">
                          Period {p.periodNumber}
                        </span>
                      )}
                    </td>

                    {days.map((d) => (
                      <td key={d} className="p-3 min-w-[130px]">
                        {isBreak ? (
                          <span className="text-amber-900 font-bold text-xs">{p[d].subject}</span>
                        ) : (
                          <div>
                            <div className="font-bold text-slate-900">{p[d].subject}</div>
                            <div className="text-[10px] text-slate-500">{p[d].teacher}</div>
                          </div>
                        )}
                      </td>
                    ))}

                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                          title="Edit Period"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.time)}
                          className="p-1 text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Period"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Period Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingPeriod ? `Edit Schedule Slot (${selectedClass})` : `Add New Slot (${selectedClass})`}
                </h3>
                <p className="text-xs text-blue-200">Wisdom Nursery & Primary School - Essur</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="e.g. 10:45 - 11:30 AM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Period Number</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={form.periodNumber}
                    onChange={(e) => setForm({ ...form, periodNumber: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBreak}
                    onChange={(e) => setForm({ ...form, isBreak: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Mark as Snack / Lunch Break Interval</span>
                </label>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-black uppercase text-slate-500 mb-2">
                  Daily Subject & Teacher Assignment
                </h4>

                <div className="space-y-3">
                  {days.map((day) => (
                    <div key={day} className="grid grid-cols-3 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-800 uppercase text-[10px]">
                        {dayLabels[day]}
                      </span>
                      <input
                        type="text"
                        value={form[day].subject}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [day]: { ...form[day], subject: e.target.value },
                          })
                        }
                        placeholder="Subject Name"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                      />
                      <input
                        type="text"
                        value={form[day].teacher}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [day]: { ...form[day], teacher: e.target.value },
                          })
                        }
                        placeholder="Teacher"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingPeriod ? 'Update Slot' : 'Save Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
