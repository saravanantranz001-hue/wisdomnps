import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Users,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { Student } from '../types';
import {
  ParsedStudentRow,
  parseExcelOrCsvFile,
  parsePastedTableText,
  downloadStudentImportTemplate
} from '../utils/excelUtils';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportStudents: (newStudents: Student[], mode: 'append' | 'replace') => void;
  existingCount: number;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  onImportStudents,
  existingCount,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setLoading(true);
    setErrorMessage(null);
    setFileName(file.name);
    try {
      const rows = await parseExcelOrCsvFile(file);
      if (rows.length === 0) {
        setErrorMessage('No student records found in this file. Please verify column headers.');
      } else {
        setParsedRows(rows);
      }
    } catch (err: any) {
      setErrorMessage(`Failed to read Excel file: ${err.message || 'Corrupted or unsupported format'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleParsePastedText = () => {
    setErrorMessage(null);
    if (!pastedText.trim()) {
      setErrorMessage('Please paste tabular student data from your spreadsheet first.');
      return;
    }
    const rows = parsePastedTableText(pastedText);
    if (rows.length === 0) {
      setErrorMessage('Could not parse any student rows. Ensure the first row has column headers (Name, Class, Phone, etc.).');
      return;
    }
    setParsedRows(rows);
  };

  const validRows = parsedRows.filter((r) => r.isValid);
  const invalidRows = parsedRows.filter((r) => !r.isValid);

  const handleConfirmImport = () => {
    if (validRows.length === 0) {
      setErrorMessage('No valid student rows to import.');
      return;
    }

    const studentsToImport: Student[] = validRows.map((r, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      admissionNo: r.admissionNo,
      name: r.name,
      rollNo: r.rollNo,
      className: r.className,
      section: r.section,
      gender: r.gender,
      parentName: r.parentName,
      parentPhone: r.parentPhone,
      parentGPay: r.parentGPay || r.parentPhone,
      address: r.address,
      admissionDate: new Date().toISOString().split('T')[0],
      bloodGroup: r.bloodGroup,
      feeStatus: r.feeStatus,
      totalFee: r.totalFee,
      paidFee: r.paidFee,
      pendingFee: r.pendingFee,
      attendanceRate: r.attendanceRate,
      usesVan: r.usesVan,
      vanRoute: r.vanRoute,
      vanStop: r.vanStop,
      vanFeeTotal: r.vanFeeTotal,
      vanFeePaid: r.vanFeePaid,
      vanFeePending: Math.max(0, (r.vanFeeTotal || 0) - (r.vanFeePaid || 0)),
      tuitionFeeTotal: r.totalFee,
      tuitionFeePaid: r.paidFee,
      tuitionFeePending: r.pendingFee,
    }));

    onImportStudents(studentsToImport, importMode);
    setSuccessCount(studentsToImport.length);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setParsedRows([]);
    setFileName(null);
    setPastedText('');
    setErrorMessage(null);
    setSuccessCount(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-blue-900 text-white p-5 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Import Students from Excel / CSV
                </h3>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Bulk Import
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Wisdom Nursery & Primary School - Essur • Upload .xlsx, .xls or Paste Data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadStudentImportTemplate}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Download pre-filled Excel template"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Download Excel Template</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successCount !== null && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs font-bold">
              Successfully imported {successCount} student{successCount === 1 ? '' : 's'} into Wisdom School Directory!
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {parsedRows.length === 0 ? (
            <>
              {/* Method Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      activeTab === 'upload'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Excel / CSV File</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('paste')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      activeTab === 'paste'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Copy & Paste Spreadsheet</span>
                  </button>
                </div>

                <button
                  onClick={downloadStudentImportTemplate}
                  className="sm:hidden text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Excel Template</span>
                </button>
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800">
                    {loading ? 'Processing Excel File...' : 'Click to Upload or Drag & Drop'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv).
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-emerald-800 font-bold">
                    <Download className="w-3.5 h-3.5" />
                    <span onClick={(e) => { e.stopPropagation(); downloadStudentImportTemplate(); }} className="hover:underline">
                      Need the standard format? Download Sample Template
                    </span>
                  </div>
                </div>
              )}

              {/* Paste Tab */}
              {activeTab === 'paste' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Copy cells directly from Excel or Google Sheets (including header row) and paste below:
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Tab/Comma Delimited</span>
                  </div>
                  <textarea
                    rows={8}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Admission No&#9;Student Name&#9;Class&#9;Section&#9;Gender&#9;Roll No&#9;Parent Name&#9;Parent Phone&#9;Total Fee&#9;Paid Fee&#9;Uses Van&#10;WES/2025/101&#9;Aavya K&#9;Nursery&#9;A&#9;Girl&#9;1&#9;Karthik S&#9;9840123456&#9;15000&#9;8000&#9;Yes&#10;WES/2025/102&#9;Bhuvan M&#9;LKG&#9;A&#9;Boy&#9;2&#9;Murugan K&#9;9840987654&#9;16000&#9;16000&#9;No"
                    className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleParsePastedText}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Parse Pasted Data</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Supported Columns Guide */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Recognized Columns in Excel:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    'Student Name (Required)',
                    'Class (Nursery - Class 5)',
                    'Section (A/B)',
                    'Parent Phone (Required)',
                    'Admission No',
                    'Roll No',
                    'Gender (Boy/Girl)',
                    'Parent Name',
                    'GPay / UPI',
                    'Address',
                    'Blood Group',
                    'Total Fee',
                    'Paid Fee',
                    'Uses Van (Yes/No)',
                    'Van Route',
                    'Van Stop',
                    'Van Fee',
                  ].map((col) => (
                    <span
                      key={col}
                      className={`px-2 py-0.5 rounded-md font-medium border ${
                        col.includes('Required')
                          ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Parsed Data Preview & Confirmation Table */
            <div className="space-y-4">
              {/* Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">
                      File: {fileName || 'Pasted Spreadsheet Data'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {validRows.length} Valid Records Ready
                    </span>
                    {invalidRows.length > 0 && (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {invalidRows.length} Issues Detected
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Upload Different File</span>
                  </button>
                </div>
              </div>

              {/* Import Mode: Append or Replace */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-amber-900">Import Destination Mode:</span>
                  <p className="text-slate-600 text-[11px]">
                    Current active directory has <strong className="text-slate-800">{existingCount} students</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800">Append (Add to existing)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer ml-3">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-bold text-rose-700">Overwrite & Replace All</span>
                  </label>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Adm No</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Class - Sec</th>
                      <th className="p-2.5">Parent & Phone</th>
                      <th className="p-2.5">Total Fee</th>
                      <th className="p-2.5">Paid Fee</th>
                      <th className="p-2.5">Van</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={row.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/50 hover:bg-rose-50'}
                      >
                        <td className="p-2.5">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full"
                              title={row.validationErrors.join(', ')}
                            >
                              <AlertCircle className="w-3 h-3" /> Error
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-slate-600">{row.admissionNo}</td>
                        <td className="p-2.5 font-bold text-slate-900">{row.name}</td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px]">
                            {row.className} - {row.section}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-800">{row.parentName}</div>
                          <div className="text-[10px] text-slate-500">{row.parentPhone}</div>
                        </td>
                        <td className="p-2.5 font-medium text-slate-800">₹{row.totalFee.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 font-bold text-emerald-700">₹{row.paidFee.toLocaleString('en-IN')}</td>
                        <td className="p-2.5">
                          {row.usesVan ? (
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                              Van ({row.vanRoute || 'Yes'})
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Self</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {parsedRows.length > 0 ? (
            <button
              onClick={handleConfirmImport}
              disabled={validRows.length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Confirm & Import {validRows.length} Student{validRows.length === 1 ? '' : 's'}
              </span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 italic">
              Select or paste your Excel spreadsheet to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
