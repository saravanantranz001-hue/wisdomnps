import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  Plus,
  UserCheck,
  Award,
  Edit,
  Trash2,
  X,
  PhoneCall
} from 'lucide-react';
import { Teacher, Staff } from '../types';
import { INITIAL_STAFF } from '../data/initialData';
import { readStored, writeStored } from '../utils/storage';

interface TeachersStaffProps {
  teachers: Teacher[];
  staff?: Staff[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onDeleteTeacher?: (teacherId: string) => void;
  onAddStaff?: (staff: Staff) => void;
  onUpdateStaff?: (staff: Staff) => void;
  onDeleteStaff?: (staffId: string) => void;
  isOpenAddModal?: boolean;
  onCloseAddModal?: () => void;
}

export const TeachersStaff: React.FC<TeachersStaffProps> = ({
  teachers,
  staff: externalStaff,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  isOpenAddModal = false,
  onCloseAddModal,
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'staff'>('teachers');
  
  // Internal staff list if not provided externally
  const [internalStaff, setInternalStaff] = useState<Staff[]>(() => {
    return readStored('wisdom_staff', INITIAL_STAFF);
  });

  const staffList = externalStaff || internalStaff;

  const saveStaffList = (updated: Staff[]) => {
    if (onUpdateStaff || onAddStaff || onDeleteStaff) {
      // handled via props if available
    }
    setInternalStaff(updated);
    writeStored('wisdom_staff', updated);
  };

  // Teacher Modals
  const [showTeacherModal, setShowTeacherModal] = useState(isOpenAddModal);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    designation: 'Primary Teacher',
    qualification: 'B.Ed., B.Sc.',
    subjects: 'English, Science',
    classTeacherOf: 'Class 1',
    phone: '',
    email: '',
    experience: '5 Years',
  });

