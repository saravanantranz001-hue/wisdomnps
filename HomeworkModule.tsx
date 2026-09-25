import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  Share2,
  Calendar,
  BookOpen,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Send
} from 'lucide-react';
import { INITIAL_HOMEWORK } from '../data/initialData';
import { Homework, ClassName } from '../types';
import { readStored, writeStored } from '../utils/storage';

export const HomeworkModule: React.FC = () => {
  const [homeworkList, setHomeworkList] = useState<Homework[]>(() => {
    return readStored('wisdom_homework', INITIAL_HOMEWORK);
  });

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingHw, setEditingHw] = useState<Homework | null>(null);

  const [form, setForm] = useState<Partial<Homework>>({
    className: 'Class 2',
    subject: 'Mathematics',
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    teacherName: 'Mrs. Uma Maheswari',
  });

  useEffect(() => {
    writeStored('wisdom_homework', homeworkList);
  }, [homeworkList]);

  const handleOpenAdd = () => {
    setEditingHw(null);
    setForm({
      className: 'Class 2',
      subject: 'Mathematics',
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      teacherName: 'Mrs. Uma Maheswari',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (hw: Homework) => {
    setEditingHw(hw);
    setForm({
      className: hw.className,
      subject: hw.subject,
      title: hw.title,
      description: hw.description,
      dueDate: hw.dueDate,
      teacherName: hw.teacherName,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete homework "${title}"?`)) {
      setHomeworkList(homeworkList.filter((h) => h.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    if (editingHw) {
      setHomeworkList(
        homeworkList.map((h) =>
          h.id === editingHw.id
            ? {
                ...editingHw,
                className: (form.className as ClassName) || editingHw.className,
                subject: form.subject || editingHw.subject,
                title: form.title || editingHw.title,
                description: form.description || editingHw.description,
                dueDate: form.dueDate || editingHw.dueDate,
                teacherName: form.teacherName || editingHw.teacherName,
              }
            : h
        )
      );
    } else {
      const hw: Homework = {
        id: `hw-${Date.now()}`,
        className: (form.className as ClassName) || 'Class 2',
        subject: form.subject || 'General',
        title: form.title || '',
        description: form.description || '',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: form.dueDate || new Date().toISOString().split('T')[0],
        teacherName: form.teacherName || 'Class Teacher',
      };
      setHomeworkList([hw, ...homeworkList]);
    }

    setShowModal(false);
  };

  const handleShareWhatsApp = (hw: Homework) => {
    const text = encodeURIComponent(
      `📚 *WISDOM NURSERY & PRIMARY SCHOOL, ESSUR*\n*HOMEWORK ASSIGNMENT*\n\n🎯 *Class:* ${hw.className}\n📖 *Subject:* ${hw.subject}\n📌 *Topic:* ${hw.title}\n\n📝 *Details:*\n${hw.description}\n\n⏳ *Due Date:* ${hw.dueDate}\n👩‍🏫 *Assigned By:* ${hw.teacherName}\n\n_Please ensure your child completes this assignment before class._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const filtered = selectedClass === 'All'
    ? homeworkList
    : homeworkList.filter((h) => h.className === selectedClass);

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <span>Homework & Daily Digital Diary</span>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
              {homeworkList.length} Active Assignments
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Daily tasks, reading lessons and parent WhatsApp dispatch
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Homework</span>
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500">Filter by Class:</span>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-900"
        >
          <option value="All">All Classes</option>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((hw) => (
          <div
            key={hw.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {hw.className}
                    </span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {hw.subject}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{hw.title}</h3>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <span>Due:</span>
                  <div className="font-bold text-rose-600">{hw.dueDate}</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {hw.description}
              </div>

              <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Teacher: <strong className="text-slate-700">{hw.teacherName}</strong></span>
                <span className="text-slate-400">Assigned: {hw.assignedDate}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleShareWhatsApp(hw)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Send WhatsApp</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(hw)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  title="Edit Assignment"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(hw.id, hw.title)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  title="Delete Assignment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Homework Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-indigo-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingHw ? 'Edit Homework Assignment' : 'Assign New Homework'}
                </h3>
                <p className="text-xs text-indigo-200">Wisdom Nursery & Primary School - Essur</p>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class *</label>
                  <select
                    value={form.className}
                    onChange={(e) => setForm({ ...form, className: e.target.value as ClassName })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
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

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Chapter 3: Addition with Carry-over Problems"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Instructions / Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Complete Exercise 3.2 on Page 45 in Classwork Notebook..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Submission Due Date *</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned By Teacher</label>
                  <input
                    type="text"
                    value={form.teacherName}
                    onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                    placeholder="Mrs. Uma Maheswari"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
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
                  className="px-5 py-2 text-xs font-bold bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingHw ? 'Update Assignment' : 'Assign Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
