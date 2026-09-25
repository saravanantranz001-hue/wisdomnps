import React, { useState, useEffect } from 'react';
import {
  Award,
  FileText,
  Printer,
  CheckCircle,
  Search,
  User,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { INITIAL_EXAM_MARKS, SCHOOL_INFO } from '../data/initialData';
import { ExamMark, ClassName } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { readStored, writeStored } from '../utils/storage';

export const ExamsMarks: React.FC = () => {
  const [examMarks, setExamMarks] = useState<ExamMark[]>(() => {
    return readStored('wisdom_exam_marks', INITIAL_EXAM_MARKS);
  });

  const [selectedMark, setSelectedMark] = useState<ExamMark | null>(null);
  const [filterClass, setFilterClass] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExamMark | null>(null);
  const [form, setForm] = useState({
    studentName: '',
    className: 'Class 1' as ClassName,
    examName: 'Term 1 Quarterly Examination 2025',
    subjects: [
      { name: 'Tamil', marksObtained: 85, maxMarks: 100, grade: 'A' },
      { name: 'English', marksObtained: 88, maxMarks: 100, grade: 'A' },
      { name: 'Mathematics', marksObtained: 92, maxMarks: 100, grade: 'A+' },
      { name: 'EVS / Science', marksObtained: 86, maxMarks: 100, grade: 'A' },
    ],
  });

  useEffect(() => {
    writeStored('wisdom_exam_marks', examMarks);
  }, [examMarks]);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setForm({
      studentName: '',
      className: 'Class 1',
      examName: 'Term 1 Quarterly Examination 2025',
      subjects: [
        { name: 'Tamil', marksObtained: 85, maxMarks: 100, grade: 'A' },
        { name: 'English', marksObtained: 88, maxMarks: 100, grade: 'A' },
        { name: 'Mathematics', marksObtained: 92, maxMarks: 100, grade: 'A+' },
        { name: 'EVS / Science', marksObtained: 86, maxMarks: 100, grade: 'A' },
      ],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (rec: ExamMark) => {
    setEditingRecord(rec);
    setForm({
      studentName: rec.studentName,
      className: rec.className,
      examName: rec.examName,
      subjects: rec.subjects.map((s) => ({ ...s })),
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete exam record for student "${name}"?`)) {
      setExamMarks(examMarks.filter((e) => e.id !== id));
    }
  };

  const calculateGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 35) return 'D';
    return 'E';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName) return;

    const totalMarks = form.subjects.reduce((sum, s) => sum + s.marksObtained, 0);
    const maxTotal = form.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const percentage = Math.round((totalMarks / maxTotal) * 100);
    const overallGrade = calculateGrade(percentage);

    if (editingRecord) {
      setExamMarks(
        examMarks.map((rec) =>
          rec.id === editingRecord.id
            ? {
                ...editingRecord,
                studentName: form.studentName,
                className: form.className,
                examName: form.examName,
                subjects: form.subjects,
                totalMarks,
                maxTotal,
                percentage,
                overallGrade,
              }
            : rec
        )
      );
    } else {
      const newRec: ExamMark = {
        id: `exam-${Date.now()}`,
        studentId: `std-custom-${Date.now()}`,
        studentName: form.studentName,
        className: form.className,
        examName: form.examName,
        term: 'Term 1',
        subjects: form.subjects,
        totalMarks,
        maxTotal,
        percentage,
        overallGrade,
      };
      setExamMarks([newRec, ...examMarks]);
    }

    setShowModal(false);
  };

  const filtered = examMarks.filter((em) => {
    const matchClass = filterClass === 'All' || em.className === filterClass;
    const matchSearch = em.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-700" />
            <span>Exams, Marks & Progress Report Cards</span>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
              {examMarks.length} Evaluated Records
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Grading, progress evaluation and printable report sheets
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Exam Marks</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Filter Class:</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
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
      </div>

      {/* Marks Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((em) => (
          <div
            key={em.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    {em.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{em.studentName}</h3>
                    <p className="text-xs text-purple-700 font-semibold">{em.className} • {em.examName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black">
                    Grade {em.overallGrade}
                  </span>
                  <div className="text-[11px] font-bold text-slate-500 mt-1">{em.percentage}%</div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="mt-4 divide-y divide-slate-100 text-xs">
                {em.subjects.map((s, idx) => (
                  <div key={idx} className="py-1.5 flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{s.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{s.marksObtained} / {s.maxMarks}</span>
                      <span className="w-6 text-center font-bold text-emerald-700 bg-emerald-50 rounded">
                        {s.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600">
                Total: <strong className="text-slate-900">{em.totalMarks} / {em.maxTotal}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedMark(em)}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Report Card</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(em)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                  title="Edit Marks"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(em.id, em.studentName)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold cursor-pointer"
                  title="Delete Exam Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Report Card Modal */}
      {selectedMark && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold">Official Student Progress Card</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedMark(null)}
                  className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 bg-white space-y-4">
              <div className="text-center pb-4 border-b border-slate-200">
                <div className="flex justify-center mb-1">
                  <SchoolLogo size={50} />
                </div>
                <h2 className="font-serif font-black text-sm text-blue-950 uppercase">
                  {SCHOOL_INFO.fullName}
                </h2>
                <p className="text-[10px] text-slate-500">{SCHOOL_INFO.address}</p>
                <span className="inline-block mt-2 px-3 py-0.5 bg-blue-50 text-blue-900 font-bold text-xs rounded-full border border-blue-200">
                  {selectedMark.examName}
                </span>
              </div>

              <div className="grid grid-cols-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900 block">{selectedMark.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Class & Section:</span>
                  <strong className="text-slate-900 block">{selectedMark.className} - Section A</strong>
                </div>
              </div>

              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-600">
                  <tr>
                    <th className="p-2">Subject</th>
                    <th className="p-2 text-right">Max Marks</th>
                    <th className="p-2 text-right">Marks Obtained</th>
                    <th className="p-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedMark.subjects.map((sub, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium text-slate-800">{sub.name}</td>
                      <td className="p-2 text-right text-slate-500">{sub.maxMarks}</td>
                      <td className="p-2 text-right font-bold text-slate-900">{sub.marksObtained}</td>
                      <td className="p-2 text-center font-bold text-emerald-700">{sub.grade}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2 text-slate-900">Total Marks</td>
                    <td className="p-2 text-right text-slate-700">{selectedMark.maxTotal}</td>
                    <td className="p-2 text-right text-blue-900">{selectedMark.totalMarks}</td>
                    <td className="p-2 text-center text-emerald-800 font-black">
                      {selectedMark.overallGrade} ({selectedMark.percentage}%)
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 flex justify-between items-end text-center text-[10px] text-slate-500">
                <div>
                  <div className="w-24 border-b border-slate-300 pb-1 font-bold text-slate-800">
                    Mrs. Jayanthi S
                  </div>
                  <div>Class Teacher</div>
                </div>
                <div>
                  <div className="w-24 border-b border-slate-300 pb-1 font-bold text-slate-800">
                    Wisdom Essur
                  </div>
                  <div>Principal Seal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Exam Marks Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="bg-purple-800 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingRecord ? 'Edit Exam Marks Record' : 'Add New Exam Marks Record'}
                </h3>
                <p className="text-xs text-purple-200">Wisdom Nursery & Primary School - Essur</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="e.g. K. Dhanush"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Exam Term</label>
                  <input
                    type="text"
                    required
                    value={form.examName}
                    onChange={(e) => setForm({ ...form, examName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="text-xs font-black uppercase text-slate-500 block mb-2">
                  Subject Marks Entry
                </label>

                <div className="space-y-2.5">
                  {form.subjects.map((sub, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => {
                            const updated = [...form.subjects];
                            updated[idx].name = e.target.value;
                            setForm({ ...form, subjects: updated });
                          }}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                      <div className="col-span-4 flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max={sub.maxMarks}
                          value={sub.marksObtained}
                          onChange={(e) => {
                            const updated = [...form.subjects];
                            const marks = parseInt(e.target.value) || 0;
                            updated[idx].marksObtained = marks;
                            updated[idx].grade = calculateGrade((marks / sub.maxMarks) * 100);
                            setForm({ ...form, subjects: updated });
                          }}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold text-right"
                        />
                        <span className="text-[10px] text-slate-400">/{sub.maxMarks}</span>
                      </div>
                      <div className="col-span-3 text-center">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {sub.grade}
                        </span>
                      </div>
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
                  className="px-5 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingRecord ? 'Update Record' : 'Save Marks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
