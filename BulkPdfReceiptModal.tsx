import React, { useState } from 'react';
import {
  Printer,
  Download,
  X,
  CheckSquare,
  Square,
  Search,
  Filter,
  FileText,
  Bus,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { Student, FeePayment } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { SCHOOL_INFO, VAN_ROUTES } from '../data/initialData';

interface BulkPdfReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  payments: FeePayment[];
}

export type DocumentType = 'due-invoice' | 'payment-receipt' | 'van-pass';

export const BulkPdfReceiptModal: React.FC<BulkPdfReceiptModalProps> = ({
  isOpen,
  onClose,
  students,
  payments,
}) => {
  const [docType, setDocType] = useState<DocumentType>('due-invoice');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [filterFeeStatus, setFilterFeeStatus] = useState<string>('Pending');
  const [filterTransport, setFilterTransport] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Customization
  const [includeGPayQr, setIncludeGPayQr] = useState(true);
  const [includePrincipalStamp, setIncludePrincipalStamp] = useState(true);
  const [includeTransportDetails, setIncludeTransportDetails] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState<'1' | '2'>('2');
  const [dueDate, setDueDate] = useState('10th of Next Month');

  // Selected students for bulk printing
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() => {
    // Default select students with pending dues
    return students.filter(s => s.pendingFee > 0).map(s => s.id);
  });

  if (!isOpen) return null;

  // Filter students based on controls
  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'All' || s.className === selectedClass;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentPhone.includes(searchTerm);
    
    let matchesFee = true;
    if (filterFeeStatus === 'Pending') {
      matchesFee = s.pendingFee > 0;
    } else if (filterFeeStatus === 'PendingVan') {
      matchesFee = !!(s.usesVan && (s.vanFeePending ?? 0) > 0);
    } else if (filterFeeStatus === 'Paid') {
      matchesFee = s.pendingFee === 0;
    }

    let matchesTrans = true;
    if (filterTransport === 'VanOnly') {
      matchesTrans = !!s.usesVan;
    } else if (filterTransport === 'NoVan') {
      matchesTrans = !s.usesVan;
    }

    return matchesClass && matchesSearch && matchesFee && matchesTrans;
  });

  const toggleStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(item => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const selectAll = () => {
    setSelectedStudentIds(filteredStudents.map(s => s.id));
  };

  const deselectAll = () => {
    setSelectedStudentIds([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedStudentsData = students.filter(s => selectedStudentIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Modal Header (Hidden during Print) */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center border border-blue-400/30">
              <Printer className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">
                  Bulk PDF & Print Generator
                </h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  School & Van Fees
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                WISDOM Nursery & Primary School - Essur • Batch Printing & Due Notices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              disabled={selectedStudentIds.length === 0}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                selectedStudentIds.length > 0
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Print {selectedStudentIds.length} Documents (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar (Hidden during Print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden shrink-0">
          {/* Document Type Selector */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setDocType('due-invoice')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                docType === 'due-invoice'
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Fee Due Invoices (Tuition + Van)</span>
            </button>

            <button
              onClick={() => setDocType('payment-receipt')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                docType === 'payment-receipt'
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-300" />
              <span>Paid Receipts (GPay/Cash)</span>
            </button>

            <button
              onClick={() => setDocType('van-pass')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                docType === 'van-pass'
                  ? 'bg-blue-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bus className="w-3.5 h-3.5 text-amber-400" />
              <span>School Van Transport Pass</span>
            </button>
          </div>

          {/* Page Layout Settings */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700">
              <span className="font-semibold text-slate-500">Per A4 Page:</span>
              <button
                onClick={() => setItemsPerPage('2')}
                className={`px-2 py-0.5 rounded font-bold ${
                  itemsPerPage === '2' ? 'bg-blue-100 text-blue-900' : 'text-slate-500'
                }`}
              >
                2 per page (Split)
              </button>
              <button
                onClick={() => setItemsPerPage('1')}
                className={`px-2 py-0.5 rounded font-bold ${
                  itemsPerPage === '1' ? 'bg-blue-100 text-blue-900' : 'text-slate-500'
                }`}
              >
                1 per page (Full)
              </button>
            </div>

            <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeGPayQr}
                onChange={(e) => setIncludeGPayQr(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>GPay 9176593129 QR</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includePrincipalStamp}
                onChange={(e) => setIncludePrincipalStamp(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Principal Seal</span>
            </label>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar: Filter & Select Students (Hidden during Print) */}
          <div className="w-80 border-r border-slate-200 bg-white flex flex-col print:hidden shrink-0">
            {/* Filter controls */}
            <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or parent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="font-bold text-slate-500 block mb-0.5">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-medium"
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

                <div>
                  <label className="font-bold text-slate-500 block mb-0.5">Fee Filter</label>
                  <select
                    value={filterFeeStatus}
                    onChange={(e) => setFilterFeeStatus(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-medium"
                  >
                    <option value="All">All Students</option>
                    <option value="Pending">Pending Overall</option>
                    <option value="PendingVan">Pending Van Fee</option>
                    <option value="Paid">Fully Paid</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                <span className="text-slate-500">
                  Showing <strong>{filteredStudents.length}</strong> students
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={deselectAll}
                    className="text-slate-500 font-bold hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Students Checklist */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {filteredStudents.map((st) => {
                const isSelected = selectedStudentIds.includes(st.id);
                return (
                  <div
                    key={st.id}
                    onClick={() => toggleStudent(st.id)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="text-blue-600">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 fill-blue-600 text-white" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {st.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {st.className} - {st.section} • Roll {st.rollNo}
                        </div>
                        {st.usesVan && (
                          <div className="text-[9px] text-amber-700 font-medium flex items-center gap-0.5 mt-0.5">
                            <Bus className="w-2.5 h-2.5" />
                            <span>Van: {st.vanStop}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-rose-600">
                        ₹{st.pendingFee.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {st.pendingFee === 0 ? 'Clear' : 'Due'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Count Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
              <span>{selectedStudentIds.length} Selected for Bulk PDF</span>
              <span className="text-[11px] text-blue-600 font-extrabold">Ready to Print</span>
            </div>
          </div>

          {/* Right Main Area: Printable Document Canvas */}
          <div className="flex-1 bg-slate-200/70 p-4 sm:p-6 overflow-y-auto">
            {selectedStudentsData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-12 h-12 mb-2 text-slate-300" />
                <p className="text-sm font-semibold">No students selected for document generation.</p>
                <p className="text-xs">Use the list on the left to select students to print.</p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6" id="bulk-pdf-container">
                {selectedStudentsData.map((student, idx) => (
                  <div
                    key={student.id}
                    className={`bg-white rounded-2xl shadow-md border border-slate-200 p-6 print:p-4 print:shadow-none print:border-b-2 print:border-slate-800 ${
                      itemsPerPage === '1' ? 'print:break-after-page' : (idx % 2 === 1 ? 'print:break-after-page' : '')
                    }`}
                  >
                    {/* Official School Header */}
                    <div className="border-b-2 border-blue-900 pb-3 flex items-center justify-between gap-4">
                      <div className="shrink-0">
                        <SchoolLogo size={65} />
                      </div>
                      <div className="text-center flex-1">
                        <h2 className="text-xl font-black text-blue-950 font-serif tracking-tight">
                          {SCHOOL_INFO.name}
                        </h2>
                        <div className="text-xs font-extrabold text-red-700 tracking-wider">
                          — {SCHOOL_INFO.subName} —
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {SCHOOL_INFO.fullAddress}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                          Phone: <strong className="text-blue-900">9176593129</strong> | GPay:{' '}
                          <strong className="text-emerald-700">9176593129</strong>
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">
                          ACADEMIC YEAR<br />2026 - 2027
                        </span>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          DOC: WES-{student.admissionNo.slice(-3)}-{new Date().getMonth() + 1}
                        </div>
                      </div>
                    </div>

                    {/* Document Title Banner */}
                    <div className="my-3 px-3 py-1.5 bg-slate-100 rounded-lg flex items-center justify-between text-xs border border-slate-200">
                      <div>
                        <span className="text-slate-500 font-medium">Document: </span>
                        <strong className="text-blue-950 uppercase">
                          {docType === 'due-invoice'
                            ? 'FEE DEMAND & DUES STATEMENT'
                            : docType === 'payment-receipt'
                            ? 'OFFICIAL FEE RECEIPT'
                            : 'SCHOOL VAN TRANSPORT PASS'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Date: </span>
                        <strong>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                      </div>
                    </div>

                    {/* Student Identification Profile */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200 text-xs mb-3">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Student Name</span>
                        <span className="font-black text-slate-900 text-sm">{student.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Class & Section</span>
                        <span className="font-bold text-blue-900">{student.className} - Section {student.section}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Admission / Roll #</span>
                        <span className="font-mono font-bold text-slate-700">{student.admissionNo} • Roll: {student.rollNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Parent & Contact</span>
                        <span className="font-bold text-slate-900">{student.parentName}</span>
                        <div className="font-mono text-[10px] text-slate-500">{student.parentPhone}</div>
                      </div>
                    </div>

                    {/* Transport / Van Details (If applicable) */}
                    {student.usesVan && (
                      <div className="mb-3 p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Bus className="w-4 h-4 text-amber-600" />
                          <div>
                            <span className="font-bold text-amber-950">School Van Transport: </span>
                            <span className="text-amber-900 font-semibold">{student.vanRoute}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-amber-700 block">Boarding Stop</span>
                          <span className="font-bold text-slate-900">{student.vanStop} (₹{student.vanFeeMonthly}/mo)</span>
                        </div>
                      </div>
                    )}

                    {/* Breakdown Table: School Fees vs Van Fees */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden mb-3 text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                          <tr>
                            <th className="p-2">Fee Description</th>
                            <th className="p-2 text-right">Total Annual Fee</th>
                            <th className="p-2 text-right">Amount Paid</th>
                            <th className="p-2 text-right">Outstanding Due</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-2">
                              <div className="font-bold text-slate-900">School Tuition & Term Fee</div>
                              <div className="text-[10px] text-slate-400">Class {student.className} Academic Term 2026-27</div>
                            </td>
                            <td className="p-2 text-right font-medium">₹{(student.tuitionFeeTotal ?? 14000).toLocaleString('en-IN')}</td>
                            <td className="p-2 text-right font-medium text-emerald-700">₹{(student.tuitionFeePaid ?? (student.paidFee - (student.vanFeePaid ?? 0))).toLocaleString('en-IN')}</td>
                            <td className="p-2 text-right font-black text-rose-600">₹{(student.tuitionFeePending ?? (student.pendingFee - (student.vanFeePending ?? 0))).toLocaleString('en-IN')}</td>
                          </tr>

                          {student.usesVan && (
                            <tr>
                              <td className="p-2">
                                <div className="font-bold text-slate-900 flex items-center gap-1">
                                  <span>School Van / Transport Service</span>
                                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">Van Fee</span>
                                </div>
                                <div className="text-[10px] text-slate-400">{student.vanRoute} ({student.vanStop})</div>
                              </td>
                              <td className="p-2 text-right font-medium">₹{(student.vanFeeTotal ?? 7000).toLocaleString('en-IN')}</td>
                              <td className="p-2 text-right font-medium text-emerald-700">₹{(student.vanFeePaid ?? 4000).toLocaleString('en-IN')}</td>
                              <td className="p-2 text-right font-black text-rose-600">₹{(student.vanFeePending ?? 3000).toLocaleString('en-IN')}</td>
                            </tr>
                          )}

                          <tr className="bg-slate-50 font-black text-slate-900">
                            <td className="p-2 text-right uppercase text-[10px] text-slate-600">TOTAL SUMMARY:</td>
                            <td className="p-2 text-right">₹{student.totalFee.toLocaleString('en-IN')}</td>
                            <td className="p-2 text-right text-emerald-700">₹{student.paidFee.toLocaleString('en-IN')}</td>
                            <td className="p-2 text-right text-rose-700 text-sm">₹{student.pendingFee.toLocaleString('en-IN')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom Payment Instructions, GPay QR & Signatures */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2 border-t border-slate-200 text-xs">
                      {/* Left: GPay details & instructions */}
                      <div className="flex items-center gap-3">
                        {includeGPayQr && (
                          <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg p-1 shrink-0 flex flex-col items-center justify-center">
                            {/* Inline crisp QR placeholder representation */}
                            <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h4v4h-4v-4zm-4-2h2v2h-2v-2zm4-4h2v2h-2v-2zm-2 2h2v2h-2v-2zm0 4h2v2h-2v-2zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                            </svg>
                            <span className="text-[7px] font-black text-emerald-800">GPAY</span>
                          </div>
                        )}
                        <div>
                          <div className="text-[11px] font-bold text-slate-800">
                            Payment via Google Pay (GPay)
                          </div>
                          <div className="text-xs font-black text-emerald-700 font-mono">
                            Phone / GPay: 9176593129
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Please quote student name and admission # when paying.
                          </div>
                        </div>
                      </div>

                      {/* Right: Principal Seal and Authorized Signature */}
                      <div className="flex items-center justify-end gap-6 text-right">
                        {includePrincipalStamp && (
                          <div className="w-16 h-16 border-2 border-dashed border-blue-300 rounded-full flex flex-col items-center justify-center text-[7px] font-bold text-blue-800 uppercase tracking-tighter text-center rotate-[-12deg]">
                            <span>WISDOM SCHOOL</span>
                            <span className="text-[6px] text-blue-600">ESSUR 603310</span>
                            <span className="text-[5px] text-emerald-700 font-black">OFFICIAL SEAL</span>
                          </div>
                        )}
                        <div>
                          <div className="h-8 flex items-end justify-end">
                            <span className="font-serif italic text-blue-900 font-bold text-xs">S. Jayanthi</span>
                          </div>
                          <div className="border-t border-slate-400 pt-0.5 text-[10px] font-bold text-slate-700">
                            Headmistress / Principal
                          </div>
                          <div className="text-[9px] text-slate-400">Wisdom Nursery & Primary School</div>
                        </div>
                      </div>
                    </div>

                    {/* Cut Slip for Parents / Office Copy */}
                    <div className="mt-4 pt-2 border-t-2 border-dashed border-slate-300 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>✂ Cut along dashed line • Student Copy / Office Record Slip</span>
                      <span className="font-mono">WES-SLIP-{student.rollNo} • ESSUR-603310</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
