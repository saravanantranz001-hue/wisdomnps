import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Phone,
  CreditCard,
  Printer,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  QrCode,
  Share2,
  Sliders,
  BadgeAlert,
  Bus,
  FileSpreadsheet,
  Upload,
  Download,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { Student, ClassName } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { SCHOOL_INFO, VAN_ROUTES } from '../data/initialData';
import { StudentIdCardGenerator } from './StudentIdCardGenerator';
import { exportStudentsToExcel, downloadStudentImportTemplate } from '../utils/excelUtils';
import { ImportStudentsModal } from './ImportStudentsModal';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onOpenGPayForStudent: (student: Student) => void;
  onBatchImportStudents?: (students: Student[], mode: 'append' | 'replace') => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onOpenGPayForStudent,
  onBatchImportStudents,
}) => {
  const [activeView, setActiveView] = useState<'directory' | 'id-cards'>('directory');
  const [generatorSelectedStudentId, setGeneratorSelectedStudentId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingIdCard, setViewingIdCard] = useState<Student | null>(null);

  // New Student Form State
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    className: 'Nursery',
    section: 'A',
    gender: 'Boy',
    rollNo: '',
    admissionNo: `WES/2025/${Math.floor(100 + Math.random() * 900)}`,
    parentName: '',
    parentPhone: '',
    parentGPay: '',
    address: 'Essur - 603310',
    bloodGroup: 'O+',
    totalFee: 15000,
    paidFee: 5000,
    pendingFee: 10000,
    feeStatus: 'Partial',
    attendanceRate: 95,
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.parentPhone) return;

    const total = Number(newStudent.totalFee) || 15000;
    const paid = Number(newStudent.paidFee) || 0;
    const pending = Math.max(0, total - paid);
    const status: 'Paid' | 'Partial' | 'Pending' = paid >= total ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';

    const created: Student = {
      id: `std-${Date.now()}`,
      admissionNo: newStudent.admissionNo || `WES/2025/${Math.floor(100 + Math.random() * 900)}`,
      name: newStudent.name || 'New Student',
      rollNo: newStudent.rollNo || `${students.length + 1}`,
      className: (newStudent.className as ClassName) || 'Nursery',
      section: (newStudent.section as 'A' | 'B') || 'A',
      gender: (newStudent.gender as 'Boy' | 'Girl') || 'Boy',
      parentName: newStudent.parentName || 'Parent',
      parentPhone: newStudent.parentPhone || '9176593129',
      parentGPay: newStudent.parentGPay || newStudent.parentPhone || '9176593129',
      address: newStudent.address || 'Essur - 603310',
      admissionDate: new Date().toISOString().split('T')[0],
      bloodGroup: newStudent.bloodGroup || 'O+',
      totalFee: total,
      paidFee: paid,
      pendingFee: pending,
      feeStatus: status,
      attendanceRate: 100,
    };

    onAddStudent(created);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      className: 'Nursery',
      section: 'A',
      gender: 'Boy',
      rollNo: '',
      admissionNo: `WES/2025/${Math.floor(100 + Math.random() * 900)}`,
      parentName: '',
      parentPhone: '',
      parentGPay: '',
      address: 'Essur - 603310',
      bloodGroup: 'O+',
      totalFee: 15000,
      paidFee: 5000,
      pendingFee: 10000,
      feeStatus: 'Partial',
      attendanceRate: 100,
    });
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentPhone.includes(searchTerm);

    const matchesClass = selectedClass === 'All' || s.className === selectedClass;
    const matchesFee = selectedFeeStatus === 'All' || s.feeStatus === selectedFeeStatus;

    return matchesSearch && matchesClass && matchesFee;
  });

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Student Management
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              {filteredStudents.length} Students Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Academic Register & Records
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Import Students from Excel / CSV */}
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            title="Import student records from Excel (.xlsx, .xls) or CSV"
          >
            <Upload className="w-4 h-4 text-emerald-300" />
            <span>Import Students</span>
            <span className="text-[10px] bg-emerald-400 text-emerald-950 font-black px-1.5 py-0.2 rounded-full">
              Excel
            </span>
          </button>

          {/* Export to Excel Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Export students data to Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export Excel</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Excel Export Options
                </div>
                <button
                  onClick={() => {
                    exportStudentsToExcel(students, 'All');
                    setShowExportMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Export All Students</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {students.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    const label = selectedClass !== 'All' ? `${selectedClass}` : 'Filtered';
                    exportStudentsToExcel(filteredStudents, label);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileDown className="w-4 h-4 text-blue-600" />
                    <span>Export Current Filtered</span>
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    {filteredStudents.length}
                  </span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    downloadStudentImportTemplate();
                    setShowExportMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-600" />
                  <span>Download Blank Template (.xlsx)</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setGeneratorSelectedStudentId(null);
              setActiveView('id-cards');
            }}
            className="px-3.5 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>ID Card Generator</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
              Print
            </span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 print:hidden">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveView('directory');
              setGeneratorSelectedStudentId(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeView === 'directory'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Student Directory & Academic Register ({students.length})
          </button>

          <button
            onClick={() => {
              setActiveView('id-cards');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'id-cards'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>ID Card Generator & Batch Printing Tool</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Academic Year: <strong className="text-slate-700">{SCHOOL_INFO.academicYear}</strong>
        </span>
      </div>

      {/* Dynamic Content Based on Active Sub-View */}
      {activeView === 'id-cards' ? (
        <StudentIdCardGenerator
          students={students}
          initialSelectedStudentId={generatorSelectedStudentId}
          onBackToDirectory={() => {
            setActiveView('directory');
            setGeneratorSelectedStudentId(null);
          }}
        />
      ) : (
        <>
          {/* Filters and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name, roll no, admission no, or phone..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Class Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:bg-white focus:outline-hidden"
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

            {/* Fee Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Fee:</span>
              <select
                value={selectedFeeStatus}
                onChange={(e) => setSelectedFeeStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:bg-white focus:outline-hidden"
              >
                <option value="All">All Fees</option>
                <option value="Paid">Fully Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Students Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Roll / Adm</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Class & Sec</th>
                    <th className="p-3.5">Parent & Phone</th>
                    <th className="p-3.5">Fee Status</th>
                    <th className="p-3.5">Pending (₹)</th>
                    <th className="p-3.5">Attendance</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Roll / Adm */}
                        <td className="p-3.5 font-mono">
                          <span className="font-bold text-slate-800">#{std.rollNo}</span>
                          <div className="text-[10px] text-slate-400">{std.admissionNo}</div>
                        </td>

                        {/* Student Name */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                                std.gender === 'Boy' ? 'bg-sky-500' : 'bg-rose-400'
                              }`}
                            >
                              {std.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{std.name}</span>
                                {std.usesVan && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-semibold" title={`Van Route: ${std.vanRoute || ''}`}>
                                    <Bus className="w-2.5 h-2.5 text-amber-600" />
                                    <span>{std.vanStop || 'Van'}</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{std.gender} • Blood: {std.bloodGroup}</div>
                            </div>
                          </div>
                        </td>

                        {/* Class & Sec */}
                        <td className="p-3.5">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {std.className} - {std.section}
                          </span>
                        </td>

                        {/* Parent & Phone */}
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{std.parentName}</div>
                          <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                            <a href={`tel:${std.parentPhone}`} className="hover:text-blue-600 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{std.parentPhone}</span>
                            </a>
                          </div>
                        </td>

                        {/* Fee Status */}
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              std.feeStatus === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : std.feeStatus === 'Partial'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {std.feeStatus === 'Paid' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {std.feeStatus}
                          </span>
                        </td>

                        {/* Pending Amount */}
                        <td className="p-3.5">
                          {std.pendingFee > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-rose-600">₹{std.pendingFee.toLocaleString('en-IN')}</span>
                              <button
                                onClick={() => onOpenGPayForStudent(std)}
                                className="p-1 hover:bg-emerald-50 rounded text-emerald-600 cursor-pointer"
                                title="Collect Fee via GPay"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium">Nil</span>
                          )}
                        </td>

                        {/* Attendance */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${std.attendanceRate}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-700">{std.attendanceRate}%</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setGeneratorSelectedStudentId(std.id);
                                setActiveView('id-cards');
                              }}
                              className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                              title="Generate & Print Professional ID Card"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>ID Card</span>
                            </button>

                            <button
                              onClick={() => setViewingIdCard(std)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                              title="Quick Preview"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <a
                              href={`https://wa.me/91${std.parentPhone}?text=Hello%20${encodeURIComponent(std.parentName)},%20Greetings%20from%20Wisdom%20Nursery%20and%20Primary%20School,%20Essur.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
                              title="WhatsApp Parent"
                            >
                              <Share2 className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => setEditingStudent(std)}
                              className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
                              title="Edit Student Record & Van Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => onDeleteStudent(std.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* New Student Admission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Student Admission Form</h3>
                <p className="text-xs text-blue-200">Wisdom Nursery & Primary School - Essur</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
                    placeholder="e.g. Priyadharshini K"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
                    placeholder="e.g. 25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class *</label>
                  <select
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value as ClassName })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Section</label>
                  <select
                    value={newStudent.section}
                    onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value as 'A' | 'B' })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as 'Boy' | 'Girl' })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Father / Parent Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
                    placeholder="Parent / Guardian Name"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
                    placeholder="10 digit mobile"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Annual Fee (₹)</label>
                  <input
                    type="number"
                    value={newStudent.totalFee}
                    onChange={(e) => setNewStudent({ ...newStudent, totalFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Paid at Admission (₹)</label>
                  <input
                    type="number"
                    value={newStudent.paidFee}
                    onChange={(e) => setNewStudent({ ...newStudent, paidFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Van Transport Service Details in Add Modal */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <Bus className="w-4 h-4 text-amber-600" />
                    <span>School Van Transport Service</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!newStudent.usesVan}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const defaultRoute = VAN_ROUTES[0];
                        setNewStudent({
                          ...newStudent,
                          usesVan: checked,
                          vanRoute: checked ? (newStudent.vanRoute || defaultRoute.routeName) : undefined,
                          vanStop: checked ? (newStudent.vanStop || defaultRoute.stops[0]) : undefined,
                          vanFeeMonthly: checked ? (newStudent.vanFeeMonthly || defaultRoute.monthlyFee) : undefined,
                          vanFeeTotal: checked ? defaultRoute.monthlyFee * 10 : 0,
                          vanFeePending: checked ? defaultRoute.monthlyFee * 10 : 0,
                        });
                      }}
                      className="rounded text-amber-600"
                    />
                    <span>Enroll in School Van</span>
                  </label>
                </div>

                {newStudent.usesVan && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Select Route</label>
                      <select
                        value={newStudent.vanRoute || VAN_ROUTES[0].routeName}
                        onChange={(e) => {
                          const r = VAN_ROUTES.find((item) => item.routeName === e.target.value);
                          setNewStudent({
                            ...newStudent,
                            vanRoute: e.target.value,
                            vanFeeMonthly: r ? r.monthlyFee : 800,
                            vanFeeTotal: (r ? r.monthlyFee : 800) * 10,
                            vanFeePending: (r ? r.monthlyFee : 800) * 10,
                            vanStop: r?.stops[0] || 'Main Gate',
                          });
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                      >
                        {VAN_ROUTES.map((r) => (
                          <option key={r.id} value={r.routeName}>
                            {r.routeName} (₹{r.monthlyFee}/mo)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Boarding / Drop Stop</label>
                      <input
                        type="text"
                        value={newStudent.vanStop || ''}
                        onChange={(e) => setNewStudent({ ...newStudent, vanStop: e.target.value })}
                        placeholder="e.g. Temple Arch, Post Office"
                        className="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Street, Essur - 603310"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Confirm & Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT & VAN DETAILS MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Edit className="w-4 h-4 text-amber-300" />
                  <span>Edit Student Record & Van Details</span>
                </h3>
                <p className="text-xs text-blue-200">
                  {editingStudent.name} • Admission #{editingStudent.admissionNo}
                </p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateStudent(editingStudent);
                setEditingStudent(null);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={editingStudent.rollNo}
                    onChange={(e) => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class</label>
                  <select
                    value={editingStudent.className}
                    onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value as ClassName })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Section</label>
                  <select
                    value={editingStudent.section}
                    onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value as 'A' | 'B' })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={editingStudent.gender}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as 'Boy' | 'Girl' })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.parentName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Parent Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={editingStudent.parentPhone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value, parentGPay: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Fees overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Annual Fee (₹)</label>
                  <input
                    type="number"
                    value={editingStudent.totalFee}
                    onChange={(e) => {
                      const tot = Number(e.target.value);
                      const pend = Math.max(0, tot - editingStudent.paidFee);
                      setEditingStudent({
                        ...editingStudent,
                        totalFee: tot,
                        pendingFee: pend,
                        feeStatus: editingStudent.paidFee >= tot ? 'Paid' : editingStudent.paidFee > 0 ? 'Partial' : 'Pending',
                      });
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Paid Fee (₹)</label>
                  <input
                    type="number"
                    value={editingStudent.paidFee}
                    onChange={(e) => {
                      const pd = Number(e.target.value);
                      const pend = Math.max(0, editingStudent.totalFee - pd);
                      setEditingStudent({
                        ...editingStudent,
                        paidFee: pd,
                        pendingFee: pend,
                        feeStatus: pd >= editingStudent.totalFee ? 'Paid' : pd > 0 ? 'Partial' : 'Pending',
                      });
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800"
                  />
                </div>
              </div>

              {/* Van Transport Service Details in Edit Form */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <Bus className="w-4 h-4 text-amber-600" />
                    <span>Van Transport Service Details</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingStudent.usesVan}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const defaultRoute = VAN_ROUTES[0];
                        const vanMonthly = defaultRoute.monthlyFee;
                        const vanAnnual = vanMonthly * 10;
                        setEditingStudent({
                          ...editingStudent,
                          usesVan: checked,
                          vanRoute: checked ? (editingStudent.vanRoute || defaultRoute.routeName) : undefined,
                          vanStop: checked ? (editingStudent.vanStop || defaultRoute.stops[0]) : undefined,
                          vanFeeMonthly: checked ? (editingStudent.vanFeeMonthly || vanMonthly) : undefined,
                          vanFeeTotal: checked ? vanAnnual : 0,
                          vanFeePending: checked ? Math.max(0, vanAnnual - (editingStudent.vanFeePaid ?? 0)) : 0,
                        });
                      }}
                      className="rounded text-amber-600"
                    />
                    <span>Uses School Van</span>
                  </label>
                </div>

                {editingStudent.usesVan && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Assigned Van Route</label>
                      <select
                        value={editingStudent.vanRoute || VAN_ROUTES[0].routeName}
                        onChange={(e) => {
                          const r = VAN_ROUTES.find((item) => item.routeName === e.target.value);
                          setEditingStudent({
                            ...editingStudent,
                            vanRoute: e.target.value,
                            vanFeeMonthly: r ? r.monthlyFee : editingStudent.vanFeeMonthly,
                            vanStop: r?.stops[0] || editingStudent.vanStop || 'Main Gate',
                          });
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                      >
                        {VAN_ROUTES.map((r) => (
                          <option key={r.id} value={r.routeName}>
                            {r.routeName} (₹{r.monthlyFee}/mo)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Boarding / Drop Stop</label>
                      <input
                        type="text"
                        value={editingStudent.vanStop || ''}
                        onChange={(e) => setEditingStudent({ ...editingStudent, vanStop: e.target.value })}
                        placeholder="e.g. Temple Arch, Post Office"
                        className="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={editingStudent.address}
                  onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteStudent(editingStudent.id);
                    setEditingStudent(null);
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Student</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    Save Student Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student ID Card Print Modal */}
      {viewingIdCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold">Student Identity Card</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs px-2 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setViewingIdCard(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ID Card Front */}
            <div className="p-5 text-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
              <div className="flex justify-center mb-1">
                <SchoolLogo size={55} />
              </div>
              <h4 className="font-serif font-black text-xs text-blue-950 uppercase tracking-tight">
                {SCHOOL_INFO.fullName}
              </h4>
              <p className="text-[10px] text-red-700 font-bold mb-3">Essur - 603310 • Phone: 9176593129</p>

              {/* Photo Box */}
              <div className="w-20 h-24 mx-auto rounded-xl bg-slate-200 border-2 border-blue-600 flex items-center justify-center font-bold text-slate-500 text-xl shadow-sm mb-3">
                {viewingIdCard.name.charAt(0)}
              </div>

              <h3 className="font-black text-sm text-slate-900">{viewingIdCard.name}</h3>
              <p className="text-xs font-bold text-blue-700 uppercase">
                {viewingIdCard.className} - Section {viewingIdCard.section}
              </p>

              <div className="mt-3 text-[11px] text-left space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div><span className="text-slate-400">Roll No:</span> <strong className="text-slate-800">#{viewingIdCard.rollNo}</strong></div>
                <div><span className="text-slate-400">Adm No:</span> <strong className="text-slate-800">{viewingIdCard.admissionNo}</strong></div>
                <div><span className="text-slate-400">Parent:</span> <strong className="text-slate-800">{viewingIdCard.parentName}</strong></div>
                <div><span className="text-slate-400">Phone:</span> <strong className="text-slate-800">{viewingIdCard.parentPhone}</strong></div>
                <div><span className="text-slate-400">Blood Group:</span> <strong className="text-rose-600">{viewingIdCard.bloodGroup}</strong></div>
              </div>

              {/* Barcode line */}
              <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                <span>Academic 2026-2027</span>
                <span className="font-bold text-blue-900">Principal Signature</span>
              </div>

              {/* Action to switch to full ID generator */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetId = viewingIdCard.id;
                    setViewingIdCard(null);
                    setGeneratorSelectedStudentId(targetId);
                    setActiveView('id-cards');
                  }}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Customize in ID Card Tool</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Students from Excel / CSV Modal */}
      <ImportStudentsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportStudents={(imported, mode) => {
          if (onBatchImportStudents) {
            onBatchImportStudents(imported, mode);
          } else {
            imported.forEach((s) => onAddStudent(s));
          }
        }}
        existingCount={students.length}
      />
    </div>
  );
};
