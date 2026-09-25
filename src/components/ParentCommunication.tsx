import React, { useState } from 'react';
import {
  Bell,
  Send,
  MessageSquare,
  Users,
  Phone,
  Share2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  X,
  FileText
} from 'lucide-react';
import { Notice, Student } from '../types';
import { SCHOOL_INFO } from '../data/initialData';
import { BulkWaSenderModal } from './BulkWaSenderModal';

interface ParentCommunicationProps {
  notices: Notice[];
  students: Student[];
  onAddNotice: (notice: Notice) => void;
  onUpdateNotice?: (notice: Notice) => void;
  onDeleteNotice?: (noticeId: string) => void;
  onUpdateStudent?: (student: Student) => void;
  isOpenCompose?: boolean;
  onCloseCompose?: () => void;
}

export const ParentCommunication: React.FC<ParentCommunicationProps> = ({
  notices,
  students,
  onAddNotice,
  onUpdateNotice,
  onDeleteNotice,
  onUpdateStudent,
  isOpenCompose = false,
  onCloseCompose,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'notices' | 'parents'>('notices');
  const [showComposeModal, setShowComposeModal] = useState(isOpenCompose);
  const [showBulkWaModal, setShowBulkWaModal] = useState(false);

  // Edit Notice State
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Notice Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<Notice['targetAudience']>('Parents');
  const [category, setCategory] = useState<Notice['category']>('Academic');

  // Edit Parent State
  const [editingParentStudent, setEditingParentStudent] = useState<Student | null>(null);
  const [parentNameForm, setParentNameForm] = useState('');
  const [parentPhoneForm, setParentPhoneForm] = useState('');

  // Pre-made templates for quick messaging
  const templates = [
    {
      label: 'Fee Reminder (GPay)',
      title: 'Fee Payment Reminder - GPay 9176593129',
      content:
        'Dear Parents, please clear pending school fees for your ward at Wisdom Nursery and Primary School, Essur. Fees can be paid safely via Google Pay to 9176593129. Digital receipts are sent promptly.',
      category: 'Urgent' as const,
    },
    {
      label: 'Parent Teacher Meeting',
      title: 'Parent Teacher Meeting Scheduled',
      content:
        'Dear Parents, you are cordially invited for the upcoming Parent Teacher Meeting at Wisdom School Campus, Essur. Please review your child’s academic performance and test books with the class teacher.',
      category: 'Event' as const,
    },
    {
      label: 'Holiday Announcement',
      title: 'School Holiday Notice',
      content:
        'Dear Parents, the school will remain closed tomorrow in observance of the upcoming festival. Regular classes will resume the following day.',
      category: 'Holiday' as const,
    },
  ];

  const handleApplyTemplate = (tpl: (typeof templates)[0]) => {
    setTitle(tpl.title);
    setContent(tpl.content);
    setCategory(tpl.category);
  };

  const handleOpenCompose = () => {
    setEditingNotice(null);
    setTitle('');
    setContent('');
    setAudience('Parents');
    setCategory('Academic');
    setShowComposeModal(true);
  };

  const handleOpenEditNotice = (n: Notice) => {
    setEditingNotice(n);
    setTitle(n.title);
    setContent(n.content);
    setAudience(n.targetAudience);
    setCategory(n.category);
    setShowComposeModal(true);
  };

  const handleDeleteNotice = (id: string, noticeTitle: string) => {
    if (window.confirm(`Are you sure you want to delete notice "${noticeTitle}"?`)) {
      if (onDeleteNotice) {
        onDeleteNotice(id);
      }
    }
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editingNotice) {
      if (onUpdateNotice) {
        onUpdateNotice({
          ...editingNotice,
          title,
          content,
          targetAudience: audience,
          category,
        });
      }
    } else {
      const newNotice: Notice = {
        id: `not-${Date.now()}`,
        title,
        content,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        targetAudience: audience,
        category,
        postedBy: 'Wisdom Admin Office',
        sentViaWhatsApp: true,
      };
      onAddNotice(newNotice);
    }

    setShowComposeModal(false);
    if (onCloseCompose) onCloseCompose();
    setTitle('');
    setContent('');
  };

  const handleOpenEditParent = (student: Student) => {
    setEditingParentStudent(student);
    setParentNameForm(student.parentName);
    setParentPhoneForm(student.parentPhone);
  };

  const handleSaveParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParentStudent || !onUpdateStudent) return;

    onUpdateStudent({
      ...editingParentStudent,
      parentName: parentNameForm,
      parentPhone: parentPhoneForm,
    });

    setEditingParentStudent(null);
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-900" />
            <span>Parent Communication & Notice Board</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              {students.length} Registered Families
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • WhatsApp circulars, instant notices & parent contacts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBulkWaModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Bulk WhatsApp Messenger</span>
          </button>

          <button
            onClick={handleOpenCompose}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Notice</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSubTab('notices')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'notices'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>School Circulars & Notices ({notices.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('parents')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'parents'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Parent Contacts Directory ({students.length})</span>
        </button>
      </div>

      {/* Tab 1: Notices List */}
      {activeSubTab === 'notices' && (
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        n.category === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : n.category === 'Event'
                          ? 'bg-purple-100 text-purple-800'
                          : n.category === 'Holiday'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {n.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {n.targetAudience}</span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">{n.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-2">{n.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{n.content}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Posted by: {n.postedBy}</span>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=*${encodeURIComponent(n.title)}*%0A%0A${encodeURIComponent(
                      n.content
                    )}%0A%0A- Wisdom Nursery and Primary School, Essur`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => handleOpenEditNotice(n)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    title="Edit Notice"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteNotice(n.id, n.title)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Parent Contacts Directory */}
      {activeSubTab === 'parents' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Parent / Guardian</th>
                  <th className="p-3.5">Student / Ward</th>
                  <th className="p-3.5">Class</th>
                  <th className="p-3.5">Phone Number</th>
                  <th className="p-3.5">GPay Linked</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{std.parentName}</td>
                    <td className="p-3.5 text-slate-800 font-semibold">{std.name}</td>
                    <td className="p-3.5 text-blue-700 font-bold">{std.className} - {std.section}</td>
                    <td className="p-3.5 font-mono text-slate-700">
                      <a href={`tel:${std.parentPhone}`} className="hover:text-blue-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{std.parentPhone}</span>
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        GPay Active
                      </span>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/91${std.parentPhone}?text=Hello%20${encodeURIComponent(
                            std.parentName
                          )},%20Greetings%20from%20Wisdom%20Nursery%20and%20Primary%20School,%20Essur.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleOpenEditParent(std)}
                          className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold cursor-pointer"
                          title="Edit Parent Contact"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Parent Modal */}
      {editingParentStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Edit Parent Contact Details</h3>
                <p className="text-xs text-blue-200">Ward: {editingParentStudent.name}</p>
              </div>
              <button
                onClick={() => setEditingParentStudent(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParent} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Parent / Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={parentNameForm}
                  onChange={(e) => setParentNameForm(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={parentPhoneForm}
                  onChange={(e) => setParentPhoneForm(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingParentStudent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Save Parent Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compose / Edit Notice Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingNotice ? 'Edit Circular Notice' : 'Compose Notice & Broadcast'}
                </h3>
                <p className="text-xs text-blue-200">Wisdom Nursery & Primary School - Essur</p>
              </div>
              <button
                onClick={() => {
                  setShowComposeModal(false);
                  if (onCloseCompose) onCloseCompose();
                }}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishNotice} className="p-6 space-y-4">
              {/* Quick Templates */}
              {!editingNotice && (
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Or pick a template:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {templates.map((tpl) => (
                      <button
                        type="button"
                        key={tpl.label}
                        onClick={() => handleApplyTemplate(tpl)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Term 1 Parent Teacher Meeting Scheduled"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Urgent">Urgent / Important</option>
                    <option value="Event">School Event</option>
                    <option value="Holiday">Holiday Announcement</option>
                    <option value="Exam">Exam Schedule</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Parents">Parents</option>
                    <option value="All">All School Community</option>
                    <option value="Nursery/KG">Nursery & Kindergarten</option>
                    <option value="Primary">Primary (Class 1 - 5)</option>
                    <option value="Teachers">Teachers & Staff</option>
                    <option value="Students">Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type official notice text to broadcast to parents..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Notice will be published on parent portal and available for WhatsApp dispatch.</span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowComposeModal(false);
                    if (onCloseCompose) onCloseCompose();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{editingNotice ? 'Update Notice' : 'Broadcast Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk WhatsApp Modal */}
      {showBulkWaModal && (
        <BulkWaSenderModal
          isOpen={showBulkWaModal}
          onClose={() => setShowBulkWaModal(false)}
          students={students}
        />
      )}
    </div>
  );
};
