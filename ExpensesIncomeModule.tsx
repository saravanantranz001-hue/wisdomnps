import React, { useState, useEffect } from 'react';
import {
  BadgePercent,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Filter,
  Calendar,
  FileText,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  X
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/initialData';
import { exportFinancesToExcel } from '../utils/excelUtils';
import { readStored, writeStored } from '../utils/storage';

export interface FinanceEntry {
  id: string;
  type: 'Expense' | 'Income';
  category:
    | 'Teacher & Staff Salary'
    | 'Van Fuel & Maintenance'
    | 'Electricity & Water'
    | 'Books & Stationary'
    | 'School Event & Sports'
    | 'Campus Repairs'
    | 'Student Fees'
    | 'Government Grant'
    | 'Donation / Other';
  title: string;
  amount: number;
  date: string;
  paymentMode: 'Cash' | 'GPay (9176593129)' | 'Bank Transfer';
  referenceNo?: string;
  recordedBy: string;
  notes?: string;
}

interface ExpensesIncomeModuleProps {
  isOpenAddExpenseModal?: boolean;
  onCloseAddExpenseModal?: () => void;
}

const INITIAL_FINANCES: FinanceEntry[] = [
  {
    id: 'fin-01',
    type: 'Income',
    category: 'Student Fees',
    title: 'Term 1 Fee Collections & GPay',
    amount: 245800,
    date: '2025-04-25',
    paymentMode: 'GPay (9176593129)',
    referenceNo: 'FEE-LEDGER-APR',
    recordedBy: 'Accounts Office',
    notes: 'Total fee realization for Term 1',
  },
  {
    id: 'fin-02',
    type: 'Expense',
    category: 'Teacher & Staff Salary',
    title: 'Faculty Monthly Salaries (8 Teachers, 7 Staff)',
    amount: 88500,
    date: '2025-04-01',
    paymentMode: 'Bank Transfer',
    referenceNo: 'SAL-APR-2025',
    recordedBy: 'Principal Jayanthi S',
    notes: 'Monthly faculty disbursement',
  },
  {
    id: 'fin-03',
    type: 'Expense',
    category: 'Van Fuel & Maintenance',
    title: 'School Bus & Van Diesel + Oil Service',
    amount: 14500,
    date: '2025-04-18',
    paymentMode: 'Cash',
    referenceNo: 'DSL-8821',
    recordedBy: 'Murugan K (Transport)',
    notes: 'Covers 4 van routes for month of April',
  },
  {
    id: 'fin-04',
    type: 'Expense',
    category: 'Electricity & Water',
    title: 'TNEB Campus Power Bill & Drinking Water Filters',
    amount: 6200,
    date: '2025-04-12',
    paymentMode: 'GPay (9176593129)',
    referenceNo: 'TNEB-603310-99',
    recordedBy: 'Accounts Office',
    notes: 'TNEB power bill for Block A, B & C',
  },
  {
    id: 'fin-05',
    type: 'Expense',
    category: 'Books & Stationary',
    title: 'Tamil & English Workbooks, Printing & Chalk',
    amount: 11200,
    date: '2025-04-08',
    paymentMode: 'Cash',
    referenceNo: 'STN-APR-102',
    recordedBy: 'Accounts Office',
    notes: 'Montessori worksheets and test note books',
  },
  {
    id: 'fin-06',
    type: 'Expense',
    category: 'School Event & Sports',
    title: 'Annual Sports Day Medals & Refreshments',
    amount: 12000,
    date: '2025-03-25',
    paymentMode: 'Cash',
    referenceNo: 'EVT-SPORTS-01',
    recordedBy: 'Kumaran T (PET)',
    notes: 'Prizes, certificates and student snacks',
  },
];

export const ExpensesIncomeModule: React.FC<ExpensesIncomeModuleProps> = ({
  isOpenAddExpenseModal,
  onCloseAddExpenseModal,
}) => {
  const [entries, setEntries] = useState<FinanceEntry[]>(() => {
    return readStored('wisdom_finances', INITIAL_FINANCES);
  });

  const [filterType, setFilterType] = useState<'All' | 'Expense' | 'Income'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);

  const [form, setForm] = useState<Omit<FinanceEntry, 'id'>>({
    type: 'Expense',
    category: 'Teacher & Staff Salary',
    title: '',
    amount: 5000,
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    referenceNo: '',
    recordedBy: 'Admin Office',
    notes: '',
  });

  useEffect(() => {
    writeStored('wisdom_finances', entries);
  }, [entries]);

  useEffect(() => {
    if (isOpenAddExpenseModal) {
      handleOpenAddExpense();
    }
  }, [isOpenAddExpenseModal]);

  const totalIncome = entries
    .filter((e) => e.type === 'Income')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalExpenses = entries
    .filter((e) => e.type === 'Expense')
    .reduce((acc, e) => acc + e.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const handleOpenAddExpense = () => {
    setEditingEntry(null);
    setForm({
      type: 'Expense',
      category: 'Van Fuel & Maintenance',
      title: '',
      amount: 2500,
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'GPay (9176593129)',
      referenceNo: '',
      recordedBy: 'Admin Office',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenAddIncome = () => {
    setEditingEntry(null);
    setForm({
      type: 'Income',
      category: 'Student Fees',
      title: 'Tuition Fee Collection',
      amount: 5000,
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'GPay (9176593129)',
      referenceNo: '',
      recordedBy: 'Admin Office',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    handleOpenAddExpense();
  };

  const handleOpenEdit = (entry: FinanceEntry) => {
    setEditingEntry(entry);
    setForm({
      type: entry.type,
      category: entry.category,
      title: entry.title,
      amount: entry.amount,
      date: entry.date,
      paymentMode: entry.paymentMode,
      referenceNo: entry.referenceNo || '',
      recordedBy: entry.recordedBy,
      notes: entry.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      setEntries(
        entries.map((entry) => (entry.id === editingEntry.id ? { ...editingEntry, ...form } : entry))
      );
    } else {
      const newEntry: FinanceEntry = {
        id: `fin-${Date.now()}`,
        ...form,
      };
      setEntries([newEntry, ...entries]);
    }
    setModalOpen(false);
    setEditingEntry(null);
    onCloseAddExpenseModal?.();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEntry(null);
    onCloseAddExpenseModal?.();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this financial entry?')) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const filtered = entries.filter((e) => {
    const matchType = filterType === 'All' || e.type === filterType;
    const matchSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.referenceNo && e.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BadgePercent className="w-6 h-6 text-rose-600" />
            <span>Expenses & Income Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wisdom Nursery & Primary School - Essur • Add, Edit & Delete Operating Finances
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportFinancesToExcel(entries)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download complete ledger spreadsheet in .xlsx format"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleOpenAddIncome}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>+ Add Income</span>
          </button>

          <button
            onClick={handleOpenAddExpense}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <TrendingDown className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>Total School Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">
            ₹ {totalIncome.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Student tuition, van & exam fees
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-900">
            <span>Total Operational Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">
            ₹ {totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">
            Faculty salary, van diesel, bills & books
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900">
            <span>Net Operating Balance</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-950 mt-2">
            ₹ {netBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            School campus reserve fund
          </div>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category, description, or ref..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('All')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterType === 'All' ? 'bg-blue-600 text-white' : 'text-slate-700'
              }`}
            >
              All Entries ({entries.length})
            </button>
            <button
              onClick={() => setFilterType('Expense')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterType === 'Expense' ? 'bg-rose-600 text-white' : 'text-slate-700'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setFilterType('Income')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterType === 'Income' ? 'bg-emerald-600 text-white' : 'text-slate-700'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Type & Category</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Payment Mode</th>
                <th className="p-3.5">Ref / Recorded By</th>
                <th className="p-3.5 text-right">Amount (₹)</th>
                <th className="p-3.5 text-right">Actions (Edit / Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          entry.type === 'Income'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {entry.type}
                      </span>
                      <span className="font-bold text-slate-800">{entry.category}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-900">
                    <div>{entry.title}</div>
                    {entry.notes && <div className="text-[10px] text-slate-400 mt-0.5">{entry.notes}</div>}
                  </td>
                  <td className="p-3.5 text-slate-500 font-medium">{entry.date}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                      {entry.paymentMode}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">
                    <div className="font-mono text-[11px] font-bold text-blue-900">{entry.referenceNo || 'N/A'}</div>
                    <div className="text-[10px] text-slate-400">{entry.recordedBy}</div>
                  </td>
                  <td className="p-3.5 text-right font-black text-sm">
                    <span className={entry.type === 'Income' ? 'text-emerald-700' : 'text-rose-600'}>
                      {entry.type === 'Income' ? '+' : '-'} ₹ {entry.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(entry)}
                        className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Edit Entry"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Delete Entry"
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
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-amber-300" />
                <span>{editingEntry ? 'Edit Financial Record' : 'Record New Income / Expense'}</span>
              </h3>
              <button onClick={handleCloseModal} className="text-white/80 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Transaction Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Expense">Expense (-)</option>
                    <option value="Income">Income (+)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-black text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Teacher & Staff Salary">Teacher & Staff Salary</option>
                  <option value="Van Fuel & Maintenance">Van Fuel & Maintenance</option>
                  <option value="Electricity & Water">Electricity & Water</option>
                  <option value="Books & Stationary">Books & Stationary</option>
                  <option value="School Event & Sports">School Event & Sports</option>
                  <option value="Campus Repairs">Campus Repairs</option>
                  <option value="Student Fees">Student Fees (Income)</option>
                  <option value="Government Grant">Government Grant (Income)</option>
                  <option value="Donation / Other">Donation / Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Van 2 Diesel Fill or Monthly Electricity bill"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payment Mode</label>
                  <select
                    value={form.paymentMode}
                    onChange={(e) => setForm({ ...form, paymentMode: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="GPay (9176593129)">GPay (9176593129)</option>
                    <option value="Cash">Cash at Office</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reference / Bill #</label>
                  <input
                    type="text"
                    placeholder="e.g. BILL-4412"
                    value={form.referenceNo}
                    onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Recorded By</label>
                  <input
                    type="text"
                    value={form.recordedBy}
                    onChange={(e) => setForm({ ...form, recordedBy: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Optional details or vendor name..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                >
                  {editingEntry ? 'Update Record' : 'Record Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