  // Staff Modals
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Van Driver',
    phone: '',
    joinDate: '2023',
  });

  // Teacher Handlers
  const handleOpenAddTeacher = () => {
    setEditingTeacher(null);
    setTeacherForm({
      name: '',
      designation: 'Primary Teacher',
      qualification: 'B.Ed., B.Sc.',
      subjects: 'Tamil, English',
      classTeacherOf: 'Class 1',
      phone: '',
      email: '',
      experience: '4 Years',
    });
    setShowTeacherModal(true);
  };

  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    setTeacherForm({
      name: t.name,
      designation: t.designation,
      qualification: t.qualification,
      subjects: t.subjects.join(', '),
      classTeacherOf: t.classTeacherOf || '',
      phone: t.phone,
      email: t.email,
      experience: t.experience,
    });
    setShowTeacherModal(true);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete teacher record "${name}"?`)) {
      if (onDeleteTeacher) {
        onDeleteTeacher(id);
      }
    }
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.phone) return;

    if (editingTeacher) {
      const updated: Teacher = {
        ...editingTeacher,
        name: teacherForm.name,
        designation: teacherForm.designation,
        qualification: teacherForm.qualification,
        subjects: teacherForm.subjects.split(',').map((s) => s.trim()),
        classTeacherOf: teacherForm.classTeacherOf || undefined,
        phone: teacherForm.phone,
        email: teacherForm.email || `${teacherForm.name.toLowerCase().replace(/[^a-z]/g, '')}@wisdomschool.org`,
        experience: teacherForm.experience,
      };
      if (onUpdateTeacher) {
        onUpdateTeacher(updated);
      }
    } else {
      const teacherObj: Teacher = {
        id: `tch-${Date.now()}`,
        employeeId: `WNT-0${teachers.length + 1}`,
        name: teacherForm.name,
        designation: teacherForm.designation,
        qualification: teacherForm.qualification,
        subjects: teacherForm.subjects.split(',').map((s) => s.trim()),
        classTeacherOf: teacherForm.classTeacherOf || undefined,
        phone: teacherForm.phone,
        email: teacherForm.email || `${teacherForm.name.toLowerCase().replace(/[^a-z]/g, '')}@wisdomschool.org`,
        joinDate: new Date().toISOString().split('T')[0],
        experience: teacherForm.experience,
      };
      onAddTeacher(teacherObj);
    }

    setShowTeacherModal(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Staff Handlers
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setStaffForm({
      name: '',
      role: 'Van Driver',
      phone: '',
      joinDate: '2024',
    });
    setShowStaffModal(true);
  };

  const handleOpenEditStaff = (s: Staff) => {
    setEditingStaff(s);
    setStaffForm({
      name: s.name,
      role: s.role,
      phone: s.phone,
      joinDate: s.joinDate,
    });
    setShowStaffModal(true);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete staff member "${name}"?`)) {
      if (onDeleteStaff) {
        onDeleteStaff(id);
      } else {
        saveStaffList(staffList.filter((s) => s.id !== id));
      }
    }
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.phone) return;

    if (editingStaff) {
      const updated: Staff = {
        ...editingStaff,
        name: staffForm.name,
        role: staffForm.role,
        phone: staffForm.phone,
        joinDate: staffForm.joinDate,
      };
      if (onUpdateStaff) {
        onUpdateStaff(updated);
      } else {
        saveStaffList(staffList.map((s) => (s.id === editingStaff.id ? updated : s)));
      }
    } else {
      const newStaffObj: Staff = {
        id: `stf-${Date.now()}`,
        name: staffForm.name,
        role: staffForm.role,
        phone: staffForm.phone,
        joinDate: staffForm.joinDate,
      };
      if (onAddStaff) {
        onAddStaff(newStaffObj);
      } else {
        saveStaffList([...staffList, newStaffObj]);
      }
    }

    setShowStaffModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Teacher & Staff Directory</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              {teachers.length} Faculty • {staffList.length} Support Staff
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Full faculty profiles, class in-charges & support personnel
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'teachers' ? (
            <button
              onClick={handleOpenAddTeacher}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Teacher</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddStaff}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Staff</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'teachers'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Teaching Faculty ({teachers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'staff'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Support Staff ({staffList.length})</span>
        </button>
      </div>

      {/* Teachers Grid */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      {t.name.split(' ')[1] ? t.name.split(' ')[1].charAt(0) : t.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
                      <p className="text-xs text-emerald-700 font-semibold">{t.designation}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {t.employeeId}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium">Qualification:</span>{' '}
                    <strong className="text-slate-800">{t.qualification}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Subjects:</span>{' '}
                    <span className="text-slate-800 font-semibold">{t.subjects.join(', ')}</span>
                  </div>
                  {t.classTeacherOf && (
                    <div>
                      <span className="text-slate-400 font-medium">Class Incharge:</span>{' '}
                      <span className="font-bold text-blue-700">{t.classTeacherOf}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 font-medium">Experience:</span>{' '}
                    <span className="text-slate-700">{t.experience}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${t.phone}`}
                  className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-blue-600"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.phone}</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditTeacher(t)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Edit Teacher"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteTeacher(t.id, t.name)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Delete Teacher"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff Grid */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                  <p className="text-xs text-purple-700 font-semibold">{s.role}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${s.phone}`}
                  className="flex items-center gap-1 font-bold text-slate-700 hover:text-blue-600"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{s.phone}</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditStaff(s)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Edit Staff"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteStaff(s.id, s.name)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Delete Staff"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingTeacher ? 'Edit Faculty Member' : 'Add Faculty Member'}
                </h3>
                <p className="text-xs text-emerald-200">Wisdom Nursery & Primary School - Essur</p>
              </div>
              <button
                onClick={() => {
                  setShowTeacherModal(false);
                  if (onCloseAddModal) onCloseAddModal();
                }}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="e.g. Mrs. Priya Ramesh"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    value={teacherForm.designation}
                    onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Qualification</label>
                  <input
                    type="text"
                    value={teacherForm.qualification}
                    onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={teacherForm.subjects}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
                  placeholder="Tamil, English, Mathematics"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class Teacher Incharge</label>
                  <select
                    value={teacherForm.classTeacherOf}
                    onChange={(e) => setTeacherForm({ ...teacherForm, classTeacherOf: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold"
                  >
                    <option value="">None (Subject Faculty)</option>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Experience</label>
                  <input
                    type="text"
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                    placeholder="e.g. 5 Years"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    placeholder="e.g. 9840192831"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    placeholder="priya@wisdomschool.org"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeacherModal(false);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-purple-800 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingStaff ? 'Edit Staff Member' : 'Add New Support Staff'}
                </h3>
                <p className="text-xs text-purple-200">Wisdom Nursery & Primary School - Essur</p>
              </div>
              <button
                onClick={() => setShowStaffModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="e.g. Murugan K"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role / Job Title *</label>
                <input
                  type="text"
                  required
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  placeholder="e.g. Van Driver (TN 25 AB 4129) / Caretaker"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Join Year</label>
                  <input
                    type="text"
                    value={staffForm.joinDate}
                    onChange={(e) => setStaffForm({ ...staffForm, joinDate: e.target.value })}
                    placeholder="2023"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
