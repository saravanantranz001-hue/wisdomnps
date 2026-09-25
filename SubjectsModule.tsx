import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  GraduationCap,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { readStored, writeStored } from '../utils/storage';

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  classes: string;
  teacher: string;
  periodsPerWeek: number;
  category: 'Language' | 'Core Academic' | 'Activity & Arts' | 'Science & Tech';
  description?: string;
}

const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'sub-1',
    name: 'Tamil (தமிழ்)',
    code: 'TAM-01',
    classes: 'Nursery to Class 5',
    teacher: 'Mrs. Subhashini R',
    periodsPerWeek: 6,
    category: 'Language',
    description: 'Tamil alphabet, phonetics, poetry, reading fluency & grammar',
  },
  {
    id: 'sub-2',
    name: 'English (Phonics & Grammar)',
    code: 'ENG-02',
    classes: 'Nursery to Class 5',
    teacher: 'Mrs. Jayanthi S',
    periodsPerWeek: 6,
    category: 'Language',
    description: 'Jolly phonics, vocabulary building, moral storytelling & creative writing',
  },
  {
    id: 'sub-3',
    name: 'Mathematics',
    code: 'MAT-03',
    classes: 'Nursery to Class 5',
    teacher: 'Mr. Balaji M',
    periodsPerWeek: 6,
    category: 'Core Academic',
    description: 'Number work, addition, multiplication tables, geometry & abacus practice',
  },
  {
    id: 'sub-4',
    name: 'Environmental Studies (EVS)',
    code: 'EVS-04',
    classes: 'Class 1 to Class 5',
    teacher: 'Mr. Saravanan V',
    periodsPerWeek: 4,
    category: 'Core Academic',
    description: 'Living things, plants, water cycle, cleanliness, traffic rules & community helpers',
  },
  {
    id: 'sub-5',
    name: 'Science & Nature Lab',
    code: 'SCI-05',
    classes: 'Class 3 to Class 5',
    teacher: 'Mrs. Uma Maheswari',
    periodsPerWeek: 4,
    category: 'Science & Tech',
    description: 'Hands-on simple experiments, botany observations & human body fundamentals',
  },
  {
    id: 'sub-6',
    name: 'Social Studies & General Knowledge',
    code: 'SST-06',
    classes: 'Class 3 to Class 5',
    teacher: 'Mrs. Kalaiselvi N',
    periodsPerWeek: 3,
    category: 'Core Academic',
    description: 'History of Tamil Nadu, Indian national symbols, geography & globe study',
  },
  {
    id: 'sub-7',
    name: 'Drawing, Rhymes & Craft',
    code: 'ART-07',
    classes: 'Nursery, LKG, UKG',
    teacher: 'Mrs. Anandhi K',
    periodsPerWeek: 4,
    category: 'Activity & Arts',
    description: 'Crayon coloring, origami paper crafts, clay modeling & action songs',
  },
  {
    id: 'sub-8',
    name: 'Physical Education & Yoga',
    code: 'PET-08',
    classes: 'All Classes',
    teacher: 'Mr. Kumaran T',
    periodsPerWeek: 3,
    category: 'Activity & Arts',
    description: 'Morning drills, yogasana, coordination running & playful teamwork games',
  },
  {
    id: 'sub-9',
    name: 'Basic Computer Fundamentals',
    code: 'CSC-09',
    classes: 'Class 1 to Class 5',
    teacher: 'Mr. Saravanan V',
    periodsPerWeek: 2,
    category: 'Science & Tech',
    description: 'Mouse holding, keyboard typing, Paint application & basic digital awareness',
  },
];

export const SubjectsModule: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    return readStored('wisdom_subjects', INITIAL_SUBJECTS);
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [form, setForm] = useState<Omit<SubjectItem, 'id'>>({
    name: '',
    code: '',
    classes: 'Nursery to Class 5',
    teacher: '',
    periodsPerWeek: 5,
    category: 'Core Academic',
    description: '',
  });

  useEffect(() => {
    writeStored('wisdom_subjects', subjects);
  }, [subjects]);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setForm({
      name: '',
      code: `SUB-0${subjects.length + 1}`,
      classes: 'Class 1 to Class 5',
      teacher: '',
      periodsPerWeek: 4,
      category: 'Core Academic',
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sub: SubjectItem) => {
    setEditingSubject(sub);
    setForm({
      name: sub.name,
      code: sub.code,
      classes: sub.classes,
      teacher: sub.teacher,
      periodsPerWeek: sub.periodsPerWeek,
      category: sub.category,
      description: sub.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete subject "${name}"?`)) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.teacher) return;

    if (editingSubject) {
      setSubjects(
        subjects.map((s) => (s.id === editingSubject.id ? { ...editingSubject, ...form } : s))
      );
    } else {
      const newSub: SubjectItem = {
        id: `sub-${Date.now()}`,
        ...form,
      };
      setSubjects([...subjects, newSub]);
    }
    setShowModal(false);
  };

  const filtered = subjects.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'All' || s.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Curriculum & Subjects Management</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              {subjects.length} Subjects
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Tamil Nadu Samacheer Kalvi & Early Childhood Curriculum
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search subject, faculty, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-900"
          >
            <option value="All">All Categories</option>
            <option value="Language">Language</option>
            <option value="Core Academic">Core Academic</option>
            <option value="Science & Tech">Science & Tech</option>
            <option value="Activity & Arts">Activity & Arts</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {sub.code}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                  {sub.classes}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2.5">{sub.name}</h3>

              {sub.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {sub.description}
                </p>
              )}

              <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Faculty Teacher:</span>
                  <strong className="text-slate-800">{sub.teacher}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Weekly Periods:</span>
                  <span className="font-bold text-blue-700">{sub.periodsPerWeek} Periods / Week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Classification:</span>
                  <span className="text-emerald-700 font-bold">{sub.category}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-mono">ID: {sub.id}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(sub)}
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  title="Edit Subject"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(sub.id, sub.name)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  title="Delete Subject"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
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
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Science & Nature Lab"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g. SCI-05"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Language">Language</option>
                    <option value="Core Academic">Core Academic</option>
                    <option value="Science & Tech">Science & Tech</option>
                    <option value="Activity & Arts">Activity & Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Faculty Incharge *</label>
                  <input
                    type="text"
                    required
                    value={form.teacher}
                    onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                    placeholder="e.g. Mrs. Uma Maheswari"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Periods / Week</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.periodsPerWeek}
                    onChange={(e) => setForm({ ...form, periodsPerWeek: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Applicable Classes</label>
                <input
                  type="text"
                  value={form.classes}
                  onChange={(e) => setForm({ ...form, classes: e.target.value })}
                  placeholder="e.g. Nursery to Class 5 or Class 3 to Class 5"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Syllabus Overview / Notes</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe curriculum focus, practical activities, and learning goals..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
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
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
