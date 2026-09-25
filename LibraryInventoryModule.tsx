import React, { useState, useEffect } from 'react';
import {
  Library,
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  Boxes,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Tag,
  BookMarked,
  X
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/initialData';
import { readStored, writeStored } from '../utils/storage';

export interface LibraryItem {
  id: string;
  type: 'Book' | 'Montessori Kit' | 'Sports Equipment' | 'Science Apparatus';
  title: string;
  code: string;
  authorOrBrand: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  location: string;
  classes: string;
}

const INITIAL_ITEMS: LibraryItem[] = [
  {
    id: 'lib-01',
    type: 'Book',
    title: 'Panchatantra Illustrated Moral Tales (Tamil & English)',
    code: 'BK-PAN-101',
    authorOrBrand: 'Children Book Trust',
    category: 'Moral Stories',
    totalQuantity: 25,
    availableQuantity: 18,
    location: 'Shelf A1 (Primary)',
    classes: 'Nursery to Class 5',
  },
  {
    id: 'lib-02',
    type: 'Book',
    title: 'Phonics & Rhymes Picture Dictionary',
    code: 'BK-PHO-202',
    authorOrBrand: 'Oxford Primary',
    category: 'Language & Phonics',
    totalQuantity: 30,
    availableQuantity: 26,
    location: 'Shelf B2 (Kindergarten)',
    classes: 'Nursery, LKG, UKG',
  },
  {
    id: 'lib-03',
    type: 'Book',
    title: 'Tamil Ilakkana Deepam & Siruvar Kathaigal',
    code: 'BK-TAM-303',
    authorOrBrand: 'Vaanathi Pathipagam',
    category: 'Tamil Literature',
    totalQuantity: 20,
    availableQuantity: 14,
    location: 'Shelf C1 (Language)',
    classes: 'Class 2 to Class 5',
  },
  {
    id: 'lib-04',
    type: 'Montessori Kit',
    title: 'Sensory Wooden Counting Blocks & Abacus',
    code: 'KIT-MAT-01',
    authorOrBrand: 'Montessori Play Learn',
    category: 'Early Mathematics',
    totalQuantity: 12,
    availableQuantity: 10,
    location: 'Activity Cupboard 1',
    classes: 'Nursery & LKG',
  },
  {
    id: 'lib-05',
    type: 'Science Apparatus',
    title: 'Primary Science Nature Lab Magnifiers & Plant Kit',
    code: 'SCI-EVS-05',
    authorOrBrand: 'Lab Spark India',
    category: 'EVS Discovery',
    totalQuantity: 15,
    availableQuantity: 12,
    location: 'Science Corner B',
    classes: 'Class 3 to Class 5',
  },
];

export const LibraryInventoryModule: React.FC = () => {
  const [items, setItems] = useState<LibraryItem[]>(() => {
    return readStored('wisdom_library', INITIAL_ITEMS);
  });

  const [filterType, setFilterType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);

  const [form, setForm] = useState<Omit<LibraryItem, 'id'>>({
    type: 'Book',
    title: '',
    code: '',
    authorOrBrand: '',
    category: 'Story Books',
    totalQuantity: 10,
    availableQuantity: 10,
    location: 'Shelf A1',
    classes: 'All Classes',
  });

  useEffect(() => {
    writeStored('wisdom_library', items);
  }, [items]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      type: 'Book',
      title: '',
      code: `BK-${Math.floor(100 + Math.random() * 900)}`,
      authorOrBrand: '',
      category: 'Story Books',
      totalQuantity: 15,
      availableQuantity: 15,
      location: 'Shelf A1',
      classes: 'All Classes',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: LibraryItem) => {
    setEditingItem(item);
    setForm({
      type: item.type,
      title: item.title,
      code: item.code,
      authorOrBrand: item.authorOrBrand,
      category: item.category,
      totalQuantity: item.totalQuantity,
      availableQuantity: item.availableQuantity,
      location: item.location,
      classes: item.classes,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map((i) => (i.id === editingItem.id ? { ...editingItem, ...form } : i)));
    } else {
      const newItem: LibraryItem = {
        id: `lib-${Date.now()}`,
        ...form,
      };
      setItems([newItem, ...items]);
    }
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this library/inventory item?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const filtered = items.filter((item) => {
    const matchType = filterType === 'All' || item.type === filterType;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.authorOrBrand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const totalTitles = items.length;
  const totalPhysicalItems = items.reduce((acc, i) => acc + i.totalQuantity, 0);
  const issuedItems = items.reduce((acc, i) => acc + (i.totalQuantity - i.availableQuantity), 0);

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Library className="w-6 h-6 text-indigo-600" />
            <span>Library Catalog & School Inventory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Full Add, Edit, Delete for Books, Montessori Kits & Lab Gear
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book / Equipment</span>
        </button>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-indigo-200 bg-indigo-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
            <span>Total Titles & Catalog</span>
            <BookMarked className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-950 mt-2">{totalTitles} Titles</div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1">Tamil & English children literature</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900">
            <span>Total Inventory Copies</span>
            <Boxes className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalPhysicalItems} Copies</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">Includes Montessori kits & apparatus</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>Currently Issued / Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-2">{issuedItems} Issued</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Checked out by students & teachers</div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, code, or author..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['All', 'Book', 'Montessori Kit', 'Science Apparatus'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterType === t ? 'bg-indigo-600 text-white' : 'text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Item Code</th>
                <th className="p-3.5">Title & Type</th>
                <th className="p-3.5">Author / Brand</th>
                <th className="p-3.5">Category & Class</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-right">Available / Total</th>
                <th className="p-3.5 text-right">Actions (Edit / Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-blue-900">{item.code}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-800 font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700 font-medium">{item.authorOrBrand}</td>
                  <td className="p-3.5 text-slate-600">
                    <div>{item.category}</div>
                    <div className="text-[10px] text-slate-400">{item.classes}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">{item.location}</td>
                  <td className="p-3.5 text-right">
                    <span className="font-bold text-emerald-700">{item.availableQuantity}</span> /{' '}
                    <span className="font-bold text-slate-800">{item.totalQuantity}</span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-indigo-950 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Library className="w-5 h-5 text-amber-300" />
                <span>{editingItem ? 'Edit Library / Inventory Item' : 'Add New Item to Catalog'}</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Item Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Book">Story / Library Book</option>
                    <option value="Montessori Kit">Montessori Learning Kit</option>
                    <option value="Science Apparatus">Science / EVS Lab Apparatus</option>
                    <option value="Sports Equipment">Sports / PT Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Accession / Code *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Item Title / Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Illustrated Story Tales or Wooden Abacus"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Author / Publisher / Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Oxford, CBT or Playschool"
                    value={form.authorOrBrand}
                    onChange={(e) => setForm({ ...form, authorOrBrand: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Moral Stories, Early Math"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Copies</label>
                  <input
                    type="number"
                    required
                    value={form.totalQuantity}
                    onChange={(e) => setForm({ ...form, totalQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Available</label>
                  <input
                    type="number"
                    required
                    value={form.availableQuantity}
                    onChange={(e) => setForm({ ...form, availableQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Classes</label>
                <input
                  type="text"
                  placeholder="e.g. Nursery to Class 5"
                  value={form.classes}
                  onChange={(e) => setForm({ ...form, classes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md cursor-pointer"
                >
                  {editingItem ? 'Update Catalog' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
