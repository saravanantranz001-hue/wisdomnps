import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  BookOpen,
  MapPin,
  Award,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle2
} from 'lucide-react';
import { CLASS_SUMMARY } from '../data/initialData';
import { readStored, writeStored } from '../utils/storage';

export interface ClassSectionItem {
  id: string;
  className: string;
  section: string;
  count: number;
  capacity: number;
  teacher: string;
  room: string;
  color: string;
  timing: string;
  syllabus: string;
}

const INITIAL_CLASSES: ClassSectionItem[] = CLASS_SUMMARY.map((c, idx) => ({
  id: `cls-${idx + 1}`,
  className: c.className,
  section: 'Section A',
  count: c.count,
  capacity: 35,
  teacher: c.teacher,
  room: c.room,
  color: c.color,
  timing: '9:00 AM - 3:15 PM',
  syllabus: 'Samacheer Kalvi & Montessori Activity Based',
}));

export const ClassesSections: React.FC = () => {
  const [classList, setClassList] = useState<ClassSectionItem[]>(() => {
    return readStored('wisdom_classes_sections', INITIAL_CLASSES);
  });

  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSectionItem | null>(null);
  const [form, setForm] = useState({
    className: 'Class 1',
    section: 'Section A',
    count: 28,
    capacity: 35,
    teacher: 'Mrs. Jayanthi S',
    room: 'Room 101, Main Block',
    color: '#2563eb',
    timing: '9:00 AM - 3:15 PM',
    syllabus: 'Tamil Nadu Samacheer Kalvi',
  });

  useEffect(() => {
    writeStored('wisdom_classes_sections', classList);
  }, [classList]);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setForm({
      className: 'Class 1',
      section: 'Section B',
      count: 25,
      capacity: 35,
      teacher: 'Mrs. Subhashini R',
      room: 'Room 104, Block B',
      color: '#059669',
      timing: '9:00 AM - 3:15 PM',
      syllabus: 'Tamil Nadu Samacheer Kalvi',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: ClassSectionItem) => {
    setEditingClass(c);
    setForm({
      className: c.className,
      section: c.section,
      count: c.count,
      capacity: c.capacity,
      teacher: c.teacher,
      room: c.room,
      color: c.color,
      timing: c.timing,
      syllabus: c.syllabus,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete class record "${name}"?`)) {
      setClassList(classList.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.className || !form.teacher) return;

    if (editingClass) {
      setClassList(
        classList.map((c) => (c.id === editingClass.id ? { ...editingClass, ...form } : c))
      );
    } else {
      const newClass: ClassSectionItem = {
        id: `cls-${Date.now()}`,
        ...form,
      };
      setClassList([...classList, newClass]);
    }
    setShowModal(false);
  };

  const totalStudents = classList.reduce((acc, c) => acc + c.count, 0);

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Classes & Sections Management</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              {classList.length} Classes • {totalStudents} Total Students
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Classroom allocation, class teacher in-charges & strength
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class / Section</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {classList.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top color ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: c.color }} />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-black text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.className}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {c.section}
                </span>
              </div>

              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-slate-900">{c.count}</div>
                  <div className="text-[11px] font-semibold text-slate-500">Enrolled Students</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold">Capacity</span>
                  <div className="text-xs font-bold text-slate-700">{c.capacity} max</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">Class Teacher:</span>
                  <strong className="text-slate-800 truncate">{c.teacher}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-700">{c.room}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  <span>Timing: {c.timing}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-emerald-600">● Active</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  title="Edit Class"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(c.id, `${c.className} - ${c.section}`)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  title="Delete Class"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingClass ? 'Edit Class & Section' : 'Add New Class & Section'}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class Name *</label>
                  <input
                    type="text"
                    required
                    value={form.className}
                    onChange={(e) => setForm({ ...form, className: e.target.value })}
                    placeholder="e.g. Class 1 or UKG"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Section</label>
                  <input
                    type="text"
                    required
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    placeholder="e.g. Section A"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Class Teacher Incharge *</label>
                <input
                  type="text"
                  required
                  value={form.teacher}
                  onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                  placeholder="e.g. Mrs. Jayanthi S"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current Enrolled</label>
                  <input
                    type="number"
                    min="0"
                    value={form.count}
                    onChange={(e) => setForm({ ...form, count: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 35 })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Room / Location</label>
                  <input
                    type="text"
                    value={form.room}
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                    placeholder="e.g. Room 101, Main Block"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Badge Theme Color</label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full h-9 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
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
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
